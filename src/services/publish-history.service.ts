import type { PublishHistory } from '@/types/publish-history';
import type { StorageProvider } from '@/storage/storage-provider';

export class PublishHistoryService {
	constructor(private readonly storageProvider: StorageProvider) {}

	async getHistory(): Promise<PublishHistory> {
		return this.storageProvider.readHistory();
	}

	async addHistoryEvent(content: string): Promise<void> {
		const preview = this.buildPreview(content);
		const initiatedAt = new Date().toISOString();
		const event = {
			id: globalThis.crypto.randomUUID(),
			platform: 'linkedin',
			status: 'initiated',
			date: initiatedAt,
			initiatedAt,
			preview,
			characterCount: content.length,
		};

		await this.storageProvider.appendHistory({ history: [event] });
	}

	private buildPreview(content: string): string {
		if (content.length <= 100) {
			return content;
		}

		return `${content.slice(0, 100)}...`;
	}

	static async createFromEnv(): Promise<PublishHistoryService> {
		const { createStorageProvider } = await import('@/storage/storage-provider');
		const provider = createStorageProvider();
		return new PublishHistoryService(provider);
	}
}

export default PublishHistoryService;
