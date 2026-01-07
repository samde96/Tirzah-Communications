"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const portfolioRoutes_1 = __importDefault(require("./routes/portfolioRoutes"));
const contactRoutes_1 = __importDefault(require("./routes/contactRoutes"));
const clientRoutes_1 = __importDefault(require("./routes/clientRoutes"));
const testimonialRoutes_1 = __importDefault(require("./routes/testimonialRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const uploadsDir = path_1.default.join(__dirname, '../../public/uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
// Serve static files
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../../public/uploads')));
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/portfolio', portfolioRoutes_1.default);
app.use('/api/contact', contactRoutes_1.default);
app.use('/api/clients', clientRoutes_1.default);
app.use('/api/testimonials', testimonialRoutes_1.default);
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
    });
});
app.listen(PORT, () => {
    console.log(`Server is running on port:${PORT}`);
});
