const express = require('express');
const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
    try {
        const pool = req.app.locals.db;
        const result = await pool.request().query('SELECT * FROM Events WHERE status = "Active"');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single event
router.get('/:id', async (req, res) => {
    try {
        const pool = req.app.locals.db;
        const result = await pool.request()
            .input('event_id', sql.Int, req.params.id)
            .query('SELECT * FROM Events WHERE event_id = @event_id');
        
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }
        
        res.json(result.recordset[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new event
router.post('/', async (req, res) => {
    try {
        const { event_name, description, event_date, location, cost, max_capacity, image_url, category } = req.body;
        const pool = req.app.locals.db;
        
        const result = await pool.request()
            .input('event_name', sql.NVarChar, event_name)
            .input('description', sql.Text, description)
            .input('event_date', sql.DateTime, event_date)
            .input('location', sql.NVarChar, location)
            .input('cost', sql.Decimal, cost)
            .input('max_capacity', sql.Int, max_capacity)
            .input('image_url', sql.NVarChar, image_url)
            .input('category', sql.NVarChar, category)
            .query(`INSERT INTO Events (event_name, description, event_date, location, cost, max_capacity, image_url, category) 
                    VALUES (@event_name, @description, @event_date, @location, @cost, @max_capacity, @image_url, @category);
                    SELECT SCOPE_IDENTITY() AS event_id`);
        
        res.status(201).json({ 
            message: 'Event created successfully',
            event_id: result.recordset[0].event_id 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;