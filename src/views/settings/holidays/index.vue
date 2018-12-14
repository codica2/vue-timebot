<template lang="pug">
  div()
    div(class="timebot-header") Holidays
    filters
    holidaysTable
</template>

<script>
import holidaysTable from './holidaysTable'
import filters from './filters'
import { mapGetters } from 'vuex'
export default {
  name: 'Holidays',
  components: {
    holidaysTable,
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
