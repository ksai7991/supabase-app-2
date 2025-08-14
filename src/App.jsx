import { useState } from 'react';
import { supabase } from './supabaseClient';

function App() {
  const [email, setEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [session, setSession] = useState(null);

  const handleSignup = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('post-service', {
        body: { email },
      });
      if (error) {
        console.error('Signup error:', error);
        alert(`Error: ${error.message}`);
        return;
      }
      alert(`Access code: ${data.accessCode}`); // For testing; send via email in prod
    } catch (error) {
      console.error('Unexpected error:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleLogin = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('loginwithcode', {
        body: { accessCode },
      });
      if (error) {
        console.error('Login error:', error);
        alert(`Error: ${error.message}`);
        return;
      }
      setSession(data);
      await supabase.auth.setSession(data);
      console.log('Session set:', data);
    } catch (error) {
      console.error('Unexpected error:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <button onClick={handleSignup}>Sign Up</button>
      <br />
      <input value={accessCode} onChange={(e) => setAccessCode(e.target.value)} placeholder="Access Code" />
      <button onClick={handleLogin}>Login</button>
      {session && <p>Logged in!</p>}
    </div>
  );
}

export default App;
