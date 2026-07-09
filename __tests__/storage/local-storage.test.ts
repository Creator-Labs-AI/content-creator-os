import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import { LocalStorage } from '@/storage/local-storage';

describe('LocalStorage', () => {
	test('appendHistory merges new events with existing history', async () => {
		const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'local-storage-'));
		const filePath = path.join(tempDir, 'publish-history.json');

		await fs.writeFile(
			filePath,
			JSON.stringify({
				history: [
					{
						id: 'existing',
						status: 'initiated',
						date: '2024-01-01T00:00:00.000Z',
						initiatedAt: '2024-01-01T00:00:00.000Z',
						preview: 'existing',
						characterCount: 8,
					},
				],
			}),
		);

		const storage = new LocalStorage(filePath);
		await storage.appendHistory({
			history: [
				{
					id: 'new',
					status: 'initiated',
					date: '2024-01-02T00:00:00.000Z',
					initiatedAt: '2024-01-02T00:00:00.000Z',
					preview: 'new event',
					characterCount: 9,
				},
			],
		});

		const persisted = JSON.parse(await fs.readFile(filePath, 'utf-8'));
		expect(persisted.history).toHaveLength(2);
		expect(persisted.history[1]).toEqual({
			id: 'new',
			status: 'initiated',
			date: '2024-01-02T00:00:00.000Z',
			initiatedAt: '2024-01-02T00:00:00.000Z',
			preview: 'new event',
			characterCount: 9,
		});
	});
});
