import * as Yup from 'yup'

export const AdminCreateUserSchema = Yup.object().shape({
  userEmail: Yup.string().email('Invalid email').required('Email is required!'),
  firstName: Yup.string().required('First name is required!'),
  lastName: Yup.string().required('Last name is required!'),
  role: Yup.string()
    .oneOf(['user', 'moderator', 'admin'], 'Invalid role')
    .required('Role selection is required!')
    .default('user'),
})
