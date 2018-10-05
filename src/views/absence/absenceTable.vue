<template lang="pug">
  div
    div
      div(style="display: flex")
        <!--div-->
        <!--el-dropdown(type="primary")-->
        <!--span.el-dropdown-link Batch Actions-->
        <!--el-dropdown-menu(slot="dropdown")-->
        <!--el-dropdown-item(:disabled="multipleSelection.length <= 0") Delete selected-->
        div
          el-button(@click="handleCreate",
          class="filter-item",
          style="margin: 10px 0 20px;",
          type="primary",
          icon="el-icon-edit") Add new project
      el-table(
      ref="multipleTable"
      @selection-change="handleSelectionChange"
      v-loading="listLoading"
      :key="tableKey"
      :data="list(type)"
      border
      fit
      highlight-current-row
      style="width: 100%;")
        el-table-column(type="selection", width="55")
        el-table-column(:label="$t('table.id')" align="center" width="65")
          template(slot-scope="scope")
            span {{ scope.row.id }}
        el-table-column(label="Name")
          template(slot-scope="scope")
            span {{ getIncluded(scope.row.relationships.user.data.id) }}
        el-table-column(label="Date")
          template(slot-scope="scope")
            span {{ scope.row.attributes.date }}
        el-table-column(label="Reason")
          template(slot-scope="scope")
            span {{ scope.row.attributes.reason }}
        el-table-column(label="Comment")
          template(slot-scope="scope")
            span {{ scope.row.attributes.comment }}
        el-table-column(:label="$t('table.actions')"
        align="center" width="230" class-name="small-padding fixed-width")
          template(slot-scope="scope")
            el-button(type="primary" size="mini" @click="handleView(scope.row)") View
            el-button(type="primary" size="mini" @click="handleUpdate(scope.row)") {{ $t('table.edit') }}
            el-button(
            v-if="scope.row.status !== 'deleted'"
            size="mini"
            type="danger"
            @click="removeEntity(scope.row,'deleted')") {{ $t('table.delete') }}
      pagination(:type="type" v-if="list(type).length")
    el-dialog(:title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @open="remoteGetUsers")
      el-form(ref="dataForm"
      :rules="rules"
      :model="temp.attributes"
      label-position="left"
      label-width="70px"
      style="width: 400px; margin-left:50px;"
      )
        el-form-item(label="User" prop="user")
          el-select(
            v-model="temp.relationships.user.data.id",
            filterable,
            remote,
            @focus="remoteGetUsers"
            placeholder="Please enter a keyword"
            :remote-method="remoteGetUsers"
            :loading="loading"
          )
            el-option(
              v-for="user in list('absences')"
              :key="user.id"
              :label="user.attributes.name"
              :value="user.id"
            )
        el-form-item(label="Date" prop="date")
          el-date-picker(
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-model="temp.attributes.date" type="date" placeholder="Please pick a date")
        el-form-item(label="Reason" prop="reason")
          el-radio-group(v-model="temp.attributes.reason")
            el-radio(label="vacation") Vacation
            el-radio(label="illness") Illness
            el-radio(label="other") Other
        el-form-item(label="Comment" prop="comment")
          el-input(placeholder="Please input" v-model="temp.attributes.comment" clearable)
      div(slot="footer" class="dialog-footer")
        el-button(@click="dialogFormVisible = false") {{ $t('table.cancel') }}
        el-button(v-if="dialogStatus === 'create'" type="primary" :loading="dialogFormLoading" @click="create") {{ $t('table.confirm') }}
        el-button(v-else type="primary" :loading="dialogFormLoading" @click="update") Update
    el-dialog(:title="textMap[dialogStatus]" :visible.sync="dialogViewVisible")
      div {{temp.id}} Id
      div {{temp.attributes.name}} Project
      div {{temp.attributes.alias}} Alias
      div(slot="footer" class="dialog-footer")
        el-button(@click="dialogViewVisible = false") Close
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
      included: 'actionEntityTable/included'
    }),
    entity() {
      return {
        date: this.temp.attributes.date,
        reason: this.temp.attributes.reason,
        comment: this.temp.attributes.comment,
        user_id: this.temp.relationships.user.data.id,
        project_id: this.temp.relationships.project.data.id
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
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
