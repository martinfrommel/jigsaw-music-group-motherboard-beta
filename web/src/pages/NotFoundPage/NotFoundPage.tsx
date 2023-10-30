import { Button, ButtonGroup, Flex, Heading, Text } from '@chakra-ui/react'

import { Link, routes } from '@redwoodjs/router'

import MainLayout from 'src/layouts/MainLayout/MainLayout'

export default () => (
  <MainLayout>
    <Flex
      flexDirection={'column'}
      justifyContent={'center'}
      alignItems={'center'}
      py={24}
      px={36}
      bgColor={'whiteAlpha.100'}
      borderRadius={12}
      shadow={'lg'}
    >
      <Heading flex={1} fontSize={'9xl'} fontWeight={'black'}>
        404!
      </Heading>
      <Text flex={1} fontSize={'2xl'} fontWeight={'semibold'}>
        Page not found
      </Text>
      <ButtonGroup mt={14}>
        <Button as={Link} to={routes.home()} colorScheme="green" size={'lg'}>
          Go home
        </Button>
        <Button as={Link} to={routes.login()} size={'lg'}>Log in</Button>
      </ButtonGroup>
    </Flex>
  </MainLayout>
)
