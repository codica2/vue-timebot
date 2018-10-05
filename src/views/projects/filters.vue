<template lang="pug">
  div
    div(class="filters-header") Filters
    div(class="projects-filters")
      div
        div(style="margin: 10px 0;")
          div(style="font-size: 14px;") Name
          el-select(
          v-model="searchParams.name"
          filterable
          remote,
          @focus="remoteGetProjects"
          clearable,
          placeholder="Please enter a keyword"
          :remote-method="remoteGetProjects"
          )
            el-option(
            v-for="project in filterable('projects')"
            :value="project.name"
            :key="project.id",
            :label="project.name")
          el-input(v-model="filter.name.input")
      div
        div(style="margin: 10px 0;")
          div(style="font-size: 14px;") Alias
            el-input(v-model="searchParams.alias")
          el-input(v-model="filter.alias.input")
    div(style="margin: 10px 0;")
      el-button() Filter
      el-button(@click="clearFilter") Clear Filter
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
      alias: ''
    }
  }),
  computed: {
    ...mapGetters({
      filterable: 'actionEntityTable/filterable'
    }),
    entity() {
      return {
        by_name: this.searchParams.name,
        by_alias: this.searchParams.alias
      }
    }
  },
  methods: {
    clearFilter() {
      this.searchParams = {
        data: [],
        name: '',
        alias: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
