<template lang="pug">
  div(v-loading="loader")
    div(class="timebot-header") Weekly
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
      el-table-column(label="Date")
        template(slot-scope="scope")
          span {{ scope.row.date }}
      el-table-column(label="Collaborators")
        template(slot-scope="scope")
          div.collaborators-container
            span(v-for="(collaborator, collaboratorIndex) in scope.row.collaborators" :key="collaborator.id") {{ collaborator.name }}&nbsp;
      el-table-column(label="Details")
        template(slot-scope="scope")
          span {{ scope.row.details }}
      el-table-column(label="Trello labels")
        template(slot-scope="scope")
          span(v-for="trelloLabels in scope.row['trello-labels']") {{ trelloLabels }}&nbsp;
      el-table-column(label="Time")
        template(slot-scope="scope")
          span {{ scope.row.time }}
      el-table-column(label="Total time")
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
      projects: ''
    },
    columns: [
      {
        text: 'Project',
        value: 'name'
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
          return findInclude.attributes.name
        }
      }
    },
    getTimeReports() {
      if (this.date === null) {
        this.date = [new Date(), new Date()]
      }
      this.$store.dispatch('actionEntityTable/setFilter', { by_projects: [this.searchParams.projects], date_from: this.date[0], date_to: this.date[1] })
        .then(() => {
          this.$store.dispatch('actionEntityTable/setPagination', { limit: 100 })
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
        (rv[x.attributes[key]] = rv[x.attributes[key]] || []).push(x)
        return rv
      }, {})
    },
    groupTreeData() {
      const data = this.list('time-entries').slice()
      const grouped = this.groupByAttributes(data, 'details')
      const newData = []
      for (const key in grouped) {
        let allMinutes = null
        let minutes = null
        const collaborators = []
        if (grouped.hasOwnProperty(key)) {
          grouped[key].forEach((item) => {
            const arrTime = item.attributes.time.split(':')
            allMinutes += +(arrTime[0] * 60) + +arrTime[1]
            if ((allMinutes % 60) < 10) {
              minutes = `0${allMinutes % 60}`
            } else {
              minutes = allMinutes % 60
            }
            if (!collaborators.find(cl => cl.id === item.relationships.user.data.id)) {
              item.relationships.user.data.name = this.getIncluded(item.relationships.user.data.id)
              collaborators.push(item.relationships.user.data)
            }
          })
          newData.push({
            id: grouped[key][0].id,
            type: grouped[key][0].type,
            date: grouped[key][0].attributes.date,
            details: grouped[key][0].attributes.details,
            'estimated-time': grouped[key][0].attributes['estimated-time'],
            time: `${allMinutes / 60 | 0}:${minutes}`,
            'trello-labels': grouped[key][0].attributes['trello-labels'],
            collaborators: collaborators
          })
        }
        this.groupedData = newData
      }
    },
    createTreeData() {
      this.groupTreeData()
      let allMinutes = null
      let minutes = null
      this.groupedData.forEach((item) => {
        const arrTime = item.time.split(':')
        allMinutes += +(arrTime[0] * 60) + +arrTime[1]
      })
      if ((allMinutes % 60) < 10) {
        minutes = `0${allMinutes % 60}`
      } else {
        minutes = allMinutes % 60
      }
      const structure = {
        name: this.filterable('projects').find(p => {
          if (p.id === this.searchParams.projects) return p
        }).name,
        time_entries: this.groupedData,
        total_time: `${allMinutes / 60 | 0}:${minutes}`
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
