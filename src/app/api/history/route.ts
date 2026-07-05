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

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as { content?: string; platform?: string };
		const content = body.content?.trim();

		if (typeof body.content !== 'string' || !content) {
			return NextResponse.json(
				{ success: false, error: 'Content is required.' },
				{ status: 400 },
			);
		}

		if (body.platform !== 'linkedin') {
			return NextResponse.json(
				{ success: false, error: 'Unsupported platform.' },
				{ status: 400 },
			);
		}

		const { PublishHistoryService } = await import('@/services/publish-history.service');
		const service = await PublishHistoryService.createFromEnv();
		await service.addHistoryEvent(content);

		return NextResponse.json({ success: true });
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : 'Unable to record history.',
			},
			{ status: 500 },
		);
	}
}
