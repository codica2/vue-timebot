<template lang="pug">
  div
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
      el-table-column(label="User")
        template(slot-scope="scope")
          span {{ scope.row.user_id }}
      el-table-column(label="Project")
        template(slot-scope="scope")
          span {{ scope.row.project_id }}
      el-table-column(label="Date")
        template(slot-scope="scope")
          span {{ scope.row.updated_at }}
      el-table-column(label="Time")
        template(slot-scope="scope")
          span {{ scope.row.time }}
      el-table-column(label="Details")
        template(slot-scope="scope")
          span {{ scope.row.details }}
      el-table-column(:label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width")
        template(slot-scope="scope")
          el-button(type="primary" size="mini" @click="handleView(scope.row)") View
          el-button(type="primary" size="mini" @click="handleUpdate(scope.row)") {{ $t('table.edit') }}
          el-button(v-if="scope.row.status !== 'deleted'" size="mini" type="danger" @click="handleModifyStatus(scope.row,'deleted')") {{ $t('table.delete') }}
      pagination(:type="type" v-if="list(type).length")
    el-dialog(:title="textMap[dialogStatus]" :visible.sync="dialogFormVisible")
      el-form(ref="dataForm"
      :rules="rules"
      :model="temp.attributes"
      label-position="left"
      label-width="70px"
      style="width: 400px; margin-left:50px;")
        el-form-item(label="User" prop="user_id")
        el-form-item(label="Project" prop="project_id")
        el-form-item(:label="$t('table.date')" prop="timestamp")
          el-date-picker(v-model="temp.date" type="datetime" placeholder="Please pick a date")
        el-form-item(label="Time" prop="timestamp")
          el-time-picker(v-model="temp.time" type="datetime" placeholder="Please pick a time")
        el-form-item(label="Details" prop="timestamp")
          el-input(v-model="temp.details" type="details" placeholder="Write smth")
      div(slot="footer" class="dialog-footer")
        el-button(@click="dialogFormVisible = false") {{ $t('table.cancel') }}
        el-button(v-if="dialogStatus === 'create'" :loading="dialogFormLoading" type="primary" @click="createEntity") {{ $t('table.confirm') }}
        el-button(v-else type="primary" :loading="dialogFormLoading" @click="updateEntity") {{ $t('table.confirm') }}
    el-dialog(:title="textMap[dialogStatus]" :visible.sync="dialogViewVisible")
      div {{temp.user_id}} User
      div {{temp.created_at}} Created at
      div {{temp.date}} Date
      div {{temp.details}} Details
      div {{temp.id}} Id
      div {{temp.minutes}} Minutes
      div {{temp.project_id}} Project
      div {{temp.ticket}} Ticket
      div {{temp.time}} Time
      div {{temp.trello_labels}} Trello labels
      div {{temp.updated_at}} Updated at
      div {{temp.ticket}} Ticket
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
  mixins: [mixin.mixValidationRules, mixin.mixDialog, mixin.mixQuery],
  data: () => ({
    multipleSelection: [],
    tableKey: 0,
    type: 'time-entries'
  }),
  computed: {
    ...mapGetters({
      list: 'actionEntityTable/list',
      pagination: 'actionEntityTable/Pagination'
    })
  },
  beforeDestroy() {
    this.$store.dispatch('actionEntityTable/clearStore')
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
