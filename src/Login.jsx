import { useState } from 'react';
import { Button, Form, Alert, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const validUsers = ['a1', 'a2', 'a3', 'a4'];

export default function Login() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validUsers.includes(username)) {
      localStorage.setItem('currentUser', username);
      navigate('/');
    } else {
      setError('No user found with that name');
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '400px' }}>
      <Form onSubmit={handleSubmit}>
        <h2 className="mb-4">Fitness Login</h2>
        <Form.Group controlId="username" className="mb-3">
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>
        {error && <Alert variant="danger">{error}</Alert>}
        <Button variant="primary" type="submit" className="w-100">
          Login
        </Button>
      </Form>
    </Container>
  );
}