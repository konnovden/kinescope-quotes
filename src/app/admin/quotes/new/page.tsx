"use client"
import { useState } from 'react'
import { fmt } from '@/lib/money'

type Line = { section: string; name: string; unit: string; qty: number; price: number; note?: string; order?: number }
const SECTIONS = ['Препродакшн','Продакшн','Стриминг','Постпродакшн','Оборудование','Локация / Логистика','Прочее']
const UNITS = ['час','смена','день','шт','ед.']

export default function NewQuote(){
  const [title, setTitle] = useState('Онлайн‑трансляция мероприятия')
  const [currency, setCurrency] = useState('RUB')
  const [discountPct, setDiscount] = useState(0)
  const [platform, setPlatform] = useState('Kinescope')
  const [lines, setLines] = useState<Line[]>([
    { section: 'Препродакшн', name: 'Технический продюсер', unit: 'час', qty: 4, price: 1500 },
    { section: 'Продакшн', name: 'Оператор (камера 1)', unit: 'смена', qty: 1, price: 8000 },
    { section: 'Стриминг', name: 'Инженер эфира', unit: 'смена', qty: 1, price: 9000 },
  ])
  const [createdUrl, setCreatedUrl] = useState<string | null>(null)

  const subtotal = lines.reduce((s,l)=> s + (Number(l.qty)||0)*(Number(l.price)||0), 0)
  const discount = subtotal * (discountPct||0)/100
  const base = Math.max(0, subtotal - discount)
  const usn = base * 0.07
  const total = base + usn

  const addLine = () => setLines([...lines, { section: 'Прочее', name: '', unit: 'шт', qty: 1, price: 0 }])
  const updateLine = (i: number, patch: Partial<Line>) => setLines(lines.map((l,idx)=> idx===i? {...l, ...patch}: l))
  const removeLine = (i: number) => setLines(lines.filter((_,idx)=> idx!==i))

  async function createQuote(){
    const res = await fetch('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, platform, currency, discountPct, lines })
    })
    const data = await res.json()
    if(res.ok){
      const url = `${location.origin}/q/${data.token}`
      setCreatedUrl(url)
      navigator.clipboard.writeText(url).catch(()=>{})
    } else {
      alert('Ошибка: ' + (data.error || res.statusText))
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Новая смета</h2>
        <button onClick={createQuote} className="px-4 py-2 rounded-xl bg-black text-white">Сохранить и получить ссылку</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-4 border">
            <div className="text-xs text-slate-500 mb-1">Название</div>
            <input value={title} onChange={e=>setTitle(e.target.value)} className="w-full px-3 py-2 rounded-xl border" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
              <label className="block">
                <div className="text-xs text-slate-500 mb-1">Платформа</div>
                <input value={platform} onChange={e=>setPlatform(e.target.value)} className="w-full px-3 py-2 rounded-xl border" />
              </label>
              <label className="block">
                <div className="text-xs text-slate-500 mb-1">Валюта</div>
                <select value={currency} onChange={e=>setCurrency(e.target.value)} className="w-full px-3 py-2 rounded-xl border">
                  <option>RUB</option><option>EUR</option><option>USD</option><option>TRY</option>
                </select>
              </label>
              <label className="block">
                <div className="text-xs text-slate-500 mb-1">Скидка, %</div>
                <input type="number" value={discountPct} onChange={e=>setDiscount(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl border" />
              </label>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-2 pr-2">Раздел</th>
                  <th className="py-2 pr-2">Описание</th>
                  <th className="py-2 pr-2">Ед.</th>
                  <th className="py-2 pr-2">Кол-во</th>
                  <th className="py-2 pr-2">Цена</th>
                  <th className="py-2 pr-2 text-right">Сумма</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {lines.map((l,i)=>{
                  const lineTotal = (Number(l.qty)||0)*(Number(l.price)||0)
                  return (
                    <tr key={i} className="border-t">
                      <td className="py-2 pr-2">
                        <select value={l.section} onChange={e=>updateLine(i,{section:e.target.value})} className="px-3 py-2 rounded-xl border">
                          {SECTIONS.map(s=> <option key={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="py-2 pr-2">
                        <input value={l.name} onChange={e=>updateLine(i,{name:e.target.value})} placeholder="Название позиции" className="w-full px-3 py-2 rounded-xl border mb-1" />
                        <input value={l.note||''} onChange={e=>updateLine(i,{note:e.target.value})} placeholder="Комментарий (необязательно)" className="w-full px-3 py-2 rounded-xl border" />
                      </td>
                      <td className="py-2 pr-2"><select value={l.unit} onChange={e=>updateLine(i,{unit:e.target.value})} className="px-3 py-2 rounded-xl border">{UNITS.map(u=> <option key={u}>{u}</option>)}</select></td>
                      <td className="py-2 pr-2"><input type="number" value={l.qty} onChange={e=>updateLine(i,{qty:Number(e.target.value)})} className="w-24 px-3 py-2 rounded-xl border" /></td>
                      <td className="py-2 pr-2"><input type="number" value={l.price} onChange={e=>updateLine(i,{price:Number(e.target.value)})} className="w-28 px-3 py-2 rounded-xl border" /></td>
                      <td className="py-2 pr-2 text-right">{fmt(lineTotal, currency)}</td>
                      <td className="py-2 pr-2 text-right"><button onClick={()=>removeLine(i)} className="px-2 py-1 text-xs rounded-lg bg-red-50 text-red-600">Удалить</button></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div className="mt-3"><button onClick={addLine} className="px-3 py-2 rounded-xl border">+ Добавить позицию</button></div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border">
            <div className="flex justify-between text-sm"><span>Подытог</span><span>{fmt(subtotal, currency)}</span></div>
            <div className="flex justify-between text-sm"><span>Скидка ({discountPct||0}%)</span><span>-{fmt(discount, currency)}</span></div>
            <div className="flex justify-between text-sm"><span>База</span><span>{fmt(base, currency)}</span></div>
            <div className="flex justify-between text-sm"><span>УСН 7%</span><span>{fmt(usn, currency)}</span></div>
            <div className="flex justify-between text-lg font-semibold pt-2 border-t"><span>Итого</span><span>{fmt(total, currency)}</span></div>
          </div>

          {createdUrl && (
            <div className="bg-white rounded-2xl p-4 border">
              <div className="text-sm mb-2">Ссылка для клиента (скопирована в буфер):</div>
              <input readOnly value={createdUrl} className="w-full px-3 py-2 rounded-xl border text-xs" />
              <a href={createdUrl} target="_blank" className="inline-block mt-2 text-blue-600 underline">Открыть публичную страницу</a>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}