# Opening Range Breakout Strategy

## Overview

**Strategy Type:** Intraday Breakout / Momentum  
**Developer:** Toby Crabel, Mark Fisher  
**Asset Class:** Stocks, Index Futures, ETFs  
**Timeframe:** Intraday (5-min to 1-hour charts, focusing on first 15-30 minutes)  
**Complexity:** Low to Medium  
**Capital Required:** $5,000+ (depending on instrument)

## Strategy Description

The Opening Range Breakout (ORB) strategy capitalizes on the volatility and momentum that occurs at the market open. The first 15-30 minutes of trading establishes a price range (high and low). A breakout above or below this range with strong volume signals the direction for the remainder of the day.

This strategy is based on the premise that the opening range captures the overnight sentiment and initial institutional activity. A decisive breakout indicates strong directional conviction and often leads to sustained intraday moves.

## Core Components

### 1. Opening Range Definition

**Time Windows (choose one):**
- **5-minute ORB:** 9:30-9:35 AM EST
- **15-minute ORB:** 9:30-9:45 AM EST (most popular)
- **30-minute ORB:** 9:30-10:00 AM EST
- **First hour ORB:** 9:30-10:30 AM EST

**Range Calculation:**
- **OR High:** Highest price during opening range period
- **OR Low:** Lowest price during opening range period
- **OR Size:** OR High - OR Low

### 2. Entry Signals

**Long Entry:**
- Price breaks above OR High
- Volume on breakout bar > 1.5× average volume of OR period
- Confirmation: 5-minute close above OR High

**Short Entry:**
- Price breaks below OR Low
- Volume on breakout bar > 1.5× average volume of OR period
- Confirmation: 5-minute close below OR Low

**Filters:**
- Gap size < 2% (avoid extreme gap days)
- Premarket volume suggests institutional interest
- Avoid news-driven volatility unless experienced

### 3. Exit Conditions

**Profit Targets:**
- Target 1: OR size (1:1 risk-reward)
- Target 2: 1.5× OR size (1.5:1 risk-reward)
- Target 3: 2× OR size (trail stop)

**Stop Loss:**
- Opposite side of opening range
- Or 50% of OR size for tighter risk

**Time-Based Exit:**
- Close all positions by 3:45 PM EST (15 min before close)
- Or close at 12:00 PM if no momentum

## Position Sizing

**Risk-Based Sizing:**
```
Position Size = (Account Risk $) / (Entry Price - Stop Loss)

Example:
- Account: $50,000
- Risk: 1% = $500
- Entry: $102.50
- Stop: $100.00
- Position = $500 / $2.50 = 200 shares
```

**Maximum Risk:**
- 1-2% per trade
- No more than 2 active ORB trades simultaneously
- Scale out at targets to reduce risk

## Risk Management

- **Hard stop:** Always use stop loss at opposite range boundary
- **Time stop:** Exit if no follow-through within 1 hour
- **Avoid whipsaws:** Wait for confirmation (5-min close beyond range)
- **Pre-market gaps:** Reduce size or skip if gap > 2%
- **News events:** Skip earnings, Fed announcements unless tested strategy
- **Daily loss limit:** Stop trading after 2 consecutive losses or -3% daily

## Example Setup

**Stock:** SPY (S&P 500 ETF)  
**Date:** Typical trending day  
**Account Size:** $50,000  

**Opening Range (9:30-9:45 AM):**
- OR High: $450.75
- OR Low: $449.25
- OR Size: $1.50

**Long Entry:**
- Time: 9:52 AM
- Entry: $450.85 (break above $450.75)
- Volume: 2.1× average OR volume
- Stop Loss: $449.20 (below OR Low)
- Risk: $1.65 per share

**Position Size:**
- Account risk: $50,000 × 1% = $500
- Position: $500 / $1.65 = 303 shares (round to 300)

**Targets:**
- Target 1: $452.35 (1× OR size = $450.85 + $1.50) - Sell 100 shares
- Target 2: $453.10 (1.5× OR size) - Sell 100 shares
- Target 3: Trail stop on remaining 100 shares

