<template lang="pug">
  el-dialog.el-dialog-view(:title="textMap[status]" :visible="modalVisible('view')" @close="closeModal")
    .el-dialog-flex
      .el-dialog-flex-block
        .el-dialog-flex-head Users name
        .el-dialog-flex-subhead {{temp.name}}
      .el-dialog-flex-block
        .el-dialog-flex-head UID
        .el-dialog-flex-subhead {{temp.uid}}
      .el-dialog-flex-block
        .el-dialog-flex-head Team
        .el-dialog-flex-subhead {{setTeam(temp.team)}}
      .el-dialog-flex-block
        .el-dialog-flex-head Created at
        .el-dialog-flex-date
          .el-dialog-flex-subhead <img src="/static/icons/ic-calendar.svg">
            span(v-if="temp['created-at']") {{temp['created-at'].date}}
          .el-dialog-flex-subhead <img src="/static/icons/ic-time-hover.svg">
            span(v-if="temp['created-at']") {{temp['created-at'].time}}
      .el-dialog-flex-block
        .el-dialog-flex-head Status
        .el-dialog-flex-subhead
          span(v-if="temp['is-active']") Active
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
      list: 'actionEntityTable/list',
      temp: 'modals/temp',
      status: 'modals/status',
      modalVisible: 'modals/visible'
    })
  },
  methods: {
    closeModal() {
      this.$store.dispatch('modals/toggleModal', { visible: { view: false }, status: 'view' })
    },
    setTeam(team) {
      if (team) {
        const findTeam = this.list('teams').find(tm => {
          if (tm.id === team.id) return tm
        })
        if (findTeam) {
          return findTeam.name
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
