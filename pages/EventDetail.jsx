import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Tab, Nav, Alert } from 'react-bootstrap';
import EventService from '../services/EventService';
import './EventDetail.css';

const EventDetail = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [menus, setMenus] = useState([]);
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMenu, setSelectedMenu] = useState(null);

    useEffect(() => {
        fetchEventDetails();
    }, [id]);

    const fetchEventDetails = async () => {
        try {
            const eventData = await EventService.getEventById(id);
            setEvent(eventData);
            
            const menusData = await EventService.getEventMenus(id);
            setMenus(menusData);
            
            const opportunitiesData = await EventService.getEventOpportunities(id);
            setOpportunities(opportunitiesData);
            
            if (menusData.length > 0) {
                setSelectedMenu(menusData[0]);
            }
        } catch (error) {
            console.error('Error fetching event details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-5">Loading...</div>;
    if (!event) return <Alert variant="danger">Event not found!</Alert>;

    return (
        <Container className="py-5">
            <Row>
                <Col lg={8}>
                    <div className="mb-4">
                        <h1 className="text-primary">{event.event_name}</h1>
                        <p className="text-muted">
                            <i className="bi bi-calendar-event me-2"></i>
                            {new Date(event.event_date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                        <p className="text-muted">
                            <i className="bi bi-geo-alt me-2"></i>
                            {event.location}
                        </p>
                    </div>

                    <Tab.Container defaultActiveKey="description">
                        <Nav variant="tabs">
                            <Nav.Item>
                                <Nav.Link eventKey="description">Description</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="menus">Menus & Dishes</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="opportunities">Opportunities</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <Tab.Content className="p-3 border border-top-0">
                            <Tab.Pane eventKey="description">
                                <p>{event.description}</p>
                                <div className="mt-4">
                                    <h5>Event Details</h5>
                                    <ul>
                                        <li>Cost: ${event.cost.toFixed(2)}</li>
                                        <li>Capacity: {event.current_registrations}/{event.max_capacity}</li>
                                        <li>Category: {event.category}</li>
                                    </ul>
                                </div>
                            </Tab.Pane>
                            
                            <Tab.Pane eventKey="menus">
                                <Row>
                                    <Col md={4}>
                                        <h5>Select Menu</h5>
                                        <div className="list-group">
                                            {menus.map(menu => (
                                                <button
                                                    key={menu.menu_id}
                                                    className={`list-group-item list-group-item-action ${selectedMenu?.menu_id === menu.menu_id ? 'active' : ''}`}
                                                    onClick={() => setSelectedMenu(menu)}
                                                >
                                                    <div className="d-flex w-100 justify-content-between">
                                                        <h6 className="mb-1">{menu.menu_name}</h6>
                                                        <small>${menu.price}</small>
                                                    </div>
                                                    <small>{menu.menu_type}</small>
                                                </button>
                                            ))}
                                        </div>
                                    </Col>
                                    <Col md={8}>
                                        {selectedMenu && (
                                            <Card>
                                                <Card.Header>
                                                    <h5>{selectedMenu.menu_name} - ${selectedMenu.price}</h5>
                                                    <small className="text-muted">{selectedMenu.description}</small>
                                                </Card.Header>
                                                <Card.Body>
                                                    <h6>Included Dishes:</h6>
                                                    {/* Fetch and display dishes here */}
                                                    <ul>
                                                        <li>Sample Dish 1</li>
                                                        <li>Sample Dish 2</li>
                                                        <li>Sample Dish 3</li>
                                                    </ul>
                                                </Card.Body>
                                            </Card>
                                        )}
                                    </Col>
                                </Row>
                            </Tab.Pane>
                            
                            <Tab.Pane eventKey="opportunities">
                                <h5>Available Opportunities</h5>
                                {opportunities.length > 0 ? (
                                    <Row>
                                        {opportunities.map(opp => (
                                            <Col md={6} key={opp.opportunity_id} className="mb-3">
                                                <Card>
                                                    <Card.Body>
                                                        <Card.Title>{opp.position_name}</Card.Title>
                                                        <Card.Text>{opp.description}</Card.Text>
                                                        <Card.Text>
                                                            <small className="text-muted">
                                                                Slots: {opp.filled_slots}/{opp.slots_available}
                                                            </small>
                                                        </Card.Text>
                                                        <Button variant="outline-primary" size="sm">
                                                            Apply Now
                                                        </Button>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                ) : (
                                    <p>No opportunities available for this event.</p>
                                )}
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </Col>
                
                <Col lg={4}>
                    <Card className="sticky-top" style={{ top: '20px' }}>
                        <Card.Header className="bg-primary text-white">
                            <h5 className="mb-0">Register Now</h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="text-center mb-4">
                                <h3 className="text-success">${event.cost.toFixed(2)}</h3>
                                <small className="text-muted">per person</small>
                            </div>
                            
                            <div className="mb-3">
                                <label className="form-label">Select Menu Option</label>
                                <select className="form-select" onChange={(e) => {
                                    const menu = menus.find(m => m.menu_id === parseInt(e.target.value));
                                    setSelectedMenu(menu);
                                }}>
                                    {menus.map(menu => (
                                        <option key={menu.menu_id} value={menu.menu_id}>
                                            {menu.menu_name} - ${menu.price}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="d-grid gap-2">
                                <Button 
                                    variant="success" 
                                    size="lg"
                                    disabled={event.current_registrations >= event.max_capacity}
                                    onClick={() => window.location.href = `/register/${event.event_id}`}
                                >
                                    {event.current_registrations >= event.max_capacity ? 
                                        'Event Full' : 'Register Now'}
                                </Button>
                                <Button variant="outline-primary">
                                    Add to Calendar
                                </Button>
                            </div>
                            
                            <div className="mt-3 text-center">
                                <small className="text-muted">
                                    {event.max_capacity - event.current_registrations} spots remaining
                                </small>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default EventDetail;