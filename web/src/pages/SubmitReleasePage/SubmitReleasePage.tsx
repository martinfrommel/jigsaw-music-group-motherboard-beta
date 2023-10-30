import { Center, Stack, Text } from '@chakra-ui/react'

import { MetaTags } from '@redwoodjs/web'

import NewReleaseForm from 'src/components/NewReleaseForm/NewReleaseForm'

const SubmitReleasePage = () => {
  return (
    <>
      <MetaTags
        title="Submit a release"
        description="Here you can upload a new release for review"
      />
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
