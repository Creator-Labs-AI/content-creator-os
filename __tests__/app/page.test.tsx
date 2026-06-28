import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';

beforeAll(() => {
	// Use Node's built-in globalThis.fetch to populate Jest's environment
	window.fetch = jest.fn().mockImplementation(() =>
		Promise.resolve({
			ok: true,
			json: () => Promise.resolve({ data: [] }), // Customize this mock data as needed
		}),
	);
});

afterAll(() => {
	jest.clearAllMocks();
});

describe('Home page', () => {
	it('renders the dashboard landing page with the primary CTA', async () => {
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
		// default test fixture has empty history
		await screen.findByText('0');
	});
});
