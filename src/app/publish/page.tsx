'use client';

import Link from 'next/link';
import { useState } from 'react';

const INITIAL_STATUS = 'Ready';
const statusMessages = {
	ready: 'Ready',
	launching: 'Launching browser...',
	opening: 'Opening LinkedIn...',
	creating: 'Creating post...',
	waiting: 'Waiting for human approval...',
	done: 'Done',
	error: 'Error',
} as const;
const DEFAULT_STATUS_TRANSITION_TIMEOUT_MS = 60;

export function getPublishStatusTransitionTimeoutMs(): number {
	const configuredValue = Number(process.env.NEXT_PUBLIC_PUBLISH_STATUS_TIMEOUT_MS);

	if (Number.isFinite(configuredValue) && configuredValue >= 0) {
		return configuredValue;
	}

	return DEFAULT_STATUS_TRANSITION_TIMEOUT_MS;
}

export default function PublishPage() {
	const [content, setContent] = useState('');
	const [status, setStatus] = useState(INITIAL_STATUS);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [feedback, setFeedback] = useState('');

	const handlePublish = async () => {
		const trimmedContent = content.trim();
		if (!trimmedContent) {
			setStatus(statusMessages.error);
			setFeedback('Please enter some content first.');
			return;
		}

		const popup =
			typeof window !== 'undefined' ? window.open('about:blank', '_blank') : null;

		setIsSubmitting(true);
		setStatus(statusMessages.launching);
		setFeedback('');

		try {
			const response = await fetch('/api/history', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ platform: 'linkedin', content: trimmedContent }),
			});

			if (!response.ok) {
				const data = (await response.json().catch(() => null)) as {
					error?: string;
				} | null;
				throw new Error(data?.error ?? 'Unable to record publish initiation.');
			}

			setStatus(statusMessages.opening);
			setStatus(statusMessages.creating);

			const encodedContent = encodeURIComponent(trimmedContent);
			const shareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodedContent}`;

			if (typeof window !== 'undefined' && popup) {
				popup.location.assign(shareUrl);
				popup.focus();
			} else if (typeof window !== 'undefined') {
				const fallbackLink = document.createElement('a');
				fallbackLink.href = shareUrl;
				fallbackLink.target = '_blank';
				fallbackLink.rel = 'noopener,noreferrer';
				fallbackLink.click();
			}

			setStatus(statusMessages.waiting);
			setFeedback('The LinkedIn draft was opened. Please review and click Post.');
			window.setTimeout(() => {
				setStatus(statusMessages.done);
				setFeedback('Ready for next Post.');
			}, getPublishStatusTransitionTimeoutMs());
		} catch (error) {
			setStatus(statusMessages.error);
			setFeedback(
				error instanceof Error ? error.message : 'Unable to publish to LinkedIn.',
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
			<div className="mx-auto flex max-w-3xl flex-col gap-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/40 sm:p-8 lg:p-10">
				<div className="space-y-2">
					<Link
						href="/"
						className="inline-flex text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
					>
						← Back to Dashboard
					</Link>
					<p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
						Content Creator OS
					</p>
					<h1 className="text-3xl font-semibold sm:text-4xl">Publish to LinkedIn</h1>
					<p className="text-sm text-slate-400 sm:text-base">
						Open a draft on LinkedIn and leave it ready for your review.
					</p>
				</div>

				<div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 sm:p-6">
					<label
						htmlFor="linkedin-post"
						className="mb-3 block text-sm font-medium text-slate-200"
					>
						LinkedIn Post
					</label>
					<textarea
						id="linkedin-post"
						value={content}
						onChange={(event) => setContent(event.target.value)}
						placeholder="Write your post..."
						className="min-h-64 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-4 text-base text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
					/>

					<div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<p className="text-sm text-slate-400">Character Count: {content.length}</p>
						<button
							type="button"
							onClick={handlePublish}
							disabled={isSubmitting || content.trim().length === 0}
							className="rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
						>
							{isSubmitting ? 'Publishing...' : 'Publish to LinkedIn'}
						</button>
					</div>
				</div>

				<div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 sm:p-6">
					<p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
						Status
					</p>
					<p className="mt-2 text-lg font-medium text-slate-100">{status}</p>
					{feedback ? <p className="mt-2 text-sm text-slate-400">{feedback}</p> : null}
				</div>
			</div>
		</div>
	);
}
