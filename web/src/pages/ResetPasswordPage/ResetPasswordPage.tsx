import { useEffect, useRef, useState } from 'react'

import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  FormErrorIcon,
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
import JigsawCard from 'src/components/JigsawCard/JigsawCard'

const ResetPasswordPage = ({ resetToken }: { resetToken: string }) => {
  const { isAuthenticated, reauthenticate, validateResetToken, resetPassword } =
    useAuth()
  const [enabled, setEnabled] = useState(null)
  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.home())
    }
  }, [isAuthenticated])
  useEffect(() => {
    const validateToken = async () => {
      const response = await validateResetToken(resetToken)
      if (response.error) {
        setEnabled(false)
        toast.error(response.error)
      } else {
        setEnabled(true)
      }
    }
    validateToken()
  }, [resetToken, validateResetToken])

  const passwordRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    passwordRef.current?.focus()
  }, [])
  const formik = useFormik({
    initialValues: {
      password: '',
    },
    validationSchema: Yup.object({
      password: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      const response = await resetPassword({
        resetToken,
        password: values.password,
      })

      if (response.error) {
        toast.error(response.error)
      } else {
        toast.success('Password changed!')
        await reauthenticate()
        navigate(routes.login())
      }
    },
  })

  return (
    <>
      <MetaTags
        title="Reset Password"
        description="Reset your account password."
        robots={['noindex', 'nofollow']}
      />

      <JigsawCard>
        <JigsawCard.Header> Reset Password</JigsawCard.Header>

        <JigsawCard.Body>
          <Box
            as="form"
            onSubmit={formik.handleSubmit}
            w="full"
            maxW="md"
            mx="auto"
          >
            <FormControl
              id="password"
              isInvalid={!!formik.touched.password && !!formik.errors.password}
            >
              <FormLabel>New Password</FormLabel>
              <Input
                name="password"
                type="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                isInvalid={
                  !!formik.touched.password && !!formik.errors.password
                }
              />
              <FormErrorMessage>
                <FormErrorIcon />
                {formik.errors.password}
              </FormErrorMessage>
            </FormControl>

            <Button
              mt={4}
              colorScheme="green"
              type="submit"
              isLoading={formik.isSubmitting}
              disabled={!enabled}
            >
              Submit
            </Button>
          </Box>
        </JigsawCard.Body>
      </JigsawCard>
    </>
  )
}

export default ResetPasswordPage
