<template lang="pug">
  div
    el-dialog(:title="textMap[dialogStatus]" :visible.sync="dialogFormVisible")
      el-form(ref="dataForm"
      :rules="rules"
      :model="temp.attributes"
      label-position="left"
      label-width="70px"
      style="width: 400px; margin-left:50px;")
        el-form-item(label="Name" prop="name")
          el-input(placeholder="Please input" v-model="temp.attributes.name" clearable)
        el-form-item(label="Alias" prop="alias")
          el-input(placeholder="Please input" v-model="temp.attributes.alias" clearable)
      div(slot="footer" class="dialog-footer")
        el-button(@click="dialogFormVisible = false") {{ $t('table.cancel') }}
        el-button(type="primary" @click="updateEntity") Update
    el-dialog(:title="textMap[dialogStatus]" :visible.sync="dialogViewVisible")
      div {{temp.id}} Id
      div {{temp.attributes.name}} Project
      div {{temp.attributes.alias}} Alias
    el-dialog(:title="textMap[dialogStatus]" :visible.sync="dialogCreateVisible")
      el-form(ref="createForm"
      :rules="rules"
      :model="temp.attributes"
      label-position="left"
      label-width="70px"
      style="width: 400px; margin-left:50px;")
        el-form-item(label="Name" prop="name")
          el-input(placeholder="Please input" v-model="temp.attributes.name" clearable)
        el-form-item(label="Alias" prop="alias")
          el-input(placeholder="Please input" v-model="temp.attributes.alias" clearable)
        el-form-item(label="Team" prop="team")
      div(slot="footer" class="dialog-footer")
        el-button(@click="dialogFormVisible = false") {{ $t('table.cancel') }}
        el-button(type="primary" @click="createEntity") {{ $t('table.confirm') }}
</template>

<script>
  import * as mixin from "@/mixins/index";
  export default {
    name: 'dialogs',
    mixins: [mixin.mixValidationRules, mixin.mixPagination, mixin.mixDialog, mixin.mixQuery],
    data: () => ({
      dialogFormVisible: false,
      dialogViewVisible: false,
      dialogCreateVisible: false,
    })
  }
</script>

<style scoped>

</style>