**Actual Exit:**
- 11:15 AM: Target 1 hit, sold 100 @ $452.35 (+$150)
- 1:30 PM: Target 2 hit, sold 100 @ $453.10 (+$225)
- 2:45 PM: Trailing stop hit on 100 @ $454.20 (+$335)
- **Total Profit:** $710 (1.42% account gain)

## Advantages

✅ **Clear rules** - Objective entry and exit points  
✅ **Defined risk** - Stop loss is always known  
✅ **High probability** - Strong breakouts often continue  
✅ **Quick results** - Know within 1-2 hours if trade works  
✅ **No overnight risk** - Close all positions same day  
✅ **Scalable** - Works on multiple liquid instruments  
✅ **Time efficient** - Only need to watch market for 2-3 hours

## Disadvantages

❌ **False breakouts** - Whipsaws are common in ranging markets  
❌ **Requires quick execution** - Slippage on fast breakouts  
❌ **Market-open volatility** - Spreads can be wide  
❌ **Screen time** - Must be available at market open  
❌ **Commission costs** - Frequent trading can add up  
❌ **Emotional pressure** - Fast-paced decision making  
❌ **Trending market dependency** - Poor in sideways days

## Best Market Conditions

- **Moderate overnight gaps** (0.3-1.5%)
- **Pre-market volume and price action** showing direction
- **Trending broader market** (SPX up/down >0.5%)
- **Volatility expansion** after consolidation
- **Earnings season** (selective, experienced traders only)
- **Avoid:** Flat opens, extremely wide gaps, low-volume days

## Python Implementation

