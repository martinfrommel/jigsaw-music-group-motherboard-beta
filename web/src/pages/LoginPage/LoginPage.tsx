import { useEffect } from 'react'

import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  Input,
  Spinner,
} from '@chakra-ui/react'
import { Formik, Form, Field, ErrorMessage } from 'formik'

import { Link, navigate, routes } from '@redwoodjs/router'
import { toast } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'

const REDIRECT = routes.home()
const HOME = routes.home()

const LoginPage = () => {
  const { isAuthenticated, loading, logIn, reauthenticate } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigate(HOME)
    }
  }, [isAuthenticated])

  const onSubmit = (data) => {
    const authenticate = async () => {
      const response = await logIn({
        username: data.yourEmail,
        password: data.password,
      })

      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    }

    toast.promise(authenticate(), {
      loading: 'Logging in...',
      success: () => {
        setTimeout(() => {
          navigate(REDIRECT)
        }, 1000)
        reauthenticate()
        return 'Logged in successfully!'
      },
      error: (err) => err.message || 'Failed to log in.',
    })
  }

  if (loading) return <Spinner />

  return (
    <Card px={20} py={14} variant={'elevated'}>
      <CardHeader
        alignSelf={'center'}
        fontSize={'5xl'}
        fontWeight={'bold'}
        textTransform={'uppercase'}
      >
        Log in
      </CardHeader>
      <CardBody>
        <Formik
          initialValues={{ yourEmail: '', password: '' }}
          onSubmit={onSubmit}
        >
          {(props) => (
            <Form>
              <FormControl mt={4}>
                <FormLabel>Email</FormLabel>
                <Field as={Input} name="yourEmail" placeholder="Email" />
                <ErrorMessage name="yourEmail" />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Password</FormLabel>
                <Field
                  as={Input}
                  type="password"
                  name="password"
                  placeholder="Password"
                />
                <ErrorMessage name="password" />
              </FormControl>
              <ButtonGroup mt={8}>
                <Button
                  type="submit"
                  isLoading={props.isSubmitting}
                  mr={4}
                  colorScheme="green"
                >
                  Log In
                </Button>
                <Button type="button" as={Link} to={routes.forgotPassword()}>
                  Forgot password?
                </Button>
              </ButtonGroup>
            </Form>
          )}
        </Formik>
      </CardBody>
    </Card>
  )
}

export default LoginPage
