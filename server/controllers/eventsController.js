import { Event, EventRegistration } from '../schemas/events.js';
import Notification from '../schemas/notifications.js';
import User from '../schemas/users.js';

// Get all event IDs the current user is registered for
export const getRegisteredEvents = async (req, res) => {
  try {
    const registrations = await EventRegistration.find({ userId: req._id });
    // Return array of event IDs
    res.json(registrations.map(r => r.eventId));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching registered events', error: err.message });
  }
};
// Unregister (cancel registration) for an event
export const unregisterForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    // Remove registration document
    const registration = await EventRegistration.findOneAndDelete({ eventId, userId: req._id });
    if (!registration) return res.status(404).json({ message: 'Not registered for this event' });
    // Remove user from event attendees
    await Event.findByIdAndUpdate(eventId, { $pull: { attendees: req._id } });
    res.status(200).json({ message: 'Unregistered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error unregistering for event', error: err.message });
  }
};

// Create a new event
export const createEvent = async (req, res) => {
  try {
    const { title, date, endDate, location, description, tags, capacity } = req.body;
    const event = await Event.create({
      title,
      date,
      endDate,
      location,
      description,
      tags,
      capacity,
      organizerUserId: req._id,
      organizerName: req.user?.name || '',
      status: 'pending',
    });
    
    // Create notifications for all users
    try {
      const allUsers = await User.find({}, '_id');
      const notifications = allUsers.map(user => ({
        userId: user._id,
        type: 'event',
        title: 'New Event Posted',
        message: `${title} - ${new Date(date).toLocaleDateString()}`,
        referenceId: event._id,
      }));
      
      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    } catch (notifError) {
      console.error("Error creating notifications:", notifError);
      // Don't fail the event creation if notifications fail
    }
    
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Error creating event', error: err.message });
  }
};

// List all events
export const listEvents = async (req, res) => {
  try {
    const now = new Date();
    let query = { endDate: { $gte: now } };
    // Admin sees all pending and verified, others see only verified or their own pending
    if (req.user?.role === 'admin') {
      // Show all events
    } else {
      query = {
        ...query,
        $or: [
          { status: 'upcoming' },
          { status: 'pending', organizerUserId: req._id },
        ],
      };
    }
    const events = await Event.find(query).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events', error: err.message });
  }
};

// Admin: verify event (set status to 'upcoming')
export const verifyEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findByIdAndUpdate(eventId, { status: 'upcoming' }, { new: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Error verifying event', error: err.message });
  }
};

// Admin: delete event (reject)
export const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const deleted = await Event.findByIdAndDelete(eventId);
    if (!deleted) return res.status(404).json({ message: 'Event not found' });
    // Delete all notifications related to this event
    await Notification.deleteMany({ referenceId: eventId, type: 'event' });
    res.json({ message: 'Event and related notifications deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting event', error: err.message });
  }
}

// Register for an event
export const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const alreadyRegistered = await EventRegistration.findOne({ eventId, userId: req._id });
    if (alreadyRegistered) return res.status(400).json({ message: 'Already registered' });
    const registration = await EventRegistration.create({ eventId, userId: req._id });
    await Event.findByIdAndUpdate(eventId, { $addToSet: { attendees: req._id } });
    res.status(201).json(registration);
  } catch (err) {
    res.status(500).json({ message: 'Error registering for event', error: err.message });
  }
};
