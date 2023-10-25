import { passwordValidation } from 'src/lib/signUpSchema'
import { Box, Text } from '@chakra-ui/react'
import React from 'react'

interface PasswordMeterProps {
  password: string
  confirmPassword: string
}

const PasswordMeter: React.FC<PasswordMeterProps> = ({
  password,
  confirmPassword,
}) => {
  const passwordsMatch = password === confirmPassword

  // Use the passwordValidation logic to determine if the password is valid
  const isPasswordValid = passwordValidation.isValidSync(password)

  // Calculate strength based on the validity of the password
  const strength = isPasswordValid ? 4 : 0

  return (
    <Box mt={2} borderRadius={2}>
      <Box height="10px" borderRadius="md" bg="gray.200" width="100%">
        <Box
          width={`${strength * 25}%`}
          height="100%"
          bg={strength === 4 ? 'green.400' : 'yellow.400'}
          transition="width 0.3s"
        />
      </Box>
      <Text fontSize="sm" mt={2}>
        {strength < 4 && 'Password needs to be stronger'}
        {strength === 4 && 'Strong password!'}
      </Text>
      <Text
        fontSize="sm"
        mt={1}
        color={passwordsMatch ? 'green.400' : 'red.400'}
      >
        {passwordsMatch ? '✅ Passwords match' : '⛔️ Passwords do not match'}
      </Text>
    </Box>
  )
}

export default PasswordMeter
