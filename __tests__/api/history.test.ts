/**
 * @jest-environment node
 */

import { GET } from '@/app/api/history/route';
import { NextResponse } from 'next/server';

describe('History API Route', () => {
	it('returns an empty history array by default', async () => {
		const response = await GET();
		expect(response).toBeInstanceOf(NextResponse);
		const json = await response.json();

		expect(response.status).toBe(200);
		expect(json).toEqual({ history: [] });
	});
});
