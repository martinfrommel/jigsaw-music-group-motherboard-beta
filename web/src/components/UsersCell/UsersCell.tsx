import { useState } from 'react'

import {
  Spinner,
  Table,
  TableCaption,
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

  const [removeUser] = useMutation(DELETE_USER_MUTATION)

  const { forgotPassword } = useAuth()
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
      console.log(error?.message)
    }
  }

  const sendResetPasswordLink = async (email: string) => {
    try {
      await forgotPassword(email)
      toast.success('Password reset link sent successfully!')
    } catch (error) {
      toast.error(error.message || 'Failed to send password reset link.')
    }
  }

  return (
    <JigsawCard>
      <JigsawCard.Header>Admin section</JigsawCard.Header>
      <JigsawCard.Body>
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
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
                  <Td>{user.firstName}</Td>
                  <Td>{user.lastName}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.roles}</Td>
                  <Td>
                    <Avatar src={user.picture} size={'sm'} />
                  </Td>
                  <Td>
                    <ButtonGroup>
                      <Button
                        size="sm"
                        colorScheme="red"
                        mr={3}
                        onClick={() => onDeleteClick(user)}
                      >
                        Delete
                      </Button>

                      <Button
                        as={Link}
                        size="sm"
                        colorScheme="blue"
                        href={`mailto:${user.email}`}
                      >
                        Message
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="yellow"
                        onClick={() => sendResetPasswordLink(user.email)}
                      >
                        Send Password Reset
                      </Button>
                    </ButtonGroup>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
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
                isLoading={!!handleDelete}
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
