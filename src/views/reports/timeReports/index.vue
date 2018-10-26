<template lang="pug">
  div(v-loading="loader")
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
      div(class="time-entries-filters")
        div(class="filters-label-csv")
          download-excel(v-show="groupedData.length" :data="jsonData" :fields="json_fields" type="csv" name="time-reports.xls")
            el-button() Download CSV
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
          span(v-for="trelloLabels in scope.row['trello-labels']") {{ trelloLabels }}&nbsp;
      el-table-column(label="Time spentu" width="110")
        template(slot-scope="scope")
          span {{ scope.row.time }}
      el-table-column(label="Total time" width="110")
        template(slot-scope="scope")
          span {{ scope.row.total_time }}
</template>
<script>
import * as mixin from '@/mixins/index'
import { mapGetters } from 'vuex'
import treeToArray from '@/components/TreeTable/timeEntries'
import treeTable from '@/components/TreeTable/index'
export default {
  name: 'TimeReports',
  components: {
    treeTable
  },
  mixins: [mixin.mixQuery, mixin.mixIncludes, mixin.mixDate],
  data: () => ({
    type: 'timeReports',
    func: treeToArray,
    args: [null, null, 'timeLine'],
    searchParams: {
      projects: '',
      type: 'user'
    },
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
    groupedData: [],
    treeData: [],
    json_fields: {
      'Collaborators': 'collaborators',
      'Date': 'date',
      'Details': 'details',
      'Time': 'time',
      'Trello labels': 'trello-labels',
      'Estimated time': 'estimated-time',
      'Total time': 'total_time'
    },
    jsonData: []
  }),
  computed: {
    ...mapGetters({
      list: 'actionEntityTable/list',
      loader: 'actionEntityTable/loader',
      filterable: 'actionEntityTable/filterable',
      included: 'actionEntityTable/included'
    })
  },
  mounted() {
    this.getTimeReports()
  },
  methods: {
    getIncluded(id) {
      if (this.included('time-entries')) {
        const findInclude = this.included('time-entries').find(pj => {
          if (pj.id === id) return pj
        })
        if (findInclude) {
          return findInclude.name
        }
      }
    },
    getTimeReports() {
      if (this.date === null) {
        this.date = [new Date(), new Date()]
      }
      this.$store.dispatch('actionEntityTable/setFilter', { by_projects: [this.searchParams.projects], date_from: this.date[0], date_to: this.date[1] })
        .then(() => {
          this.$store.dispatch('setPagination', { limit: 100 }, { root: true })
            .then(() => {
              this.$store.dispatch('actionEntityTable/setLoader', true)
              if (this.searchParams.projects) {
                this.$store.dispatch('actionEntityTable/fetchList', 'time-entries')
                  .then(() => {
                    this.createTreeData()
                  })
                  .finally(() => {
                    this.$store.dispatch('actionEntityTable/setLoader', false)
                  })
              } else {
                this.$store.dispatch('actionEntityTable/setLoader', false)
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
    groupTreeData() {
      let data = []
      data = this.list('time-entries').slice()
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
              const dec = parseInt((arrTime[1]/6)*10, 10)
              time = parseFloat(parseInt(arrTime[0], 10) + '.' + (dec < 10 ? '0' : '') + dec)
              allTime += time
              item.time = time.toFixed(2)
              if (!collaborators.find(cl => cl.id === item.user.id)) {
                item.user.name = this.getIncluded(item.user.id)
                date.push(item.date)
                collaborators.push(item.user)
              }
            })
            const data = {
              id: grouped[key][0].id,
              type: grouped[key][0].type,
              date: date,
              'estimated-time': grouped[key][0]['estimated-time'],
              time: `${time}`,
              collaborators: collaborators
            }
            data.time = allTime.toFixed(2)
            if (this.searchParams.type === 'user') {
              data.time_entries = grouped[key]
            } else {
              data.details = grouped[key][0].details
              data['trello-labels'] = grouped[key][0]['trello-labels']
            }
            newData.push(data)
          }
          this.groupedData = newData
        }
      } else {
        this.groupedData = []
      }
    },
    createTreeData() {
      this.groupTreeData()
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
      const jsonData = JSON.parse(JSON.stringify([...this.groupedData]))
      jsonData.forEach(jd => {
        let q = ''
        jd.collaborators.forEach(cl => {
          q += cl.name + ' '
        })
        jd.collaborators = q
      })
      this.jsonData = jsonData
    }
  }
}
</script>

<style lang="scss" scoped>
  .collaborators-container {
    display: flex;
    flex-direction: column;
  }
</style>
