<template lang="pug">
  el-dialog.el-dialog-view(:title="textMap[status]" :visible="modalVisible('view')" @close="closeModal")
    .el-dialog-flex
      .el-dialog-flex-block
        .el-dialog-flex-head Id
        .el-dialog-flex-subhead {{temp.id}}
      .el-dialog-flex-block
        .el-dialog-flex-head User
        .el-dialog-flex-subhead {{getIncluded(temp.user.id)}}
      .el-dialog-flex-block
        .el-dialog-flex-head Date
        .el-dialog-flex-subhead {{temp.date}}
      .el-dialog-flex-block
        .el-dialog-flex-head Details
        .el-dialog-flex-subhead {{temp.details}}
      .el-dialog-flex-block
        .el-dialog-flex-head Time
        .el-dialog-flex-subhead {{temp.time}}
      .el-dialog-flex-block
        .el-dialog-flex-head Project
        .el-dialog-flex-subhead {{getIncluded(temp.project.id)}}
      .el-dialog-flex-block
        .el-dialog-flex-head Ticket
        .el-dialog-flex-subhead {{temp.details}}
      .el-dialog-flex-block
        .el-dialog-flex-head Trello labels
        .el-dialog-flex-subhead {{temp['trello-labels']}}
</template>

<script>
import * as mixin from '@/mixins/index'
import { mapGetters } from 'vuex'
export default {
  name: 'ModalView',
  mixins: [mixin.mixValidationRules, mixin.mixDialog, mixin.mixIncludes],
  data: () => ({
    type: 'time-entries'
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
