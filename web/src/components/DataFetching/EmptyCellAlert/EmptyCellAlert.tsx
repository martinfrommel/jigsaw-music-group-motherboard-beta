import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@chakra-ui/react'

const EmptyCellAlert = () => {
  return (
    <Alert
      status="info"
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      height="60"
    >
      <AlertIcon boxSize="40px" mr={0} />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        This cell is empty!
      </AlertTitle>
      <AlertDescription maxWidth="sm">
        If you think this is not right, contact the admin!
      </AlertDescription>
    </Alert>
  )
}

export default EmptyCellAlert
