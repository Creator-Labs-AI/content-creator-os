import { NextResponse } from 'next/server';
import type { PublishHistory } from '@/types/publish-history';

export async function GET() {
	try {
		const { PublishHistoryService } = await import('@/services/publish-history.service');
		const service = await PublishHistoryService.createFromEnv();
		const data: PublishHistory = await service.getHistory();
		return NextResponse.json(data);
	} catch {
		return NextResponse.json({ history: [] });
	}
}
