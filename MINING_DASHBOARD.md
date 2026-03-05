# Mining Dashboard — Antminer L7

## Overview
Full-featured real-time mining dashboard for the πφe Command Center, monitoring the Antminer L7 at 192.168.1.171.

## Access
**URL:** http://192.168.1.152:9443/mining.html  
**Auth Required:** Yes (session cookie from main login)

## Features

### 1. Top Stats Row (Updates every 30s)
- **Hashrate**: Current GH/s with trend arrow (↑/↓)
- **Active Pool**: Status badge (ALIVE/DEAD)
- **Shares**: Accepted/Rejected with rejection rate %
- **Uptime**: Hours and minutes since restart
- **Est. Daily DOGE**: Estimated earnings with EUR conversion

### 2. Hashrate Chart
- Canvas-based line chart showing 2 hours of history (240 data points)
- Auto-scrolling with new data every 30s
- Ideal hashrate reference line (6711 MH/s)
- Color-coded: Green when above ideal, yellow when below
- Stored in memory (resets on page refresh)

### 3. Temperature Gauges
- 4 animated circular gauges (one per chain)
- Dual-ring display: Inner = Chip temp, Outer = PCB temp
- Color-coded:
  - Green: <60°C (normal)
  - Yellow: 60-75°C (warm)
  - Red: >75°C (hot)
- Center displays chip temp, bottom shows PCB temp

### 4. Pool Info Panel
- Pool URL, User, Worker name
- Current difficulty
- Accepted/Rejected shares with color coding
- Pool status badge

### 5. Fan Speed Panel
- 4 fan RPMs displayed with animated fan icons
- Normal range indicator (3000-7000 RPM)
- Border color: Green = normal, Yellow = warning

### 6. Profitability Calculator
- Daily/Weekly/Monthly DOGE estimates
- Conversion to EUR (fetched from CoinGecko API)
- Pool comparison table:
  - Unmineable (current, 1% fee)
  - ViaBTC (2% fee)
  - Litecoinpool (0% fee, merged mining)

### 7. History Log
- Scrollable event log at bottom
- Last 50 events displayed
- Color-coded messages:
  - Green: Success events
  - Yellow: Warnings
  - Red: Errors
- Timestamps in HH:MM:SS format

## Technical Details

### Server-Side (server.js)

#### Mining API Routes
1. **GET /api/mining/summary**  
   Raw cgminer summary data (hashrate, shares, uptime)

2. **GET /api/mining/stats**  
   Raw cgminer stats (temps, fans, detailed metrics)

3. **GET /api/mining/pools**  
   Raw cgminer pool data (URLs, status, difficulty)

4. **GET /api/mining/all** ✨ RECOMMENDED  
   Combined endpoint that fetches all three and returns parsed data:
   ```json
   {
     "hashrate": 6711.59,
     "accepted": 1234,
     "rejected": 5,
     "uptime": 19134,
     "temp1_chip": 58,
     "temp1_pcb": 52,
     "temp2_chip": 60,
     "temp2_pcb": 54,
     "temp3_chip": 59,
     "temp3_pcb": 53,
     "temp4_chip": 61,
     "temp4_pcb": 55,
     "fan1": 5200,
     "fan2": 5400,
     "fan3": 5300,
     "fan4": 5500,
     "poolUrl": "scrypt.unmineable.com:3333",
     "poolUser": "DOGE:DMC...",
     "poolWorker": "L7-001",
     "poolAlive": true,
     "difficulty": 12345.67
   }
   ```

#### Implementation
```javascript
const net = require('net');

function queryMiner(command) {
    return new Promise((resolve, reject) => {
        const client = new net.Socket();
        client.setTimeout(5000);
        client.connect(4028, '192.168.1.171', () => {
            client.write(JSON.stringify({command}) + '\n');
        });
        let data = '';
        client.on('data', (chunk) => { data += chunk; });
        client.on('end', () => {
            try {
                resolve(JSON.parse(data.replace(/[^\x20-\x7E\n]/g, '')));
            } catch(e) {
                resolve({raw: data, error: 'Parse error'});
            }
        });
        client.on('error', reject);
        client.on('timeout', () => {
            client.destroy();
            reject(new Error('timeout'));
        });
    });
}
```

### Client-Side (mining.html)

#### Update Cycle
- Main loop: Every 30 seconds
- DOGE price refresh: Every 10 minutes
- Chart history: Last 2 hours (240 points max)

#### Data Flow
```
1. fetch('/api/mining/all')
2. Parse response → update all panels
3. Add to hashHistory[] array
4. Redraw canvas chart
5. Log event to history
6. Schedule next update (30s)
```

#### Constants
```javascript
const IDEAL_HASHRATE = 6711; // MH/s
const UPDATE_INTERVAL = 30000; // 30s
const CHART_HISTORY = 240; // 2h @ 30s intervals
const DOGE_PRICE_EUR = 0.08; // Fallback
```

## Mining Hardware

### Antminer L7
- **Model**: Bitmain Antminer L7
- **IP**: 192.168.1.171
- **API Port**: 4028 (cgminer JSON-RPC over TCP)
- **Algorithm**: Scrypt
- **Hashrate**: ~6.7 GH/s (6711 MH/s)
- **Power**: ~3420W
- **Chains**: 4
- **Fans**: 4

