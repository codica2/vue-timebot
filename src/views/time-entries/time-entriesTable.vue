<template lang="pug">
  div
    el-dropdown.dropdown(trigger="click" @command="multipleDelete")
      el-button.el-button-filter Batch actions
        i.el-icon-arrow-down.el-icon--right
      el-dropdown-menu(slot="dropdown")
        el-dropdown-item(command="delete_multiple", :disabled="!multipleSelection.length") Delete
    div
      div(class="position-create-new-category")
        el-button(@click="handleCreate",
        class="filter-item create-new-category",
        type="primary") Add new time entry
      el-table(
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
        el-table-column(label="User" width="140")
          template(slot-scope="scope")
            span {{ getIncluded(scope.row.user.id) }}
        el-table-column(label="Project" width="115")
          template(slot-scope="scope")
            span {{ getIncluded(scope.row.project.id) }}
        el-table-column(label="Date" width="100")
          template(slot-scope="scope")
            span {{ scope.row.date }}
        el-table-column(label="Time" width="70")
          template(slot-scope="scope")
            span {{ scope.row.time }}
        el-table-column(label="Details")
          template(slot-scope="scope")
            span() {{scope.row.details}}
        el-table-column(:label="$t('table.actions')" width="230" class-name="small-padding fixed-width")
          template(slot-scope="scope")
            div(style="text-align: center;")
              el-button(type="info" size="mini" @click="handleView(scope.row)") View
              el-button(type="primary" size="mini" @click="handleUpdate(scope.row)") {{ $t('table.edit') }}
              el-button(v-if="scope.row.status !== 'deleted'" size="mini" type="danger" @click="removeEntity(scope.row,'deleted')") {{ $t('table.delete') }}
      pagination(:type="type" v-if="list(type).length")

      el-dialog.el-dialog-edit(:class="{'el-dialog-create': dialogStatus === 'create'}" @open="preRemote" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible")
        el-form(ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;")
          .el-dialog-edit-block
            el-form-item(label="User" prop="user")
              el-select(
                v-model="temp.user.id",
                filterable,
                remote,
                @focus="remoteGetUsers"
                placeholder="Please enter a keyword"
                :remote-method="remoteGetUsers"
                :loading="loading"
              )
                el-option(
                  v-for="user in filterable('users')"
                  :key="user.id"
                  :label="user.name"
                  :value="user.id"
                )
            el-form-item(label="Project" prop="project")
              el-select(
                clearable,
                v-model="temp.project.id"
                filterable
                remote,
                @focus="remoteGetProjects"
                placeholder="Please enter a keyword"
                :remote-method="remoteGetProjects"
              )
                el-option(v-for="project in filterable('projects')"
                :value="project.id"
                :key="project.id",
                :label="project.name")
          .el-dialog-edit-block
            el-form-item(:label="$t('table.date')" prop="date")
              el-date-picker(
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                v-model="temp.date"
                type="date"
                placeholder="Please pick a date"
              )
            el-form-item(label="Time" prop="time")
              input.el-input__inner(v-mask="'##:##'" v-model="temp.time")
          .el-dialog-edit-block
            el-form-item(label="Details" prop="timestamp")
              el-input(v-model="temp.details" type="details" placeholder="Write smth")
          .el-dialog-edit-block-last
            div(slot="footer" class="dialog-footer")
              el-button(@click="dialogFormVisible = false") {{ $t('table.cancel') }}
              el-button(v-if="dialogStatus === 'create'" :loading="dialogFormLoading" type="primary" @click="create()") Create
              el-button(v-else type="primary" :loading="dialogFormLoading" @click="update") {{ $t('table.confirm') }}

      el-dialog.el-dialog-view(:title="textMap[dialogStatus]" :visible.sync="dialogViewVisible")
        .el-dialog-flex
          .el-dialog-flex-block
            .el-dialog-flex-head Id
            .el-dialog-flex-subhead {{temp.id}}
          .el-dialog-flex-block
            .el-dialog-flex-head User
            .el-dialog-flex-subhead {{getIncluded(temp.user.id)}}
          .el-dialog-flex-block
            .el-dialog-flex-head Date
            .el-dialog-flex-subhead {{temp.date}}
          .el-dialog-flex-block
            .el-dialog-flex-head Details
            .el-dialog-flex-subhead {{temp.details}}
          .el-dialog-flex-block
            .el-dialog-flex-head Time
            .el-dialog-flex-subhead {{temp.time}}
          .el-dialog-flex-block
            .el-dialog-flex-head Project
            .el-dialog-flex-subhead {{temp.project.id}}
          .el-dialog-flex-block
            .el-dialog-flex-head Ticket
            .el-dialog-flex-subhead {{temp.details}}
          .el-dialog-flex-block
            .el-dialog-flex-head Trello labels
            .el-dialog-flex-subhead {{temp['trello-labels']}}
</template>
<script>
import { mapGetters } from 'vuex'
import * as mixin from '@/mixins/index'
import pagination from '@/components/Pagination/index'
export default {
  name: 'TimeEntriesTable',
  components: {
    pagination
  },
  mixins: [mixin.mixValidationRules, mixin.mixDialog, mixin.mixQuery, mixin.mixIncludes],
  data: () => ({
    multipleSelection: [],
    tableKey: 0,
    type: 'time-entries',
    loading: false,
    jsonFields: {
      'user': {
        field: 'attributes.date',
        callback: (value) => {
          return `${value}`
        }
      }
    }
  }),
  computed: {
    ...mapGetters({
      list: 'actionEntityTable/list',
      included: 'actionEntityTable/included',
      filterable: 'actionEntityTable/filterable'
    }),
    entity() {
      return {
        date: this.temp.date,
        time: this.temp.time,
        details: this.temp.details,
        trello_labels: this.temp.trello_labels,
        user_id: this.temp.user ? this.temp.user.id : '',
        project_id: this.temp.project ? this.temp.project.id : ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    update() {
      const entity = {
        id: this.temp.id,
        time_entry: this.entity
      }
      this.updateEntity(entity)
    },
    create() {
      const entity = {
        time_entry: this.entity
      }
      this.createEntity(entity)
    },
    preRemote() {
      this.remoteGetProjects()
      this.remoteGetUsers()
    },
    delete() {
      const entity = {
        time_entry_ids: this.multipleSelection
      }
      return entity
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
