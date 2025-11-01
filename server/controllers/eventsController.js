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
import { Event, EventRegistration } from '../schemas/events.js';

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
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Error creating event', error: err.message });
  }
};

// List all events
export const listEvents = async (req, res) => {
  try {
    const now = new Date();
    // Only return events whose endDate is in the future
    const events = await Event.find({ endDate: { $gte: now } }).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events', error: err.message });
  }
};

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
