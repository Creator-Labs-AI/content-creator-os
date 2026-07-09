import { BlobStorage } from '@/storage/blob-storage';
import { get, put } from '@vercel/blob';

jest.mock('@vercel/blob', () => ({
	get: jest.fn(),
	put: jest.fn(),
}));

const mockedGet = get as jest.MockedFunction<typeof get>;
const mockedPut = put as jest.MockedFunction<typeof put>;

describe('BlobStorage appendHistory', () => {
	beforeEach(() => {
		jest.resetAllMocks();
		process.env.BLOB_READ_WRITE_TOKEN = 'test-token';
	});

	afterEach(() => {
		delete process.env.BLOB_READ_WRITE_TOKEN;
	});

	test('appendHistory reads existing blob and writes merged history', async () => {
		const existing = {
			history: [{ id: 'existing', status: 'initiated', date: '2024-01-01' }],
		};
		const added = {
			history: [{ id: 'new', status: 'initiated', date: '2024-01-02' }],
		};
		mockedGet.mockResolvedValue({ stream: JSON.stringify(existing) } as never);
		mockedPut.mockResolvedValue({
			url: 'https://blob.example/publish-history.json',
		} as never);

		const storage = new BlobStorage();
		await storage.appendHistory(added);

		expect(mockedPut).toHaveBeenCalledWith(
			expect.stringContaining('publish-history.json'),
			JSON.stringify({ history: [...existing.history, ...added.history] }),
			expect.objectContaining({ access: 'private', token: 'test-token' }),
		);
	});
});
