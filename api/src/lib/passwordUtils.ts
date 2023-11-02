import crypto from 'crypto'

export const generateRandomPassword = (length = 12): string => {
  return crypto.randomBytes(length).toString('hex')
}

export const generateSalt = (length = 16): string => {
  return crypto.randomBytes(length).toString('hex')
}
