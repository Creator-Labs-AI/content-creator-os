import React from 'react';
import { render } from '@testing-library/react';
import RecentActivityCard from '@/components/dashboard/RecentActivityCard';
import type { PublishHistoryEntry } from '@/types/publish-history';

describe('RecentActivityCard', () => {
	it('exports a component', () => {
		expect(RecentActivityCard).toBeDefined();
	});

	it('renders without crashing', () => {
		const { container } = render(<RecentActivityCard items={[]} />);
		expect(container).toBeTruthy();
	});

	it('renders the correct number of items', () => {
		const items: PublishHistoryEntry[] = [
			{ id: 1, status: 'published', title: 'Activity 1', date: '2024-01-01' },
			{ id: 2, status: 'published', title: 'Activity 2', date: '2024-01-02' },
		];
		const { container } = render(<RecentActivityCard items={items} />);
		expect(container.querySelectorAll('li').length).toBe(items.length);
	});

	it('renders the correct status and date for each item', () => {
		const items: PublishHistoryEntry[] = [
			{ id: 1, status: 'published', title: 'Activity 1', date: '2024-01-01' },
			{ id: 2, status: 'draft', title: 'Activity 2', date: '2024-01-02' },
		];
		const { getByText } = render(<RecentActivityCard items={items} />);
		expect(getByText('published')).toBeInTheDocument();
		expect(getByText('2024-01-01')).toBeInTheDocument();
		expect(getByText('draft')).toBeInTheDocument();
		expect(getByText('2024-01-02')).toBeInTheDocument();
	});
});
