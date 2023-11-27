import { Select, Spinner } from '@chakra-ui/react'
import type { getLabels } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import EmptyCellAlert from '../DataFetching/EmptyCellAlert/EmptyCellAlert'
import FailedToFetchData from '../DataFetching/FailedToFetchData/FailedToFetchData'

export const QUERY = gql`
  query getLabels {
    getLabels {
      id
      name
    }
  }
`

export const Loading = () => <Spinner />

export const Empty = () => <EmptyCellAlert />

export const Failure = ({ error }: CellFailureProps) => (
  <FailedToFetchData>{error.message}</FailedToFetchData>
)

export const Success = ({ getLabels }: CellSuccessProps<getLabels>) => {
  return (
    <Select>
      {getLabels.map((label) => {
        return (
          <option value={label.id} key={label.id}>
            {label.name}
          </option>
        )
      })}
    </Select>
  )
}
