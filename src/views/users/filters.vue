<template lang="pug">
  div(class="time-entries-filters-container")
    div(class="filters-header") Filters
      div(class="time-entries-filters")
        el-select(
          v-model="searchParams.user",
          filterable,
          remote,
          @focus="remoteGetUsers"
          clearable,
          placeholder="Please enter a keyword"
          :remote-method="remoteGetUsers"
        )
          el-option(
            v-for="user in filterable('users')"
            :key="user.id"
            :label="user.name"
            :value="user.name"
          )
      div
        el-checkbox(v-model="searchParams.status") Is Active
      div(style="margin: 20px 0 10px;")
        div
          el-button(@click="filter") Filter
          el-button(@click="clearFilter" type="primary") Clear Filters
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
