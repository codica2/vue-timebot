<template lang="pug">
  div(class="time-entries-filters-container")
    div(class="time-entries-filters")
      div(class="filters-label") Holiday name
        el-input(
          v-model="searchParams.holiday",
          placeholder="Please enter a holiday",
          clearable
        )
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
    type: 'holidays',
    searchParams: {
      date: [],
      holiday: ''
    }
  }),
  computed: {
    ...mapGetters({
      list: 'actionEntityTable/list'
    }),
    entity() {
      return {
        date_from: this.searchParams.date ? this.searchParams.date[0] : '',
        date_to: this.searchParams.date ? this.searchParams.date[1] : '',
        by_name: this.searchParams.holiday
      }
    }
  },
  mounted() {
    Object.assign(this.pickerOptions, { disabledDate() {} })
  },
  methods: {
    clearFilter() {
      this.searchParams = {
        date: [],
        holiday: ''
      }
      this.filter()
    }
  }
}
</script>

<style scoped>

</style>
