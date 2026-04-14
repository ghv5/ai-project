import crypto from 'node:crypto';
import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
const CALLBACK_SECRET = process.env.NEXT_PORTAL_SSO_CALLBACK_SECRET || 'change-me';

export async function POST(request) {
  try {
    const body = await request.json();
    const platform = body?.platform === 'simulate' ? 'simulate' : 'annotate';
    const ticket = typeof body?.ticket === 'string' ? body.ticket.trim() : '';

    if (!ticket) {
      return NextResponse.json({ code: 400, msg: 'ticket is required' }, { status: 400 });
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const nonce = crypto.randomUUID();
    const sign = crypto
      .createHash('sha256')
      .update(`${ticket}|${timestamp}|${nonce}|${CALLBACK_SECRET}`)
      .digest('hex');

    const response = await fetch(`${API_BASE_URL}/portal/sso/ticket/exchange`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ticket,
        nonce,
        sign,
        timestamp
      }),
      cache: 'no-store'
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(result, { status: response.status });
    }

    return NextResponse.json({
      ...result,
      meta: {
        platform
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        code: 500,
        msg: error instanceof Error ? error.message : 'exchange failed'
      },
      { status: 500 }
    );
  }
}
