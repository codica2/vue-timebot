export const setQuery = (payload) => {
  switch (payload) {
    case 'projects': return '/api/v1/projects'
    case 'time-entries': return '/api/v1/time_entries'
    case 'dashboardChart': return '/api/v1/dashboard'
    case 'users': return '/api/v1/users'
    case 'teams': return '/api/v1/teams'
    case 'holidays': return '/api/v1/holidays'
    case 'absences': return '/api/v1/absences'
  }
}
