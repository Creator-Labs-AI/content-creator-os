import { put, get } from '@vercel/blob';
import type { PublishHistory } from '@/types/publish-history';
import type { StorageProvider } from './storage-provider';

const BLOB_FILE_NAME = 'publish-history.json';

export class BlobStorage implements StorageProvider {
	async readHistory(): Promise<PublishHistory> {
		try {
			const token = process.env.BLOB_READ_WRITE_TOKEN;
			if (!token) {
				console.error(
					'Vercel Blob: No token found. Set BLOB_READ_WRITE_TOKEN environment variable.',
				);
				return { history: [] };
			}

			const getResult = await get(BLOB_FILE_NAME, {
				access: 'private',
				token,
			});

			if (!getResult) {
				return { history: [] };
			}

			const { stream } = getResult;
			if (!stream) {
				return { history: [] };
			}

			const isBodyWithText = (value: unknown): value is { text: () => Promise<string> } =>
				typeof value === 'object' &&
				value !== null &&
				typeof (value as { text?: unknown }).text === 'function';

			const streamCandidate = stream as unknown;
			const text =
				typeof streamCandidate === 'string'
					? streamCandidate
					: isBodyWithText(streamCandidate)
						? await streamCandidate.text()
						: await new Response(streamCandidate as BodyInit).text();

			const payload = (JSON.parse(text) || {}) as Partial<PublishHistory>;
			return this.normalizeHistory(payload);
		} catch (error) {
			console.error('Unable to read publish history from blob storage.', error);
			return { history: [] };
		}
	}

	async writeHistory(history: PublishHistory): Promise<void> {
		try {
			const payload = this.normalizeHistory(history);
			await put(BLOB_FILE_NAME, JSON.stringify(payload), {
				access: 'private',
			});
		} catch (error) {
			console.error('Unable to write publish history to blob storage.', error);
		}
	}

	private normalizeHistory(payload?: Partial<PublishHistory>): PublishHistory {
		return {
			history: Array.isArray(payload?.history) ? payload.history : [],
		};
	}
}

export default BlobStorage;
