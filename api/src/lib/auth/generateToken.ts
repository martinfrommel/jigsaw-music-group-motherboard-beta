import { randomBytes } from 'crypto'

export const generateToken = (length = 64) => {
  return randomBytes(length).toString('hex')
}

export const generateSignUpToken = () => {
  const token = generateToken()
  const expiration = new Date()
  expiration.setHours(expiration.getHours() + 24) // Set expiration to 24 hours from now
  return { token, expiration }
}
