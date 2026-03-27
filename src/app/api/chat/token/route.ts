import { NextRequest, NextResponse } from 'next/server';

const CHAT_SERVER_URL = process.env.NEXT_PUBLIC_CHAT_SERVER_URL;
const CHAT_API_KEY = process.env.CHAT_SERVER_API_KEY;
const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

export async function GET(req: NextRequest) {
  if (!CHAT_SERVER_URL || !CHAT_API_KEY) {
    return NextResponse.json({ error: 'Chat server not configured' }, { status: 503 });
  }

  const firebaseToken = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!firebaseToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify Firebase ID token using the Identity Toolkit REST API
  const verifyRes = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: firebaseToken }),
    },
  ).catch(() => null);

  if (!verifyRes?.ok) {
    return NextResponse.json({ error: 'Invalid Firebase token' }, { status: 401 });
  }

  const { users } = await verifyRes.json() as {
    users?: Array<{ localId: string; email?: string; displayName?: string; photoUrl?: string }>;
  };
  const firebaseUser = users?.[0];

  if (!firebaseUser) {
    return NextResponse.json({ error: 'Invalid Firebase token' }, { status: 401 });
  }

  // Exchange for a chat server JWT
  const chatRes = await fetch(`${CHAT_SERVER_URL}/api/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': CHAT_API_KEY,
    },
    body: JSON.stringify({
      userId: firebaseUser.localId,
      name: firebaseUser.displayName ?? null,
      email: firebaseUser.email ?? null,
      avatar: firebaseUser.photoUrl ?? null,
      role: 'user',
    }),
  });

  if (!chatRes.ok) {
    const err = await chatRes.text();
    console.error('[chat/token] Chat server error:', err);
    return NextResponse.json({ error: 'Failed to get chat token' }, { status: 502 });
  }

  const data = await chatRes.json();
  return NextResponse.json(data);
}
