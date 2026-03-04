# Grid Trading Strategy for Crypto

## Strategy Overview

**Strategy Name:** Grid Trading  
**Strategy Type:** Automated Range-Bound / Mean Reversion  
**Asset Class:** Cryptocurrency (BTC, ETH, altcoins)  
**Timeframe:** 24/7 automated, optimal in 4H-1D sideways markets  
**Skill Level:** Intermediate  

## Core Concept

Grid trading is an automated strategy that places buy and sell orders at predetermined price intervals (grid levels) above and below a set base price. The system profits from market volatility by buying low and selling high repeatedly within a defined range, without needing to predict market direction.

## Key Components

### 1. Grid Structure
- **Base Price:** Center point of the grid (usually current market price)
- **Grid Spacing:** Price distance between levels (e.g., 2% intervals)
- **Number of Grids:** Total buy/sell levels (e.g., 10 levels each direction)
- **Upper/Lower Bounds:** Maximum and minimum price range

### 2. Order Types
- **Buy Orders:** Placed below base price at each grid level
- **Sell Orders:** Placed above base price at each grid level
- **Order Size:** Equal distribution or weighted (more at extremes)

### 3. Profit Mechanism
- Buy at grid level N → Sell at grid level N+1
- Each completed grid cycle captures the spread minus fees
- Profits accumulate from price oscillations within range

## Entry Conditions

### Grid Setup Requirements
1. **Range-bound market:** Price consolidating, low trend strength
2. **Sufficient volatility:** 5-15% weekly price swings
3. **High liquidity:** Tight spreads, minimal slippage (BTC, ETH, major alts)
4. **Stable fundamentals:** No imminent major news/events

### Initial Grid Placement
- **Identify range:** Analyze 30-90 day support/resistance
- **Set base price:** Current mid-range price
- **Calculate grid levels:** 
  - Upper bound: +20-30% from base
  - Lower bound: -20-30% from base
  - Grid spacing: 1-3% intervals
- **Deploy orders:** All buy/sell orders placed simultaneously

## Exit Conditions

### Stop Grid Conditions
1. **Strong breakout:** Price exceeds upper/lower bounds by >10%
2. **Trend formation:** Sustained directional move (ADX > 25)
3. **Fundamental change:** Major protocol update, regulatory news
4. **Target profit reached:** Accumulated profit hits goal (e.g., 15% total)

### Grid Adjustment
- **Partial exit:** Close half the grid, let rest run
- **Grid shift:** Move entire grid structure to new range
- **Dynamic spacing:** Widen grids in higher volatility

### Emergency Stop
- **Flash crash protection:** Cancel all orders if price drops >15% in 1 hour
- **Exchange issues:** Halt on API errors, abnormal spreads
- **Manual override:** User intervention for unexpected events

## Risk Management

- **Capital Allocation:** Use only 20-40% of portfolio per grid
- **Position Sizing:** Each grid level = 1-3% of allocated capital
- **Maximum Drawdown:** Stop if unrealized loss exceeds 25%
- **Diversification:** Run grids on 2-3 uncorrelated pairs (BTC, ETH, stablecoin pairs)
- **Fee Consideration:** Ensure grid profits exceed trading fees (use maker orders, exchange discounts)

## Example Trade Setup

**Market:** BTC/USDT on Binance  
**Date:** Consolidation phase after rally (sideways for 3 weeks)  
**Current Price:** $40,000

### Grid Configuration
- **Base Price:** $40,000
- **Upper Bound:** $48,000 (+20%)
- **Lower Bound:** $32,000 (-20%)
- **Grid Spacing:** 2% ($800 intervals)
- **Number of Grids:** 10 levels up, 10 levels down
- **Capital Allocated:** $10,000
- **Per-Level Investment:** $500 per grid level

### Grid Levels

**Sell Orders (Above Base):**
- $40,800 - Sell 0.01225 BTC
- $41,600 - Sell 0.01202 BTC
- $42,400 - Sell 0.01179 BTC
- ... (up to $48,000)

**Buy Orders (Below Base):**
- $39,200 - Buy 0.01276 BTC ($500 / $39,200)
- $38,400 - Buy 0.01302 BTC
- $37,600 - Buy 0.01330 BTC
- ... (down to $32,000)

### Scenario Over 30 Days
- **Price oscillates between $38,000 - $43,000**
- **Complete cycles:** 15 buy-sell pairs executed
- **Profit per cycle:** ~$15-20 (2% spread - 0.2% fees)
- **Total profit:** ~$250-300 (2.5-3% on $10k capital)
- **Unrealized inventory:** Holding BTC purchased at lower levels

