import { Flex } from '@chakra-ui/react'
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
      <Flex
        as="main"
        className="main-content"
        w="100%"
        p={6}
        paddingTop={12}
        flexDirection={'column'}
        alignItems={'center'}
        justifyContent={'center'}
      >
        {children}
      </Flex>
    </>
  )
}

export default MainLayout
