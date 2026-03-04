# Turtle Trading / Trend Following Strategy

## Overview

**Strategy Type:** Trend Following / Breakout  
**Developer:** Richard Dennis & William Eckhardt (1983)  
**Asset Class:** Futures, Commodities, Forex, Stocks  
**Timeframe:** Daily (D1), can be adapted to 4H or Weekly  
**Complexity:** Medium  
**Capital Required:** $10,000+ (proper position sizing critical)

## Strategy Description

The Turtle Trading strategy is one of the most famous trend-following systems in trading history. Created as an experiment to prove that trading could be taught, it uses Donchian Channel breakouts to identify strong trends and rides them with proper position sizing and risk management.

The system enters long positions when price breaks above the 20-day or 55-day high, and shorts when price breaks below the 20-day or 55-day low. Position sizing is based on volatility (ATR) to normalize risk across different instruments.

## Core Components

### 1. Entry Signals

**System 1 (Short-term):**
- **Long Entry:** Price breaks above 20-day high
- **Short Entry:** Price breaks below 20-day low
- **Filter:** Skip entry if last breakout was profitable

**System 2 (Long-term):**
- **Long Entry:** Price breaks above 55-day high
- **Short Entry:** Price breaks below 55-day low
- **No filter:** Take all breakouts

### 2. Exit Conditions

**System 1 Exits:**
- Exit long when price breaks below 10-day low
- Exit short when price breaks above 10-day high

**System 2 Exits:**
- Exit long when price breaks below 20-day low
- Exit short when price breaks above 20-day high

**Stop Loss:**
- 2 ATR from entry price
- Trailing stop: move stop to breakeven after 1 ATR profit

## Position Sizing

**Unit Calculation:**
```
Unit Size = (Account Risk % × Account Equity) / (ATR × Point Value)

Where:
- Account Risk % = 1% per unit
- ATR = 20-day Average True Range
- Point Value = dollar value per point movement
```

**Risk Limits:**
- Maximum 4 units per market
- Maximum 6 units per sector
- Maximum 12 units total across portfolio

## Risk Management

- **Risk per trade:** 1% of account per unit
- **Maximum drawdown:** Stop trading after 20% account drawdown
- **Diversification:** Trade minimum 6 uncorrelated markets
- **No overnight gaps:** Use limit orders or adjust next day
- **Pyramiding:** Add units at 1/2 ATR intervals (max 4 units)

## Example Setup

**Market:** Gold Futures (GC)  
**Account Size:** $100,000  
**ATR (20):** $25  
**Point Value:** $100 per point

**Entry:**
- 55-day high breaks at $2,000
- Long entry at $2,000.50

**Position Size:**
- Unit risk = $100,000 × 1% = $1,000
- Unit size = $1,000 / ($25 × $100) = 0.4 contracts
- Round to 1 contract (conservative)

**Stop Loss:**
- 2 ATR stop = $2,000 - (2 × $25) = $1,950

**Exit:**
- Exit when price breaks below 20-day low
- Or stop hit at $1,950

## Advantages

✅ **Proven track record** - Made millions for original Turtles  
✅ **Simple rules** - Easy to code and follow systematically  
✅ **Catches big trends** - Profits from major market moves  
✅ **Volatility-adjusted** - Normalizes risk across instruments  
✅ **Scalable** - Works across multiple markets simultaneously  
✅ **Psychological discipline** - Rules-based removes emotion

## Disadvantages

❌ **Whipsaw losses** - Many small losses in ranging markets  
❌ **Large drawdowns** - Can experience 20-30% drawdowns  
❌ **Requires patience** - May wait weeks for breakout  
❌ **Slippage on breakouts** - Entry fills can be poor  
❌ **Capital intensive** - Needs diversification across markets  
❌ **Low win rate** - Only 35-40% winning trades

## Best Market Conditions

- **Strong trending markets** (up or down)
- **High volatility expansion** after consolidation
- **Macro-driven moves** (commodities, forex)
- **Breakout from multi-week ranges**
- **Avoid:** Choppy, range-bound markets

