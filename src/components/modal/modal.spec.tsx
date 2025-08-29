import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Modal } from './modal';

describe('Modal', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders children', () => {
    render(
      <Modal onClose={onClose}>
        <div>Modal Content</div>
      </Modal>,
    );

    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('has role dialog and aria-modal', () => {
    render(
      <Modal onClose={onClose}>
        <div>Content</div>
      </Modal>,
    );

    const overlay = screen.getByRole('dialog');
    expect(overlay).toHaveAttribute('aria-modal', 'true');
  });

  it('calls onClose when clicking on overlay', () => {
    render(
      <Modal onClose={onClose}>
        <div>Content</div>
      </Modal>,
    );

    const overlay = screen.getByRole('dialog');
    fireEvent.mouseDown(overlay);
    fireEvent.click(overlay);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onClose when clicking inside modal', () => {
    render(
      <Modal onClose={onClose}>
        <div>Content</div>
      </Modal>,
    );

    const modal = screen.getByText('Content');
    fireEvent.mouseDown(modal);
    fireEvent.click(modal);

    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when pressing Escape', () => {
    render(
      <Modal onClose={onClose}>
        <div>Content</div>
      </Modal>,
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose for other keys', () => {
    render(
      <Modal onClose={onClose}>
        <div>Content</div>
      </Modal>,
    );

    fireEvent.keyDown(document, { key: 'Enter' });
    fireEvent.keyDown(document, { key: 'Tab' });

    expect(onClose).not.toHaveBeenCalled();
  });
});