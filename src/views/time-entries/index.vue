<template lang="pug">
  div()
    div(class="timebot-header") Time entries
    filters
    div.time-entries-filters-bottom-head(v-if="structure.length") {{structure.title}}
      div(v-for="entity in structure" :key="entity.id")
          strong {{entity.name}}
          div(v-for="project in entity.projects" :key="project.id")
            | {{project.name}}: {{setHours(project.time_spent)}} hours {{setMinutes(project.time_spent)}} minutes
          strong Total: {{setHours(entity.total_time_spent)}} hours {{setMinutes(entity.total_time_spent)}} minutes
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
    type: 'time-entries'
  }),
  computed: {
    ...mapGetters({
      list: 'actionEntityTable/entity',
      filters: 'actionEntityTable/filters'
    }),
    structure() {
      let data = JSON.parse(JSON.stringify(this.list(this.type, 'worked_time'))) || []
      const newData = []
      if (this.filters.hasOwnProperty('by_users') && this.filters.hasOwnProperty('by_projects') && this.filters.by_projects.length && !this.filters.by_users.length) {
        this.filters.by_projects.forEach(fl => {
          const structure = {
            title: 'Users',
            projects: [],
            total_time_spent: 0
          }
          structure.id = fl
          data.forEach(item => {
            item.projects.forEach(p => {
              if (+structure.id === +p.id) {
                structure.name = p.name
                structure.total_time_spent += p.time_spent
                structure.total_time_spent.toFixed(2)
              }
            })
            if (item.projects.find(it => +it.id === +structure.id)) {
              structure.projects.push({
                id: item.id,
                name: item.name,
                time_spent: item.projects.find(it => +it.id === +structure.id).time_spent
              })
            }
          })
          structure.total_time_spent = structure.total_time_spent.toFixed(2)
          newData.push(structure)
        })
        data = newData
      } else if (this.filters.hasOwnProperty('by_users') && !this.filters.by_users.length) {
        data = []
      }
      return data
    }
  },
  beforeDestroy() {
    this.$store.commit('actionEntityTable/FETCH_WORKED_TIME', { data: [] })
  },
  methods: {
    setHours(time) {
      return Math.floor(time)
    },
    setMinutes(time) {
      const times = `${time}`.split('.')
      if (times[1]) {
        return Math.floor(Math.abs(+times[1]) / 100 * 60)
      } else {
        return '0'
      }
    }
  }
}
</script>

<style scoped>
[v-cloak] {
  display: none;
}
</style>
