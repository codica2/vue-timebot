<template lang="pug">
  div()
    div(class="timebot-header") Time reports
    div(class="time-entries-filters-container")
      div(class="time-entries-filters")
        div(class="filters-label") Projects name
          el-select(
            v-model="searchParams.projects"
            filterable
            remote,
            @focus="remoteGetProjects"
            placeholder="Please enter a projects"
            @change="getTimeReports"
            :remote-method="remoteGetProjects"
          )
            el-option(v-for="project in filterable('projects')"
            :value="project.id"
            :key="project.id",
            :label="project.name")
      div(class="time-entries-filters")
        div(class="filters-label") Filter by
          el-select(
          v-model="searchParams.type"
          @change="getTimeReports"
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
          @change="getTimeReports"
          end-placeholder="End date"
          prefix-icon="date-calendar")
      div(style="margin-right: 10px;")
        div(class="filters-label-csv")
          download-excel(:data="jsonData" :fields="json_fields" type="csv" name="time-reports.xls")
            el-button(:loading="!AllEntities.length") Download CSV
      div(style="margin: 19px 0px 0px;" class="time-entries-filters")
        el-button.el-button-filter(:disabled="!searchParams.projects.length" @click="getTimeReports") Filter
    tree-table(:data="treeData" :columns="columns" :eval-func="func" :eval-args="args" border)
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
            span(v-for="trelloLabels in scope.row['trello_labels']").label {{ trelloLabels }}&nbsp;
      el-table-column(label="Status" width="110")
        template(slot-scope="scope")
          .label-container
            span {{scope.row.status}}
      el-table-column(label="Estimate time" width="110")
        template(slot-scope="scope")
          span {{ scope.row['estimated-time'] }}
      el-table-column(label="Time spent" width="110")
        template(slot-scope="scope")
          span {{ scope.row.time }}
      el-table-column(label="Total time" width="110")
        template(slot-scope="scope")
          span {{ scope.row.total_time }}
    pagination(:store="'reportsTable'" :type="type" v-if="list(type).length")
</template>
<script>
import * as mixin from '@/mixins/index'
import { mapGetters } from 'vuex'
import treeToArray from '@/components/TreeTable/timeEntries'
import treeTable from '@/components/TreeTable/index'
import pagination from '@/components/Pagination/index'
import { fetchList } from '@/api/actionEntityTable'
import { setQuery } from '@/api/queryConst'
export default {
  name: 'TimeReports',
  components: {
    treeTable,
    pagination
  },
  mixins: [mixin.mixQuery, mixin.mixIncludes, mixin.mixDate, mixin.mixEntities],
  data: () => ({
    type: 'timeReports',
    func: treeToArray,
    args: [null, null, 'timeLine'],
    searchParams: {
      projects: '',
      type: 'user'
    },
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
        width: '120'
      }
    ],
    AllEntities: [],
    groupedData: [],
    treeData: [],
    json_fields: {
      'Collaborators': 'collaborators',
      'Date': 'date',
      'Details': 'details',
      'Trello labels': 'trello_labels',
      'Status': 'status',
      'Estimated time': 'estimated-time',
      'Time': 'time'
    },
    jsonData: []
  }),
  computed: {
    ...mapGetters({
      list: 'reportsTable/list',
      filterable: 'actionEntityTable/filterable',
      included: 'actionEntityTable/included',
      pagination: 'pagination',
      filters: 'reportsTable/filters'
    })
  },
  mounted() {
    this.$watch(vm => vm.list(this.type), () => {
      this.createTreeData()
    })
  },
  methods: {
    getTimeReports() {
      if (this.date === null) {
        this.date = [new Date(), new Date()]
      }
      this.AllEntities = []
      this.$store.dispatch('reportsTable/setFilter', { by_projects: [this.searchParams.projects], date_from: this.date[0], date_to: this.date[1] })
        .then(() => {
          this.$store.dispatch('setPagination', { page: 1, limit: 10 }, { root: true })
            .then(() => {
              this.$store.dispatch('setLoader', true)
              if (this.searchParams.projects) {
                this.$store.dispatch('reportsTable/fetchList', this.type)
                  .then(() => {
                    this.$store.dispatch('setLoader', false)
                    fetchList(setQuery(this.type), { per_page: this.pagination.total, ...this.filters })
                      .then((response) => {
                        this.AllEntities = response.data.data
                        this.createTreeData(true)
                      })
                  })
                  .catch(() => {
                    this.$store.dispatch('setLoader', false)
                  })
              } else {
                this.$store.dispatch('setLoader', false)
              }
            })
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
    groupTreeData(isAll) {
      let data = []
      data = isAll ? this.AllEntities.slice() : this.list(this.type).slice()
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
              const arrTime = item.time.split(':')
              const dec = parseInt((arrTime[1] / 6) * 10, 10)
              time = parseFloat(parseInt(arrTime[0], 10) + '.' + (dec < 10 ? '0' : '') + dec)
              allTime += time
              item.time = time.toFixed(2)
              item.details = item.details.replace(/;/g, ',')
              if (!collaborators.find(cl => cl.id === item.user.id)) {
                date.push(item.date)
                collaborators.push(item.user)
              }
            })
            const data = {
              id: grouped[key][0].id,
              date: date,
              'estimated-time': grouped[key][0]['estimated-time'],
              time: `${time}`,
              collaborators: collaborators,
              status: grouped[key][0].status
            }
            data.time = allTime.toFixed(2)
            if (this.searchParams.type === 'user') {
              data.time_entries = grouped[key]
            } else {
              data.details = grouped[key][0].details
            }
            data['trello_labels'] = grouped[key][0]['trello_labels']
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
          if (!isAll) {
            this.groupedData = newData
          } else {
            this.AllEntities = newData
          }
        }
      } else {
        this.groupedData = []
      }
    },
    createTreeData(isAll) {
      this.groupTreeData(isAll)
      let time = 0
      this.groupedData.forEach((item) => {
        time += +item.time
      })
      const structure = {
        name: this.filterable('projects').find(p => {
          if (p.id === this.searchParams.projects) return p
        }).name,
        time_entries: this.groupedData,
        total_time: `${time.toFixed(2)}`
      }
      this.treeData = JSON.parse(JSON.stringify(structure))
      const jsonData = JSON.parse(JSON.stringify([...this.AllEntities]))
      jsonData.forEach(jd => {
        let q = ''
        jd.collaborators.forEach(cl => {
          q += cl.name + ', '
        })
        jd.collaborators = q
      })
      this.jsonData = jsonData
      if (this.searchParams.type === 'user') {
        const userData = []
        jsonData.forEach(jd => {
          jd.time_entries.forEach(te => {
            te.collaborators = te.user.name
            userData.push(te)
          })
        })
        this.jsonData = userData
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
