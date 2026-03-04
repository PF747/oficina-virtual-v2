# Carry Trade / Funding Rate Arbitrage

## Strategy Overview
**Type:** Arbitrage / Income  
**Asset Class:** Crypto (Perpetual Futures)  
**Timeframe:** Medium-term (days to weeks)  
**Risk Level:** Low-Medium  

## Description
Crypto perpetual futures use funding rates to keep prices aligned with spot. When funding is positive, longs pay shorts (and vice versa). This strategy captures funding payments by holding a delta-neutral position: long spot + short perpetual. You earn the funding rate with minimal directional risk.

## Entry Conditions
1. **Funding Rate:** Annualized funding rate > 15% (worth the effort and capital lockup)
2. **Funding Consistency:** Rate has been positive for >3 days (not a one-off spike)
3. **Basis:** Perp premium over spot > 0.05% (confirms bullish sentiment funding the carry)
4. **Position:** Simultaneously buy spot BTC and short equal $ amount of BTC-PERP
5. **Exchange Risk:** Use reputable exchange (Binance, OKX, Deribit) with insurance fund

## Exit Conditions
- **Funding Reversal:** Close when funding turns negative for 2+ consecutive periods
- **Basis Collapse:** Close if perp trades at discount to spot (backwardation)
- **Profit Target:** After collecting 30+ days of funding
- **Exchange Risk:** Close if exchange shows signs of distress
- **Opportunity Cost:** Close if better yield available elsewhere

## Risk Management
- **Delta Neutral:** Long spot = Short perp (equal notional, net zero exposure)
- **Position Size:** Max 20% of portfolio in carry trades
- **Exchange Split:** Split across 2+ exchanges if possible
- **Margin Buffer:** Keep 3× the maintenance margin on perp position
- **Liquidation Distance:** Ensure liquidation price is >40% away from current price
- **Rebalance:** Adjust hedge weekly if spot/perp notional values drift >5%

## Example Setup
**Asset:** BTC  
**BTC Price:** $85,000  
**8h Funding Rate:** 0.03% (annualized ~33%)  
**Capital:** $100,000  

- **Buy:** 0.588 BTC spot ($50,000)
- **Short:** 0.588 BTC perpetual ($50,000)
- **Net Exposure:** $0 (delta neutral)
- **Funding Income:** $50,000 × 0.03% × 3/day = $45/day = ~$1,350/month
- **Annualized Return:** ~32% on $100K capital
- **Risk:** Exchange failure, funding reversal, execution slippage

## Pros and Cons
**Pros:** Market-neutral income, consistent returns in bull markets, no directional risk, annualized yields can exceed 20-40%, simple to execute and monitor  
**Cons:** Capital-intensive, exchange counterparty risk, funding can go negative, requires margin management, basis risk between spot and perp, tax complexity

## Best Market Conditions
- Bull markets with high retail long speculation (positive funding)
- When funding rates are persistently elevated (>0.02% per 8h)
- Moderate to high volume (easy execution)
- Avoid: bear markets (negative funding), low-liquidity environments, exchange FUD

## Python Pseudocode
```python
class FundingCarryTrade:
    def __init__(self, capital, min_annual_rate=0.15):
        self.capital = capital
        self.min_rate = min_annual_rate
        self.position_size = capital / 2  # Half for spot, half for margin
        self.total_funding_earned = 0
        
    def check_opportunity(self, funding_rate_8h, consecutive_positive_days):
        """Check if funding carry trade is worth entering"""
        annualized = funding_rate_8h * 3 * 365  # 3 periods/day
        
        if annualized > self.min_rate and consecutive_positive_days >= 3:
            return {
                'enter': True,
                'annualized_rate': annualized,
                'daily_income': self.position_size * funding_rate_8h * 3,
                'monthly_income': self.position_size * funding_rate_8h * 3 * 30
            }
        return {'enter': False}
    
    def open_position(self, spot_price, perp_price):
        """Open delta-neutral carry position"""
        btc_amount = self.position_size / spot_price
        return {
            'spot': {'side': 'BUY', 'amount': btc_amount, 'price': spot_price},
            'perp': {'side': 'SHORT', 'amount': btc_amount, 'price': perp_price},
            'basis': (perp_price - spot_price) / spot_price * 100
        }
    
    def collect_funding(self, funding_rate, position_value):
        """Record funding payment received"""
        payment = position_value * funding_rate
        self.total_funding_earned += payment
        return payment
    
    def check_exit(self, funding_rate_8h, basis_pct, consecutive_negative):
        """Check exit conditions"""
        if consecutive_negative >= 2:
            return 'EXIT: Funding turned negative'
        if basis_pct < -0.05:
            return 'EXIT: Backwardation detected'
        if funding_rate_8h * 3 * 365 < 0.05:
            return 'EXIT: Rate too low to justify capital'
        return 'HOLD'
    
    def performance(self, days_held):
        """Calculate carry trade performance"""
        return {
            'total_earned': self.total_funding_earned,
            'daily_avg': self.total_funding_earned / max(days_held, 1),
            'annualized_return': (self.total_funding_earned / self.capital) * (365 / max(days_held, 1)),
            'days_held': days_held
        }
```
