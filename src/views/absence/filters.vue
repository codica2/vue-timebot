<template lang="pug">
  div Filters
    div(class="filters-header") Filters
    div(class="projects-filters")
      div(style="font-size: 14px;") User name
        el-select(
          v-model="searchParams.user",
          filterable,
          remote,
          clearable,
          @focus="remoteGetUsers"
          placeholder="Please enter a keyword"
          :remote-method="remoteGetUsers"
        )
          el-option(
            v-for="user in filterable('users')"
            :key="user.id"
            :label="user.name"
            :value="user.id"
          )
      div(style="margin: 10px 0;")
        div(style="font-size: 14px;") Reason
          el-select(
          v-model="searchParams.reason"
          placeholder="Please select"
          )
            el-option(
            value=""
            label="Any")
            el-option(
            value="vacation"
            label="Vacation")
            el-option(
            value="illness"
            label="Illness")
            el-option(
            value="other"
            label="Other")
      div(style="margin: 10px 0;")
        div(style="font-size: 14px;") Date
        el-date-picker(
          format="yyyy-MM-dd"
          type="daterange",
          range-separator="-",
          value-format="yyyy-MM-dd"
          v-model="searchParams.date"
          :picker-options="pickerOptions",
          placeholder="Please pick a date")
      div
        el-button(@click="filter") Filter
        el-button(@click="clearFilter" type="info") Clear Filters
</template>

<script>
import { mapGetters } from 'vuex'
import * as mixin from '@/mixins/index'
export default {
  name: 'Filters',
  mixins: [mixin.mixQuery, mixin.mixIncludes, mixin.mixDate],
  data: () => ({
    type: 'absences',
    searchParams: {
      date: [],
      user: '',
      reason: ''
    }
  }),
  computed: {
    ...mapGetters({
      filterable: 'actionEntityTable/filterable'
    }),
    entity() {
      return {
        date_from: this.searchParams.date ? this.searchParams.date[0] : '',
        date_to: this.searchParams.date ? this.searchParams.date[1] : '',
        by_reason: this.searchParams.reason,
        by_user: this.searchParams.user
      }
    }
  },
  methods: {
    clearFilter() {
      this.searchParams = {
        date: [],
        user: '',
        reason: 'any'
      }
    }
  }
}
</script>

<style scoped>

</style>
