import { render, screen } from '@testing-library/react';
import WelcomeCard from '@/components/dashboard/WelcomeCard';

describe('WelcomeCard', () => {
	it('renders the evening greeting by default', () => {
		jest.useFakeTimers().setSystemTime(new Date('2026-01-01T18:00:00'));
		render(<WelcomeCard name="Prad" />);

		expect(screen.getByText(/good evening, prad/i)).toBeInTheDocument();
	});

	it('renders the morning greeting for early hours', () => {
		jest.useFakeTimers().setSystemTime(new Date('2026-01-01T08:00:00'));

		render(<WelcomeCard name="Prad" />);

		expect(screen.getByText(/good morning, prad/i)).toBeInTheDocument();
		jest.useRealTimers();
	});
});
