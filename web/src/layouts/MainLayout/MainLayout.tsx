import { Box, Center, Flex, useColorModeValue } from '@chakra-ui/react'

import { Toaster } from '@redwoodjs/web/dist/toast'

import bgPatternSVG from 'src/assets/bgPattern'
import Header from 'src/components/HeaderComponents/Header/Header'
import { processSVGForBg } from 'src/lib/processSVG'

import { resolveChakraColor } from '../../lib/resolveChakraColor'
type MainLayoutProps = {
  children?: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const bgFillColor = useColorModeValue(
    resolveChakraColor('blackAlpha.50'),
    resolveChakraColor('whiteAlpha.50')
  )
  const bgPattern = processSVGForBg(bgPatternSVG, bgFillColor)

  return (
    <>
      <Toaster position="bottom-right" reverseOrder />
      <Header />
      <Flex
        flexDir={'column'}
        alignItems={'center'}
        justifyContent={'center'}
        as="main"
        className="main-content"
        p={6}
        maxW={'100vw'}
        w={'full'}
        h={'full'}
        minH={'100vh'}
        bgColor={useColorModeValue('purple.50', 'purple.900')}
        bgImage={bgPattern}
      >
        <Box>{children}</Box>
      </Flex>
    </>
  )
}

export default MainLayout
