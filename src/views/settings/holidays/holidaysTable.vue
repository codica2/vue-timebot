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
      modal-edit(ref="edit")
      modal-view(ref="view")
</template>

<script>
import { mapGetters } from 'vuex'
import * as mixin from '@/mixins/index'
import pagination from '@/components/Pagination/index'
import modalEdit from './components/modals/edit'
import modalView from './components/modals/view'
export default {
  name: 'HolidaysTable',
  components: {
    pagination,
    modalEdit,
    modalView
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
    })
  },
  created() {
    this.getList()
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style scoped>

</style>
