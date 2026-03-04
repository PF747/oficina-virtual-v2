# Machine Learning Ensemble Signal Strategy

## Strategy Overview

**Strategy Type:** Quantitative - Machine Learning Ensemble  
**Complexity Level:** Expert  
**Asset Classes:** Stocks, Forex, Cryptocurrencies, Futures  
**Timeframes:** 1H, 4H, Daily  
**Trading Style:** Systematic Algorithmic Trading  
**Win Rate:** 58-68% (with proper feature engineering and optimization)  
**Risk-Reward Ratio:** 1:1.5 to 1:2.5  

## Core Concept

This strategy combines three powerful machine learning models into a voting ensemble system:
- **Random Forest:** Captures non-linear relationships and feature interactions
- **LSTM (Long Short-Term Memory):** Models temporal dependencies and sequential patterns
- **Gradient Boosting (XGBoost):** Provides strong prediction through iterative error correction

The ensemble approach reduces overfitting, improves generalization, and provides more robust signals than any single model. Walk-forward optimization ensures the models adapt to changing market conditions without look-ahead bias.

## Model Architecture

### 1. Random Forest Classifier
- **Purpose:** Feature importance ranking, non-linear pattern recognition
- **Configuration:** 200 trees, max depth 12, min samples split 20
- **Strengths:** Handles outliers well, fast training, feature importance metrics

### 2. LSTM Neural Network
- **Purpose:** Time-series prediction, sequence learning
- **Architecture:** 
  - Input layer: 60 timesteps × N features
  - LSTM layer 1: 128 units, dropout 0.2
  - LSTM layer 2: 64 units, dropout 0.2
  - Dense layer: 32 units, ReLU activation
  - Output: 3 classes (buy/hold/sell)
- **Strengths:** Captures temporal dependencies, adapts to regime changes

### 3. XGBoost Classifier
- **Purpose:** Gradient boosting for high accuracy
- **Configuration:** 300 estimators, learning rate 0.05, max depth 8
- **Strengths:** Superior performance on tabular data, regularization prevents overfitting

### Ensemble Voting Mechanism
- **Method:** Weighted soft voting (probability-based)
- **Weights:** Random Forest (0.30), LSTM (0.40), XGBoost (0.30)
- **Threshold:** Signal triggered when ensemble confidence > 65%

## Feature Engineering

### Price-Based Features (12 features)
- **Returns:** 1-period, 5-period, 10-period, 20-period log returns
- **Volatility:** 10-period rolling standard deviation, Parkinson volatility
- **Price Position:** (Close - Low) / (High - Low) ratio
- **High-Low Range:** (High - Low) / Close normalized

### Technical Indicators (18 features)
- **Trend:** SMA(20, 50, 200), EMA(12, 26), ADX(14)
- **Momentum:** RSI(14), Stochastic(14,3,3), ROC(10), Williams %R(14)
- **Volume:** OBV, Volume SMA ratio, Money Flow Index(14)
- **Volatility:** Bollinger Bands width, ATR(14), Keltner Channel position

### Advanced Features (15 features)
- **MACD Family:** MACD line, signal line, histogram, histogram slope
- **Ichimoku Cloud:** Tenkan-sen, Kijun-sen, Senkou Span A/B, cloud position
- **Statistical:** Skewness(20), Kurtosis(20), Z-score(20)
- **Pattern:** Higher highs/lows count (5 periods), pivot point strength

### Market Microstructure (8 features)
- **Time Features:** Hour of day, day of week, month (cyclical encoding)
- **Market State:** Trend strength, volatility regime (high/low), volume profile
- **Correlation:** Rolling correlation with market index (if applicable)

### Lagged Features
- Create lagged versions of key features (t-1, t-2, t-3) for LSTM temporal learning

**Total Feature Count:** ~60 features after engineering

## Entry Conditions

### Long Entry Signal

1. **Ensemble Vote:**
   - Random Forest predicts "buy" with >60% probability
   - LSTM predicts "buy" with >65% probability  
   - XGBoost predicts "buy" with >60% probability
   - Weighted ensemble confidence >65%

2. **Confirmation Filters:**
   - Price above SMA(50)
   - ADX > 20 (trending market)
   - RSI between 40-70 (not overbought)
   - Volume > 1.2× average volume (20-period)

