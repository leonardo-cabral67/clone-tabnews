import database from 'infra/database';
import orchestrator from 'tests/orchestrator.js';


beforeAll(async () => {
  await orchestrator.waitForAllServices()
  await database.query('drop schema public cascade; create schema public;')
})

test("POST to api/v1/migrations should return status 200", async () => {
  const response1 = await fetch("http:localhost:3000/api/v1/migrations", {
    method: 'post'
  });
  expect(response1.status).toBe(201);

  const response1Body = await response1.json();
  expect(Array.isArray(response1Body)).toBe(true);

  const migrations1 = await database.query('select * from "pg-migrations"');
  expect(migrations1.rows.length).toBeGreaterThan(0);

  const response2 = await fetch("http:localhost:3000/api/v1/migrations", {
    method: 'post'
  });
  expect(response2.status).toBe(200);

  const response2Body = await response2.json();
  expect(Array.isArray(response2Body)).toBe(true);
  expect(response2Body.length).toBe(0);
  // const migrations2 = await database.query('select * from "pg-migrations"');
  // expect(migrations2.rows.length).toBe(0);
})