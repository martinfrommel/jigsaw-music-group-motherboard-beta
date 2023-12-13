import { Box, BoxProps, Button, Spinner } from '@chakra-ui/react'
import { Formik } from 'formik'

import { navigate, routes } from '@redwoodjs/router'
import { MetaTags, useMutation, useQuery } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/dist/toast'

import { useAuth } from 'src/auth'
import AlreadyAuthenticatedAlert from 'src/components/DataFetching/AlreadyAuthenticatedAlert/AlreadyAuthenticatedAlert'
import FailedToFetchData from 'src/components/DataFetching/FailedToFetchData/FailedToFetchData'
import JigsawCard from 'src/components/JigsawCard/JigsawCard'
import PasswordConfirmationField from 'src/components/PasswordConfirmationField/PasswordConfirmationField'
import { SetPasswordSchema } from 'src/lib/validation/setPasswordSchema'

const SET_USER_PASSWORD = gql`
  mutation SetUserPasswordMutation($token: String!, $newPassword: String!) {
    setUserPassword(token: $token, newPassword: $newPassword) {
      id
    }
  }
`

const VALIDATE_TOKEN = gql`
  query ValidateSignUpTokenQuery($token: String!) {
    validateSignUpToken(signUpToken: $token)
  }
`

interface SetPasswordFormProps extends BoxProps {
  userId?: number
}

interface FormValues {
  newPassword: string
  confirmPassword: string
}

const SetPasswordPage: React.FC<SetPasswordFormProps> = () => {
  const token = new URLSearchParams(window.location.search).get('token')
  const { isAuthenticated } = useAuth()
  const [setUserPassword, { error: setPasswordError }] =
    useMutation(SET_USER_PASSWORD)
  const { loading, error: validationError } = useQuery(VALIDATE_TOKEN, {
    variables: { token },
  })

  const onSubmit = async (formData: FormValues, { setSubmitting }) => {
    if (!SetPasswordSchema.isValid(formData)) {
      toast.error('Some fields are required')
      return
    }

    console.log('Using this token:' + token)

    // Show a loading toast without a timeout
    const loadingToast = toast.loading('Setting the password...')

    try {
      await setUserPassword({
        variables: { token: token, newPassword: formData.newPassword },
      })
      // Dismiss the loading toast and show a success message
      toast.dismiss(loadingToast)
      toast.success('You new password was set successfully!', {
        icon: '🥳',
      })
      toast.loading('Redirecting you to login page!', {
        duration: 2500,
      })
      setTimeout(() => {
        navigate(routes.login())
      }, 2500)
    } catch (error) {
      // Dismiss the loading toast and show an error message
      toast.dismiss(loadingToast)
      toast.error('Failed: ' + setPasswordError?.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (isAuthenticated) {
    setTimeout(() => {
      navigate(routes.home())
    }, 3000)
    return <AlreadyAuthenticatedAlert />
  }

  if (loading) {
    return <Spinner />
  }

  if (validationError) {
    console.log(token)
    return <FailedToFetchData>{validationError.message}</FailedToFetchData>
  }

  return (
    <>
      <MetaTags
        title="Set Password"
        description="Set your password when your account was created."
        robots={['noindex', 'nofollow']}
      />

      <JigsawCard>
        <JigsawCard.Header>Set a new password</JigsawCard.Header>
        <JigsawCard.Body>
          <Formik
            initialValues={{
              newPassword: '',
              confirmPassword: '',
            }}
            onSubmit={onSubmit}
            validationSchema={SetPasswordSchema}
            validateOnBlur={true}
            validateOnChange={true}
            validateOnMount={false}
          >
            {(props) => (
              <form onSubmit={props.handleSubmit}>
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
                      props.errors.confirmPassword &&
                      props.touched.confirmPassword,
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
        </JigsawCard.Body>
      </JigsawCard>
    </>
  )
}

export default SetPasswordPage
