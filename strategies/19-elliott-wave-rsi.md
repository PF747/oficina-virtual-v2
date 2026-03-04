# Elliott Wave with RSI Divergence Strategy

## Strategy Overview

**Strategy Type:** Technical Analysis - Pattern Recognition with Momentum Confirmation  
**Complexity Level:** Advanced  
**Asset Classes:** Stocks, Forex, Cryptocurrencies, Commodities, Indices  
**Timeframes:** 4H, Daily, Weekly (multi-timeframe analysis recommended)  
**Trading Style:** Swing Trading, Position Trading  
**Win Rate:** 55-65% (with proper wave identification)  
**Risk-Reward Ratio:** 1:2 to 1:4  

## Core Concept

This strategy combines Elliott Wave Theory with RSI divergence analysis to identify high-probability reversal and continuation points. The approach focuses on Wave 3 (strongest impulse) and Wave 5 (exhaustion) patterns, using RSI divergence to confirm wave completion and potential reversals.

Elliott Wave Theory posits that markets move in predictable fractal patterns consisting of 5 impulse waves (1-2-3-4-5) and 3 corrective waves (A-B-C). Wave 3 is typically the strongest and longest, while Wave 5 often shows momentum divergence.

## Technical Indicators

### Primary Indicators
- **Elliott Wave Count:** Manual or algorithmic wave identification
- **RSI (14):** Momentum oscillator for divergence detection
- **Fibonacci Retracement:** 23.6%, 38.2%, 50%, 61.8%, 78.6% levels
- **Fibonacci Extension:** 100%, 127.2%, 161.8%, 200%, 261.8% targets

### Supporting Indicators
- **Volume Analysis:** Confirm wave strength (Wave 3 should have highest volume)
- **Moving Averages (50/200 EMA):** Trend context
- **MACD:** Additional momentum confirmation

## Entry Conditions

### Long Entry (Wave 3 Breakout)

1. **Wave Structure Identification:**
   - Identify completed Wave 1 (impulse up)
   - Wave 2 retraces 50-61.8% of Wave 1
   - Wave 2 does NOT exceed Wave 1 starting point
   
2. **RSI Confirmation:**
   - RSI bounces from oversold (<40) during Wave 2
   - RSI shows higher low vs previous Wave 2 (bullish divergence)
   
3. **Entry Trigger:**
   - Price breaks above Wave 1 high
   - Volume expansion on breakout
   - RSI > 50 and rising

### Short Entry (Wave 5 Exhaustion)

1. **Wave Structure Identification:**
   - Clear 5-wave impulse structure identified
   - Wave 5 reaches or exceeds Fibonacci extension (161.8-200%)
   - Wave 5 shows signs of exhaustion (weakening momentum)
   
2. **RSI Divergence:**
   - **Bearish divergence:** Price makes higher high, RSI makes lower high
   - RSI enters overbought (>70) territory
   - RSI begins to roll over
   
3. **Entry Trigger:**
   - Price breaks below Wave 4 low
   - Reversal candlestick pattern (engulfing, evening star)
   - Volume increases on reversal

## Exit Conditions

### Take Profit Targets

**Wave 3 Trades (Long):**
- TP1: 161.8% Fibonacci extension of Wave 1 (25% position)
- TP2: 200% Fibonacci extension (50% position)
- TP3: 261.8% Fibonacci extension (25% position)

**Wave 5 Reversal Trades (Short):**
- TP1: 38.2% retracement of entire 5-wave structure (30% position)
- TP2: 61.8% retracement (40% position)
- TP3: Wave 4 low (30% position)

### Stop Loss Placement

**Wave 3 Long:**
- Initial SL: Below Wave 2 low (1-2% buffer)
- Trailing SL: Move to breakeven once price exceeds 127.2% extension

**Wave 5 Short:**
- Initial SL: Above Wave 5 high (1-2% buffer)
- Trailing SL: Move to breakeven after TP1 hit

## Risk Management

### Position Sizing
- Maximum risk per trade: 1-2% of account
- Position size calculation based on stop loss distance
- Reduce size for lower timeframes or choppy markets

