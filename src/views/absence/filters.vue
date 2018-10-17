<template lang="pug">
  div(class="time-entries-filters-container")
    div(class="time-entries-filters")
      div(class="filters-label") User name
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

    div(class="time-entries-filters")
      div(class="filters-label") Reason
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
    div(class="time-entries-filters")
      div(class="filters-label") Date
      el-date-picker(
        format="yyyy-MM-dd"
        type="daterange",
        range-separator="-",
        value-format="yyyy-MM-dd"
        v-model="searchParams.date"
        :picker-options="pickerOptions",
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
