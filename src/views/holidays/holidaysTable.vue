<template lang="pug">
  div
    div
      div(class="position-create-new-category")
        el-button(@click="handleCreate",
        class="filter-item create-new-category",
        type="primary") Add new holiday
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
        el-table-column(label="Name")
          template(slot-scope="scope")
            span {{ scope.row.name }}
        el-table-column(label="Date")
          template(slot-scope="scope")
            span {{ scope.row.date }}
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
        label-width="70px"
        style="width: 400px; margin-left:50px;")
          .el-dialog-edit-block
            el-form-item(label="Name" prop="name")
              el-input(v-model="temp.name" clearable)
            el-form-item(label="Date" prop="date")
              el-date-picker(
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              v-model="temp.date" type="date" placeholder="Please pick a date")
          .el-dialog-edit-block-last
            div(slot="footer" class="dialog-footer")
              el-button(@click="dialogFormVisible = false") {{ $t('table.cancel') }}
              el-button(v-if="dialogStatus === 'create'" :loading="dialogFormLoading" type="primary" @click="create") Create
              el-button(v-else type="primary" :loading="dialogFormLoading" @click="update") {{ $t('table.confirm') }}

      el-dialog.el-dialog-view(:title="textMap[dialogStatus]" :visible.sync="dialogViewVisible")
        .el-dialog-flex
          .el-dialog-flex-block
            .el-dialog-flex-head Name
            .el-dialog-flex-subhead {{temp.name}}
          .el-dialog-flex-block
            .el-dialog-flex-head Date
            .el-dialog-flex-subhead {{temp.date}}
</template>

<script>
import { mapGetters } from 'vuex'
import * as mixin from '@/mixins/index'
import pagination from '@/components/Pagination/index'
export default {
  name: 'HolidaysTable',
  components: {
    pagination
  },
  mixins: [mixin.mixValidationRules, mixin.mixDialog, mixin.mixQuery],
  data() {
    return {
      multipleSelection: [],
      tableKey: 0,
      type: 'holidays'
    }
  },
  computed: {
    ...mapGetters({
      list: 'actionEntityTable/list'
    }),
    entity() {
      return {
        name: this.temp.name,
        date: this.temp.date
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    create() {
      const entity = {
        holiday: this.entity
      }
      this.createEntity(entity)
    },
    update() {
      const entity = {
        id: this.temp.id,
        holiday: this.entity
      }
      this.updateEntity(entity)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style scoped>

</style>