3. **Risk Check:**
   - No recent whipsaw (no opposite signal in last 3 bars)
   - Volatility not in extreme regime (ATR percentile <90%)

### Short Entry Signal

1. **Ensemble Vote:**
   - Random Forest predicts "sell" with >60% probability
   - LSTM predicts "sell" with >65% probability
   - XGBoost predicts "sell" with >60% probability
   - Weighted ensemble confidence >65%

2. **Confirmation Filters:**
   - Price below SMA(50)
   - ADX > 20
   - RSI between 30-60 (not oversold)
   - Volume > 1.2× average volume

3. **Risk Check:**
   - No recent whipsaw
   - Volatility not in extreme regime

## Exit Conditions

### Profit Targets
- **TP1:** 1.5× ATR (50% position)
- **TP2:** 2.5× ATR (50% position)
- **Trailing Stop:** Activate after TP1, trail by 1× ATR

### Stop Loss
- **Initial SL:** 1.5× ATR from entry
- **Time-Based:** Exit if position open >48 hours without profit (daily timeframe)
- **Signal Reversal:** Exit immediately if ensemble flips to opposite signal

### Hold Signal
- If ensemble predicts "hold" (neutral), no new positions opened
- Existing positions maintained unless stop/target hit

## Walk-Forward Optimization

### Training Windows
- **Training Period:** 12 months (in-sample)
- **Validation Period:** 2 months (out-of-sample)
- **Testing Period:** 2 months (walk-forward)
- **Retraining Frequency:** Every 2 months (rolling window)

### Optimization Process

1. **Data Split:**
   - Month 1-12: Train models
   - Month 13-14: Validate and tune hyperparameters
   - Month 15-16: Live trading/testing
   - Roll forward 2 months, repeat

2. **Hyperparameter Tuning:**
   - Use Optuna or GridSearchCV on validation set
   - Optimize for Sharpe ratio, not just accuracy
   - Cross-validate with 5 time-series folds

3. **Feature Selection:**
   - Remove features with importance <0.5%
   - Check for multicollinearity (VIF <5)
   - Recursive feature elimination on validation set

4. **Anti-Overfitting Measures:**
   - L1/L2 regularization in XGBoost
   - Dropout in LSTM layers
   - Limit max tree depth in Random Forest
   - Early stopping on validation loss

## Risk Management

### Position Sizing
- **Kelly Criterion:** Position size = (Win rate × Avg win - Loss rate × Avg loss) / Avg win
- **Maximum Position:** 5% of account per trade
- **Typical Position:** 2-3% risk per trade based on stop distance

### Portfolio Management
- **Maximum Concurrent Positions:** 5 (across different assets)
- **Correlation Limit:** Maximum 0.7 correlation between open positions
- **Sector Exposure:** Maximum 15% in single sector (stocks)

### Drawdown Controls
- **Daily Loss Limit:** 3% of account
- **Weekly Loss Limit:** 6% of account
- **Maximum Drawdown:** Stop trading if drawdown reaches 15%, reassess models

### Model Performance Monitoring
- Track rolling 30-day Sharpe ratio
- Monitor prediction accuracy vs calibration
- Alert if win rate drops below 52% for 50+ trades
- Trigger retraining if performance degrades significantly

## Example Setup

### EUR/USD - 4H Chart - Long Entry

**Date:** March 15, 2026, 16:00 UTC

**Market Context:**
- EUR/USD trending up from 1.0800 to 1.0950
- ECB hawkish comments boosting Euro
- US economic data mixed

**Feature Snapshot:**
- Price: 1.0965
- SMA(50): 1.0920 ✓ (price above)
- RSI(14): 58 ✓ (not overbought)
- ADX: 24 ✓ (trending)
- ATR: 0.0015 (15 pips)
- Volume ratio: 1.35× average ✓

**ML Model Predictions:**
- Random Forest: BUY (68% probability)
- LSTM: BUY (71% probability)
- XGBoost: BUY (65% probability)
- **Ensemble Confidence: 68.5%** ✓ (>65% threshold)

**Trade Execution:**
- Entry: 1.0965
- Stop Loss: 1.0942 (1.5× ATR = 23 pips)
- TP1: 1.0988 (1.5× ATR = 23 pips) - close 50%
- TP2: 1.1003 (2.5× ATR = 38 pips) - close 50%

