import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // This is a stub implementation.
  // Expect multipart/form-data with file; in Phase-I we'll accept and return a dummy parsed menu.
  const parsed = {
    categories: [
      {name: 'Starters', items: [{name:'Veg Salad', price: 120}, {name:'Paneer Tikka', price:180}]},
      {name: 'Mains', items: [{name:'Butter Chicken', price: 260}, {name:'Dal Makhni', price:160}]}
    ]
  };
  return NextResponse.json(parsed);
}
