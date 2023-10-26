import { Formik, Field, ErrorMessage } from 'formik'
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  Select,
  FormErrorMessage,
  Skeleton,
} from '@chakra-ui/react'
import { useAuth } from 'src/auth'
import { toast } from '@redwoodjs/web/toast'
import { useEffect, useRef, useState } from 'react'

import { SignupSchema } from 'src/lib/signUpSchema'
import PasswordMeter from '../PasswordMeter/PasswordMeter'
import { useIsAdmin } from 'src/lib/isAdmin'

const CreateUserForm = ({ showRoleSelection = false, ...props }) => {
  const { isAuthenticated, hasRole, signUp } = useAuth()

  const isAdmin = useIsAdmin()

  // focus on your email box on page load
  const yourEmailRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    yourEmailRef.current?.focus()
  }, [])

  const onSubmit = async (
    data: Record<string, string>,
    { setSubmitting, setErrors }
  ) => {
    if (!SignupSchema.isValid(data)) {
      toast.error('Some fields are required')
      return
    }

    try {
      await signUp({
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
      <Formik
        initialValues={{
          yourEmail: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
          role: 'user', // default to 'user'
        }}
        onSubmit={onSubmit}
        validationSchema={SignupSchema}
        validateOnBlur={true}
        validateOnChange={true}
        validateOnMount={false}
      >
        {(props) => (
          <form onSubmit={props.handleSubmit}>
            <FormControl>
              <FormLabel>User's email</FormLabel>
              <Input
                type="email"
                name="yourEmail"
                onChange={props.handleChange}
                isInvalid={props.errors.yourEmail && props.touched.yourEmail}
              />
              <FormErrorMessage>{props.errors.yourEmail}</FormErrorMessage>

              <FormLabel mt={4}>Password</FormLabel>
              <Input
                type="password"
                name="password"
                onChange={props.handleChange}
                value={props.values.password}
                isInvalid={props.errors.password && props.touched.password}
              />
              <ErrorMessage name="password" component={FormErrorMessage} />

              <FormLabel mt={4}>Confirm Password</FormLabel>
              <Input
                type="password"
                name="confirmPassword"
                onChange={props.handleChange}
                value={props.values.confirmPassword}
                isInvalid={
                  props.errors.confirmPassword && props.touched.confirmPassword
                }
              />
              <ErrorMessage
                name="confirmPassword"
                component={FormErrorMessage}
              />

              <PasswordMeter
                password={props.values.password}
                confirmPassword={props.values.confirmPassword}
                mt={4}
              />

              <FormLabel mt={4}>First Name</FormLabel>
              <Input
                type="text"
                name="firstName"
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                value={props.values.firstName}
                isInvalid={props.errors.firstName && props.touched.firstName}
              />
              <ErrorMessage name="firstName" component={FormErrorMessage} />

              <FormLabel mt={4}>Last Name</FormLabel>
              <Input
                type="text"
                name="lastName"
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                value={props.values.lastName}
                isInvalid={props.errors.lastName && props.touched.lastName}
              />
              <ErrorMessage name="lastName" component={FormErrorMessage} />

              {showRoleSelection && isAdmin && (
                <>
                  <FormLabel mt={4}>Role</FormLabel>
                  <Select
                    name="role"
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.role}
                    isInvalid={props.errors.role && props.touched.role}
                  >
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </Select>
                </>
              )}

              <ErrorMessage name="role" component={FormErrorMessage} />

              <Box mt={4}>
                <Button
                  type="submit"
                  isLoading={props.isSubmitting}
                  colorScheme="blue"
                  loadingText="Creating new user"
                  spinnerPlacement="start"
                >
                  Create a user
                </Button>
              </Box>
            </FormControl>
          </form>
        )}
      </Formik>
    </>
  )
}

export default CreateUserForm
