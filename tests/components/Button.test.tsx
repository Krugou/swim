import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('exposes its label and handles user interaction', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Refresh</Button>);

    fireEvent.click(screen.getByRole('button', { name: 'Refresh' }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('preserves the disabled state', () => {
    render(<Button disabled>Loading</Button>);

    expect(screen.getByRole('button', { name: 'Loading' })).toBeDisabled();
  });
});
