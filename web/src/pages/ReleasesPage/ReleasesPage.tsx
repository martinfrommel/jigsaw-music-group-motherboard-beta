import { MetaTags } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import JigsawCard from 'src/components/JigsawCard/JigsawCard'
import ReleasesCell from 'src/components/ReleasesCell'

const ReleasesPage = () => {
  const { currentUser } = useAuth()
  return (
    <>
      <MetaTags
        title="My Releases"
        description="You can view the releases you submitted here!"
      />
      <JigsawCard>
        <JigsawCard.Header>Releases</JigsawCard.Header>
        <JigsawCard.Body>
          <ReleasesCell userId={currentUser.id} />
        </JigsawCard.Body>
      </JigsawCard>
    </>
  )
}

export default ReleasesPage
