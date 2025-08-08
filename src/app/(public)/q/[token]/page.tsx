import { prisma } from '@/lib/prisma'
import { fmt } from '@/lib/money'
import { CopyQuoteLink } from '@/components/CopyQuoteLink'

export const dynamic = 'force-dynamic'

export default async function QuotePage({ params }: { params: { token: string }}){
  const quote = await prisma.quote.findFirst({
    where: { publicToken: params.token },
    include: { client: true, company: true, lines: { orderBy: { order: 'asc' } }, terms: true }
  })
  if(!quote){
    return <main className="max-w-3xl mx-auto px-6 py-16"><h1 className="text-2xl font-semibold">Предложение не найдено</h1></main>
  }
  const subtotal = quote.lines.reduce((s,l)=> s + Number(l.qty) * Number(l.price), 0)
  const discount = subtotal * (quote.discountPct||0)/100
  const base = Math.max(0, subtotal - discount)
  const usn = base * 0.07
  const total = base + usn

  return (
    <main className="max-w-5xl mx-auto px-6 py-8 bg-white">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          {quote.company?.logoUrl && <img src={quote.company.logoUrl} alt="logo" className="h-10 object-contain" />}
          <div>
            <div className="text-xl font-semibold">{quote.company?.name ?? 'Kinescope'}</div>
            <div className="text-xs text-slate-500">{quote.company?.website ?? 'kinescope.io'}</div>
          </div>
        </div>
        <div className="text-right text-sm">
          <div className="font-semibold">Коммерческое предложение</div>
          <div>{new Date().toLocaleDateString('ru-RU')}</div>
        </div>
      </header>

      {/* Show a copyable public link to this quote */}
      <CopyQuoteLink token={params.token} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-slate-50">
          <div className="text-xs text-slate-500">Клиент</div>
          <div className="font-medium">{quote.client?.name}</div>
          <div className="text-sm">{quote.client?.contact}</div>
          <div className="text-sm text-slate-600">
            {quote.client?.email}
            {quote.client?.phone && (' • ' + quote.client?.phone)}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50">
          <div className="text-xs text-slate-500">Проект</div>
          <div className="font-medium">{quote.title}</div>
          <div className="text-sm">Платформа: {quote.platform ?? '—'}</div>
          <div className="text-sm">Дата: {quote.eventDate ? new Date(quote.eventDate).toLocaleDateString('ru-RU') : '—'}</div>
        </div>
      </div>

      <div className="space-y-6 mb-8">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr className="text-left">
              <th className="py-2 px-3">Описание</th>
              <th className="py-2 px-3">Ед.</th>
              <th className="py-2 px-3">Кол-во</th>
              <th className="py-2 px-3">Цена</th>
              <th className="py-2 px-3 text-right">Сумма</th>
            </tr>
          </thead>
          <tbody>
            {quote.lines.map((l)=>{
              const lineTotal = Number(l.qty) * Number(l.price)
              return (
                <tr key={l.id} className="border-t">
                  <td className="py-2 px-3">
                    <div className="font-medium">{l.name}</div>
                    {l.note && <div className="text-xs text-slate-500">{l.note}</div>}
                  </td>
                  <td className="py-2 px-3">{l.unit}</td>
                  <td className="py-2 px-3">{String(l.qty)}</td>
                  <td className="py-2 px-3">{fmt(Number(l.price), quote.currency)}</td>
                  <td className="py-2 px-3 text-right">{fmt(lineTotal, quote.currency)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="md:col-span-2 p-4 rounded-2xl bg-slate-50">
          <div className="text-sm font-semibold mb-2">Условия</div>
          <ul className="list-disc ml-5 text-sm space-y-1">
            {(quote.terms?.includes ?? []).map((t,i)=> <li key={i}>{t}</li>)}
          </ul>
          {Boolean(quote.terms?.excludes?.length) && (<>
            <div className="text-sm font-semibold mt-4 mb-2">Не входит</div>
            <ul className="list-disc ml-5 text-sm space-y-1">
              {quote.terms!.excludes!.map((t,i)=> <li key={i}>{t}</li>)}
            </ul>
          </>)}
          {quote.terms?.payment && <div className="text-sm mt-4"><span className="font-semibold">Оплата:</span> {quote.terms.payment}</div>}
          {quote.terms?.sla && <div className="text-sm"><span className="font-semibold">SLA:</span> {quote.terms.sla}</div>}
          {quote.notes && <div className="text-sm mt-4"><span className="font-semibold">Заметки:</span> {quote.notes}</div>}
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 h-fit">
          <div className="flex justify-between text-sm"><span>Подытог</span><span>{fmt(subtotal, quote.currency)}</span></div>
          <div className="flex justify-between text-sm"><span>Скидка ({quote.discountPct||0}%)</span><span>-{fmt(discount, quote.currency)}</span></div>
          <div className="flex justify-between text-sm"><span>База</span><span>{fmt(base, quote.currency)}</span></div>
          <div className="flex justify-between text-sm"><span>УСН 7%</span><span>{fmt(usn, quote.currency)}</span></div>
          <div className="flex justify-between text-lg font-semibold pt-2 border-t mt-2"><span>Итого</span><span>{fmt(total, quote.currency)}</span></div>
          <button onClick={()=>window.print()} className="w-full mt-3 px-4 py-2 rounded-xl bg-black text-white">Скачать PDF</button>
        </div>
      </div>

      <footer className="text-xs text-slate-500 flex flex-wrap gap-2">
        <span>{quote.company?.legalName}</span>
        <span>•</span>
        <span>{quote.company?.address}</span>
        <span>•</span>
        <span>{quote.company?.email}</span>
        {quote.company?.phone && (<><span>•</span><span>{quote.company.phone}</span></>)}
      </footer>
    </main>
  )
}
