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
          @input="filterUsers",
          placeholder="Please enter a user"
          :remote-method="remoteGetUsers"
        )
          el-option(
            v-for="user in filterable('users')"
            :key="user.id"
            :label="user.name"
            :value="user.name"
          )
    div(class="time-entries-filters")
      div(class="filters-label") Role
        el-select(v-model="searchParams.role" placeholder="Select" clearable @input="filterUsers")
          el-option(v-for="item in roles" :key="item.value" :label="item.label" :value="item.value")
    div(class="time-entries-filters-checkbox")
      div(class="filters-label") Status
      div(class="time-entries-checkbox")
        el-checkbox(v-model="searchParams.status" @input="filterUsers") Is Active
    div(style="margin: 19px 0 0")
      div
        el-button.el-button-clear-filter(@click="clearFilter" type="info") Clear Filters
        el-button.sync(@click="syncUsers" type="info") Sync users
</template>

<script>
import * as Api from '@/api/actionEntityTable'
import { mapGetters } from 'vuex'
import * as mixin from '@/mixins/index'
export default {
  name: 'Filters',
  mixins: [mixin.mixQuery, mixin.mixIncludes],
  data: () => ({
    type: 'users',
    searchParams: {
      user: '',
      role: '',
      status: true
    },
    roles: [
      {
        label: 'Front-end',
        value: 'front_end'
      },
      {
        label: 'Design',
        value: 'design'
      },
      {
        label: 'PM',
        value: 'pm'
      },
      {
        label: 'QA',
        value: 'QA'
      },
      {
        label: 'OPS',
        value: 'ops'
      },
      {
        label: 'Marketing',
        value: 'marketing'
      },
      {
        label: 'Back-end',
        value: 'back_end'
      },
      {
        label: 'Not set',
        value: 'not_set'
      }
    ]
  }),
  computed: {
    ...mapGetters({
      filterable: 'actionEntityTable/filterable'
    }),
    entity() {
      return {
        active_status: this.searchParams.status,
        by_name: this.searchParams.user,
        by_role: this.searchParams.role
      }
    }
  },
  methods: {
    syncUsers() {
      this.$store.dispatch('setLoader', true)
      Api.syncUsers('/api/v1/users/sync_users')
        .then(res => {
          this.$notify({
            message: `Users were synced`,
            type: 'success'
          })
          this.filterUsers()
        })
        .catch(() => {
          this.$notify({
            message: 'Something went wrong',
            type: 'error',
            duration: 5 * 1000
          })
        })
    },
    filterUsers() {
      this.$store.dispatch('setPagination', { page: 1 }, { root: true })
        .then(() => {
          this.filter()
            .then(() => {
              this.$store.dispatch('actionEntityTable/fetchList', 'teams')
            })
        })
    },
    clearFilter() {
      this.searchParams = {
        user: '',
        status: ''
      }
      this.filterUsers()
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-button.sync {
    color: #fff;
    font-family: "Calibre-Medium", sans-serif;
    font-size: 17px;
    padding: 12px 20px 8px;
  }
</style>
