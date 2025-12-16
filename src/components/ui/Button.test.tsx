import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
	it('renders button with text', () => {
		render(<Button>Click me</Button>);
		expect(screen.getByText('Click me')).toBeInTheDocument();
	});

	it('applies primary variant by default', () => {
		render(<Button>Primary Button</Button>);
		const button = screen.getByText('Primary Button');
		expect(button).toHaveClass('bg-blue-600');
	});

	it('applies success variant', () => {
		render(<Button variant="success">Success Button</Button>);
		const button = screen.getByText('Success Button');
		expect(button).toHaveClass('bg-green-600');
	});

	it('applies danger variant', () => {
		render(<Button variant="danger">Delete</Button>);
		const button = screen.getByText('Delete');
		expect(button).toHaveClass('bg-red-600');
	});

	it('applies secondary variant', () => {
		render(<Button variant="secondary">Cancel</Button>);
		const button = screen.getByText('Cancel');
		expect(button).toHaveClass('bg-white');
	});

	it('applies ghost variant', () => {
		render(<Button variant="ghost">Ghost</Button>);
		const button = screen.getByText('Ghost');
		expect(button).toHaveClass('bg-transparent');
	});

	it('applies small size', () => {
		render(<Button size="sm">Small</Button>);
		const button = screen.getByText('Small');
		expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');
	});

	it('applies medium size by default', () => {
		render(<Button>Medium</Button>);
		const button = screen.getByText('Medium');
		expect(button).toHaveClass('px-4', 'py-2', 'text-base');
	});

	it('applies large size', () => {
		render(<Button size="lg">Large</Button>);
		const button = screen.getByText('Large');
		expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
	});

	it('applies full width', () => {
		render(<Button fullWidth>Full Width</Button>);
		const button = screen.getByText('Full Width');
		expect(button).toHaveClass('w-full');
	});

	it('disables button when disabled prop is true', () => {
		render(<Button disabled>Disabled</Button>);
		const button = screen.getByText('Disabled');
		expect(button).toBeDisabled();
	});

	it('shows loading spinner when isLoading is true', () => {
		render(<Button isLoading>Loading</Button>);
		const button = screen.getByText('Loading');
		expect(button).toBeDisabled();
		expect(button.querySelector('svg')).toBeInTheDocument();
	});

	it('renders icon when provided', () => {
		const TestIcon = () => <span data-testid="test-icon">🎯</span>;
		render(
			<Button icon={<TestIcon />} variant="primary">
				With Icon
			</Button>
		);
		expect(screen.getByTestId('test-icon')).toBeInTheDocument();
		expect(screen.getByText('With Icon')).toBeInTheDocument();
	});

	it('applies custom className', () => {
		render(<Button className="custom-class">Custom</Button>);
		const button = screen.getByText('Custom');
		expect(button).toHaveClass('custom-class');
	});
});
