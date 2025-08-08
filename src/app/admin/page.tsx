import Link from 'next/link'

export default function AdminHome(){
  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Админка</h2>
        <Link href="/admin/quotes/new" className="px-3 py-2 rounded-xl bg-black text-white">Новая смета</Link>
      </div>
      <div className="text-slate-600">Перейдите к созданию новой сметы.</div>
    </main>
  )
}
