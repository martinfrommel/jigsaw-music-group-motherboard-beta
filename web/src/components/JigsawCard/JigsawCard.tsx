import {
  Card,
  CardBody as ChakraCardBody,
  CardHeader as ChakraCardHeader,
  CardProps,
  Divider,
  useColorModeValue,
  Flex,
  useBreakpointValue,
} from '@chakra-ui/react'

interface JigsawCardProps extends CardProps {
  children?: React.ReactNode
  width?: number | string
  height?: number | string
}

const JigsawCard: React.FC<JigsawCardProps> & {
  Header?: React.FC<{
    divider?: boolean
    children?: React.ReactNode
    [key: string]: any
  }>
  Body: React.FC<{ children?: React.ReactNode; [key: string]: any }>
} = ({ children, ...rest }) => {
  return (
    <Flex
      as={Card}
      px={useBreakpointValue({ base: 0, md: 14 })}
      py={useBreakpointValue({ base: 4, md: 14 })}
      bgColor={useColorModeValue('whiteAlpha.800', 'blackAlpha.700')}
      shadow={'lg'}
      {...rest}
      flexDirection={'column'}
      justifyContent={'space-between'}
      alignItems={'center'}
    >
      {children}
    </Flex>
  )
}

// Define Header as a standalone component
const Header: React.FC<{
  divider?: boolean
  children?: React.ReactNode
  [key: string]: any
}> = ({ children, divider = true, ...rest }) => {
  const fontSize = useBreakpointValue({ base: '3xl', md: '5xl' })

  return (
    <>
      <ChakraCardHeader
        fontSize={fontSize}
        fontWeight={'bold'}
        textTransform={'capitalize'}
        flex={1}
        textAlign={'center'}
        {...rest}
      >
        {children}
      </ChakraCardHeader>
      {divider && <Divider my={8} />}
    </>
  )
}

// Assign Header to JigsawCard after its declaration
JigsawCard.Header = Header

JigsawCard.Body = ({ children, ...rest }) => {
  return <ChakraCardBody {...rest}>{children}</ChakraCardBody>
}

export default JigsawCard
