type WelcomeCardProps = {
	name: string;
};

function getGreeting() {
	const hour = new Date().getHours();

	if (hour < 12) {
		return 'Good Morning';
	}

	if (hour < 18) {
		return 'Good Afternoon';
	}

	return 'Good Evening';
}

export default function WelcomeCard({ name }: WelcomeCardProps) {
	return (
		<section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm">
			<p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
				Welcome
			</p>
			<h2 className="mt-3 text-2xl font-semibold text-slate-100">
				{getGreeting()}, {name}
			</h2>
			<p className="mt-2 text-sm text-slate-400 sm:text-base">
				A calm place to prepare and publish your next LinkedIn post.
			</p>
		</section>
	);
}
