export const setQuery = (payload) => {
  switch (payload) {
    case 'projects': return '/api/v1/projects'
    case 'time-entries': return ''
  }
}
