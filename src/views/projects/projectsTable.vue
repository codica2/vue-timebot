<template lang="pug">
  div
    el-dropdown.dropdown(@command="multipleDelete")
      el-button.el-button-filter Batch actions
        i.el-icon-arrow-down.el-icon--right
      el-dropdown-menu(slot="dropdown")
        el-dropdown-item(command="delete_multiple", :disabled="!multipleSelection.length") Delete
    div
      div(style="display: flex")
        div(class="position-create-new-category")
          el-button(@click="handleCreate",
          class="filter-item create-new-category",
          type="primary") Add new project
      el-table(
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        :key="tableKey"
        :data="list(type)"
        border
        fit
        highlight-current-row
        style="width: 100%;")
        el-table-column(type="selection" align="center" width="55")
        el-table-column(:label="$t('table.id')" align="center" width="65")
          template(slot-scope="scope")
            span {{ scope.row.id }}
        el-table-column(label="Name")
          template(slot-scope="scope")
            span {{ scope.row.name }}
        el-table-column(label="Alias")
          template(slot-scope="scope")
            span {{ scope.row.alias }}
        el-table-column(label="Team")
          template(slot-scope="scope")
            span {{setTeam(scope.row.team)}}
        el-table-column(label="Is Active")
          template(slot-scope="scope")
            span(v-if="scope.row['active']") YES
            span(v-else) NO
        el-table-column(:label="$t('table.actions')" width="230" class-name="small-padding fixed-width")
          template(slot-scope="scope")
            el-button(type="info" size="mini" @click="handleView(scope.row)") View
            el-button(type="primary" size="mini" @click="handleUpdate(scope.row)") {{ $t('table.edit') }}
            el-button(
            v-if="scope.row.status !== 'deleted'"
            size="mini"
            type="danger"
            @click="removeEntity(scope.row,'deleted')") {{ $t('table.delete') }}
      pagination(:type="type" v-if="list(type).length")

    el-dialog.el-dialog-edit(:class="{'el-dialog-create': dialogStatus === 'create'}" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible")
      el-form(ref="dataForm"
      :rules="rules"
      :model="temp"
      label-position="left"
      label-width="70px"
      style="width: 400px; margin-left:50px;")
        .el-dialog-edit-block
          el-form-item(label="Name" prop="name")
            el-input(placeholder="Please input" v-model="temp.name" clearable)
          el-form-item(label="Team" prop="team")
            el-select(v-if="temp.team" v-model="temp.team.id" placeholder="Select")
              el-option(v-for="team in list('teams')" :key="team.id" :label="team.name" :value="team.id")
            el-select(v-else v-model="temp.team" placeholder="Select")
              el-option(v-for="team in list('teams')" :key="team.id" :label="team.name" :value="team")
        .el-dialog-edit-block-status
          el-form-item(label="Status")
          el-checkbox(v-model="temp['active']") Is Active
        .el-dialog-edit-block-last
          div(slot="footer" class="dialog-footer")
            el-button(@click="dialogFormVisible = false") {{ $t('table.cancel') }}
            el-button(v-if="dialogStatus === 'create'" type="primary" :loading="dialogFormLoading" @click="create") {{ $t('table.confirm') }}
            el-button(v-else type="primary" :loading="dialogFormLoading" @click="update") Update

    el-dialog.el-dialog-view(:title="textMap[dialogStatus]" :visible.sync="dialogViewVisible")
      .el-dialog-flex
        .el-dialog-flex-block
          .el-dialog-flex-head Id
          .el-dialog-flex-subhead {{temp.id}}
        .el-dialog-flex-block
          .el-dialog-flex-head Name
          .el-dialog-flex-subhead {{temp.name}}
        .el-dialog-flex-block
          .el-dialog-flex-head Alias
          .el-dialog-flex-subhead {{temp.alias}}
        .el-dialog-flex-block
          .el-dialog-flex-head Status
          .el-dialog-flex-subhead
            span(v-if="temp['active']") Active
            span(v-else) Inactive
</template>

<script>
import { mapGetters } from 'vuex'
import * as mixin from '@/mixins/index'
import pagination from '@/components/Pagination/index'
export default {
  name: 'ProjectsTable',
  components: {
    pagination
  },
  mixins: [mixin.mixValidationRules, mixin.mixDialog, mixin.mixQuery],
  data() {
    return {
      multipleSelection: [],
      tableKey: 0,
      type: 'projects'
    }
  },
  computed: {
    ...mapGetters({
      list: 'actionEntityTable/list'
    }),
    entity() {
      return {
        name: this.temp.name,
        alias: this.temp.alias,
        team_id: this.temp.team ? this.temp.team.id : ''
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
        project: this.entity
      }
      this.createEntity(entity)
    },
    update() {
      const entity = {
        id: this.temp.id,
        project: this.entity
      }
      this.updateEntity(entity)
    },
    delete() {
      const entity = {
        project_ids: this.multipleSelection
      }
      return entity
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

<style lang="scss" scoped>
  .el-dropdown-link {
    cursor: pointer;
    color: #409eff;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
