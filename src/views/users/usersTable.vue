<template lang="pug">
  div
    div
      div
        el-button(@click="handleCreate",
        class="filter-item",
        style="margin-left: 10px;",
        type="primary",
        icon="el-icon-edit") Add new user
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
        el-table-column(label="Role")
          template(slot-scope="scope")
            span {{ scope.row.attributes.role }}
        el-table-column(label="Is Active")
          template(slot-scope="scope")
            span(v-if="scope.row.attributes['is-active']") YES
            span(v-else) NO
        el-table-column(label="Team")
          template(slot-scope="scope")
            span {{setTeam(scope.row.relationships.team.data)}}
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
          el-form-item(label="Name" prop="name")
            el-input(v-model="temp.attributes.name")
          el-form-item(label="Role")
            el-select(v-model="temp.attributes.role" placeholder="Select")
              el-option(v-for="item in roles" :key="item.value" :label="item.label" :value="item.value")
          el-form-item(label="Team")
            el-select(v-if="temp.relationships.team.data" v-model="temp.relationships.team.data.id" placeholder="Select")
              el-option(v-for="team in list('teams')" :key="team.id" :label="team.attributes.name" :value="team.id")
            el-select(v-else v-model="temp.relationships.team.data" placeholder="Select")
              el-option(v-for="team in list('teams')" :key="team.id" :label="team.attributes.name" :value="team")
          el-form-item(label="Is active")
            el-checkbox(v-model="temp.attributes['is-active']")
        div(slot="footer" class="dialog-footer")
          el-button(@click="dialogFormVisible = false") {{ $t('table.cancel') }}
          el-button(v-if="dialogStatus === 'create'" :loading="dialogFormLoading" type="primary" @click="create") Create
          el-button(v-else type="primary" :loading="dialogFormLoading" @click="update") {{ $t('table.confirm') }}
      el-dialog(:title="textMap[dialogStatus]" :visible.sync="dialogViewVisible")
        div {{temp.attributes.name}} Name
        div {{temp.attributes.uid}} Uid
        div {{temp.attributes.updated_at}} Updated at
        div {{temp.attributes.is_speaking}} IS SPEAKING
        div {{temp.attributes.is_active}} IS ACTIVE
        div {{temp.attributes.team_id}} TEAM
        div {{temp.attributes.last_message}} Last message
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
      type: 'users',
      roles: [
        {
          label: 'Front-end',
          value: 'front_end'
        },
        {
          label: 'PM',
          value: 'pm'
        },
        {
          label: 'QA',
          value: 'QA'
        },
        {
          label: 'OPS',
          value: 'ops'
        },
        {
          label: 'Marketing',
          value: 'marketing'
        },
        {
          label: 'Back-end',
          value: 'back_end'
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      list: 'actionEntityTable/list'
    }),
    entity() {
      return {
        name: this.temp.attributes.name,
        is_active: this.temp.attributes['is-active'],
        uid: this.temp.attributes.uid || this.temp.attributes.name,
        team_id: this.temp.relationships.team.data.id
      }
    }
  },
  created() {
    this.getList()
      .then(() => {
        this.$store.dispatch('actionEntityTable/fetchList', 'teams')
      })
  },
  beforeDestroy() {
    this.$store.dispatch('actionEntityTable/clearStore')
  },
  methods: {
    create() {
      const entity = {
        user: this.entity
      }
      this.createEntity(entity)
    },
    update() {
      const entity = {
        id: this.temp.id,
        user: this.entity
      }
      this.updateEntity(entity)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    setTeam(team) {
      if (team) {
        const findTeam = this.list('teams').find(tm => {
          if (tm.id === team.id) return tm
        })
        if (findTeam) {
          return findTeam.attributes.name
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
