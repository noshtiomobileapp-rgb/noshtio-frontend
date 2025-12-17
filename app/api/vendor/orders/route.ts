import { NextResponse } from 'next/server';
// In-memory orders store for demo purposes.
let orders = globalThis.__VENDOR_ORDERS ||= [
  {id:'1', customerName:'Alice', total:250, status:'pending', items:[{name:'Burger', qty:1}]},
  {id:'2', customerName:'Bob', total:400, status:'accepted', items:[{name:'Pizza', qty:2}]},
];

export async function GET() {
  return NextResponse.json(orders);
}
