import { Card, CardBody, CardHeader, Divider } from '@chakra-ui/react'

import { MetaTags } from '@redwoodjs/web'

import NewReleaseForm from 'src/components/NewReleaseForm/NewReleaseForm'

const SubmitReleasePage = () => {
  return (
    <>
      <MetaTags
        title="Submit a release"
        description="Here you can upload a new release for review"
      />
      <Card px={20} py={14} variant={'elevated'}>
        <CardHeader
          alignSelf={'center'}
          fontSize={'5xl'}
          fontWeight={'bold'}
          textTransform={'uppercase'}
        >
          Submit a new release
        </CardHeader>
        <Divider />
        <CardBody>
          <NewReleaseForm />
        </CardBody>
      </Card>
    </>
  )
}

export default SubmitReleasePage
