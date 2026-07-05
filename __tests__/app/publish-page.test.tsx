import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PublishPage from '@/app/publish/page';

describe('Publish page', () => {
	beforeEach(() => {
		Object.defineProperty(window, 'open', {
			value: jest.fn(),
			writable: true,
		});
		(global as typeof globalThis & { fetch: jest.Mock }).fetch = jest
			.fn()
			.mockResolvedValue({
				ok: true,
				json: async () => ({ success: true }),
			});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('renders a back link to the dashboard', () => {
		render(<PublishPage />);

		expect(screen.getByRole('link', { name: /back to dashboard/i })).toHaveAttribute(
			'href',
			'/',
		);
	});

	it('keeps the publish button disabled when content is empty', () => {
		render(<PublishPage />);

		const publishButton = screen.getByRole('button', { name: /publish to linkedin/i });

		expect(publishButton).toBeDisabled();
	});

	it('shows an error when publish is attempted with empty content', async () => {
		render(<PublishPage />);

		const publishButton = screen.getByRole('button', { name: /publish to linkedin/i });

		await userEvent.click(publishButton);

		expect(screen.getByText('Ready')).toBeInTheDocument();
	});

	it('shows a fallback error message when publishing fails with a non-error value', async () => {
		render(<PublishPage />);

		const textarea = screen.getByLabelText(/linkedin post/i);
		const publishButton = screen.getByRole('button', { name: /publish to linkedin/i });

		(global as typeof globalThis & { fetch: jest.Mock }).fetch = jest
			.fn()
			.mockRejectedValue('boom');

		await userEvent.type(textarea, 'Hello from Content Creator OS');
		await userEvent.click(publishButton);

		await waitFor(() => {
			expect(screen.getByText(/unable to publish to linkedin/i)).toBeInTheDocument();
		});
	});

	it('enables publish when content is entered and submits the draft', async () => {
		render(<PublishPage />);

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
			expect(screen.getByText(/waiting for human approval/i)).toBeInTheDocument();
		});
	});
});
