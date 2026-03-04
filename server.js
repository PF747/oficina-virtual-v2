const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const helmet = require('helmet');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const http = require('http');

const app = express();
const PORT = 9443;

// === REDIS CLIENT (FalkorDB) ===
let Redis;
let graphClient;
try {
    Redis = require('ioredis');
    graphClient = new Redis(6379, '127.0.0.1');
    console.log('✅ FalkorDB Redis client initialized');
} catch (e) {
    console.warn('⚠️  ioredis not found - graph features disabled. Run: npm install ioredis');
}

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
            frameSrc: ["'self'"],
            frameAncestors: ["'self'"],
            upgradeInsecureRequests: null,  // Disable — we serve HTTP internally
        }
    },
    hsts: false  // No HSTS on internal HTTP
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

// === DATABASE PROXY ROUTES ===

// Pife schema proxy helper
function pifeProxy(endpoint, method = 'GET') {
    return (req, res) => {
        const queryString = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
        const options = {
            hostname: '127.0.0.1',
            port: 3001,
            path: endpoint + queryString,
            method: method || req.method,
            headers: {
                'Accept-Profile': 'pife',
                'Content-Profile': 'pife',
                'Content-Type': 'application/json'
            }
        };

        // Handle POST/PATCH body
        const data = (method === 'POST' || method === 'PATCH') && req.body ? JSON.stringify(req.body) : null;
        if (data) {
            options.headers['Content-Length'] = Buffer.byteLength(data);
            options.headers['Prefer'] = 'return=representation';
        }

        const reqProxy = http.request(options, (proxyRes) => {
            let body = '';
            proxyRes.on('data', chunk => body += chunk);
            proxyRes.on('end', () => {
                res.status(proxyRes.statusCode).set('Content-Type', 'application/json').send(body);
            });
        });

        reqProxy.on('error', () => res.status(503).json({ error: 'Supabase offline' }));
        reqProxy.setTimeout(5000, () => { reqProxy.destroy(); res.status(504).json({ error: 'timeout' }); });

        if (data) reqProxy.write(data);
        reqProxy.end();
    };
}

// Pife schema routes
app.get('/api/pife/contacts', requireAuth, pifeProxy('/contacts'));
app.post('/api/pife/contacts', requireAuth, pifeProxy('/contacts', 'POST'));
app.patch('/api/pife/contacts/:id', requireAuth, (req, res) => {
    pifeProxy(`/contacts?id=eq.${req.params.id}`, 'PATCH')(req, res);
});
app.delete('/api/pife/contacts/:id', requireAuth, (req, res) => {
    const options = {
        hostname: '127.0.0.1',
        port: 3001,
        path: `/contacts?id=eq.${req.params.id}`,
        method: 'DELETE',
        headers: {
            'Accept-Profile': 'pife',
            'Content-Profile': 'pife'
        }
    };
    const reqProxy = http.request(options, (proxyRes) => {
        res.status(proxyRes.statusCode).end();
    });
    reqProxy.on('error', () => res.status(503).json({ error: 'Supabase offline' }));
    reqProxy.end();
});

app.get('/api/pife/invoices', requireAuth, pifeProxy('/invoices'));
app.post('/api/pife/invoices', requireAuth, pifeProxy('/invoices', 'POST'));
app.patch('/api/pife/invoices/:id', requireAuth, (req, res) => {
    pifeProxy(`/invoices?id=eq.${req.params.id}`, 'PATCH')(req, res);
});
app.delete('/api/pife/invoices/:id', requireAuth, (req, res) => {
    const options = {
        hostname: '127.0.0.1',
        port: 3001,
        path: `/invoices?id=eq.${req.params.id}`,
        method: 'DELETE',
        headers: {
            'Accept-Profile': 'pife',
            'Content-Profile': 'pife'
        }
    };
    const reqProxy = http.request(options, (proxyRes) => {
        res.status(proxyRes.statusCode).end();
    });
    reqProxy.on('error', () => res.status(503).json({ error: 'Supabase offline' }));
    reqProxy.end();
});

app.get('/api/pife/invoice_lines', requireAuth, pifeProxy('/invoice_lines'));
app.post('/api/pife/invoice_lines', requireAuth, pifeProxy('/invoice_lines', 'POST'));

app.get('/api/pife/bank_accounts', requireAuth, pifeProxy('/bank_accounts'));
app.post('/api/pife/bank_accounts', requireAuth, pifeProxy('/bank_accounts', 'POST'));

