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
      modal-edit(ref="edit")
      modal-view(ref="view")
</template>
<script>
import { mapGetters } from 'vuex'
import * as mixin from '@/mixins/index'
import pagination from '@/components/Pagination/index'
import ModalEdit from './components/modals/edit/index'
import ModalView from './components/modals/view/index'
export default {
  name: 'TimeEntriesTable',
  components: {
    ModalView,
    ModalEdit,
    pagination
  },
  mixins: [mixin.mixValidationRules, mixin.mixDialog, mixin.mixQuery, mixin.mixIncludes, mixin.mixDate],
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
    entity() {
      return {
        date: this.temp.date,
        time: this.temp.time,
        details: this.temp.details,
        trello_labels: this.temp.trello_labels,
        user_id: this.temp.user ? this.temp.user.id : '',
        project_id: this.temp.project ? this.temp.project.id : ''
      }
    },
    ...mapGetters({
      temp: 'modals/temp',
      list: 'actionEntityTable/list',
      included: 'actionEntityTable/included',
      filterable: 'actionEntityTable/filterable'
    })
  },
  mounted() {
    this.getList()
  }
}
</script>

<style lang="scss" scoped>
</style>
