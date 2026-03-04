# Pairs Trading / Statistical Arbitrage Strategy

## Strategy Overview

**Strategy Name:** Pairs Trading / Statistical Arbitrage  
**Strategy Type:** Market Neutral / Mean Reversion  
**Asset Class:** Stocks (same sector), Crypto (BTC/ETH, alt pairs), Forex, Commodities  
**Timeframe:** Intraday to multi-week holds (1H to daily charts)  
**Skill Level:** Advanced  

## Core Concept

Pairs trading exploits the statistical relationship between two correlated assets. When the price ratio (spread) deviates significantly from its historical mean, the strategy shorts the outperforming asset and longs the underperforming one, betting on mean reversion. The trade is market-neutral, profiting from relative performance rather than market direction.

## Key Components

### 1. Pair Selection
- **Cointegration:** Statistical property where two price series maintain a stable long-term relationship
- **Correlation:** High correlation (>0.7) but correlation alone is insufficient (need cointegration)
- **Fundamental link:** Same industry, similar business models (e.g., Coca-Cola/Pepsi, BTC/ETH)

### 2. Spread Calculation
- **Price Ratio:** Spread = Price_A / Price_B
- **Log Spread:** Spread = log(Price_A) - log(Price_B) (preferred for statistical properties)
- **Beta-adjusted:** Spread = Price_A - β × Price_B (where β = hedge ratio from regression)

### 3. Z-Score Analysis
- **Z-Score:** (Current_Spread - Mean_Spread) / Std_Dev_Spread
- **Entry threshold:** |Z-Score| > 2.0 (spread is 2 standard deviations from mean)
- **Exit threshold:** Z-Score returns to 0 (spread reverts to mean)

### 4. Cointegration Testing
- **Augmented Dickey-Fuller (ADF) test:** Tests if spread is stationary
- **p-value < 0.05:** Indicates cointegration (spread will revert)
- **Rolling window:** Re-test every 30-60 days to ensure relationship holds

## Entry Conditions

### Long Asset A / Short Asset B
1. **Z-Score < -2.0:** Asset A underperforming relative to Asset B
2. **Spread at multi-week low:** Visual confirmation of extremes
3. **Cointegration confirmed:** ADF p-value < 0.05 in last 90 days
4. **No fundamental divergence:** No major news causing permanent shift
5. **Liquidity check:** Both assets tradable with tight spreads

### Short Asset A / Long Asset B
1. **Z-Score > +2.0:** Asset A outperforming relative to Asset B
2. **Spread at multi-week high:** Near upper Bollinger Band of spread
3. **Cointegration confirmed:** Stable historical relationship
4. **Sector correlation intact:** No structural market changes
5. **Risk-off conditions absent:** Low VIX, stable market environment

## Exit Conditions

### Profit Targets
- **Primary exit:** Z-Score returns to 0 (spread mean reversion)
- **Aggressive exit:** Z-Score crosses 0 (spread overshoots, reverses signal)
- **Conservative exit:** Z-Score reaches ±0.5 (80% of move captured)

### Stop Loss
- **Z-Score worsens to ±3.0:** Spread diverges further (relationship broken)
- **Time-based stop:** Exit after 30 days regardless (avoid permanent divergence)
- **Cointegration breakdown:** ADF test p-value > 0.1 (relationship decaying)

### Partial Exits
- Scale out 50% at Z-Score = 0
- Close remaining 50% at Z-Score = +0.5 (if entered at -2.0) or vice versa

## Risk Management

- **Position Size:** Risk 1-2% of capital per pair trade
- **Dollar-neutral:** Equal dollar amounts in each leg (not equal shares)
- **Beta-hedged:** Use regression beta to determine hedge ratio
- **Portfolio limit:** Max 5 pair trades simultaneously (avoid over-concentration)
- **Correlation monitoring:** Check pair correlation weekly; exit if drops below 0.5
- **Margin requirement:** Ensure sufficient margin for both legs (2x position value)

## Example Trade Setup

**Market:** Technology Sector Stocks  
**Pair:** MSFT (Microsoft) / AAPL (Apple)  
**Lookback Period:** 90 days  
**Date:** Mid-market consolidation

