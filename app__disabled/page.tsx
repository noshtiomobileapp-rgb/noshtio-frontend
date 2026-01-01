export default function Home() {
  return (
    <section className="space-y-6">
      <h1 className="text-4xl font-bold">Qrestro</h1>
      <p className="text-lg text-slate-600">Customer + Vendor SaaS starter — Tailwind + Next.js (app router)</p>
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <a href="/customer" className="p-6 bg-white rounded-lg shadow hover:shadow-md">
          <h2 className="text-2xl font-semibold">Customer App →</h2>
          <p className="text-slate-500 mt-2">Browse restaurants, view menu, cart & checkout.</p>
        </a>
        <a href="/vendor" className="p-6 bg-white rounded-lg shadow hover:shadow-md">
          <h2 className="text-2xl font-semibold">Vendor Dashboard →</h2>
          <p className="text-slate-500 mt-2">Onboard vendor, manage menu, orders & analytics.</p>
        </a>
      </div>
    </section>
  )
}
