<template lang="pug">
  div(class="time-entries-filters-container")
    div(class="time-entries-filters")
      div(class="filters-label") Users name
        el-select(
          v-model="searchParams.users",
          filterable,
          remote,
          @focus="remoteGetUsers"
          multiple,
          placeholder="Please enter a users"
          :remote-method="remoteGetUsers"
        )
          el-option(
            v-for="user in filterable('users')"
            :key="user.id"
            :label="user.name"
            :value="user.id"
          )
    div(class="time-entries-filters")
      div(class="filters-label") Projects name
        el-select(
          v-model="searchParams.projects"
          filterable
          remote,
          multiple,
          @focus="remoteGetProjects"
          placeholder="Please enter a projects"
          :remote-method="remoteGetProjects"
        )
          el-option(v-for="project in filterable('projects')"
            :value="project.id"
            :key="project.id",
            :label="project.name")
    div(class="time-entries-filters")
      div(class="filters-label") Details
        el-input(type="textarea" v-model="searchParams.ticket")
    div(class="time-entries-filters")
      div(class="filters-label") Date
        el-date-picker(style="with:100%;"
          format="yyyy-MM-dd"
          v-model="searchParams.date"
          type="daterange",
          range-separator="-",
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd",
          start-placeholder="Start date",
          end-placeholder="End date",
          placeholder="Please pick a date",
          prefix-icon="date-calendar")
    div(style="margin: 19px 0 0")
      div
        el-button.el-button-filter(@click="filter") Filter
        el-button.el-button-clear-filter(@click="clearFilter" type="info") Clear Filters
</template>

<script>
import { mapGetters } from 'vuex'
import * as mixin from '@/mixins/index'
export default {
  name: 'Filters',
  mixins: [mixin.mixQuery, mixin.mixIncludes, mixin.mixDate],
  data: () => ({
    type: 'time-entries',
    searchParams: {
      ticket: '',
      date: [],
      users: [],
      projects: []
    }
  }),
  computed: {
    ...mapGetters({
      filterable: 'actionEntityTable/filterable'
    }),
    entity() {
      return {
        date_from: this.searchParams.date[0],
        date_to: this.searchParams.date[1],
        by_projects: this.searchParams.projects,
        by_users: this.searchParams.users,
        with_ticket: this.searchParams.ticket
      }
    }
  },
  methods: {
    clearFilter() {
      this.searchParams = {
        ticket: '',
        date: [],
        users: [],
        projects: []
      }
    },
    filter() {
      return new Promise((resolve, reject) => {
        this.$store.dispatch('actionEntityTable/setLoader', true)
        this.$store.dispatch('actionEntityTable/setFilter', this.entity)
          .then(() => {
            this.$store.dispatch('actionEntityTable/fetchList', this.type)
              .then(() => {
                if (this.searchParams.users.length || this.searchParams.projects.length) {
                  this.$store.dispatch('actionEntityTable/fetchWorkedTime', { type: 'worked_time', users: this.searchParams.users, projects: this.searchParams.projects })
                } else {
                  this.$store.commit('actionEntityTable/FETCH_WORKED_TIME', { data: [] })
                }
                resolve()
              })
              .finally(() => {
                this.$store.dispatch('actionEntityTable/setLoader', false)
              })
          })
      })
    }
  }
}
</script>
