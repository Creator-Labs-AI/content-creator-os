import { promises as fs } from 'fs';
import path from 'path';
import type { PublishHistory } from '@/types/publish-history';
import type { StorageProvider } from './storage-provider';

export class LocalStorage implements StorageProvider {
	private filePath: string;

	constructor(filePath?: string) {
		this.filePath =
			filePath || path.resolve(process.cwd(), 'src', 'data', 'publish-history.json');
	}

	async readHistory(): Promise<PublishHistory> {
		try {
			const raw = await fs.readFile(this.filePath, 'utf-8');
			const parsed = JSON.parse(raw) as PublishHistory;
			return parsed;
		} catch {
			// If file not found or invalid, return empty history
			return { history: [] };
		}
	}

	async writeHistory(history: PublishHistory): Promise<void> {
		await fs.mkdir(path.dirname(this.filePath), { recursive: true });
		await fs.writeFile(this.filePath, JSON.stringify(history, null, 2));
	}

	async appendHistory(history: PublishHistory): Promise<void> {
		const existing = await this.readHistory();
		const merged = {
			history: [...existing.history, ...history.history],
		};
		await this.writeHistory(merged);
	}
}

export default LocalStorage;
