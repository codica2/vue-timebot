<template lang="pug">
  div(style="width: 25%")
    strong Filters
    div
      div Name
        el-select(v-model="filter.name.trigger" placeholder="Select")
          el-option(v-for="item in filterBy" :key="item.value" :label="item.label" :value="item.value")
        el-input(v-model="filter.name.input")
      div Alias
        el-select(v-model="filter.alias.trigger" placeholder="Select")
          el-option(v-for="item in filterBy" :key="item.value" :label="item.label" :value="item.value")
        el-input(v-model="filter.alias.input")
      el-button() Filter
      el-button(@click="clearFilter") Clear Filter
</template>

<script>
export default {
  name: 'Filters',
  data: () => ({
    filterBy: [
      {
        value: 'contains',
        label: 'Contains'
      },
      {
        value: 'equals',
        label: 'Equals'
      },
      {
        value: 'starts_with',
        label: 'Starts with'
      },
      {
        value: 'ends_with',
        label: 'Ends with'
      }
    ],
    filter: {
      name: {
        trigger: '',
        input: ''
      },
      alias: {
        trigger: '',
        input: ''
      }
    }
  }),
  methods: {
    clearFilter() {
      this.filter = {
        name: {
          trigger: '',
          input: ''
        },
        alias: {
          trigger: '',
          input: ''
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
