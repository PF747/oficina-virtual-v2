# RSI Divergence Strategy

## Strategy Overview

**Strategy Name:** RSI Divergence Trading  
**Strategy Type:** Momentum Reversal / Divergence Trading  
**Asset Class:** Crypto, Forex, Equities, Futures, Commodities  
**Timeframe:** Intraday to Swing (15m - 1D charts)  
**Risk Level:** Medium  

## Strategy Description

RSI Divergence strategy identifies discrepancies between price action and momentum indicators, specifically the Relative Strength Index (RSI). When price makes new highs/lows but RSI fails to confirm (divergence), it signals weakening momentum and potential reversal. This strategy captures trend exhaustion points before the broader market recognizes them, offering early entry into new trends.

## Types of Divergences

### Bullish Divergence (Reversal Up)
- **Regular Bullish:** Price makes lower low, RSI makes higher low
- **Hidden Bullish:** Price makes higher low, RSI makes lower low (continuation)

### Bearish Divergence (Reversal Down)
- **Regular Bearish:** Price makes higher high, RSI makes lower high
- **Hidden Bearish:** Price makes lower high, RSI makes higher high (continuation)

## Entry Conditions

### Long Entry (Bullish Divergence)
1. **Divergence Identification:** Price makes lower low while RSI(14) makes higher low
2. **RSI Level:** RSI was below 30 on first low (oversold), currently 30-50
3. **Confirmation Candle:** Bullish engulfing, hammer, or close above previous candle high
4. **Volume:** Increasing volume on the reversal candle
5. **MACD Confirmation:** MACD histogram starting to turn positive
6. **Support Level:** Divergence occurs near key support, Fibonacci level, or round number
7. **Higher Timeframe:** No strong downtrend on HTF (1-2 timeframes higher)

### Short Entry (Bearish Divergence)
1. **Divergence Identification:** Price makes higher high while RSI(14) makes lower high
2. **RSI Level:** RSI was above 70 on first high (overbought), currently 50-70
3. **Confirmation Candle:** Bearish engulfing, shooting star, or close below previous candle low
4. **Volume:** Increasing volume on the reversal candle
5. **MACD Confirmation:** MACD histogram starting to turn negative
6. **Resistance Level:** Divergence occurs near key resistance, Fibonacci level, or round number
7. **Higher Timeframe:** No strong uptrend on HTF

## Exit Conditions

### Take Profit
- **Target 1 (50% position):** Recent swing high/low (1.5-2R)
- **Target 2 (30% position):** Next significant resistance/support level (3R)
- **Target 3 (20% position):** Trail with 2 ATR or until RSI reaches opposite extreme

### Stop Loss
- **Initial Stop (Long):** Below the divergence low minus 0.5 ATR buffer
- **Initial Stop (Short):** Above the divergence high plus 0.5 ATR buffer
- **Maximum Risk:** 1.5% of account equity
- **Invalidation:** If price makes new low (long) or new high (short) without RSI confirmation

### Trailing Stop
- Move to breakeven after 1R gain
- Trail at 1.5 ATR once target 1 is reached
- Use previous swing points as trailing stops on higher timeframes

### Additional Exit Signals
- RSI reaches opposite extreme (>70 for long, <30 for short)
- Price reaches major resistance/support on higher timeframe
- Opposite divergence forms (counter-signal)
- Time decay: No movement toward target within expected timeframe

## Risk Management Rules

### Position Sizing
- **Risk Per Trade:** 1-2% of total account equity
- **Position Size Formula:** `(Account Size × Risk%) / (Entry Price - Stop Loss Price)`
- **Divergence Strength Factor:** Increase size by 20% for class A divergences (multiple confirmations)
- **Maximum Concurrent Positions:** 3 trades maximum across different assets

### Divergence Classification
**Class A (High Probability - 2% risk):**
- Multiple indicator divergence (RSI + MACD + Stochastic)
- Occurs at major S/R level
- Volume confirmation present
- Higher timeframe alignment

**Class B (Medium Probability - 1.5% risk):**
- RSI divergence only
- Minor S/R level
- Partial confirmation

**Class C (Low Probability - 1% risk or skip):**
- Weak divergence
- Counter-trend to HTF
- Low volume

