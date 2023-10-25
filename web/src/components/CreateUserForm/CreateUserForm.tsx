import { Formik, Field, ErrorMessage } from 'formik'
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  Select,
  FormErrorMessage,
} from '@chakra-ui/react'
import * as Yup from 'yup'
import { useAuth } from 'src/auth'
import { toast, Toaster } from '@redwoodjs/web/toast'
import { useState } from 'react'

const SignupSchema = Yup.object().shape({
  yourEmail: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is equired'),
  role: Yup.string()
    .oneOf(['user', 'moderator', 'admin'], 'Invalid role')
    .required('Required'),
})

const CreateUserForm = () => {
  const { signUp } = useAuth()

  const onSubmit = async (data, { setSubmitting, setErrors }) => {
    if (!SignupSchema.isValid(data)) {
      toast.error('Some fields are required')
      return
    }

    try {
      const response = await signUp({
        username: data.yourEmail,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
      })

      // Handle the response here, e.g., navigate to another page or show a success message
      toast.success('User created successfully!')
    } catch (error) {
      // Handle any errors from the signUp function, e.g., show an error message
      toast.error('Error creating user. Please try again.')
      setErrors({ api: error.message }) // This is just an example. Adjust based on the error structure you expect.
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Toaster />
      <Formik
        initialValues={{
          yourEmail: '',
          password: '',
          firstName: '',
          lastName: '',
          role: 'user', // default to 'user'
        }}
        onSubmit={onSubmit}
        validationSchema={SignupSchema}
        validateOnBlur={true}
        validateOnChange={true}
        isInitialValid={false}
      >
        {(props) => (
          <form onSubmit={props.handleSubmit}>
            <FormControl>
              <FormLabel>User's email</FormLabel>
              <Input
                type="email"
                name="yourEmail"
                onChange={props.handleChange}
                value={props.values.yourEmail}
              />
              <FormErrorMessage>
                <ErrorMessage name="yourEmail" />
              </FormErrorMessage>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                name="password"
                onChange={props.handleChange}
                value={props.values.password}
              />
              <FormErrorMessage>
                <ErrorMessage name="password" />
              </FormErrorMessage>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type="password"
                name="confirmPassword"
                onChange={props.handleChange}
                value={props.values.confirmPassword}
              />
              <FormErrorMessage>
                <ErrorMessage name="confirmPassword" />
              </FormErrorMessage>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>First Name</FormLabel>
              <Input
                type="text"
                name="firstName"
                onChange={props.handleChange}
                value={props.values.firstName}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Last Name</FormLabel>
              <Input
                type="text"
                name="lastName"
                onChange={props.handleChange}
                value={props.values.lastName}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Role</FormLabel>
              <Select
                name="role"
                onChange={props.handleChange}
                value={props.values.role}
              >
                <option value="user">User</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </Select>
            </FormControl>

            <Box mt={4}>
              <Button type="submit" isLoading={props.isSubmitting}>
                Create a user
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </>
  )
}

export default CreateUserForm
