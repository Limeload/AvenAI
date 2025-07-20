import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  // Proxy the request to your backend
  const backendRes = await fetch("http://127.0.0.1:5001/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!backendRes.ok) {
    return NextResponse.json({ answer: "Error from backend." }, { status: backendRes.status });
  }

  const data = await backendRes.json();
  return NextResponse.json({ answer: data.answer });
} 
