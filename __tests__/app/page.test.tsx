import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';

describe('Home page', () => {
	it('renders the dashboard landing page with the primary CTA', () => {
		render(<HomePage />);

		expect(
			screen.getByRole('heading', { name: /content creator os/i }),
		).toBeInTheDocument();
		expect(screen.getByText(/version/i)).toBeInTheDocument();
		expect(screen.getByText(/v0\.1\.0-alpha/i)).toBeInTheDocument();
		expect(
			screen.getByText(/good (morning|afternoon|evening|night), prad/i),
		).toBeInTheDocument();
		expect(screen.getByRole('link', { name: /\+ new linkedin post/i })).toHaveAttribute(
			'href',
			'/publish',
		);
		expect(screen.getByText(/linkedin sessions/i)).toBeInTheDocument();
		expect(screen.getByText('3')).toBeInTheDocument();
	});
});
