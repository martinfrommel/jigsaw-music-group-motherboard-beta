import { Stack } from '@chakra-ui/react'
import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import NewReleaseForm from 'src/components/NewReleaseForm/NewReleaseForm'

const SubmitReleasePage = () => {
  return (
    <>
      <MetaTags title="SubmitRelease" description="SubmitRelease page" />
      <Stack>
        <h1>SubmitReleasePage</h1>
        <NewReleaseForm />
      </Stack>
    </>
  )
}

export default SubmitReleasePage
