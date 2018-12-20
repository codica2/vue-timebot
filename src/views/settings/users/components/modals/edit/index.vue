<template lang="pug">
  el-dialog.el-dialog-edit(:class="{'el-dialog-create': status === 'create'}" @close="closeModal" :title="textMap[status]" :visible="modalVisible('edit')")
    el-form(ref="dataForm"
    :rules="rules"
    :model="temp"
    label-position="left"
    label-width="70px")
      .el-dialog-edit-block
        el-form-item(label="Users name" prop="name" class="el-dialog-flex-head")
          el-input(v-model="temp.name")
        el-form-item(label="Role" prop="role")
          el-select(v-model="temp.role" placeholder="Select")
            el-option(v-for="item in roles" :key="item.value" :label="item.label" :value="item.value")
      .el-dialog-edit-block
        el-form-item(label="Team" prop="team")
          el-select(v-model="temp.team.id" placeholder="Select" clearable)
            el-option(v-for="(team, teamIndex) in list('teams')" :key="teamIndex" :label="team.name" :value="team.id")
      .el-dialog-edit-block-status
        el-form-item(label="Status")
        el-checkbox(v-model="temp['is-active']") Is Active
      .el-dialog-edit-block-last
        div(slot="footer" class="dialog-footer")
          el-button(@click="closeModal") {{ $t('table.cancel') }}
          el-button(v-if="status === 'create'" :loading="loader" type="primary" @click="create") Create
          el-button(v-else type="primary" :loading="loader" @click="update") {{ $t('table.confirm') }}
</template>

<script>
import * as mixin from '@/mixins/index'
import { mapGetters } from 'vuex'
export default {
  name: 'ModalEdit',
  mixins: [mixin.mixValidationRules, mixin.mixDialog, mixin.mixQuery],
  data: () => ({
    type: 'users',
    roles: [
      {
        label: 'Front-end',
        value: 'front_end'
      },
      {
        label: 'Design',
        value: 'design'
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
      },
      {
        label: 'Not set',
        value: 'not_set'
      }
    ]
  }),
  computed: {
    entity() {
      return {
        name: this.temp.name,
        is_active: this.temp['is-active'],
        uid: this.temp.uid || this.temp.name,
        team_id: this.temp.team ? this.temp.team.id : '',
        role: this.temp.role
      }
    },
    ...mapGetters({
      list: 'actionEntityTable/list',
      temp: 'modals/temp',
      loader: 'modals/loading',
      status: 'modals/status',
      modalVisible: 'modals/visible'
    })
  },
  methods: {
    closeModal() {
      this.$store.dispatch('modals/toggleModal', { visible: { edit: false }, loading: false, status: this.status })
    },
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
    delete() {
      const entity = {
        user_ids: this.multipleSelection
      }
      return entity
    }
  }
}
</script>

<style scoped>

</style>
