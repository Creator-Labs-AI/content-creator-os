import type { PublishHistory } from '@/types/publish-history';
import type { StorageProvider } from './storage-provider';

const BLOB_FILE_NAME = 'publish-history.json';

export class BlobStorage implements StorageProvider {
	async readHistory(): Promise<PublishHistory> {
		try {
			const blob = await this.findBlob();
			if (!blob) {
				return { history: [] };
			}
			const response = await fetch(blob.url);
			if (!response.ok) {
				console.warn(
					`Unable to read publish history from blob storage (${response.status}).`,
				);
				return { history: [] };
			}

			const payload = (await response.json()) as Partial<PublishHistory>;
			return this.normalizeHistory(payload);
		} catch (error) {
			console.error('Unable to read publish history from blob storage.', error);
			return { history: [] };
		}
	}

	async writeHistory(history: PublishHistory): Promise<void> {
		try {
			const payload = this.normalizeHistory(history);
			console.log(`Writing publish history to blob storage: ${BLOB_FILE_NAME}`);
			const token = process.env.BLOB_READ_WRITE_TOKEN;
			if (!token) {
				console.error(
					'Vercel Blob: No token found. Set BLOB_READ_WRITE_TOKEN environment variable.',
				);
				return;
			}
			const { put } = await import('@vercel/blob');
			await put(BLOB_FILE_NAME, JSON.stringify(payload), {
				access: 'public',
				token,
			});
		} catch (error) {
			console.error('Unable to write publish history to blob storage.', error);
		}
	}

	private async findBlob() {
		const token = process.env.BLOB_READ_WRITE_TOKEN;
		if (!token) {
			console.error(
				'Vercel Blob: No token found. Either configure the `BLOB_READ_WRITE_TOKEN` environment variable, or pass a `token` option to your calls.',
			);
			return undefined;
		}

		const { list } = await import('@vercel/blob');
		const result = await list({ prefix: BLOB_FILE_NAME, token });
		return result.blobs.find((blob) => blob.pathname === BLOB_FILE_NAME);
	}

	private normalizeHistory(payload?: Partial<PublishHistory>): PublishHistory {
		return {
			history: Array.isArray(payload?.history) ? payload.history : [],
		};
	}
}

export default BlobStorage;