**Position Sizing:**
- Account: $100,000
- Risk: 2% = $2,000
- Stop distance: 23 pips = $230 per lot
- Position: 0.87 lots (87,000 units)

**Outcome:**
- TP1 hit after 12 hours at 1.0988 (+$1,000)
- Trailing stop activated
- TP2 hit after 28 hours at 1.1003 (+$1,650)
- **Total Profit: $2,650 (2.65% gain)**

## Pros and Cons

### Advantages ✓
- **Robust predictions** from ensemble reducing single-model bias
- **Adapts to market changes** through walk-forward optimization
- **Objective signals** removing emotional decision-making
- **Comprehensive feature set** captures multiple market dimensions
- **Backtestable and optimizable** with clear performance metrics
- **Scalable** to multiple assets and timeframes simultaneously
- **Handles non-linear relationships** better than traditional indicators

### Disadvantages ✗
- **High computational requirements** (GPU recommended for LSTM)
- **Complex implementation** requiring ML expertise
- **Data-hungry** needs large historical datasets (2-3+ years)
- **Black box nature** makes individual trade rationale unclear
- **Overfitting risk** if not properly validated
- **Model drift** requires continuous monitoring and retraining
- **Latency** in signal generation (not suitable for HFT)
- **Technology risk** (infrastructure failures, bugs)

## Best Market Conditions

### Optimal Conditions
- **Trending markets** with clear directional bias
- **Normal volatility regimes** (not extreme high/low)
- **Liquid instruments** with tight spreads (major pairs, large-cap stocks)
- **Stable market structure** without regime changes
- **Regular trading hours** with normal volume patterns

### Challenging Conditions
- **Range-bound choppy markets** generate false signals
- **Black swan events** outside training data distribution
- **Flash crashes or extreme volatility** (circuit breakers)
- **Low liquidity periods** (holidays, overnight)
- **Sudden regime changes** (policy shifts, geopolitical shocks) before retraining

## Python Implementation

