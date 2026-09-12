import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App, { ChatMessage, MessagePart, ValidatedForm } from '../App';
import * as api from '../api';

beforeEach(() => vi.restoreAllMocks());

describe('chat message renderer', () => {
  it('renders text parts with semantic content', () => {
    render(<ChatMessage message={{ role: 'assistant', parts: [{ type: 'text', text: 'Hello there' }] }} />);
    expect(screen.getByText('Hello there')).toBeVisible();
  });
  it('renders image parts with accessible alt text', () => {
    render(<MessagePart part={{ type: 'image', alt: 'Workflow preview', src: '/preview.png' }} />);
    expect(screen.getByRole('img', { name: 'Workflow preview' })).toHaveAttribute('src', '/preview.png');
  });
  it('renders code parts and language label', () => {
    render(<MessagePart part={{ type: 'code', language: 'js', code: 'const x = 1;' }} />);
    expect(screen.getByText('const x = 1;')).toBeVisible();
    expect(screen.getByText('js')).toBeVisible();
  });
  it('renders tool results by role and label', () => {
    render(<MessagePart part={{ type: 'tool', name: 'rank_pages', status: 'complete', result: '12 pages scored' }} />);
    expect(screen.getByRole('region', { name: 'rank_pages tool result' })).toBeVisible();
    expect(screen.getByText('12 pages scored')).toBeVisible();
  });
  it('covers pending, streaming, and error states', () => {
    const { rerender } = render(<ChatMessage message={{ role: 'assistant', state: 'pending', parts: [] }} />);
    expect(screen.getByRole('status')).toHaveTextContent('Pending');
    rerender(<ChatMessage message={{ role: 'assistant', state: 'streaming', parts: [] }} />);
    expect(screen.getByRole('status')).toHaveTextContent('Streaming');
    rerender(<ChatMessage message={{ role: 'assistant', state: 'error', parts: [] }} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Unable to complete');
  });
});

describe('validated prompt form', () => {
  it('shows validation feedback for a short submission', async () => {
    const user = userEvent.setup();
    const submit = vi.fn();
    render(<ValidatedForm onSubmit={submit} busy={false} />);
    await user.click(screen.getByRole('button', { name: 'Send' }));
    expect(screen.getByRole('alert')).toHaveTextContent('at least 3 characters');
    expect(submit).not.toHaveBeenCalled();
  });
  it('submits a valid value and trims whitespace', async () => {
    const user = userEvent.setup();
    const submit = vi.fn();
    render(<ValidatedForm onSubmit={submit} busy={false} />);
    await user.type(screen.getByRole('textbox', { name: 'Ask the assistant' }), '  rank pages  ');
    await user.click(screen.getByRole('button', { name: 'Send' }));
    expect(submit).toHaveBeenCalledWith('rank pages');
  });
});

describe('assistant flow', () => {
  it('mocks the AI route and shows the returned tool result', async () => {
    const user = userEvent.setup();
    vi.spyOn(api, 'requestAssistant').mockResolvedValue({ id: 'mocked', role: 'assistant', parts: [{ type: 'text', text: 'Mock answer' }, { type: 'tool', name: 'rank_pages', status: 'complete', result: '3 pages scored' }] });
    render(<App />);
    await user.type(screen.getByRole('textbox', { name: 'Ask the assistant' }), 'rank these pages');
    await user.click(screen.getByRole('button', { name: 'Send' }));
    expect(await screen.findByText('Mock answer')).toBeVisible();
    expect(screen.getByRole('region', { name: 'rank_pages tool result' })).toHaveTextContent('3 pages scored');
    expect(api.requestAssistant).toHaveBeenCalledWith('rank these pages');
  });
});
