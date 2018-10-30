<template lang="pug">
    div
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
    })
  }
}
</script>
<style lang="scss" scoped>
</style>
