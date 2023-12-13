import { useRef } from 'react'
import { useEffect } from 'react'

import { navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import CreateUserForm from 'src/components/CreateNewUserComponents/CreateUserForm/CreateUserForm'

const SignupPage = () => {
  const { isAuthenticated } = useAuth()

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

  return (
    <>
      <MetaTags
        title="Create a new user"
        description=""
        robots={['noindex', 'nofollow']}
      />
      <CreateUserForm showRoleSelection={false} />
    </>
  )
}

export default SignupPage
