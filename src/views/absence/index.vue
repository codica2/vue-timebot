<template lang="pug">
    div
      div(class="timebot-header") Absence
      absenceTable
</template>

<script>
import absenceTable from './absenceTable'
export default {
  name: 'Absense',
  components: {
    absenceTable
  },
  data: () => ({
  })
}
</script>
<style lang="scss" scoped>
</style>
