import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const nav = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const body = await res.json();
        setErr(body?.message || 'Login failed');
        return;
      }
      const { token } = await res.json();
      localStorage.setItem('token', token);
      nav('/admin'); // example
    } catch (e) {
      setErr('Network error');
    }
  }

  return (
    <form onSubmit={submit}>
      <div>
        <label>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" />
      </div>
      <div>
        <label>Hasło</label>
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" />
      </div>
      <button type="submit">Zaloguj</button>
      {err && <div style={{ color: 'red' }}>{err}</div>}
    </form>
  );
}
