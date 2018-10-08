<template lang="pug">
  div(class="time-entries-filters-container")
    div(class="filters-header") Filters
    div(class="time-entries-filters")
      div(style="font-size: 14px;") Users name
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
      div(style="font-size: 14px;") Projects name
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
    div.time-entries-filters
      div(style="font-size: 14px;") Details
        el-input(type="textarea" v-model="searchParams.ticket")
      div(style="font-size: 14px;") Date
      el-date-picker(
        format="yyyy-MM-dd"
        v-model="searchParams.date"
        type="daterange",
        range-separator="-",
        value-format="yyyy-MM-dd",
        start-placeholder="Start date",
        end-placeholder="End date",
        placeholder="Please pick a date")
    div(style="margin: 20px 0 10px;")
      div
        el-button(@click="filter") Filter
        el-button(@click="clearFilter" type="info") Clear Filters
</template>

<script>
import { mapGetters } from 'vuex'
import * as mixin from '@/mixins/index'
export default {
  name: 'Filters',
  mixins: [mixin.mixQuery, mixin.mixIncludes],
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
    }
  }
}
</script>
