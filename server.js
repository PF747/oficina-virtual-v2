const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const helmet = require('helmet');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const http = require('http');
const net = require('net');
const multer = require('multer');

const app = express();
const PORT = 9443;

// === MULTER (File Uploads) ===
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads', 'invoices');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only images (JPEG, PNG, WebP) and PDF files are allowed'));
    }
});

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

// === MINING API (Antminer L7 cgminer proxy) ===

// Query cgminer API on Antminer L7
function queryMiner(command) {
    return new Promise((resolve, reject) => {
        const client = new net.Socket();
        client.setTimeout(5000);
        
        client.connect(4028, '192.168.1.171', () => {
            const msg = JSON.stringify({ command }) + '\n';
            client.write(msg);
        });
        
        let data = '';
        client.on('data', (chunk) => {
            data += chunk.toString();
        });
        
        client.on('end', () => {
            try {
                // Clean non-printable chars and parse JSON
                const cleaned = data.replace(/[^\x20-\x7E\n]/g, '');
                const json = JSON.parse(cleaned);
                resolve(json);
            } catch (e) {
                resolve({ raw: data, error: 'Parse error' });
            }
        });
        
        client.on('error', (err) => {
            reject(err);
        });
        
        client.on('timeout', () => {
            client.destroy();
            reject(new Error('Miner connection timeout'));
        });
    });
}

// Parse cgminer data into simplified format
function parseMinerData(summary, stats, pools) {
    const data = {};
    
    // Summary data
    if (summary && summary.SUMMARY && summary.SUMMARY[0]) {
        const s = summary.SUMMARY[0];
        data.hashrate = s['MHS 5s'] || s['GHS 5s'] * 1000 || 0; // Convert to MH/s
        data.accepted = s.Accepted || 0;
        data.rejected = s.Rejected || 0;
        data.uptime = s.Elapsed || 0;
    }
    
    // Stats data (temperatures, fans)
    if (stats && stats.STATS && stats.STATS[1]) {
        const st = stats.STATS[1];
        
        // Temperatures (chain 1-4)
        for (let i = 1; i <= 4; i++) {
            data[`temp${i}_chip`] = st[`temp${i}`] || st[`temp2_${i}`] || 0;
            data[`temp${i}_pcb`] = st[`temp_pcb${i}`] || st[`temp${i}_pcb`] || 0;
        }
        
        // Fans (1-4)
        for (let i = 1; i <= 4; i++) {
            data[`fan${i}`] = st[`fan${i}`] || 0;
        }
    }
    
    // Pool data
    if (pools && pools.POOLS && pools.POOLS[0]) {
        const p = pools.POOLS[0];
        data.poolUrl = p.URL || 'unknown';
        data.poolUser = p.User || 'unknown';
        data.poolWorker = p.User ? p.User.split('.')[1] : 'unknown';
        data.poolAlive = p.Status === 'Alive';
        data.difficulty = p.Difficulty || 0;
    }
    
    return data;
}

// Mining API routes
app.get('/api/mining/summary', requireAuth, async (req, res) => {
    try {
        const result = await queryMiner('summary');
        res.json(result);
    } catch (e) {
        res.status(503).json({ error: e.message });
    }
});

app.get('/api/mining/stats', requireAuth, async (req, res) => {
    try {
        const result = await queryMiner('stats');
        res.json(result);
    } catch (e) {
        res.status(503).json({ error: e.message });
    }
});

app.get('/api/mining/pools', requireAuth, async (req, res) => {
    try {
        const result = await queryMiner('pools');
        res.json(result);
    } catch (e) {
        res.status(503).json({ error: e.message });
    }
});

// Combined endpoint - fetches all data and parses it
app.get('/api/mining/all', requireAuth, async (req, res) => {
    try {
        const [summary, stats, pools] = await Promise.all([
            queryMiner('summary'),
            queryMiner('stats'),
            queryMiner('pools')
        ]);
        
        const data = parseMinerData(summary, stats, pools);
        res.json(data);
    } catch (e) {
        res.status(503).json({ error: e.message });
    }
});

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

// === INVOICE OCR ===