## Python Implementation

```python
import pandas as pd
import numpy as np
from datetime import datetime

class TurtleTrading:
    def __init__(self, data, system=2, account_size=100000):
        """
        Turtle Trading Strategy Implementation
        
        Parameters:
        - data: DataFrame with OHLC columns
        - system: 1 (20-day) or 2 (55-day)
        - account_size: Initial capital
        """
        self.data = data.copy()
        self.system = system
        self.account_size = account_size
        self.position = 0  # 0=flat, 1=long, -1=short
        self.units = 0
        self.entry_price = 0
        
        # Set parameters based on system
        if system == 1:
            self.entry_period = 20
            self.exit_period = 10
        else:
            self.entry_period = 55
            self.exit_period = 20
    
    def calculate_indicators(self):
        """Calculate Donchian Channels and ATR"""
        df = self.data
        
        # Donchian Channels
        df['entry_high'] = df['High'].rolling(window=self.entry_period).max()
        df['entry_low'] = df['Low'].rolling(window=self.entry_period).min()
        df['exit_high'] = df['High'].rolling(window=self.exit_period).max()
        df['exit_low'] = df['Low'].rolling(window=self.exit_period).min()
        
        # ATR (20-period)
        df['tr1'] = df['High'] - df['Low']
        df['tr2'] = abs(df['High'] - df['Close'].shift(1))
        df['tr3'] = abs(df['Low'] - df['Close'].shift(1))
        df['tr'] = df[['tr1', 'tr2', 'tr3']].max(axis=1)
        df['atr'] = df['tr'].rolling(window=20).mean()
        
        self.data = df
        return self.data
    
    def calculate_position_size(self, atr, point_value=1):
        """
        Calculate position size based on ATR
        
        Parameters:
        - atr: Current ATR value
        - point_value: Dollar value per point (e.g., 100 for gold futures)
        """
        risk_per_unit = self.account_size * 0.01  # 1% risk per unit
        unit_size = risk_per_unit / (atr * point_value)
        return max(1, int(unit_size))  # At least 1 unit
    
    def generate_signals(self):
        """Generate entry and exit signals"""
        df = self.data
        df['signal'] = 0
        df['position'] = 0
        df['units'] = 0
        
        for i in range(self.entry_period + 1, len(df)):
            # Entry signals
            if self.position == 0:
                # Long entry: break above entry_high
                if df['Close'].iloc[i] > df['entry_high'].iloc[i-1]:
                    self.position = 1
                    self.entry_price = df['Close'].iloc[i]
                    self.units = self.calculate_position_size(df['atr'].iloc[i])
                    df.loc[df.index[i], 'signal'] = 1
                
                # Short entry: break below entry_low
                elif df['Close'].iloc[i] < df['entry_low'].iloc[i-1]:
                    self.position = -1
                    self.entry_price = df['Close'].iloc[i]
                    self.units = self.calculate_position_size(df['atr'].iloc[i])
                    df.loc[df.index[i], 'signal'] = -1
            
            # Exit signals
            elif self.position == 1:
                # Exit long: break below exit_low or stop loss
                stop_loss = self.entry_price - (2 * df['atr'].iloc[i])
                if df['Close'].iloc[i] < df['exit_low'].iloc[i-1] or df['Close'].iloc[i] < stop_loss:
                    df.loc[df.index[i], 'signal'] = 0
                    self.position = 0
                    self.units = 0
            
            elif self.position == -1:
                # Exit short: break above exit_high or stop loss
                stop_loss = self.entry_price + (2 * df['atr'].iloc[i])
                if df['Close'].iloc[i] > df['exit_high'].iloc[i-1] or df['Close'].iloc[i] > stop_loss:
                    df.loc[df.index[i], 'signal'] = 0
                    self.position = 0
                    self.units = 0
            
            df.loc[df.index[i], 'position'] = self.position
            df.loc[df.index[i], 'units'] = self.units
        
        self.data = df
        return self.data
    
    def backtest(self):
        """Run backtest and calculate performance"""
        df = self.calculate_indicators()
        df = self.generate_signals()
        
        # Calculate returns
        df['returns'] = df['Close'].pct_change()
        df['strategy_returns'] = df['position'].shift(1) * df['returns']
        df['cumulative_returns'] = (1 + df['strategy_returns']).cumprod()
        
        # Performance metrics
        total_return = df['cumulative_returns'].iloc[-1] - 1
        sharpe_ratio = df['strategy_returns'].mean() / df['strategy_returns'].std() * np.sqrt(252)
        max_drawdown = (df['cumulative_returns'] / df['cumulative_returns'].cummax() - 1).min()
        
        print(f"=== Turtle Trading System {self.system} Results ===")
        print(f"Total Return: {total_return:.2%}")
        print(f"Sharpe Ratio: {sharpe_ratio:.2f}")
        print(f"Max Drawdown: {max_drawdown:.2%}")
        print(f"Win Rate: {(df['strategy_returns'] > 0).sum() / (df['strategy_returns'] != 0).sum():.2%}")
        
        return df

# Example usage
if __name__ == "__main__":
    # Load your data (OHLC format)
    # df = pd.read_csv('gold_daily.csv', parse_dates=['Date'], index_col='Date')
    
    # Sample data generation (replace with real data)
    dates = pd.date_range(start='2020-01-01', end='2024-01-01', freq='D')
    np.random.seed(42)
    prices = 1800 + np.cumsum(np.random.randn(len(dates)) * 10)
    
    df = pd.DataFrame({
        'Open': prices + np.random.randn(len(dates)) * 5,
        'High': prices + abs(np.random.randn(len(dates)) * 8),
        'Low': prices - abs(np.random.randn(len(dates)) * 8),
        'Close': prices,
    }, index=dates)
    
    # Run Turtle Trading System 2
    turtle = TurtleTrading(df, system=2, account_size=100000)
    results = turtle.backtest()
    
    # Plot results
    import matplotlib.pyplot as plt
    
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 10))
    
    # Price and signals
    ax1.plot(results.index, results['Close'], label='Price', alpha=0.7)
    ax1.plot(results.index, results['entry_high'], label=f'{turtle.entry_period}-day High', linestyle='--', alpha=0.5)
    ax1.plot(results.index, results['entry_low'], label=f'{turtle.entry_period}-day Low', linestyle='--', alpha=0.5)
    
    # Mark entries
    buy_signals = results[results['signal'] == 1]
    sell_signals = results[results['signal'] == -1]
    ax1.scatter(buy_signals.index, buy_signals['Close'], marker='^', color='green', s=100, label='Long Entry')
    ax1.scatter(sell_signals.index, sell_signals['Close'], marker='v', color='red', s=100, label='Short Entry')
    
    ax1.set_title('Turtle Trading - Price & Signals')
    ax1.set_ylabel('Price')
    ax1.legend()
    ax1.grid(True, alpha=0.3)
    
    # Cumulative returns
    ax2.plot(results.index, results['cumulative_returns'], label='Strategy', linewidth=2)
    ax2.axhline(y=1, color='black', linestyle='--', alpha=0.3)
    ax2.set_title('Cumulative Returns')
    ax2.set_ylabel('Cumulative Return')
    ax2.legend()
    ax2.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.show()
```

## Additional Resources

- **Original Turtle Rules:** [turtletrader.com](https://www.turtletrader.com)
- **Book:** "The Complete TurtleTrader" by Michael Covel
- **Donchian Channels:** Developed by Richard Donchian in the 1960s
- **ATR Position Sizing:** Van Tharp's work on risk management

## Notes

- The original Turtles traded 20+ markets simultaneously for diversification
- System 1 and System 2 should be traded in parallel with separate capital allocation
- Modern adaptations may use tighter stops or different filters
- Requires significant discipline to follow through drawdowns
- Consider trading futures or forex for leverage and 24-hour markets

---

*This strategy is for educational purposes. Past performance does not guarantee future results. Always test thoroughly before risking real capital.*
