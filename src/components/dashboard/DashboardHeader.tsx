type DashboardHeaderProps = {
	title: string;
	version: string;
};

export default function DashboardHeader({ title, version }: DashboardHeaderProps) {
	return (
		<div className="space-y-2 text-center sm:text-left">
			<h1 className="text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl">
				{title}
			</h1>
			<p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-400 sm:text-base">
				Version
			</p>
			<p className="text-lg font-medium text-slate-300">{version}</p>
		</div>
	);
}
