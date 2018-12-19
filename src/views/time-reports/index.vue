<template lang="pug">
  div()
    div(class="timebot-header") Weekly reports
    div(class="time-entries-filters-container")
      div(class="time-entries-filters")
        div(class="filters-label") Projects name
          el-select(
            v-model="searchParams.projects"
            filterable
            remote,
            clearable,
            multiple,
            @remove-tag="setQtyProjects"
            @focus="remoteGetProjects"
            @input="getTimeReports"
            placeholder="Please enter a project"
            :remote-method="remoteGetProjects"
          )
            el-option(v-for="project in filterable('projects')"
            :value="project.id"
            :key="project.id",
            :label="project.name")
      div(class="time-entries-filters")
        div(class="filters-label") Group by
          el-select(
          @input="getProjectsByPeriods"
          v-model="searchParams.type"
          )
            el-option(v-for="type in groupType"
            :value="type.value"
            :key="type.value",
            :label="type.name")
      div(class="time-entries-filters")
        div(class="filters-label") Date
          el-date-picker(
          v-model="date",
          type="daterange",
          range-separator="-",
          value-format="yyyy-MM-dd",
          start-placeholder="Start date",
          :picker-options="pickerOptions",
          @change="getProjectsByPeriods"
          end-placeholder="End date"
          prefix-icon="date-calendar")
      div(style="margin-right: 10px;")
        div(class="filters-label-csv")
          download-excel(:data="jsonData" :fields="json_fields" type="csv" name="weekly-reports.xls")
            el-button(:disabled="!jsonData.length" :loading="loadingStatus") Download CSV
      div(style="margin: 19px 0px 0px;" class="time-entries-filters")
        el-button.el-button-clear-filter.el-button--info(@click="clearFilter") Clear Filters
    tree-table(:data="treeData" :columns="columns" :eval-func="(searchParams.type === 'user') ? func : closeFunc" :eval-args="args" border)
      el-table-column(label="Date" width="150")
        template(slot-scope="scope")
          span(v-if="scope.row.date")
            strong(v-if="scope.row.date.length === 1") {{ scope.row.date[0] }}
            strong(v-else-if="typeof scope.row.date === 'string'") {{ scope.row.date }}
            span(v-else) from &nbsp;
              strong {{scope.row.date[scope.row.date.length - 1]}}
              span &nbsp; to &nbsp;
              strong {{scope.row.date[0] }}
      el-table-column(label="Collaborators" width="150")
        template(slot-scope="scope")
          div.collaborators-container
            span(v-for="(collaborator, collaboratorIndex) in scope.row.collaborators" :key="collaborator.id") {{ collaborator.name }}&nbsp;
      el-table-column(label="Details")
        template(slot-scope="scope")
          span {{ scope.row.details }}
      el-table-column(label="Trello labels" width="160")
        template(slot-scope="scope")
          .label-container
            span(v-if="scope.row['trello_labels']" v-for="label in typeof scope.row['trello_labels'] === 'string' ? scope.row['trello_labels'].split(', ') : []").label {{ label }}
      //- el-table-column(label="Estimate time" width="110")
      //-   template(slot-scope="scope")
      //-     span {{ scope.row['estimated-time'] }}
      el-table-column(label="Time spent" width="110")
        template(slot-scope="scope")
          span {{ scope.row.time }}
      el-table-column(label="Status" width="110")
        template(slot-scope="scope")
          .label-container
            span {{scope.row.status}}
      el-table-column(label="Total time" width="110")
        template(slot-scope="scope")
          span {{ scope.row.total_time }}
