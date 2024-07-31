import database from 'infra/database';

export default async function status(request, response) {
  const { query } = database
  const updated_at = new Date().toISOString()

  const dbVersion = await query('SHOW server_version;')
  const dbVersionValue = dbVersion.rows[0].server_version

  const maxConnections = await query('SHOW max_connections')
  const maxConnectionsValue = parseInt(maxConnections.rows[0].max_connections)

  const databaseName = process.env.POSTGRES_DB
  const opennedConnections = await query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName]
  })

  const opennedConnectionsValue = opennedConnections.rows[0].count

  response.status(200).json({
    updated_at,
    dependencies: {
      database: {
        version: dbVersionValue,
        max_connections: maxConnectionsValue,
        openned_connections: opennedConnectionsValue
      }
    },
  })
}