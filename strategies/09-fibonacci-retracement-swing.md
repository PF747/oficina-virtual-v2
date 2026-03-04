# Fibonacci Retracement Swing Trading Strategy

## Strategy Overview

**Strategy Name:** Fibonacci Retracement Swing Trading  
**Strategy Type:** Technical Analysis / Mean Reversion  
**Asset Class:** Stocks, Indices, Forex, Crypto, Commodities  
**Timeframe:** Swing trading (4H to Daily charts), hold 3-20 days  
**Skill Level:** Intermediate  

## Core Concept

Fibonacci retracement levels are horizontal lines indicating potential support/resistance areas based on Fibonacci ratios (23.6%, 38.2%, 50%, 61.8%, 78.6%). The strategy identifies strong trends, waits for pullbacks to key Fibonacci levels, then enters in the direction of the original trend, anticipating continuation. The 61.8% (Golden Ratio) and 38.2% levels are most significant.

## Key Components

### 1. Fibonacci Ratios
- **23.6%:** Shallow retracement, strong momentum
- **38.2%:** Ideal entry for strong trends, minimal risk
- **50%:** Psychological level, not Fibonacci but widely watched
- **61.8%:** Golden ratio, strongest retracement level
- **78.6%:** Deep retracement, near trend invalidation

### 2. Fibonacci Extensions (Profit Targets)
- **127.2%:** First extension, conservative target
- **161.8%:** Primary extension target
- **200%:** Aggressive target for strong trends
- **261.8%:** Extended move target

### 3. Confluence Zones
Areas where multiple technical factors align:
- Fibonacci level + previous support/resistance
- Fibonacci level + moving average (50/200 EMA)
- Fibonacci level + volume profile POC
- Multiple Fibonacci timeframes aligning

### 4. Trend Identification
- **Uptrend:** Higher highs + higher lows, price above 50/200 EMA
- **Downtrend:** Lower lows + lower highs, price below 50/200 EMA
- **Swing high/low:** Most recent extreme point for Fibonacci drawing

## Entry Conditions

### Long Entry (Uptrend Pullback)
1. **Confirmed uptrend:** Price making HH/HL pattern on daily chart
2. **Fibonacci drawn:** From swing low to recent swing high
3. **Pullback to key level:** Price retraces to 38.2%, 50%, or 61.8%
4. **Confluence confirmed:** Fib level coincides with support, EMA, or prior resistance-turned-support
5. **Reversal signal:** Bullish candlestick pattern (hammer, engulfing) or momentum divergence

**Entry Trigger:**
- Conservative: Wait for candle close above Fibonacci level
- Aggressive: Enter as price touches Fibonacci level with limit order
- Confirmation: Enter on break above short-term resistance after bounce

### Short Entry (Downtrend Pullback)
1. **Confirmed downtrend:** Price making LL/LH pattern
2. **Fibonacci drawn:** From swing high to recent swing low
3. **Retracement to key level:** Price rallies to 38.2%, 50%, or 61.8%
4. **Confluence at resistance:** Fib level aligns with previous support-turned-resistance
5. **Reversal signal:** Bearish candlestick (shooting star, dark cloud cover)

**Entry Trigger:**
- Conservative: Candle close below Fibonacci level
- Aggressive: Limit order at Fibonacci level
- Confirmation: Break below short-term support after rejection

## Exit Conditions

### Profit Targets
- **Target 1 (50%):** Previous swing high (longs) or low (shorts)
- **Target 2 (30%):** 127.2% or 161.8% Fibonacci extension
- **Target 3 (20%):** 200% or 261.8% Fibonacci extension
- **Trailing stop:** After T1 hit, move stop to breakeven on remainder

### Stop Loss Placement
- **Below/above Fibonacci level:** 10-20 pips beyond entry Fib level
- **Beyond next Fib level:** If entering at 61.8%, stop below 78.6%
- **Swing structure:** Below swing low (longs) or above swing high (shorts)
- **Percentage-based:** 2-3% from entry (adjust to volatility)

