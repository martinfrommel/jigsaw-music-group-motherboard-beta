import { useState } from 'react'

import {
  Spinner,
  Table,
  TableContainer,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Avatar,
  Link,
  ButtonGroup,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Badge,
  useBreakpointValue,
  Box,
  Flex,
  Text,
  Grid,
  GridItem,
  VStack,
  HStack,
} from '@chakra-ui/react'
import type { UsersQuery } from 'types/graphql'

import {
  type CellSuccessProps,
  type CellFailureProps,
  useMutation,
  useQuery,
} from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/dist/toast'

import { useAuth } from 'src/auth'
import { capitalizeFirstLetter } from 'src/lib/capitalizeFirstLetter'

import EmptyCellAlert from '../DataFetching/EmptyCellAlert/EmptyCellAlert'
import FailedToFetchData from '../DataFetching/FailedToFetchData/FailedToFetchData'
import JigsawCard from '../JigsawCard/JigsawCard'

export const QUERY = gql`
  query UsersQuery {
    users {
      id
      firstName
      lastName
      email
      picture
      roles
    }
  }
`

const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($id: Int!) {
    deleteUser(id: $id) {
      id
    }
  }
`

export const Loading = () => <Spinner />

export const Empty = () => <EmptyCellAlert />

export const Failure = ({ error }: CellFailureProps) => (
  <FailedToFetchData>{error?.message}</FailedToFetchData>
)

export const Success = ({ users }: CellSuccessProps<UsersQuery>) => {
  const { refetch } = useQuery(QUERY)

  const isMobile = useBreakpointValue({ base: true, md: false })
  const [removeUser, { loading: deleteLoading, error: deleteError }] =
    useMutation(DELETE_USER_MUTATION)

  const { forgotPassword, currentUser } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const onClose = () => setIsOpen(false)
  const onDeleteClick = (user) => {
    setSelectedUser(user)
    setIsOpen(true)
  }

  const handleDelete = async () => {
    try {
      await removeUser({ variables: { id: selectedUser.id } })
      toast.success('User deleted successfully!')
      onClose()
      refetch()
    } catch (error) {
      toast.error('Error deleting user.')
      console.log(deleteError?.message)
    }
  }

  const [isResettingPassword, setIsResettingPassword] = useState(false)

  const sendResetPasswordLink = async (email: string) => {
    setIsResettingPassword(true)
    try {
      await forgotPassword(email)
      toast.success('Password reset link sent successfully!')
    } catch (error) {
      toast.error(error.message || 'Failed to send password reset link.')
    } finally {
      setIsResettingPassword(false)
    }
  }

  const ActionButtons = ({ user, isMobile }) => {
    const StackComponent = isMobile ? VStack : HStack
    return (
      <StackComponent as={ButtonGroup} spacing={isMobile ? 2 : 0}>
        <Button
          size="sm"
          colorScheme="red"
          mr={isMobile ? 0 : 3}
          onClick={() => onDeleteClick(user)}
          isDisabled={
            currentUser.id === user.id ||
            (currentUser.roles === 'admin' && user.roles === 'admin')
          }
          w={isMobile ? 'full' : 'initial'}
        >
          Delete
        </Button>
        <Button
          as={Link}
          size="sm"
          colorScheme="blue"
          href={`mailto:${user.email}`}
          w={isMobile ? 'full' : 'initial'}
        >
          Message
        </Button>
        <Button
          w={isMobile ? 'full' : 'initial'}
          size="sm"
          colorScheme="yellow"
          onClick={() => sendResetPasswordLink(user.email)}
          isLoading={isResettingPassword}
          className="hover:underline"
        >
          Send Password Reset
        </Button>{' '}
      </StackComponent>
    )
  }

  const DesktopView = ({ users }) => {
    return (
      <>
        <TableContainer>
          <Table variant={'striped'}>
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>First Name</Th>
                <Th>Last Name</Th>
                <Th>Email</Th>
                <Th>Roles</Th>
                <Th>Picture</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user) => (
                <Tr key={user.id}>
                  <Td>{user.id}</Td>
                  <Td>{user.firstName}</Td>
                  <Td>{user.lastName}</Td>
                  <Td>{user.email}</Td>
                  <Td>
                    <Badge
                      colorScheme={
                        user.roles == 'admin'
                          ? 'red'
                          : user.roles == 'moderator'
                          ? 'orange'
                          : user.roles == 'user'
                          ? 'gray'
                          : 'white'
                      }
                      variant={'solid'}
                    >
                      {capitalizeFirstLetter(user.roles)}
                    </Badge>
                  </Td>
                  <Td>
                    <Avatar src={user.picture} size={'sm'} />
                  </Td>

                  <Td>
                    <ActionButtons isMobile={isMobile} user={user} />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </>
    )
  }
  const MobileView = ({ users }) => {
    return (
      <>
        {users.map((user) => (
          <Box
            as={Grid}
            key={user.id}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            my={6}
            templateColumns="auto 1fr"
            gap={4}
            p={2}
            alignItems="center"
          >
            <Avatar as={GridItem} rowSpan={3} src={user.picture} size={'lg'} />

            <GridItem rowSpan={3} textAlign={'center'}>
              <Text fontWeight="bold" fontSize="xl">
                {user.firstName} {user.lastName}
              </Text>

              <Text>{user.email}</Text>

              <Badge
                colorScheme={
                  user.roles == 'admin'
                    ? 'red'
                    : user.roles == 'moderator'
                    ? 'orange'
                    : user.roles == 'user'
                    ? 'gray'
                    : 'white'
                }
                variant={'solid'}
              >
                {capitalizeFirstLetter(user.roles)}
              </Badge>
            </GridItem>
            <Flex
              as={GridItem}
              colSpan={2}
              justifyContent="center"
              alignItems={'center'}
              mt={4}
            >
              <ActionButtons isMobile={isMobile} user={user} />
            </Flex>
          </Box>
        ))}
      </>
    )
  }

  return (
    <JigsawCard justifySelf={'flex-start'} alignSelf={'flex-start'}>
      <JigsawCard.Header>Admin section</JigsawCard.Header>
      <JigsawCard.Body>
        {!isMobile ? (
          <DesktopView users={users} />
        ) : (
          <MobileView users={users} />
        )}
      </JigsawCard.Body>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={undefined}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete User
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onClose} mr={3}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDelete}
                isLoading={deleteLoading}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </JigsawCard>
  )
}
