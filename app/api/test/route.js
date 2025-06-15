import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'API is working!' })
}

export async function PATCH() {
  return NextResponse.json({ message: 'PATCH is working!' })
} 