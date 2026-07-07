import { BlobStorage } from '@/storage/blob-storage';
import { list, put } from '@vercel/blob';

jest.mock('@vercel/blob', () => ({
	list: jest.fn(),
	put: jest.fn(),
}));

const mockedList = list as jest.MockedFunction<typeof list>;
const mockedPut = put as jest.MockedFunction<typeof put>;

describe('BlobStorage', () => {
	beforeEach(() => {
		jest.resetAllMocks();
		jest.spyOn(console, 'warn').mockImplementation(() => undefined);
		jest.spyOn(console, 'error').mockImplementation(() => undefined);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('returns empty history when no publish-history.json blob exists', async () => {
		mockedList.mockResolvedValue({ blobs: [], cursor: undefined } as never);

		const storage = new BlobStorage();
		await expect(storage.readHistory()).resolves.toEqual({ history: [] });
		expect(mockedList).toHaveBeenCalledWith(
			expect.objectContaining({ prefix: 'publish-history.json' }),
		);
	});

	it('returns parsed history when the blob exists and fetch succeeds', async () => {
		const payload = {
			history: [{ id: 'event-1', status: 'initiated', date: '2024-01-01' }],
		};
		mockedList.mockResolvedValue({
			blobs: [
				{
					pathname: 'publish-history.json',
					url: 'https://blob.example/publish-history.json',
				},
			],
			cursor: undefined,
		} as never);
		global.fetch = jest.fn().mockResolvedValue({
			ok: true,
			json: async () => payload,
		}) as unknown as typeof fetch;

		const storage = new BlobStorage();
		await expect(storage.readHistory()).resolves.toEqual(payload);
	});

	it('returns empty history when the blob fetch response is not ok', async () => {
		mockedList.mockResolvedValue({
			blobs: [
				{
					pathname: 'publish-history.json',
					url: 'https://blob.example/publish-history.json',
				},
			],
			cursor: undefined,
		} as never);
		global.fetch = jest
			.fn()
			.mockResolvedValue({ ok: false, status: 404 }) as unknown as typeof fetch;

		const storage = new BlobStorage();
		await expect(storage.readHistory()).resolves.toEqual({ history: [] });
	});

	it('returns empty history when the blob payload is malformed', async () => {
		mockedList.mockResolvedValue({
			blobs: [
				{
					pathname: 'publish-history.json',
					url: 'https://blob.example/publish-history.json',
				},
			],
			cursor: undefined,
		} as never);
		global.fetch = jest.fn().mockResolvedValue({
			ok: true,
			json: async () => ({ notHistory: [] }),
		}) as unknown as typeof fetch;

		const storage = new BlobStorage();
		await expect(storage.readHistory()).resolves.toEqual({ history: [] });
	});

	it('returns empty history when blob lookup throws', async () => {
		mockedList.mockRejectedValue(new Error('boom'));

		const storage = new BlobStorage();
		await expect(storage.readHistory()).resolves.toEqual({ history: [] });
	});

	it('writes the history payload to publish-history.json', async () => {
		mockedPut.mockResolvedValue({
			url: 'https://blob.example/publish-history.json',
			pathname: 'publish-history.json',
		} as never);

		const storage = new BlobStorage();
		const payload = {
			history: [{ id: 'event-1', status: 'initiated', date: '2024-01-01' }],
		};

		await storage.writeHistory(payload);

		expect(mockedPut).toHaveBeenCalledWith(
			'publish-history.json',
			JSON.stringify(payload),
			expect.objectContaining({ access: 'public' }),
		);
	});

	it('logs and swallows write errors', async () => {
		mockedPut.mockRejectedValue(new Error('boom'));

		const storage = new BlobStorage();
		await expect(storage.writeHistory({ history: [] })).resolves.toBeUndefined();
	});
});
