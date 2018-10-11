<template lang="pug">
  div(class="time-entries-filters-container")
    div(class="time-entries-filters")
      div(class="filters-label") User name
        el-select(
          v-model="searchParams.user",
          filterable,
          remote,
          @focus="remoteGetUsers"
          clearable,
          placeholder="Please enter a user"
          :remote-method="remoteGetUsers"
        )
          el-option(
            v-for="user in filterable('users')"
            :key="user.id"
            :label="user.name"
            :value="user.name"
          )
    div
      div(class="filters-label") Status
      div(class="time-entries-checkbox")
        el-checkbox(v-model="searchParams.status") Is Active
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
  mixins: [mixin.mixQuery, mixin.mixIncludes],
  data: () => ({
    type: 'users',
    searchParams: {
      user: '',
      status: false
    }
  }),
  computed: {
    ...mapGetters({
      filterable: 'actionEntityTable/filterable'
    }),
    entity() {
      return {
        active_status: this.searchParams.status,
        by_name: this.searchParams.user
      }
    }
  },
  methods: {
    clearFilter() {
      this.searchParams = {
        user: '',
        status: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
