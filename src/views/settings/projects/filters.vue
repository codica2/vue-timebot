<template lang="pug">
  div(class="time-entries-filters-container")
    div(class="time-entries-filters")
      div(class="filters-label") Name
        el-select(
        v-model="searchParams.name"
        filterable
        remote,
        @focus="remoteGetProjects"
        clearable,
        @input="filter",
        placeholder="Please enter a keyword"
        :remote-method="remoteGetProjects"
        )
          el-option(
          v-for="project in filterable('projects')"
          :value="project.name"
          :key="project.id",
          :label="project.name")
    div(class="time-entries-filters")
      div(class="filters-label") Alias
        el-input(v-model="searchParams.alias" @input="filter")
    div(class="time-entries-filters-checkbox")
      div(class="filters-label") Status
      div(class="time-entries-checkbox")
        el-checkbox(v-model="searchParams.status" @input="filter") Is Active
    div(style="margin: 19px 0 0")
      el-button.el-button-clear-filter(@click="clearFilter" type="info") Clear Filters
</template>

<script>
import * as mixin from '@/mixins/index'
import { mapGetters } from 'vuex'
export default {
  name: 'Filters',
  mixins: [mixin.mixQuery, mixin.mixIncludes, mixin.mixDate],
  data: () => ({
    type: 'projects',
    searchParams: {
      date: [],
      name: '',
      alias: '',
      status: true
    },
    active: true
  }),
  computed: {
    ...mapGetters({
      filterable: 'actionEntityTable/filterable'
    }),
    entity() {
      return {
        by_name: this.searchParams.name,
        by_alias: this.searchParams.alias,
        active: this.searchParams.status
      }
    }
  },
  methods: {
    clearFilter() {
      this.searchParams = {
        data: [],
        name: '',
        alias: '',
        status: true
      }
      this.filter()
    }
  }
}
</script>

<style scoped>

</style>
