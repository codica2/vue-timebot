<template lang="pug">
  el-dialog.el-dialog-edit(:class="{'el-dialog-create': status === 'create'}" @close="closeModal" :title="textMap[status]" :visible="modalVisible('edit')")
    el-form(ref="dataForm"
    :rules="rules"
    :model="temp"
    label-position="left"
    label-width="70px"
    style="width: 400px; margin-left:50px;")
      .el-dialog-edit-block
        el-form-item(label="Name" prop="name")
          el-input(v-model="temp.name" clearable)
        el-form-item(label="Date" prop="date")
          el-date-picker(
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          v-model="temp.date" type="date" placeholder="Please pick a date")
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
    type: 'holidays'
  }),
  computed: {
    entity() {
      return {
        name: this.temp.name,
        date: this.temp.date
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
        holiday: this.entity
      }
      this.createEntity(entity)
    },
    update() {
      const entity = {
        id: this.temp.id,
        holiday: this.entity
      }
      this.updateEntity(entity)
    }
  }
}
</script>

<style scoped>

</style>
