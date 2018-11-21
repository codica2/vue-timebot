export default {
  data() {
    const checkName = (rule, value, callback) => {
      if (!value) {
        callback(new Error())
      } else {
        callback()
      }
    }
    const checkProject = (rule, value, callback) => {
      if (!value.id) {
        callback(new Error())
      } else {
        callback()
      }
    }
    const checkUser = (rule, value, callback) => {
      if (!value.id) {
        callback(new Error())
      } else {
        callback()
      }
    }
    const checkDate = (rule, value, callback) => {
      if (!value) {
        callback(new Error())
      } else {
        callback()
      }
    }
    const checkRole = (rule, value, callback) => {
      if (!value) {
        callback(new Error())
      } else {
        callback()
      }
    }
    return {
      rules: {
        date: [{ validator: checkDate, type: 'date', required: true, message: 'Date is required', trigger: 'blur' }],
        time: [{ validator: checkDate, type: 'datetime', required: true, message: 'Time is required', trigger: 'blur' }],
        project: [{ validator: checkProject, required: true, message: 'Project is required', trigger: 'change' }],
        user: [{ validator: checkUser, required: true, message: 'User is required', trigger: 'change' }],
        name: [{ validator: checkName, required: true, message: 'Name is required', trigger: 'change' }],
        role: [{ validator: checkRole, required: true, message: 'Role is required', trigger: 'change' }],
        reason: [{ validator: checkRole, required: true, message: 'Reason is required', trigger: 'change' }],
        team: [{ required: false, message: 'Team is required', trigger: 'change' }],
        description: [{ validator: checkName, required: true, message: 'Description is required', trigger: 'change' }],
        password: [{ validator: checkName, required: true, message: 'Password is required', trigger: 'change' }],
        email: [{ required: true, message: 'Please input email address', trigger: 'blur' },
          { type: 'email', message: 'Please input correct email address', trigger: ['blur', 'change'] }]
      }
    }
  }
}
