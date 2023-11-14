import database from '../../../../infra/database';

export default async function status(request, response) {
  const {query} = database;
  const result = await query("SELECT 1 + 1 as sum;");
  console.log(result.rows);
  response.status(200).json({message: "curso.dev is phenomenal"})
}