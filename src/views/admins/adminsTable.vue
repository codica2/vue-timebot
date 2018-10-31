<template lang="pug">
  div
    div
      div(class="position-create-new-category-right")
        el-button(@click="handleCreate",
        class="filter-item create-new-category",
        type="primary") Add new admin
      el-table(
      :key="tableKey"
      :data="list(type)"
      border
      fit
      highlight-current-row
      style="width: 100%;")
        el-table-column(:label="$t('table.id')" align="center" width="65")
          template(slot-scope="scope")
            span {{ scope.row.id }}
        el-table-column(label="Email/Login")
          template(slot-scope="scope")
            span {{ scope.row.email }}
        el-table-column(:label="$t('table.actions')" width="230" class-name="small-padding fixed-width")
          template(slot-scope="scope")
            el-button(type="info" size="mini" @click="handleView(scope.row)") View
            el-button(type="primary" size="mini" @click="handleUpdate(scope.row)") {{ $t('table.edit') }}
            el-button(v-if="scope.row.status !== 'deleted'" size="mini" type="danger" @click="removeEntity(scope.row,'deleted')") {{ $t('table.delete') }}

      el-dialog.el-dialog-edit(:class="{'el-dialog-create': dialogStatus === 'create'}" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible")
        el-form(ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px")
          .el-dialog-edit-block
            el-form-item(label="Email" prop="email")
              el-input(v-model="temp.email")
            el-form-item(v-if="dialogStatus === 'create'" label="Password" prop="password")
              el-input(v-model="temp.password")
          .el-dialog-edit-block-last
            div(slot="footer" class="dialog-footer")
              el-button(@click="dialogFormVisible = false") {{ $t('table.cancel') }}
              el-button(v-if="dialogStatus === 'create'" :loading="dialogFormLoading" type="primary" @click="create") Create
              el-button(v-else type="primary" :loading="dialogFormLoading" @click="update") {{ $t('table.confirm') }}

      el-dialog.el-dialog-view(:title="textMap[dialogStatus]" :visible.sync="dialogViewVisible")
        .el-dialog-flex
          .el-dialog-flex-block
            .el-dialog-flex-head Id
            .el-dialog-flex-subhead {{temp.id}}
          .el-dialog-flex-block
            .el-dialog-flex-head Email
            .el-dialog-flex-subhead {{temp.email}}
</template>

<script>
import * as mixin from '@/mixins/index'
import { mapGetters } from 'vuex'
export default {
  name: 'AdminsTable',
  mixins: [mixin.mixValidationRules, mixin.mixDialog, mixin.mixQuery],
  data: () => ({
    tableKey: 0,
    type: 'admins'
  }),
  computed: {
    ...mapGetters({
      list: 'actionEntityTable/list'
    }),
    entity() {
      return {
        email: this.temp.email,
        password: this.temp.password
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    create() {
      const entity = {
        admin: this.entity
      }
      this.createEntity(entity)
    },
    update() {
      const entity = {
        id: this.temp.id,
        admin: this.entity
      }
      this.updateEntity(entity)
    }
  }
}
</script>

<style scoped>

</style>
