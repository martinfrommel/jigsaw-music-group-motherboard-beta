// src/components/ChangePasswordForm/ChangePasswordForm.tsx
import { gql } from '@apollo/client'
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  Spinner,
  BoxProps,
  FormErrorMessage,
  FormErrorIcon,
} from '@chakra-ui/react'
import { Formik, FormikHelpers } from 'formik'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import FailedToFetchData from 'src/components/DataFetching/FailedToFetchData/FailedToFetchData'
import PasswordConfirmationField from 'src/components/PasswordConfirmationField/PasswordConfirmationField'
import { ChangePasswordSchema } from 'src/lib/validation/changePasswordSchema'

const UPDATE_USER_PASSWORD_MUTATION = gql`
  mutation UpdateUserPasswordMutation(
    $id: String!
    $input: UpdatePasswordInput!
  ) {
    updateUserPassword(id: $id, input: $input) {
      id
    }
  }
`

interface ChangePasswordFormProps extends BoxProps {
  userId: number
}

interface FormValues {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  userId,
  ...rest
}) => {
  const [updateUserPassword, { loading, error }] = useMutation(
    UPDATE_USER_PASSWORD_MUTATION
  )

  const onSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    // Destructure the form values and exclude the confirmPassword field
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...inputValues } = values

    try {
      await updateUserPassword({
        variables: { id: String(userId), input: inputValues },
      })
      toast.success('Password changed successfully!')
    } finally {
      setSubmitting(false)
    }
  }

  if (error) return <FailedToFetchData>{error?.message}</FailedToFetchData>
  if (loading) return <Spinner />

  return (
    <Box
      {...rest}
      minWidth={96}
      width={'50vw'}
      transition={'all 1s ease-in-out'}
    >
      <Formik
        initialValues={{
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        }}
        onSubmit={onSubmit}
        validationSchema={ChangePasswordSchema}
        validateOnBlur={true}
        validateOnChange={true}
        validateOnMount={false}
      >
        {(props) => (
          <form onSubmit={props.handleSubmit}>
            <FormControl
              isInvalid={props.errors.oldPassword && props.touched.oldPassword}
            >
              <FormLabel>Old Password</FormLabel>
              <Input
                type="password"
                name="oldPassword"
                value={props.values.oldPassword}
                onChange={props.handleChange}
              />

              <FormErrorMessage>
                <FormErrorIcon />
                {props.errors?.oldPassword}
              </FormErrorMessage>
            </FormControl>
            <PasswordConfirmationField
              passwordMeterProps={{
                password: props.values.newPassword,
                confirmPassword: props.values.confirmPassword,
              }}
              passwordProps={{
                fieldname: 'newPassword',
                fieldtext: 'New Password',
                isInvalid:
                  props.errors.newPassword && props.touched.newPassword,
                onChange: props.handleChange,
              }}
              confirmPasswordProps={{
                fieldname: 'confirmPassword',
                isInvalid:
                  props.errors.confirmPassword && props.touched.confirmPassword,
                onChange: props.handleChange,
              }}
            />

            <Box mt={4}>
              <Button
                type="submit"
                isLoading={props.isSubmitting}
                colorScheme="blue"
                loadingText="Changing Password"
                spinnerPlacement="start"
              >
                Change Password
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  )
}

export default ChangePasswordForm
