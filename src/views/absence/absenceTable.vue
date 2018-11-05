<template lang="pug">
  div
    el-dropdown.dropdown(@command="multipleDelete")
      el-button.el-button-filter Batch actions
        i.el-icon-arrow-down.el-icon--right
      el-dropdown-menu(slot="dropdown")
        el-dropdown-item(command="delete_multiple", :disabled="!multipleSelection.length") Delete
    div
      div(class="position-create-new-category")
        div
          el-button(@click="handleCreate",
          class="filter-item create-new-category",
          type="primary") Add new absence
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
            span {{ getIncluded(scope.row.user.id) }}
        el-table-column(label="Date")
          template(slot-scope="scope")
            span {{ scope.row.date }}
        el-table-column(label="Reason")
          template(slot-scope="scope")
            span {{ scope.row.reason }}
        el-table-column(label="Comment")
          template(slot-scope="scope")
            span {{ scope.row.comment }}
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

    el-dialog.el-dialog-edit(:class="{'el-dialog-create': dialogStatus === 'create'}" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @open="remoteGetUsers")
      el-form(ref="dataForm"
      :rules="rules"
      :model="temp"
      label-position="left"
      label-width="70px"
      style="width: 400px; margin-left:50px;"
      )
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
              clearable
            )
              el-option(
                v-for="user in filterable('users')"
                :key="user.id"
                :label="user.name"
                :value="user.id"
              )
          el-form-item(label="Date" prop="date")
            el-date-picker(
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              v-model="temp.date" type="date" placeholder="Please pick a date")
        .el-dialog-edit-block
          el-form-item(label="Reason" prop="reason")
            el-radio-group(v-model="temp.reason")
              el-radio(label="vacation") Vacation
              el-radio(label="illness") Illness
              el-radio(label="other") Other
          el-form-item(label="Comment" prop="comment")
            el-input(placeholder="Please input" v-model="temp.comment" clearable)
        .el-dialog-edit-block-last(style="margin-top: 20px")
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
          .el-dialog-flex-subhead {{getIncluded(temp.user.id)}}
        .el-dialog-flex-block
          .el-dialog-flex-head Date
          .el-dialog-flex-subhead {{temp.date}}
        .el-dialog-flex-block
          .el-dialog-flex-head Reason
          .el-dialog-flex-subhead {{temp.reason}}
        .el-dialog-flex-block
          .el-dialog-flex-head Comment
          .el-dialog-flex-subhead {{temp.comment}}
</template>

<script>
import { mapGetters } from 'vuex'
import * as mixin from '@/mixins/index'
import pagination from '@/components/Pagination/index'
export default {
  name: 'AbsenseTable',
  components: {
    pagination
  },
  mixins: [mixin.mixValidationRules, mixin.mixDialog, mixin.mixQuery, mixin.mixIncludes],
  data() {
    return {
      multipleSelection: [],
      tableKey: 0,
      type: 'absences',
      loading: false
    }
  },
  computed: {
    ...mapGetters({
      list: 'actionEntityTable/list',
      filterable: 'actionEntityTable/filterable',
      included: 'actionEntityTable/included'
    }),
    entity() {
      return {
        date: this.temp.date,
        reason: this.temp.reason,
        comment: this.temp.comment,
        user_id: this.temp.user ? this.temp.user.id : ''
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
        absence: this.entity
      }
      this.updateEntity(entity)
    },
    create() {
      const entity = {
        absence: this.entity
      }
      this.createEntity(entity)
    },
    delete() {
      const entity = {
        absence_ids: this.multipleSelection
      }
      return entity
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
