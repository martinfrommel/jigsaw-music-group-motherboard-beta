import { useEffect, useRef } from 'react'

import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  Select,
  FormErrorMessage,
  Spinner,
  BoxProps,
  FormErrorIcon,
  Flex,
} from '@chakra-ui/react'
import { Formik } from 'formik'

import { useQuery } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
import FailedToFetchData from 'src/components/DataFetching/FailedToFetchData/FailedToFetchData'
import PasswordConfirmationField from 'src/components/PasswordConfirmationField/PasswordConfirmationField'
import { capitalizeFirstLetter } from 'src/lib/capitalizeFirstLetter'
import { useIsAdmin } from 'src/lib/isAdmin'
import { setRandomAvatar } from 'src/lib/setRandomAvatar'
import { SignupSchema } from 'src/lib/signUpSchema'

const GET_ROLES = gql`
  query getRoles {
    __type(name: "Role") {
      enumValues {
        name
      }
    }
  }
`

const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      firstName
      lastName
      email
    }
  }
`

interface createUserFormProps extends BoxProps {
  showRoleSelection: boolean
}

const CreateUserForm = ({
  showRoleSelection = false,
  ...rest
}: createUserFormProps) => {
  const { data, loading, error } = useQuery(GET_ROLES)

  const { signUp } = useAuth()

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
      const setAvatar = setRandomAvatar()
      await signUp({
        username: data.yourEmail,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        picture: setAvatar,
      })

      // Handle the response here, e.g., navigate to another page or show a success message
      toast.success('User created successfully!')
    } catch (error) {
      // Handle any errors from the signUp function, e.g., show an error message
      toast.error('Error creating user. Please try again.')
      setErrors({ api: error.message }) // This is just an example. Adjust based on the error structure you expect.
    } finally {
      setSubmitting(false)
      toast.dismiss()
    }
  }

  return (
    <>
      <Box {...rest}>
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
              <Flex>
                <FormControl
                  flex={1}
                  isInvalid={props.errors.firstName && props.touched.firstName}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                >
                  <FormLabel mt={4}>First Name</FormLabel>
                  <Input
                    type="text"
                    name="firstName"
                    value={props.values.firstName}
                  />
                  <FormErrorMessage>
                    <FormErrorIcon />
                    {props.errors?.lastName}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  flex={1}
                  ml={4}
                  isInvalid={props.errors.lastName && props.touched.lastName}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                >
                  <FormLabel mt={4}>Last Name</FormLabel>
                  <Input
                    type="text"
                    name="lastName"
                    value={props.values.lastName}
                  />
                  <FormErrorMessage>
                    <FormErrorIcon />
                    {props.errors?.lastName}
                  </FormErrorMessage>
                </FormControl>
              </Flex>
              <Flex mt={4}>
                <FormControl flex={1}>
                  <FormLabel>{"User's email"}</FormLabel>
                  <Input
                    type="email"
                    name="yourEmail"
                    onChange={props.handleChange}
                    isInvalid={
                      props.errors.yourEmail && props.touched.yourEmail
                    }
                  />
                  <FormErrorMessage>{props.errors.yourEmail}</FormErrorMessage>
                </FormControl>
                {showRoleSelection && isAdmin && (
                  <>
                    <FormControl
                      flex={1}
                      ml={4}
                      isInvalid={!!props.errors.role}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    >
                      <FormLabel>Role</FormLabel>
                      {/* If loading, show a spinner */}
                      {loading && <Spinner />}
                      {/* If there's an error, show the FailedToFetchData component */}
                      {error && (
                        <FailedToFetchData>{error.message}</FailedToFetchData>
                      )}
                      {/* If data is available, show the Select component */}
                      {!loading && !error && (
                        <>
                          <Select
                            name="role"
                            value={props.values.role}
                            isInvalid={props.errors.role && props.touched.role}
                          >
                            {data?.__type.enumValues.map((role) => (
                              <option key={role.name} value={role.name}>
                                {capitalizeFirstLetter(role.name)}
                              </option>
                            ))}
                          </Select>
                          <FormErrorMessage>
                            <FormErrorIcon />
                            {props.errors?.role}
                          </FormErrorMessage>
                        </>
                      )}
                    </FormControl>
                  </>
                )}
              </Flex>
              <PasswordConfirmationField
                passwordMeterProps={{
                  password: props.values.password,
                  confirmPassword: props.values.confirmPassword,
                }}
                passwordProps={{
                  fieldtext: 'Password',
                  fieldname: 'password',
                  isInvalid: props.errors.password && props.touched.password,
                  onChange: props.handleChange,
                }}
                confirmPasswordProps={{
                  fieldname: 'confirmPassword',
                  isInvalid:
                    props.errors.confirmPassword &&
                    props.touched.confirmPassword,
                  onChange: props.handleChange,
                }}
              />
              <Box mt={4}>
                <Button
                  type="submit"
                  isLoading={props.isSubmitting}
                  colorScheme="green"
                  loadingText="Creating new user"
                  spinnerPlacement="start"
                >
                  Create a user
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </>
  )
}

export default CreateUserForm
