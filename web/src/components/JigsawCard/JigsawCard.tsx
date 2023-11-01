import {
  Card,
  CardBody as ChakraCardBody,
  CardHeader as ChakraCardHeader,
  CardProps,
  Divider,
  useColorModeValue,
  Flex,
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'

interface JigsawCardProps extends CardProps {
  children?: React.ReactNode
}

const MotionFlex = motion(Flex)

const JigsawCard: React.FC<JigsawCardProps> & {
  Header?: React.FC<{
    divider?: boolean
    children?: React.ReactNode
    [key: string]: any
  }>
  Body: React.FC<{ children?: React.ReactNode; [key: string]: any }>
} = ({ children, ...rest }) => {
  return (
    <AnimatePresence>
      <MotionFlex
        as={Card}
        px={14}
        py={28}
        bgColor={useColorModeValue('whiteAlpha.800', 'blackAlpha.700')}
        shadow={'lg'}
        {...rest}
        flexDirection={'column'}
        justifyContent={'space-between'}
        alignItems={'center'}
        initial={{ opacity: 0 }} // For example, start with opacity 0
        animate={{ opacity: 1 }} // Animate to opacity 1
        exit={{ opacity: 0 }} // Optional: animate to opacity 0 on unmount
      >
        {children}
      </MotionFlex>
    </AnimatePresence>
  )
}

JigsawCard.Header = ({ children, divider = true, ...rest }) => {
  return (
    <>
      <ChakraCardHeader
        alignSelf={'center'}
        fontSize={'5xl'}
        fontWeight={'bold'}
        textTransform={'uppercase'}
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