### Statistical Analysis
- **Correlation (90 days):** 0.82 (strong)
- **Cointegration (ADF test):** p-value = 0.018 (cointegrated ✓)
- **Mean Spread (log ratio):** 0.145
- **Spread Std Dev:** 0.033
- **Current Spread:** 0.079
- **Z-Score:** (0.079 - 0.145) / 0.033 = **-2.0**

### Interpretation
- MSFT is underperforming AAPL by 2 standard deviations
- Historical mean reversion suggests spread will widen (MSFT outperforms AAPL)
- **Trade:** Long MSFT, Short AAPL

### Position Sizing
- **Account Size:** $100,000
- **Risk per trade:** 1.5% = $1,500
- **Hedge Ratio (β):** 1.15 (from regression: MSFT = α + 1.15 × AAPL)
- **Capital allocation:** $50,000 per side (50% of account)

### Execution
- **Long MSFT:** Buy $50,000 / $380 per share = 131 shares
- **Short AAPL:** Sell $50,000 / $175 per share = 285 shares (β-adjusted)
- **Entry Date:** Day 0
- **Stop Loss:** Z-Score reaches -3.0 (spread at 0.046)
- **Target:** Z-Score returns to 0 (spread at 0.145)

### Outcome (15 Days Later)
- **MSFT Price:** $380 → $395 (+3.95%)
- **AAPL Price:** $175 → $178 (+1.71%)
- **Spread:** 0.079 → 0.133 (moved closer to mean)
- **New Z-Score:** -0.36

**P&L Calculation:**
- Long MSFT: 131 shares × $15 gain = +$1,965
- Short AAPL: 285 shares × $3 loss = -$855
- **Net Profit:** $1,110 (1.11% return in 15 days, ~27% annualized)

### Exit Decision
- Z-Score at -0.36 (close to mean)
- Close 50% of position (lock in ~$555)
- Trail stop on remaining 50% to Z-Score = +0.5 or time stop at 30 days

## Pros

- **Market-neutral:** Profits regardless of overall market direction
- **Lower volatility:** Less correlated with broad market moves
- **Statistical edge:** Exploits quantifiable mean reversion patterns
- **Diversification:** Multiple uncorrelated pair trades reduce portfolio risk
- **Hedged risk:** Long and short positions offset systemic risk

## Cons

- **Complex execution:** Requires simultaneous entry/exit of two positions
- **Cointegration breakdown:** Relationships can change permanently (tech disruption, M&A)
- **Margin requirements:** Shorting requires margin, increases costs
- **Opportunity cost:** Capital locked in market-neutral trades (lower returns than directional bets)
- **Execution risk:** Slippage and timing differences between legs

## Best Market Conditions

- **Low-to-medium volatility:** VIX 15-25 (spreads behave predictably)
- **Sector rotation:** Money shifting between similar assets in same sector
- **Stable correlations:** No major structural market changes
- **High liquidity:** Tight spreads, easy to enter/exit both legs
- **Range-bound markets:** Mean reversion works best without strong trends

## Python/Pseudocode Implementation

