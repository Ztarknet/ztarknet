import { NextResponse } from 'next/server';

const RPC_ENDPOINT = process.env.RPC_ENDPOINT || 'https://rpc.regtest.ztarknet.cash';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(RPC_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('RPC Proxy Error:', error);
    return NextResponse.json({ error: 'Failed to proxy RPC request' }, { status: 500 });
  }
}
