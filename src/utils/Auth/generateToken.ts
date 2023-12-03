import { sign } from 'jsonwebtoken'

import authConfig from '../../config/auth'

export const generateToken = (userId: string) => {
  const { secret, expiresIn } = authConfig.jwt

  return sign({}, secret, {
    subject: userId,
    expiresIn
  })
}
