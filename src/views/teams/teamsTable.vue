<template lang="pug">
  div
    div
      div
        el-button(@click="handleCreate",
        class="filter-item",
        style="margin-left: 10px;",
        type="primary",
        icon="el-icon-edit") Add new team
      el-table(
      v-loading="listLoading"
      :key="tableKey"
      :data="list(type)"
      border
      fit
      @selection-change="handleSelectionChange"
      highlight-current-row
      style="width: 100%;")
        el-table-column(type="selection", width="55")
        el-table-column(:label="$t('table.id')" align="center" width="65")
          template(slot-scope="scope")
            span {{ scope.row.id }}
        el-table-column(label="Name")
          template(slot-scope="scope")
            span {{ scope.row.attributes.name }}
        el-table-column(label="Description")
          template(slot-scope="scope")
            span {{ scope.row.attributes.description }}
        el-table-column(:label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width")
          template(slot-scope="scope")
            el-button(type="primary" size="mini" @click="handleView(scope.row)") View
            el-button(type="primary" size="mini" @click="handleUpdate(scope.row)") {{ $t('table.edit') }}
            el-button(v-if="scope.row.status !== 'deleted'" size="mini" type="danger" @click="removeEntity(scope.row,'deleted')") {{ $t('table.delete') }}
        pagination(:type="type" v-if="list(type).length")
      el-dialog(:title="textMap[dialogStatus]" :visible.sync="dialogFormVisible")
        el-form(ref="dataForm"
        :rules="rules"
        :model="temp.attributes"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;")
          el-form-item(label="Name")
            el-input(v-model="temp.attributes.name" clearable)
          el-form-item(label="Description")
            el-input(v-model="temp.attributes.description" clearable)
        div(slot="footer" class="dialog-footer")
          el-button(@click="dialogFormVisible = false") {{ $t('table.cancel') }}
          el-button(v-if="dialogStatus === 'create'" :loading="dialogFormLoading" type="primary" @click="create()") Create
          el-button(v-else type="primary" :loading="dialogFormLoading" @click="update") {{ $t('table.confirm') }}
      el-dialog(:title="textMap[dialogStatus]" :visible.sync="dialogViewVisible")
        div {{temp.attributes.name}} Name
        div {{temp.attributes.description}} Description
</template>

<script>
import { mapGetters } from 'vuex'
import * as mixin from '@/mixins/index'
import pagination from '@/components/Pagination/index'
export default {
  name: 'TeamsTable',
  components: {
    pagination
  },
  mixins: [mixin.mixValidationRules, mixin.mixDialog, mixin.mixQuery],
  data() {
    return {
      multipleSelection: [],
      tableKey: 0,
      type: 'teams'
    }
  },
  computed: {
    ...mapGetters({
      list: 'actionEntityTable/list'
    }),
    entity() {
      return {
        name: this.temp.attributes.name,
        description: this.temp.attributes.description
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    create() {
      const entity = {
        team: this.entity
      }
      this.createEntity(entity)
    },
    update() {
      const entity = {
        id: this.temp.id,
        team: this.entity
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
