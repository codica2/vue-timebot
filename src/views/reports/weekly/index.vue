<template lang="pug">
    div
      el-date-picker(
      v-model="date",
      :disabled="load",
      type="daterange",
      range-separator="-",
      value-format="yyyy-MM-dd",
      start-placeholder="Start date",
      :picker-options="pickerOptions",
      @change="setDate"
      end-placeholder="End date")
      div(class="timebot-header") Weekly
</template>
<script>
  import * as mixin from '@/mixins/index'
  import { mapGetters } from 'vuex'
  import pagination from '@/components/Pagination/index'
  export default {
    name: 'Weekly',
    components: {
      pagination
    },
    mixins: [mixin.mixQuery, mixin.mixIncludes, mixin.mixDate],
    data: () => ({
      type: 'timeReports',
      load: false
    }),
    computed: {
      ...mapGetters({
        list: 'actionEntityTable/list'
      })
    },
    mounted() {
      this.setDate()
    },
    methods: {
      setDate(date) {
        if (date === null) {
          this.date = [new Date(), new Date()]
        }
        this.load = true
        this.$store.dispatch('actionEntityTable/setFilter', { date_from: this.date[0], date_to: this.date[1] })
          .then(() => {
            this.getList()
              .then(() => {
                this.load = false
              })
          })
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
