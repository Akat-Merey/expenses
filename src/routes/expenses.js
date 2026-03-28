const express = require('express');
const router = express.Router();
const pool = require('../db.js');
const validateExpense = require('../utils/validateExpense.js');
const validateId = require('../utils/validateId.js')

router.get('/', async (req, res)=> {
    try {
        const result = await pool.query('SELECT * FROM expenses ORDER BY id');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to get expenses'
        });
    };
});

router.get('/:id', async (req, res)=> {
    try {
        const { id } = req.params;
    
        const parseId = validateId(id); 
        if (!parseId) {
            return res.status(400).json({
                message: 'id must be a positive integer'
            });
        }

        const result = await pool.query('SELECT * FROM expenses WHERE id=$1', [parseId]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'not found expense by id'
            })
        }

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to get expense by id'
        });
    };
});

router.post('/', async (req, res)=> {
    try {
        const { title, amount, category } = req.body;

        const errors = validateExpense(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ errors })
        }

        const result = await pool.query('INSERT INTO expenses (title, amount, category) VALUES ($1, $2, $3) RETURNING *', [title, amount, category]);

        
        return res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: 'Failed to add expense',
            error: error.message
        });
    };
});

router.patch('/:id', async (req, res) => {
    try{
        const { id } = req.params;

        const parseId = validateId(id); 
        if (!parseId) {
            return res.status(400).json({
                message: 'id must be a positive integer'
            });
        }

        const { title, amount, category } = req.body;
        
        const errors = validateExpense(req.body, true);
        if (errors.length > 0) {
            return res.status(400).json({ errors })
        }

        const result = await pool.query('UPDATE expenses SET title = COALESCE($1, title), amount = COALESCE($2, amount), category = COALESCE($3, category) WHERE id = $4 RETURNING *',
            [title, amount, category, parseId])

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'not found by id'
            });
        }

        res.status(401).json({
            message: 'expense edited',
            expense: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to edit the expense'
        });
    }
});

router.delete('/:id', async (req, res)=> {
    try {
        const { id } = req.params;

        const parseId = validateId(id); 
        if (!parseId) {
            return res.status(400).json({
                message: 'id must be a positive integer'
            });
        }

        const result = await pool.query('DELETE FROM expenses WHERE id=$1 RETURNING *', [parseId]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'not deleted and not found expense by id'
            });
        };

        res.status(401).json({
            message: 'expense deleted',
            expense: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to delete expense by id'
        });
    };
});



module.exports = router