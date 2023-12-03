import KnexConnection from '../../database/connection'

export const getUserByEmail = async (email: string): Promise<IUser | null> =>
  await KnexConnection('users').where('email', email).first()

export const getUserByUserId = async (userId: string): Promise<IUser | null> =>
  await KnexConnection('users').where('userId', userId).first()