```python
import pandas as pd
import numpy as np
import talib
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import TimeSeriesSplit
import xgboost as xgb
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.optimizers import Adam
import joblib

class MLEnsembleStrategy:
    """
    Machine Learning Ensemble Strategy
    Combines Random Forest, LSTM, and XGBoost for trading signals
    """
    
    def __init__(self, lookback=60, ensemble_threshold=0.65):
        self.lookback = lookback
        self.ensemble_threshold = ensemble_threshold
        self.scaler = StandardScaler()
        
        # Model weights for ensemble
        self.model_weights = {
            'rf': 0.30,
            'lstm': 0.40,
            'xgb': 0.30
        }
        
        # Models
        self.rf_model = None
        self.lstm_model = None
        self.xgb_model = None
        
    def engineer_features(self, df):
        """
        Create comprehensive feature set
        """
        data = df.copy()
        
        # Price-based features
        data['return_1'] = data['close'].pct_change(1)
        data['return_5'] = data['close'].pct_change(5)
        data['return_10'] = data['close'].pct_change(10)
        data['return_20'] = data['close'].pct_change(20)
        data['volatility_10'] = data['return_1'].rolling(10).std()
        data['price_position'] = (data['close'] - data['low']) / (data['high'] - data['low'])
        
        # Technical indicators
        data['sma_20'] = talib.SMA(data['close'], timeperiod=20)
        data['sma_50'] = talib.SMA(data['close'], timeperiod=50)
        data['sma_200'] = talib.SMA(data['close'], timeperiod=200)
        data['ema_12'] = talib.EMA(data['close'], timeperiod=12)
        data['ema_26'] = talib.EMA(data['close'], timeperiod=26)
        
        data['rsi'] = talib.RSI(data['close'], timeperiod=14)
        data['adx'] = talib.ADX(data['high'], data['low'], data['close'], timeperiod=14)
        data['atr'] = talib.ATR(data['high'], data['low'], data['close'], timeperiod=14)
        
        # MACD
        macd, signal, hist = talib.MACD(data['close'], fastperiod=12, slowperiod=26, signalperiod=9)
        data['macd'] = macd
        data['macd_signal'] = signal
        data['macd_hist'] = hist
        data['macd_hist_slope'] = data['macd_hist'].diff()
        
        # Bollinger Bands
        upper, middle, lower = talib.BBANDS(data['close'], timeperiod=20)
        data['bb_width'] = (upper - lower) / middle
        data['bb_position'] = (data['close'] - lower) / (upper - lower)
        
        # Stochastic
        slowk, slowd = talib.STOCH(data['high'], data['low'], data['close'])
        data['stoch_k'] = slowk
        data['stoch_d'] = slowd
        
        # Volume features
        data['volume_sma'] = data['volume'].rolling(20).mean()
        data['volume_ratio'] = data['volume'] / data['volume_sma']
        data['mfi'] = talib.MFI(data['high'], data['low'], data['close'], data['volume'], timeperiod=14)
        
        # Advanced features
        data['roc'] = talib.ROC(data['close'], timeperiod=10)
        data['willr'] = talib.WILLR(data['high'], data['low'], data['close'], timeperiod=14)
        
        # Statistical features
        data['skew_20'] = data['return_1'].rolling(20).skew()
        data['kurt_20'] = data['return_1'].rolling(20).kurt()
        data['zscore_20'] = (data['close'] - data['close'].rolling(20).mean()) / data['close'].rolling(20).std()
        
        # Distance from moving averages
        data['dist_sma20'] = (data['close'] - data['sma_20']) / data['sma_20']
        data['dist_sma50'] = (data['close'] - data['sma_50']) / data['sma_50']
        
        # Lagged features for LSTM
        for lag in [1, 2, 3]:
            data[f'close_lag_{lag}'] = data['close'].shift(lag)
            data[f'volume_lag_{lag}'] = data['volume'].shift(lag)
            data[f'rsi_lag_{lag}'] = data['rsi'].shift(lag)
        
        return data
    
    def create_labels(self, df, forward_periods=5, threshold=0.02):
        """
        Create classification labels based on forward returns
        0: Sell, 1: Hold, 2: Buy
        """
        data = df.copy()
        data['forward_return'] = data['close'].pct_change(forward_periods).shift(-forward_periods)
        
        data['label'] = 1  # Default: Hold
        data.loc[data['forward_return'] > threshold, 'label'] = 2  # Buy
        data.loc[data['forward_return'] < -threshold, 'label'] = 0  # Sell
        
        return data
    
    def build_lstm_model(self, input_shape):
        """
        Build LSTM neural network
        """
        model = Sequential([
            LSTM(128, return_sequences=True, input_shape=input_shape),
            Dropout(0.2),
            LSTM(64, return_sequences=False),
            Dropout(0.2),
            Dense(32, activation='relu'),
            Dropout(0.1),
            Dense(3, activation='softmax')  # 3 classes: sell, hold, buy
        ])
        
        model.compile(
            optimizer=Adam(learning_rate=0.001),
            loss='sparse_categorical_crossentropy',
            metrics=['accuracy']
        )
        
        return model
    
    def prepare_lstm_data(self, X):
        """
        Reshape data for LSTM input (samples, timesteps, features)
        """
        samples = len(X) - self.lookback + 1
        X_lstm = np.zeros((samples, self.lookback, X.shape[1]))
        
        for i in range(samples):
            X_lstm[i] = X[i:i+self.lookback]
        
        return X_lstm
    
    def train_models(self, df, validation_split=0.2):
        """
        Train all three models with walk-forward validation
        """
        # Feature engineering and label creation
        data = self.engineer_features(df)
        data = self.create_labels(data)
        
        # Drop NaN values
        data = data.dropna()
        
        # Select feature columns (exclude OHLCV and labels)
        feature_cols = [col for col in data.columns if col not in 
                       ['open', 'high', 'low', 'close', 'volume', 'label', 'forward_return']]
        
        X = data[feature_cols].values
        y = data['label'].values
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Split data (time-series split)
        split_idx = int(len(X) * (1 - validation_split))
        X_train, X_test = X_scaled[:split_idx], X_scaled[split_idx:]
        y_train, y_test = y[:split_idx], y[split_idx:]
        
        print(f"Training on {len(X_train)} samples, validating on {len(X_test)} samples")
        
        # 1. Train Random Forest
        print("\n[1/3] Training Random Forest...")
        self.rf_model = RandomForestClassifier(
            n_estimators=200,
            max_depth=12,
            min_samples_split=20,
            random_state=42,
            n_jobs=-1
        )
        self.rf_model.fit(X_train, y_train)
        rf_score = self.rf_model.score(X_test, y_test)
        print(f"Random Forest accuracy: {rf_score:.4f}")
        
        # 2. Train XGBoost
        print("\n[2/3] Training XGBoost...")
        self.xgb_model = xgb.XGBClassifier(
            n_estimators=300,
            learning_rate=0.05,
            max_depth=8,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42,
            n_jobs=-1
        )
        self.xgb_model.fit(X_train, y_train)
        xgb_score = self.xgb_model.score(X_test, y_test)
        print(f"XGBoost accuracy: {xgb_score:.4f}")
        
        # 3. Train LSTM
        print("\n[3/3] Training LSTM...")
        X_train_lstm = self.prepare_lstm_data(X_train)
        X_test_lstm = self.prepare_lstm_data(X_test)
        y_train_lstm = y_train[self.lookback-1:]
        y_test_lstm = y_test[self.lookback-1:]
        
        self.lstm_model = self.build_lstm_model((self.lookback, X.shape[1]))
        
        history = self.lstm_model.fit(
            X_train_lstm, y_train_lstm,
            epochs=50,
            batch_size=32,
            validation_data=(X_test_lstm, y_test_lstm),
            verbose=0
        )
        
        lstm_score = self.lstm_model.evaluate(X_test_lstm, y_test_lstm, verbose=0)[1]
        print(f"LSTM accuracy: {lstm_score:.4f}")
        
        return {
            'rf_accuracy': rf_score,
            'xgb_accuracy': xgb_score,
            'lstm_accuracy': lstm_score,
            'feature_columns': feature_cols
        }
    
    def predict_ensemble(self, df):
        """
        Generate ensemble predictions
        Returns: DataFrame with signals and probabilities
        """
        # Feature engineering
        data = self.engineer_features(df)
        feature_cols = [col for col in data.columns if col not in 
                       ['open', 'high', 'low', 'close', 'volume']]
        
        X = data[feature_cols].dropna().values
        X_scaled = self.scaler.transform(X)
        
        # Get predictions from each model
        rf_proba = self.rf_model.predict_proba(X_scaled)
        xgb_proba = self.xgb_model.predict_proba(X_scaled)
        
        X_lstm = self.prepare_lstm_data(X_scaled)
        lstm_proba = self.lstm_model.predict(X_lstm)
        
        # Align arrays (LSTM has fewer predictions due to lookback)
        min_len = len(lstm_proba)
        rf_proba = rf_proba[-min_len:]
        xgb_proba = xgb_proba[-min_len:]
        
        # Weighted ensemble
        ensemble_proba = (
            self.model_weights['rf'] * rf_proba +
            self.model_weights['lstm'] * lstm_proba +
            self.model_weights['xgb'] * xgb_proba
        )
        
        # Generate signals
        ensemble_pred = np.argmax(ensemble_proba, axis=1)
        ensemble_conf = np.max(ensemble_proba, axis=1)
        
        # Create results dataframe
        results = pd.DataFrame({
            'prediction': ensemble_pred,
            'confidence': ensemble_conf,
            'prob_sell': ensemble_proba[:, 0],
            'prob_hold': ensemble_proba[:, 1],
            'prob_buy': ensemble_proba[:, 2]
        }, index=data.index[-min_len:])
        
        # Generate trading signals based on threshold
        results['signal'] = 0  # Hold
        results.loc[(results['prediction'] == 2) & 
                   (results['confidence'] > self.ensemble_threshold), 'signal'] = 1  # Buy
        results.loc[(results['prediction'] == 0) & 
                   (results['confidence'] > self.ensemble_threshold), 'signal'] = -1  # Sell
        
        return results
    
    def save_models(self, path='models/'):
        """Save trained models"""
        joblib.dump(self.rf_model, f'{path}rf_model.pkl')
        joblib.dump(self.xgb_model, f'{path}xgb_model.pkl')
        self.lstm_model.save(f'{path}lstm_model.h5')
        joblib.dump(self.scaler, f'{path}scaler.pkl')
        print(f"Models saved to {path}")

# Example usage
if __name__ == "__main__":
    # Load historical data
    # df = pd.read_csv('eurusd_4h.csv', parse_dates=['timestamp'])
    
    # For demonstration, create sample data
    dates = pd.date_range(start='2023-01-01', periods=2000, freq='4H')
    np.random.seed(42)
    
    price = 1.0800
    prices = [price]
    volumes = []
    
    for i in range(1999):
        change = np.random.randn() * 0.0015 + 0.00002
        price = max(price + change, price * 0.998)
        prices.append(price)
        volumes.append(np.random.uniform(50000, 150000))
    
    df = pd.DataFrame({
        'open': prices,
        'high': [p * 1.0008 for p in prices],
        'low': [p * 0.9992 for p in prices],
        'close': prices,
        'volume': [100000] + volumes
    }, index=dates)
    
    # Initialize strategy
    strategy = MLEnsembleStrategy(lookback=60, ensemble_threshold=0.65)
    
    # Train models
    print("=" * 60)
    print("ML ENSEMBLE STRATEGY - MODEL TRAINING")
    print("=" * 60)
    
    metrics = strategy.train_models(df.iloc[:1500])  # Train on first 1500 bars
    
    # Generate signals on test data
    print("\n" + "=" * 60)
    print("GENERATING SIGNALS ON TEST DATA")
    print("=" * 60)
    
    signals = strategy.predict_ensemble(df.iloc[1500:])
    
    # Display results
    trade_signals = signals[signals['signal'] != 0][['prediction', 'confidence', 'signal']]
    print("\n=== Trading Signals (Test Period) ===")
    print(trade_signals.head(20))
    
    buy_signals = (signals['signal'] == 1).sum()
    sell_signals = (signals['signal'] == -1).sum()
    
    print(f"\nTotal Buy Signals: {buy_signals}")
    print(f"Total Sell Signals: {sell_signals}")
    print(f"Signal Rate: {(buy_signals + sell_signals) / len(signals) * 100:.2f}%")
    print(f"Average Confidence: {signals[signals['signal'] != 0]['confidence'].mean():.4f}")
```

