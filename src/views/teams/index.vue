<template lang="pug">
  div
    div.timebot-header(v-loading="loader") Teams
    filters
    teamsTable
</template>

<script>
import teamsTable from './teamsTable'
import filters from './filters'
import { mapGetters } from 'vuex'
export default {
  name: 'Teams',
  components: {
    teamsTable,
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
