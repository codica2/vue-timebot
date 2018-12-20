<template lang="pug">
  el-dialog.el-dialog-edit(:class="{'el-dialog-create': status === 'create'}" @close="closeModal" :title="textMap[status]" :visible="modalVisible('edit')")
    el-form(ref="dataForm"
    :rules="rules"
    :model="temp"
    label-position="left"
    label-width="70px")
      .el-dialog-edit-block
        el-form-item(label="Email" prop="email")
          el-input(v-model="temp.email")
        el-form-item(v-if="status === 'create'" label="Password" prop="password")
          el-input(v-model="temp.password")
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
    type: 'admins'
  }),
  computed: {
    entity() {
      return {
        email: this.temp.email,
        password: this.temp.password
      }
    },
    ...mapGetters({
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
        admin: this.entity
      }
      this.createEntity(entity)
    },
    update() {
      const entity = {
        id: this.temp.id,
        admin: this.entity
      }
      this.updateEntity(entity)
    }
  }
}
</script>

<style scoped>

</style>
