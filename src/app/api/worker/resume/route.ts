import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const message = body.message

  const responseFromEliza = await fetch(
    "http://localhost:3000/api/eliza/send-message",
    {
      method: "POST",
      body: JSON.stringify({ message: message }),
    }
  )

  const data = await responseFromEliza.json()

  return NextResponse.json({ data })
}
