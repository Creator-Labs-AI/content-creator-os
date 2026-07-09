import { BlobStorage } from '@/storage/blob-storage';
import { put, get } from '@vercel/blob';

jest.mock('@vercel/blob', () => ({
	put: jest.fn(),
	get: jest.fn(),
}));

const mockedPut = put as jest.MockedFunction<typeof put>;
const mockedGet = get as jest.MockedFunction<typeof get>;

describe('BlobStorage', () => {
	beforeEach(() => {
		jest.resetAllMocks();
		process.env.BLOB_READ_WRITE_TOKEN = 'test-token';
		jest.spyOn(console, 'warn').mockImplementation(() => undefined);
		jest.spyOn(console, 'error').mockImplementation(() => undefined);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('returns empty history when the blob does not exist', async () => {
		mockedGet.mockResolvedValue(null);

		const storage = new BlobStorage();
		await expect(storage.readHistory()).resolves.toEqual({ history: [] });
		expect(mockedGet).toHaveBeenCalledWith(
			expect.stringContaining('publish-history.json'),
			expect.objectContaining({ access: 'private', token: 'test-token' }),
		);
	});

	it('returns empty history when the token is missing', async () => {
		delete process.env.BLOB_READ_WRITE_TOKEN;

		const storage = new BlobStorage();
		await expect(storage.readHistory()).resolves.toEqual({ history: [] });
		expect(mockedGet).not.toHaveBeenCalled();
	});

	it('returns parsed history when the blob exists and get succeeds', async () => {
		const payload = {
			history: [{ id: 'event-1', status: 'initiated', date: '2024-01-01' }],
		};
		mockedGet.mockResolvedValue({
			stream: JSON.stringify(payload),
			blob: {
				url: 'https://blob.example/publish-history.json',
				downloadUrl: 'https://blob.example/publish-history.json?download=1',
				pathname: 'publish-history.json',
				size: 123,
				uploadedAt: new Date(),
				contentType: 'application/json',
				contentDisposition: '',
				cacheControl: '',
				tetag: 'etag',
			},
		} as never);

		const storage = new BlobStorage();
		await expect(storage.readHistory()).resolves.toEqual(payload);
		expect(mockedGet).toHaveBeenCalledWith(
			expect.stringContaining('publish-history.json'),
			expect.objectContaining({ access: 'private', token: 'test-token' }),
		);
	});

	it('returns empty history when get returns null', async () => {
		mockedGet.mockResolvedValue(null);

		const storage = new BlobStorage();
		await expect(storage.readHistory()).resolves.toEqual({ history: [] });
	});

	it('returns empty history when the stream is missing', async () => {
		mockedGet.mockResolvedValue({
			stream: null,
			blob: {
				url: 'https://blob.example/publish-history.json',
				downloadUrl: 'https://blob.example/publish-history.json?download=1',
				pathname: 'publish-history.json',
				size: 123,
				uploadedAt: new Date(),
				contentType: 'application/json',
				contentDisposition: '',
				cacheControl: '',
				tetag: 'etag',
			},
		} as never);

		const storage = new BlobStorage();
		await expect(storage.readHistory()).resolves.toEqual({ history: [] });
	});

	it('returns empty history when the blob payload is malformed', async () => {
		mockedGet.mockResolvedValue({
			stream: JSON.stringify({ notHistory: [] }),
			blob: {
				url: 'https://blob.example/publish-history.json',
				downloadUrl: 'https://blob.example/publish-history.json?download=1',
				pathname: 'publish-history.json',
				size: 123,
				uploadedAt: new Date(),
				contentType: 'application/json',
				contentDisposition: '',
				cacheControl: '',
				tetag: 'etag',
			},
		} as never);

		const storage = new BlobStorage();
		await expect(storage.readHistory()).resolves.toEqual({ history: [] });
	});

	it('returns parsed history from a body-like stream', async () => {
		const payload = {
			history: [{ id: 'event-1', status: 'initiated', date: '2024-01-01' }],
		};
		mockedGet.mockResolvedValue({
			stream: {
				text: async () => JSON.stringify(payload),
			},
			blob: {
				url: 'https://blob.example/publish-history.json',
				downloadUrl: 'https://blob.example/publish-history.json?download=1',
				pathname: 'publish-history.json',
				size: 123,
				uploadedAt: new Date(),
				contentType: 'application/json',
				contentDisposition: '',
				cacheControl: '',
				tetag: 'etag',
			},
		} as never);

		const storage = new BlobStorage();
		await expect(storage.readHistory()).resolves.toEqual(payload);
	});

	it('returns empty history when get throws', async () => {
		mockedGet.mockRejectedValue(new Error('boom'));

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
			expect.objectContaining({ access: 'private' }),
		);
	});

	it('logs and swallows write errors', async () => {
		mockedPut.mockRejectedValue(new Error('boom'));

		const storage = new BlobStorage();
		await expect(storage.writeHistory({ history: [] })).resolves.toBeUndefined();
	});
});
