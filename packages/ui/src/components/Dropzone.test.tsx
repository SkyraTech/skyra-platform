import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Dropzone } from './Dropzone';

describe('Dropzone Component', () => {
  it('renders with accessible role and button semantics', () => {
    render(<Dropzone aria-label="Drop files here" />);
    const dropzone = screen.getByRole('button', { name: 'Drop files here' });
    expect(dropzone).toBeInTheDocument();
    expect(dropzone).toHaveAttribute('tabIndex', '0');
  });

  it('handles drag enter, drag over, and drag leave', () => {
    render(<Dropzone data-testid="dropzone" />);
    const dropzone = screen.getByTestId('dropzone');

    fireEvent.dragEnter(dropzone, {
      dataTransfer: { types: ['Files'] },
    });
    expect(dropzone).toHaveClass('skyra-dropzone--active');

    fireEvent.dragOver(dropzone, {
      dataTransfer: { types: ['Files'] },
    });
    expect(dropzone).toHaveClass('skyra-dropzone--active');

    fireEvent.dragLeave(dropzone, {
      dataTransfer: { types: ['Files'] },
    });
    expect(dropzone).not.toHaveClass('skyra-dropzone--active');
  });

  it('calls onDrop with valid files when files are dropped', () => {
    const handleDrop = vi.fn();
    const handleReject = vi.fn();

    render(
      <Dropzone
        accept="image/*"
        onDrop={handleDrop}
        onReject={handleReject}
        data-testid="dropzone"
      />
    );

    const dropzone = screen.getByTestId('dropzone');
    const validFile = new File(['content'], 'avatar.png', { type: 'image/png' });

    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [validFile],
      },
    });

    expect(handleDrop).toHaveBeenCalledTimes(1);
    expect(handleDrop).toHaveBeenCalledWith([validFile]);
    expect(handleReject).not.toHaveBeenCalled();
    expect(dropzone).not.toHaveClass('skyra-dropzone--active');
  });

  it('calls onReject when dropped files fail validation', () => {
    const handleDrop = vi.fn();
    const handleReject = vi.fn();

    render(
      <Dropzone
        accept="image/*"
        onDrop={handleDrop}
        onReject={handleReject}
        data-testid="dropzone"
      />
    );

    const dropzone = screen.getByTestId('dropzone');
    const invalidFile = new File(['content'], 'manual.pdf', { type: 'application/pdf' });

    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [invalidFile],
      },
    });

    expect(handleDrop).not.toHaveBeenCalled();
    expect(handleReject).toHaveBeenCalledTimes(1);
    expect(handleReject.mock.calls[0][0][0].errors[0].code).toBe('file-invalid-type');
  });

  it('triggers file picker click on keyboard Enter or Space', () => {
    render(<Dropzone aria-label="Drop area" />);
    const dropzone = screen.getByRole('button', { name: 'Drop area' });
    const input = dropzone.querySelector('input[type="file"]') as HTMLInputElement;

    const clickSpy = vi.spyOn(input, 'click');

    fireEvent.keyDown(dropzone, { key: 'Enter' });
    expect(clickSpy).toHaveBeenCalled();

    clickSpy.mockClear();
    fireEvent.keyDown(dropzone, { key: ' ' });
    expect(clickSpy).toHaveBeenCalled();
  });

  it('prevents interaction when disabled', () => {
    const handleDrop = vi.fn();

    render(
      <Dropzone
        disabled
        onDrop={handleDrop}
        aria-label="Disabled dropzone"
        data-testid="dropzone"
      />
    );

    const dropzone = screen.getByTestId('dropzone');
    expect(dropzone).toHaveAttribute('aria-disabled', 'true');
    expect(dropzone).toHaveAttribute('tabIndex', '-1');

    fireEvent.dragEnter(dropzone, {
      dataTransfer: { types: ['Files'] },
    });
    expect(dropzone).not.toHaveClass('skyra-dropzone--active');

    const file = new File(['data'], 'test.txt', { type: 'text/plain' });
    fireEvent.drop(dropzone, {
      dataTransfer: { files: [file] },
    });
    expect(handleDrop).not.toHaveBeenCalled();
  });
});
