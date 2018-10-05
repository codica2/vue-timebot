<template lang="pug">
  div Filters
    div(class="filters-header") Filters
    div(class="projects-filters")
      el-input(
        v-model="searchParams.holiday",
        placeholder="Please enter a keyword",
        clearable
      )
      div(style="margin: 10px 0;")
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
  methods: {
    clearFilter() {
      this.searchParams = {
        date: [],
        holiday: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
