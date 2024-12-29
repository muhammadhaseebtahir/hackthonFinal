


const express = require('express');
const Event =require('../models/eventModel')
const router = express.Router();


const getRandomId = () => Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);


router.post('/add-event', async (req, res) => {
    const { title, description, date, location, category, visibility, userId } = req.body;

    // Validate input data
    if (!title || !description || !date || !location || !category || !visibility || !userId) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate visibility (either public or private)
    if (visibility !== 'public' && visibility !== 'private') {
        return res.status(400).json({ message: 'Visibility must be either "public" or "private"' });
    }

    // Create a new event object
    const newEvent = new Event({
        title,
        description,
        date,
        location,
        category,
        visibility, // Use the visibility passed in the request
        userId,
        eventId: getRandomId(),
    });

    try {
        // Save the event to the database
        const savedEvent = await newEvent.save();

        // Return the saved event as a response
        res.status(201).json({
            message: 'Event added successfully',
            event: savedEvent,
        });
    } catch (error) {
        console.error('Error saving event:', error);
        res.status(500).json({ message: 'Failed to add event' });
    }
});

// Route to update an event
router.put('/update-event/:eventId', async (req, res) => {
    const { eventId } = req.params; // Get eventId from request params
    const { title, description, date, location, category, visibility, userId } = req.body;

    // Validate the required fields
    if (!title || !description || !date || !location || !category || !visibility || !userId) {
        return res.status(400).json({ message: 'All fields are required' });
    }

 

    try {
        // Find the event by eventId and userId to ensure the user is updating their own event
        const event = await Event.findOne({ eventId, userId });

        if (!event) {
            return res.status(404).json({ message: 'Event not found or you are not authorized to update this event' });
        }

        // Update the event details
        const updatedEvent = await Event.findOneAndUpdate(
            { eventId, userId },  // Query to find the event by eventId and userId
            { 
                title,
                description,
                date,
                location,
                category,
                visibility,
            },
            { new: true }  // Return the updated event after the update
        );

        // Send the updated event as a response
        res.status(200).json({
            message: 'Event updated successfully',
            event: updatedEvent,
        });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ message: 'Failed to update event' });
    }
});

// Route to get all events (with option to filter by visibility)
router.get('/get-events', async (req, res) => {
    const { visibility } = req.query; // Get visibility from query parameters

    try {
        let events;
        if (visibility) {
            // Fetch events filtered by visibility (public or private)
            events = await Event.find({ visibility });
        } else {
            // Fetch all events
            events = await Event.find();
        }

        // If no events are found, return a 404 error
        if (events.length === 0) {
            return res.status(404).json({ message: 'No events found' });
        }

        // Send the list of events with a 200 status
        res.status(200).json({ events });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Failed to fetch events' });
    }
});
// Route to get events by userId
router.get('/get-events/:userId', async (req, res) => {
  const { userId } = req.params;  // Get userId from request params

  if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
  }

  try {
      // Fetch events for the specific user by userId
      const events = await Event.find({ userId });

      // If no events are found for the given userId
      if (events.length === 0) {
          return res.status(404).json({ message: 'No events found for this user' });
      }

      // Send the list of events with a 200 status
      res.status(200).json({ message:"seccessful",events });
  } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ message: 'Failed to fetch events' });
  }
});

// Route to delete an event by eventId and userId
router.delete('/delete-event/:eventId', async (req, res) => {
    const { eventId } = req.params; // Get eventId from request params

    if (!eventId) {
        return res.status(400).json({ message: 'Event ID is required' });
    }

    try {
        // Find the event by eventId to ensure the user is deleting their own event
        const event = await Event.findOne({ eventId });

        if (!event) {
            return res.status(404).json({ message: 'Event not found or you are not authorized to delete this event' });
        }

        // Delete the event
        await Event.deleteOne({ eventId });

        // Send a success response
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Failed to delete event' });
    }
});

module.exports = router;

