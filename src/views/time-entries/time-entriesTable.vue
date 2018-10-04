<template lang="pug">
  div
    div
      div
        el-button(@click="handleCreate",
        class="filter-item",
        style="margin-left: 10px;",
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
            el-button(type="primary" size="mini" @click="handleView(scope.row)") View
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
              placeholder="Please enter a keyword"
              :remote-method="remoteMethod"
              :loading="loading"
            )
              el-option(
                v-for="item in data"
                :key="item.id"
                :label="item.attributes.name"
                :value="item.id"
              )
          el-form-item(label="Project")
            el-select(v-model="temp.relationships.project.data.id" filterable)
              el-option(v-for="(project, projectIndex) in included(type)"
              :value="project.id"
              :key="projectIndex",
              :label="project.attributes.name")
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
        div {{temp.relationships.user.data.id}} User
        div {{temp.attributes.date}} Date
        div {{temp.attributes.details}} Details
        div {{temp.id}} Id
        div {{temp.attributes.time}} Minutes
        div {{temp.relationships.project.data.id}} Project
        div {{temp.attributes.details}} Ticket
        div {{temp.attributes['trello-labels']}} Trello labels
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
    type: 'time-entries',
    data: [],
    loading: false
  }),
  computed: {
    ...mapGetters({
      list: 'actionEntityTable/list',
      included: 'actionEntityTable/included'
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
  beforeDestroy() {
    this.$store.dispatch('actionEntityTable/clearStore')
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
    remoteMethod(query) {
      this.loading = true
      this.data = this.included(this.type).filter(usr => {
        if (usr.type === 'users') return usr
      })
      this.loading = false
      // this.$http.get(`https://api.themoviedb.org/3/search/movie?api_key=bb6f51bef07465653c3e553d6ab161a8&query=${query}`)
      //   .then(({ data }) => {
      //     this.data = []
      //     data.results.forEach((item) => this.data.push(item))
      //   })
      //   .catch((error) => {
      //     this.data = []
      //     throw error
      //   })
      //   .finally(() => {
      //     this.loading = false
      //   })
    },
    preRemote() {
      this.data = this.included(this.type).filter(usr => {
        if (usr.type === 'users') return usr
      })
    },
    getIncluded(id) {
      const findInclude = this.included(this.type).find(pj => {
        if (pj.id === id) return pj
      })
      if (findInclude) {
        return findInclude.attributes.name
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
