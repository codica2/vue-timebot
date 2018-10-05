<template lang="pug">
  div
    div(class="timebot-header") Holidays
    holidaysTable
</template>

<script>
import holidaysTable from './holidaysTable'
export default {
  name: 'Holidays',
  components: {
    holidaysTable
  },
  data: () => ({
  })
}
</script>
<style lang="scss" scoped>

</style>
