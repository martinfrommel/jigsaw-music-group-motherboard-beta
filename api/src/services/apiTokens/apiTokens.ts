import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const apiTokens: QueryResolvers['apiTokens'] = () => {
  return db.apiToken.findMany()
}

export const apiToken: QueryResolvers['apiToken'] = ({ id }) => {
  return db.apiToken.findUnique({
    where: { id },
  })
}

export const createApiToken: MutationResolvers['createApiToken'] = ({
  input,
}) => {
  return db.apiToken.create({
    data: input,
  })
}

export const updateApiToken: MutationResolvers['updateApiToken'] = ({
  id,
  input,
}) => {
  return db.apiToken.update({
    data: input,
    where: { id },
  })
}

export const deleteApiToken: MutationResolvers['deleteApiToken'] = ({ id }) => {
  return db.apiToken.delete({
    where: { id },
  })
}
