<template lang="pug">
  div(v-loading="loader")
    div(class="timebot-header") Estimations
    el-date-picker(
      v-model="date",
      type="daterange",
      range-separator="-",
      value-format="yyyy-MM-dd",
      start-placeholder="Start date",
      :picker-options="pickerOptions",
      @change="setDate"
      end-placeholder="End date")
    el-table(:data="list('estimationReports')")
      el-table-column(
      prop="project",
      label="Project")
      el-table-column(
      prop="details",
      label="Details")
      el-table-column(
      label="Collaborators")
        template(slot-scope="scope")
          span(v-for="collaborator in scope.row.collaborators" :key="collaborator.id") {{ collaborator.name }}&nbsp;
      el-table-column(
      prop="created_at",
      label="Created at")
      el-table-column(
      prop="trello_labels",
      label="Trello labels")
      el-table-column(
      prop="estimate",
      label="Estimate")
      el-table-column(
      prop="total_time",
      label="Total time")
      el-table-column(
      prop="status",
      label="Status")
    pagination(:type="type" v-if="list(type).length")
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
    type: 'estimationReports'
  }),
  computed: {
    ...mapGetters({
      list: 'actionEntityTable/list',
      loader: 'actionEntityTable/loader'
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
          this.getList()
            .then(() => {
              this.$store.dispatch('actionEntityTable/setLoader', false)
            })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
