import { useRef } from 'react'
import { useEffect } from 'react'

import {
  Form,
  Label,
  TextField,
  PasswordField,
  FieldError,
  Submit,
} from '@redwoodjs/forms'
import { Link, navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { toast, Toaster } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
import CreateUserForm from 'src/components/CreateNewUserComponents/CreateUserForm/CreateUserForm'

const SignupPage = () => {
  const { isAuthenticated, signUp } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.submitRelease())
    }
  }, [isAuthenticated])

  // focus on your email box on page load
  const yourEmailRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    yourEmailRef.current?.focus()
  }, [])

  const onSubmit = async (data: Record<string, string>) => {
    const response = await signUp({
      username: data.yourEmail,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
    })

    if (response.message) {
      toast(response.message)
    } else if (response.error) {
      toast.error(response.error)
    } else {
      // user is signed in automatically
      toast.success('Welcome!')
    }
  }

  return (
    <>
      <CreateUserForm  />
    </>
  )
}

export default SignupPage
