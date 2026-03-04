# Gamma Scalping with Options

## Strategy Overview
**Type:** Volatility Trading / Delta-Neutral  
**Asset Class:** Equities, Indices, Crypto (Deribit)  
**Timeframe:** Intraday to Weekly  
**Risk Level:** Medium  

## Description
Gamma scalping profits from realized volatility exceeding implied volatility. You buy options (long gamma) and continuously delta-hedge by trading the underlying. As price moves, your long gamma generates profits from rebalancing that exceed the theta (time decay) you pay.

## Entry Conditions
1. **IV vs RV:** Implied volatility < historical realized volatility (cheap options)
2. **Position:** Buy ATM straddle (call + put at same strike) or strangle
3. **Delta Neutral:** Hedge initial delta to zero using underlying
4. **VIX Environment:** VIX near lows or IV rank < 25% (options cheap)
5. **Catalyst Expected:** Upcoming event that should increase realized vol (earnings, FOMC, etc.)

## Exit Conditions
- **Profit Target:** Net P&L (scalping gains - theta decay) reaches 1.5× theta paid
- **Time Stop:** Close 7-10 days before expiration (accelerating theta decay)
- **Vol Spike:** If IV spikes >50% → close options at profit
- **Theta Burndown:** Close if daily theta exceeds expected daily scalping revenue
- **Max Loss:** Total premium paid (defined risk)

## Risk Management
- **Position Size:** Max 3% of account in option premium
- **Rebalance Trigger:** Hedge when delta exceeds ±0.10 (10 deltas per 100 shares)
- **Hedge Cost:** Account for commission/spread on each delta hedge
- **Break-even Vol:** Calculate the vol needed to cover theta — only enter if realistic
- **DTE:** Prefer 30-60 DTE options (good gamma, manageable theta)

## Example Setup
**Asset:** SPY at $520  
**Account:** $200,000  

- **Buy:** 10× SPY $520 straddle @ $12.00 each = $12,000 total premium
- **Greeks:** Delta ≈ 0, Gamma ≈ 0.05, Theta ≈ -$80/day, Vega ≈ +$150
- **Daily Hedge Target:** Need SPY to move >$3/day to cover theta via scalping
- **Rebalance:** When delta hits ±50 → buy/sell ~50 shares of SPY
- **Break-even realized vol:** ~16% annualized (current IV: 14%)

**If SPY moves $5/day (realized vol ~20%):**
- Daily scalping profit: ~$120-150
- Daily theta cost: -$80
- Net daily P&L: +$40-70
- Over 30 days: $1,200-2,100 profit

## Pros and Cons
**Pros:** Profits from movement in either direction, defined max risk (premium paid), profits from volatility itself not direction, systematic and mathematical, hedging reduces stress  
**Cons:** Theta decay is constant drag, requires frequent monitoring and rebalancing, transaction costs add up, needs realized vol > implied vol, complex strategy requiring options knowledge

## Best Market Conditions
- Low IV environments (cheap options) with expected volatility increase
- Pre-earnings, pre-FOMC, pre-major events
- When IV rank < 25% and historical vol suggests IV is underpriced
- Avoid: High IV (expensive options), low-volatility regimes, high transaction cost environments

## Python Pseudocode
```python
import numpy as np
from scipy.stats import norm

def black_scholes_greeks(S, K, T, r, sigma, option_type='call'):
    """Calculate option greeks for hedging"""
    d1 = (np.log(S/K) + (r + sigma**2/2)*T) / (sigma*np.sqrt(T))
    d2 = d1 - sigma*np.sqrt(T)
    
    if option_type == 'call':
        delta = norm.cdf(d1)
    else:
        delta = norm.cdf(d1) - 1
    
    gamma = norm.pdf(d1) / (S * sigma * np.sqrt(T))
    theta = -(S * norm.pdf(d1) * sigma) / (2 * np.sqrt(T))
    vega = S * norm.pdf(d1) * np.sqrt(T)
    
    return {'delta': delta, 'gamma': gamma, 'theta': theta/365, 'vega': vega/100}

class GammaScalper:
    def __init__(self, num_straddles, strike, premium_per_straddle):
        self.contracts = num_straddles
        self.strike = strike
        self.total_premium = num_straddles * premium_per_straddle * 100
        self.hedge_shares = 0
        self.scalping_pnl = 0
        self.hedge_threshold = 10 * num_straddles  # 10 deltas per contract
        
    def check_rebalance(self, current_price, portfolio_delta):
        """Check if delta hedge needed"""
        if abs(portfolio_delta) > self.hedge_threshold:
            shares_to_trade = -int(portfolio_delta)
            return shares_to_trade
        return 0
    
    def execute_hedge(self, shares, price):
        """Execute delta hedge and track P&L"""
        cost = shares * price
        self.hedge_shares += shares
        # P&L from hedging is captured when price reverts
        return {'action': 'BUY' if shares > 0 else 'SELL',
                'shares': abs(shares), 'price': price}
    
    def daily_pnl(self, realized_vol, implied_vol, spot, gamma, theta):
        """Estimate daily P&L from gamma scalping"""
        # Scalping P&L ≈ 0.5 × Gamma × (RealizedMove)^2
        expected_move = spot * realized_vol / np.sqrt(252)
        scalping_rev = 0.5 * gamma * expected_move**2 * 100 * self.contracts
        theta_cost = abs(theta) * 100 * self.contracts
        net = scalping_rev - theta_cost
        return {'scalping': scalping_rev, 'theta': -theta_cost, 'net': net}
```
