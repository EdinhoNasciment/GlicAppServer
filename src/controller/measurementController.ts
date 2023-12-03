import { v4 as uuidv4 } from 'uuid'

import KnexConnection from '../database/connection'
import AppError from '../errors/AppError'

interface IReqCreateMeasurement {
  value: string
  userId: string
}

interface IReqReturnMeasurement {
  userId: string
}

interface IReqDeleteMeasurement {
  measurementId: string
}

class MeasurementController {
  public async createMeasurement(
    requestData: IReqCreateMeasurement
  ): Promise<IMeasurements> {
    const isoDateNow = new Date().toISOString()

    const measurement: IMeasurements = {
      ...requestData,
      measurementId: uuidv4(),
      createdAt: isoDateNow
    }

    return this.createMeasurementInDB(measurement)
  }

  public async returnMeasurements({ userId }: IReqReturnMeasurement) {
    const measurements = await this.getMeasurementsByUserId(userId, 'desc')

    return measurements
  }

  private async getMeasurementsByUserId(
    userId: string,
    orderBy: 'asc' | 'desc' = 'desc'
  ): Promise<IMeasurements[]> {
    try {
      const measurements = await KnexConnection('measurements')
        .select('*')
        .where('userId', userId)
        .orderBy('createdAt', orderBy)

      return measurements
    } catch (error) {
      console.error({ getMeasurementsByUserIdError: error })

      throw new AppError('Error when fetching measurements by userId', 500)
    }
  }

  private async createMeasurementInDB(
    reqMeasurement: IMeasurements
  ): Promise<IMeasurements> {
    try {
      const [respMeasurement] = await KnexConnection('measurements')
        .insert(reqMeasurement)
        .returning<IMeasurements[]>([
          'userId',
          'measurementId',
          'value',
          'createdAt'
        ])

      return respMeasurement
    } catch (error) {
      console.error({ createMeasurementInDBError: error })

      throw new AppError('Error when creating measurement', 500)
    }
  }

  public async deleteMeasurementInDB({ measurementId }: IReqDeleteMeasurement) {
    try {
      const deletedCount = await KnexConnection('measurements')
        .where('measurementId', measurementId)
        .del()

      if (deletedCount === 0) {
        throw new AppError('Measurement not found', 404)
      }
    } catch (error) {
      console.log({ deleteMeasurementInDBError: error })

      throw new AppError('Error when deleting measurement', 500)
    }
  }
}

export default MeasurementController
