import { useMemo, useState } from 'react';
import type { PublishHistoryEntry } from '@/types/publish-history';

type RecentActivityCardProps = {
	items: PublishHistoryEntry[];
};

const PAGE_SIZE = 5;

export default function RecentActivityCard({ items }: RecentActivityCardProps) {
	const [page, setPage] = useState(1);

	const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
	const visibleItems = useMemo(() => {
		const start = (page - 1) * PAGE_SIZE;
		return items.slice(start, start + PAGE_SIZE);
	}, [items, page]);

	const currentPageItems = visibleItems.map((item) => {
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
	});

	return (
		<section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm">
			<p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
				Recent Activity
			</p>
			<ul className="mt-4 space-y-3">{currentPageItems}</ul>
			{items.length > PAGE_SIZE ? (
				<div className="mt-4 flex items-center justify-between gap-3 text-sm text-slate-400">
					<button
						type="button"
						onClick={() => setPage((value) => Math.max(1, value - 1))}
						disabled={page === 1}
						className="rounded-full border border-slate-700 px-3 py-1.5 transition disabled:cursor-not-allowed disabled:opacity-50"
					>
						Previous
					</button>
					<span>
						Page {page} of {totalPages}
					</span>
					<button
						type="button"
						onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
						disabled={page === totalPages}
						className="rounded-full border border-slate-700 px-3 py-1.5 transition disabled:cursor-not-allowed disabled:opacity-50"
					>
						Next
					</button>
				</div>
			) : null}
		</section>
	);
}
