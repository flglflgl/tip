"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../config/db"));
const router = express_1.default.Router();
// Route to GET tips
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'SELECT * FROM Tip';
        db_1.default.query(query, (error, results) => {
            if (error) {
                console.error('Error fetching tips:', error);
                return res.status(500).json({ error: 'Query error' });
            }
            res.json(results);
        });
    }
    catch (err) {
        console.error('Unexpected error:', err);
        res.status(500).json({ error: 'Unexpected server error' });
    }
}));
// Route to INSERT tip
router.post('/', (req, res) => {
    const { tip, github, githubURL } = req.body;
    const id = null; // Assuming you're using an auto-increment ID in the DB
    if (!tip) {
        res.status(400).json({ error: 'Tip is required' });
    }
    const query = 'INSERT INTO Tip (id, tip, github, githubURL) VALUES (?, ?, ?, ?)';
    db_1.default.query(query, [id, tip, github, githubURL], (error, results) => {
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
    db_1.default.query(query, [id], (error, results) => {
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
exports.default = router;
