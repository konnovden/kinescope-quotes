import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (token) {
    const quote = await prisma.quote.findFirst({
      where: { publicToken: token },
      include: { client: true, company: true, lines: { orderBy: { order: 'asc' } }, terms: true },
    })
    if (!quote) return NextResponse.json({ error: 'not_found' }, { status: 404 })
    return NextResponse.json({ quote })
  }
  const quotes = await prisma.quote.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ quotes })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  // Minimal validation; in prod use zod
  const data = {
    title: body.title as string,
    platform: body.platform ?? null,
    eventDate: body.eventDate ? new Date(body.eventDate) : null,
    currency: body.currency ?? 'RUB',
    usnRate: 7,
    discountPct: body.discountPct ?? 0,
    notes: body.notes ?? null,
    company: { connectOrCreate: { where: { id: body.companyId ?? 'seed-company' }, create: { id: body.companyId ?? 'seed-company', name: 'Kinescope' } } },
    client: body.client
      ? {
          connectOrCreate: {
            where: { id: body.client.id ?? undefined },
            create: {
              name: body.client.name ?? 'Клиент',
              // when creating a new client, link it to the same company
              company: { connect: { id: body.companyId ?? 'seed-company' } },
            },
          },
        }
      : undefined,
    lines: { create: (body.lines || []).map((l: any, idx: number) => ({ section: l.section, name: l.name, unit: l.unit, qty: l.qty, price: l.price, note: l.note ?? null, order: l.order ?? idx })) },
    terms: body.terms ? { create: { includes: body.terms.includes ?? [], excludes: body.terms.excludes ?? [], payment: body.terms.payment ?? null, sla: body.terms.sla ?? null } } : undefined,
  }
  const quote = await prisma.quote.create({ data })
  return NextResponse.json({ id: quote.id, token: quote.publicToken }, { status: 201 })
}
