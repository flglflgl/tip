"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const tip_1 = __importDefault(require("./routes/tip"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware to parse JSON and URL-encoded data
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Serve static files (CSS, JS, etc.)
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// Routes for handling tips
app.use('/tip', tip_1.default);
// Route to serve the HTML on /
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'public', 'index.html'));
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
