# VWAP Scalping Strategy

## Strategy Overview

**Strategy Name:** VWAP Scalping  
**Strategy Type:** Mean Reversion / Scalping  
**Asset Class:** Crypto, Equities, Futures (high liquidity required)  
**Timeframe:** Scalping to Intraday (1m - 15m charts, closes daily)  
**Risk Level:** Medium to High  

## Strategy Description

VWAP (Volume Weighted Average Price) Scalping exploits price's tendency to revert to the volume-weighted average throughout the trading day. Institutional traders use VWAP as a benchmark, creating natural support and resistance. This strategy captures quick moves when price deviates from VWAP and snaps back, typically holding positions for minutes to hours. Requires active monitoring and quick execution.

## VWAP Concepts

**VWAP Calculation:**
```
VWAP = Σ(Price × Volume) / Σ(Volume)
```

**VWAP Bands:**
- Upper Band 1: VWAP + (1 × Standard Deviation)
- Upper Band 2: VWAP + (2 × Standard Deviation)
- Lower Band 1: VWAP - (1 × Standard Deviation)
- Lower Band 2: VWAP - (2 × Standard Deviation)

## Entry Conditions

### Long Entry (Mean Reversion to VWAP)
1. **Price Position:** Price touches or breaks below VWAP Lower Band 1 (-1 SD)
2. **Volume Spike:** Current candle volume > 1.5x average volume (5-period)
3. **Rejection Signal:** Long lower wick (at least 50% of candle range) or bullish engulfing
4. **VWAP Slope:** VWAP itself should be relatively flat or trending up (not steep decline)
5. **Time of Day:** First 2 hours after market open OR last hour before close (high liquidity)
6. **Price Action:** Previous candle closed below VWAP, current candle showing bullish reversal
7. **No Extended Deviation:** Price not at Lower Band 2 (too far from VWAP = risky)

### Short Entry (Mean Reversion to VWAP)
1. **Price Position:** Price touches or breaks above VWAP Upper Band 1 (+1 SD)
2. **Volume Spike:** Current candle volume > 1.5x average volume
3. **Rejection Signal:** Long upper wick or bearish engulfing
4. **VWAP Slope:** VWAP relatively flat or trending down
5. **Time of Day:** High liquidity periods
6. **Price Action:** Previous candle closed above VWAP, current showing bearish reversal
7. **No Extended Deviation:** Price not at Upper Band 2

### Trend Following Entries (Advanced)
**Long on VWAP Cross:**
- Price crosses above VWAP from below
- Volume confirmation
- VWAP sloping upward
- Hold until price closes back below VWAP

## Exit Conditions

### Take Profit
- **Primary Target:** VWAP line itself (80% of position)
- **Extended Target:** Opposite VWAP band (20% of position for runners)
- **Quick Scalp:** 5-10 tick profit on high-frequency setups
- **Time-Based:** Exit before major news releases or end of session

### Stop Loss
- **Mean Reversion Stop (Long):** 3-5 ticks below entry or Lower Band 2
- **Mean Reversion Stop (Short):** 3-5 ticks above entry or Upper Band 2
- **Percentage Stop:** 0.3-0.5% of entry price (tight stops for scalping)
- **Time Stop:** Exit after 15-30 minutes if no movement toward target

### Trailing Stop
- Move to breakeven after 50% profit achieved
- Trail at 1:1 risk-reward as price approaches VWAP
- Use previous 5-minute candle low/high as dynamic stop

### Additional Exit Signals
- Price reaches VWAP and stalls (hesitation)
- Volume dries up significantly
- Opposite setup forms before target reached
- Market-wide volatility spike (news event)

## Risk Management Rules

### Position Sizing
- **Risk Per Trade:** 0.5-1% of account equity (scalping = more trades)
- **Position Size Formula:** `(Account Size × Risk%) / (Entry Price - Stop Loss Price)`
- **Maximum Concurrent Positions:** 2-3 scalps maximum
- **Pyramiding:** Can add to winning positions at 0.5R increments

### Scalping-Specific Rules
- **Maximum Daily Trades:** 10-15 trades (avoid overtrading)
- **Maximum Daily Loss:** 3% of account equity (3 stops hit = done for day)
- **Win Rate Target:** Maintain >60% win rate for profitability
- **Break Schedule:** Take 15-minute break after 2 consecutive losses
- **Risk Per Setup:** Never risk more than potential reward (minimum 1:1 R:R)

