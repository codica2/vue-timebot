<template lang="pug">
    div(v-loading="loader")
      div(class="timebot-header") Projects
      filters
      projectsTable
      el-table(:data="tableData('tableData1').data" style="width: 100%")
        el-table-column(
        v-for="(row, rowIndex) in tableData('tableData1').data"
        :key="rowIndex"
        v-if="Object.keys(row)[rowIndex]"
        :prop="Object.keys(row)[rowIndex]",
        :label="Object.keys(row)[rowIndex][0].toUpperCase() + Object.keys(row)[rowIndex].slice(1)"
        width="180")
      tree-table(:data="tableData('tableData').data" :eval-func="func" :eval-args="args" border)
        el-table-column(label="Project")
          template(slot-scope="scope")
            span {{ scope.row.project }}
        el-table-column(label="Ticket")
          template(slot-scope="scope")
            span {{ scope.row.ticket }}
        el-table-column(label="Labels")
          template(slot-scope="scope")
            span {{ scope.row.labels }}
        el-table-column(label="Users worked on")
          template(slot-scope="scope")
            span {{ scope.row.users_worked_on }}
        el-table-column(label="Estimate")
          template(slot-scope="scope")
            span {{ scope.row.estimate }}
        el-table-column(label="Time")
          template(slot-scope="scope")
            span {{ scope.row.time }}
</template>

<script>
import { mixDate } from '@/mixins/index.js'
import { mapGetters } from 'vuex'
import treeToArray from '@/components/TreeTable/customEval'
import treeTable from '@/components/TreeTable/index'
import projectsTable from './projectsTable'
import filters from './filters'
export default {
  name: 'Projects',
  components: {
    treeTable,
    projectsTable,
    filters
  },
  mixins: [mixDate],
  data: () => ({
    type: 'dashboardChart',
    options: [
      {
        value: '1',
        label: 'Timebot'
      },
      {
        value: '2',
        label: 'Africar'
      }
    ],
    value: '',
    func: treeToArray,
    args: [null, null, 'timeLine']
  }),
  computed: {
    ...mapGetters([
      'tableData'
    ]),
    ...mapGetters({
      list: 'actionEntityTable/list',
      loader: 'actionEntityTable/loader'
    })
  }
}
</script>

<style lang="scss" scoped>

</style>
