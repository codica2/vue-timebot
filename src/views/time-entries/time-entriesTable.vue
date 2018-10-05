<template lang="pug">
  div
    div
      div
        el-button(@click="handleCreate",
        class="filter-item",
        style="margin: 10px 0 20px;",
        type="primary",
        icon="el-icon-edit") Add new time entry
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
            span {{ getIncluded(scope.row.relationships.user.data.id) }}
        el-table-column(label="Project")
          template(slot-scope="scope")
            span {{ getIncluded(scope.row.relationships.project.data.id) }}
        el-table-column(label="Date")
          template(slot-scope="scope")
            span {{ scope.row.attributes.date }}
        el-table-column(label="Time")
          template(slot-scope="scope")
            span {{ scope.row.attributes.time }}
        el-table-column(label="Details")
          template(slot-scope="scope")
            span {{ scope.row.attributes.details }}
        el-table-column(:label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width")
          template(slot-scope="scope")
            el-button(type="info" size="mini" @click="handleView(scope.row)") View
            el-button(type="primary" size="mini" @click="handleUpdate(scope.row)") {{ $t('table.edit') }}
            el-button(v-if="scope.row.status !== 'deleted'" size="mini" type="danger" @click="removeEntity(scope.row,'deleted')") {{ $t('table.delete') }}
      pagination(:type="type" v-if="list(type).length")
      el-dialog(@open="preRemote" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible")
        el-form(ref="dataForm"
        :rules="rules"
        :model="temp.attributes"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;")
          el-form-item(label="User")
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
                v-for="user in filterable('users')"
                :key="user.id"
                :label="user.name"
                :value="user.id"
              )
          el-form-item(label="Project")
            el-select(
              v-model="temp.relationships.project.data.id"
              filterable
              remote,
              @focus="remoteGetProjects"
              placeholder="Please enter a keyword"
              :remote-method="remoteGetProjects"
            )
              el-option(v-for="project in filterable('projects')"
              :value="project.id"
              :key="project.id",
              :label="project.name")
          el-form-item(:label="$t('table.date')" prop="date")
            el-date-picker(
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-model="temp.attributes.date" type="date" placeholder="Please pick a date")
          el-form-item(label="Time" prop="time")
            el-time-picker(
            v-model="temp.attributes.time"
            type="datetime" placeholder="Please pick a time")
          el-form-item(label="Details" prop="timestamp")
            el-input(v-model="temp.attributes.details" type="details" placeholder="Write smth")
        div(slot="footer" class="dialog-footer")
          el-button(@click="dialogFormVisible = false") {{ $t('table.cancel') }}
          el-button(v-if="dialogStatus === 'create'" :loading="dialogFormLoading" type="primary" @click="createEntityMod()") Create
          el-button(v-else type="primary" :loading="dialogFormLoading" @click="update") {{ $t('table.confirm') }}
      el-dialog(:title="textMap[dialogStatus]" :visible.sync="dialogViewVisible")
        div(class="view-flex")
          div
            strong User
            div {{temp.relationships.user.data.id}}
          div
            strong Date
            div {{temp.attributes.date}}
          div
            strong Details
            div {{temp.attributes.details}}
          div
            strong Id
            div {{temp.id}}
          div
            strong Minutes
            div {{temp.attributes.time}}
          div
            strong Project
            div {{temp.relationships.project.data.id}}
          div
            strong Ticket
            div {{temp.attributes.details}}
          div
            strong Trello labels
            div {{temp.attributes['trello-labels']}}
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
  mixins: [mixin.mixValidationRules, mixin.mixDialog, mixin.mixQuery, mixin.mixIncludes],
  data: () => ({
    multipleSelection: [],
    tableKey: 0,
    type: 'time-entries',
    loading: false
  }),
  computed: {
    ...mapGetters({
      list: 'actionEntityTable/list',
      included: 'actionEntityTable/included',
      filterable: 'actionEntityTable/filterable'
    }),
    entity() {
      return {
        date: this.temp.attributes.date,
        time: this.temp.attributes.time,
        minutes: this.temp.attributes.time,
        details: this.temp.attributes.details,
        trello_labels: this.temp.attributes.trello_labels,
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
        time_entry: this.entity
      }
      this.updateEntity(entity)
    },
    createEntityMod() {
      const entity = {
        time_entry: this.entity
      }
      this.createEntity(entity)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    preRemote() {
      this.remoteGetProjects()
      this.remoteGetUsers()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
