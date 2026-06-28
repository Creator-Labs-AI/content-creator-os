import type { PublishHistory } from '@/types/publish-history';
import type { StorageProvider } from '@/storage/storage-provider';

export class PublishHistoryService {
	constructor(private readonly storageProvider: StorageProvider) {}

	async getHistory(): Promise<PublishHistory> {
		return this.storageProvider.readHistory();
	}

	static async createFromEnv(): Promise<PublishHistoryService> {
		const { createStorageProvider } = await import('@/storage/storage-provider');
		const provider = createStorageProvider();
		return new PublishHistoryService(provider);
	}
}

export default PublishHistoryService;
