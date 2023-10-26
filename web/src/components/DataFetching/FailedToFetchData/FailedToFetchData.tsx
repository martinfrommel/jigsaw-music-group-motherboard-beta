import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@chakra-ui/react'

interface FailedToFetchDataProps {
  children: React.ReactNode
}

const FailedToFetchData = ({ children }: FailedToFetchDataProps) => {
  return (
    <Alert status="error">
      <AlertIcon />
      <AlertTitle>Error:</AlertTitle>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  )
}

export default FailedToFetchData
