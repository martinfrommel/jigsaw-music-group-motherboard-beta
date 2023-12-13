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

import FailedToFetchData from 'src/components/DataFetching/FailedToFetchData/FailedToFetchData'
import { capitalizeFirstLetter } from 'src/lib/capitalizeFirstLetter'
import { useIsAdmin } from 'src/lib/isAdmin'
import { setRandomAvatar } from 'src/lib/setRandomAvatar'
import { AdminCreateUserSchema } from 'src/lib/validation/adminCreateUserSchema'

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
  const {
    data: rolesData,
    loading: loadingRoles,
    error: getRolesError,
  } = useQuery(GET_ROLES)
  const [adminCreateUser, { error: createUserError }] = useMutation(
    CREATE_ADMIN_USER_MUTATION
  )
  const isAdmin = useIsAdmin()

  // focus on your email box on page load
  const yourEmailRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    yourEmailRef.current?.focus()
  }, [])

  const onSubmit = async (
    formData: Record<string, string>,
    { setSubmitting, setErrors }
  ) => {
    if (!AdminCreateUserSchema.isValid(formData)) {
      toast.error('Some fields are required')
      return
    }

    // Show a loading toast without a timeout
    const toastId = toast.loading('Creating user...')

    const setAvatar = setRandomAvatar()
    const input = {
      email: formData.userEmail,
      firstName: formData.firstName,
      lastName: formData.lastName,
      roles: formData.role,
      picture: setAvatar,
    }

    try {
      await adminCreateUser({ variables: { input } })
      // Dismiss the loading toast and show a success message
      toast.dismiss(toastId)
      toast.success('User created successfully!')
    } catch (error) {
      // Dismiss the loading toast and show an error message
      toast.dismiss(toastId)
      toast.error('Failed: ' + createUserError?.message)
      setErrors({ api: createUserError.message })
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
                  onBlur={props.handleBlur}
                >
                  <FormLabel mt={4}>First Name</FormLabel>
                  <Input
                    type="text"
                    name="firstName"
                    value={props.values.firstName}
                    onChange={props.handleChange}
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
                  onBlur={props.handleBlur}
                >
                  <FormLabel mt={4}>Last Name</FormLabel>
                  <Input
                    type="text"
                    name="lastName"
                    value={props.values.lastName}
                    onChange={props.handleChange}
                  />
                  <FormErrorMessage>
                    <FormErrorIcon />
                    {props.errors?.lastName}
                  </FormErrorMessage>
                </FormControl>
              </Flex>
              <Flex mt={4}>
                <FormControl
                  flex={1}
                  isInvalid={props.errors.userEmail && props.touched.userEmail}
                  onBlur={props.handleBlur}
                >
                  <FormLabel>{"User's email"}</FormLabel>
                  <Input
                    type="email"
                    name="userEmail"
                    onChange={props.handleChange}
                    isInvalid={
                      props.errors.userEmail && props.touched.userEmail
                    }
                  />
                  <FormErrorMessage>
                    <FormErrorIcon />
                    {props.errors.userEmail}
                  </FormErrorMessage>
                </FormControl>
                {showRoleSelection && isAdmin && (
                  <>
                    <FormControl
                      flex={1}
                      ml={4}
                      isInvalid={!!props.errors.role}
                      onBlur={props.handleBlur}
                    >
                      <FormLabel>Role</FormLabel>
                      {/* If loading, show a spinner */}
                      {loadingRoles && <Spinner />}
                      {/* If there's an error, show the FailedToFetchData component */}
                      {getRolesError && (
                        <FailedToFetchData>
                          {getRolesError.message}
                        </FailedToFetchData>
                      )}
                      {/* If data is available, show the Select component */}
                      {!loadingRoles && !getRolesError && (
                        <>
                          <Select
                            name="role"
                            value={props.values.role}
                            onChange={props.handleChange}
                            isInvalid={props.errors.role && props.touched.role}
                          >
                            {rolesData?.__type.enumValues.map((role) => (
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

              <Button
                mt={12}
                type="submit"
                isLoading={props.isSubmitting}
                colorScheme="green"
                loadingText="Creating new user"
                spinnerPlacement="start"
                w={'full'}
              >
                Create a user
              </Button>
            </form>
          )}
        </Formik>
      </Box>
    </>
  )
}

export default CreateUserForm
