import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

test("GET on api/v1/status should return status 200", async () => {
  const response = await fetch("http:localhost:3000/api/v1/status");
  const responseBody = await response.json();
  const parsedResponseBody = new Date(responseBody.updated_at).toISOString();
  const database = responseBody.dependencies.database;
  expect(responseBody.updated_at).toBe(parsedResponseBody);
  expect(response.status).toBe(200);
  expect(database.version).toBe("16.0");
  expect(typeof Number(database.max_connections)).toBe("number");
  expect(Number(database.opened_connections) === 1).toBe(true);
});
