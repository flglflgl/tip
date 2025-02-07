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
        const query = 'SELECT * FROM Tip ORDER BY id DESC';
        db_1.default.query(query, (error, results) => {
            if (error) {
                console.error('Error fetching tips:', error);
                return res.status(500).json({ error: 'Query error' });
            }
            // Convert BLOB (Buffer) to Base64 string
            const formattedResults = results.map((tip) => (Object.assign(Object.assign({}, tip), { signing: tip.signing
                    ? `data:image/png;base64,${Buffer.from(tip.signing).toString('base64')}`
                    : null })));
            res.json(formattedResults);
        });
    }
    catch (err) {
        console.error('Unexpected error:', err);
        res.status(500).json({ error: 'Unexpected server error' });
    }
}));
// Route to INSERT tip
router.post('/', (req, res) => {
    const { tip, github, githubURL, signing } = req.body;
    if (!tip) {
        res.status(400).json({ error: 'Tip is required' });
    }
    // Convert Base64 string to Buffer before storing in MySQL
    const signingBuffer = signing ? Buffer.from(signing.split(',')[1], 'base64') : null;
    const query = 'INSERT INTO Tip (tip, github, githubURL, signing) VALUES (?, ?, ?, ?)';
    db_1.default.query(query, [tip, github, githubURL, signingBuffer], (error, results) => {
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
