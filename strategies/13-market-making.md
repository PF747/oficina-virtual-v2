# Market Making / Spread Capture

## Strategy Overview
**Type:** Market Making / High Frequency  
**Asset Class:** Crypto (DEX/CEX), Forex, Futures  
**Timeframe:** Sub-second to minutes  
**Risk Level:** Medium-High  

## Description
Market making involves continuously placing limit orders on both sides of the order book, profiting from the bid-ask spread. The market maker provides liquidity and earns the spread as compensation. Modern market making requires fast execution, inventory management, and dynamic spread adjustment.

## Entry Conditions
1. **Spread Width:** Current spread > minimum profitable threshold (>2× fees)
2. **Volatility Check:** Realized volatility within acceptable range (not spiking)
3. **Inventory Neutral:** Current inventory position near zero
4. **Order Book Depth:** Sufficient liquidity on both sides (not one-sided)
5. **Place Orders:** Simultaneous limit buy (below mid) and limit sell (above mid)

## Exit Conditions
- **Profit Target:** Captured spread on both legs of a round trip
- **Inventory Limit:** Flatten position if inventory exceeds max threshold
- **Volatility Spike:** Pull all orders if volatility jumps >3× normal
- **Adverse Selection:** Cancel stale quotes if price moves >1 spread width
- **EOD:** Flatten all inventory before session close

## Risk Management
- **Inventory Risk:** Max inventory = 5% of allocated capital per side
- **Spread Adjustment:** Widen quotes proportional to inventory (Avellaneda-Stoikov model)
- **Quote Refresh:** Update quotes every 100ms-1s based on mid-price movement
- **Max Loss Per Day:** 0.5% of allocated capital → auto-shutdown
- **Fee Optimization:** Only profitable if spread > 2× maker+taker fees

## Example Setup
**Asset:** BTC/USDT on Binance  
**Mid Price:** $85,000  
**Typical Spread:** $10 (0.012%)  
**Maker Fee:** 0.02% ($17 per $85K)

- **Bid:** $84,995 (limit buy)
- **Ask:** $85,005 (limit sell)
- **Gross Spread:** $10
- **Net Spread (after fees):** $10 - $17 × 2 = -$24 ❌ (too tight!)
- **Need spread > $34** → Adjust to more volatile pairs or smaller exchanges
- **Alternative:** SOL/USDT with 0.05% spread = $75 on $150K → $75 - $60 fees = $15 ✅

## Pros and Cons
**Pros:** Consistent small profits, market-neutral (ideally), works in all market conditions, scalable with capital, earns maker rebates on some exchanges  
**Cons:** Adverse selection risk (getting picked off), requires low latency, inventory risk in trending markets, razor-thin margins, sophisticated infrastructure needed

## Best Market Conditions
- Moderate volatility (enough spread but not too jumpy)
- High-volume instruments with predictable microstructure
- When spreads are wide (post-volatility, less liquid hours)
- Avoid: flash crashes, major news events, extremely low spreads

## Python Pseudocode
```python
import numpy as np

def avellaneda_stoikov(mid_price, volatility, inventory, gamma=0.1, T=1.0, t=0.0):
    """Avellaneda-Stoikov optimal market making model"""
    # Reservation price (adjusted for inventory risk)
    reservation = mid_price - inventory * gamma * volatility**2 * (T - t)
    
    # Optimal spread
    optimal_spread = gamma * volatility**2 * (T - t) + (2/gamma) * np.log(1 + gamma/0.5)
    
    bid = reservation - optimal_spread / 2
    ask = reservation + optimal_spread / 2
    
    return round(bid, 2), round(ask, 2), round(optimal_spread, 2)

class MarketMaker:
    def __init__(self, capital, max_inventory_pct=0.05, max_daily_loss_pct=0.005):
        self.capital = capital
        self.max_inventory = capital * max_inventory_pct
        self.max_daily_loss = capital * max_daily_loss_pct
        self.inventory = 0
        self.pnl = 0
        
    def should_quote(self, volatility, spread, fees):
        """Check if quoting is profitable"""
        if self.pnl < -self.max_daily_loss:
            return False  # Daily loss limit hit
        if spread < 2 * fees:
            return False  # Can't cover fees
        if volatility > self.vol_threshold * 3:
            return False  # Too volatile
        return True
    
    def update_quotes(self, mid_price, volatility):
        """Calculate and place optimal quotes"""
        bid, ask, spread = avellaneda_stoikov(
            mid_price, volatility, self.inventory
        )
        # Widen spread if inventory is large
        inventory_skew = abs(self.inventory) / self.max_inventory
        spread_multiplier = 1 + inventory_skew * 2
        
        adjusted_bid = mid_price - (mid_price - bid) * spread_multiplier
        adjusted_ask = mid_price + (ask - mid_price) * spread_multiplier
        
        return adjusted_bid, adjusted_ask
```
