'use strict'
import Vue from 'vue'
export default function treeToArray(data, expandAll, parent, level, item) {
  const marLTemp = []
  let tmp = []
  Array.from(data).forEach(function(record) {
    if (record._expanded === undefined) {
      Vue.set(record, '_expanded', expandAll)
    }
    let _level = 1
    if (level !== undefined && level !== null) {
      _level = level + 1
    }
    Vue.set(record, '_level', _level)
    if (parent) {
      Vue.set(record, 'parent', parent)
      if (!marLTemp[_level]) {
        marLTemp[_level] = 0
      }
      Vue.set(record, '_marginLeft', marLTemp[_level] + parent._marginLeft)
      Vue.set(record, '_width', record[item] / parent[item] * parent._width)
      marLTemp[_level] += record._width
    } else {
      marLTemp[record.id] = []
      marLTemp[record.id][_level] = 0
      Vue.set(record, '_marginLeft', 0)
      Vue.set(record, '_width', 1)
    }
    Vue.set(record, '_expanded', false)
    tmp.push(record)
    if (record.time_entries && record.time_entries.length > 0) {
      const children = treeToArray(record.time_entries, expandAll, record, _level, item)
      tmp = tmp.concat(children)
    }
  })
  return tmp
}
