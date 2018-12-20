<template lang="pug">
  el-dialog.el-dialog-edit(:class="{'el-dialog-create': status === 'create'}" @open="preRemote"  @close="closeModal" :title="textMap[status]" :visible="modalVisible('edit')")
    el-form(ref="dataForm"
    :rules="rules"
    :model="temp"
    label-position="left"
    label-width="70px"
    style="width: 400px; margin-left:50px;")
      .el-dialog-edit-block
        el-form-item(label="User" prop="user")
          el-select(
          v-model="temp.user.id",
          filterable,
          remote,
          @focus="remoteGetUsers"
          placeholder="Please enter a keyword"
          :remote-method="remoteGetUsers"
          :loading="loading"
          )
            el-option(
            v-for="user in filterable('users')"
            :key="user.id"
            :label="user.name"
            :value="user.id"
            )
        el-form-item(label="Project" prop="project")
          el-select(
          clearable,
          v-model="temp.project.id"
          filterable
          remote,
          @focus="remoteGetProjects"
          placeholder="Please enter a keyword"
          :remote-method="remoteGetProjects"
          )
            el-option(v-for="project in filterable('projects')"
            :value="project.id"
            :key="project.id",
            :label="project.name")
      .el-dialog-edit-block
        el-form-item(:label="$t('table.date')" prop="date")
          el-date-picker(
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          v-model="temp.date"
          type="date"
          placeholder="Please pick a date"
          )
        el-form-item(label="Time" prop="time")
          el-tooltip(effect="dark" content="If you want record 5 hours, you need write next: 05:00" placement="top-start")
            input.el-input__inner(v-mask="'##:##'" placeholder="hh:mm" v-model="temp.time")
          <!--el-time-picker(v-model="temp.time" value-format="HH:mm" placeholder="Select time")-->
          <!--el-time-select(v-model="temp.time" :picker-options="{ start: '00:00', step: '00:10', end: '24:00' }" placeholder="Select time")-->
      .el-dialog-edit-block
        el-form-item(label="Details" prop="timestamp")
          el-input(v-model="temp.details" type="details" placeholder="Write smth")
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
  mixins: [mixin.mixValidationRules, mixin.mixDialog, mixin.mixQuery, mixin.mixIncludes],
  data: () => ({
    type: 'time-entries'
  }),
  computed: {
    entity() {
      return {
        date: this.temp.date,
        time: this.temp.time,
        details: this.temp.details,
        trello_labels: this.temp.trello_labels,
        user_id: this.temp.user ? this.temp.user.id : '',
        project_id: this.temp.project ? this.temp.project.id : ''
      }
    },
    ...mapGetters({
      temp: 'modals/temp',
      loader: 'modals/loading',
      status: 'modals/status',
      filterable: 'actionEntityTable/filterable',
      included: 'actionEntityTable/included',
      modalVisible: 'modals/visible'
    })
  },
  methods: {
    closeModal() {
      this.$store.dispatch('modals/toggleModal', { visible: { edit: false }, loading: false, status: this.status })
    },
    update() {
      const entity = {
        id: this.temp.id,
        time_entry: this.entity
      }
      this.updateEntity(entity)
    },
    create() {
      const entity = {
        time_entry: this.entity
      }
      this.createEntity(entity)
    },
    preRemote() {
      this.remoteGetProjects()
      this.remoteGetUsers()
    },
    delete() {
      const entity = {
        time_entry_ids: this.multipleSelection
      }
      return entity
    }
  }
}
</script>

<style scoped>

</style>
