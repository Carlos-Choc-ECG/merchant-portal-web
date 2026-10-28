import Link from 'next/link';
import { Construction, ArrowLeft, Clock } from 'lucide-react';

export const instant = false;

interface Props {
  params: Promise<{ slug: string[] }>;
}

function formatSlug(slug: string[]): string {
  return slug
    .map((s) =>
      s
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    )
    .join(' / ');
}

const PROGRESS_ITEMS = [
  { label: 'Design', done: true },
  { label: 'API Integration', done: true },
  { label: 'UI Implementation', done: false },
  { label: 'QA & Testing', done: false },
];

export default async function UnderConstructionPage({ params }: Props) {
  const { slug } = await params;
  const pageName = formatSlug(slug);

  return (
    <div className="min-h-full bg-slate-100 flex items-center justify-center px-8 py-16">
      <div className="w-full max-w-lg">
        {/* ── Main card ── */}
        <div className="rounded-2xl border border-slate-200 bg-white px-10 py-10 text-center shadow-sm">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-800">
              <Construction size={34} className="text-amber-400" />
              {/* Pulsing ring */}
              <span className="absolute -inset-1 rounded-2xl border-2 border-amber-400/30 animate-ping" />
            </div>
          </div>

          {/* Heading */}
          <p className="mb-1 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-indigo-700">
            Under Construction
          </p>
          <h1 className="text-xl font-bold text-slate-900">{pageName}</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            This section is actively being built. Our engineering team is
            working to bring it online shortly.
          </p>

          {/* Progress checklist */}
          <div className="mt-8 rounded-xl border border-slate-100 bg-slate-50 px-6 py-4 text-left">
            <p className="mb-3 text-[0.6rem] font-bold uppercase tracking-[0.12em] text-slate-400">
              Build Progress
            </p>
            <ul className="space-y-2.5">
              {PROGRESS_ITEMS.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-3 text-sm"
                >
                  {item.done ? (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-bold">
                      ✓
                    </span>
                  ) : (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-slate-200 bg-white">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-pulse" />
                    </span>
                  )}
                  <span
                    className={item.done ? 'text-slate-700' : 'text-slate-400'}
                  >
                    {item.label}
                  </span>
                  {!item.done && (
                    <span className="ml-auto text-[10px] font-medium text-amber-500">
                      In Progress
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* ETA note */}
          <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <Clock size={12} />
            <span>Expected availability: next sprint</span>
          </div>
        </div>

        {/* ── Back link (outside card) ── */}
        <div className="mt-6 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <ArrowLeft size={14} />
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
