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

import { useMutation, useQuery } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
import FailedToFetchData from 'src/components/DataFetching/FailedToFetchData/FailedToFetchData'
import { AdminCreateUserSchema } from 'src/lib/adminCreateUserSchema'
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
const CREATE_ADMIN_USER_MUTATION = gql`
  mutation AdminCreateUser($input: AdminCreateUserInput!) {
    adminCreateUser(input: $input) {
      firstName
      lastName
      email
      roles
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
  const [adminCreateUser] = useMutation(CREATE_ADMIN_USER_MUTATION)
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
    if (!AdminCreateUserSchema.isValid(data)) {
      toast.error('Some fields are required')
      return
    }

    const setAvatar = setRandomAvatar()
    const input = {
      email: data.userEmail,
      firstName: data.firstName,
      lastName: data.lastName,
      roles: data.role,
      picture: setAvatar,
    }

    try {
      await adminCreateUser({ variables: { input } })
      toast.success('User created successfully!')
    } catch (error) {
      toast.error(error?.message)
      setErrors({ api: error.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Box {...rest}>
        <Formik
          initialValues={{
            userEmail: '',
            firstName: '',
            lastName: '',
            role: 'user', // default to 'user'
          }}
          onSubmit={onSubmit}
          validationSchema={AdminCreateUserSchema}
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
                    name="userEmail"
                    onChange={props.handleChange}
                    isInvalid={
                      props.errors.userEmail && props.touched.userEmail
                    }
                  />
                  <FormErrorMessage>{props.errors.userEmail}</FormErrorMessage>
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
