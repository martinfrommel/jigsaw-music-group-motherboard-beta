import { Select, Spinner } from '@chakra-ui/react'
import { FormikHandlers } from 'formik'
import type { getLabels } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import EmptyCellAlert from '../DataFetching/EmptyCellAlert/EmptyCellAlert'
import FailedToFetchData from '../DataFetching/FailedToFetchData/FailedToFetchData'

interface GetLabelsCellProps extends CellSuccessProps<getLabels> {
  onSelect: (labelId: string, labelName: string) => void
  value: {
    id: string
    name: string
  }
  name: string
  onBlur: FormikHandlers['handleBlur']
}

export const QUERY = gql`
  query getLabels {
    getLabels {
      id
      name
    }
  }
`

export const beforeQuery = (props: GetLabelsCellProps) => {
  return {
    variables: props,
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-first',
  }
}

export const Loading = () => <Spinner />

export const Empty = () => <EmptyCellAlert />

export const Failure = ({ error }: CellFailureProps) => (
  <FailedToFetchData>{error.message}</FailedToFetchData>
)

export const Success = ({
  getLabels,
  onSelect,
  onBlur,
}: GetLabelsCellProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const labelId = e.target.value
    const labelName = e.target.options[e.target.selectedIndex].text
    onSelect(labelId, labelName)
  }
  return (
    <>
      <Select
        onChange={handleChange}
        placeholder="Select a label"
        onBlur={onBlur}
        flex={0}
      >
        {getLabels.map((label) => {
          return (
            <option value={label.id} key={label.id}>
              {label.name}
            </option>
          )
        })}
      </Select>
    </>
  )
}
