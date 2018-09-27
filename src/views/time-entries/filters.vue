<template lang="pug">
  div Filters
    div
      el-select(v-model="searchParams.user" placeholder="Select")
        el-option(v-for="item in users" :key="item.value" :label="item.label" :value="item.value")
    div
      el-select(v-model="searchParams.project" placeholder="Select")
        el-option(v-for="item in projects" :key="item.value" :label="item.label" :value="item.value")
    div(v-for="(textarea, textareaIndex) in searchParams.textareas" :key="textareaIndex")
      el-input(type="textarea" v-model="textarea.input")
      div(@click="addSearchQuery" v-if="textareaIndex + 1 === searchParams.textareas.length").active OR
      div(v-else) OR
    el-date-picker(v-model="searchParams.searchDate" type="daterange" range-separator="To" start-placeholder="Start date"
    end-placeholder="End date")
    div
      el-button Filter
      el-button(type="primary") Clear Filters
</template>

<script>
export default {
  name: 'Filters',
  data: () => ({
    searchParams: {
      textareas: [
        { input: '' }
      ],
      searchDate: [],
      user: '',
      project: ''
    },
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
    }]
  }),
  methods: {
    addSearchQuery() {
      this.searchParams.textareas.push({ input: '' })
    }
  }
}
</script>

<style scoped>

</style>