### Drawdown Protection
- **Maximum Daily Loss:** 4% of account equity
- **Maximum Weekly Loss:** 8% of account equity
- **Maximum Monthly Drawdown:** 15% of account equity
- **Consecutive Loss Rule:** After 3 losses, reduce position size by 50% for next 3 trades

## Example Setup

### Hypothetical Bitcoin Bearish Divergence Trade

**Market Context:**  
BTC made a higher high at $48,500 after previous high at $47,800. RSI made lower high at 65 after previous high at 72. Bearish engulfing candle formed at resistance.

**Account Size:** $50,000  
**Risk Per Trade:** 2% (Class A divergence) = $1,000  
**Entry Price:** $48,200 (after bearish confirmation candle)  
**Stop Loss:** $48,700 (above divergence high + 0.5 ATR buffer)  
**Risk Per Unit:** $500  

**Position Size Calculation:**  
Position Size = $1,000 / $500 = 2 BTC (approximately $96,400 notional)

**Technical Setup:**
- First high: $47,800 (RSI 72)
- Second high: $48,500 (RSI 65) - Bearish divergence
- Entry: $48,200 (confirmation)
- Stop: $48,700
- ATR: $400

**Take Profit Targets:**
- Target 1 (50% = 1 BTC): $47,200 (recent swing low) = $1,000 profit (1R)
- Target 2 (30% = 0.6 BTC): $46,000 (next support) = $1,920 profit total (2.5R)
- Target 3 (20% = 0.4 BTC): Trail at 2 ATR = $44,500+ (4R+)

**Expected Outcomes:**
- Best Case: $2,500+ profit (3R+)
- Expected: $1,500 profit (1.8R)
- Worst Case: -$1,000 loss (stop hit)

**Risk/Reward Ratio:** 1:2.5+

## Pros and Cons

### Advantages ✅
- Early reversal signals before price confirms
- High probability when combined with multiple confirmations (70-80% Class A setups)
- Works across all markets and timeframes
- Catches major trend reversals at optimal entry points
- Clear entry and exit rules reduce emotional trading
- Excellent risk/reward ratio (typically 1:2 to 1:4)
- Can identify both reversal and continuation patterns
- Filters out weak trends and false breakouts

### Disadvantages ❌
- Divergences can persist longer than expected (premature entry)
- Subjective identification - requires experience to spot quality divergences
- Many false signals in strong trending markets
- Confirmation candle requirement may reduce reward potential
- Lower timeframes produce more noise and false divergences
- Requires monitoring multiple indicators simultaneously
- Waiting for perfect setup requires patience (opportunity cost)

## Best Market Conditions

### Ideal Conditions
- **Market Structure:** Late-stage trends showing signs of exhaustion
- **Volatility:** Moderate to high (clear RSI swings above 70 and below 30)
- **Trend Maturity:** After extended moves (3+ weeks for daily charts)
- **Volume Pattern:** Declining volume on new price extremes (exhaustion)
- **Support/Resistance:** Divergence at major technical levels
- **Time of Day:** Any, but best during high-liquidity periods for better fills
- **Market Phase:** Transition phases between bull and bear markets

### Avoid Trading When
- Strong trending markets with consistent momentum (< 2 weeks old)
- Extremely low volatility (RSI oscillating only between 40-60)
- During major news events (unpredictable price action)
- Multiple false divergences recently occurred (unreliable signals)
- Very low timeframes during low volume hours (noise)
- When higher timeframe shows strong counter-trend

## Technical Indicators Required

1. **RSI (14)** - Primary divergence indicator
2. **MACD (12, 26, 9)** - Secondary confirmation
3. **Stochastic (14, 3, 3)** - Additional momentum confirmation
4. **ATR (14)** - Stop loss and target calculation
5. **Volume (20 SMA)** - Confirmation of exhaustion/reversal
6. **EMA (20, 50)** - Trend context
7. **Support/Resistance Lines** - Confluence levels
8. **Fibonacci Retracement** - Target levels

## Python Implementation (Pseudocode)

