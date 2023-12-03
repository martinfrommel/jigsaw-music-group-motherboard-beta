import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@chakra-ui/react'

interface EmptyCellAlertProps {
  title?: string
  alert?: string
}

const EmptyCellAlert = ({ title, alert }: EmptyCellAlertProps) => {
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
      <AlertIcon boxSize="12" mr={0} />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        {title ? title : 'This cell is empty!'}
      </AlertTitle>
      <AlertDescription maxWidth="lg">
        {alert ? alert : 'If you think this is not right, contact the admin!'}
      </AlertDescription>
    </Alert>
  )
}

export default EmptyCellAlert
