import { Box, Center, Flex } from '@chakra-ui/react'

import { Toaster } from '@redwoodjs/web/dist/toast'

import Header from 'src/components/HeaderComponents/Header/Header'

type MainLayoutProps = {
  children?: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
      <Toaster />
      <Header />
      <Box as="main" className="main-content" p={24} maxW={'100vw'} w={'100vw'}>
        <Center>
          <Box>{children}</Box>
        </Center>
      </Box>
    </>
  )
}

export default MainLayout
