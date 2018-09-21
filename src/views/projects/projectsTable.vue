<template lang="pug">
  div
    div
      div(style="display: flex")
        div
          el-dropdown(type="primary")
            span.el-dropdown-link Batch Actions
            el-dropdown-menu(slot="dropdown")
              el-dropdown-item(:disabled="multipleSelection.length <= 0") Delete selected
        div
          el-button(@click="handleCreate",
          class="filter-item",
          style="margin-left: 10px;",
          type="primary",
          icon="el-icon-edit") Add new project
      el-table(
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        v-loading="listLoading"
        :key="tableKey"
        :data="list"
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
            span {{ scope.row.attributes.name }}
        el-table-column(label="Alias")
          template(slot-scope="scope")
            span {{ scope.row.attributes.alias }}
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
    <!--div.pagination-container-->
      <!--el-pagination(v-show="total>0"-->
      <!--:current-page="listQuery.page"-->
      <!--:page-sizes="[10,20,30, 50]"-->
      <!--:page-size="listQuery.limit"-->
      <!--:total="total"-->
      <!--background layout="total, sizes, prev, pager, next, jumper"-->
      <!--@size-change="handleSizeChange" @current-change="handleCurrentChange")-->
    el-dialog(:title="textMap[dialogStatus]" :visible.sync="dialogFormVisible")
      el-form(ref="dataForm"
      :rules="rules"
      :model="temp.attributes"
      label-position="left"
      label-width="70px"
      style="width: 400px; margin-left:50px;")
        el-form-item(label="Name" prop="name")
          el-input(placeholder="Please input" v-model="temp.attributes.name" clearable)
        el-form-item(label="Alias" prop="alias")
          el-input(placeholder="Please input" v-model="temp.attributes.alias" clearable)
      div(slot="footer" class="dialog-footer")
        el-button(@click="dialogFormVisible = false") {{ $t('table.cancel') }}
        el-button(type="primary" @click="updateEntity") Update
    el-dialog(:title="textMap[dialogStatus]" :visible.sync="dialogViewVisible")
      div {{temp.id}} Id
      div {{temp.attributes.name}} Project
      div {{temp.attributes.alias}} Alias
    el-dialog(:title="textMap[dialogStatus]" :visible.sync="dialogCreateVisible")
      el-form(ref="createForm"
      :rules="rules"
      :model="temp.attributes"
      label-position="left"
      label-width="70px"
      style="width: 400px; margin-left:50px;")
        el-form-item(label="Name" prop="name")
          el-input(placeholder="Please input" v-model="temp.attributes.name" clearable)
        el-form-item(label="Alias" prop="alias")
          el-input(placeholder="Please input" v-model="temp.attributes.alias" clearable)
        el-form-item(label="Team" prop="team")
      div(slot="footer" class="dialog-footer")
        el-button(@click="dialogFormVisible = false") {{ $t('table.cancel') }}
        el-button(type="primary" @click="createEntity") {{ $t('table.confirm') }}
</template>

<script>
  import { mapGetters } from 'vuex'
  import * as mixin from "@/mixins/index";
  export default {
    name: 'projectsTable',
    mixins: [mixin.mixValidationRules, mixin.mixDialog, mixin.mixPagination, mixin.mixQuery],
    data () {
      return {
        multipleSelection: [],
        tableKey: 0,
        dialogFormVisible: false,
        dialogViewVisible: false,
        dialogCreateVisible: false,
        listLoading: true,
        type: 'projects'
      }
    },
    computed: {
      ...mapGetters({
        list: 'actionEntityTable/list',
        pagination: 'actionEntityTable/pagination'
      })
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val;
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
