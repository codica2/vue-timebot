<template lang="pug">
  div(class="time-entries-filters-container")
    div(class="filters-header") Filters
      div(class="time-entries-filters")
        div(style="font-size: 14px;") User name
          el-select(
            v-model="searchParams.user",
            filterable,
            remote,
            @focus="remoteGetUsers"
            clearable,
            placeholder="Please select a user"
            :remote-method="remoteGetUsers"
          )
            el-option(
              v-for="user in filterable('users')"
              :key="user.id"
              :label="user.name"
              :value="user.id"
            )
      div
        div(style="font-size: 14px;") Project name
          el-select(
            v-model="searchParams.project"
            filterable
            remote,
            @focus="remoteGetProjects"
            clearable,
            placeholder="Please select a project"
            :remote-method="remoteGetProjects"
          )
            el-option(
              v-for="project in filterable('projects')"
              :value="project.id"
              :key="project.id",
              :label="project.name")
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
    type: 'teams',
    searchParams: {
      textareas: [
        { input: '' }
      ],
      user: '',
      project: ''
    }
  }),
  computed: {
    ...mapGetters({
      filterable: 'actionEntityTable/filterable'
    }),
    entity() {
      return {
        by_project: this.searchParams.project,
        by_user: this.searchParams.user
      }
    }
  },
  methods: {
    clearFilter() {
      this.searchParams = {
        date: [],
        user: '',
        project: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
