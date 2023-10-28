// src/components/ChangePasswordForm/ChangePasswordForm.tsx
import { gql } from '@apollo/client'
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  Spinner,
} from '@chakra-ui/react'
import { Formik, Field, ErrorMessage, FormikHelpers } from 'formik'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

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
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    // Destructure the form values and exclude the confirmPassword field
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

  if (error) toast.error(error?.message)
  if (loading) return <Spinner />

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
            <ErrorMessage name="oldPassword" />
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
          </FormControl>
        </form>
      )}
    </Formik>
  )
}

export default ChangePasswordForm
