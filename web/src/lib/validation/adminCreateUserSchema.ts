import * as Yup from 'yup'

export const AdminCreateUserSchema = Yup.object().shape({
  userEmail: Yup.string()
    .email('Provide a valid email address')
    .required('Email is required!'),
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters!')
    .required('First name is required!'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters!')
    .required('Last name is required!'),
  role: Yup.string()
    .oneOf(['user', 'moderator', 'admin'], 'Invalid role')
    .required('Role selection is required!')
    .default('user'),
})
