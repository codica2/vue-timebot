<template lang="pug">
  div
    el-button(@click="handleCreate",
      class="filter-item",
      style="margin: 10px 0 20px;",
      type="primary",
      icon="el-icon-edit"
    ) Add new admin
    el-table(
    v-loading="loader"
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
      el-table-column(label="Email/Login")
        template(slot-scope="scope")
          span {{ scope.row.attributes.email }}
      el-table-column(:label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width")
        template(slot-scope="scope")
          el-button(type="info" size="mini" @click="handleView(scope.row)") View
          el-button(type="primary" size="mini" @click="handleUpdate(scope.row)") {{ $t('table.edit') }}
          el-button(v-if="scope.row.status !== 'deleted'" size="mini" type="danger" @click="removeEntity(scope.row,'deleted')") {{ $t('table.delete') }}
    el-dialog(:title="textMap[dialogStatus]" :visible.sync="dialogFormVisible")
      el-form(ref="dataForm"
      :rules="rules"
      :model="temp.attributes"
      label-position="left"
      label-width="70px")
        el-form-item(label="Email" prop="email")
          el-input(v-model="temp.attributes.email")
        el-form-item(v-if="dialogStatus === 'create'" label="Password" prop="pass")
          el-input(v-model="temp.attributes.password")
      div(slot="footer" class="dialog-footer")
        el-button(@click="dialogFormVisible = false") {{ $t('table.cancel') }}
        el-button(v-if="dialogStatus === 'create'" :loading="dialogFormLoading" type="primary" @click="create") Create
        el-button(v-else type="primary" :loading="dialogFormLoading" @click="update") {{ $t('table.confirm') }}
    el-dialog(:title="textMap[dialogStatus]" :visible.sync="dialogViewVisible")
      div(class="view-flex")
        div
          strong Email
          div {{temp.attributes.email}}
        div
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
      list: 'actionEntityTable/list',
      loader: 'actionEntityTable/loader'
    }),
    entity() {
      return {
        email: this.temp.attributes.email,
        password: this.temp.attributes.password
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