```python
import pandas as pd
import numpy as np
from datetime import time, datetime, timedelta

class OpeningRangeBreakout:
    def __init__(self, data, or_minutes=15, volume_multiplier=1.5):
        """
        Opening Range Breakout Strategy
        
        Parameters:
        - data: DataFrame with timestamp, OHLCV columns (intraday 5-min bars)
        - or_minutes: Opening range duration (5, 15, 30, or 60)
        - volume_multiplier: Breakout volume threshold
        """
        self.data = data.copy()
        self.or_minutes = or_minutes
        self.volume_multiplier = volume_multiplier
        self.trades = []
        
    def identify_opening_range(self, date):
        """Calculate opening range for a specific date"""
        # Market opens at 9:30 AM EST
        market_open = time(9, 30)
        or_end = (datetime.combine(datetime.today(), market_open) + 
                  timedelta(minutes=self.or_minutes)).time()
        
        # Filter data for this date and OR period
        day_data = self.data[self.data.index.date == date]
        or_data = day_data[
            (day_data.index.time >= market_open) & 
            (day_data.index.time < or_end)
        ]
        
        if len(or_data) == 0:
            return None
        
        or_high = or_data['High'].max()
        or_low = or_data['Low'].min()
        or_size = or_high - or_low
        avg_or_volume = or_data['Volume'].mean()
        
        return {
            'date': date,
            'or_high': or_high,
            'or_low': or_low,
            'or_size': or_size,
            'avg_or_volume': avg_or_volume
        }
    
    def check_breakout(self, bar, or_info):
        """Check if current bar breaks the opening range"""
        if or_info is None:
            return None
        
        # Long breakout
        if (bar['Close'] > or_info['or_high'] and 
            bar['Volume'] > or_info['avg_or_volume'] * self.volume_multiplier):
            return {
                'direction': 'long',
                'entry_price': or_info['or_high'],
                'stop_loss': or_info['or_low'],
                'or_size': or_info['or_size']
            }
        
        # Short breakout
        elif (bar['Close'] < or_info['or_low'] and 
              bar['Volume'] > or_info['avg_or_volume'] * self.volume_multiplier):
            return {
                'direction': 'short',
                'entry_price': or_info['or_low'],
                'stop_loss': or_info['or_high'],
                'or_size': or_info['or_size']
            }
        
        return None
    
    def calculate_targets(self, entry_price, or_size, direction):
        """Calculate profit targets based on OR size"""
        if direction == 'long':
            target1 = entry_price + or_size
            target2 = entry_price + (or_size * 1.5)
            target3 = entry_price + (or_size * 2)
        else:  # short
            target1 = entry_price - or_size
            target2 = entry_price - (or_size * 1.5)
            target3 = entry_price - (or_size * 2)
        
        return target1, target2, target3
    
    def backtest(self, account_size=50000, risk_pct=0.01):
        """Run backtest on intraday data"""
        df = self.data.copy()
        df['signal'] = 0
        df['position'] = 0
        
        # Get unique trading dates
        dates = df.index.date
        unique_dates = sorted(set(dates))
        
        current_position = None
        market_close = time(15, 45)  # Close positions by 3:45 PM
        
        for date in unique_dates:
            # Calculate opening range for this day
            or_info = self.identify_opening_range(date)
            if or_info is None:
                continue
            
            # Get all bars for this day after OR period
            day_data = df[df.index.date == date]
            or_end_time = (datetime.combine(datetime.today(), time(9, 30)) + 
                          timedelta(minutes=self.or_minutes)).time()
            
            post_or_data = day_data[day_data.index.time >= or_end_time]
            
            for idx, bar in post_or_data.iterrows():
                # Check for time-based exit
                if bar.name.time() >= market_close and current_position:
                    # Close position
                    exit_price = bar['Close']
                    trade_result = self.close_trade(current_position, exit_price, 'time_exit')
                    self.trades.append(trade_result)
                    current_position = None
                    df.loc[idx, 'signal'] = 0
                    df.loc[idx, 'position'] = 0
                    continue
                
                # If no position, check for breakout
                if current_position is None:
                    breakout = self.check_breakout(bar, or_info)
                    
                    if breakout:
                        # Calculate position size
                        risk_amount = account_size * risk_pct
                        stop_distance = abs(breakout['entry_price'] - breakout['stop_loss'])
                        position_size = int(risk_amount / stop_distance)
                        
                        # Open position
                        current_position = {
                            'entry_time': idx,
                            'direction': breakout['direction'],
                            'entry_price': breakout['entry_price'],
                            'stop_loss': breakout['stop_loss'],
                            'size': position_size,
                            'or_size': breakout['or_size']
                        }
                        
                        # Calculate targets
                        t1, t2, t3 = self.calculate_targets(
                            breakout['entry_price'],
                            breakout['or_size'],
                            breakout['direction']
                        )
                        current_position['target1'] = t1
                        current_position['target2'] = t2
                        current_position['target3'] = t3
                        current_position['remaining_size'] = position_size
                        
                        signal = 1 if breakout['direction'] == 'long' else -1
                        df.loc[idx, 'signal'] = signal
                        df.loc[idx, 'position'] = signal
                
                # If in position, check for exits
                elif current_position:
                    exit_signal = self.check_exit(bar, current_position)
                    
                    if exit_signal:
                        exit_price = bar['Close']
                        trade_result = self.close_trade(current_position, exit_price, exit_signal)
                        self.trades.append(trade_result)
                        current_position = None
                        df.loc[idx, 'signal'] = 0
                        df.loc[idx, 'position'] = 0
        
        self.data = df
        self.calculate_performance()
        return df
    
    def check_exit(self, bar, position):
        """Check if exit conditions are met"""
        if position['direction'] == 'long':
            # Stop loss
            if bar['Low'] <= position['stop_loss']:
                return 'stop_loss'
            # Target hits (simplified - full position exit at first target)
            if bar['High'] >= position['target1']:
                return 'target'
        else:  # short
            # Stop loss
            if bar['High'] >= position['stop_loss']:
                return 'stop_loss'
            # Target hits
            if bar['Low'] <= position['target1']:
                return 'target'
        
        return None
    
    def close_trade(self, position, exit_price, exit_reason):
        """Record trade results"""
        direction_multiplier = 1 if position['direction'] == 'long' else -1
        pnl = (exit_price - position['entry_price']) * direction_multiplier * position['size']
        pnl_pct = ((exit_price / position['entry_price']) - 1) * direction_multiplier * 100
        
        return {
            'entry_time': position['entry_time'],
            'direction': position['direction'],
            'entry_price': position['entry_price'],
            'exit_price': exit_price,
            'size': position['size'],
            'pnl': pnl,
            'pnl_pct': pnl_pct,
            'exit_reason': exit_reason
        }
    
    def calculate_performance(self):
        """Calculate and print performance metrics"""
        if len(self.trades) == 0:
            print("No trades executed")
            return
        
        trades_df = pd.DataFrame(self.trades)
        
        total_trades = len(trades_df)
        winning_trades = len(trades_df[trades_df['pnl'] > 0])
        losing_trades = len(trades_df[trades_df['pnl'] < 0])
        win_rate = winning_trades / total_trades * 100
        
        total_pnl = trades_df['pnl'].sum()
        avg_win = trades_df[trades_df['pnl'] > 0]['pnl'].mean() if winning_trades > 0 else 0
        avg_loss = trades_df[trades_df['pnl'] < 0]['pnl'].mean() if losing_trades > 0 else 0
        profit_factor = abs(avg_win * winning_trades / (avg_loss * losing_trades)) if losing_trades > 0 else np.inf
        
        print(f"\n=== Opening Range Breakout ({self.or_minutes}-min) Results ===")
        print(f"Total Trades: {total_trades}")
        print(f"Winning Trades: {winning_trades}")
        print(f"Losing Trades: {losing_trades}")
        print(f"Win Rate: {win_rate:.1f}%")
        print(f"Total P&L: ${total_pnl:.2f}")
        print(f"Average Win: ${avg_win:.2f}")
        print(f"Average Loss: ${avg_loss:.2f}")
        print(f"Profit Factor: {profit_factor:.2f}")
        
        return trades_df

# Example usage
if __name__ == "__main__":
    # Load intraday 5-minute data (must include pre-market and regular hours)
    # df = pd.read_csv('SPY_5min.csv', parse_dates=['Datetime'], index_col='Datetime')
    
    # Sample data generation (replace with real intraday data)
    dates = pd.date_range(start='2024-01-01 09:30:00', end='2024-01-31 16:00:00', 
                          freq='5min', tz='America/New_York')
    # Filter to market hours only
    dates = [d for d in dates if d.time() >= time(9, 30) and d.time() <= time(16, 0)]
    
    np.random.seed(42)
    base_price = 450
    prices = base_price + np.cumsum(np.random.randn(len(dates)) * 0.5)
    
    df = pd.DataFrame({
        'Open': prices + np.random.randn(len(dates)) * 0.1,
        'High': prices + abs(np.random.randn(len(dates)) * 0.3),
        'Low': prices - abs(np.random.randn(len(dates)) * 0.3),
        'Close': prices,
        'Volume': np.random.randint(1000000, 5000000, len(dates))
    }, index=dates)
    
    # Run ORB strategy
    orb = OpeningRangeBreakout(df, or_minutes=15, volume_multiplier=1.5)
    results = orb.backtest(account_size=50000, risk_pct=0.01)
    
    # Analyze trades
    trades_summary = pd.DataFrame(orb.trades)
    print("\nSample Trades:")
    print(trades_summary.head(10))
```

## Additional Resources

- **Book:** "The Day Trader's Manual" by William F. Eng
- **Book:** "Opening Range Breakout" by Toby Crabel
- **Tools:** TradingView, Thinkorswim for real-time charting
- **Practice:** Paper trade for 2-4 weeks before using real capital

## Notes

- Works best on highly liquid instruments (SPY, QQQ, AAPL, TSLA)
- The 15-minute ORB is most popular among day traders
- Consider market context: trending vs. ranging overall market
- Friday and Monday can have different characteristics
- Combine with pre-market analysis for higher probability setups
- Use Level 2 data to see order flow at breakout levels

---

*This strategy is for educational purposes. Day trading involves significant risk. Practice with paper trading before risking real capital.*
