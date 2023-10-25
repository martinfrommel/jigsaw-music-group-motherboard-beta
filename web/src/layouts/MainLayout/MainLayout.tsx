import { Flex } from '@chakra-ui/react'
import Header from 'src/components/Header/Header'

type MainLayoutProps = {
  children?: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
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
