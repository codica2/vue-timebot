<template lang="pug">
  el-dialog.el-dialog-view(:title="textMap[status]" :visible="modalVisible('view')" @close="closeModal")
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
  name: 'ModalView',
  mixins: [mixin.mixValidationRules, mixin.mixDialog, mixin.mixIncludes],
  data: () => ({
    type: 'absences'
  }),
  computed: {
    ...mapGetters({
      temp: 'modals/temp',
      status: 'modals/status',
      modalVisible: 'modals/visible',
      included: 'actionEntityTable/included'
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
