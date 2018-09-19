<template lang="pug">
  div Filters
    el-select(v-model="user" placeholder="Select")
      el-option(v-for="item in users" :key="item.value" :label="item.label" :value="item.value")
    el-select(v-model="project" placeholder="Select")
      el-option(v-for="item in projects" :key="item.value" :label="item.label" :value="item.value")
    div(v-for="(textarea, textareaIndex) in textareas" :key="textareaIndex")
      textarea(v-model="textarea.input")
      div(@click="addSearchQuery" v-if="textareaIndex + 1 === textareas.length") OR
      div(v-else) OR
    el-date-picker(v-model="searchDate" type="daterange" range-separator="To" start-placeholder="Start date"
    end-placeholder="End date")
    div
      el-button Filter
      el-button(type="primary") Clear Filters
</template>

<script>
export default {
  name: "filters",
  data: () => ({
    textareas: [
      {input: ''}
    ],
    searchDate: [],
    users: [{
      value: 'Option1',
      label: 'Option1'
    }, {
      value: 'Option2',
      label: 'Option2'
    }, {
      value: 'Option3',
      label: 'Option3'
    }, {
      value: 'Option4',
      label: 'Option4'
    }, {
      value: 'Option5',
      label: 'Option5'
    }],
    projects: [{
      value: 'Option1',
      label: 'Option1'
    }, {
      value: 'Option2',
      label: 'Option2'
    }, {
      value: 'Option3',
      label: 'Option3'
    }, {
      value: 'Option4',
      label: 'Option4'
    }, {
      value: 'Option5',
      label: 'Option5'
    }],
    user: '',
    project: '',
  }),
  methods: {
    addSearchQuery () {
      this.textareas.push({input: ''})
    }
  }
}
</script>

<style scoped>

</style>
