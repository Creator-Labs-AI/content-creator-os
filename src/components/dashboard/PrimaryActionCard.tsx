import Link from 'next/link';

type PrimaryActionCardProps = {
	href: string;
	label: string;
	title: string;
};

export default function PrimaryActionCard({
	href,
	label,
	title,
}: PrimaryActionCardProps) {
	return (
		<section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm">
			<p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
				Primary Action
			</p>
			<h2 className="mt-3 text-2xl font-semibold text-slate-100">{title}</h2>
			<Link
				href={href}
				className="mt-6 inline-flex items-center rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
			>
				+ {label}
			</Link>
		</section>
	);
}
