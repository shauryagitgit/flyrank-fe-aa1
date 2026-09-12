import React, { useState } from 'react';
import { requestAssistant } from './api';

const starterMessages = [
  {
    id: 'welcome',
    role: 'assistant',
    parts: [
      { type: 'text', text: 'Welcome. I can review a ranking task and show each step.' },
      { type: 'image', alt: 'Ranking workflow preview', src: 'https://placehold.co/720x180/f4f1ea/202020?text=Ranking+workflow' },
      { type: 'code', language: 'js', code: 'const score = relevance * quality;' },
      { type: 'tool', name: 'rank_pages', status: 'complete', result: '12 pages scored' },
    ],
  },
];

export function MessagePart({ part }) {
  if (part.type === 'text') return <p className="message-text">{part.text}</p>;
  if (part.type === 'image') return <img className="message-image" src={part.src} alt={part.alt} />;
  if (part.type === 'code') return <pre className="code-block"><code>{part.code}</code><span>{part.language}</span></pre>;
  if (part.type === 'tool') return (
    <section className="tool-result" aria-label={`${part.name} tool result`}>
      <div><strong>{part.name}</strong><span className="tool-status">{part.status}</span></div>
      <p>{part.result}</p>
    </section>
  );
  return null;
}

export function ChatMessage({ message }) {
  return (
    <article className={`message ${message.role}`} aria-label={`${message.role} message`}>
      <div className="message-role">{message.role === 'assistant' ? 'AI' : 'You'}</div>
      <div className="message-body">{message.parts.map((part, index) => <MessagePart key={`${part.type}-${index}`} part={part} />)}</div>
    </article>
  );
}

export function ValidatedForm({ onSubmit, busy }) {
  const [value, setValue] = useState('');
  const [touched, setTouched] = useState(false);
  const valid = value.trim().length >= 3;
  const submit = (event) => {
    event.preventDefault();
    setTouched(true);
    if (valid) onSubmit(value.trim());
  };
  return (
    <form className="prompt-form" onSubmit={submit} noValidate>
      <label htmlFor="prompt">Ask the assistant</label>
      <div className="prompt-row">
        <input id="prompt" value={value} onChange={(e) => setValue(e.target.value)} onBlur={() => setTouched(true)} aria-invalid={touched && !valid} aria-describedby="prompt-error" placeholder="e.g. rank these pages" />
        <button type="submit" disabled={busy}>{busy ? 'Working…' : 'Send'}</button>
      </div>
      <div id="prompt-error" className="form-error" role="alert">{touched && !valid ? 'Enter at least 3 characters.' : ' '}</div>
    </form>
  );
}

export default function App() {
  const [messages, setMessages] = useState(starterMessages);
  const [busy, setBusy] = useState(false);
  const send = async (text) => {
    setBusy(true);
    setMessages((current) => [...current, { id: `user-${Date.now()}`, role: 'user', parts: [{ type: 'text', text }] }]);
    try {
      const response = await requestAssistant(text);
      setMessages((current) => [...current, response]);
    } finally {
      setBusy(false);
    }
  };
  return (
    <main className="page">
      <section className="app-shell">
        <header className="header"><div><div className="eyebrow">FLYRANK / FE-09</div><h1>Testing pass.</h1><p>AI UI that can explain itself — and prove it works.</p></div><span className="badge">6+ component tests</span></header>
        <section className="chat" aria-label="Assistant conversation">
          {messages.map((message) => <ChatMessage key={message.id} message={message} />)}
        </section>
        <ValidatedForm onSubmit={send} busy={busy} />
        <footer>Keyboard accessible · semantic queries · mocked AI route · Playwright primary flow</footer>
      </section>
    </main>
  );
}
