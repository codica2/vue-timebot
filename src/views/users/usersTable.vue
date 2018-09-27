<template lang="pug">
  div
    div
      div
        el-button(@click="handleCreate",
        class="filter-item",
        style="margin-left: 10px;",
        type="primary",
        icon="el-icon-edit") Add new project
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
            span {{ scope.row.name }}
        el-table-column(label="Is speaking")
          template(slot-scope="scope")
            span {{ scope.row.is_speaking }}
        el-table-column(label="Is Active")
          template(slot-scope="scope")
            span {{ scope.row.is_active }}
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
          el-form-item(label="User")
            el-input(v-model="temp.relationships.user.data.id" clearable)
          el-form-item(label="Project")
            el-select(v-model="temp.relationships.project.data.id")
              el-option(v-for="(project, projectIndex) in list('projects')"
              :value="project.id"
              :key="projectIndex",
              :label="project.attributes.name")
          el-form-item(:label="$t('table.date')" prop="date")
            el-date-picker(v-model="temp.attributes.date" type="date" placeholder="Please pick a date")
          el-form-item(label="Time" prop="time")
            el-time-picker(
            v-model="temp.attributes.time"
            type="datetime" placeholder="Please pick a time")
          el-form-item(label="Details" prop="timestamp")
            el-input(v-model="temp.attributes.details" type="details" placeholder="Write smth")
        div(slot="footer" class="dialog-footer")
          el-button(@click="dialogFormVisible = false") {{ $t('table.cancel') }}
          el-button(v-if="dialogStatus === 'create'" :loading="dialogFormLoading" type="primary" @click="createEntityMod()") Create
          el-button(v-else type="primary" :loading="dialogFormLoading" @click="updateEntity") {{ $t('table.confirm') }}
      el-dialog(:title="textMap[dialogStatus]" :visible.sync="dialogViewVisible")
        div {{temp.name}} Name
        div {{temp.uid}} Uid
        div {{temp.updated_at}} Updated at
        div {{temp.is_speaking}} IS SPEAKING
        div {{temp.is_active}} IS ACTIVE
        div {{temp.team_id}} TEAM
        div {{temp.last_message}} Last message
</template>

<script>
import { mapGetters } from 'vuex'
import * as mixin from '@/mixins/index'
import pagination from '@/components/Pagination/index'
export default {
  name: 'UsersTable',
  components: {
    pagination
  },
  mixins: [mixin.mixValidationRules, mixin.mixDialog, mixin.mixQuery],
  data() {
    return {
      multipleSelection: [],
      tableKey: 0,
      type: 'projects'
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

<style scoped>

</style>
