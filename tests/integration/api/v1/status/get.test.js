test("GET on api/v1/status should return status 200", async () => {
  const response = await fetch("http:localhost:3000/api/v1/status");
  const responseBody = await response.json()
  const parsedResponseBody = new Date(responseBody.updated_at).toISOString()
  expect(responseBody.updated_at).toBe(parsedResponseBody)
  expect(response.status).toBe(200)
})