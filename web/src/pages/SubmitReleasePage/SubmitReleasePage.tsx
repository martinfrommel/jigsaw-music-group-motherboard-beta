import { Card, CardBody, CardHeader, Divider } from '@chakra-ui/react'

import { MetaTags } from '@redwoodjs/web'

import JigsawCard from 'src/components/JigsawCard/JigsawCard'
import NewReleaseForm from 'src/components/NewReleaseForm/NewReleaseForm'

const SubmitReleasePage = () => {
  return (
    <>
      <MetaTags
        title="Submit a release"
        description="Here you can upload a new release for review"
      />
      <JigsawCard>
        <JigsawCard.Header>Submit a new release</JigsawCard.Header>
        <JigsawCard.Body>
          <NewReleaseForm />
        </JigsawCard.Body>
      </JigsawCard>
    </>
  )
}

export default SubmitReleasePage