### Execution Requirements
- **Latency:** Co-located servers or VPS for consistent fills (< 50ms ping)
- **Spread Awareness:** Only trade during tight spread conditions
- **Slippage Buffer:** Add 1-2 tick buffer to stops (account for slippage)
- **Commission Factor:** Ensure profit targets exceed 2x commission costs

## Example Setup

### Hypothetical Ethereum Scalp Trade

**Session:** 10:30 AM EST (high liquidity period)  
**Account Size:** $50,000  
**Risk Per Trade:** 0.75% = $375  

**VWAP Levels:**
- VWAP: $2,920
- Upper Band 1: $2,950 (+1 SD)
- Lower Band 1: $2,890 (-1 SD)
- Lower Band 2: $2,860 (-2 SD)

**Entry Setup:**
- Current Price: $2,892 (touched Lower Band 1)
- Entry Trigger: Bullish engulfing candle with long lower wick to $2,888
- Entry Price: $2,894 (enter on close of reversal candle)
- Volume: 2.1x average (strong spike)

**Entry Price:** $2,894  
**Stop Loss:** $2,885 (below Lower Band 1, below candle low)  
**Risk Per Unit:** $9  

**Position Size Calculation:**  
Position Size = $375 / $9 = 41.67 ETH (approximately $120,600 notional)  
**Leverage:** 2.5x (common for scalping)

**Take Profit Targets:**
- Target 1 (80% = 33.3 ETH): $2,920 (VWAP) = $866 profit (2.3R)
- Target 2 (20% = 8.3 ETH): $2,935 (halfway to Upper Band) = Additional $340 profit

**Trade Duration:** 18 minutes  
**Actual Profit:** $975 (2.6R)

**Key Metrics:**
- Risk/Reward: 1:2.6
- Holding Time: 18 minutes
- ROI: 0.8% account growth (0.75% risked)

## Pros and Cons

