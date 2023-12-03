import cors from 'cors'
import express from 'express'
import 'express-async-errors'

import ensureErrorHandling from './middleware/ensureErrorHandling'
import Routes from './routes'

const app = express()
app.use(express.json())
app.use(cors({ origin: '*' }))

app.use(Routes)

app.use(ensureErrorHandling)

app.listen(3333, () => {
  console.log('🚀 Server started on port 3333')
})
