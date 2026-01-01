import { NextResponse } from 'next/server';
// Simple in-memory stub. Replace with DB calls.
let store = globalThis.__VENDOR_PROFILE ||= {name:'', phone:'', address:'', hours:[]};

export async function GET() {
  return NextResponse.json(store);
}

export async function POST(req: Request) {
  const data = await req.json();
  store = Object.assign(store, data);
  globalThis.__VENDOR_PROFILE = store;
  return NextResponse.json(store);
}
