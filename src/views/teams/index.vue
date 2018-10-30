<template lang="pug">
  div()
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
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
