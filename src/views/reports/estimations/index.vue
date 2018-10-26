<template lang="pug">
  div(v-loading="loader")
    div(class="timebot-header") Estimations
    div(class="time-entries-filters-container")
      div(class="time-entries-filters")
        div(class="filters-label") Projects name
          el-select(
          v-model="searchParams.projects"
          filterable
          remote,
          @focus="remoteGetProjects"
          placeholder="Please enter a projects"
          @change="setParams"
          icon="arrow-up"
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
            :picker-options="pickerOptions",
            @change="setParams"
            start-placeholder="Start date",
            end-placeholder="End date",
            placeholder="Please pick a date",
            prefix-icon="date-calendar")
      div(class="time-entries-filters")
        div(class="filters-label-csv")
          download-excel(v-show="jsonData.length" :data="jsonData" :fields="json_fields" type="csv" name="time-reports.xls")
            el-button() Download CSV
    el-table(:data="list('estimationReports')")
      el-table-column(
      prop="project",
      label="Project",
      width="110")
        template(slot-scope="scope")
          span(v-for="project in scope.row.projects" :key="project.id") {{ project.name }}&nbsp;
      el-table-column(
      prop="details",
      label="Details")
      el-table-column(
      label="Collaborators")
        template(slot-scope="scope")
          span(v-for="collaborator in scope.row.collaborators" :key="collaborator.id") {{ collaborator.name }}&nbsp;
      el-table-column(
      prop="created_at",
      label="Created at",
      width="130")
      el-table-column(
      prop="trello_labels",
      label="Trello labels",
      width="150")
      el-table-column(
      prop="estimate",
      label="Estimate",
      width="90")
      el-table-column(
      prop="total_time",
      label="Time spent",
      width="110")
      el-table-column(
      prop="status",
      label="Status",
      width="100")
    pagination(:store="store" :type="type" v-if="list(type).length")
</template>

<script>
import * as mixin from '@/mixins/index'
import { mapGetters } from 'vuex'
import pagination from '@/components/Pagination/index'
export default {
  name: 'Estimations',
  components: {
    pagination
  },
  mixins: [mixin.mixQuery, mixin.mixIncludes, mixin.mixDate],
  data: () => ({
    type: 'estimationReports',
    store: 'reportsTable',
    searchParams: {
      projects: ''
    },
    json_fields: {
      'Project': 'project',
      'Details': 'details',
      'Collaborators': 'collaborators',
      'Created at': 'created_at',
      'Trello labels': 'trello_labels',
      'Estimate': 'estimate',
      'Total time': 'total_time',
      'Status': 'status'
    },
    jsonData: []
  }),
  computed: {
    ...mapGetters({
      list: 'reportsTable/list',
      filterable: 'actionEntityTable/filterable',
      loader: 'reportsTable/loader'
    })
  },
  mounted() {
    this.setParams()
  },
  methods: {
    getList() {
      return new Promise((resolve, reject) => {
        this.$store.dispatch('reportsTable/setLoader', true)
        this.$store.dispatch('reportsTable/fetchList', this.type)
          .then(() => {
            this.$store.dispatch('reportsTable/setLoader', false)
            resolve()
          })
      })
    },
    setParams(date) {
      if (date === null) {
        this.date = [new Date(), new Date()]
      }
      if (this.searchParams.projects) {
        this.$store.dispatch('reportsTable/setLoader', true)
        this.$store.dispatch('reportsTable/setFilter', { by_projects: [this.searchParams.projects], date_from: this.date[0], date_to: this.date[1] })
          .then(() => {
            this.getList()
              .then(() => {
                this.$store.dispatch('reportsTable/setLoader', false)
                this.getJsonStructure()
              })
          })
      }
    },
    getJsonStructure() {
      const jsonData = JSON.parse(JSON.stringify([...this.list('estimationReports')]))
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
</style>
