import { v4 as uuidv4 } from 'uuid'

export const setRandomAvatar = () => {
  const seed = uuidv4()
  return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed}`
}
