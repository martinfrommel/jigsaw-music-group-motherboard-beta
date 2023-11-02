import { useState } from 'react'

import { generateToken } from './generateToken'

const useTokenGenerator = () => {
  const [token, setToken] = useState<string | null>(null)

  const generate = (length = 64) => {
    const newToken = generateToken(length)
    setToken(newToken)
    return newToken
  }

  return { token, generate }
}

export default useTokenGenerator
