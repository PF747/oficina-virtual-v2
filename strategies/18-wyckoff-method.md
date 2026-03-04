# Wyckoff Method

## Strategy Overview
**Type:** Structural / Price Action  
**Asset Class:** All (Equities, Crypto, Futures)  
**Timeframe:** Daily to Weekly (swing/position)  
**Risk Level:** Medium  

## Description
The Wyckoff Method, developed by Richard Wyckoff in the 1930s, reads market structure through the lens of supply/demand and the "Composite Man" — the aggregate behavior of smart money. It identifies four market phases: Accumulation, Markup, Distribution, and Markdown. The strategy enters at the Spring (end of accumulation) or Upthrust (end of distribution).

## The Four Phases

### 1. Accumulation (Smart Money Buying)
- Price in a trading range after a downtrend
- PS (Preliminary Support) → SC (Selling Climax) → AR (Automatic Rally) → ST (Secondary Test)
- **Spring:** Price briefly breaks below support, trapping bears, then reverses sharply
- Volume decreases on tests, increases on rallies

### 2. Markup (Uptrend)
- Higher highs, higher lows
- "Back-Up to the Creek" — pullback to breakout level
- SOS (Sign of Strength) — strong rally on volume

### 3. Distribution (Smart Money Selling)
- Price in a trading range after an uptrend
- PSY (Preliminary Supply) → BC (Buying Climax) → AR → ST
- **UTAD (Upthrust After Distribution):** Price briefly breaks above resistance, trapping bulls
- Volume increases on declines, decreases on rallies

### 4. Markdown (Downtrend)
- Lower highs, lower lows
- Distribution complete, smart money has exited

## Entry Conditions

### Long Entry (Spring — End of Accumulation)
1. **Context:** Clear accumulation range after a downtrend
2. **Spring:** Price breaks below range support on LOW volume (trap, not real selling)
3. **Reclaim:** Price quickly recovers back into the range within 1-3 bars
4. **Volume Confirmation:** Spring bar has notably lower volume than the Selling Climax
5. **Test:** Subsequent test of Spring low holds on even lower volume
6. **SOS:** First Sign of Strength — strong close above midpoint of range

### Short Entry (UTAD — End of Distribution)
1. **Context:** Clear distribution range after an uptrend
2. **UTAD:** Price breaks above range resistance on LOW volume (trap, not real buying)
3. **Rejection:** Price falls back into range within 1-3 bars
4. **Volume:** UTAD has lower volume than Buying Climax
5. **SOW:** Sign of Weakness — strong decline below midpoint

## Exit Conditions
- **Markup Target:** Measure the accumulation range height, project upward 2-3×
- **Distribution Target:** Measure range height, project downward 2-3×
- **Stop Loss (Long):** Below the Spring low
- **Stop Loss (Short):** Above the UTAD high
- **Trailing:** Move stop to each higher support level during markup

## Risk Management
- **Risk Per Trade:** 1-2% of account
- **Patience:** Wait for the Spring/UTAD — don't anticipate
- **Volume Confirmation:** No entry without proper volume signature
- **Phase Confirmation:** Identify at least 3 Wyckoff events before trading
- **Multiple Timeframes:** Confirm phase on weekly, enter on daily

## Example Setup
**Asset:** BTC/USD  
**Phase:** Accumulation (range $78,000-$86,000 for 6 weeks)  

**Wyckoff Events Identified:**
1. SC (Selling Climax): $76,000 spike low on massive volume
2. AR (Automatic Rally): Bounce to $86,000
3. ST (Secondary Test): Retest to $78,500 on declining volume
4. Spring: Quick dip to $77,200 on **low volume** → recovers to $79,000 same day

- **Entry:** $79,500 (after Spring reclaims range)
- **Stop:** $76,800 (below Spring + SC low) = $2,700 risk
- **Target:** Range height ($8,000) × 2 = $16,000 → $95,500
- **R:R:** 1:5.9
- **Position Size:** $2,000 risk / $2,700 = 0.74 BTC

## Pros and Cons
**Pros:** Catches major moves at the beginning, excellent R:R (1:3+), works across all markets and timeframes, reads institutional behavior, time-tested (90+ years), few but high-quality trades  
**Cons:** Subjective pattern recognition, requires extensive study, accumulation/distribution takes weeks to form, easy to mislabel phases, patience required, not suitable for scalping

## Best Market Conditions
- After extended trends that are losing momentum
- Clear trading ranges with identifiable Wyckoff events
- When volume patterns clearly distinguish phases
- Avoid: V-reversals, news-driven markets, thin/illiquid markets

## Python Pseudocode
```python
def detect_wyckoff_accumulation(df, lookback=60):
    """Detect Wyckoff accumulation structure"""
    range_data = df.tail(lookback)
    
    range_high = range_data['high'].max()
    range_low = range_data['low'].min()
    range_mid = (range_high + range_low) / 2
    
    # Find Selling Climax (highest volume bar near range low)
    low_zone = range_data[range_data['low'] < range_low + (range_high - range_low) * 0.2]
    if len(low_zone) == 0:
        return None
    sc_idx = low_zone['volume'].idxmax()
    sc_volume = low_zone.loc[sc_idx, 'volume']
    
    # Find potential Spring (break below range low on LOW volume)
    springs = range_data[
        (range_data['low'] < range_low) & 
        (range_data['close'] > range_low) &  # Recovered
        (range_data['volume'] < sc_volume * 0.5)  # Low volume
    ]
    
    if len(springs) == 0:
        return None
    
    spring = springs.iloc[-1]  # Most recent spring
    
    # Verify: subsequent bars show strength
    post_spring = df[df.index > spring.name].head(5)
    if len(post_spring) > 0 and post_spring['close'].iloc[-1] > range_mid:
        return {
            'phase': 'ACCUMULATION',
            'event': 'SPRING',
            'spring_low': spring['low'],
            'range': [range_low, range_high],
            'entry': post_spring['close'].iloc[-1],
            'stop': spring['low'] * 0.995,
            'target': range_high + (range_high - range_low) * 2,
            'sc_volume': sc_volume,
            'spring_volume': spring['volume'],
            'volume_ratio': spring['volume'] / sc_volume
        }
    return None
```
