<template lang="pug">
    div(v-loading="loader")
      div(class="timebot-header") Absence
      filters
      absenceTable
</template>

<script>
import absenceTable from './absenceTable'
import filters from './filters'
import { mapGetters } from 'vuex'
export default {
  name: 'Absense',
  components: {
    absenceTable,
    filters
  },
  data: () => ({
  }),
  computed: {
    ...mapGetters({
      loader: 'actionEntityTable/loader'
    })
  }
}
</script>
<style lang="scss" scoped>
</style>
