import { Link } from 'react-router-dom';

function LandingPage() {
  const cards = [
    { label: 'Security', value: 'Biometrics + MFA' },
    { label: 'Card', value: 'Crimson Visa Elite' },
    { label: 'Support', value: '24/7 customer care' },
  ]

  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-glow ring-1 ring-white/10 sm:p-12">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-8">
          <span className="inline-flex items-center rounded-full bg-crimson-700/15 px-4 py-1 text-sm font-semibold uppercase tracking-[0.35em] text-crimson-200">
            Banking reinvented
          </span>
          <div className="space-y-6">
            <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              A modern banking experience charged with ruby energy.
            </h2>
            <p className="max-w-2xl text-lg leading-8 text-slate-300">
              Crimson Bank blends polished design with fast, secure money management so your finances feel powerful and effortless.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-full bg-crimson-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-crimson-500"
            >
              Open an Account
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-950/90 px-6 py-3 text-base font-semibold text-slate-100 transition hover:border-crimson-600 hover:bg-slate-900"
            >
              Sign In
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {cards.map((card) => (
              <div key={card.label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{card.label}</p>
                <p className="mt-3 text-base font-semibold text-white">{card.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-crimson-900/80 p-8 ring-1 ring-white/10 shadow-xl">
          <div className="space-y-6">
            <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/90 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Active account</p>
                  <p className="mt-4 text-3xl font-semibold text-white">$12,845.26</p>
                </div>
                <span className="inline-flex rounded-full bg-crimson-600/10 px-3 py-1 text-sm font-semibold text-crimson-200">
                  Premium
                </span>
              </div>
              <div className="mt-6 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-900/90 p-4">
                  <p className="font-semibold text-white">Monthly balance</p>
                  <p className="mt-1 text-slate-400">Growth +12.8%</p>
                </div>
                <div className="rounded-3xl bg-slate-900/90 p-4">
                  <p className="font-semibold text-white">Global transfers</p>
                  <p className="mt-1 text-slate-400">No hidden fees</p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] bg-slate-950/90 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Recent transactions</p>
              <div className="mt-5 space-y-4">
                {[
                  { title: 'Mobile payment', subtitle: 'Uber Eats', amount: '- $24.90' },
                  { title: 'Salary deposit', subtitle: 'Internal transfer', amount: '+ $1,250.00' },
                  { title: 'Retail purchase', subtitle: 'Apple Store', amount: '- $199.00' },
                ].map((item) => (
                  <div key={item.title} className="flex items-center justify-between rounded-3xl border border-white/10 bg-slate-900/80 p-4">
                    <div>
                      <p className="font-semibold text-white">{item.title}</p>
                      <p className="text-sm text-slate-400">{item.subtitle}</p>
                    </div>
                    <p className={`${item.amount.startsWith('+') ? 'text-emerald-400' : 'text-crimson-300'} text-sm font-semibold`}>
                      {item.amount}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LandingPage
