<template lang="pug">
    div(v-loading="loader")
      div(class="timebot-header") Projects
      filters
      projectsTable
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
    ...mapGetters({
      list: 'actionEntityTable/list',
      loader: 'actionEntityTable/loader'
    })
  }
}
</script>

<style lang="scss" scoped>

</style>
