# DCA with Momentum Filter

## Strategy Overview
**Type:** Accumulation / Hybrid  
**Asset Class:** Crypto (BTC, ETH, blue chips)  
**Timeframe:** Weekly/Monthly (long-term)  
**Risk Level:** Low  

## Description
Standard Dollar Cost Averaging buys regardless of market conditions. This enhanced version adds a momentum filter: continue DCA during uptrends and neutral markets, but pause or reduce buys during confirmed downtrends. This avoids catching falling knives while maintaining systematic accumulation.

## Entry Conditions (Weekly Buy)
1. **Base DCA:** Fixed $ amount every Monday at market open
2. **Momentum Filter (200 SMA):** Price above 200-day SMA → full buy
3. **Neutral Zone:** Price within 10% below 200 SMA → half buy
4. **Bear Filter:** Price >10% below 200 SMA → skip (or 25% buy)
5. **RSI Boost:** If RSI(14 weekly) < 30 → double the buy amount (blood in streets)
6. **Fear & Greed:** If Crypto Fear Index < 20 → boost buy by 50%

## Exit Conditions
- **No Regular Exits:** This is an accumulation strategy
- **Rebalance:** Trim 10% if single asset exceeds 40% of portfolio
- **Profit Taking:** Optional: sell 5% of position at 3× average cost
- **Emergency Exit:** Full sell only if thesis changes (regulatory ban, protocol failure)

## Risk Management
- **Fixed Budget:** Never invest more than weekly allocation (no FOMO buys)
- **Allocation:** Max 30% of investable income into crypto DCA
- **Diversification:** Split DCA across 3-5 assets (60% BTC, 25% ETH, 15% alts)
- **Review Cycle:** Monthly review of momentum filters and allocations
- **Time Horizon:** Minimum 4-year commitment (full BTC cycle)

## Example Setup
**Monthly Budget:** $2,000 → $500/week  
**Portfolio Split:** BTC 60% ($300/wk), ETH 25% ($125/wk), SOL 15% ($75/wk)

| Week | BTC Price | vs 200 SMA | RSI | Action | BTC Buy |
|------|-----------|------------|-----|--------|---------|
| 1 | $87,000 | Above | 55 | Full buy | $300 |
| 2 | $82,000 | Above | 48 | Full buy | $300 |
| 3 | $74,000 | Below 5% | 35 | Half buy | $150 |
| 4 | $65,000 | Below 15% | 22 | RSI boost! | $600 |

Week 4: Below 200 SMA suggests skipping, BUT RSI < 30 overrides → buy double. Historically, buying extreme fear produces best long-term returns.

## Pros and Cons
**Pros:** Removes emotion from investing, momentum filter improves timing, RSI override catches bottoms, simple to automate, proven long-term strategy, lower average cost than pure DCA  
**Cons:** May miss early recovery rallies (paused during downtrend), requires patience (years), underperforms lump sum in bull markets, momentum filter adds complexity

## Best Market Conditions
- All conditions (that's the point of DCA)
- Enhanced returns during volatile/bear markets (momentum filter + RSI override)
- Best started early in a bear market or during accumulation phases

## Python Pseudocode
```python
def smart_dca(current_price, sma_200, rsi_weekly, base_amount, fear_greed_index=50):
    """Enhanced DCA with momentum and fear filters"""
    buy_amount = base_amount
    reason = 'standard'
    
    # Momentum filter
    pct_below_sma = (sma_200 - current_price) / sma_200 * 100
    
    if current_price >= sma_200:
        buy_amount = base_amount  # Full buy - above trend
        reason = 'above_sma'
    elif pct_below_sma <= 10:
        buy_amount = base_amount * 0.5  # Half buy - slightly below
        reason = 'neutral_zone'
    else:
        buy_amount = base_amount * 0.25  # Quarter buy - bear market
        reason = 'bear_reduced'
    
    # RSI override: extreme oversold = buy aggressively
    if rsi_weekly < 30:
        buy_amount = base_amount * 2.0  # Double buy on extreme fear
        reason = 'rsi_oversold_override'
    
    # Fear & Greed boost
    if fear_greed_index < 20:
        buy_amount *= 1.5
        reason += '+extreme_fear'
    
    return {
        'amount': round(buy_amount, 2),
        'units': round(buy_amount / current_price, 8),
        'reason': reason,
        'price': current_price,
        'sma_200': sma_200,
        'rsi': rsi_weekly
    }

def track_dca_performance(trades):
    """Calculate DCA metrics"""
    total_invested = sum(t['amount'] for t in trades)
    total_units = sum(t['units'] for t in trades)
    avg_cost = total_invested / total_units if total_units > 0 else 0
    current_value = total_units * trades[-1]['price']
    pnl_pct = (current_value - total_invested) / total_invested * 100
    
    return {
        'total_invested': total_invested,
        'total_units': total_units,
        'avg_cost': avg_cost,
        'current_value': current_value,
        'pnl_pct': pnl_pct
    }
```