### Pool Configuration
- **Pool**: Unmineable
- **URL**: stratum+tcp://scrypt.unmineable.com:3333
- **Coin**: Dogecoin (DOGE)
- **Wallet**: DMCkF7oGTcnMZF5LwxNuTEbMsb2niXpjZW
- **Worker**: L7-001
- **Fee**: 1%

## Profitability Estimates

### Daily Production (@ 6711 MH/s)
- **DOGE**: ~90 DOGE/day (varies with network difficulty)
- **EUR**: ~€7.20/day (@ €0.08/DOGE)
- **Monthly**: ~2700 DOGE (~€216)

### Pool Comparison
| Pool | Fee | Est. Daily | Notes |
|------|-----|------------|-------|
| Unmineable | 1% | 89.1 DOGE | Current pool, DOGE direct |
| ViaBTC | 2% | 88.2 DOGE | Merged mining LTC+DOGE |
| Litecoinpool | 0% | 90.9 DOGE | Merged mining, manual DOGE conversion |

## Monitoring & Alerts

### Normal Operating Ranges
- **Hashrate**: 6.5 - 7.0 GH/s
- **Chip Temp**: 45-65°C
- **PCB Temp**: 40-60°C
- **Fan Speed**: 4000-6000 RPM
- **Rejection Rate**: <1%

### Warning Thresholds
- Hashrate drop >10% → Check pool connection
- Chip temp >70°C → Improve cooling
- PCB temp >65°C → Check ambient temp
- Fan speed <3000 or >7000 RPM → Check fan health
- Rejection rate >3% → Check network/pool

### Critical Thresholds
- Chip temp >80°C → Immediate shutdown risk
- Hashrate <5 GH/s → Hardware issue
- Pool dead >5 min → Switch pool
- Fan failure (0 RPM) → Emergency shutdown

## Deployment

### Files Modified
1. `mining.html` — Dashboard frontend (27 KB)
2. `server.js` — Mining API routes (+120 lines)
3. `index.html` — Added mining card to main grid

### Deployment Steps
```bash
# 1. SCP files to DGX
scp mining.html server.js index.html pifienergy@192.168.1.152:/home/pifienergy/oficina-virtual-v2/

# 2. Restart server
ssh pifienergy@192.168.1.152 "kill \$(lsof -t -i :9443); cd /home/pifienergy/oficina-virtual-v2 && nohup node server.js > /tmp/oficina-v2.log 2>&1 &"

# 3. Verify
curl -I http://192.168.1.152:9443/mining.html
```

### Git Commit
```bash
git add mining.html server.js index.html
git commit -m "Add Antminer L7 mining dashboard with real-time monitoring"
git push
```

## Future Enhancements

### Phase 2 (Potential)
- [ ] Historical data persistence (SQLite/PostgreSQL)
- [ ] Long-term hashrate trends (7d, 30d, 90d)
- [ ] Email/Telegram alerts for critical events
- [ ] Multiple miner support (farm dashboard)
- [ ] Profitability vs electricity cost analysis
- [ ] Auto pool switching based on profitability
- [ ] Hashrate predictions with ML
- [ ] Integration with Unmineable API for real-time earnings
- [ ] Mobile-responsive layout improvements
- [ ] Export data to CSV/JSON

### Phase 3 (Advanced)
- [ ] Smart contract integration for automated DOGE → EUR swaps
- [ ] Mining pool ROI calculator
- [ ] Overclocking/underclocking profiles
- [ ] ASIC performance comparison (L7 vs L3++ vs KA3)
- [ ] Multi-algo support (SHA-256, Ethash, etc.)

## Troubleshooting

### Dashboard shows "--" for all values
1. Check miner is powered on and reachable: `ping 192.168.1.171`
2. Verify cgminer API is accessible: `nc -zv 192.168.1.171 4028`
3. Check server logs: `tail -f /tmp/oficina-v2.log`
4. Test API directly: `curl http://192.168.1.152:9443/api/mining/all` (after login)

### Chart not updating
1. Check browser console for errors (F12)
2. Verify UPDATE_INTERVAL is set correctly (30000ms)
3. Check if hashHistory array is populating: `console.log(hashHistory)`

### Temperatures showing 0°C
1. Miner might be cold-starting (wait 5 minutes)
2. Check cgminer stats response format: `/api/mining/stats`
3. Verify temperature field names in parseMinerData()

### Pool shows DEAD
1. Check pool URL is correct in miner config
2. Verify internet connection on miner
3. Try alternative pool
4. Check firewall rules on network

## Links
- **Dashboard**: http://192.168.1.152:9443/mining.html
- **Main Office**: http://192.168.1.152:9443/
- **Antminer Web UI**: http://192.168.1.171/
- **Unmineable Pool**: https://unmineable.com/coins/DOGE
- **GitHub Repo**: https://github.com/PF747/oficina-virtual-v2

## Credits
Built for πφe Energy Command Center  
Deployed: 2026-03-05 01:24 GMT+1  
Server: DGX Sparks @ 192.168.1.152:9443  
Agent: Claude (Anthropic) via OpenClaw
