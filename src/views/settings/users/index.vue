<template lang="pug">
    div()
      div(class="timebot-header") Users
      filters
      usersTable
</template>

<script>
import usersTable from './usersTable'
import filters from './filters'
import { mapGetters } from 'vuex'
export default {
  name: 'Users',
  components: {
    usersTable,
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

<style lang="scss">
</style>