```python
import pandas as pd
import numpy as np
from statsmodels.tsa.stattools import adfuller, coint
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt

class PairsTradingStrategy:
    def __init__(self, lookback_period=90, entry_z_score=2.0, exit_z_score=0.5):
        self.lookback_period = lookback_period
        self.entry_z_score = entry_z_score
        self.exit_z_score = exit_z_score
        self.position = None  # None, 'long_A_short_B', 'short_A_long_B'
        
    def test_cointegration(self, series_a, series_b):
        """Test if two price series are cointegrated"""
        score, p_value, _ = coint(series_a, series_b)
        return p_value < 0.05, p_value
    
    def calculate_hedge_ratio(self, series_a, series_b):
        """Calculate beta (hedge ratio) using linear regression"""
        X = series_b.values.reshape(-1, 1)
        y = series_a.values
        model = LinearRegression()
        model.fit(X, y)
        return model.coef_[0]
    
    def calculate_spread(self, series_a, series_b, hedge_ratio=None):
        """Calculate the spread between two price series"""
        if hedge_ratio is None:
            # Simple log spread
            spread = np.log(series_a) - np.log(series_b)
        else:
            # Beta-adjusted spread
            spread = series_a - hedge_ratio * series_b
        return spread
    
    def calculate_z_score(self, spread):
        """Calculate z-score of current spread"""
        mean = spread.mean()
        std = spread.std()
        z_score = (spread.iloc[-1] - mean) / std
        return z_score, mean, std
    
    def generate_signals(self, prices_a, prices_b):
        """Generate trading signals based on spread z-score"""
        # Use lookback period
        price_a_window = prices_a.tail(self.lookback_period)
        price_b_window = prices_b.tail(self.lookback_period)
        
        # Test cointegration
        is_cointegrated, p_value = self.test_cointegration(price_a_window, price_b_window)
        
        if not is_cointegrated:
            return 'no_trade', {'reason': 'not_cointegrated', 'p_value': p_value}
        
        # Calculate hedge ratio and spread
        hedge_ratio = self.calculate_hedge_ratio(price_a_window, price_b_window)
        spread = self.calculate_spread(price_a_window, price_b_window, hedge_ratio)
        z_score, mean_spread, std_spread = self.calculate_z_score(spread)
        
        signal = 'hold'
        
        # Entry signals
        if self.position is None:
            if z_score < -self.entry_z_score:
                signal = 'long_A_short_B'  # A is underperforming, will revert up
                self.position = 'long_A_short_B'
            elif z_score > self.entry_z_score:
                signal = 'short_A_long_B'  # A is outperforming, will revert down
                self.position = 'short_A_long_B'
        
        # Exit signals
        elif self.position == 'long_A_short_B':
            if z_score >= -self.exit_z_score or z_score >= self.entry_z_score:
                signal = 'close_long_A_short_B'
                self.position = None
        
        elif self.position == 'short_A_long_B':
            if z_score <= self.exit_z_score or z_score <= -self.entry_z_score:
                signal = 'close_short_A_long_B'
                self.position = None
        
        return signal, {
            'z_score': z_score,
            'spread': spread.iloc[-1],
            'mean_spread': mean_spread,
            'std_spread': std_spread,
            'hedge_ratio': hedge_ratio,
            'cointegration_p_value': p_value
        }
    
    def backtest(self, prices_a, prices_b, initial_capital=100000):
        """Backtest pairs trading strategy"""
        results = []
        capital = initial_capital
        position_a = 0
        position_b = 0
        entry_price_a = 0
        entry_price_b = 0
        trades = []
        
        for i in range(self.lookback_period, len(prices_a)):
            current_prices_a = prices_a.iloc[:i+1]
            current_prices_b = prices_b.iloc[:i+1]
            
            signal, metrics = self.generate_signals(current_prices_a, current_prices_b)
            
            current_price_a = prices_a.iloc[i]
            current_price_b = prices_b.iloc[i]
            
            if signal == 'long_A_short_B' and position_a == 0:
                # Enter long A, short B
                position_size = capital * 0.5  # Use 50% capital per leg
                position_a = position_size / current_price_a
                position_b = -(position_size * metrics['hedge_ratio']) / current_price_b
                entry_price_a = current_price_a
                entry_price_b = current_price_b
                print(f"Entry: Long {position_a:.2f} shares A @ ${current_price_a:.2f}, Short {abs(position_b):.2f} shares B @ ${current_price_b:.2f}")
            
            elif signal == 'short_A_long_B' and position_a == 0:
                # Enter short A, long B
                position_size = capital * 0.5
                position_a = -position_size / current_price_a
                position_b = (position_size * metrics['hedge_ratio']) / current_price_b
                entry_price_a = current_price_a
                entry_price_b = current_price_b
                print(f"Entry: Short {abs(position_a):.2f} shares A @ ${current_price_a:.2f}, Long {position_b:.2f} shares B @ ${current_price_b:.2f}")
            
            elif 'close' in signal and position_a != 0:
                # Close position
                pnl_a = position_a * (current_price_a - entry_price_a)
                pnl_b = position_b * (current_price_b - entry_price_b)
                total_pnl = pnl_a + pnl_b
                capital += total_pnl
                
                trades.append({
                    'entry_date': prices_a.index[i - self.lookback_period],
                    'exit_date': prices_a.index[i],
                    'pnl': total_pnl,
                    'return_pct': (total_pnl / initial_capital) * 100
                })
                
                print(f"Exit: P&L = ${total_pnl:.2f} (A: ${pnl_a:.2f}, B: ${pnl_b:.2f})")
                position_a = 0
                position_b = 0
            
            results.append({
                'date': prices_a.index[i],
                'price_a': current_price_a,
                'price_b': current_price_b,
                'signal': signal,
                'z_score': metrics.get('z_score', np.nan),
                'capital': capital
            })
        
        results_df = pd.DataFrame(results)
        
        # Calculate performance metrics
        total_return = (capital - initial_capital) / initial_capital * 100
        num_trades = len(trades)
        win_rate = len([t for t in trades if t['pnl'] > 0]) / num_trades * 100 if num_trades > 0 else 0
        
        return results_df, {
            'total_return': total_return,
            'final_capital': capital,
            'num_trades': num_trades,
            'win_rate': win_rate,
            'trades': trades
        }

# Example Usage
if __name__ == "__main__":
    # Generate synthetic cointegrated price series
    np.random.seed(42)
    dates = pd.date_range('2023-01-01', periods=200, freq='D')
    
    # Create cointegrated series
    drift = np.random.randn(200).cumsum() * 0.5
    prices_a = 100 + drift + np.random.randn(200) * 2
    prices_b = 50 + 0.5 * drift + np.random.randn(200) * 1  # Cointegrated with A
    
    prices_a = pd.Series(prices_a, index=dates, name='Asset_A')
    prices_b = pd.Series(prices_b, index=dates, name='Asset_B')
    
    # Initialize and run strategy
    strategy = PairsTradingStrategy(lookback_period=60, entry_z_score=2.0, exit_z_score=0.5)
    results_df, performance = strategy.backtest(prices_a, prices_b, initial_capital=100000)
    
    print("\n=== PAIRS TRADING BACKTEST RESULTS ===")
    print(f"Total Return: {performance['total_return']:.2f}%")
    print(f"Final Capital: ${performance['final_capital']:.2f}")
    print(f"Number of Trades: {performance['num_trades']}")
    print(f"Win Rate: {performance['win_rate']:.2f}%")
    
    # Plot spread and z-score
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
    
    ax1.plot(results_df['date'], results_df['z_score'])
    ax1.axhline(y=2.0, color='r', linestyle='--', label='Entry threshold')
    ax1.axhline(y=-2.0, color='r', linestyle='--')
    ax1.axhline(y=0, color='black', linestyle='-', linewidth=0.5)
    ax1.set_title('Spread Z-Score')
    ax1.legend()
    
    ax2.plot(results_df['date'], results_df['capital'])
    ax2.set_title('Capital Curve')
    ax2.set_ylabel('Capital ($)')
    
    plt.tight_layout()
    plt.savefig('pairs_trading_backtest.png')
    print("\nChart saved as 'pairs_trading_backtest.png'")
```

## Advanced Techniques

### Multi-Pair Portfolio
- Trade 5-10 pairs simultaneously for diversification
- Sector-based pairs: Tech, Finance, Energy
- Cross-asset pairs: Gold/Silver, BTC/ETH, Crude/Brent

### Dynamic Thresholds
- Adjust entry z-score based on volatility regime (higher threshold in high VIX)
- Use Bollinger Bands on spread instead of fixed z-score

### Machine Learning Enhancement
- Train ML models to predict spread reversion probability
- Feature engineering: correlation, volume ratios, sector momentum

## Conclusion

Pairs trading offers a market-neutral approach to profit from relative value dislocations. Success requires rigorous statistical testing, disciplined execution, and continuous monitoring of pair relationships. Best suited for quantitative traders with programming skills and access to quality data.
