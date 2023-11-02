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

JigsawCard.Header = ({ children, divider = true, ...rest }) => {
  return (
    <>
      <ChakraCardHeader
        fontSize={'5xl'}
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

JigsawCard.Body = ({ children, ...rest }) => {
  return <ChakraCardBody {...rest}>{children}</ChakraCardBody>
}

export default JigsawCard
