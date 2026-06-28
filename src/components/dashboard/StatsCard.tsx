type StatsCardProps = {
	title: string;
	value: number;
};

export default function StatsCard({ title, value }: StatsCardProps) {
	return (
		<section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm">
			<p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
				{title}
			</p>
			<p className="mt-4 text-4xl font-semibold text-slate-100">{value}</p>
		</section>
	);
}
