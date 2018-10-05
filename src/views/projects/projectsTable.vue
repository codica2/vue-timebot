<template lang="pug">
  div
    div
      div(style="display: flex")
        <!--div-->
          <!--el-dropdown(type="primary")-->
            <!--span.el-dropdown-link Batch Actions-->
            <!--el-dropdown-menu(slot="dropdown")-->
              <!--el-dropdown-item(:disabled="multipleSelection.length <= 0") Delete selected-->
        div
          el-button(@click="handleCreate",
          class="filter-item",
          style="margin: 10px 0 20px;",
          type="primary",
          icon="el-icon-edit") Add new project
      el-table(
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        v-loading="listLoading"
        :key="tableKey"
        :data="list(type)"
        border
        fit
        highlight-current-row
        style="width: 100%;")
        el-table-column(type="selection", width="55")
        el-table-column(:label="$t('table.id')" align="center" width="65")
          template(slot-scope="scope")
            span {{ scope.row.id }}
        el-table-column(label="Name")
          template(slot-scope="scope")
            span {{ scope.row.attributes.name }}
        el-table-column(label="Alias")
          template(slot-scope="scope")
            span {{ scope.row.attributes.alias }}
        el-table-column(label="Team")
          template(slot-scope="scope")
            span {{setTeam(scope.row.relationships.team.data)}}
        el-table-column(:label="$t('table.actions')"
        align="center" width="230" class-name="small-padding fixed-width")
          template(slot-scope="scope")
            el-button(type="primary" size="mini" @click="handleView(scope.row)") View
            el-button(type="primary" size="mini" @click="handleUpdate(scope.row)") {{ $t('table.edit') }}
            el-button(
            v-if="scope.row.status !== 'deleted'"
            size="mini"
            type="danger"
            @click="removeEntity(scope.row,'deleted')") {{ $t('table.delete') }}
      pagination(:type="type" v-if="list(type).length")
    el-dialog(:title="textMap[dialogStatus]" :visible.sync="dialogFormVisible")
      el-form(ref="dataForm"
      :rules="rules"
      :model="temp.attributes"
      label-position="left"
      label-width="70px"
      style="width: 400px; margin-left:50px;")
        el-form-item(label="Name" prop="name")
          el-input(placeholder="Please input" v-model="temp.attributes.name" clearable)
        el-form-item(label="Team")
          el-select(v-if="temp.relationships.team.data" v-model="temp.relationships.team.data.id" placeholder="Select")
            el-option(v-for="team in list('teams')" :key="team.id" :label="team.attributes.name" :value="team.id")
          el-select(v-else v-model="temp.relationships.team.data" placeholder="Select")
            el-option(v-for="team in list('teams')" :key="team.id" :label="team.attributes.name" :value="team")
      div(slot="footer" class="dialog-footer")
        el-button(@click="dialogFormVisible = false") {{ $t('table.cancel') }}
        el-button(v-if="dialogStatus === 'create'" type="primary" :loading="dialogFormLoading" @click="create") {{ $t('table.confirm') }}
        el-button(v-else type="primary" :loading="dialogFormLoading" @click="update") Update
    el-dialog(:title="textMap[dialogStatus]" :visible.sync="dialogViewVisible")
      div(class="view-flex")
        div
          strong Id
          div {{temp.id}}
        div
          strong Project
          div {{temp.attributes.name}}
        div
          strong Alias
          div {{temp.attributes.alias}}
        div(slot="footer" class="dialog-footer")
</template>

<script>
import { mapGetters } from 'vuex'
import * as mixin from '@/mixins/index'
import pagination from '@/components/Pagination/index'
export default {
  name: 'ProjectsTable',
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
    }),
    entity() {
      return {
        name: this.temp.attributes.name,
        alias: this.temp.attributes.alias,
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
  methods: {
    create() {
      const entity = {
        project: this.entity
      }
      this.createEntity(entity)
    },
    update() {
      const entity = {
        id: this.temp.id,
        project: this.entity
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

<style lang="scss" scoped>
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
