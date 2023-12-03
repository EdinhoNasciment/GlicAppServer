import { Request, Response, Router } from 'express'

import UserController from '../controller/userController'
import ensureAuthenticated from '../middleware/ensureAuthenticated'

const UsersRouter = Router()
const userController = new UserController()

UsersRouter.post('/', async (req: Request, res: Response) => {
  const { name, email, password } = req.body

  const createUserResponse = await userController.createUser({
    name,
    email,
    password
  })

  res.json(createUserResponse)
})

UsersRouter.put(
  '/',
  ensureAuthenticated,
  async (req: Request, res: Response) => {
    const { name, password } = req.body
    const userId = req.user.userId

    const updateUserResponse = await userController.updateUser({
      userId,
      name,
      password
    })

    res.json(updateUserResponse)
  }
)

UsersRouter.post('/session', async (req: Request, res: Response) => {
  const { email, password } = req.body

  const sessionResponse = await userController.session({ email, password })

  res.json(sessionResponse)
})

export default UsersRouter
