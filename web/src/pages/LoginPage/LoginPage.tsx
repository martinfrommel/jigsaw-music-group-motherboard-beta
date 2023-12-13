import { useEffect } from 'react'

import {
  Button,
  ButtonGroup,
  FormControl,
  FormErrorIcon,
  FormErrorMessage,
  FormLabel,
  Input,
  Spinner,
} from '@chakra-ui/react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'

import { Link, navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
import JigsawCard from 'src/components/JigsawCard/JigsawCard'

const REDIRECT = routes.home()
const HOME = routes.home()
interface FormValues {
  yourEmail: string
  password: string
}
const LoginPage = () => {
  const { isAuthenticated, loading, logIn, reauthenticate } = useAuth()
  const LoginSchema = Yup.object().shape({
    yourEmail: Yup.string()
      .email('Needs to be a valid email address')
      .required('Email is required!'),
    password: Yup.string().required('Password is required!'),
  })
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
          <Formik<FormValues>
            initialValues={{ yourEmail: '', password: '' }}
            onSubmit={onSubmit}
            validateOnBlur={true}
            validateOnChange={true}
            validateOnMount={false}
            validationSchema={LoginSchema}
          >
            {(props) => (
              <Form>
                <FormControl
                  mt={4}
                  isInvalid={
                    !!props.errors.yourEmail && !!props.touched.yourEmail
                  }
                  onChange={props.handleChange}
                >
                  <FormLabel>Email</FormLabel>
                  <Field as={Input} name="yourEmail" placeholder="Email" />
                  <FormErrorMessage>
                    <FormErrorIcon />
                    {props.errors.yourEmail}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  mt={4}
                  isInvalid={
                    !!props.errors.password && !!props.touched.password
                  }
                  onChange={props.handleChange}
                >
                  <FormLabel>Password</FormLabel>
                  <Field
                    as={Input}
                    type="password"
                    name="password"
                    placeholder="Password"
                  />
                  <FormErrorMessage>
                    <FormErrorIcon />
                    {props.errors.password}
                  </FormErrorMessage>
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
