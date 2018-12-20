<template lang="pug">
  el-dialog.el-dialog-edit(:class="{'el-dialog-create': status === 'create'}" @close="closeModal" :title="textMap[status]" :visible="modalVisible('edit')")
    el-form(ref="dataForm"
    :rules="rules"
    :model="temp"
    label-position="left"
    label-width="70px"
    style="width: 400px; margin-left:50px;"
    )
      .el-dialog-edit-block
        el-form-item(label="User" prop="user")
          el-select(
          v-model="temp.user.id",
          filterable,
          remote,
          @focus="remoteGetUsers"
          placeholder="Please enter a keyword"
          :remote-method="remoteGetUsers"
          :loading="loader"
          clearable
          )
            el-option(
            v-for="(user, userIndex) in included(type)"
            :key="userIndex"
            :label="user.name"
            :value="user.id"
            )
        el-form-item(label="Date" prop="date")
          el-date-picker(
          v-if="status === 'update'"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          v-model="temp.date" type="date" placeholder="Please pick a date")
          el-date-picker(
          v-else
          format="yyyy-MM-dd"
          start-placeholder="Start date"
          end-placeholder="End date"
          value-format="yyyy-MM-dd"
          v-model="temp.date" type="dates" placeholder="Please pick a date")
      .el-dialog-edit-block
        el-form-item(label="Reason" prop="reason")
          el-radio-group(v-model="temp.reason")
            el-radio(label="vacation") Vacation
            el-radio(label="illness") Illness
            el-radio(label="other") Other
        el-form-item(label="Comment" prop="comment")
          el-input(placeholder="Please input" v-model="temp.comment" clearable)
      .el-dialog-edit-block-last(style="margin-top: 20px")
        div(slot="footer" class="dialog-footer")
          el-button(@click="closeModal") {{ $t('table.cancel') }}
          el-button(v-if="status === 'create'" type="primary" :loading="loader" @click="create") {{ $t('table.confirm') }}
          el-button(v-else type="primary" :loading="loader" @click="update") Update
</template>

<script>
import * as mixin from '@/mixins/index'
import { mapGetters } from 'vuex'
export default {
  name: 'ModalEdit',
  mixins: [mixin.mixValidationRules, mixin.mixDialog, mixin.mixQuery, mixin.mixIncludes],
  data: () => ({
    type: 'absences'
  }),
  computed: {
    ...mapGetters({
      temp: 'modals/temp',
      loader: 'modals/loading',
      status: 'modals/status',
      modalVisible: 'modals/visible',
      included: 'actionEntityTable/included'
    }),
    entity() {
      return {
        date: this.temp.date,
        reason: this.temp.reason,
        comment: this.temp.comment,
        user_id: this.temp.user ? this.temp.user.id : ''
      }
    }
  },
  methods: {
    closeModal() {
      this.$store.dispatch('modals/toggleModal', { visible: { edit: false }, loading: false, status: this.status })
    },
    update() {
      const entity = {
        id: this.temp.id,
        absence: this.entity
      }
      this.updateEntity(entity)
    },
    create() {
      const date = JSON.parse(JSON.stringify(this.entity.date))
      const entities = { absences: [] }
      for (let i = 0; i < date.length; i++) {
        const entity = {
          absence: JSON.parse(JSON.stringify(this.entity))
        }
        entity.absence.date = date[i]
        entities.absences.push(entity)
      }
      this.createEntity(entities)
    },
    delete() {
      const entity = {
        absence_ids: this.multipleSelection
      }
      return entity
    }
  }
}
</script>

<style scoped>

</style>
