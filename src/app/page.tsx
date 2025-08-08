import Link from 'next/link'

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Kinescope Quotes</h1>
      <p className="text-slate-600 mb-6">Сервис для формирования смет и публичного шаринга предложений.</p>
      <div className="flex gap-3">
        <Link href="/admin" className="px-4 py-2 rounded-2xl bg-black text-white">Открыть админку</Link>
      </div>
    </main>
  )
}