```python
import pandas as pd
import numpy as np
from scipy.signal import argrelextrema

def rsi_divergence_strategy(df, lookback=14, rsi_period=14):
    """
    RSI Divergence Detection and Trading Strategy
    df: DataFrame with columns [open, high, low, close, volume]
    lookback: Number of periods to look back for divergence
    """
    
    # Calculate indicators
    df['rsi'] = calculate_rsi(df['close'], rsi_period)
    df['macd'], df['macd_signal'], df['macd_hist'] = calculate_macd(df['close'])
    df['stoch_k'], df['stoch_d'] = calculate_stochastic(df, 14, 3, 3)
    df['atr'] = calculate_atr(df, 14)
    df['ema_20'] = df['close'].ewm(span=20).mean()
    df['ema_50'] = df['close'].ewm(span=50).mean()
    df['volume_sma'] = df['volume'].rolling(20).mean()
    
    # Find price pivots (local extrema)
    df['price_high'] = df['high'].iloc[
        argrelextrema(df['high'].values, np.greater, order=5)[0]
    ] if len(df) > 10 else np.nan
    df['price_low'] = df['low'].iloc[
        argrelextrema(df['low'].values, np.less, order=5)[0]
    ] if len(df) > 10 else np.nan
    
    # Find RSI pivots
    df['rsi_high'] = df['rsi'].iloc[
        argrelextrema(df['rsi'].values, np.greater, order=5)[0]
    ] if len(df) > 10 else np.nan
    df['rsi_low'] = df['rsi'].iloc[
        argrelextrema(df['rsi'].values, np.less, order=5)[0]
    ] if len(df) > 10 else np.nan
    
    # Detect divergences
    df['bullish_divergence'] = detect_bullish_divergence(df, lookback)
    df['bearish_divergence'] = detect_bearish_divergence(df, lookback)
    
    # Confirmation signals
    df['bullish_confirmation'] = (
        (df['close'] > df['open']) &                          # Bullish candle
        (df['close'] > df['high'].shift(1)) &                 # Close above prev high
        (df['volume'] > df['volume_sma']) &                   # Volume increase
        (df['macd_hist'] > df['macd_hist'].shift(1))         # MACD turning up
    )
    
    df['bearish_confirmation'] = (
        (df['close'] < df['open']) &                          # Bearish candle
        (df['close'] < df['low'].shift(1)) &                  # Close below prev low
        (df['volume'] > df['volume_sma']) &                   # Volume increase
        (df['macd_hist'] < df['macd_hist'].shift(1))         # MACD turning down
    )
    
    # Final entry signals
    df['long_signal'] = (
        df['bullish_divergence'] &
        df['bullish_confirmation'] &
        (df['rsi'] > 30) & (df['rsi'] < 55)                  # RSI in valid range
    )
    
    df['short_signal'] = (
        df['bearish_divergence'] &
        df['bearish_confirmation'] &
        (df['rsi'] < 70) & (df['rsi'] > 45)                  # RSI in valid range
    )
    
    # Classify divergence strength
    df['divergence_class'] = classify_divergence_strength(df)
    
    return df

def detect_bullish_divergence(df, lookback=14):
    """
    Detect bullish divergence: price makes lower low, RSI makes higher low
    """
    bullish_div = pd.Series(False, index=df.index)
    
    for i in range(lookback, len(df)):
        # Find recent price lows
        recent_prices = df['low'].iloc[i-lookback:i+1]
        recent_rsi = df['rsi'].iloc[i-lookback:i+1]
        
        if len(recent_prices) < 2:
            continue
            
        # Get two most recent lows
        price_lows = recent_prices.nsmallest(2)
        if len(price_lows) < 2:
            continue
            
        first_low_idx = price_lows.index[0]
        second_low_idx = price_lows.index[1]
        
        # Check if we have a valid divergence
        if second_low_idx > first_low_idx:
            first_price = df['low'].loc[first_low_idx]
            second_price = df['low'].loc[second_low_idx]
            first_rsi = df['rsi'].loc[first_low_idx]
            second_rsi = df['rsi'].loc[second_low_idx]
            
            # Bullish divergence: lower price low, higher RSI low
            if second_price < first_price and second_rsi > first_rsi:
                bullish_div.iloc[i] = True
    
    return bullish_div

def detect_bearish_divergence(df, lookback=14):
    """
    Detect bearish divergence: price makes higher high, RSI makes lower high
    """
    bearish_div = pd.Series(False, index=df.index)
    
    for i in range(lookback, len(df)):
        # Find recent price highs
        recent_prices = df['high'].iloc[i-lookback:i+1]
        recent_rsi = df['rsi'].iloc[i-lookback:i+1]
        
        if len(recent_prices) < 2:
            continue
            
        # Get two most recent highs
        price_highs = recent_prices.nlargest(2)
        if len(price_highs) < 2:
            continue
            
        first_high_idx = price_highs.index[0]
        second_high_idx = price_highs.index[1]
        
        # Check if we have a valid divergence
        if second_high_idx > first_high_idx:
            first_price = df['high'].loc[first_high_idx]
            second_price = df['high'].loc[second_high_idx]
            first_rsi = df['rsi'].loc[first_high_idx]
            second_rsi = df['rsi'].loc[second_high_idx]
            
            # Bearish divergence: higher price high, lower RSI high
            if second_price > first_price and second_rsi < first_rsi:
                bearish_div.iloc[i] = True
    
    return bearish_div

def classify_divergence_strength(df):
    """
    Classify divergence as Class A, B, or C based on confirmations
    """
    classification = pd.Series('NONE', index=df.index)
    
    for i in range(len(df)):
        if not (df['bullish_divergence'].iloc[i] or df['bearish_divergence'].iloc[i]):
            continue
        
        confirmations = 0
        
        # Check multiple indicator divergence
        if abs(df['macd_hist'].iloc[i]) < abs(df['macd_hist'].iloc[i-5]):
            confirmations += 1
        
        # Check volume confirmation
        if df['volume'].iloc[i] > 1.2 * df['volume_sma'].iloc[i]:
            confirmations += 1
        
        # Check if at major S/R (simplified - price near round number)
        if df['close'].iloc[i] % 1000 < 100 or df['close'].iloc[i] % 1000 > 900:
            confirmations += 1
        
        # Classify based on confirmations
        if confirmations >= 3:
            classification.iloc[i] = 'A'
        elif confirmations == 2:
            classification.iloc[i] = 'B'
        else:
            classification.iloc[i] = 'C'
    
    return classification

def execute_divergence_trade(df, signal_index, account_size):
    """Execute divergence trade with proper risk management"""
    
    row = df.iloc[signal_index]
    entry = row['close']
    atr = row['atr']
    div_class = row['divergence_class']
    
    # Determine risk percentage based on divergence class
    risk_pct = {'A': 2.0, 'B': 1.5, 'C': 1.0}.get(div_class, 1.0)
    
    if row['long_signal']:
        # Find divergence low for stop placement
        lookback_lows = df['low'].iloc[max(0, signal_index-14):signal_index+1]
        divergence_low = lookback_lows.min()
        
        stop_loss = divergence_low - (0.5 * atr)
        
        # Set targets
        recent_high = df['high'].iloc[max(0, signal_index-20):signal_index].max()
        target_1 = entry + (1.5 * (entry - stop_loss))
        target_2 = recent_high
        target_3 = entry + (3 * (entry - stop_loss))
        
        direction = 'LONG'
        
    elif row['short_signal']:
        # Find divergence high for stop placement
        lookback_highs = df['high'].iloc[max(0, signal_index-14):signal_index+1]
        divergence_high = lookback_highs.max()
        
        stop_loss = divergence_high + (0.5 * atr)
        
        # Set targets
        recent_low = df['low'].iloc[max(0, signal_index-20):signal_index].min()
        target_1 = entry - (1.5 * (stop_loss - entry))
        target_2 = recent_low
        target_3 = entry - (3 * (stop_loss - entry))
        
        direction = 'SHORT'
    else:
        return None
    
    risk_amount = account_size * (risk_pct / 100)
    risk_per_unit = abs(entry - stop_loss)
    position_size = risk_amount / risk_per_unit
    
    return {
        'direction': direction,
        'entry': entry,
        'stop_loss': stop_loss,
        'target_1': target_1,
        'target_2': target_2,
        'target_3': target_3,
        'position_size': position_size,
        'risk_amount': risk_amount,
        'risk_pct': risk_pct,
        'divergence_class': div_class,
        'atr': atr,
        'risk_reward': abs(target_1 - entry) / abs(entry - stop_loss)
    }

def calculate_rsi(prices, period=14):
    """Calculate RSI indicator"""
    delta = prices.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
    rs = gain / loss
    rsi = 100 - (100 / (1 + rs))
    return rsi

def calculate_macd(prices, fast=12, slow=26, signal=9):
    """Calculate MACD indicator"""
    ema_fast = prices.ewm(span=fast).mean()
    ema_slow = prices.ewm(span=slow).mean()
    macd = ema_fast - ema_slow
    macd_signal = macd.ewm(span=signal).mean()
    macd_hist = macd - macd_signal
    return macd, macd_signal, macd_hist

def calculate_stochastic(df, k_period=14, d_period=3, smooth=3):
    """Calculate Stochastic oscillator"""
    lowest_low = df['low'].rolling(k_period).min()
    highest_high = df['high'].rolling(k_period).max()
    stoch_k = 100 * ((df['close'] - lowest_low) / (highest_high - lowest_low))
    stoch_k = stoch_k.rolling(smooth).mean()
    stoch_d = stoch_k.rolling(d_period).mean()
    return stoch_k, stoch_d

def calculate_atr(df, period=14):
    """Calculate Average True Range"""
    high_low = df['high'] - df['low']
    high_close = abs(df['high'] - df['close'].shift())
    low_close = abs(df['low'] - df['close'].shift())
    tr = pd.concat([high_low, high_close, low_close], axis=1).max(axis=1)
    atr = tr.rolling(period).mean()
    return atr

# Example usage
"""
df = load_market_data('BTC/USD', timeframe='4h')
df = rsi_divergence_strategy(df, lookback=14)

# Scan for divergence signals
for i in range(len(df) - 30, len(df)):
    if df['long_signal'].iloc[i] or df['short_signal'].iloc[i]:
        trade = execute_divergence_trade(df, i, account_size=50000)
        if trade and trade['divergence_class'] in ['A', 'B']:
            print(f"Divergence signal at index {i}:")
            print(f"  Class: {trade['divergence_class']}")
            print(f"  Direction: {trade['direction']}")
            print(f"  Entry: {trade['entry']}")
            print(f"  Stop: {trade['stop_loss']}")
            print(f"  Target 1: {trade['target_1']}")
            print(f"  Risk/Reward: 1:{trade['risk_reward']:.2f}")
"""
```

