<template lang="pug">
    div
      div(class="timebot-header") Admins
      adminsTable
</template>

<script>
import adminsTable from './adminsTable'
export default {
  name: 'Admins',
  components: {
    adminsTable
  }
}
</script>
<style lang="scss" scoped>

</style>