</template>
<script>
import * as mixin from '@/mixins/index'
import { mapGetters } from 'vuex'
import treeToArray from '@/components/TreeTable/timeEntries'
import closeFunc from '@/components/TreeTable/closeFunc'
import treeTable from '@/components/TreeTable/index'
export default {
  name: 'TimeReports',
  components: {
    treeTable
  },
  mixins: [mixin.mixQuery, mixin.mixIncludes, mixin.mixDate, mixin.mixEntities],
  data: () => ({
    qtyProjects: null,
    type: 'timeReports',
    func: treeToArray,
    closeFunc: closeFunc,
    args: [null, null, 'timeLine'],
    searchParams: {
      projects: [],
      type: 'details'
    },
    loadingStatus: false,
    store: 'reportsTable',
    groupType: [
      {
        name: 'Details',
        value: 'details'
      },
      {
        name: 'User',
        value: 'user'
      }
    ],
    columns: [
      {
        text: 'Project',
        value: 'name',
        width: '140'
      }
    ],
    AllEntities: [],
    groupedData: [],
    treeData: [],
    json_fields: {
      'Project': 'project',
      'Collaborators': 'collaborators',
      'Date': 'date',
      'Details': 'details',
      'Trello labels': 'trello_labels',
      'Time': 'time',
      'Status': 'status'
    },
    jsonData: [],
    projects: []
  }),
  computed: {
    ...mapGetters({
      list: 'reportsTable/list',
      filterable: 'actionEntityTable/filterable',
      included: 'actionEntityTable/included',
      filters: 'reportsTable/filters'
    })
  },
  mounted() {
    this.getProjectsByPeriods()
  },
  methods: {
    setQtyProjects() {
      this.qtyProjects = this.searchParams.projects.length
    },
    clearFilter() {
      this.date = []
      this.projects = []
      this.searchParams.projects = []
      this.$store.commit('reportsTable/FETCH_LIST', { data: [], type: this.type })
      this.$store.dispatch('reportsTable/setFilter', { by_projects: this.searchParams.projects, date_from: this.date[0], date_to: this.date[1] })
      this.setQtyProjects()
      this.getTimeReports()
      this.createTreeData()
    },
    getProjectsByPeriods() {
      this.$store.dispatch('setLoader', true)
      this.searchParams.projects = []
      if (this.date === null) {
        this.date = [new Date(), new Date()]
      }
      this.$store.dispatch('reportsTable/setFilter', { by_projects: this.searchParams.projects, date_from: this.date[0], date_to: this.date[1] })
        .then(() => {
          this.$store.dispatch('reportsTable/fetchList', this.type)
            .then(() => {
              this.projects = []
              this.list(this.type).forEach(entries => {
                this.projects.push(entries.project)
              })
              this.projects = this.lodash.uniqBy(this.projects, (item) => item.id)
              this.$store.commit('actionEntityTable/FETCH_ENTITY_BY_NAME', { data: [], type: 'projects' })
              this.$store.commit('actionEntityTable/FETCH_ENTITY_BY_NAME', { data: this.projects, type: 'projects' })
              this.projects.forEach(project => {
                this.searchParams.projects.push(project.id)
              })
              this.setQtyProjects()
              this.createTreeData()
              this.$store.dispatch('setLoader', false)
            })
        })
    },
    getTimeReports() {
      if (this.date === null) {
        this.date = [new Date(), new Date()]
      }
      if (this.qtyProjects > this.searchParams.projects.length) {
        this.createTreeData()
        return
      }
      this.loadingStatus = true
      this.AllEntities = []
      this.$store.dispatch('reportsTable/setFilter', { by_projects: this.searchParams.projects, date_from: this.date[0], date_to: this.date[1] })
        .then(() => {
          this.$store.dispatch('setLoader', true)
          if (this.searchParams.projects) {
            this.$store.dispatch('reportsTable/fetchList', this.type)
              .then(() => {
                this.setQtyProjects()
                this.createTreeData()
                this.$store.dispatch('setLoader', false)
                this.loadingStatus = false
              })
              .catch(() => {
                this.$store.dispatch('setLoader', false)
              })
          } else {
            this.$store.dispatch('setLoader', false)
          }
        })
    },
    groupByAttributes(xs, key) {
      return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x)
        return rv
      }, {})
    },
    groupByUser(xs, key) {
      return xs.reduce(function(rv, x) {
        (rv[x[key].id] = rv[x[key].id] || []).push(x)
        return rv
      }, {})
    },
    groupTreeData(id) {
      let data = []
      data = this.list(this.type).slice().filter(data => +data.project.id === +id)
      if (data.length) {
        const grouped = this.searchParams.type === 'user' ? this.groupByUser(data, this.searchParams.type) : this.groupByAttributes(data, this.searchParams.type)
        const newData = []
        for (const key in grouped) {
          let time = 0
          let allTime = 0
          const collaborators = []
          const date = []
          if (grouped.hasOwnProperty(key)) {
            grouped[key].forEach((item) => {
              time = +item.time
              const arrTime = item.time.split(':')
              if (arrTime.length > 1) {
                const dec = parseInt((arrTime[1] / 6) * 10, 10)
                time = parseFloat(parseInt(arrTime[0], 10) + '.' + (dec < 10 ? '0' : '') + dec)
              }
              allTime += time
              item.time = time.toFixed(2)
              item.details = item.details.replace(/;/g, ', ')
              item.details = item.details.replace(/	/g, ' ') // horizontal tab to space
              if (!collaborators.find(cl => cl.id === item.user.id)) {
                date.push(item.date)
                collaborators.push(item.user)
              }
            })
            const data = {
              id: grouped[key][0].id,
              date: date.join(', '),
              'estimated-time': grouped[key][0]['estimated-time'],
              time: `${time}`,
              collaborators: collaborators,
              status: grouped[key][0].status,
              project: grouped[key][0].project.name
            }
            data.time = allTime.toFixed(2)
            if (this.searchParams.type === 'user') {
              data.time_entries = grouped[key]
            } else {
              data.details = grouped[key][0].details
            }
            data['trello_labels'] = grouped[key][0]['trello_labels'] ? grouped[key][0]['trello_labels'].join(', ') : ''
            newData.push(data)
            newData.sort((a, b) => {
              const nameA = a.collaborators[0].name.toUpperCase()
              const nameB = b.collaborators[0].name.toUpperCase()
              if (nameA < nameB) {
                return -1
              }
              if (nameA > nameB) {
                return 1
              }
              return 0
            })
          }
          this.groupedData = newData
          this.AllEntities.push(...newData)
          this.loadingStatus = false
        }
      } else {
        this.groupedData = []
      }
    },
    createTreeData() {
      this.treeData = []
      this.groupedData = []
      this.AllEntities = []
      this.projects.find(p => {
        if (this.searchParams.projects.find(id => id === p.id)) {
          this.groupTreeData(p.id)
          let time = 0
          this.groupedData.forEach((item) => {
            time += +item.time
          })
          const structure = {
            name: p.name,
            time_entries: this.groupedData,
            total_time: `${time.toFixed(2)}`
          }
          this.treeData.push(JSON.parse(JSON.stringify(structure)))
        }
      })
      this.treeData.sort((a, b) => {
        return b.total_time - a.total_time
      })
      const jsonData = JSON.parse(JSON.stringify([...this.AllEntities]))
      jsonData.forEach(jd => {
        let q = ''
        jd.collaborators.forEach(cl => {
          q += cl.name + ', '
        })
        jd.collaborators = q.slice(0, -2)
      })
      this.jsonData = this.lodash.uniqBy(jsonData, (item) => item.id)
      if (this.searchParams.type === 'user') {
        const userData = []
        jsonData.forEach(jd => {
          jd.time_entries.forEach(te => {
            te.collaborators = te.user.name
            te.project = te.project.name
            userData.push(te)
          })
        })
        this.jsonData = this.lodash.uniqBy(userData, (item) => item.id)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .collaborators-container {
    display: flex;
    flex-direction: column;
  }
  .label-container {
    display: flex;
    flex-wrap: wrap;
    .label {
      border: 1px solid rgba(64, 158, 255, .2);
      border-radius: 4px;
      height: 32px;
      background-color: rgba(144, 147, 153, .1);
      border-color: rgba(144, 147, 153, .2);
      margin: 2px;
      padding: 5px;
    }
  }
</style>
