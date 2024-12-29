import React, { useState, useEffect } from 'react';
import { Col, Input, Row, Button, Form, DatePicker, Select, message, List, Card } from 'antd';
import { useAuthContext } from '../../../context/AuthContext';
import axios from 'axios';
import moment from 'moment'; // Import moment for date handling

const { TextArea } = Input;
const { Option } = Select;

const initialize = { 
  title: "", 
  description: "", 
  date: "", 
  location: "", 
  category: "", 
  visibility: "public" 
};

export default function Home() {
  const { isAuthenticated, user } = useAuthContext(); // Getting user info from context
  const [state, setState] = useState(initialize);
  const [isProcessing, setIsProcessing] = useState(false);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  const handleChange = (e) => {
    if (e && e.target) {
      setState(s => ({ ...s, [e.target.name]: e.target.value }));
    } else {
      setState(s => ({ ...s, [e.name]: e }));
    }
  };

  const handleVisibilityChange = (value) => {
    setState(s => ({ ...s, visibility: value }));
  };

  const handleDateChange = (date, dateString) => {
    setState(s => ({ ...s, date: dateString }));
  };

  const handleCategoryChange = (value) => {
    setState(s => ({ ...s, category: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);  // Set loading to true when submitting

    if (!isAuthenticated || !user) {
      setIsProcessing(false); // Stop loading if not authenticated
      message.warning("You need to login before creating an event.");
      return;
    }

    const { title, description, date, location, category, visibility } = state;
    if (!title || !description || !date || !location || !category) {
      setIsProcessing(false); // Stop loading if required fields are missing
      return message.warning("Please fill all required fields.");
    }

    const formData = {
      title: title.trim(),
      description: description.trim(),
      date,
      location: location.trim(),
      category: category.trim(),
      visibility,
      userId: user.user_id, // Include the user ID in the event data
    };

    await createEvent(formData);
  };

  const createEvent = async (formData) => {
    try {
      const response = await axios.post('https://backend-s9y6.vercel.app/dashboard/add-event', formData);

      
        message.success("Event created successfully!"); 
        setState(initialize);
            
      setIsProcessing(false);
    } catch (error) {
      console.error("Error creating event: ", error);
      message.error("Failed to create event.");
      setIsProcessing(false); 
    }
  };

  // Fetch events for the dashboard
  useEffect(() => {
    const fetchEvents = async () => {
      setLoadingEvents(true);
      try {
        const response = await axios.get('https://backend-s9y6.vercel.app/dashboard/get-events');
        setEvents(response.data.events); // Assuming the API returns a list of events
      } catch (error) {
        console.error("Error fetching events: ", error);
        message.error("Failed to fetch events.");
      }
      setLoadingEvents(false);
    };

    fetchEvents();
  }, []); // Empty dependency array to fetch events only once when component mounts

  // Separate events into upcoming and past
  const upcomingEvents = events.filter(event => moment(event.date).isAfter(moment()));
  const pastEvents = events.filter(event => moment(event.date).isBefore(moment()));

  return (
    <div className="container pt-3 pb-5 d-flex flex-column align-items-center">
      <h1 className="text-center py-3">Create Event</h1>
      <div className="p-3 card shadow w-75">
        <Form onSubmit={handleSubmit}>
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <label>Event Title:</label>
              <Input
                type="text"
                name="title"
                onChange={handleChange}
                value={state.title}
              />
            </Col>
            <Col xs={24}>
              <label>Description:</label>
              <TextArea
                name="description"
                onChange={handleChange}
                value={state.description}
                rows={4}
              />
            </Col>
            <Col xs={24} sm={12}>
              <label>Date:</label>
              <DatePicker
                name="date"
                onChange={handleDateChange}
                value={state.date ? moment(state.date) : null}
                style={{ width: '100%' }}
              />
            </Col>
            <Col xs={24} sm={12}>
              <label>Location:</label>
              <Input
                type="text"
                name="location"
                onChange={handleChange}
                value={state.location}
              />
            </Col>
            <Col xs={24} sm={12}>
              <label>Category:</label>
              <Select
                name="category"
                placeholder="Select category"
                onChange={handleCategoryChange}
                value={state.category}
                style={{ width: '100%' }}
              >
                <Option value="conference">Conference</Option>
                <Option value="workshop">Workshop</Option>
                <Option value="seminar">Seminar</Option>
                <Option value="meetup">Meetup</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12}>
              <label>Visibility:</label>
              <Select
                value={state.visibility}
                onChange={handleVisibilityChange}
                style={{ width: '100%' }}
              >
                <Option value="public">Public</Option>
                <Option value="private">Private</Option>
              </Select>
            </Col>
          </Row>
          <Row>
            <Col span={10} offset={7}>
              <Button 
                className="w-100 my-4" 
                type="primary" 
                size="large" 
                onClick={handleSubmit} 
                loading={isProcessing} // This will show the loading spinner
              >
                Create Event
              </Button>
            </Col>
          </Row>
        </Form>
      </div>

      <div className="mt-5 w-75">
        <h2>Upcoming Events</h2>
        <List
          loading={loadingEvents}
          grid={{ gutter: 16, column: 1 }}
          dataSource={upcomingEvents}
          renderItem={event => (
            <List.Item>
              <Card title={event.title}>
                <p>{event.description}</p>
                <p><strong>Date:</strong> {moment(event.date).format('MMMM Do YYYY, h:mm a')}</p>
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Category:</strong> {event.category}</p>
              </Card>
            </List.Item>
          )}
        />

        <h2 className="mt-5">Past Events</h2>
        <List
          loading={loadingEvents}
          grid={{ gutter: 16, column: 1 }}
          dataSource={pastEvents}
          renderItem={event => (
            <List.Item>
              <Card title={event.title}>
                <p>{event.description}</p>
                <p><strong>Date:</strong> {moment(event.date).format('MMMM Do YYYY, h:mm a')}</p>
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Category:</strong> {event.category}</p>
              </Card>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}
