export async function POST(request: Request) {
  try {
    const body = await request.json()
    const response = await fetch("http://localhost:3000/api/eliza/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "eliza",
        prompt: " Create a worker " + body.message,
        stream: false,
      }),
    })
    console.log(response)
    if (!response.ok) {
      throw new Error("Failed to get response from Eliza")
    }

    const data = await response.json()
    return data.response
  } catch (error) {
    console.error("Error communicating with Eliza:", error)
    throw error
  }
}
