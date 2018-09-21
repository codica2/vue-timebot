<template lang="pug">
  div
    filters
    time-entries-table
</template>

<script>
  import filters from './filters'
  import timeEntriesTable from './time-entriesTable'
  export default {
    name: 'TimeEntries',
    data: () => ({
    }),
    components: {
      filters,
      timeEntriesTable
    },
}
</script>

<style lang="scss">
</style>