app.get('/api/pife/bank_transactions', requireAuth, pifeProxy('/bank_transactions'));
app.post('/api/pife/bank_transactions', requireAuth, pifeProxy('/bank_transactions', 'POST'));

app.get('/api/pife/expenses', requireAuth, pifeProxy('/expenses'));
app.post('/api/pife/expenses', requireAuth, pifeProxy('/expenses', 'POST'));

app.get('/api/pife/business_lines', requireAuth, pifeProxy('/business_lines'));

app.get('/api/pife/contracts', requireAuth, pifeProxy('/contracts'));
app.post('/api/pife/contracts', requireAuth, pifeProxy('/contracts', 'POST'));

app.get('/api/pife/tax_periods', requireAuth, pifeProxy('/tax_periods'));

// Supabase (PostgREST) - Tasks API
app.get('/api/tasks', requireAuth, (req, res) => {
    const reqProxy = http.get('http://127.0.0.1:3001/tasks?order=updated_at.desc', (proxyRes) => {
        res.set('Content-Type', 'application/json');
        proxyRes.pipe(res);
    });
    reqProxy.on('error', () => res.status(503).json({ error: 'Supabase offline' }));
    reqProxy.setTimeout(5000, () => { reqProxy.destroy(); res.status(504).json({ error: 'timeout' }); });
});

app.post('/api/tasks', requireAuth, (req, res) => {
    const data = JSON.stringify(req.body);
    const options = {
        hostname: '127.0.0.1',
        port: 3001,
        path: '/tasks',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length,
            'Prefer': 'return=representation'
        }
    };
    const reqProxy = http.request(options, (proxyRes) => {
        let body = '';
        proxyRes.on('data', chunk => body += chunk);
        proxyRes.on('end', () => {
            res.status(proxyRes.statusCode).set('Content-Type', 'application/json').send(body);
        });
    });
    reqProxy.on('error', () => res.status(503).json({ error: 'Supabase offline' }));
    reqProxy.write(data);
    reqProxy.end();
});

app.patch('/api/tasks/:id', requireAuth, (req, res) => {
    const data = JSON.stringify(req.body);
    const options = {
        hostname: '127.0.0.1',
        port: 3001,
        path: `/tasks?id=eq.${req.params.id}`,
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length,
            'Prefer': 'return=representation'
        }
    };
    const reqProxy = http.request(options, (proxyRes) => {
        let body = '';
        proxyRes.on('data', chunk => body += chunk);
        proxyRes.on('end', () => {
            res.status(proxyRes.statusCode).set('Content-Type', 'application/json').send(body);
        });
    });
    reqProxy.on('error', () => res.status(503).json({ error: 'Supabase offline' }));
    reqProxy.write(data);
    reqProxy.end();
});

app.delete('/api/tasks/:id', requireAuth, (req, res) => {
    const options = {
        hostname: '127.0.0.1',
        port: 3001,
        path: `/tasks?id=eq.${req.params.id}`,
        method: 'DELETE'
    };
    const reqProxy = http.request(options, (proxyRes) => {
        res.status(proxyRes.statusCode).end();
    });
    reqProxy.on('error', () => res.status(503).json({ error: 'Supabase offline' }));
    reqProxy.end();
});

