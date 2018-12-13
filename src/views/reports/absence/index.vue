<template lang="pug">
  div()
    div(class="timebot-header") Absence reports
    div(class="time-entries-filters-container")
      div(class="time-entries-filters")
        div(class="filters-label") Date
          .el-row--flex
            el-date-picker(
            v-model="date[0]",
            type="year",
            value-format="yyyy-MM-dd",
            placeholder="Start date",
            @change="getAbsenceReports")
            el-date-picker(
              v-model="date[1]",
              type="year",
              value-format="yyyy-MM-dd"
              placeholder="End date",
              @change="getAbsenceReports"
              end-placeholder="End date")
      div(class="position-create-new-category")
        div
          el-button(@click="handleCreate",
          class="filter-item create-new-category",
          type="primary") Add new absence
    el-table(:data="absences" @row-click="expandTableRow" ref="absenceTable")
      el-table-column(type="expand")
        template(slot-scope="props")
          el-table(:data="props.row.absences")
            el-table-column(prop="id", label="Id")
            el-table-column(prop="date", label="Date")
            el-table-column(prop="reason", label="Reason")
            el-table-column(prop="comment", label="Comment")
            el-table-column(:label="$t('table.actions')" width="230" class-name="small-padding fixed-width")
              template(slot-scope="scope")
                el-button(type="info" size="mini" @click="handleView(scope.row)") View
                el-button(type="primary" size="mini" @click="handleUpdate(scope.row)") {{ $t('table.edit') }}
                el-button(
                v-if="scope.row.status !== 'deleted'"
                size="mini"
                type="danger"
                @click="removeEntity(scope.row,'deleted')") {{ $t('table.delete') }}
      el-table-column(label="Users" prop="name")
      el-table-column(
        prop="vacation",
        label="Vacation")
      el-table-column(
        prop="illness",
        label="	Illness")
      el-table-column(
        prop="other"
        label="Other"
      )
    el-dialog.el-dialog-edit(:class="{'el-dialog-create': dialogStatus === 'create'}" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @open="remoteGetUsers")
      el-form(ref="dataForm"
      :rules="rules"
      :model="temp"
      label-position="left"
      label-width="70px"
      style="width: 400px; margin-left:50px;"
      )
        .el-dialog-edit-block
          el-form-item(label="User" prop="user")
            el-select(
            v-model="temp.user.id",
            filterable,
            remote,
            @focus="remoteGetUsers"
            placeholder="Please enter a keyword"
            :remote-method="remoteGetUsers"
            :loading="loader"
            clearable
            )
              el-option(
              v-for="user in filterable('users')"
              :key="user.id"
              :label="user.name"
              :value="user.id"
              )
          el-form-item(label="Date" prop="date")
            el-date-picker(
            v-if="dialogStatus === 'update'"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-model="temp.date" type="date" placeholder="Please pick a date")
            el-date-picker(
            v-else
            format="yyyy-MM-dd"
            start-placeholder="Start date"
            end-placeholder="End date"
            value-format="yyyy-MM-dd"
            v-model="temp.date" type="dates" placeholder="Please pick a date")
        .el-dialog-edit-block
          el-form-item(label="Reason" prop="reason")
            el-radio-group(v-model="temp.reason")
              el-radio(label="vacation") Vacation
              el-radio(label="illness") Illness
              el-radio(label="other") Other
          el-form-item(label="Comment" prop="comment")
            el-input(placeholder="Please input" v-model="temp.comment" clearable)
        .el-dialog-edit-block-last(style="margin-top: 20px")
          div(slot="footer" class="dialog-footer")
            el-button(@click="dialogFormVisible = false") {{ $t('table.cancel') }}
            el-button(v-if="dialogStatus === 'create'" type="primary" :loading="dialogFormLoading" @click="create") {{ $t('table.confirm') }}
            el-button(v-else type="primary" :loading="dialogFormLoading" @click="update") Update
    el-dialog.el-dialog-view(:title="textMap[dialogStatus]" :visible.sync="dialogViewVisible")
      .el-dialog-flex
        .el-dialog-flex-block
          .el-dialog-flex-head Id
          .el-dialog-flex-subhead {{temp.id}}
        .el-dialog-flex-block
          .el-dialog-flex-head Name
          .el-dialog-flex-subhead {{getIncluded(temp.user.id)}}
        .el-dialog-flex-block
          .el-dialog-flex-head Date
          .el-dialog-flex-subhead {{temp.date}}
        .el-dialog-flex-block
          .el-dialog-flex-head Reason
          .el-dialog-flex-subhead {{temp.reason}}
        .el-dialog-flex-block
          .el-dialog-flex-head Comment
          .el-dialog-flex-subhead {{temp.comment}}
