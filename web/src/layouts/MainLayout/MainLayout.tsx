import { Box, Center, useColorModeValue } from '@chakra-ui/react'

import { Toaster } from '@redwoodjs/web/dist/toast'

import Header from 'src/components/HeaderComponents/Header/Header'

import bgPattern from '../../assets/bgPattern.svg'
type MainLayoutProps = {
  children?: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
      <Toaster position="bottom-right" reverseOrder />
      <Header />
      <Box
        as="main"
        className="main-content"
        p={24}
        maxW={'100vw'}
        w={'full'}
        h={'full'}
        bgColor={useColorModeValue('purple.50', 'purple.900')}
        bgImage={bgPattern}
      >
        <Center flexShrink={0}>
          <Box>{children}</Box>
        </Center>
      </Box>
    </>
  )
}

export default MainLayout
