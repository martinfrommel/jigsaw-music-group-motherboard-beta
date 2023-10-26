import { Box, Text, BoxProps, VStack, Progress } from '@chakra-ui/react'
import React from 'react'

interface PasswordMeterProps extends BoxProps {
  password: string
  confirmPassword: string
}

const PasswordMeter: React.FC<PasswordMeterProps> = ({
  password,
  confirmPassword,
  ...rest
}) => {
  const hasMinLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  // const hasSpecialChar = /[!@#$%^&*]/.test(password)
  const passwordsMatch = password === confirmPassword

  const strength = [
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    // hasSpecialChar,
  ].filter(Boolean).length

  return (
    <Box mt={2} borderRadius={2} {...rest}>
      <Progress
        value={(strength / 4) * 100}
        size={'sm'}
        colorScheme={'green'}
        transition={'width 1s'}
      />
      <VStack align={'left'} mt={2}>
        <Text fontSize="sm" mt={2}>
          {hasMinLength
            ? '✅ At least 8 characters'
            : '⛔️ At least 8 characters'}
        </Text>
        <Text fontSize="sm" mt={1}>
          {hasUppercase
            ? '✅ Contains an uppercase letter'
            : '⛔️ Contains an uppercase letter'}
        </Text>
        <Text fontSize="sm" mt={1}>
          {hasLowercase
            ? '✅ Contains a lowercase letter'
            : '⛔️ Contains a lowercase letter'}
        </Text>
        <Text fontSize="sm" mt={1}>
          {hasNumber ? '✅ Contains a number' : '⛔️ Contains a number'}
        </Text>
        {/* <Text fontSize="sm" mt={1}>
          {hasSpecialChar
            ? '✅ Contains a special character'
            : '⛔️ Contains a special character'}
        </Text> */}
        <Text
          fontSize="sm"
          mt={1}
          color={passwordsMatch ? 'green.400' : 'red.400'}
        >
          {passwordsMatch ? '✅ Passwords match' : '⛔️ Passwords do not match'}
        </Text>
      </VStack>
    </Box>
  )
}

export default PasswordMeter
