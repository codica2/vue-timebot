<template lang="pug">
  div.absence
    div(class="timebot-header") Absence reports
    div(class="time-entries-filters-container")
      div(class="time-entries-filters")
        div(class="filters-label") Date
          .el-row--flex.align-center
            span From&nbsp;
            el-date-picker(
            v-model="date[0]",
            type="year",
            value-format="yyyy-MM-dd",
            placeholder="Start date",
            @change="getAbsenceReports")
            span To&nbsp;
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
    modal-edit(ref="edit")
    modal-view(ref="view")
</template>

<script>
import * as mixin from '@/mixins/index'
import { mapGetters } from 'vuex'
import ModalEdit from './components/modals/edit/index'
import ModalView from './components/modals/view/index'
export default {
  name: 'UserReports',
  components: {
    ModalView,
    ModalEdit
  },
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
    })
  },
  watch: {
    date() {
      if (this.date[1]) {
        const endDate = this.date[1].split('-')
        endDate[1] = '12'
        endDate[2] = '31'
        this.date[1] = endDate.join('-')
      }
    }
  },
  created() {
    this.date = [`${new Date().getFullYear()}-01-01`, `${new Date().getFullYear()}-12-31`]
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
      this.$store.dispatch('actionEntityTable/setFilter', { date_from: this.date[0], date_to: this.date[1], by_active_users: true })
        .then(() => {
          this.$store.dispatch('actionEntityTable/fetchList', this.type)
            .finally(() => {
              this.$store.dispatch('setLoader', false)
            })
        })
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
    &.align-center {
      align-items: center;
    }
  }
  .absence {
    .time-entries-filters-container .time-entries-filters {
      width: 280px;
    }
    .cell {
      text-align: center;
    }
  }
</style>
