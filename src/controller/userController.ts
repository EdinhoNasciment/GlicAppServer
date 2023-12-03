import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

import KnexConnection from '../database/connection'
import AppError from '../errors/AppError'
import { generateToken } from '../utils/Auth/generateToken'
import { getUserByEmail, getUserByUserId } from '../utils/User/returnUser'

interface IReqCreateUser {
  name: string
  email: string
  password: string
}

interface IReqSession {
  email: string
  password: string
}

interface IReqUpdateUser {
  userId: string
  name?: string
  password?: string
}

class UserController {
  public async createUser({ email, password, ...requestData }: IReqCreateUser) {
    const isExistUser = await getUserByEmail(email)

    if (isExistUser) {
      throw new AppError('User already registered with this e-mail', 400)
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const userId = uuidv4()
    const isoDateNow = new Date().toISOString()

    const createdUser = await this.modifyUserInDB(
      {
        ...requestData,
        email,
        userId,
        password: hashedPassword,
        createdAt: isoDateNow,
        updatedAt: isoDateNow
      },
      'create'
    )

    const token = generateToken(userId)

    return {
      userId: createdUser.userId,
      name: createdUser.name,
      email: createdUser.email,
      createdAt: createdUser.createdAt,
      updatedAt: createdUser.updatedAt,
      token
    }
  }

  public async session(requestData: IReqSession) {
    const { email, password } = requestData

    const user = await getUserByEmail(email)

    if (!user) {
      throw new AppError('User not found', 404)
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      throw new AppError('Invalid password', 400)
    }

    const token = generateToken(user.userId)

    return {
      userId: user.userId,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      token
    }
  }

  public async updateUser({ userId, name, password }: IReqUpdateUser) {
    const userData = (await getUserByUserId(userId)) as IUser
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : userData?.password

    const isoDateNow = new Date().toISOString()

    const updatedUser = await this.modifyUserInDB(
      {
        ...userData,
        name: name || userData?.name,
        password: hashedPassword,
        updatedAt: isoDateNow
      },
      'update'
    )

    return updatedUser
  }

  private async modifyUserInDB(user: IUser, operation: 'create' | 'update') {
    const action = operation === 'create' ? 'insert' : 'update'

    try {
      let modifiedUser: IUser

      if (action === 'insert') {
        ;[modifiedUser] = await KnexConnection('users')
          .insert(user)
          .returning<IUser[]>([
            'userId',
            'name',
            'email',
            'createdAt',
            'updatedAt'
          ])
      } else {
        await KnexConnection('users').update(user).where('userId', user.userId)

        modifiedUser = user
      }

      return modifiedUser
    } catch (error) {
      console.error({ modifyUserInDBError: error })

      const errorMessage =
        operation === 'create'
          ? 'Error when creating user'
          : 'Error when updating user'

      throw new AppError(errorMessage, 500)
    }
  }
}

export default UserController
