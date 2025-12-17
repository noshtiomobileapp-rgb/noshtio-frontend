import { NextResponse } from 'next/server';
let orders = globalThis.__VENDOR_ORDERS ||= [];

export async function GET(req: Request, { params }: any) {
  const { id } = params;
  const o = orders.find(x=>String(x.id)===String(id));
  return NextResponse.json(o || null);
}

export async function PATCH(req: Request, { params }: any) {
  const { id } = params;
  const body = await req.json();
  const idx = orders.findIndex(x=>String(x.id)===String(id));
  if(idx===-1) return NextResponse.json({error:'not found'}, {status:404});
  orders[idx] = {...orders[idx], ...body};
  return NextResponse.json(orders[idx]);
}
