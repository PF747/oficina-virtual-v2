# Liquidation Hunting Strategy

## Strategy Overview
**Type:** Microstructure / Predatory  
**Asset Class:** Crypto (leveraged perpetual markets)  
**Timeframe:** Intraday (5m-1H)  
**Risk Level:** High  

## Description
In leveraged crypto markets, clusters of stop losses and liquidation prices create predictable "magnet zones." Large players intentionally push price into these zones to trigger cascading liquidations, creating sharp moves. This strategy identifies liquidation clusters and positions to profit from the resulting cascade.

## Entry Conditions
1. **Liquidation Heatmap:** Identify price levels with >$50M in estimated liquidations (using Coinglass, Hyblock, Kingfisher)
2. **Price Approaching:** Price within 2% of a major liquidation cluster
3. **Open Interest:** Rising OI confirms leveraged positions building
4. **Funding Rate:** Extreme positive (longs overleveraged) or negative (shorts overleveraged)
5. **Volume Momentum:** Increasing volume pushing price toward the liquidation zone

### Long Setup (Short Squeeze)
- Large short liquidation cluster above current price
- Funding rate extremely negative (shorts paying longs)
- Price grinding up toward the cluster

### Short Setup (Long Liquidation Cascade)
- Large long liquidation cluster below current price  
- Funding rate extremely positive (longs overleveraged)
- Price dropping toward the cluster

## Exit Conditions
- **Target:** Center of the liquidation cluster (where cascade is strongest)
- **Extended Target:** Beyond the cluster by 1-2% (momentum continuation)
- **Quick Exit:** Take profit within minutes of cascade starting (moves are fast)
- **Stop Loss:** 1% on the wrong side if price reverses before reaching cluster
- **Time Stop:** Exit if cluster isn't hit within 4 hours

## Risk Management
- **Risk Per Trade:** 1-2% of account (these are high-conviction but binary)
- **Position Size:** Small — these trades have tight stops
- **Leverage:** Max 3-5× (don't become the liquidation target yourself)
- **Timing:** Enter just before the cascade, not during (slippage is extreme during cascades)
- **One Direction:** Don't try to fade the cascade — ride it

## Example Setup
**Asset:** BTC-PERP  
**Current Price:** $86,000  
**Liquidation Cluster:** ~$50M in short liquidations between $87,500-$88,000  
**Funding Rate:** -0.05% (shorts paying heavily = overcrowded)  

- **Entry:** Long at $86,200 (price pushing toward cluster)
- **Stop:** $85,200 ($1,000 risk, ~1.2%)
- **Target 1:** $87,800 (center of liquidation zone) = +$1,600 (1.85%)
- **Target 2:** $89,000 (beyond cluster, momentum) = +$2,800 (3.25%)
- **R:R:** 1:1.6 to 1:2.8

When price hits $87,500: cascade triggers → $50M in forced buys → price spikes to $88,500+ in minutes.

## Pros and Cons
**Pros:** Highly predictable cascade mechanics, excellent R:R when timing is right, liquidation data is publicly available, fast trades (minutes), works in both directions  
**Cons:** Timing is everything (early = stopped out), data tools can be expensive/inaccurate, market makers also hunt liquidations (competition), extreme slippage during cascades, ethically questionable, requires real-time monitoring

## Best Market Conditions
- High leverage environments (crypto perpetuals with 50-125× leverage)
- When open interest is at extremes
- After extended one-directional moves (overcrowded trades)
- Avoid: low-OI environments, stable/ranging markets, when no clear clusters exist

## Python Pseudocode
```python
def find_liquidation_zones(open_interest_data, current_price, exchange='binance'):
    """Identify major liquidation clusters from OI distribution"""
    zones = []
    
    for level in open_interest_data:
        # Estimate liquidation prices based on leverage distribution
        if level['oi_usd'] > 50_000_000:  # $50M+ clusters
            distance_pct = abs(level['price'] - current_price) / current_price * 100
            if distance_pct < 5:  # Within 5% of current price
                zones.append({
                    'price': level['price'],
                    'oi_usd': level['oi_usd'],
                    'side': 'SHORT_LIQ' if level['price'] > current_price else 'LONG_LIQ',
                    'distance_pct': distance_pct
                })
    
    return sorted(zones, key=lambda z: z['oi_usd'], reverse=True)

def liquidation_signal(zones, funding_rate, price_momentum):
    """Generate signal based on liquidation zones and market conditions"""
    if not zones:
        return None
    
    best_zone = zones[0]
    
    # Short squeeze setup
    if (best_zone['side'] == 'SHORT_LIQ' and 
        funding_rate < -0.03 and  # Shorts overcrowded
        price_momentum > 0):     # Price pushing up
        return {
            'signal': 'LONG',
            'target': best_zone['price'],
            'cluster_size': best_zone['oi_usd'],
            'reason': 'short_squeeze_cascade'
        }
    
    # Long liquidation cascade
    if (best_zone['side'] == 'LONG_LIQ' and
        funding_rate > 0.03 and   # Longs overcrowded
        price_momentum < 0):      # Price pushing down
        return {
            'signal': 'SHORT',
            'target': best_zone['price'],
            'cluster_size': best_zone['oi_usd'],
            'reason': 'long_liquidation_cascade'
        }
    
    return None
```
