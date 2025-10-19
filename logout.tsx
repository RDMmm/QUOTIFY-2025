import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LogoutButton() {
  const nav = useNavigate();
  function logout() {
    localStorage.removeItem('token');
    nav('/login');
  }
  return <button onClick={logout}>Wyloguj</button>;
}
