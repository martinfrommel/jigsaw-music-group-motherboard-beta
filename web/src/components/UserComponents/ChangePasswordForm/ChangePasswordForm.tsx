// src/components/ChangePasswordForm/ChangePasswordForm.tsx
import { gql } from '@apollo/client'
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  FormErrorMessage,
  Spinner,
} from '@chakra-ui/react'
import { Formik, Field, ErrorMessage, FormikHelpers } from 'formik'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import FailedToFetchData from 'src/components/DataFetching/FailedToFetchData/FailedToFetchData'
import PasswordConfirmationField from 'src/components/PasswordConfirmationField/PasswordConfirmationField'
import { ChangePasswordSchema } from 'src/lib/changePasswordSchema'

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

interface ChangePasswordFormProps {
  userId: number
}

interface FormValues {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ userId }) => {
  const [updateUserPassword, { loading, error }] = useMutation(
    UPDATE_USER_PASSWORD_MUTATION
  )
  const onSubmit = async (
    values: FormValues,
    { setSubmitting, setFieldError }: FormikHelpers<FormValues>
  ) => {
    try {
      await updateUserPassword({ variables: { id: userId, input: values } })
      toast.success('Password changed successfully!')
    } catch (error) {
      // Assuming error message is accessible via error.message
      toast.error(error.message)

      // Optionally set field-specific error messages
      if (error.message.includes('Incorrect old password')) {
        setFieldError('oldPassword', 'Incorrect old password')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Spinner />
  if (error) return <FailedToFetchData>{error?.message}</FailedToFetchData>

  return (
    <Formik
      initialValues={{ oldPassword: '', newPassword: '', confirmPassword: '' }}
      onSubmit={onSubmit}
      validationSchema={ChangePasswordSchema}
      validateOnBlur={true}
      validateOnChange={true}
      validateOnMount={false}
    >
      {(props) => (
        <form onSubmit={props.handleSubmit}>
          <FormControl>
            <FormLabel>Old Password</FormLabel>
            <Field
              as={Input}
              type="password"
              name="oldPassword"
              isInvalid={props.errors.oldPassword && props.touched.oldPassword}
            />
            <ErrorMessage name="oldPassword" component={FormErrorMessage} />
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
            <ErrorMessage name="confirmPassword" component={FormErrorMessage} />

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
          </FormControl>
        </form>
      )}
    </Formik>
  )
}

export default ChangePasswordForm
