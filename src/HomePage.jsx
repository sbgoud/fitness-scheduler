import { useState, useEffect } from 'react';
import { Button, Navbar, Form, Accordion, Modal } from 'react-bootstrap';
import { put } from '@vercel/blob';

export default function HomePage({ user }) {
  const [activities, setActivities] = useState({
    wakeUp: { checked: false, time: '', notes: '' },
    breakfast: { checked: false, food: '', notes: '' },
    lunch: { checked: false, food: '', notes: '' },
    dinner: { checked: false, food: '', notes: '' }
  });
  const [showFoodList, setShowFoodList] = useState(null);
  const [previousDays, setPreviousDays] = useState([]);

  const allowedFoods = {
    breakfast: ['Oatmeal', 'Eggs', 'Yogurt', 'Smoothie'],
    lunch: ['Salad', 'Chicken', 'Rice', 'Soup'],
    dinner: ['Fish', 'Vegetables', 'Quinoa', 'Turkey']
  };

  const handleCheck = async (activity) => {
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setActivities(prev => ({
      ...prev,
      [activity]: { ...prev[activity], checked: true, time }
    }));
  };

  const handleSubmit = async () => {
    const date = new Date().toISOString().split('T')[0];
    const data = { date, activities };
    
    const { url } = await put(`users/${user}.json`, JSON.stringify(data), {
      access: 'public',
      addRandomSuffix: false
    });
    
    // Update previous days data
    setPreviousDays(prev => [data, ...prev.filter(d => d.date !== date)]);
  };

  return (
    <div className="container">
      <Navbar bg="light" className="mb-4">
        <span className="navbar-brand">{user}</span>
        <Navbar.Brand className="mx-auto">Fitness Schedule</Navbar.Brand>
        <Button variant="outline-danger" onClick={() => {
          localStorage.removeItem('currentUser');
          window.location = '/login';
        }}>
          Logout
        </Button>
      </Navbar>

      {/* Activity Form */}
      <Form className="mb-5">
        {Object.entries(activities).map(([key, activity]) => (
          <div key={key} className="mb-3 p-3 border rounded">
            <Form.Check 
              type="checkbox"
              label={key.replace(/([A-Z])/g, ' $1')}
              checked={activity.checked}
              onChange={() => handleCheck(key)}
            />
            
            {activity.time && <div className="text-muted mt-1">{activity.time}</div>}
            
            {['breakfast', 'lunch', 'dinner'].includes(key) && (
              <>
                <Button variant="link" size="sm" onClick={() => setShowFoodList(key)}>
                  <i className="bi bi-info-circle"></i>
                </Button>
                <Form.Control 
                  type="text"
                  placeholder="What did you eat?"
                  value={activity.food}
                  onChange={(e) => setActivities(prev => ({
                    ...prev,
                    [key]: { ...prev[key], food: e.target.value }
                  }))}
                />
              </>
            )}
            
            <Form.Control
              as="textarea"
              placeholder="Notes"
              className="mt-2"
              value={activity.notes}
              onChange={(e) => setActivities(prev => ({
                ...prev,
                [key]: { ...prev[key], notes: e.target.value }
              }))}
            />
          </div>
        ))}
        
        <Button variant="success" className="w-100" onClick={handleSubmit}>
          Submit Day
        </Button>
      </Form>

      {/* Previous Days Accordion */}
      <Accordion>
        {previousDays.map((day, index) => (
          <Accordion.Item key={index} eventKey={index.toString()}>
            <Accordion.Header>{day.date}</Accordion.Header>
            <Accordion.Body>
              <pre>{JSON.stringify(day.activities, null, 2)}</pre>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      {/* Food List Modal */}
      <Modal show={showFoodList} onHide={() => setShowFoodList(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Allowed Foods</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            {showFoodList && allowedFoods[showFoodList].map(food => (
              <li key={food}>{food}</li>
            ))}
          </ul>
        </Modal.Body>
      </Modal>
    </div>
  );
}