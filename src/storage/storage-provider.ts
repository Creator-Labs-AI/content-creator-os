import type { PublishHistory } from '@/types/publish-history';
import { LocalStorage } from './local-storage';
import { BlobStorage } from './blob-storage';

export interface StorageProvider {
	readHistory(): Promise<PublishHistory>;
	writeHistory(history: PublishHistory): Promise<void>;
	appendHistory(history: PublishHistory): Promise<void>;
}

export function createStorageProvider(): StorageProvider {
	const provider = process.env.STORAGE_PROVIDER?.toLowerCase();

	if (provider === 'blob') {
		return new BlobStorage();
	}

	if (provider === 'local') {
		return new LocalStorage();
	}

	const isVercel =
		typeof process.env.VERCEL !== 'undefined' ||
		typeof process.env.VERCEL_ENV !== 'undefined';
	if (isVercel) {
		return new BlobStorage();
	}

	return new LocalStorage();
}

export default createStorageProvider;
