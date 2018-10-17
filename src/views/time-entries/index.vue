<template lang="pug">
  div(v-loading="loader")
    div(class="timebot-header") Time entries
    filters
    time-entries-table
</template>

<script>
import filters from './filters'
import timeEntriesTable from './time-entriesTable'
import { mapGetters } from 'vuex'
export default {
  name: 'TimeEntries',
  components: {
    filters,
    timeEntriesTable
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
