const yup = require('yup')

module.exports = yup.object().shape({
  entry: yup.string().required('An entry file is required'),
  title: yup.string(),
  dist: yup.string()
})
