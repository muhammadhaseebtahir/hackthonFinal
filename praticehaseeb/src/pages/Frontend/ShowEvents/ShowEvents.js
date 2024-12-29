import React, { useEffect, useState } from 'react';
import { Table, Button, message, Modal, Form, Input, DatePicker, Select, Space } from 'antd';
import axios from 'axios';
import { useAuthContext } from '../../../context/AuthContext';
import moment from 'moment';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

export default function ShowEvents() {
  const { user } = useAuthContext(); // Get the user info from the context
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null); // Track selected event for updating
  const [form] = Form.useForm();
  console.log(user.user_id);

  // Define the table columns
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => moment(text).format('YYYY-MM-DD'), // Format date
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Visibility',
      dataIndex: 'visibility',
      key: 'visibility',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleUpdate(record)} // Open update modal
          >
            Update
          </Button>
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.eventId)} // Delete event
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  // Fetch events data from the API
  useEffect(() => {
    const fetchEvents = async () => {
      if (!user) {
        message.warning('Please login to view your events.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`https://backend-s9y6.vercel.app/dashboard/get-events/${user.user_id}`);
        message.success('Successfully fetched events');
        setEvents(response.data.events); // Assuming the API response contains the events in the `events` field
        console.log(response.data.events);
      } catch (error) {
        console.error('Error fetching events:', error);
        message.error('Failed to fetch events. Please try again later.');
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchEvents();
  }, [user]);

  // Handle event deletion
  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this event?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        try {
          // Deleting the event from the API
          const response = await axios.delete(`https://backend-s9y6.vercel.app/dashboard/delete-event/${id}`);
  
        
            // Remove the deleted event from the state immediately
            setEvents((prevEvents) => prevEvents.filter((event) => event.eventId !== id));
            message.success('Event deleted successfully!');
        
           
          
        } catch (error) {
          console.error('Error deleting event:', error);
          message.error('Failed to delete event.');
        }
      },
    });
  };

  // Handle event update (open the modal with event data)
  const handleUpdate = (event) => {
    setSelectedEvent(event);
    form.setFieldsValue({
      title: event.title,
      description: event.description,
      date: moment(event.date),
      location: event.location,
      category: event.category,
      visibility: event.visibility,
    });
    setIsModalVisible(true); // Show the modal
  };

  // Handle the update form submission
  const handleUpdateSubmit = async (values) => {
    const updatedEvent = { ...selectedEvent, ...values, date: values.date.format('YYYY-MM-DD') };

    try {
      const response = await axios.put(
        `https://backend-s9y6.vercel.app/dashboard/update-event/${updatedEvent.eventId}`,
        updatedEvent
      );

      if (response.data.message) {
        message.success('Event updated successfully!');
        // Update the state with the updated event
        setEvents((prevEvents) => 
          prevEvents.map((event) =>
            event.eventId === updatedEvent.eventId ? { ...event, ...updatedEvent } : event
          )
        );
        setIsModalVisible(false); // Close the modal
      } else {
        message.error('Failed to update event.');
        
      }
    } catch (error) {
      console.error('Error updating event:', error);
      console.log("updatedEvent.eventId",updatedEvent.eventId);

      message.error('Failed to update event.');
    }
  };

  // Modal form for updating an event
  const updateEventModal = (
    <Modal
      title="Update Event"
      visible={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleUpdateSubmit}
      >
        <Form.Item label="Event Title" name="title" rules={[{ required: true, message: 'Please enter the event title!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Please enter the description!' }]}>
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item label="Date" name="date" rules={[{ required: true, message: 'Please select the date!' }]}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Location" name="location" rules={[{ required: true, message: 'Please enter the location!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Category" name="category" rules={[{ required: true, message: 'Please select a category!' }]}>
          <Select>
            <Option value="conference">Conference</Option>
            <Option value="workshop">Workshop</Option>
            <Option value="seminar">Seminar</Option>
            <Option value="meetup">Meetup</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Visibility" name="visibility">
          <Select>
            <Option value="public">Public</Option>
            <Option value="private">Private</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update Event
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );

  return (
    <div className="container pt-3 pb-5">
      <h1 className="text-center py-3">Your Events</h1>
      <Table
        columns={columns}
        dataSource={events}
        loading={isLoading}
        rowKey="eventId" // Assuming each event has a unique 'eventId'
        pagination={{ pageSize: 5 }} // Adjust pagination as needed
      />
      {updateEventModal}
    </div>
  );
}
