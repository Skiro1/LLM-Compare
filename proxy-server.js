const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const ANTHROPIC_HOST = 'api.anthropic.com';

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css':  'text/css',
    '.js':   'application/javascript',
    '.json': 'application/json',
    '.png':  'image/png',
    '.svg':  'image/svg+xml',
    '.ico':  'image/x-icon',
};

function addCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key, anthropic-version, anthropic-dangerous-direct-browser-access');
    res.setHeader('Access-Control-Max-Age', '86400');
}

function proxyRequest(targetHost, req, res) {
    const options = {
        hostname: targetHost,
        port: 443,
        path: req.url,
        method: req.method,
        headers: { ...req.headers, host: targetHost },
    };

    // Remove browser-specific headers
    delete options.headers['origin'];
    delete options.headers['referer'];

    const proxy = https.request(options, (proxyRes) => {
        addCorsHeaders(res);
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
    });

    proxy.on('error', (err) => {
        addCorsHeaders(res);
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Proxy error', message: err.message }));
    });

    req.pipe(proxy);
}

function serveStatic(req, res) {
    let filePath = req.url === '/' ? '/LLM_Compare.html' : req.url;
    filePath = path.join(__dirname, filePath);

    // Security: prevent directory traversal
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not found');
            return;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
}

const server = http.createServer((req, res) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        addCorsHeaders(res);
        res.writeHead(204);
        res.end();
        return;
    }

    // Proxy Anthropic API requests
    if (req.url.startsWith('/v1/messages') || req.url.startsWith('/v1/models')) {
        // Add required Anthropic headers
        req.headers['anthropic-dangerous-direct-browser-access'] = 'true';
        proxyRequest(ANTHROPIC_HOST, req, res);
        return;
    }

    // Serve static files
    serveStatic(req, res);
});

server.listen(PORT, () => {
    console.log(`\n  LLM Compare server started: http://localhost:${PORT}`);
    console.log(`  Anthropic API proxy: http://localhost:${PORT}/v1/messages`);
    console.log(`\n  Open http://localhost:${PORT} in your browser\n`);
});