## Pros

- **No directional bias:** Profits in sideways markets (where most strategies fail)
- **Passive income:** Fully automated, minimal monitoring required
- **Emotional discipline:** Removes human emotion from trading
- **Compounding:** Profits reinvested into larger grid positions
- **Flexible:** Works in crypto, forex, commodities

## Cons

- **Range-bound dependency:** Loses money in strong trends (one-way movement)
- **Capital intensive:** Requires significant capital to cover all grid levels
- **Inventory risk:** Accumulates asset if price trends down (bags of coins at higher prices)
- **Opportunity cost:** Capital locked up, might miss better opportunities
- **Fee erosion:** High-frequency trading fees can eat profits in tight grids

## Best Market Conditions

- **Sideways consolidation:** Price ranging for weeks/months
- **Post-volatility calm:** After major moves, markets digest gains
- **Low-trending markets:** ADX < 20, no clear direction
- **High volatility assets:** Crypto, small-cap stocks (more oscillations)
- **Liquid pairs:** BTC/USDT, ETH/USDT, major exchange pairs (tight spreads)

## Python/Pseudocode Implementation

```python
import numpy as np
import pandas as pd
from typing import List, Dict

class GridTradingStrategy:
    def __init__(
        self,
        base_price: float,
        grid_spacing_pct: float,
        num_grids: int,
        capital_per_grid: float,
        fee_rate: float = 0.001
    ):
        self.base_price = base_price
        self.grid_spacing_pct = grid_spacing_pct
        self.num_grids = num_grids
        self.capital_per_grid = capital_per_grid
        self.fee_rate = fee_rate
        
        self.buy_orders = []
        self.sell_orders = []
        self.executed_trades = []
        self.active_positions = {}
        
    def calculate_grid_levels(self) -> tuple:
        """Generate buy and sell grid levels"""
        buy_levels = []
        sell_levels = []
        
        for i in range(1, self.num_grids + 1):
            # Buy levels below base price
            buy_price = self.base_price * (1 - i * self.grid_spacing_pct / 100)
            buy_quantity = self.capital_per_grid / buy_price
            buy_levels.append({'price': round(buy_price, 2), 'quantity': buy_quantity})
            
            # Sell levels above base price
            sell_price = self.base_price * (1 + i * self.grid_spacing_pct / 100)
            sell_quantity = self.capital_per_grid / sell_price
            sell_levels.append({'price': round(sell_price, 2), 'quantity': sell_quantity})
        
        return buy_levels, sell_levels
    
    def initialize_grid(self):
        """Place all grid orders"""
        self.buy_orders, self.sell_orders = self.calculate_grid_levels()
        print(f"Grid initialized: {self.num_grids} buy levels, {self.num_grids} sell levels")
        return self.buy_orders, self.sell_orders
    
    def check_order_fills(self, current_price: float) -> List[Dict]:
        """Check which orders should be filled at current price"""
        fills = []
        
        # Check buy orders
        for order in self.buy_orders:
            if current_price <= order['price'] and order['price'] not in self.active_positions:
                fill = {
                    'type': 'buy',
                    'price': order['price'],
                    'quantity': order['quantity'],
                    'cost': order['price'] * order['quantity'] * (1 + self.fee_rate)
                }
                fills.append(fill)
                self.active_positions[order['price']] = order['quantity']
        
        # Check sell orders (only if we have a position to sell)
        for order in self.sell_orders:
            # Find corresponding buy level (one grid below)
            buy_level = order['price'] / (1 + self.grid_spacing_pct / 100)
            
            if current_price >= order['price'] and buy_level in self.active_positions:
                quantity_to_sell = self.active_positions[buy_level]
                fill = {
                    'type': 'sell',
                    'price': order['price'],
                    'quantity': quantity_to_sell,
                    'revenue': order['price'] * quantity_to_sell * (1 - self.fee_rate)
                }
                fills.append(fill)
                del self.active_positions[buy_level]
        
        return fills
    
    def calculate_profit(self, buy_price: float, sell_price: float, quantity: float) -> float:
        """Calculate profit from one grid cycle"""
        buy_cost = buy_price * quantity * (1 + self.fee_rate)
        sell_revenue = sell_price * quantity * (1 - self.fee_rate)
        profit = sell_revenue - buy_cost
        profit_pct = (profit / buy_cost) * 100
        return profit, profit_pct
    
    def run_backtest(self, price_series: pd.Series) -> Dict:
        """Simulate grid trading on historical prices"""
        self.initialize_grid()
        total_profit = 0
        completed_cycles = 0
        
        for timestamp, price in price_series.items():
            fills = self.check_order_fills(price)
            
            for fill in fills:
                if fill['type'] == 'buy':
                    print(f"[{timestamp}] BUY {fill['quantity']:.4f} @ ${fill['price']}")
                elif fill['type'] == 'sell':
                    # Find the corresponding buy price
                    buy_price = fill['price'] / (1 + self.grid_spacing_pct / 100)
                    profit, profit_pct = self.calculate_profit(
                        buy_price, fill['price'], fill['quantity']
                    )
                    total_profit += profit
                    completed_cycles += 1
                    print(f"[{timestamp}] SELL {fill['quantity']:.4f} @ ${fill['price']} | Profit: ${profit:.2f} ({profit_pct:.2f}%)")
        
        # Calculate unrealized P&L from open positions
        unrealized_pnl = 0
        current_price = price_series.iloc[-1]
        for buy_price, quantity in self.active_positions.items():
            unrealized_value = current_price * quantity
            cost_basis = buy_price * quantity * (1 + self.fee_rate)
            unrealized_pnl += (unrealized_value - cost_basis)
        
        total_capital_used = self.capital_per_grid * self.num_grids * 2
        roi = (total_profit / total_capital_used) * 100
        
        return {
            'total_profit': total_profit,
            'completed_cycles': completed_cycles,
            'avg_profit_per_cycle': total_profit / completed_cycles if completed_cycles > 0 else 0,
            'unrealized_pnl': unrealized_pnl,
            'active_positions': len(self.active_positions),
            'roi': roi
        }
    
    def should_stop_grid(self, current_price: float, trend_strength: float) -> bool:
        """Determine if grid should be stopped"""
        upper_bound = self.base_price * (1 + self.num_grids * self.grid_spacing_pct / 100)
        lower_bound = self.base_price * (1 - self.num_grids * self.grid_spacing_pct / 100)
        
        # Stop if price breaks out of range
        if current_price > upper_bound * 1.1 or current_price < lower_bound * 0.9:
            return True, "Price breakout"
        
        # Stop if strong trend detected (ADX > 25)
        if trend_strength > 25:
            return True, "Strong trend detected"
        
        return False, None

# Example Usage
if __name__ == "__main__":
    # Initialize grid strategy
    strategy = GridTradingStrategy(
        base_price=40000,      # BTC at $40k
        grid_spacing_pct=2.0,  # 2% between grids
        num_grids=10,          # 10 levels each side
        capital_per_grid=500,  # $500 per level
        fee_rate=0.001         # 0.1% trading fee
    )
    
    # Generate sample price data (oscillating market)
    dates = pd.date_range('2024-01-01', periods=100, freq='6H')
    np.random.seed(42)
    prices = 40000 + 3000 * np.sin(np.linspace(0, 4*np.pi, 100)) + np.random.normal(0, 500, 100)
    price_series = pd.Series(prices, index=dates)
    
    # Run backtest
    results = strategy.run_backtest(price_series)
    
    print("\n=== GRID TRADING RESULTS ===")
    print(f"Total Profit: ${results['total_profit']:.2f}")
    print(f"Completed Cycles: {results['completed_cycles']}")
    print(f"Avg Profit/Cycle: ${results['avg_profit_per_cycle']:.2f}")
    print(f"Unrealized P&L: ${results['unrealized_pnl']:.2f}")
    print(f"Active Positions: {results['active_positions']}")
    print(f"ROI: {results['roi']:.2f}%")
```

## Advanced Optimization

### Dynamic Grid Adjustment
- **Volatility-based spacing:** Widen grids in high volatility (ATR-based)
- **Auto-recentering:** Shift base price as market moves
- **Geometric grids:** Increase spacing at extremes (more capital at center)

### Risk Controls
- **Max inventory limits:** Cap total asset accumulation
- **Hedging:** Use perpetual futures to hedge directional risk
- **Cross-pair arbitrage:** Run correlated grids (BTC/ETH ratio)

## Conclusion

Grid trading excels in range-bound, volatile markets common in crypto. It provides consistent small profits through automation, but requires careful range selection and risk management. Best suited for patient traders willing to lock capital for weeks-months in exchange for steady returns.
