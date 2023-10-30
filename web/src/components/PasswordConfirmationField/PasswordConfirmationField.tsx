import {
  FormControl,
  FormErrorIcon,
  FormErrorMessage,
  FormLabel,
  Input,
  InputProps,
} from '@chakra-ui/react'

import PasswordMeter from '../CreateNewUserComponents/PasswordMeter/PasswordMeter'

interface PasswordProps extends InputProps {
  fieldtext: string
  fieldname: string
}

interface ConfirmPasswordProps extends InputProps {
  fieldname: string
}

interface PasswordMeterProps {
  password: string
  confirmPassword: string
}

interface PasswordConfirmationFieldProps {
  passwordProps?: PasswordProps
  confirmPasswordProps?: ConfirmPasswordProps
  passwordMeterProps: PasswordMeterProps
}

const PasswordConfirmationField: React.FC<PasswordConfirmationFieldProps> = ({
  passwordProps,
  confirmPasswordProps,
  passwordMeterProps,
}) => {
  return (
    <>
      <FormControl {...passwordProps}>
        <FormLabel mt={4}>{passwordProps.fieldtext}</FormLabel>
        <Input type="password" name={passwordProps.fieldname} />
        <FormErrorMessage>
          <FormErrorIcon />
          {'New password is required'}
        </FormErrorMessage>
      </FormControl>
      <FormControl {...confirmPasswordProps}>
        <FormLabel mt={4}>Confirm Password</FormLabel>
        <Input type="password" name={confirmPasswordProps.fieldname} />
        <FormErrorMessage>
          <FormErrorIcon />
          {'You need to confirm the password'}
        </FormErrorMessage>
      </FormControl>
      <PasswordMeter {...passwordMeterProps} mt={4} />
    </>
  )
}

export default PasswordConfirmationField
