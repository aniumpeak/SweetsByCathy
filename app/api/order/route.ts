import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const { name, phone, email, dessertName, quantity, pickupDate, specialRequests } = data

    // Validate required fields
    if (!name || !phone || !dessertName || !quantity || !pickupDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Format the email content
    const emailSubject = `New Order Request: ${dessertName}`
    const emailBody = `
New Order Request from Sweets By Cathy Website

Customer Information:
---------------------
Name: ${name}
Phone: ${phone}
Email: ${email || "Not provided"}

Order Details:
--------------
Dessert: ${dessertName}
Quantity: ${quantity}
Preferred Pickup Date: ${pickupDate}

Special Requests:
-----------------
${specialRequests || "None"}

---
This order was submitted through the website. Please contact the customer to confirm the order and provide payment instructions.
    `.trim()

    // For now, we'll log the order and return success
    // In production, you would integrate with an email service like Resend, SendGrid, etc.
    console.log("=== NEW ORDER RECEIVED ===")
    console.log("To: yellowlady29@aol.com")
    console.log("Subject:", emailSubject)
    console.log("Body:", emailBody)
    console.log("=========================")

    // TODO: Integrate with email service
    // Example with Resend:
    // await resend.emails.send({
    //   from: 'orders@sweetsbycathy.com',
    //   to: 'yellowlady29@aol.com',
    //   subject: emailSubject,
    //   text: emailBody,
    // })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Order submission error:", error)
    return NextResponse.json(
      { error: "Failed to process order" },
      { status: 500 }
    )
  }
}
