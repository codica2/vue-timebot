<template lang="pug">
  div
    div
      div(class="position-create-new-category")
        el-button(@click="handleCreate",
        class="filter-item create-new-category",
        type="primary") Add new user
      el-table(
      v-loading="loader"
      :key="tableKey"
      :data="list(type)"
      border
      fit
      @selection-change="handleSelectionChange"
      highlight-current-row
      style="width: 100%;")
        el-table-column(type="selection" align="center" width="55")
        el-table-column(:label="$t('table.id')" align="center" width="65")
          template(slot-scope="scope")
            span {{ scope.row.id }}
        el-table-column(label="Name")
          template(slot-scope="scope")
            span {{ scope.row.name }}
        el-table-column(label="Role")
          template(slot-scope="scope")
            span {{ scope.row.role }}
        el-table-column(label="Is Active")
          template(slot-scope="scope")
            span(v-if="scope.row['is-active']") YES
            span(v-else) NO
        el-table-column(label="Team")
          template(slot-scope="scope")
            span {{setTeam(scope.row.team)}}
        el-table-column(:label="$t('table.actions')" width="230" class-name="small-padding fixed-width")
          template(slot-scope="scope")
            el-button(type="info" size="mini" @click="handleView(scope.row)") View
            el-button(type="primary" size="mini" @click="handleUpdate(scope.row)") {{ $t('table.edit') }}
            el-button(v-if="scope.row.status !== 'deleted'" size="mini" type="danger" @click="removeEntity(scope.row,'deleted')") {{ $t('table.delete') }}
      pagination(:type="type" v-if="list(type).length")

      el-dialog.el-dialog-edit(:class="{'el-dialog-create': dialogStatus === 'create'}" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible")
        el-form(ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px")
          .el-dialog-edit-block
            el-form-item(label="Users name" prop="name" class="el-dialog-flex-head")
              el-input(v-model="temp.name")
            el-form-item(label="Role" prop="role")
              el-select(v-model="temp.role" placeholder="Select")
                el-option(v-for="item in roles" :key="item.value" :label="item.label" :value="item.value")
          .el-dialog-edit-block
            el-form-item(label="Team" prop="team")
              el-select(v-if="temp.team" v-model="temp.team.id" placeholder="Select")
                el-option(v-for="team in list('teams')" :key="team.id" :label="team.name" :value="team.id")
              el-select(v-else v-model="temp.team" placeholder="Select")
                el-option(v-for="team in list('teams')" :key="team.id" :label="team.name" :value="team")
          .el-dialog-edit-block-status
            el-form-item(label="Status")
            el-checkbox(v-model="temp['is-active']") Is Active
          .el-dialog-edit-block-last
            div(slot="footer" class="dialog-footer")
              el-button(@click="dialogFormVisible = false") {{ $t('table.cancel') }}
              el-button(v-if="dialogStatus === 'create'" :loading="dialogFormLoading" type="primary" @click="create") Create
              el-button(v-else type="primary" :loading="dialogFormLoading" @click="update") {{ $t('table.confirm') }}

      el-dialog.el-dialog-view(:title="textMap[dialogStatus]" :visible.sync="dialogViewVisible")
        .el-dialog-flex
          .el-dialog-flex-block
            .el-dialog-flex-head Users name
            .el-dialog-flex-subhead {{temp.name}}
          .el-dialog-flex-block
            .el-dialog-flex-head UID
            .el-dialog-flex-subhead {{temp.uid}}
          .el-dialog-flex-block
            .el-dialog-flex-head Team
            .el-dialog-flex-subhead {{setTeam(temp.team)}}
          .el-dialog-flex-block
            .el-dialog-flex-head Created at
            .el-dialog-flex-date
              .el-dialog-flex-subhead <img src="/static/icons/ic-calendar.svg"> {{temp['created-at']}}
              .el-dialog-flex-subhead <img src="/static/icons/ic-time-hover.svg"> {{temp['created-at']}}
          .el-dialog-flex-block
            .el-dialog-flex-head Status
            .el-dialog-flex-subhead
              span(v-if="temp['is-active']") Active
              span(v-else) Inactive
</template>

<script>
import { mapGetters } from 'vuex'
import * as mixin from '@/mixins/index'
import pagination from '@/components/Pagination/index'
export default {
  name: 'UsersTable',
  components: {
    pagination
  },
  mixins: [mixin.mixValidationRules, mixin.mixDialog, mixin.mixQuery],
  data() {
    return {
      multipleSelection: [],
      tableKey: 0,
      type: 'users',
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
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      list: 'actionEntityTable/list',
      loader: 'actionEntityTable/loader'
    }),
    entity() {
      return {
        name: this.temp.name,
        is_active: this.temp['is-active'],
        uid: this.temp.uid || this.temp.name,
        team_id: this.temp.team.id,
        role: this.temp.role
      }
    }
  },
  created() {
    this.getList()
      .then(() => {
        this.$store.dispatch('actionEntityTable/fetchList', 'teams')
      })
  },
  methods: {
    create() {
      const entity = {
        user: this.entity
      }
      this.createEntity(entity)
    },
    update() {
      const entity = {
        id: this.temp.id,
        user: this.entity
      }
      this.updateEntity(entity)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    setTeam(team) {
      if (team) {
        const findTeam = this.list('teams').find(tm => {
          if (tm.id === team.id) return tm
        })
        if (findTeam) {
          return findTeam.name
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
