'use client';

import { useEffect, useState } from 'react';

import DashboardHeader from '@/components/dashboard/DashboardHeader';
import PrimaryActionCard from '@/components/dashboard/PrimaryActionCard';
import RecentActivityCard from '@/components/dashboard/RecentActivityCard';
import StatsCard from '@/components/dashboard/StatsCard';
import WelcomeCard from '@/components/dashboard/WelcomeCard';
import type { PublishHistoryEntry } from '@/types/publish-history';

export default function HomePage() {
	const [recentActivity, setRecentActivity] = useState<PublishHistoryEntry[]>([]);

	useEffect(() => {
		void fetch('/api/history')
			.then((res) => (res.ok ? res.json() : Promise.resolve({ history: [] })))
			.then((history) => {
				setRecentActivity(history.history ?? []);
			})
			.catch(() => {
				setRecentActivity([]);
			});
	}, []);

	return (
		<div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
			<div className="mx-auto flex max-w-5xl flex-col gap-6">
				<div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm sm:p-8 lg:p-10">
					<DashboardHeader title="Content Creator OS" version="v0.1.0-alpha" />
				</div>

				<div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
					<div className="space-y-6">
						<WelcomeCard name="Prad" />
						<PrimaryActionCard
							href="/publish"
							label="New LinkedIn Post"
							title="Publish"
						/>
					</div>

					<div className="space-y-6">
						<RecentActivityCard items={recentActivity} />
						<StatsCard title="LinkedIn Sessions" value={recentActivity.length} />
					</div>
				</div>
			</div>
		</div>
	);
}
