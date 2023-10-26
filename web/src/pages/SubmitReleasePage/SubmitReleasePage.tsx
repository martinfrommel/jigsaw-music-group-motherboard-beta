import { Center, Stack, Text } from '@chakra-ui/react'
import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import NewReleaseForm from 'src/components/NewReleaseForm/NewReleaseForm'

const SubmitReleasePage = () => {
  return (
    <>
      <MetaTags title="SubmitRelease" description="SubmitRelease page" />
      <Stack>
        <Center>
          <Text fontSize={'4xl'} mb={12}>
            Submit a new release
          </Text>
        </Center>
        <NewReleaseForm />
      </Stack>
    </>
  )
}

export default SubmitReleasePage
