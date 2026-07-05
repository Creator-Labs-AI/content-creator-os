import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import PublishHistoryService from '@/services/publish-history.service';
import { LocalStorage } from '@/storage/local-storage';

describe('PublishHistoryService', () => {
	it('appends a new LinkedIn history event without overwriting existing history', async () => {
		const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'history-service-'));
		const tempFile = path.join(tempDir, 'publish-history.json');
		await fs.writeFile(
			tempFile,
			JSON.stringify({
				history: [
					{
						id: 'existing',
						platform: 'linkedin',
						initiatedAt: '2024-01-01T00:00:00.000Z',
						preview: 'existing',
						characterCount: 8,
					},
				],
			}),
		);

		const storage = new LocalStorage(tempFile);
		const service = new PublishHistoryService(storage);
		const uuidSpy = jest
			.spyOn(globalThis.crypto, 'randomUUID')
			.mockReturnValue('new-id' as ReturnType<typeof crypto.randomUUID>);
		jest.useFakeTimers();
		jest.setSystemTime(new Date('2024-05-01T12:00:00.000Z'));

		try {
			await service.addHistoryEvent('Hello LinkedIn world!');

			const persisted = JSON.parse(await fs.readFile(tempFile, 'utf-8'));
			expect(persisted.history).toHaveLength(2);
			expect(persisted.history[1]).toEqual({
				id: 'new-id',
				platform: 'linkedin',
				status: 'initiated',
				date: '2024-05-01T12:00:00.000Z',
				initiatedAt: '2024-05-01T12:00:00.000Z',
				preview: 'Hello LinkedIn world!',
				characterCount: 21,
			});
		} finally {
			uuidSpy.mockRestore();
			jest.useRealTimers();
			await fs.rm(tempDir, { recursive: true, force: true });
		}
	});
});
