<template lang="pug">
    div(v-loading="loader")
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
      loader: 'actionEntityTable/loader'
    })
  }
}
</script>

<style lang="scss">
</style>
