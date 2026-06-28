type ActivityItem = {
	id: number;
	status: string;
	date: string;
};

type RecentActivityCardProps = {
	items: ActivityItem[];
};

export default function RecentActivityCard({ items }: RecentActivityCardProps) {
	return (
		<section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm">
			<p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
				Recent Activity
			</p>
			<ul className="mt-4 space-y-3">
				{items.map((item) => (
					<li
						key={item.id}
						className="flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3"
					>
						<span className="flex items-center gap-2 text-sm font-medium text-slate-200">
							<span className="text-cyan-400">✓</span>
							{item.status}
						</span>
						<span className="text-sm text-slate-400">{item.date}</span>
					</li>
				))}
			</ul>
		</section>
	);
}
