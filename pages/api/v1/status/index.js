import database from 'infra/database';

export default async function status(request, response) {
  const updated_at = new Date().toISOString()
  response.status(200).json({updated_at})
}