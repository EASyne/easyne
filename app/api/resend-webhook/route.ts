export async function POST(request: Request) {
  const body = await request.json();

  console.log("Resend Webhook empfangen:", body);

  return Response.json({
    success: true,
  });
}