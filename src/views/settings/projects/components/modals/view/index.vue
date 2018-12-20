<template lang="pug">
  el-dialog.el-dialog-view(:title="textMap[status]" :visible="modalVisible('view')" @close="closeModal")
    .el-dialog-flex
      .el-dialog-flex-block
        .el-dialog-flex-head Id
        .el-dialog-flex-subhead {{temp.id}}
      .el-dialog-flex-block
        .el-dialog-flex-head Name
        .el-dialog-flex-subhead {{temp.name}}
      .el-dialog-flex-block
        .el-dialog-flex-head Alias
        .el-dialog-flex-subhead {{temp.alias}}
      .el-dialog-flex-block
        .el-dialog-flex-head Status
        .el-dialog-flex-subhead
          span(v-if="temp['active']") Active
          span(v-else) Inactive
</template>

<script>
import * as mixin from '@/mixins/index'
import { mapGetters } from 'vuex'

export default {
  name: 'ModalView',
  mixins: [mixin.mixValidationRules, mixin.mixDialog],
  computed: {
    ...mapGetters({
      temp: 'modals/temp',
      status: 'modals/status',
      modalVisible: 'modals/visible'
    })
  },
  methods: {
    closeModal() {
      this.$store.dispatch('modals/toggleModal', { visible: { view: false }, status: 'view' })
    }
  }
}
</script>

<style scoped>

</style>