// OCR endpoint - extracts invoice data from image using Ollama vision model
app.post('/api/pife/invoices/ocr', requireAuth, upload.single('invoice'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        console.log(`[OCR] Processing invoice: ${req.file.filename}`);
        
        // Read image and convert to base64
        const imageBuffer = fs.readFileSync(req.file.path);
        const base64Image = imageBuffer.toString('base64');
        
        // Prepare Ollama request
        const ollamaPrompt = `Extract invoice data from this image. Return ONLY valid JSON with this exact structure:
{
  "number": "invoice number",
  "issuer_name": "company name",
  "issuer_tax_id": "tax ID (NIF/CIF)",
  "date": "YYYY-MM-DD",
  "due_date": "YYYY-MM-DD or null",
  "subtotal": 0.00,
  "tax_rate": 0.00,
  "tax_amount": 0.00,
  "irpf_rate": 0.00,
  "irpf_amount": 0.00,
  "total": 0.00,
  "currency": "EUR",
  "is_eu": false,
  "lines": [
    {
      "description": "item description",
      "quantity": 1,
      "unit_price": 0.00
    }
  ]
}
If a field is not visible, use null or 0. Extract all visible line items. Be precise with numbers.`;

        const ollamaData = JSON.stringify({
            model: 'qwen3-vl',
            prompt: ollamaPrompt,
            images: [base64Image],
            stream: false
        });

        // Call Ollama
        const options = {
            hostname: '127.0.0.1',
            port: 11434,
            path: '/api/generate',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(ollamaData)
            }
        };

        const ollamaReq = http.request(options, (ollamaRes) => {
            let responseData = '';
            
            ollamaRes.on('data', chunk => {
                responseData += chunk.toString();
            });

            ollamaRes.on('end', () => {
                try {
                    const ollamaResponse = JSON.parse(responseData);
                    const responseText = ollamaResponse.response || '';
                    
                    // Extract JSON from response (model might wrap it in markdown)
                    let extractedData;
                    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        extractedData = JSON.parse(jsonMatch[0]);
                    } else {
                        extractedData = JSON.parse(responseText);
                    }

                    // Add file path for reference
                    extractedData.file_path = `/uploads/invoices/${req.file.filename}`;
                    extractedData.original_filename = req.file.originalname;

                    console.log(`[OCR] Success: ${req.file.filename}`);
                    res.json({
                        success: true,
                        data: extractedData,
                        file: {
                            path: req.file.path,
                            url: `/uploads/invoices/${req.file.filename}`
                        }
                    });
                } catch (parseError) {
                    console.error(`[OCR] Parse error:`, parseError);
                    res.status(500).json({ 
                        error: 'Failed to parse OCR response',
                        details: parseError.message,
                        raw: responseData.substring(0, 500)
                    });
                }
            });
        });

        ollamaReq.on('error', (error) => {
            console.error(`[OCR] Ollama error:`, error);
            res.status(503).json({ 
                error: 'Ollama service unavailable',
                details: error.message
            });
        });

        ollamaReq.setTimeout(60000, () => {
            ollamaReq.destroy();
            res.status(504).json({ error: 'OCR timeout - image might be too large' });
        });

        ollamaReq.write(ollamaData);
        ollamaReq.end();

    } catch (error) {
        console.error(`[OCR] Error:`, error);
        // Clean up uploaded file on error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ 
            error: 'OCR processing failed',
            details: error.message
        });
    }
});

