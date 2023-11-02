import * as Yup from 'yup'

export const passwordValidation = Yup.string()
  .min(8, 'Password must be at least 8 characters')
  .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
  .matches(/[0-9]/, 'Password must contain at least one number')
  // .matches(/[!@#$%^&*]/, 'Password must contain at least one special character')
  .required('Required')

export const SignupSchema = Yup.object().shape({
  yourEmail: Yup.string().email('Invalid email').required('Required'),
  password: passwordValidation,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
})