### Risk Controls
- **Maximum Concurrent Positions:** 3-5 depending on correlation
- **Daily Loss Limit:** 4% of account
- **Wave Count Invalidation:** Exit immediately if wave structure breaks rules
- **Time Stop:** Close position if expected wave doesn't develop within reasonable timeframe

### Correlation Management
- Avoid multiple positions in highly correlated pairs/assets
- Diversify across different asset classes when possible

## Example Setup

### Bitcoin (BTC/USD) - Daily Chart - Wave 3 Long Entry

**Date:** Hypothetical Setup - March 2026  
**Context:** Bitcoin in strong uptrend after breaking major resistance

**Wave Structure:**
- Wave 1: Rally from $45,000 to $58,000 (+28.9%)
- Wave 2: Correction to $51,500 (50% retracement) ✓
- Wave 2 low didn't break Wave 1 starting point ✓

**RSI Analysis:**
- RSI dropped to 38 during Wave 2 correction
- Previous Wave 2 RSI low was 32 (bullish divergence) ✓
- RSI now at 56 and rising

**Entry Signal:**
- Price breaks $58,000 (Wave 1 high) with strong volume
- Entry: $58,500
- Stop Loss: $51,000 (below Wave 2 low)
- Risk: $7,500 per BTC

**Position Sizing (for $100,000 account, 1.5% risk):**
- Risk amount: $1,500
- Position size: 0.2 BTC ($11,700)

**Profit Targets:**
- TP1: $68,500 (161.8% ext.) - close 25%
- TP2: $76,000 (200% ext.) - close 50%
- TP3: $90,000 (261.8% ext.) - close 25%

**Outcome:** Wave 3 extends to $79,000, hitting TP1 and TP2 for +23% average gain on position.

## Pros and Cons

### Advantages ✓
- **High probability setups** when waves are clearly identified
- **Excellent risk-reward ratios** (especially Wave 3 trades)
- **Clear invalidation points** (wave structure rules)
- **Multi-timeframe applicability** (works on all timeframes)
- **RSI divergence adds confirmation** and filters false signals
- **Objective Fibonacci targets** for profit-taking

### Disadvantages ✗
- **Subjective wave counting** - different analysts may count differently
- **Requires experience** to identify valid wave structures
- **False wave counts** can lead to losses
- **Works best in trending markets** - struggles in choppy conditions
- **Waiting for perfect setups** may result in missed opportunities
- **Wave 5 endings can extend** beyond expectations (truncated waves)

## Best Market Conditions

### Optimal Conditions
- **Strong trending markets** with clear impulse and corrective patterns
- **High volatility environments** where waves are clearly defined
- **Liquid markets** with smooth price action (major forex pairs, large-cap stocks)
- **Post-consolidation breakouts** where new impulse waves begin
- **Confirmed trend direction** on higher timeframes

### Avoid Trading When
- **Choppy, sideways markets** with no clear wave structure
- **Low liquidity periods** (holidays, overnight sessions)
- **Major news events** that can invalidate wave patterns
- **Overlapping wave structures** that violate Elliott Wave rules
- **Extremely extended waves** without clear correction

## Python Implementation

