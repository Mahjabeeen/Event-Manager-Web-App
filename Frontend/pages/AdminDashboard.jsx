import React, { useState, useEffect } from 'react';
import { Tab, Nav, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import EventService from '../services/EventService';
import AdminService from '../services/AdminService';

const AdminDashboard = () => {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [eventForm, setEventForm] = useState({
        event_name: '',
        description: '',
        event_date: '',
        location: '',
        cost: '',
        max_capacity: '',
        image_url: '',
        category: ''
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const data = await EventService.getAllEvents();
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const handleAddEvent = async () => {
        try {
            await AdminService.createEvent(eventForm);
            setShowModal(false);
            fetchEvents();
            resetForm();
        } catch (error) {
            console.error('Error creating event:', error);
        }
    };

    const resetForm = () => {
        setEventForm({
            event_name: '',
            description: '',
            event_date: '',
            location: '',
            cost: '',
            max_capacity: '',
            image_url: '',
            category: ''
        });
    };

    return (
        <div className="admin-dashboard">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Event Management Dashboard</h2>
                <Button variant="success" onClick={() => setShowModal(true)}>
                    <i className="bi bi-plus-circle me-2"></i>Add New Event
                </Button>
            </div>

            <Tab.Container defaultActiveKey="events">
                <Row>
                    <Col sm={3}>
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                                <Nav.Link eventKey="events">Events</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="registrations">Registrations</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="menus">Menus</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="opportunities">Opportunities</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={9}>
                        <Tab.Content>
                            <Tab.Pane eventKey="events">
                                <div className="table-responsive">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Event Name</th>
                                                <th>Date</th>
                                                <th>Location</th>
                                                <th>Cost</th>
                                                <th>Registrations</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {events.map(event => (
                                                <tr key={event.event_id}>
                                                    <td>{event.event_id}</td>
                                                    <td>{event.event_name}</td>
                                                    <td>{new Date(event.event_date).toLocaleDateString()}</td>
                                                    <td>{event.location}</td>
                                                    <td>${event.cost}</td>
                                                    <td>{event.current_registrations}/{event.max_capacity}</td>
                                                    <td>
                                                        <Button size="sm" variant="outline-primary" className="me-2">
                                                            Edit
                                                        </Button>
                                                        <Button size="sm" variant="outline-danger">
                                                            Delete
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>

            {/* Add Event Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Add New Event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Event Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={eventForm.event_name}
                                        onChange={(e) => setEventForm({...eventForm, event_name: e.target.value})}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Category</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={eventForm.category}
                                        onChange={(e) => setEventForm({...eventForm, category: e.target.value})}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={eventForm.description}
                                onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                            />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Event Date</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        value={eventForm.event_date}
                                        onChange={(e) => setEventForm({...eventForm, event_date: e.target.value})}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Location</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={eventForm.location}
                                        onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Cost ($)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={eventForm.cost}
                                        onChange={(e) => setEventForm({...eventForm, cost: e.target.value})}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Capacity</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={eventForm.max_capacity}
                                        onChange={(e) => setEventForm({...eventForm, max_capacity: e.target.value})}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Image URL</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={eventForm.image_url}
                                        onChange={(e) => setEventForm({...eventForm, image_url: e.target.value})}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleAddEvent}>
                        Create Event
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AdminDashboard;