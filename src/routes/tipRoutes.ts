import express, { Request, Response } from 'express';
import pool from '../config/db.js';

const router = express.Router();

// Route to GET tips
// Route to GET tips
router.get('/', async (req, res) => {
  try {
    const query = 'SELECT * FROM Tip ORDER BY id DESC';
    pool.query(query, (error, results) => {
      if (error) {
        console.error('Error fetching tips:', error);
        return res.status(500).json({ error: 'Query error' });
      }

      // Convert BLOB (Buffer) to Base64 string
      const formattedResults = results.map((tip: { signing: any; }) => ({
        ...tip,
        signing: tip.signing
          ? `data:image/png;base64,${Buffer.from(tip.signing).toString('base64')}`
          : null,
      }));

      res.json(formattedResults);
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Unexpected server error' });
  }
});

// Route to INSERT tip
router.post('/', (req: Request, res: Response) => {
  const { tip, github, githubURL, signing } = req.body;
  if (!tip) {
    res.status(400).json({ error: 'Tip is required' });
  }

  // Convert Base64 string to Buffer before storing in MySQL
  const signingBuffer = signing ? Buffer.from(signing.split(',')[1], 'base64') : null;

  const query = 'INSERT INTO Tip (tip, github, githubURL, signing) VALUES (?, ?, ?, ?)';
  pool.query(query, [tip, github, githubURL, signingBuffer], (error: any, results: { insertId: any; }) => {
    if (error) {
      console.error('Error adding tip:', error);
      return res.status(500).json({ error: 'Insertion error' });
    }

    res.status(201).json({
      tip,
      github,
      githubURL,
      signing,
      tipId: results.insertId,
    });
  });
});

// Route to DELETE a tip by ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM Tip WHERE id = ?';
  pool.query(query, [id], (error: any, results: { affectedRows: number; }) => {
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
