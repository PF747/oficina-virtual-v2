const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const helmet = require('helmet');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 9443;

// === SECURITY ===
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "cdn.jsdelivr.net"],
            styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
            fontSrc: ["'self'", "fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "blob:"],
            connectSrc: ["'self'"],
            workerSrc: ["'self'", "blob:"],
        }
    },
    hsts: { maxAge: 31536000, includeSubDomains: true }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const loginAttempts = {};
function rateLimitLogin(ip) {
    const now = Date.now();
    if (!loginAttempts[ip]) loginAttempts[ip] = [];
    loginAttempts[ip] = loginAttempts[ip].filter(t => now - t < 900000);
    if (loginAttempts[ip].length >= 5) return false;
    loginAttempts[ip].push(now);
    return true;
}

// Session
const SESSION_SECRET = crypto.randomBytes(64).toString('hex');
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 8 * 60 * 60 * 1000,
        sameSite: 'strict'
    }
}));

// === USERS ===
const USERS_FILE = path.join(__dirname, '.users.json');

async function loadUsers() {
    try {
        return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    } catch {
        const users = {
            'jefe': { hash: await bcrypt.hash('pifienergy2026', 12), role: 'admin' },
            'torrente': { hash: await bcrypt.hash('lion_director_9', 12), role: 'admin' },
            'viewer': { hash: await bcrypt.hash('oficina_view', 12), role: 'viewer' }
        };
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        fs.chmodSync(USERS_FILE, 0o600);
        return users;
    }
}

let users = {};
loadUsers().then(u => { users = u; console.log(`✅ Loaded ${Object.keys(u).length} users`); });

// === AUTH ===
function requireAuth(req, res, next) {
    if (req.session && req.session.user) return next();
    if (req.headers.accept && req.headers.accept.includes('json')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    res.redirect('/login');
}

// === ROUTES ===

// Login page
app.get('/login', (req, res) => {
    if (req.session && req.session.user) return res.redirect('/');
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Login API
app.post('/api/login', async (req, res) => {
    const ip = req.ip;
    if (!rateLimitLogin(ip)) {
        return res.status(429).json({ error: 'Too many attempts. Wait 15 minutes.' });
    }

    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });

    const user = users[username.toLowerCase()];
    if (!user) {
        await new Promise(r => setTimeout(r, 1000));
        return res.status(401).json({ error: 'Invalid' });
    }

    const valid = await bcrypt.compare(password, user.hash);
    if (!valid) {
        await new Promise(r => setTimeout(r, 1000));
        return res.status(401).json({ error: 'Invalid' });
    }

    req.session.user = { username: username.toLowerCase(), role: user.role };
    console.log(`[LOGIN] ${username} from ${ip} at ${new Date().toISOString()}`);
    res.json({ ok: true, user: username, role: user.role });
});

// Form login (for the login.html form)
app.post('/api/form-login', async (req, res) => {
    const ip = req.ip;
    if (!rateLimitLogin(ip)) {
        return res.redirect('/login?error=rate');
    }

    const { username, password, role } = req.body;
    if (!username || !password) return res.redirect('/login?error=1');

    const user = users[username.toLowerCase()];
    if (!user) {
        await new Promise(r => setTimeout(r, 1000));
        return res.redirect('/login?error=1');
    }

    const valid = await bcrypt.compare(password, user.hash);
    if (!valid) {
        await new Promise(r => setTimeout(r, 1000));
        return res.redirect('/login?error=1');
    }

    // VIP access requires admin role
    if (role === 'admin' && user.role !== 'admin') {
        return res.redirect('/login?error=vip');
    }

    req.session.user = { username: username.toLowerCase(), role: user.role };
    console.log(`[LOGIN] ${username} (${user.role}) from ${ip} at ${new Date().toISOString()}`);
    
    // Redirect based on role/request
    if (role === 'admin' && user.role === 'admin') {
        res.redirect('/trading.html');
    } else {
        res.redirect('/');
    }
});

// Logout
app.get('/logout', (req, res) => {
    const user = req.session.user?.username || 'unknown';
    req.session.destroy();
    console.log(`[LOGOUT] ${user} at ${new Date().toISOString()}`);
    res.redirect('/login');
});

// Status API
app.get('/api/status', requireAuth, (req, res) => {
    res.json({
        user: req.session.user,
        uptime: process.uptime(),
        server: 'DGX Sparks V2',
        version: '2.0.0',
        agents: 10,
        projects: 8
    });
});

// Strategy files API
app.get('/api/strategy/:filename', requireAuth, (req, res) => {
    const filename = req.params.filename.replace(/[^a-zA-Z0-9\-_.]/g, '');
    const filePath = path.join(__dirname, 'strategies', filename);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Strategy not found' });
    }
    res.type('text/plain').sendFile(filePath);
});

// List strategies API
app.get('/api/strategies', requireAuth, (req, res) => {
    const strategiesDir = path.join(__dirname, 'strategies');
    try {
        const files = fs.readdirSync(strategiesDir).filter(f => f.endsWith('.md')).sort();
        res.json({ strategies: files });
    } catch {
        res.json({ strategies: [] });
    }
});

// Protected static files — index.html is the main hub
app.use('/', requireAuth, express.static(__dirname, {
    index: 'index.html',
    dotfiles: 'deny'
}));

// === START ===
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🦁 Oficina Virtual V2 listening on port ${PORT}`);
    console.log(`   Local: http://192.168.1.152:${PORT}`);
    console.log(`   Tailscale: http://100.123.9.106:${PORT}`);
});
