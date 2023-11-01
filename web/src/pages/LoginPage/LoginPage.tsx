import { useEffect } from 'react'

import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Input,
  Spinner,
} from '@chakra-ui/react'
import { Formik, Form, Field, ErrorMessage } from 'formik'

import { Link, navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
import JigsawCard from 'src/components/JigsawCard/JigsawCard'

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
    <>
      <MetaTags
        title="Log in"
        description="Here you can log in to the system..."
      />
      <JigsawCard>
        <JigsawCard.Header>Log in</JigsawCard.Header>
        <JigsawCard.Body>
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
        </JigsawCard.Body>
      </JigsawCard>
    </>
  )
}

export default LoginPage