### Exit Signals
- Price breaks below 78.6% retracement (trend likely reversing)
- Opposite Fibonacci setup forms (new swing high/low created)
- Target hit with reversal pattern (e.g., shooting star at 161.8% extension)
- Time-based: Exit after 20 days if no progress (avoid dead positions)

## Risk Management

- **Position Size:** Risk 1-2% of account per trade
- **Risk/Reward:** Minimum 1:2, ideally 1:3 or better
- **Max Open Trades:** 3-5 swing positions (diversify across sectors/assets)
- **Correlation Check:** Avoid multiple trades on correlated assets (e.g., AAPL + MSFT)
- **Volatility Adjustment:** Use ATR to set stops (1.5-2x ATR from entry)

## Example Trade Setup

**Asset:** Bitcoin (BTC/USD)  
**Timeframe:** Daily Chart  
**Market Context:** Strong uptrend, +40% gain over 2 months

### Setup Phase
- **Swing Low:** $45,000 (starting point)
- **Swing High:** $65,000 (recent high before pullback)
- **Fibonacci Levels Drawn:**
  - 23.6%: $60,280
  - 38.2%: $57,360
  - 50%: $55,000
  - 61.8%: $52,640
  - 78.6%: $49,280

### Current Situation
- BTC pulled back from $65k to $53,500 (approaching 61.8% Fib)
- 50 EMA at $54,200 (confluence with 61.8% level)
- Previous resistance from $52k now acting as support
- Volume declining during pullback (healthy correction)
- RSI cooled to 45 (was overbought at 75)

### Confluence Analysis
✅ 61.8% Fibonacci level at $52,640  
✅ 50 EMA support at $54,200  
✅ Previous resistance zone $52k-53k  
✅ Volume profile POC at $53,000  
**Strong confluence zone: $52,600 - $54,200**

### Entry Plan
- **Entry:** $53,000 (limit order at 61.8% Fib)
- **Stop Loss:** $50,800 (below 78.6% Fib at $49,280, 4.2% risk)
- **Target 1:** $65,000 (previous swing high, 22.6% gain) - close 50%
- **Target 2:** $72,500 (127.2% extension) - close 30%
- **Target 3:** $77,300 (161.8% extension) - close 20%

### Risk/Reward
- Risk: $53,000 - $50,800 = $2,200 per BTC
- Reward (T1): $65,000 - $53,000 = $12,000
- **R:R Ratio:** 1:5.45 (excellent)

### Execution
- Day 1: BTC touches $53,200, entry triggered at $53,000
- Day 3: Small dip to $52,400 tests patience (stop at $50,800 safe)
- Day 7: Bounce begins, BTC rallies to $58,000
- Day 12: T1 hit at $65,000 → close 50%, move stop to $55,000 (breakeven)
- Day 18: Extension to $71,000, close another 30% near T2
- Day 22: Final 20% closed at $74,000 as momentum slows

### Final P&L (per 1 BTC)
- 50% at $65k: $6,000 profit
- 30% at $71k: $5,400 profit
- 20% at $74k: $4,200 profit
- **Total: $15,600 profit on $53k entry = 29.4% return in 22 days**

## Pros

- **High probability setups:** Fibonacci levels are self-fulfilling (widely used)
- **Clear risk/reward:** Entry, stop, and targets defined before entry
- **Works across assets:** Effective in stocks, forex, crypto, commodities
- **Confluence power:** Combining Fib with other tools increases accuracy
- **Swing trading friendly:** Few trades per month, no need for constant monitoring

## Cons

- **Subjectivity:** Choosing swing points can vary between traders
- **False breakouts:** Price can wick through Fib levels then reverse
- **Lagging:** Waits for pullbacks, can miss strong trends without retracements
- **Not effective in ranges:** Needs clear trending markets to work
- **Overfitting:** Too many Fibonacci tools (fans, arcs, circles) can confuse

## Best Market Conditions

- **Strong trends:** Clear uptrends/downtrends on higher timeframes (daily/weekly)
- **Healthy pullbacks:** Corrections on lower volume (profit-taking, not trend reversal)
- **High liquidity:** Major pairs, large-cap stocks, BTC/ETH (clean price action)
- **Post-breakout:** After consolidation breakouts, retest Fib levels for continuation
- **Avoid choppy markets:** Low ADX (<20), sideways ranges invalidate Fibonacci

