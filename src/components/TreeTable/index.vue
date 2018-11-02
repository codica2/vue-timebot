<template>
  <el-table :data="formatData" :row-style="showRow" v-bind="$attrs" @row-click="toggleExpanded">
    <el-table-column v-for="(column, index) in columns" :key="column.value" :label="column.text" :width="column.width">
      <template slot-scope="scope">
        <!-- Todo -->
        <!-- eslint-disable-next-line vue/no-confusing-v-for-v-if -->
        <span v-for="space in scope.row._level" v-if="index === 0" :key="space" class="ms-tree-space"/>
        {{ scope.row[column.value] }}
        <span v-if="iconShow(index,scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.$index)">
          <i v-if="!scope.row._expanded" class="el-icon-arrow-down"/>
          <i v-else class="el-icon-arrow-up"/>
        </span>
      </template>
    </el-table-column>
    <slot/>
  </el-table>
</template>

<script>
import treeToArray from './eval'
export default {
  name: 'TreeTable',
  props: {
    /* eslint-disable */
    data: {
      type: [Array, Object],
      required: true
    },
    columns: {
      type: Array,
      default: () => []
    },
    evalFunc: Function,
    evalArgs: Array,
    expandAll: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    formatData: function() {
      let tmp
      if (!Array.isArray(this.data)) {
        tmp = [this.data]
      } else {
        tmp = this.data
      }
      const func = this.evalFunc || treeToArray
      const args = this.evalArgs ? Array.concat([tmp, this.expandAll], this.evalArgs) : [tmp, this.expandAll]
      return func.apply(null, args)
    }
  },
  methods: {
    showRow: function(row) {
      const show = (row.row.parent ? (row.row.parent._expanded && row.row.parent._show) : true)
      row.row._show = show
      return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;'
    },
    toggleExpanded: function(trIndex) {
      const record = trIndex
      record._expanded = !record._expanded
    },
    iconShow(index, record) {
      return ((index === 0 && record.children && record.children.length > 0) || (index === 0 && record['time_entries'] && record['time_entries'].length > 0))
    }
  }
}
</script>
<style rel="stylesheet/css">
  @keyframes treeTableShow {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @-webkit-keyframes treeTableShow {
    from { opacity: 0; }
    to { opacity: 1; }
  }
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
  $space-width: 18px;
  .ms-tree-space {
    position: relative;
    top: 1px;
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: $space-width;
    height: 14px;
    display: none;
    &::before {
      content: "";
    }
  }
  .processContainer {
    width: 100%;
    height: 100%;
  }
  table td {
    line-height: 26px;
  }
  .tree-ctrl {
    position: relative;
    cursor: pointer;
    color: #000;
    float: right;
  }
</style>
