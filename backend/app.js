const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const orderRoutes = require('./routes/orderRoutes');
const quotationRoutes = require('./routes/quotationRoutes');
const userRoutes = require('./routes/userRoutes');
const passwordRoutes = require('./routes/passwordRoutes'); // Password-related routes

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection with error handling
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1); // Exit the application if unable to connect
    });

// Serve static files from the frontend directory
const staticPath = path.join(__dirname, '../frontend');
app.use(express.static(staticPath));

// Routes for HTML pages with .html extensions
app.get('/', (req, res) => res.sendFile(path.join(staticPath, 'html/pages/index.html')));
app.get('/login.html', (req, res) => res.sendFile(path.join(staticPath, 'html/pages/login.html')));
app.get('/register.html', (req, res) => res.sendFile(path.join(staticPath, 'html/pages/register.html')));
app.get('/forgot-password.html', (req, res) => res.sendFile(path.join(staticPath, 'html/pages/forgot-password.html')));
app.get('/otp-verification.html', (req, res) => res.sendFile(path.join(staticPath, 'html/pages/otp-verification.html')));
app.get('/reset-password.html', (req, res) => res.sendFile(path.join(staticPath, 'html/pages/reset-password.html')));
app.get('/panels/officer.html', (req, res) => res.sendFile(path.join(staticPath, 'html/panels/officer.html')));
app.get('/panels/weapon_manufacturer.html', (req, res) => res.sendFile(path.join(staticPath, 'html/panels/weapon_manufacturer.html')));
app.get('/analytics.html', (req, res) => res.sendFile(path.join(staticPath, 'html/pages/analytics.html')));
app.get('/pending-registrations.html', (req, res) => res.sendFile(path.join(staticPath, 'html/pages/pending-registrations.html')));

// API Routes
app.use('/api/orders', orderRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api', userRoutes);
app.use('/api/password', passwordRoutes); // Password routes

// Handle 404 for undefined routes
app.use((req, res) => {
    res.status(404).send('Page not found');
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Server listening
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
