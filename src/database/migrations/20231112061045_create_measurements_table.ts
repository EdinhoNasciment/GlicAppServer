import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('measurements', table => {
    table.string('measurementId').primary()
    table.string('userId').notNullable()
    table.decimal('value').notNullable()
    table.string('createdAt').notNullable()

    table
      .foreign('userId')
      .references('userId')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('measurements')
}
