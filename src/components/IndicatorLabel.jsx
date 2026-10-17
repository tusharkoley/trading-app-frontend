const descriptions = {
  rs_industry: "Relative Strength within the industry: a 0–100 percentile ranking of the stock's return over 63 trading sessions compared with its industry peers. Higher means stronger recent performance.",
  atr_14: "Average True Range over 14 trading sessions: the average daily price range, including gaps from the previous close. It measures price movement, not direction.",
  hist_volatility_20: "Historical Volatility over 20 trading sessions: how much daily returns vary, expressed on an annualized basis. Higher values mean larger price swings.",
  vwap_20: "Volume-Weighted Average Price over 20 trading sessions: the average closing price weighted by trading volume, giving busier days more influence.",
  dma_20: "20-day Moving Average: the average closing price over the last 20 trading sessions.",
  dma_50: "50-day Moving Average: the average closing price over the last 50 trading sessions.",
  dma_200: "200-day Moving Average: the average closing price over the last 200 trading sessions.",
  beta_252: "Beta over 252 trading sessions: how sensitive the stock's daily returns are to the benchmark. A value near 1 means similar sensitivity; above 1 means greater sensitivity.",
  alpha_252: "Alpha over 252 trading sessions: the annualized average return above or below the return implied by the stock's beta and the benchmark. Positive values indicate outperformance on this measure.",
};

export default function IndicatorLabel({ indicator, children }) {
  const description = descriptions[indicator];
  if (!description) return children;

  return (
    <abbr className="indicator-label" title={description} tabIndex={0}
      aria-label={`${children}: ${description}`}>
      {children}
    </abbr>
  );
}
