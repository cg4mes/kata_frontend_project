import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StatsCard from './StatsCard';

describe('StatsCard Component', () => {
	const mockIcon = <span data-testid="mock-icon">📊</span>;

	it('renders card with label and value', () => {
		render(<StatsCard icon={mockIcon} label="Total Projects" value={42} bgColor="bg-blue-500" />);

		expect(screen.getByText('Total Projects')).toBeInTheDocument();
		expect(screen.getByText('42')).toBeInTheDocument();
		expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
	});

	it('renders string value', () => {
		render(
			<StatsCard icon={mockIcon} label="Success Rate" value="95.5%" bgColor="bg-green-500" />
		);

		expect(screen.getByText('Success Rate')).toBeInTheDocument();
		expect(screen.getByText('95.5%')).toBeInTheDocument();
	});

	it('applies correct background color to icon container', () => {
		render(
			<StatsCard icon={mockIcon} label="Total Tests" value={100} bgColor="bg-purple-500" />
		);

		const iconContainer = screen.getByTestId('mock-icon').parentElement;
		expect(iconContainer).toHaveClass('bg-purple-500');
	});

	it('renders as static card when no onClick provided', () => {
		render(<StatsCard icon={mockIcon} label="Static Card" value={10} bgColor="bg-gray-500" />);

		const card = screen.getByText('Static Card').closest('div');
		expect(card?.tagName).toBe('DIV');
	});

	it('renders as button when onClick provided', () => {
		const handleClick = vi.fn();
		render(
			<StatsCard
				icon={mockIcon}
				label="Clickable Card"
				value={20}
				bgColor="bg-blue-500"
				onClick={handleClick}
			/>
		);

		const button = screen.getByText('Clickable Card').closest('button');
		expect(button?.tagName).toBe('BUTTON');
	});

	it('calls onClick when card is clicked', async () => {
		const user = userEvent.setup();
		const handleClick = vi.fn();

		render(
			<StatsCard
				icon={mockIcon}
				label="Click Me"
				value={30}
				bgColor="bg-blue-500"
				onClick={handleClick}
			/>
		);

		const button = screen.getByRole('button');
		await user.click(button);

		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it('applies active ring when isActive is true', () => {
		render(
			<StatsCard
				icon={mockIcon}
				label="Active Card"
				value={40}
				bgColor="bg-blue-500"
				isActive={true}
				onClick={() => {}}
			/>
		);

		const button = screen.getByRole('button');
		expect(button).toHaveClass('ring-2', 'ring-blue-500');
	});

	it('does not apply active ring when isActive is false', () => {
		render(
			<StatsCard
				icon={mockIcon}
				label="Inactive Card"
				value={50}
				bgColor="bg-blue-500"
				isActive={false}
				onClick={() => {}}
			/>
		);

		const button = screen.getByRole('button');
		expect(button).not.toHaveClass('ring-2');
	});

	it('generates correct id for clickable card', () => {
		render(
			<StatsCard
				icon={mockIcon}
				label="Total Test Runs"
				value={60}
				bgColor="bg-blue-500"
				onClick={() => {}}
			/>
		);

		const button = screen.getByRole('button');
		expect(button).toHaveAttribute('id', 'stat-card-total-test-runs');
	});

	it('applies hover styles to clickable card', () => {
		render(
			<StatsCard
				icon={mockIcon}
				label="Hover Me"
				value={70}
				bgColor="bg-blue-500"
				onClick={() => {}}
			/>
		);

		const button = screen.getByRole('button');
		expect(button).toHaveClass('hover:shadow-lg', 'hover:scale-105');
	});
});
