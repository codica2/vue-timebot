<template lang="pug">
  el-dialog.el-dialog-edit(:class="{'el-dialog-create': status === 'create'}" :title="textMap[status]" :visible="modalVisible('edit')" @close="closeModal")
    el-form(ref="dataForm"
    :rules="rules"
    :model="temp"
    label-position="left"
    label-width="70px")
      .el-dialog-edit-block
        el-form-item(label="Name" prop="name")
          el-input(v-model="temp.name" clearable)
        el-form-item(label="Description" prop="description")
          el-input(v-model="temp.description" clearable)
      .el-dialog-edit-block-last
        div(slot="footer" class="dialog-footer")
          el-button(@click="closeModal") {{ $t('table.cancel') }}
          el-button(v-if="status === 'create'" :loading="loader" type="primary" @click="create()") Create
          el-button(v-else type="primary" :loading="loader" @click="update") {{ $t('table.confirm') }}
</template>

<script>
import * as mixin from '@/mixins/index'
import { mapGetters } from 'vuex'
export default {
  name: 'ModalEdit',
  mixins: [mixin.mixValidationRules, mixin.mixDialog, mixin.mixQuery],
  data: () => ({
    type: 'teams'
  }),
  computed: {
    ...mapGetters({
      temp: 'modals/temp',
      loader: 'modals/loading',
      status: 'modals/status',
      modalVisible: 'modals/visible'
    }),
    entity() {
      return {
        name: this.temp.name,
        description: this.temp.description
      }
    }
  },
  watch: {
    temp() {
      if (this.$refs['dataForm']) this.$refs['dataForm'].clearValidate()
    }
  },
  methods: {
    closeModal() {
      this.$store.dispatch('modals/toggleModal', { visible: { edit: false }, loading: false, status: this.status })
      if (this.$refs['dataForm']) this.$refs['dataForm'].clearValidate()
    },
    create() {
      const entity = {
        team: this.entity
      }
      this.createEntity(entity)
    },
    update() {
      const entity = {
        id: this.temp.id,
        team: this.entity
      }
      this.updateEntity(entity)
    },
    delete() {
      const entity = {
        team_ids: this.multipleSelection
      }
      return entity
    }
  }
}
</script>

<style scoped>

</style>