## Python/Pseudocode Implementation

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

class FibonacciRetracementStrategy:
    def __init__(self, risk_per_trade=0.02, min_rr_ratio=2.0):
        self.risk_per_trade = risk_per_trade
        self.min_rr_ratio = min_rr_ratio
        self.fib_ratios = {
            '23.6%': 0.236,
            '38.2%': 0.382,
            '50%': 0.5,
            '61.8%': 0.618,
            '78.6%': 0.786
        }
        self.fib_extensions = {
            '127.2%': 1.272,
            '161.8%': 1.618,
            '200%': 2.0,
            '261.8%': 2.618
        }
    
    def identify_swing_points(self, prices, window=20):
        """Identify swing highs and lows using rolling window"""
        swing_highs = []
        swing_lows = []
        
        for i in range(window, len(prices) - window):
            # Swing high: highest point in window
            if prices[i] == max(prices[i-window:i+window]):
                swing_highs.append({'index': i, 'price': prices[i]})
            
            # Swing low: lowest point in window
            if prices[i] == min(prices[i-window:i+window]):
                swing_lows.append({'index': i, 'price': prices[i]})
        
        return swing_highs, swing_lows
    
    def calculate_fibonacci_levels(self, swing_low, swing_high, direction='long'):
        """Calculate Fibonacci retracement and extension levels"""
        price_range = swing_high - swing_low
        
        if direction == 'long':
            # For longs: retracements below swing high
            retracements = {
                level: swing_high - price_range * ratio
                for level, ratio in self.fib_ratios.items()
            }
            # Extensions above swing high
            extensions = {
                level: swing_high + price_range * (ratio - 1)
                for level, ratio in self.fib_extensions.items()
            }
        else:
            # For shorts: retracements above swing low
            retracements = {
                level: swing_low + price_range * ratio
                for level, ratio in self.fib_ratios.items()
            }
            # Extensions below swing low
            extensions = {
                level: swing_low - price_range * (ratio - 1)
                for level, ratio in self.fib_extensions.items()
            }
        
        return retracements, extensions
    
    def check_confluence(self, price, fib_level, ema_50, support_resistance, tolerance=0.02):
        """Check if Fibonacci level has confluence with other indicators"""
        confluence_score = 0
        
        # Check distance from Fib level
        if abs(price - fib_level) / fib_level < tolerance:
            confluence_score += 1
        
        # Check proximity to 50 EMA
        if abs(price - ema_50) / ema_50 < tolerance:
            confluence_score += 1
        
        # Check proximity to support/resistance
        for sr_level in support_resistance:
            if abs(price - sr_level) / sr_level < tolerance:
                confluence_score += 1
                break
        
        return confluence_score
    
    def detect_reversal_pattern(self, candles):
        """Detect bullish/bearish reversal candlestick patterns"""
        if len(candles) < 2:
            return None
        
        current = candles[-1]
        previous = candles[-2]
        
        # Bullish engulfing
        if (previous['close'] < previous['open'] and  # Previous bearish
            current['close'] > current['open'] and    # Current bullish
            current['close'] > previous['open'] and
            current['open'] < previous['close']):
            return 'bullish_engulfing'
        
        # Hammer (bullish reversal)
        body = abs(current['close'] - current['open'])
        lower_shadow = min(current['close'], current['open']) - current['low']
        upper_shadow = current['high'] - max(current['close'], current['open'])
        
        if lower_shadow > 2 * body and upper_shadow < body:
            return 'hammer'
        
        # Bearish engulfing
        if (previous['close'] > previous['open'] and  # Previous bullish
            current['close'] < current['open'] and    # Current bearish
            current['close'] < previous['open'] and
            current['open'] > previous['close']):
            return 'bearish_engulfing'
        
        # Shooting star (bearish reversal)
        if upper_shadow > 2 * body and lower_shadow < body:
            return 'shooting_star'
        
        return None
    
    def generate_signal(self, prices, ema_50, support_resistance, lookback=50):
        """Generate trading signal based on Fibonacci retracement"""
        if len(prices) < lookback:
            return None
        
        # Identify recent swing points
        swing_highs, swing_lows = self.identify_swing_points(prices, window=10)
        
        if not swing_highs or not swing_lows:
            return None
        
        # Determine trend (compare last swing high/low to previous)
        last_swing_high = swing_highs[-1]['price']
        last_swing_low = swing_lows[-1]['price']
        current_price = prices[-1]
        
        # Check for uptrend (last swing low is higher than previous)
        if len(swing_lows) >= 2 and swing_lows[-1]['price'] > swing_lows[-2]['price']:
            direction = 'long'
            retracements, extensions = self.calculate_fibonacci_levels(
                last_swing_low, last_swing_high, 'long'
            )
            
            # Check if price is near a retracement level
            for level_name, level_price in retracements.items():
                if level_name in ['38.2%', '50%', '61.8%']:  # Key levels
                    confluence = self.check_confluence(
                        current_price, level_price, ema_50[-1], support_resistance
                    )
                    
                    if confluence >= 2 and abs(current_price - level_price) / level_price < 0.01:
                        # Check for reversal pattern
                        candles = [{'open': prices[i-1], 'high': prices[i-1], 
                                   'low': prices[i-1], 'close': prices[i]}
                                  for i in range(-5, 0)]
                        pattern = self.detect_reversal_pattern(candles)
                        
                        if pattern in ['bullish_engulfing', 'hammer']:
                            # Calculate stop loss and targets
                            stop_loss = retracements['78.6%']
                            target_1 = last_swing_high
                            target_2 = extensions['161.8%']
                            
                            risk = current_price - stop_loss
                            reward = target_1 - current_price
                            rr_ratio = reward / risk if risk > 0 else 0
                            
                            if rr_ratio >= self.min_rr_ratio:
                                return {
                                    'signal': 'long',
                                    'entry': current_price,
                                    'stop_loss': stop_loss,
                                    'target_1': target_1,
                                    'target_2': target_2,
                                    'fib_level': level_name,
                                    'confluence_score': confluence,
                                    'pattern': pattern,
                                    'rr_ratio': rr_ratio
                                }
        
        # Check for downtrend
        elif len(swing_highs) >= 2 and swing_highs[-1]['price'] < swing_highs[-2]['price']:
            direction = 'short'
            retracements, extensions = self.calculate_fibonacci_levels(
                last_swing_low, last_swing_high, 'short'
            )
            
            for level_name, level_price in retracements.items():
                if level_name in ['38.2%', '50%', '61.8%']:
                    confluence = self.check_confluence(
                        current_price, level_price, ema_50[-1], support_resistance
                    )
                    
                    if confluence >= 2 and abs(current_price - level_price) / level_price < 0.01:
                        candles = [{'open': prices[i-1], 'high': prices[i-1],
                                   'low': prices[i-1], 'close': prices[i]}
                                  for i in range(-5, 0)]
                        pattern = self.detect_reversal_pattern(candles)
                        
                        if pattern in ['bearish_engulfing', 'shooting_star']:
                            stop_loss = retracements['78.6%']
                            target_1 = last_swing_low
                            target_2 = extensions['161.8%']
                            
                            risk = stop_loss - current_price
                            reward = current_price - target_1
                            rr_ratio = reward / risk if risk > 0 else 0
                            
                            if rr_ratio >= self.min_rr_ratio:
                                return {
                                    'signal': 'short',
                                    'entry': current_price,
                                    'stop_loss': stop_loss,
                                    'target_1': target_1,
                                    'target_2': target_2,
                                    'fib_level': level_name,
                                    'confluence_score': confluence,
                                    'pattern': pattern,
                                    'rr_ratio': rr_ratio
                                }
        
        return None
    
    def backtest(self, price_data, ema_50, support_resistance, initial_capital=10000):
        """Backtest Fibonacci retracement strategy"""
        capital = initial_capital
        position = None
        trades = []
        
        for i in range(50, len(price_data)):
            current_prices = price_data[:i+1]
            current_ema = ema_50[:i+1]
            
            if position is None:
                signal = self.generate_signal(
                    current_prices, current_ema, support_resistance
                )
                
                if signal:
                    position = signal
                    position['entry_date'] = i
                    print(f"Entry: {signal['signal'].upper()} @ ${signal['entry']:.2f} (Fib {signal['fib_level']})")
            
            else:
                # Check exit conditions
                current_price = price_data[i]
                
                if position['signal'] == 'long':
                    if current_price <= position['stop_loss']:
                        pnl = (current_price - position['entry']) / position['entry'] * capital
                        capital += pnl
                        trades.append({'type': 'long', 'pnl': pnl, 'reason': 'stop_loss'})
                        print(f"Exit (Stop Loss): ${current_price:.2f} | P&L: ${pnl:.2f}")
                        position = None
                    
                    elif current_price >= position['target_1']:
                        pnl = (current_price - position['entry']) / position['entry'] * capital
                        capital += pnl
                        trades.append({'type': 'long', 'pnl': pnl, 'reason': 'target'})
                        print(f"Exit (Target): ${current_price:.2f} | P&L: ${pnl:.2f}")
                        position = None
                
                elif position['signal'] == 'short':
                    if current_price >= position['stop_loss']:
                        pnl = (position['entry'] - current_price) / position['entry'] * capital
                        capital += pnl
                        trades.append({'type': 'short', 'pnl': pnl, 'reason': 'stop_loss'})
                        print(f"Exit (Stop Loss): ${current_price:.2f} | P&L: ${pnl:.2f}")
                        position = None
                    
                    elif current_price <= position['target_1']:
                        pnl = (position['entry'] - current_price) / position['entry'] * capital
                        capital += pnl
                        trades.append({'type': 'short', 'pnl': pnl, 'reason': 'target'})
                        print(f"Exit (Target): ${current_price:.2f} | P&L: ${pnl:.2f}")
                        position = None
        
        total_return = (capital - initial_capital) / initial_capital * 100
        winning_trades = [t for t in trades if t['pnl'] > 0]
        win_rate = len(winning_trades) / len(trades) * 100 if trades else 0
        
        return {
            'final_capital': capital,
            'total_return': total_return,
            'num_trades': len(trades),
            'win_rate': win_rate,
            'trades': trades
        }

