import { Request, Response, Router } from 'express'

import MeasurementController from '../controller/measurementController'
import ensureAuthenticated from '../middleware/ensureAuthenticated'

const measurementRouter = Router()
const measurementController = new MeasurementController()

measurementRouter.post(
  '/',
  ensureAuthenticated,
  async (request: Request, response: Response) => {
    const userId = request.user.userId
    const { value } = request.body

    const createMeasurementResponse =
      await measurementController.createMeasurement({
        userId,
        value
      })

    return response.json(createMeasurementResponse)
  }
)

measurementRouter.get(
  '/',
  ensureAuthenticated,
  async (request: Request, response: Response) => {
    const userId = request.user.userId

    const measurementResponse = await measurementController.returnMeasurements({
      userId
    })

    return response.json(measurementResponse)
  }
)

measurementRouter.delete(
  '/:measurementId',
  ensureAuthenticated,
  async (request: Request, response: Response) => {
    const measurementId = request.params.measurementId

    await measurementController.deleteMeasurementInDB({ measurementId })

    return response.status(200)
  }
)

export default measurementRouter
