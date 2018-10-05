<template lang="pug">
    div
      div(class="timebot-header") Teams
      teamsTable
</template>

<script>
import teamsTable from './teamsTable'
export default {
  name: 'Teams',
  components: {
    teamsTable
  },
  data: () => ({
  })
}
</script>

<style lang="scss" scoped>
</style>
