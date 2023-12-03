import knex from 'knex'

import KnexConfiguration from '../../knexfile'

const KnexConnection = knex(KnexConfiguration.development)

export default KnexConnection