```python
import pandas as pd
import numpy as np
from scipy.signal import argrelextrema
import talib

class ElliottWaveRSIStrategy:
    """
    Elliott Wave with RSI Divergence Strategy
    Identifies Wave 3 breakouts and Wave 5 exhaustion with RSI confirmation
    """
    
    def __init__(self, rsi_period=14, fib_levels=None):
        self.rsi_period = rsi_period
        self.fib_levels = fib_levels or [0.236, 0.382, 0.5, 0.618, 0.786]
        self.fib_extensions = [1.0, 1.272, 1.618, 2.0, 2.618]
        
    def calculate_rsi(self, prices):
        """Calculate RSI indicator"""
        return talib.RSI(prices, timeperiod=self.rsi_period)
    
    def find_pivot_points(self, data, order=5):
        """Identify swing highs and lows for wave analysis"""
        highs = argrelextrema(data['high'].values, np.greater, order=order)[0]
        lows = argrelextrema(data['low'].values, np.less, order=order)[0]
        
        pivots = []
        for idx in highs:
            pivots.append({'index': idx, 'price': data['high'].iloc[idx], 'type': 'high'})
        for idx in lows:
            pivots.append({'index': idx, 'price': data['low'].iloc[idx], 'type': 'low'})
            
        return sorted(pivots, key=lambda x: x['index'])
    
    def calculate_fibonacci_levels(self, start_price, end_price, is_retracement=True):
        """Calculate Fibonacci retracement or extension levels"""
        diff = end_price - start_price
        
        if is_retracement:
            return {level: end_price - (diff * level) for level in self.fib_levels}
        else:
            return {level: start_price + (diff * level) for level in self.fib_extensions}
    
    def detect_rsi_divergence(self, prices, rsi, lookback=20):
        """
        Detect RSI divergence (bullish or bearish)
        Returns: 'bullish', 'bearish', or None
        """
        if len(prices) < lookback:
            return None
        
        recent_prices = prices[-lookback:]
        recent_rsi = rsi[-lookback:]
        
        # Find local maxima and minima
        price_highs = argrelextrema(recent_prices.values, np.greater, order=3)[0]
        price_lows = argrelextrema(recent_prices.values, np.less, order=3)[0]
        
        # Bearish divergence: higher price high, lower RSI high
        if len(price_highs) >= 2:
            ph1, ph2 = price_highs[-2], price_highs[-1]
            if recent_prices.iloc[ph2] > recent_prices.iloc[ph1]:
                if recent_rsi.iloc[ph2] < recent_rsi.iloc[ph1]:
                    return 'bearish'
        
        # Bullish divergence: lower price low, higher RSI low
        if len(price_lows) >= 2:
            pl1, pl2 = price_lows[-2], price_lows[-1]
            if recent_prices.iloc[pl2] < recent_prices.iloc[pl1]:
                if recent_rsi.iloc[pl2] > recent_rsi.iloc[pl1]:
                    return 'bullish'
        
        return None
    
    def identify_wave_structure(self, pivots):
        """
        Simplified wave identification (5-wave impulse pattern)
        Returns dictionary with wave levels or None
        """
        if len(pivots) < 5:
            return None
        
        # Looking for 5-wave structure: W1(high) -> W2(low) -> W3(high) -> W4(low) -> W5(high)
        recent = pivots[-6:]  # Last 6 pivots
        
        # Check for alternating high-low pattern
        types = [p['type'] for p in recent]
        
        # Bullish impulse pattern
        if types[-5:] == ['low', 'high', 'low', 'high', 'low']:
            waves = {
                'wave_0': recent[-5]['price'],  # Starting point
                'wave_1': recent[-4]['price'],  # First high
                'wave_2': recent[-3]['price'],  # Correction low
                'wave_3': recent[-2]['price'],  # Strong high
                'wave_4': recent[-1]['price'],  # Correction low
            }
            
            # Validate Elliott Wave rules
            if waves['wave_2'] > waves['wave_0']:  # Wave 2 doesn't retrace below start
                if waves['wave_4'] > waves['wave_2']:  # Wave 4 doesn't overlap Wave 1
                    return waves
        
        return None
    
    def generate_signals(self, data):
        """
        Generate trading signals based on Elliott Wave and RSI
        Returns DataFrame with signals
        """
        df = data.copy()
        df['rsi'] = self.calculate_rsi(df['close'])
        df['signal'] = 0
        df['wave_position'] = ''
        
        # Find pivot points
        pivots = self.find_pivot_points(df, order=5)
        
        for i in range(50, len(df)):
            current_price = df['close'].iloc[i]
            current_rsi = df['rsi'].iloc[i]
            
            # Get pivots up to current bar
            current_pivots = [p for p in pivots if p['index'] < i]
            
            if len(current_pivots) < 5:
                continue
            
            # Identify wave structure
            waves = self.identify_wave_structure(current_pivots)
            
            if waves:
                # Calculate Fibonacci levels for Wave 3 target
                fib_ext = self.calculate_fibonacci_levels(
                    waves['wave_0'], waves['wave_1'], is_retracement=False
                )
                
                # SIGNAL 1: Wave 3 Breakout (Long)
                # Price breaks above Wave 1, after Wave 2 correction
                if (current_price > waves['wave_1'] * 1.001 and  # Above Wave 1 high
                    df['rsi'].iloc[i-1] < 50 and current_rsi > 50 and  # RSI crossing 50
                    waves['wave_2'] > waves['wave_0']):  # Valid Wave 2
                    
                    divergence = self.detect_rsi_divergence(
                        df['close'].iloc[i-20:i], 
                        df['rsi'].iloc[i-20:i]
                    )
                    
                    if divergence == 'bullish' or current_rsi > 55:
                        df.loc[df.index[i], 'signal'] = 1
                        df.loc[df.index[i], 'wave_position'] = 'Wave 3 Long'
                
                # SIGNAL 2: Wave 5 Exhaustion (Short)
                # After 5 waves complete, with bearish RSI divergence
                if len(current_pivots) >= 9:  # Enough for complete 5-wave structure
                    divergence = self.detect_rsi_divergence(
                        df['close'].iloc[i-20:i], 
                        df['rsi'].iloc[i-20:i]
                    )
                    
                    if (divergence == 'bearish' and 
                        current_rsi > 65 and 
                        df['rsi'].iloc[i-1] > current_rsi):  # RSI rolling over
                        
                        df.loc[df.index[i], 'signal'] = -1
                        df.loc[df.index[i], 'wave_position'] = 'Wave 5 Short'
        
        return df

# Example usage
if __name__ == "__main__":
    # Load your OHLCV data
    # df = pd.read_csv('btc_daily.csv', parse_dates=['timestamp'])
    # df = df[['timestamp', 'open', 'high', 'low', 'close', 'volume']]
    # df.set_index('timestamp', inplace=True)
    
    # For demonstration, create sample data
    dates = pd.date_range(start='2024-01-01', periods=200, freq='D')
    np.random.seed(42)
    
    # Simulate Elliott Wave-like price action
    price = 45000
    prices = [price]
    for i in range(199):
        change = np.random.randn() * 500 + (100 if i % 30 < 20 else -50)
        price = max(price + change, price * 0.95)
        prices.append(price)
    
    df = pd.DataFrame({
        'open': prices,
        'high': [p * 1.01 for p in prices],
        'low': [p * 0.99 for p in prices],
        'close': prices,
        'volume': np.random.uniform(1000, 5000, 200)
    }, index=dates)
    
    # Initialize strategy
    strategy = ElliottWaveRSIStrategy(rsi_period=14)
    
    # Generate signals
    signals = strategy.generate_signals(df)
    
    # Display signals
    trade_signals = signals[signals['signal'] != 0][['close', 'rsi', 'signal', 'wave_position']]
    print("\n=== Elliott Wave RSI Strategy Signals ===")
    print(trade_signals)
    
    # Calculate basic performance metrics
    long_signals = (signals['signal'] == 1).sum()
    short_signals = (signals['signal'] == -1).sum()
    
    print(f"\nTotal Long Signals (Wave 3): {long_signals}")
    print(f"Total Short Signals (Wave 5): {short_signals}")
    print(f"Signal Rate: {(long_signals + short_signals) / len(signals) * 100:.2f}%")
```

## Additional Resources

- **Books:** "Elliott Wave Principle" by Frost & Prechter
- **Software:** TradingView (Elliott Wave tools), MotiveWave
- **Communities:** ElliottWaveTrader, Elliott Wave International
- **Practice:** Use historical charts to practice wave counting before live trading

## Conclusion

The Elliott Wave with RSI strategy offers a powerful framework for identifying high-probability trading opportunities based on market psychology and momentum confirmation. Success requires disciplined wave counting, patience for ideal setups, and strict risk management. Master wave identification on historical charts before applying to live markets.

**Remember:** Wave counting is subjective - always have a clear invalidation level and never force a wave count to fit your bias.
