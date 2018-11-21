export default {
  methods: {
    getIncluded(id) {
      if (this.included(this.type)) {
        const findInclude = this.included(this.type).find(pj => {
          if (pj.id === id) return pj
        })
        if (findInclude) {
          return findInclude.name
        }
      }
    }
  }
}
