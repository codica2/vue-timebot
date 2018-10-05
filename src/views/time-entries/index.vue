<template lang="pug">
  div
    div(class="timebot-header") Time entries
    filters
    time-entries-table
</template>

<script>
import filters from './filters'
import timeEntriesTable from './time-entriesTable'
export default {
  name: 'TimeEntries',
  components: {
    filters,
    timeEntriesTable
  },
  data: () => ({
  })
}
</script>
