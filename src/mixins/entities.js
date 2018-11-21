export default {
  methods: {
    createEntities(response) {
      const entities = []
      const included = []
      const data = {}
      response.data.data.forEach(dt => {
        const entity = {}
        for (const key in dt.attributes) {
          if (dt.attributes.hasOwnProperty(key)) {
            entity[key] = dt.attributes[key]
          }
        }
        for (const key in dt.relationships) {
          if (dt.relationships.hasOwnProperty(key)) {
            entity[key] = dt.relationships[key].data
          }
        }
        entity.id = dt.id
        entities.push(entity)
      })
      if (response.data.included) {
        response.data.included.forEach(ic => {
          const entity = {}
          for (const key in ic.attributes) {
            if (ic.attributes.hasOwnProperty(key)) {
              entity[key] = ic.attributes[key]
            }
          }
          entity.id = ic.id
          included.push(entity)
        })
      }
      data.data = entities
      data.included = included
      data.meta = response.data.meta
      return data
    },
    createEntity(response) {
      const included = []
      const data = {}
      const entity = {}
      for (const key in response.data.data.attributes) {
        if (response.data.data.attributes.hasOwnProperty(key)) {
          entity[key] = response.data.data.attributes[key]
        }
      }
      for (const key in response.data.data.relationships) {
        if (response.data.data.relationships.hasOwnProperty(key)) {
          entity[key] = response.data.data.relationships[key].data
        }
      }
      if (response.data.included) {
        response.data.included.forEach(ic => {
          const entity = {}
          for (const key in ic.attributes) {
            if (ic.attributes.hasOwnProperty(key)) {
              entity[key] = ic.attributes[key]
            }
          }
          entity.id = ic.id
          included.push(entity)
        })
      }
      entity.id = response.data.data.id
      data.data = entity
      data.included = included
      return data
    }
  }
}
