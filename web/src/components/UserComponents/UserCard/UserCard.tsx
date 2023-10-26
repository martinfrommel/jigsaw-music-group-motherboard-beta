import {
  Heading,
  Avatar,
  Box,
  Center,
  Image,
  Flex,
  Text,
  Stack,
  Button,
  useColorModeValue,
} from '@chakra-ui/react'
import { Link, routes } from '@redwoodjs/router'

interface UserCardProps {
  userPicture: string
  userName: string
  userEmail: string
}

const UserCard = ({ userPicture, userName, userEmail }: UserCardProps) => {
  return (
    <Center py={6}>
      <Box
        maxW={'96'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'2xl'}
        rounded={'md'}
        overflow={'show'}
      >
        <Flex justify={'center'} mt={-12}>
          <Avatar
            size={'xl'}
            src={userPicture}
            css={{
              border: '2px solid white',
            }}
          />
        </Flex>

        <Box p={6}>
          <Stack spacing={0} align={'center'} mb={5}>
            <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
              {userName}
            </Heading>
            <Text color={'gray.500'}>{userEmail}</Text>
          </Stack>

          
        </Box>
      </Box>
    </Center>
  )
}

export default UserCard
