import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from '@/app/page';

describe('Home page', () => {
	beforeEach(() => {
		Object.defineProperty(window, 'open', {
			value: jest.fn(),
			writable: true,
		});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('enables publish when content is entered and submits the draft', async () => {
		render(<HomePage />);

		const textarea = screen.getByLabelText(/linkedin post/i);
		const publishButton = screen.getByRole('button', { name: /publish to linkedin/i });

		expect(publishButton).toBeDisabled();

		await userEvent.type(textarea, 'Hello from Content Creator OS');

		expect(screen.getByText(/character count:/i)).toBeInTheDocument();
		expect(publishButton).toBeEnabled();

		await userEvent.click(publishButton);

		await waitFor(() => {
			expect(window.open).toHaveBeenCalledWith(
				expect.stringContaining('linkedin.com/feed'),
				'_blank',
				'noopener,noreferrer',
			);
		});
		await waitFor(() => {
			expect(screen.getByText(/done/i)).toBeInTheDocument();
		});
	});
});
