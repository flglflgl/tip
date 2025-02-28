import pool from '../config/db.js';
const queryPromise = (query, values = []) => {
    return new Promise((resolve, reject) => {
        pool.query(query, values, (error, results) => {
            if (error)
                reject(error);
            else
                resolve(results);
        });
    });
};
// GET Tips
export const getTips = async (req, res) => {
    try {
        const query = 'SELECT * FROM Tip ORDER BY id DESC';
        const results = await queryPromise(query);
        // Convert BLOB to Base64 string
        const formattedResults = results.map((tip) => ({
            ...tip,
            signing: tip.signing
                ? `data:image/png;base64,${Buffer.from(tip.signing).toString('base64')}`
                : null,
        }));
        res.json(formattedResults);
    }
    catch (err) {
        console.error('Unexpected error:', err);
        res.status(500).json({ error: 'Unexpected server error' });
    }
};
// INSERT new Tip
export const insertTip = async (req, res) => {
    console.log('Received POST request:', req.body);
    const { tip, github, githubURL, signing } = req.body;
    if (!tip) {
        res.status(400).json({ error: 'Tip is required' });
        return; // Make sure to return here to prevent further execution
    }
    const signingBuffer = signing ? Buffer.from(signing.split(',')[1], 'base64') : null;
    const query = 'INSERT INTO Tip (tip, github, githubURL, signing) VALUES (?, ?, ?, ?)';
    try {
        const results = await queryPromise(query, [tip, github, githubURL, signingBuffer]);
        res.status(201).json({ tip, github, githubURL, signing, tipId: results.insertId });
    }
    catch (error) {
        console.error('Error inserting tip:', error);
        res.status(500).json({ error: 'Insertion error' });
    }
};
// DELETE Tip by ID
export const deleteTip = async (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM Tip WHERE id = ?';
    try {
        await queryPromise(query, [id]); // Just execute the query without checking affectedRows
        res.status(200).json({ message: 'Tip deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting tip:', error);
        res.status(500).json({ error: 'Deletion error' });
    }
};
