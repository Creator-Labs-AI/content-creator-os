/**
 * @jest-environment node
 */

import { promises as fs } from 'fs';
import path from 'path';
import { GET } from '@/app/api/history/route';
import { NextResponse } from 'next/server';

const historyFilePath = path.resolve(
	process.cwd(),
	'src',
	'data',
	'publish-history.json',
);

describe('History API Route', () => {
	beforeEach(async () => {
		await fs.writeFile(historyFilePath, JSON.stringify({ history: [] }));
	});

	afterEach(async () => {
		await fs.writeFile(historyFilePath, JSON.stringify({ history: [] }));
	});

	it('returns an empty history array by default', async () => {
		const response = await GET();
		expect(response).toBeInstanceOf(NextResponse);
		const json = await response.json();

		expect(response.status).toBe(200);
		expect(json).toEqual({ history: [] });
	});
});
