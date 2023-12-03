import path from "path";
import { Knex } from "knex";

const KnexConfiguration: { [key: string]: Knex.Config } = {
  development: {
    client: "sqlite3",
    connection: {
      filename: path.resolve(__dirname, "src/database/scheduleDatabase.sqlite"),
      password: "1234",
    },
    migrations: {
      directory: path.resolve(__dirname, "src/database/migrations"),
    },
    useNullAsDefault: true,
  },
};

export default KnexConfiguration;
