import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Container,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'

import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import JigsawCard from 'src/components/JigsawCard/JigsawCard'

const HomePage = () => {
  const { isAuthenticated } = useAuth()
  return (
    <>
      <MetaTags
        title="Jigsaw Music Group"
        description="This is where all the fun begins..."
      />
      <JigsawCard py={24}>
        <Container maxW={'3xl'}>
          <Stack as={Box} textAlign={'center'}>
            <Heading fontWeight={'black'} fontSize={'7xl'} lineHeight={'120%'}>
              {` Hey there,`} <br />
              <Text
                as={'span'}
                color={useColorModeValue('purple.900', 'purple.300')}
              >
                {` Jigsaw Family!`}
              </Text>
            </Heading>
            <Text
              my={8}
              fontSize={'lg'}
              color={useColorModeValue('blackAlpha.800', 'whiteAlpha.700')}
            >
              {` Welcome to the hub where your music begins its journey within
            Jigsaw. We've made this tool with you in mind — simple, efficient,
            and friendly.`}
            </Text>

            <Stack
              direction={'column'}
              spacing={3}
              align={'center'}
              alignSelf={'center'}
              position={'relative'}
              mt={8}
            >
              {!isAuthenticated ? (
                <Button
                  as={Link}
                  to={routes.submitRelease()}
                  colorScheme={'orange'}
                  size={'lg'}
                >
                  {`  Log in to my account`}
                </Button>
              ) : (
                <Button
                  as={Link}
                  to={routes.releases()}
                  colorScheme={'orange'}
                  size={'lg'}
                >
                  {`  View my releases`}
                </Button>
              )}
            </Stack>
          </Stack>

          <Stack my={24}>
            <Heading textAlign={'center'}>Learn more...</Heading>
            <Text
              mt={4}
              textAlign={'center'}
              fontSize={'md'}
              color={useColorModeValue('blackAlpha.800', 'whiteAlpha.700')}
            >
              {` Ready to dive in? Simply sign in at the top right and let's get
            those tracks moving. If you have any hiccups or suggestions,
            remember, we're always here to listen and help.`}
            </Text>
            <Accordion allowToggle mt={6}>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      Section 1 title
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      Section 2 title
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Stack>
        </Container>
      </JigsawCard>
    </>
  )
}

export default HomePage
