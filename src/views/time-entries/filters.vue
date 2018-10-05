<template lang="pug">
  div(class="time-entries-filters-container")
    div(class="filters-header") Filters
    div(class="time-entries-filters")
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
    div(class="time-entries-filters")
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
    div(class="time-entries-filters")(v-for="(textarea, textareaIndex) in searchParams.textareas" :key="textareaIndex")
      el-input(type="textarea" v-model="textarea.input")
    el-date-picker(
    format="yyyy-MM-dd"
    value-format="yyyy-MM-dd"
    v-model="searchParams.date"
    type="date"
    placeholder="Please pick a date")
    div(style="margin: 20px 0 10px;")
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
    type: 'time-entries',
    searchParams: {
      textareas: [
        { input: '' }
      ],
      date: [],
      users: [],
      projects: []
    }
  }),
  computed: {
    ...mapGetters({
      list: 'actionEntityTable/list'
    }),
    entity() {
      return {
        date_from: this.searchParams.date[0],
        date_to: this.searchParams.date[1],
        by_projects: this.searchParams.projects,
        by_users: this.searchParams.users
      }
    }
  },
  methods: {
    filter() {
      this.$store.dispatch('actionEntityTable/setFilter', this.entity)
        .then(() => {
          this.$store.dispatch('actionEntityTable/fetchList', this.type)
        })
    }
  }
}
</script>
