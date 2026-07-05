import type { PublishHistory } from '@/types/publish-history';
import type { StorageProvider } from './storage-provider';

/**
 * BlobStorage reads a JSON file from a Vercel Blob URL provided via
 * environment variable `VERCEL_BLOB_URL`.
 * If no URL is configured, readHistory returns an empty history.
 */
export class BlobStorage implements StorageProvider {
	private blobUrl?: string;

	constructor() {
		this.blobUrl = process.env.VERCEL_BLOB_URL;
	}

	async readHistory(): Promise<PublishHistory> {
		if (!this.blobUrl) {
			// Fail gracefully if not configured
			return { history: [] };
		}

		try {
			const res = await fetch(this.blobUrl);
			if (!res.ok) return { history: [] };
			const parsed = (await res.json()) as PublishHistory;
			return parsed;
		} catch {
			return { history: [] };
		}
	}

	async writeHistory(history: PublishHistory): Promise<void> {
		if (!this.blobUrl) {
			throw new Error('Blob storage is not configured.');
		}

		const res = await fetch(this.blobUrl, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(history),
		});

		if (!res.ok) {
			throw new Error(`Unable to write publish history (${res.status}).`);
		}
	}
}

export default BlobStorage;
