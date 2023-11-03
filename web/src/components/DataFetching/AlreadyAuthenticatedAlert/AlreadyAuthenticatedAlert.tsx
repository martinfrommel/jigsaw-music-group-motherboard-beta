import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertProps,
  AlertTitle,
} from '@chakra-ui/react'

interface AlreadyAuthenticatedAlertProps extends AlertProps {}

const AlreadyAuthenticatedAlert = ({
  ...rest
}: AlreadyAuthenticatedAlertProps) => {
  return (
    <Alert
      status="error"
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      height={'200px'}
      {...rest}
    >
      <AlertIcon boxSize={'40px'} mr={0} />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        {`        Ooops...
`}
      </AlertTitle>
      <AlertDescription maxWidth="sm">
        {`        Looks like you're already authenticated, navigating back home!
`}
      </AlertDescription>
    </Alert>
  )
}

export default AlreadyAuthenticatedAlert