</template>

<script>
import * as mixin from '@/mixins/index'
import { mapGetters } from 'vuex'
export default {
  name: 'UserReports',
  mixins: [mixin.mixValidationRules, mixin.mixDialog, mixin.mixQuery, mixin.mixIncludes],
  data: () => ({
    type: 'absences',
    date: [],
    absences: []
  }),
  computed: {
    ...mapGetters({
      loader: 'loader',
      list: 'actionEntityTable/list',
      filterable: 'actionEntityTable/filterable',
      included: 'actionEntityTable/included'
    }),
    entity() {
      return {
        date: this.temp.date,
        reason: this.temp.reason,
        comment: this.temp.comment,
        user_id: this.temp.user ? this.temp.user.id : ''
      }
    }
  },
  created() {
    this.getAbsenceReports()
    this.$watch(vm => vm.list(this.type), () => {
      this.getAbsences()
    })
  },
  methods: {
    expandTableRow(row) {
      this.$refs.absenceTable.toggleRowExpansion(row)
    },
    getAbsences() {
      if (this.date[1]) {
        const endDate = this.date[1].split('-')
        endDate[1] = '12'
        endDate[2] = '31'
        this.date[1] = endDate.join('-')
      }
      const obj = {}
      this.list(this.type).forEach((abs) => {
        const { id, comment, reason, date } = abs
        if (typeof obj[abs.user.id] === 'undefined') obj[abs.user.id] = {}
        if (typeof obj[abs.user.id][abs.reason] === 'undefined') obj[abs.user.id][abs.reason] = []
        obj[abs.user.id][abs.reason].push(Object.assign({}, { id, comment, reason, date }, { user: { id: abs.user.id }}))
      })
      this.absences = Object.keys(obj).reduce((acum, id) => {
        acum.push({
          id: id,
          name: this.included(this.type).find(user => user.id === id).name,
          vacation: obj[id].vacation ? obj[id].vacation.length : 0,
          illness: obj[id].illness ? obj[id].illness.length : 0,
          other: obj[id].other ? obj[id].other.length : 0,
          absences: Object.keys(obj[id]).reduce((accum, reason) => {
            accum.push(...obj[id][reason])
            return accum
          }, [])
        })
        acum.sort((a, b) => {
          const nameA = a.name.toUpperCase()
          const nameB = b.name.toUpperCase()
          if (nameA < nameB) {
            return -1
          }
          if (nameA > nameB) {
            return 1
          }
          return 0
        })
        return acum
      }, [])
    },
    getAbsenceReports() {
      if (this.date === null) {
        this.date = [new Date(), new Date()]
      }
      this.$store.dispatch('setLoader', true)
      this.$store.dispatch('actionEntityTable/setFilter', { date_from: this.date[0], date_to: this.date[1] })
        .then(() => {
          this.$store.dispatch('actionEntityTable/fetchList', this.type)
            .finally(() => {
              this.$store.dispatch('setLoader', false)
            })
        })
    },
    update() {
      const entity = {
        id: this.temp.id,
        absence: this.entity
      }
      this.updateEntity(entity)
    },
    create() {
      const date = JSON.parse(JSON.stringify(this.entity.date))
      const entities = { absences: [] }
      for (let i = 0; i < date.length; i++) {
        const entity = {
          absence: JSON.parse(JSON.stringify(this.entity))
        }
        entity.absence.date = date[i]
        entities.absences.push(entity)
      }
      this.createEntity(entities)
    },
    delete() {
      const entity = {
        absence_ids: this.multipleSelection
      }
      return entity
    }
  }
}
</script>

<style lang="scss">
  .el-row--flex {
    .el-date-editor {
      margin: 0 5px 0 0;
      .el-input__inner {
        padding-right: 10px;
      }
    }
  }
</style>
