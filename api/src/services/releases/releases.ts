import type {
  QueryResolvers,
  MutationResolvers,
  ReleaseRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const releases: QueryResolvers['releases'] = () => {
  return db.release.findMany()
}

export const release: QueryResolvers['release'] = ({ id }) => {
  return db.release.findUnique({
    where: { id },
  })
}

export const createRelease: MutationResolvers['createRelease'] = ({
  input,
}) => {
  return db.release.create({
    data: input,
  })
}

export const updateRelease: MutationResolvers['updateRelease'] = ({
  id,
  input,
}) => {
  return db.release.update({
    data: input,
    where: { id },
  })
}

export const deleteRelease: MutationResolvers['deleteRelease'] = ({ id }) => {
  return db.release.delete({
    where: { id },
  })
}

export const Release: ReleaseRelationResolvers = {
  user: (_obj, { root }) => {
    return db.release.findUnique({ where: { id: root?.id } }).user()
  },
}
