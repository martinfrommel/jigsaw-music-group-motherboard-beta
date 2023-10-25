import * as Yup from 'yup'

export const passwordValidation = Yup.string()
  .min(8, 'Password must be at least 8 characters')
  .required('Required')

export const SignupSchema = Yup.object().shape({
  yourEmail: Yup.string().email('Invalid email').required('Required'),
  password: passwordValidation,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  role: Yup.string()
    .oneOf(['user', 'moderator', 'admin'], 'Invalid role')
    .required('Required'),
})
