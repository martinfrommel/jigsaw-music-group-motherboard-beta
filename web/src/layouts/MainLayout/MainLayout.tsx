import { Box, Flex, useColorModeValue } from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'

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
  const MotionFlex = motion(Flex)
  const MotionBox = motion(Box)

  return (
    <>
      <Toaster position="bottom-right" reverseOrder />
      <Header />
      <AnimatePresence>
        <MotionFlex
          flexDir={'column'}
          alignItems={'center'}
          justifyContent={'flex-start'}
          as="main"
          className="main-content"
          p={6}
          maxW={'100vw'}
          minH={'100vh'}
          bgColor={useColorModeValue('purple.50', 'purple.900')}
          bgImage={bgPattern}
        >
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {children}
          </MotionBox>
        </MotionFlex>
      </AnimatePresence>
    </>
  )
}

export default MainLayout
