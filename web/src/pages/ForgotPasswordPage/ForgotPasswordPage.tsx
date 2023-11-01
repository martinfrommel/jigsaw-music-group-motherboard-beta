import { useEffect } from 'react'

import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  FormErrorIcon,
  CardHeader,
  Card,
  ButtonGroup,
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { Link, navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
import JigsawCard from 'src/components/JigsawCard/JigsawCard'

const ForgotPasswordPage = () => {
  const { isAuthenticated, forgotPassword } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.home())
    }
  }, [isAuthenticated])

  const formik = useFormik({
    initialValues: {
      yourEmail: '',
    },
    validationSchema: Yup.object({
      yourEmail: Yup.string()
        .email('Invalid email address')
        .required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await forgotPassword(values.yourEmail)

        if (response.error) {
          toast.error(response.error)
        } else {
          toast.success(
            'A link to reset your password was sent to ' + response.user.email
          )
          setTimeout(() => {
            navigate(routes.login())
          }, 2000)
        }
      } catch (err) {
        console.error('Error during password reset:', err)
        toast.error('An unexpected error occurred. Please try again later.')
      }
    },
  })

  return (
    <>
      <MetaTags
        title="Forgot Password"
        description="A place where we all go, but no one likes it... "
      />
      <JigsawCard px={20} py={14} variant={'elevated'}>
        <JigsawCard.Header>Forgot Password?</JigsawCard.Header>

        <JigsawCard.Body>
          <Box
            as="form"
            onSubmit={formik.handleSubmit}
            w="full"
            maxW="md"
            mx="auto"
          >
            <FormControl
              id="yourEmail"
              isInvalid={
                !!formik.touched.yourEmail && !!formik.errors.yourEmail
              }
            >
              <FormLabel>Your Email</FormLabel>
              <Input
                name="yourEmail"
                type="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.yourEmail}
                isInvalid={
                  !!formik.touched.yourEmail && !!formik.errors.yourEmail
                }
              />
              <FormErrorMessage>
                <FormErrorIcon />
                {formik.errors.yourEmail}
              </FormErrorMessage>
            </FormControl>
            <ButtonGroup mt={8}>
              <Button
                colorScheme="green"
                type="submit"
                isLoading={formik.isSubmitting}
              >
                Submit
              </Button>
              <Button as={Link} to={routes.login()}>
                Go back
              </Button>
            </ButtonGroup>
          </Box>
        </JigsawCard.Body>
      </JigsawCard>
    </>
  )
}

export default ForgotPasswordPage
