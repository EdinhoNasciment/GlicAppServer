import { Router } from 'express'

import MeasurementRouter from './measurement.routes'
import UsersRouter from './user.routes'

const Routes = Router()

Routes.use('/users', UsersRouter)
Routes.use('/measurement', MeasurementRouter)

export default Routes
