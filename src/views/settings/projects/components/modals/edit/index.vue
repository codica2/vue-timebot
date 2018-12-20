<template lang="pug">
  el-dialog.el-dialog-edit(:class="{'el-dialog-create': status === 'create'}" :title="textMap[status]" @close="closeModal" :visible="modalVisible('edit')")
    el-form(ref="dataForm"
    :rules="rules"
    :model="temp"
    label-position="left"
    label-width="70px"
    style="width: 400px; margin-left:50px;")
      .el-dialog-edit-block
        el-form-item(label="Name" prop="name")
          el-input(placeholder="Please input" v-model="temp.name" clearable)
        el-form-item(label="Team" prop="team")
          el-select(v-if="temp.team" v-model="temp.team.id" placeholder="Select")
            el-option(v-for="team in list('teams')" :key="team.id" :label="team.name" :value="team.id")
          el-select(v-else v-model="temp.team" placeholder="Select")
            el-option(v-for="team in list('teams')" :key="team.id" :label="team.name" :value="team")
      .el-dialog-edit-block-status
        el-form-item(label="Status")
        el-checkbox(v-model="temp['active']") Is Active
      .el-dialog-edit-block-last
        div(slot="footer" class="dialog-footer")
          el-button(@click="closeModal") {{ $t('table.cancel') }}
          el-button(v-if="status === 'create'" type="primary" :loading="loader" @click="create") {{ $t('table.confirm') }}
          el-button(v-else type="primary" :loading="loader" @click="update") Update
</template>

<script>
import { mapGetters } from 'vuex'
import * as mixin from '@/mixins/index'
export default {
  name: 'ModalEdit',
  mixins: [mixin.mixValidationRules, mixin.mixDialog, mixin.mixQuery],
  data: () => ({
    type: 'projects'
  }),
  computed: {
    entity() {
      return {
        name: this.temp.name,
        alias: this.temp.alias,
        team_id: this.temp.team ? this.temp.team.id : '',
        active: this.temp.active
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
    delete() {
      const entity = {
        project_ids: this.multipleSelection
      }
      return entity
    }
  }
}
</script>

<style scoped>

</style>
