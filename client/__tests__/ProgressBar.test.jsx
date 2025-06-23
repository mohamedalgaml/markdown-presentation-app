import { render, screen } from '@testing-library/react';
import ProgressBar from '../src/components/ProgressBar';
import { describe, it, expect, vi } from 'vitest';

describe('ProgressBar Component', () => {
  it('renders correctly with default props', () => {
    render(<ProgressBar current={0} total={0} />);
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveStyle('width: 100%');
    expect(progressBar.firstChild).toHaveStyle('width: 0%');
  });
  it('calculates and displays correct progress percentage (50%)', () => {
    render(<ProgressBar current={5} total={10} />);
    
    const progressFill = screen.getByRole('progressbar').firstChild;
    expect(progressFill).toHaveStyle('width: 50%');
  });
  it('calculates and displays correct progress percentage (100%)', () => {
    render(<ProgressBar current={10} total={10} />);
    
    const progressFill = screen.getByRole('progressbar').firstChild;
    expect(progressFill).toHaveStyle('width: 100%');
  });
  it('handles zero total without errors', () => {
    render(<ProgressBar current={5} total={0} />);
    
    const progressFill = screen.getByRole('progressbar').firstChild;
    expect(progressFill).toHaveStyle('width: 0%');
  });
  it('handles current > total by capping at 100%', () => {
    render(<ProgressBar current={15} total={10} />);
    
    const progressFill = screen.getByRole('progressbar').firstChild;
    expect(progressFill).toHaveStyle('width: 100%');
  });
  it('handles negative current value gracefully', () => {
    render(<ProgressBar current={-5} total={10} />);
    
    const progressFill = screen.getByRole('progressbar').firstChild;
    expect(progressFill).toHaveStyle('width: 0%');
  });
  it('applies transition style for smooth animation', () => {
    render(<ProgressBar current={3} total={10} />);
    
    const progressFill = screen.getByRole('progressbar').firstChild;
    expect(progressFill).toHaveStyle('transition: width 0.3s ease-in-out');
  });
  it('applies correct styling classes', () => {
    render(<ProgressBar current={2} total={5} />);
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveStyle('background: #eee');
    expect(progressBar).toHaveStyle('border-radius: 10px');
    expect(progressBar.firstChild).toHaveStyle('background: #4caf50');
  });
  it('handles floating point values correctly', () => {
    render(<ProgressBar current={1.5} total={3} />);
    
    const progressFill = screen.getByRole('progressbar').firstChild;
    expect(progressFill).toHaveStyle('width: 50%');
  });
  it('has proper accessibility attributes', () => {
    render(<ProgressBar current={3} total={10} />);
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '3');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '10');
  });
  it('accepts and applies custom color prop', () => {
    render(<ProgressBar current={3} total={10} color="#ff0000" />);
    
    const progressFill = screen.getByRole('progressbar').firstChild;
    expect(progressFill).toHaveStyle('background: #ff0000');
  });
  it('accepts and applies custom height prop', () => {
    render(<ProgressBar current={3} total={10} height="20px" />);
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveStyle('height: 20px');
  });
  it('accepts and applies custom borderRadius prop', () => {
    render(<ProgressBar current={3} total={10} borderRadius="20px" />);
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveStyle('border-radius: 20px');
    expect(progressBar.firstChild).toHaveStyle('border-radius: 20px');
  });
  it('displays optional label correctly', () => {
    render(<ProgressBar current={3} total={10} label="Loading..." />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
  it('handles rapid progress updates without errors', () => {
    const { rerender } = render(<ProgressBar current={1} total={10} />);
    
    
    for (let i = 2; i <= 5; i++) {
      rerender(<ProgressBar current={i} total={10} />);
    }
    
    const progressFill = screen.getByRole('progressbar').firstChild;
    expect(progressFill).toHaveStyle('width: 50%');
  });
});