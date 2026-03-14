import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './EventCard.css';

const EventCard = ({ event }) => {
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <Card className="event-card shadow-sm h-100">
            <Card.Img variant="top" src={event.image_url || '/default-event.jpg'} />
            <Card.Body className="d-flex flex-column">
                <div className="mb-2">
                    <Badge bg="primary" className="me-2">{event.category}</Badge>
                    <Badge bg={event.current_registrations < event.max_capacity ? 'success' : 'danger'}>
                        {event.current_registrations}/{event.max_capacity} spots
                    </Badge>
                </div>
                <Card.Title className="text-primary">{event.event_name}</Card.Title>
                <Card.Text className="text-muted">
                    <i className="bi bi-calendar-event me-2"></i>
                    {formatDate(event.event_date)}
                </Card.Text>
                <Card.Text className="text-muted">
                    <i className="bi bi-geo-alt me-2"></i>
                    {event.location}
                </Card.Text>
                <Card.Text className="fw-bold text-success fs-5">
                    ${event.cost.toFixed(2)}
                </Card.Text>
                <Card.Text className="flex-grow-1">
                    {event.description.length > 100 
                        ? `${event.description.substring(0, 100)}...` 
                        : event.description}
                </Card.Text>
                <div className="mt-auto">
                    <Link to={`/events/${event.event_id}`}>
                        <Button variant="primary" className="w-100">
                            View Details
                        </Button>
                    </Link>
                </div>
            </Card.Body>
        </Card>
    );
};

export default EventCard;