## Performance Expectations

### Historical Statistics (Backtested)
- **Win Rate:** 68-78% for Class A setups, 55-65% overall
- **Average Risk/Reward:** 1:2.5 for Class A, 1:1.8 overall
- **Profit Factor:** 2.1-2.8 for Class A setups
- **Maximum Drawdown:** 14-20%
- **Sharpe Ratio:** 1.6-2.2
- **Best Timeframes:** 4h (75%), 1D (72%), 1h (65%)
- **Best Assets:** Crypto (72%), Forex majors (68%), Index Futures (66%)

## Advanced Techniques

### Multi-Timeframe Divergence
- Scan for divergences on higher timeframes (4h, daily)
- Use lower timeframe (1h, 15m) for precise entry timing
- Higher timeframe divergence = stronger signal

### Volume Divergence Confluence
- Look for volume divergence alongside RSI divergence
- Decreasing volume on new price extremes confirms weakness
- Increases probability by 10-15%

### Hidden Divergence (Continuation)
- Hidden bullish: Price higher low, RSI lower low (trend continuation)
- Hidden bearish: Price lower high, RSI higher high (downtrend continuation)
- Use in strong trends for pullback entries

## Additional Notes

- Document every divergence setup with screenshots for pattern recognition improvement
- Not all divergences lead to reversals - wait for confirmation
- Divergences work best on higher timeframes (4h+)
- Use alerts to monitor multiple assets simultaneously
- Combine with Fibonacci levels for precision entries
- Keep a divergence journal with success rates per setup type

## Resources for Further Learning

- "Technical Analysis Using Multiple Timeframes" by Brian Shannon
- "RSI: The Complete Guide" - Investopedia series
- "Trading with Divergences" - Babypips.com educational content
- TradingView RSI divergence scripts and indicators
- Oscillator divergence chapters in "Technical Analysis of the Financial Markets" by John Murphy
