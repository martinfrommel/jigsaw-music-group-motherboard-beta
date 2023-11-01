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
  Icon,
  Stack,
  Text,
  createIcon,
  useColorModeValue,
} from '@chakra-ui/react'

import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import JigsawCard from 'src/components/JigsawCard/JigsawCard'

const HomePage = () => {
  const Arrow = createIcon({
    displayName: 'Arrow',
    viewBox: '0 0 72 24',
    path: (
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.600904 7.08166C0.764293 6.8879 1.01492 6.79004 1.26654 6.82177C2.83216 7.01918 5.20326 7.24581 7.54543 7.23964C9.92491 7.23338 12.1351 6.98464 13.4704 6.32142C13.84 6.13785 14.2885 6.28805 14.4722 6.65692C14.6559 7.02578 14.5052 7.47362 14.1356 7.6572C12.4625 8.48822 9.94063 8.72541 7.54852 8.7317C5.67514 8.73663 3.79547 8.5985 2.29921 8.44247C2.80955 9.59638 3.50943 10.6396 4.24665 11.7384C4.39435 11.9585 4.54354 12.1809 4.69301 12.4068C5.79543 14.0733 6.88128 15.8995 7.1179 18.2636C7.15893 18.6735 6.85928 19.0393 6.4486 19.0805C6.03792 19.1217 5.67174 18.8227 5.6307 18.4128C5.43271 16.4346 4.52957 14.868 3.4457 13.2296C3.3058 13.0181 3.16221 12.8046 3.01684 12.5885C2.05899 11.1646 1.02372 9.62564 0.457909 7.78069C0.383671 7.53862 0.437515 7.27541 0.600904 7.08166ZM5.52039 10.2248C5.77662 9.90161 6.24663 9.84687 6.57018 10.1025C16.4834 17.9344 29.9158 22.4064 42.0781 21.4773C54.1988 20.5514 65.0339 14.2748 69.9746 0.584299C70.1145 0.196597 70.5427 -0.0046455 70.931 0.134813C71.3193 0.274276 71.5206 0.70162 71.3807 1.08932C66.2105 15.4159 54.8056 22.0014 42.1913 22.965C29.6185 23.9254 15.8207 19.3142 5.64226 11.2727C5.31871 11.0171 5.26415 10.5479 5.52039 10.2248Z"
        fill="currentColor"
      />
    ),
  })
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
              <Button
                as={Link}
                to={routes.submitRelease()}
                colorScheme={'orange'}
                size={'lg'}
              >
                {`  Log in to my account`}
              </Button>

              <Box>
                <Icon
                  as={Arrow}
                  color={useColorModeValue('gray.800', 'gray.300')}
                  w={71}
                  position={'relative'}
                  right={-149}
                  top={-12}
                />
                <Text
                  fontSize={'xs'}
                  position={'relative'}
                  fontFamily={'mono'}
                  right={-170}
                  top={-24}
                  transform={'rotate(10deg)'}
                >
                  {` Just click to get started`}
                </Text>
              </Box>
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
