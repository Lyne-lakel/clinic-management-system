/**
 * =============================================================================
 * SERVER ENTRY POINT — server.js
 * =============================================================================
 *
 * STUDENT DEFENSE NOTE:
 * This is the "main" file of the backend — the first file Node.js runs.
 * It is responsible for three things:
 *
 *   1. CONFIGURATION: Loading environment variables and setting up middleware.
 *   2. ROUTING: Connecting URL prefixes to their route file.
 *   3. STARTUP: Connecting to the database, then starting the HTTP listener.
 *
 * WHY DO WE CONNECT TO DB BEFORE LISTENING?
 * We use `async/await` to ensure the server only starts accepting requests
 * AFTER a successful database connection. If we started the server first,
 * incoming requests could fail immediately because the DB isn't ready yet.
 *
 * MVC ARCHITECTURE OVERVIEW:
 * ┌──────────────┐    ┌──────────────┐    ┌───────────────┐    ┌──────────────┐
 * │   Frontend   │ →  │   Routes     │ →  │  Controllers  │ →  │   Models     │
 * │  (Next.js)   │    │  (this file  │    │  (logic)      │    │  (MongoDB)   │
 * │              │    │  + routes/)  │    │               │    │              │
 * └──────────────┘    └──────────────┘    └───────────────┘    └──────────────┘
 *
 * NEW IN THIS VERSION:
 *   - Added /api/patients route for the new Patient model.
 *   - All other admin routes (/api/admin/*) are unchanged in prefix but
 *     now handle stats, audit logs, reports, and settings via adminRoutes.js.
 * =============================================================================
 */

// ─── Core Dependencies ────────────────────────────────────────────────────────
const express = require('express');
const cors    = require('cors');

// `dotenv` reads the .env file and loads MONGO_URI etc. into process.env
require('dotenv').config();

// Our custom database connection helper
const connectToDatabase = require('./config/database');

// ─── Create Express App ───────────────────────────────────────────────────────
const app = express();

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────

// STUDENT DEFENSE NOTE:
// CORS (Cross-Origin Resource Sharing) is a browser security feature that blocks
// requests from a different "origin" (domain + port). Our React frontend runs on
// port 3000 and our backend on port 5000, so without CORS configuration, every
// fetch() call from the frontend would be blocked by the browser.
//
// `methods` lists every HTTP verb our frontend might use:
//   GET    = read data
//   POST   = create data
//   PUT    = full update
//   PATCH  = partial update
//   DELETE = remove data
// Allow frontend dev servers on ports 3000 and 3001 during development.
// Keep this simple for a student project: whitelist common localhost ports.
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
app.use(cors({
    origin: function(origin, callback) {
        // `origin` will be undefined for server-side requests (curl, Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
        return callback(new Error('CORS policy: This origin is not allowed'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}));

// STUDENT DEFENSE NOTE:
// `express.json()` is middleware that parses the request body from raw text
// into a JavaScript object. Without this, `req.body` would be `undefined`
// in every controller, and we couldn't read the data sent from the frontend.
app.use(express.json());

// ─── ROUTES ───────────────────────────────────────────────────────────────────

// STUDENT DEFENSE NOTE:
// `app.use('/api/admin', require('./routes/adminRoutes'))` means:
// "Any request whose URL starts with /api/admin should be handled by adminRoutes.js."
// The prefix /api/admin is stripped before being passed to the route file,
// so inside adminRoutes.js, the routes are defined as /stats, /staff, /audit-logs etc.
// (not /api/admin/stats etc.)

// Admin routes: staff management, dashboard stats, audit logs, reports, settings.
app.use('/api/admin', require('./routes/adminRoutes'));

// Patient routes: full CRUD for patient records.
// Separated from admin routes for cleaner resource organisation.
app.use('/api/patients', require('./routes/patientRoutes'));

// Receptionist routes: appointment booking, queue management, patient registration.
// Separated from admin to enforce receptionist-specific access control.
app.use('/api/receptionist', require('./routes/receptionistRoutes'));

// Auth routes: Login and authentication.
app.use('/api/auth', require('./routes/authRoutes'));

// Public/Shared Appointment routes (e.g., Live Queue Screen)
app.use('/api/appointments', require('./routes/appointmentRoutes'));
// ─── HEALTH CHECK ROUTE ───────────────────────────────────────────────────────
// A simple route to verify the API is running. Useful for testing deployment.
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status:  'ok',
        message: 'CityMed API is running',
        uptime:  `${Math.floor(process.uptime())}s`,
        time:    new Date().toISOString()
    });
});


// ─── SERVER STARTUP ───────────────────────────────────────────────────────────

/**
 * startServer — connects to MongoDB, then starts the HTTP listener.
 *
 * STUDENT DEFENSE NOTE:
 * We define this as an `async` function because `connectToDatabase()` returns
 * a Promise (it takes time to establish a network connection to MongoDB Atlas).
 * Using `await` pauses execution at that line until the connection resolves.
 * The `try/catch` block catches any connection failure (wrong credentials,
 * network issue, etc.) and logs it instead of crashing silently.
 */
async function startServer() {
    try {
        // Wait for the MongoDB connection to be established.
        await connectToDatabase();
        console.log('✅ Database connected successfully');

        // Start the HTTP server only after DB is ready.
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 CityMed server running on http://localhost:${PORT}`);
            console.log(`📋 Admin API:   http://localhost:${PORT}/api/admin`);
            console.log(`👤 Patient API: http://localhost:${PORT}/api/patients`);
            console.log(`🩺 Receptionist API: http://localhost:${PORT}/api/receptionist`);
            console.log(`🔐 Auth API:    http://localhost:${PORT}/api/auth`);
            console.log(`📺 Queue API:   http://localhost:${PORT}/api/appointments/queue`);
            console.log(`❤️  Health:     http://localhost:${PORT}/api/health`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err.message);
        // Exit the process with error code 1 to signal a startup failure.
        // A process manager (like PM2) would then automatically restart the server.
        process.exit(1);
    }
}

// Call the startup function.
startServer();
