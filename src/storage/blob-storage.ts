import { list, put, get } from '@vercel/blob';
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
			console.log(`Found blob for publish history: ${blob.url}`);
			const token = process.env.BLOB_READ_WRITE_TOKEN;
			// Prefer SDK `get` for private stores; it returns a stream and metadata.
			const pathnameOrUrl = blob.pathname ?? blob.url;
			const getResult = await get(pathnameOrUrl, { access: 'private', token });
			if (!getResult) return { history: [] };
			const { stream } = getResult;
			if (!stream) return { history: [] };
			const text = await new Response(stream as unknown as BodyInit).text();
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
			console.log(`Writing publish history to blob storage: ${BLOB_FILE_NAME}`);
			console.log(
				'environment vsriable BLOB_READ_WRITE_TOKEN: ',
				process.env.BLOB_READ_WRITE_TOKEN,
			);
			console.log(
				'environment vsriable NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN: ',
				process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN,
			);
			await put(BLOB_FILE_NAME, JSON.stringify(payload), {
				access: 'private',
			});
		} catch (error) {
			console.error('Unable to write publish history to blob storage.', error);
		}
	}

	private async findBlob() {
		const token = process.env.BLOB_READ_WRITE_TOKEN;
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
