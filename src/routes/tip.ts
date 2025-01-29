import express, { Request, Response } from 'express';
import pool from '../config/db';

const router = express.Router();

// Route to GET tips
router.get('/', async (req, res) => {
  try {
    const query = 'SELECT * FROM Tip';
    pool.query(query, (error, results) => {
      if (error) {
        console.error('Error fetching tips:', error);
        return res.status(500).json({ error: 'Query error' });
      }
      res.json(results);
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Unexpected server error' });
  }
});

// Route to INSERT tip
router.post('/', (req: Request, res: Response) => {
  const { tip, github, githubURL } = req.body;
  const id = null; // Assuming you're using an auto-increment ID in the DB

  if (!tip) {
    res.status(400).json({ error: 'Tip is required' });
  }

  const query = 'INSERT INTO Tip (id, tip, github, githubURL) VALUES (?, ?, ?, ?)';
  
  pool.query(query, [id, tip, github, githubURL], (error, results) => {
    if (error) {
      console.error('Error adding tip:', error);
      return res.status(500).json({ error: 'Insertion error' });
    }

    // After successful insertion, return the inserted data along with the generated ID
    const newTip = {
      tip: tip,
      github: github,
      githubURL: githubURL,
      tipId: results.insertId, // The ID returned from MySQL after insertion
    };

    res.status(201).json(newTip); // Send the complete data back as a response
  });
});

// Route to DELETE a tip by ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM Tip WHERE id = ?';
  pool.query(query, [id], (error, results) => {
    if (error) {
      console.error('Error deleting tip:', error);
      return res.status(500).json({ error: 'Deletion error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Tip not found' });
    }
    res.status(200).json({ message: 'Tip deleted successfully' });
  });
});

export default router;