// Confirm and save invoice - creates invoice + lines in Supabase
app.post('/api/pife/invoices/confirm', requireAuth, async (req, res) => {
    try {
        const { invoice, lines } = req.body;
        
        if (!invoice) {
            return res.status(400).json({ error: 'Invoice data required' });
        }

        console.log(`[INVOICE] Saving invoice: ${invoice.number}`);

        // First, create the invoice
        const invoiceData = JSON.stringify({
            number: invoice.number,
            type: invoice.type || 'recibida',
            contact_name: invoice.issuer_name || invoice.contact_name,
            contact_tax_id: invoice.issuer_tax_id || invoice.contact_tax_id,
            date: invoice.date,
            due_date: invoice.due_date,
            status: invoice.status || 'pendiente',
            subtotal: parseFloat(invoice.subtotal) || 0,
            tax_rate: parseFloat(invoice.tax_rate) || 0,
            tax_amount: parseFloat(invoice.tax_amount) || 0,
            irpf_rate: parseFloat(invoice.irpf_rate) || 0,
            irpf_amount: parseFloat(invoice.irpf_amount) || 0,
            total: parseFloat(invoice.total) || 0,
            business_line: invoice.business_line,
            category: invoice.category,
            description: invoice.description,
            is_eu: invoice.is_eu || false,
            is_intracom: invoice.is_intracom || false,
            file_path: invoice.file_path
        });

        const invoiceOptions = {
            hostname: '127.0.0.1',
            port: 3001,
            path: '/invoices',
            method: 'POST',
            headers: {
                'Accept-Profile': 'pife',
                'Content-Profile': 'pife',
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(invoiceData),
                'Prefer': 'return=representation'
            }
        };

        const invoiceReq = http.request(invoiceOptions, (invoiceRes) => {
            let body = '';
            invoiceRes.on('data', chunk => body += chunk);
            invoiceRes.on('end', async () => {
                if (invoiceRes.statusCode >= 200 && invoiceRes.statusCode < 300) {
                    const createdInvoice = JSON.parse(body)[0];
                    console.log(`[INVOICE] Created invoice ID: ${createdInvoice.id}`);

                    // Now create invoice lines if provided
                    if (lines && lines.length > 0) {
                        const linesData = lines.map(line => ({
                            invoice_id: createdInvoice.id,
                            description: line.description,
                            quantity: parseFloat(line.quantity) || 1,
                            unit_price: parseFloat(line.unit_price) || 0,
                            tax_rate: parseFloat(line.tax_rate) || parseFloat(invoice.tax_rate) || 0,
                            subtotal: parseFloat(line.subtotal) || (parseFloat(line.quantity) * parseFloat(line.unit_price))
                        }));

                        const linesPayload = JSON.stringify(linesData);
                        const linesOptions = {
                            hostname: '127.0.0.1',
                            port: 3001,
                            path: '/invoice_lines',
                            method: 'POST',
                            headers: {
                                'Accept-Profile': 'pife',
                                'Content-Profile': 'pife',
                                'Content-Type': 'application/json',
                                'Content-Length': Buffer.byteLength(linesPayload),
                                'Prefer': 'return=representation'
                            }
                        };

                        const linesReq = http.request(linesOptions, (linesRes) => {
                            let linesBody = '';
                            linesRes.on('data', chunk => linesBody += chunk);
                            linesRes.on('end', () => {
                                if (linesRes.statusCode >= 200 && linesRes.statusCode < 300) {
                                    console.log(`[INVOICE] Created ${lines.length} invoice lines`);
                                    res.json({
                                        success: true,
                                        invoice: createdInvoice,
                                        lines: JSON.parse(linesBody)
                                    });
                                } else {
                                    console.error(`[INVOICE] Lines error:`, linesBody);
                                    res.status(linesRes.statusCode).json({ 
                                        error: 'Failed to create invoice lines',
                                        invoice: createdInvoice,
                                        details: linesBody
                                    });
                                }
                            });
                        });

                        linesReq.on('error', (err) => {
                            console.error(`[INVOICE] Lines request error:`, err);
                            res.status(500).json({ 
                                error: 'Failed to save invoice lines',
                                invoice: createdInvoice
                            });
                        });

                        linesReq.write(linesPayload);
                        linesReq.end();
                    } else {
                        // No lines to create
                        res.json({
                            success: true,
                            invoice: createdInvoice
                        });
                    }
                } else {
                    console.error(`[INVOICE] Error:`, body);
                    res.status(invoiceRes.statusCode).json({ 
                        error: 'Failed to create invoice',
                        details: body
                    });
                }
            });
        });

        invoiceReq.on('error', (err) => {
            console.error(`[INVOICE] Request error:`, err);
            res.status(500).json({ 
                error: 'Failed to save invoice',
                details: err.message
            });
        });

        invoiceReq.write(invoiceData);
        invoiceReq.end();

    } catch (error) {
        console.error(`[INVOICE] Confirm error:`, error);
        res.status(500).json({ 
            error: 'Failed to confirm invoice',
            details: error.message
        });
    }
});

// Serve uploaded invoice files
app.use('/uploads', requireAuth, express.static(path.join(__dirname, 'uploads')));

// === CHAT API (Supabase api schema) ===

// Get all channels
app.get('/api/chat/channels', requireAuth, (req, res) => {
    const options = {
        hostname: '127.0.0.1',
        port: 3001,
        path: '/chat_channels?order=id.asc',
        method: 'GET',
        headers: {
            'Accept-Profile': 'api',
            'Content-Profile': 'api',
            'Content-Type': 'application/json'
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
    reqProxy.setTimeout(5000, () => { reqProxy.destroy(); res.status(504).json({ error: 'timeout' }); });
    reqProxy.end();
});

// Get messages for a channel
app.get('/api/chat/messages', requireAuth, (req, res) => {
    const { channel_id, limit = 50, after } = req.query;
    
    if (!channel_id) {
        return res.status(400).json({ error: 'channel_id required' });
    }

    let path = `/chat_messages?channel_id=eq.${channel_id}&order=created_at.asc&limit=${limit}`;
    if (after) {
        path += `&id=gt.${after}`;
    }

    const options = {
        hostname: '127.0.0.1',
        port: 3001,
        path: path,
        method: 'GET',
        headers: {
            'Accept-Profile': 'api',
            'Content-Profile': 'api',
            'Content-Type': 'application/json'
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
    reqProxy.setTimeout(5000, () => { reqProxy.destroy(); res.status(504).json({ error: 'timeout' }); });
    reqProxy.end();
});

// Post a message
app.post('/api/chat/messages', requireAuth, (req, res) => {
    const { channel_id, content, reply_to } = req.body;
    const sender = req.session.user.username;
    const sender_role = req.session.user.role === 'admin' ? 'jefe' : 'agent';

    if (!channel_id || !content) {
        return res.status(400).json({ error: 'channel_id and content required' });
    }

    const message = {
        channel_id,
        sender,
        sender_role,
        content,
        reply_to: reply_to || null
    };

    const data = JSON.stringify(message);
    const options = {
        hostname: '127.0.0.1',
        port: 3001,
        path: '/chat_messages',
        method: 'POST',
        headers: {
            'Accept-Profile': 'api',
            'Content-Profile': 'api',
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data),
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
    reqProxy.setTimeout(5000, () => { reqProxy.destroy(); res.status(504).json({ error: 'timeout' }); });
    reqProxy.write(data);
    reqProxy.end();
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
