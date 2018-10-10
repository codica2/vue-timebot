<template lang="pug">
    div(v-loading="loader")
      div(class="timebot-header") Weekly
    div(class="time-entries-filters-container")
      div(class="time-entries-filters")
        div(class="filters-label") Date
          el-date-picker(
          v-model="date",
          type="daterange",
          range-separator="-",
          value-format="yyyy-MM-dd",
          start-placeholder="Start date",
          :picker-options="pickerOptions",
          @change="setDate"
          end-placeholder="End date")
      div(class="time-entries-filters")
        div(style="font-size: 14px;") Projects name
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
      tree-table(:data="treeData" :eval-func="func" :eval-args="args" border)
        el-table-column(label="Project")
          template(slot-scope="scope")
            span {{ scope.row.name }}
        el-table-column(label="Collaborators")
          template(slot-scope="scope")
            span {{ scope.row.collaborators }}
        el-table-column(label="Details")
          template(slot-scope="scope")
            span {{ scope.row.attributes.details }}
        el-table-column(label="Trello labels")
          template(slot-scope="scope")
            span(v-for="trelloLabels in scope.row.attributes['trello-labels']") {{ trelloLabels }}&nbsp;
        el-table-column(label="Time")
          template(slot-scope="scope")
            span {{ scope.row.attributes.time }}
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
    treeData: []
  }),
  computed: {
    ...mapGetters({
      list: 'actionEntityTable/list',
      loader: 'actionEntityTable/loader',
      filterable: 'actionEntityTable/filterable'
    })
  },
  mounted() {
    this.setDate()
  },
  methods: {
    setDate(date) {
      if (date === null) {
        this.date = [new Date(), new Date()]
      }
      this.$store.dispatch('actionEntityTable/setLoader', true)
      this.$store.dispatch('actionEntityTable/setFilter', { date_from: this.date[0], date_to: this.date[1] })
        .then(() => {
          this.$store.dispatch('actionEntityTable/setPagination', { limit: 100 })
            .then(() => {
              if (this.searchParams.projects) {
                this.getList()
                  .then(() => {
                    this.$store.dispatch('actionEntityTable/setLoader', false)
                    this.createTreeData()
                  })
              } else {
                this.$store.dispatch('actionEntityTable/setLoader', false)
              }
            })
        })
    },
    getTimeReports() {
      this.$store.dispatch('actionEntityTable/setFilter', { by_projects: [this.searchParams.projects] })
        .then(() => {
          this.$store.dispatch('actionEntityTable/setPagination', { limit: 100 })
            .then(() => {
              this.$store.dispatch('actionEntityTable/setLoader', true)
              this.$store.dispatch('actionEntityTable/fetchList', 'time-entries')
                .finally(() => {
                  this.$store.dispatch('actionEntityTable/setLoader', false)
                  this.createTreeData()
                })
            })
        })
    },
    createTreeData() {
      const data = this.list('time-entries').slice()
      let allMinutes = null
      let minutes = null
      data.forEach((item) => {
        const arrTime = item.attributes.time.split(':')
        allMinutes += +(arrTime[0] * 60) + +arrTime[1]
      })
      if ((allMinutes % 60) < 10) {
        minutes = `0${allMinutes % 60}`
      } else {
        minutes = allMinutes % 60
      }
      this.treeData = {
        name: this.filterable('projects').find(p => {
          if (p.id === this.searchParams.projects) return p
        }).name,
        time_entries: data,
        total_time: `${allMinutes / 60 | 0}:${minutes}`,
        attributes: {}
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