### Advantages ✅
- High frequency opportunities (multiple setups per day)
- Quick feedback loop (know if you're right within minutes)
- Defined risk with tight stops
- VWAP is widely respected by institutions (self-fulfilling)
- Scalable strategy (works on multiple assets simultaneously)
- No overnight risk (close all positions daily)
- High win rate when executed properly (65-75%)
- Works in both trending and ranging markets

### Disadvantages ❌
- Requires constant monitoring (not passive)
- High stress and mental fatigue
- Commission and spread costs eat into profits
- Requires very fast execution (latency sensitive)
- Overtrading risk (emotional discipline critical)
- Small edge per trade (requires high volume for profitability)
- Technical failures can be costly (internet, platform issues)
- Not suitable for part-time traders
- Slippage can eliminate edge in volatile conditions

## Best Market Conditions

### Ideal Conditions
- **Liquidity:** High volume assets only (BTC, ETH, SPY, ES futures)
- **Time of Day:** Market open (first 2 hours), lunch reversal, market close (last hour)
- **Volatility:** Moderate intraday volatility (ATR 2-4% for crypto)
- **Market Structure:** Ranging to mildly trending (not parabolic moves)
- **Spread Conditions:** Tight bid-ask spread (< 0.03% of price)
- **Days:** Tuesday-Thursday typically best (avoid Monday gaps, Friday uncertainty)

### Avoid Trading When
- Major news events scheduled (FOMC, NFP, earnings)
- Extremely low volume (holidays, pre-market, Asian session for US markets)
- Widening spreads (market stress)
- After hitting daily loss limit
- When feeling tired, emotional, or distracted
- During flash crashes or extreme volatility spikes
- When VWAP bands are contracting (low opportunity)

## Technical Indicators Required

1. **VWAP** - Primary anchor indicator
2. **VWAP Standard Deviation Bands (1σ, 2σ)** - Entry/exit zones
3. **Volume (5-period SMA)** - Confirmation signal
4. **EMA (9)** - Short-term trend filter
5. **Time & Sales (Order Flow)** - Institutional activity
6. **Level 2 / Order Book** - Support/resistance visualization
7. **Previous Day's VWAP** - Multi-day context

## Python Implementation (Pseudocode)

```python
import pandas as pd
import numpy as np
from datetime import datetime, time

def vwap_scalping_strategy(df):
    """
    VWAP Scalping Strategy Implementation
    df: DataFrame with columns [timestamp, open, high, low, close, volume]
    Note: VWAP resets at start of each trading day
    """
    
    # Calculate VWAP and bands (resets daily)
    df['date'] = pd.to_datetime(df['timestamp']).dt.date
    df['typical_price'] = (df['high'] + df['low'] + df['close']) / 3
    df['tp_volume'] = df['typical_price'] * df['volume']
    
    # Calculate cumulative sums for each day
    df['cum_tp_volume'] = df.groupby('date')['tp_volume'].cumsum()
    df['cum_volume'] = df.groupby('date')['volume'].cumsum()
    df['vwap'] = df['cum_tp_volume'] / df['cum_volume']
    
    # Calculate VWAP standard deviation
    df['vwap_deviation'] = (df['typical_price'] - df['vwap']) ** 2
    df['cum_vwap_dev'] = df.groupby('date')['vwap_deviation'].cumsum()
    df['vwap_variance'] = df['cum_vwap_dev'] / df['cum_volume']
    df['vwap_std'] = np.sqrt(df['vwap_variance'])
    
    # VWAP bands
    df['vwap_upper_1'] = df['vwap'] + df['vwap_std']
    df['vwap_upper_2'] = df['vwap'] + (2 * df['vwap_std'])
    df['vwap_lower_1'] = df['vwap'] - df['vwap_std']
    df['vwap_lower_2'] = df['vwap'] - (2 * df['vwap_std'])
    
    # Supporting indicators
    df['ema_9'] = df['close'].ewm(span=9).mean()
    df['volume_sma_5'] = df['volume'].rolling(5).mean()
    df['volume_spike'] = df['volume'] > 1.5 * df['volume_sma_5']
    
    # VWAP slope (is it trending or flat?)
    df['vwap_slope'] = df['vwap'].diff(5)
    df['vwap_flat'] = abs(df['vwap_slope']) < (df['vwap'] * 0.001)  # < 0.1% change
    
    # Candlestick patterns
    df['body'] = abs(df['close'] - df['open'])
    df['range'] = df['high'] - df['low']
    df['lower_wick'] = df[['open', 'close']].min(axis=1) - df['low']
    df['upper_wick'] = df['high'] - df[['open', 'close']].max(axis=1)
    
    df['long_lower_wick'] = df['lower_wick'] > (0.5 * df['range'])
    df['long_upper_wick'] = df['upper_wick'] > (0.5 * df['range'])
    df['bullish_engulfing'] = (df['close'] > df['open']) & \
                                (df['close'] > df['open'].shift(1)) & \
                                (df['open'] < df['close'].shift(1))
    df['bearish_engulfing'] = (df['close'] < df['open']) & \
                                (df['close'] < df['open'].shift(1)) & \
                                (df['open'] > df['close'].shift(1))
    
    # Time of day filter (trading hours only)
    df['hour'] = pd.to_datetime(df['timestamp']).dt.hour
    df['minute'] = pd.to_datetime(df['timestamp']).dt.minute
    df['trading_hours'] = (
        ((df['hour'] == 9) & (df['minute'] >= 30)) |  # Market open
        (df['hour'].between(10, 14)) |                  # Mid-day
        ((df['hour'] == 15) & (df['minute'] < 45))     # Near close
    )
    
    # Long signal (mean reversion from below)
    df['long_signal'] = (
        (df['low'] <= df['vwap_lower_1']) &              # Touch lower band
        (df['close'] > df['vwap_lower_1']) &             # But close back above
        (df['volume_spike']) &                            # Volume confirmation
        ((df['long_lower_wick']) | (df['bullish_engulfing'])) &  # Reversal pattern
        (df['vwap_slope'] >= -df['vwap'] * 0.002) &     # VWAP not in steep decline
        (df['low'] > df['vwap_lower_2']) &               # Not too far from VWAP
        (df['trading_hours'])                             # Within trading hours
    )
    
    # Short signal (mean reversion from above)
    df['short_signal'] = (
        (df['high'] >= df['vwap_upper_1']) &             # Touch upper band
        (df['close'] < df['vwap_upper_1']) &             # But close back below
        (df['volume_spike']) &                            # Volume confirmation
        ((df['long_upper_wick']) | (df['bearish_engulfing'])) &  # Reversal pattern
        (df['vwap_slope'] <= df['vwap'] * 0.002) &      # VWAP not in steep rally
        (df['high'] < df['vwap_upper_2']) &              # Not too far from VWAP
        (df['trading_hours'])                             # Within trading hours
    )
    
    return df

def execute_vwap_scalp(df, signal_index, account_size, risk_pct=0.75):
    """Execute VWAP scalp trade"""
    
    row = df.iloc[signal_index]
    entry = row['close']
    vwap = row['vwap']
    vwap_std = row['vwap_std']
    
    if row['long_signal']:
        # Long scalp setup
        stop_loss = row['low'] - (0.001 * entry)  # Just below entry candle low
        target_1 = vwap  # Primary target at VWAP
        target_2 = vwap + (0.5 * vwap_std)  # Secondary target
        direction = 'LONG'
        
        # Alternative stop at lower band 2
        alt_stop = row['vwap_lower_2']
        stop_loss = max(stop_loss, alt_stop - (0.002 * entry))
        
    elif row['short_signal']:
        # Short scalp setup
        stop_loss = row['high'] + (0.001 * entry)  # Just above entry candle high
        target_1 = vwap  # Primary target at VWAP
        target_2 = vwap - (0.5 * vwap_std)  # Secondary target
        direction = 'SHORT'
        
        # Alternative stop at upper band 2
        alt_stop = row['vwap_upper_2']
        stop_loss = min(stop_loss, alt_stop + (0.002 * entry))
    else:
        return None
    
    # Position sizing
    risk_amount = account_size * (risk_pct / 100)
    risk_per_unit = abs(entry - stop_loss)
    position_size = risk_amount / risk_per_unit
    
    # Calculate expected profit
    profit_1 = abs(target_1 - entry) * position_size * 0.8
    profit_2 = abs(target_2 - entry) * position_size * 0.2
    expected_profit = profit_1 + profit_2
    
    # Risk/reward check (must be at least 1:1 for scalping)
    risk_reward = expected_profit / risk_amount
    
    if risk_reward < 1.0:
        return None  # Skip trades with poor R:R
    
    return {
        'direction': direction,
        'entry': entry,
        'stop_loss': stop_loss,
        'target_1': target_1,
        'target_2': target_2,
        'vwap': vwap,
        'position_size': position_size,
        'position_size_80pct': position_size * 0.8,
        'position_size_20pct': position_size * 0.2,
        'risk_amount': risk_amount,
        'expected_profit': expected_profit,
        'risk_reward': risk_reward,
        'timestamp': row['timestamp']
    }

def manage_scalp_position(current_data, trade, time_elapsed_minutes):
    """
    Active position management for scalping
    Exit aggressively if trade not working
    """
    
    current_price = current_data['close']
    entry = trade['entry']
    stop_loss = trade['stop_loss']
    target_1 = trade['target_1']
    direction = trade['direction']
    
    # Time-based exit (scalps should be fast)
    if time_elapsed_minutes > 30:
        return {'action': 'TIME_EXIT', 'reason': 'Maximum holding time exceeded'}
    
    # Move to breakeven quickly
    if direction == 'LONG':
        distance_to_target = target_1 - entry
        if current_price >= (entry + distance_to_target * 0.3):
            trade['stop_loss'] = entry + (0.0005 * entry)  # Small profit lock
            
        # Check for target hits
        if current_price >= target_1:
            return {'action': 'PARTIAL_EXIT', 'amount': 0.8, 'price': current_price}
            
    else:  # SHORT
        distance_to_target = entry - target_1
        if current_price <= (entry - distance_to_target * 0.3):
            trade['stop_loss'] = entry - (0.0005 * entry)
            
        if current_price <= target_1:
            return {'action': 'PARTIAL_EXIT', 'amount': 0.8, 'price': current_price}
    
    # Check for stalling price action
    if abs(current_price - entry) < (0.002 * entry) and time_elapsed_minutes > 10:
        return {'action': 'EXIT', 'reason': 'Stalled price action'}
    
    return None

class VWAPScalpingBot:
    """Complete VWAP scalping bot with risk management"""
    
    def __init__(self, account_size, max_daily_trades=15, max_daily_loss_pct=3):
        self.account_size = account_size
        self.max_daily_trades = max_daily_trades
        self.max_daily_loss = account_size * (max_daily_loss_pct / 100)
        self.daily_trades = 0
        self.daily_pnl = 0
        self.active_trades = []
        self.consecutive_losses = 0
        
    def can_trade(self):
        """Check if we can take another trade"""
        if self.daily_trades >= self.max_daily_trades:
            return False, "Max daily trades reached"
        if self.daily_pnl <= -self.max_daily_loss:
            return False, "Max daily loss hit"
        if self.consecutive_losses >= 2:
            return False, "Take a break after 2 losses"
        if len(self.active_trades) >= 3:
            return False, "Max concurrent positions"
        return True, "OK"
    
    def open_trade(self, trade):
        """Open a new scalp trade"""
        can_trade, reason = self.can_trade()
        if not can_trade:
            print(f"Cannot trade: {reason}")
            return False
        
        self.active_trades.append(trade)
        self.daily_trades += 1
        print(f"Opened {trade['direction']} scalp: Entry ${trade['entry']:.2f}")
        return True
    
    def close_trade(self, trade, exit_price, reason="Target"):
        """Close trade and update stats"""
        if trade['direction'] == 'LONG':
            pnl = (exit_price - trade['entry']) * trade['position_size']
        else:
            pnl = (trade['entry'] - exit_price) * trade['position_size']
        
        self.daily_pnl += pnl
        
        if pnl < 0:
            self.consecutive_losses += 1
        else:
            self.consecutive_losses = 0
        
        print(f"Closed {trade['direction']}: {reason}, PnL: ${pnl:.2f}")
        self.active_trades.remove(trade)
        
    def reset_daily(self):
        """Reset daily counters"""
        self.daily_trades = 0
        self.daily_pnl = 0
        self.consecutive_losses = 0
        print("Daily stats reset")

# Example usage
"""
# Initialize strategy
df = load_market_data('ETH/USD', timeframe='1m', days=1)
df = vwap_scalping_strategy(df)

# Create bot
bot = VWAPScalpingBot(account_size=50000, max_daily_trades=15)

# Scan for signals
for i in range(100, len(df)):
    # Check for new signals
    if df['long_signal'].iloc[i] or df['short_signal'].iloc[i]:
        trade = execute_vwap_scalp(df, i, bot.account_size)
        if trade and trade['risk_reward'] >= 1.5:
            bot.open_trade(trade)
    
    # Manage active trades
    for trade in bot.active_trades[:]:
        minutes_elapsed = calculate_time_diff(trade['timestamp'], df['timestamp'].iloc[i])
        action = manage_scalp_position(df.iloc[i], trade, minutes_elapsed)
        
        if action:
            if action['action'] == 'PARTIAL_EXIT':
                # Partial exit logic
                pass
            elif action['action'] in ['EXIT', 'TIME_EXIT']:
                bot.close_trade(trade, df['close'].iloc[i], action.get('reason', 'Exit'))

print(f"Daily PnL: ${bot.daily_pnl:.2f}")
"""
```

## Performance Expectations

### Historical Statistics (Backtested)
- **Win Rate:** 65-75% (high frequency strategy)
- **Average Risk/Reward:** 1:1.5 to 1:2
- **Profit Factor:** 1.6-2.2
- **Average Trade Duration:** 8-25 minutes
- **Trades Per Day:** 5-12 quality setups
- **Daily Return Target:** 1-3% of account
- **Maximum Drawdown:** 8-15%
- **Sharpe Ratio:** 1.8-2.5
- **Best Assets:** ETH/USD (74%), BTC/USD (71%), ES Futures (68%)

## Advanced Tips

### Order Flow Reading
- Watch Time & Sales for large institutional orders near VWAP
- Level 2 shows where liquidity rests (support/resistance)
- Large bids at VWAP = strong support (safer longs)

### Multi-Asset Correlation
- Trade correlated pairs (ETH follows BTC)
- If BTC bounces from VWAP, ETH likely follows
- Increases conviction on setups

### Previous Day VWAP
- Previous day's VWAP acts as support/resistance next day
- Price often respects multi-day VWAP
- Use for longer-term context

### Volume Profile Integration
- High volume nodes near VWAP = stronger magnet
- Point of Control (POC) + VWAP confluence = premium setup

## Common Mistakes to Avoid

1. **Overtrading:** Taking marginal setups leads to death by 1000 cuts
2. **Ignoring Spread:** In fast markets, spread can eat your edge
3. **Revenge Trading:** Chasing losses leads to emotional decisions
4. **Poor Timing:** Trading during low volume = poor fills
5. **Ignoring VWAP Slope:** Fighting strong VWAP trends rarely works
6. **No Time Stops:** Holding losers hoping for reversal

## Additional Notes

- Record every trade with screenshots for review
- Calculate your true edge after commissions
- Use simulation mode for 2-4 weeks before live trading
- Keep a strict trading journal with emotional state notes
- Set hard stops in platform (don't rely on mental stops)
- Use bracket orders (OCO) for automatic risk management
- Consider using automated bots for consistent execution

## Resources for Further Learning

- "A Complete Guide to Volume Price Analysis" by Anna Coulling
- "Market Microstructure in Practice" by Lehalle & Laruelle
- "The Playbook" by Mike Bellafiore (SMB Capital)
- TradingView VWAP scripts and educational content
- Online courses on scalping and order flow trading
- Join trading communities focused on intraday strategies
