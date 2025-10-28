import { NextRequest, NextResponse } from 'next/server'
import { transporter } from '@/lib/NodeMailer'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 })
    }

    const { name, email, contactNumber, title, description } = body as Record<string, string>

    if (!name || name.trim().length < 2) return NextResponse.json({ message: 'Name is required' }, { status: 400 })
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ message: 'Valid email is required' }, { status: 400 })
    if (!contactNumber || contactNumber.trim().length < 6) return NextResponse.json({ message: 'Valid contact number is required' }, { status: 400 })
    if (!title || title.trim().length < 4) return NextResponse.json({ message: 'Title is required' }, { status: 400 })
    if (!description || description.trim().length < 10) return NextResponse.json({ message: 'Description is required' }, { status: 400 })

    const ownerEmail = process.env.NODEMAILER_EMAIL
    if (!ownerEmail) {
      return NextResponse.json({ message: 'Email configuration missing' }, { status: 500 })
    }

    const subject = `New Contact Us: ${title}`
    const html = `
      <div style="font-family: Inter, ui-sans-serif, system-ui; line-height: 1.6; color: #0b1021;">
        <h2>New Contact Query</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Contact Number:</strong> ${escapeHtml(contactNumber)}</p>
        <p><strong>Title:</strong> ${escapeHtml(title)}</p>
        <p><strong>Description:</strong></p>
        <div style="white-space: pre-wrap;">${escapeHtml(description)}</div>
      </div>
    `

    await transporter.sendMail({
      from: `Signalist Contact <${ownerEmail}>`,
      to: ownerEmail,
      subject,
      html,
      replyTo: email
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ message: 'Failed to send message' }, { status: 500 })
  }
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}


