<template lang="pug">
  div Filters
    div
      el-select(
      v-model="searchParams.users",
      filterable,
      remote,
      @focus="remoteGetUsers"
      multiple,
      placeholder="Please enter a keyword"
      :remote-method="remoteGetUsers"
      :loading="loading"
      )
        el-option(
        v-for="user in list('users')"
        :key="user.id"
        :label="user.name"
        :value="user.id"
        )
    div
      el-select(
      v-model="searchParams.projects"
      filterable
      remote,
      multiple,
      @focus="remoteGetProjects"
      placeholder="Please enter a keyword"
      :remote-method="remoteGetProjects"
      )
        el-option(v-for="project in list('projects')"
        :value="project.id"
        :key="project.id",
        :label="project.name")
    div(v-for="(textarea, textareaIndex) in searchParams.textareas" :key="textareaIndex")
      el-input(type="textarea" v-model="textarea.input")
    el-date-picker(v-model="searchParams.searchDate" type="daterange" range-separator="To" start-placeholder="Start date"
    end-placeholder="End date")
    div
      el-button(@click="filter") Filter
      el-button(type="primary") Clear Filters
</template>

<script>
import { mapGetters } from 'vuex'
import * as mixin from '@/mixins/index'
export default {
  name: 'Filters',
  mixins: [mixin.mixQuery, mixin.mixIncludes],
  data: () => ({
    loading: false,
    searchParams: {
      textareas: [
        { input: '' }
      ],
      searchDate: [],
      users: [],
      projects: []
    }
  }),
  computed: {
    ...mapGetters({
      list: 'actionEntityTable/list'
    })
  },
  methods: {
    filter() {
        this.$store.dispatch('')
    }
  }
}
</script>

<style scoped>

</style>
