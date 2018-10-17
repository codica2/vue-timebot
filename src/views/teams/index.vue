<template lang="pug">
  div(v-loading="loader")
    div.timebot-header Teams
    teamsTable
</template>

<script>
import teamsTable from './teamsTable'
import { mapGetters } from 'vuex'
export default {
  name: 'Teams',
  components: {
    teamsTable
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
