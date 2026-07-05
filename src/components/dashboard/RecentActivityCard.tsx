import type { PublishHistoryEntry } from '@/types/publish-history';

type RecentActivityCardProps = {
	items: PublishHistoryEntry[];
};

export default function RecentActivityCard({ items }: RecentActivityCardProps) {
	return (
		<section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm">
			<p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
				Recent Activity
			</p>
			<ul className="mt-4 space-y-3">
				{items.map((item) => {
					const entry = item as PublishHistoryEntry;
					const status =
						entry.status ?? (entry.preview ? 'Sent to LinkedIn' : 'LinkedIn Session');
					const rawDate = entry.date ?? entry.initiatedAt ?? '';
					const date =
						rawDate && !Number.isNaN(Date.parse(rawDate))
							? new Date(rawDate).toLocaleString(undefined, {
									dateStyle: 'medium',
									timeStyle: 'short',
								})
							: rawDate;
					const key =
						typeof entry.id === 'number' ? entry.id : String(entry.id ?? Math.random());

					return (
						<li
							key={key}
							className="flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3"
						>
							<span className="flex items-center gap-2 text-sm font-medium text-slate-200">
								<span className="text-cyan-400">✓</span>
								{status}
							</span>
							<span className="text-sm text-slate-400">{date}</span>
						</li>
					);
				})}
			</ul>
		</section>
	);
}