// FalkorDB (Redis) - Graph API
app.post('/api/graph/query', requireAuth, async (req, res) => {
    if (!graphClient) return res.status(503).json({ error: 'FalkorDB not available' });
    try {
        const { query } = req.body;
        const result = await graphClient.call('GRAPH.QUERY', 'orgchart', query);
        res.json({ result });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/graph/orgchart', requireAuth, async (req, res) => {
    if (!graphClient) return res.status(503).json({ error: 'FalkorDB not available' });
    try {
        // Query all nodes and edges
        const query = 'MATCH (n)-[r]->(m) RETURN n.name, n.type, type(r), m.name, m.type';
        const result = await graphClient.call('GRAPH.QUERY', 'orgchart', query);
        
        // Parse result into nodes and edges
        const nodes = new Map();
        const edges = [];
        
        if (result && result[1]) {
            result[1].forEach(row => {
                const [fromName, fromType, relType, toName, toType] = row;
                if (!nodes.has(fromName)) nodes.set(fromName, { id: fromName, name: fromName, type: fromType });
                if (!nodes.has(toName)) nodes.set(toName, { id: toName, name: toName, type: toType });
                edges.push({ source: fromName, target: toName, label: relType });
            });
        }
        
        res.json({ nodes: Array.from(nodes.values()), edges });
    } catch (e) {
        console.error('Orgchart error:', e);
        // Return default orgchart if query fails
        res.json({
            nodes: [
                { id: 'Jefe', name: 'Jefe', type: 'ceo' },
                { id: 'IA', name: 'IA', type: 'dept' },
                { id: 'Trading', name: 'Trading', type: 'dept' },
                { id: 'Seguridad', name: 'Seguridad', type: 'dept' },
                { id: 'Energía', name: 'Energía', type: 'dept' },
                { id: 'Vision', name: 'Vision', type: 'dept' }
            ],
            edges: [
                { source: 'Jefe', target: 'IA', label: 'MANAGES' },
                { source: 'Jefe', target: 'Trading', label: 'MANAGES' },
                { source: 'Jefe', target: 'Seguridad', label: 'MANAGES' },
                { source: 'Jefe', target: 'Energía', label: 'MANAGES' },
                { source: 'Jefe', target: 'Vision', label: 'MANAGES' }
            ]
        });
    }
});

// Qdrant - Vector DB API
function proxyQdrant(path, method = 'GET', data = null) {
    return (req, res) => {
        const options = {
            hostname: '127.0.0.1',
            port: 6333,
            path: path.replace(':name', req.params.name),
            method: method,
            headers: { 'Content-Type': 'application/json' }
        };
        
        const reqProxy = http.request(options, (proxyRes) => {
            let body = '';
            proxyRes.on('data', chunk => body += chunk);
            proxyRes.on('end', () => {
                res.status(proxyRes.statusCode).set('Content-Type', 'application/json').send(body);
            });
        });
        
        reqProxy.on('error', () => res.status(503).json({ error: 'Qdrant offline' }));
        reqProxy.setTimeout(5000, () => { reqProxy.destroy(); res.status(504).json({ error: 'timeout' }); });
        
        if (data || (method === 'POST' && req.body)) {
            reqProxy.write(JSON.stringify(data || req.body));
        }
        reqProxy.end();
    };
}

app.get('/api/vectors/collections', requireAuth, proxyQdrant('/collections'));
app.get('/api/vectors/collection/:name', requireAuth, proxyQdrant('/collections/:name'));
app.post('/api/vectors/collection/:name/points/scroll', requireAuth, proxyQdrant('/collections/:name/points/scroll', 'POST'));

// === CAMERA PROXY ===

app.get('/api/cam/dgx/snapshot', requireAuth, (req, res) => {
    const camReq = http.get('http://127.0.0.1:8090/snapshot', (camRes) => {
        res.set({
            'Content-Type': 'image/jpeg',
            'Cache-Control': 'no-cache, no-store',
            'Access-Control-Allow-Origin': '*'
        });
        camRes.pipe(res);
    });
    camReq.on('error', () => {
        res.status(503).json({ error: 'Camera offline' });
    });
    camReq.setTimeout(3000, () => {
        camReq.destroy();
        res.status(504).json({ error: 'Camera timeout' });
    });
});

// Jetson YOLO camera proxy (port 8766 on Jetson — YOLO overlay)
app.get('/api/cam/jetson/snapshot', requireAuth, (req, res) => {
    const camReq = http.get('http://192.168.1.137:8766/snap', (camRes) => {
        res.set({
            'Content-Type': 'image/jpeg',
            'Cache-Control': 'no-cache, no-store',
            'Access-Control-Allow-Origin': '*'
        });
        camRes.pipe(res);
    });
    camReq.on('error', () => {
        res.status(503).json({ error: 'Jetson camera offline' });
    });
    camReq.setTimeout(3000, () => {
        camReq.destroy();
        res.status(504).json({ error: 'Jetson camera timeout' });
    });
});

// Jetson YOLO detections API
app.get('/api/cam/jetson/detections', requireAuth, (req, res) => {
    const camReq = http.get('http://192.168.1.137:8766/detections', (camRes) => {
        let data = '';
        camRes.on('data', chunk => data += chunk);
        camRes.on('end', () => {
            res.set('Content-Type', 'application/json');
            res.send(data);
        });
    });
    camReq.on('error', () => res.status(503).json({ error: 'Jetson offline' }));
    camReq.setTimeout(3000, () => { camReq.destroy(); res.status(504).json({ error: 'timeout' }); });
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
