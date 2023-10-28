import { FormLabel, Input, InputProps } from '@chakra-ui/react'
import { ErrorMessage } from 'formik'

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
      <FormLabel mt={4}>{passwordProps.fieldtext}</FormLabel>
      <Input
        type="password"
        name={passwordProps.fieldname}
        {...passwordProps}
      />
      <ErrorMessage name={passwordProps.fieldname} />

      <FormLabel mt={4}>Confirm Password</FormLabel>
      <Input
        type="password"
        name={confirmPasswordProps.fieldname}
        {...confirmPasswordProps}
      />
      <ErrorMessage name={confirmPasswordProps.fieldname} />

      <PasswordMeter {...passwordMeterProps} mt={4} />
    </>
  )
}

export default PasswordConfirmationField