# Example Usage
if __name__ == "__main__":
    # Generate sample price data
    np.random.seed(42)
    dates = pd.date_range('2024-01-01', periods=200, freq='D')
    
    # Create trending price data with pullbacks
    trend = np.linspace(100, 150, 200)
    noise = np.random.randn(200) * 5
    pullbacks = -10 * np.sin(np.linspace(0, 8*np.pi, 200))
    prices = trend + noise + pullbacks
    
    # Calculate 50 EMA
    ema_50 = pd.Series(prices).ewm(span=50).mean().values
    
    # Define support/resistance levels
    support_resistance = [110, 125, 140]
    
    # Run strategy
    strategy = FibonacciRetracementStrategy(risk_per_trade=0.02, min_rr_ratio=2.0)
    results = strategy.backtest(prices, ema_50, support_resistance)
    
    print("\n=== FIBONACCI RETRACEMENT BACKTEST ===")
    print(f"Final Capital: ${results['final_capital']:.2f}")
    print(f"Total Return: {results['total_return']:.2f}%")
    print(f"Number of Trades: {results['num_trades']}")
    print(f"Win Rate: {results['win_rate']:.2f}%")
```

## Tips for Success

1. **Wait for confluence:** Don't trade Fibonacci levels in isolation
2. **Trend is your friend:** Only trade in direction of higher timeframe trend
3. **Be patient:** Best setups come when price reaches 61.8% with multiple confirmations
4. **Use extensions:** Don't just use retracements, target Fibonacci extensions for profits
5. **Combine with volume:** Strong bounces from Fib levels should show volume increase

## Conclusion

Fibonacci retracement swing trading is a powerful strategy for catching trend continuations after healthy pullbacks. When combined with confluence, reversal patterns, and proper risk management, it offers high-probability setups with excellent risk/reward ratios. Mastery requires practice in identifying valid swing points and patience to wait for optimal entry zones.