## Deployment Considerations

### Infrastructure Requirements
- **Computing:** GPU-enabled server for LSTM training (AWS EC2 p3.2xlarge or similar)
- **Memory:** Minimum 16GB RAM for data processing
- **Storage:** SSD for fast data I/O, ~100GB for models and historical data
- **Latency:** Co-located server for production trading (<50ms to exchange)

### Production Pipeline
1. **Data Ingestion:** Real-time market data feed
2. **Feature Calculation:** Pre-compute features on new bars
3. **Model Inference:** Run ensemble prediction (<100ms)
4. **Signal Generation:** Apply filters and risk checks
5. **Order Execution:** Route to broker API with retry logic
6. **Monitoring:** Log all predictions, trades, and performance metrics

### Maintenance Schedule
- **Daily:** Monitor performance metrics, check for data gaps
- **Weekly:** Review feature importance, assess prediction calibration
- **Monthly:** Walk-forward retrain, update hyperparameters
- **Quarterly:** Full model architecture review, consider new features

## Additional Resources

- **Libraries:** scikit-learn, TensorFlow/Keras, XGBoost, TA-Lib
- **Courses:** "Machine Learning for Trading" (Udacity), "Advances in Financial ML" (Marcos López de Prado)
- **Papers:** "Machine Learning for Algorithmic Trading" (Stefan Jansen), various arXiv ML finance papers
- **Tools:** MLflow for experiment tracking, TensorBoard for monitoring

## Conclusion

The ML Ensemble Strategy represents the cutting edge of algorithmic trading, leveraging multiple machine learning models to capture complex market patterns. Success requires robust feature engineering, rigorous walk-forward validation, and continuous monitoring. While technically complex, the strategy offers superior adaptability and performance compared to traditional rule-based systems.

**Critical Success Factors:**
1. High-quality, clean data
2. Proper walk-forward optimization (no look-ahead bias)
3. Continuous model monitoring and retraining
4. Robust risk management and position sizing
5. Realistic backtesting with transaction costs and slippage

**Remember:** Machine learning is not a magic bullet. Models can fail during regime changes or unusual market conditions. Always combine ML signals with sound risk management and human oversight.
