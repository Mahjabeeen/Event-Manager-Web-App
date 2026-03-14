import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import RegistrationService from '../services/RegistrationService';

const RegistrationForm = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    
    const [event, setEvent] = useState(null);
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        selected_menu_id: '',
        special_requests: '',
        agree_terms: false
    });

    useEffect(() => {
        fetchEventDetails();
    }, [eventId]);

    const fetchEventDetails = async () => {
        try {
            const eventData = await RegistrationService.getEventForRegistration(eventId);
            setEvent(eventData.event);
            setMenus(eventData.menus);
            
            if (eventData.menus.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    selected_menu_id: eventData.menus[0].menu_id
                }));
            }
        } catch (error) {
            setMessage({ type: 'danger', text: 'Error loading event details' });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.agree_terms) {
            setMessage({ type: 'danger', text: 'You must agree to the terms and conditions' });
            return;
        }

        setSubmitting(true);
        setMessage({ type: '', text: '' });

        try {
            const registrationData = {
                event_id: parseInt(eventId),
                ...formData,
                total_amount: event.cost + (menus.find(m => m.menu_id === parseInt(formData.selected_menu_id))?.price || 0)
            };

            const result = await RegistrationService.submitRegistration(registrationData);
            
            setMessage({ 
                type: 'success', 
                text: `Registration successful! Your registration ID is ${result.registration_id}` 
            });
            
            // Clear form
            setFormData({
                full_name: '',
                email: '',
                phone: '',
                selected_menu_id: menus.length > 0 ? menus[0].menu_id : '',
                special_requests: '',
                agree_terms: false
            });

            // Redirect to confirmation page after 3 seconds
            setTimeout(() => {
                navigate(`/confirmation/${result.registration_id}`);
            }, 3000);

        } catch (error) {
            setMessage({ 
                type: 'danger', 
                text: `Registration failed: ${error.message}` 
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="text-center py-5">Loading...</div>;
    if (!event) return <Alert variant="danger">Event not found!</Alert>;

    const selectedMenu = menus.find(m => m.menu_id === parseInt(formData.selected_menu_id));
    const totalAmount = event.cost + (selectedMenu?.price || 0);

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col lg={8}>
                    <Card className="shadow">
                        <Card.Header className="bg-primary text-white">
                            <h3 className="mb-0">Register for: {event.event_name}</h3>
                        </Card.Header>
                        <Card.Body>
                            {message.text && (
                                <Alert variant={message.type}>{message.text}</Alert>
                            )}

                            <Form onSubmit={handleSubmit}>
                                <h5 className="mb-4">Personal Information</h5>
                                
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Full Name *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="full_name"
                                                value={formData.full_name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Email *</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Phone Number</Form.Label>
                                            <Form.Control
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Select Menu *</Form.Label>
                                            <Form.Select
                                                name="selected_menu_id"
                                                value={formData.selected_menu_id}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                {menus.map(menu => (
                                                    <option key={menu.menu_id} value={menu.menu_id}>
                                                        {menu.menu_name} (+${menu.price})
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Special Requests</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="special_requests"
                                        value={formData.special_requests}
                                        onChange={handleInputChange}
                                        placeholder="Dietary restrictions, accessibility needs, etc."
                                    />
                                </Form.Group>

                                <Card className="mb-4">
                                    <Card.Body>
                                        <h6>Order Summary</h6>
                                        <div className="d-flex justify-content-between">
                                            <span>Event Fee:</span>
                                            <span>${event.cost.toFixed(2)}</span>
                                        </div>
                                        {selectedMenu && (
                                            <div className="d-flex justify-content-between">
                                                <span>Menu ({selectedMenu.menu_name}):</span>
                                                <span>+${selectedMenu.price.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <hr />
                                        <div className="d-flex justify-content-between fw-bold">
                                            <span>Total Amount:</span>
                                            <span className="text-success">${totalAmount.toFixed(2)}</span>
                                        </div>
                                    </Card.Body>
                                </Card>

                                <Form.Group className="mb-4">
                                    <Form.Check
                                        type="checkbox"
                                        name="agree_terms"
                                        checked={formData.agree_terms}
                                        onChange={handleInputChange}
                                        label="I agree to the terms and conditions and understand the cancellation policy"
                                        required
                                    />
                                </Form.Group>

                                <div className="d-grid">
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        type="submit"
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Processing...' : 'Complete Registration'}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default RegistrationForm;