document.addEventListener('DOMContentLoaded', () => {
  // Fetch trade entries from localStorage or initialize an empty array
  const tradeEntries = JSON.parse(localStorage.getItem('tradeEntries')) || [];

  // Calculate total trades, wins, and losses
  const totalTrades = tradeEntries.length;
  const wins = tradeEntries.filter(entry => entry.outcome === 'Win').length;
  const losses = tradeEntries.filter(entry => entry.outcome === 'Lose').length;

  // Initialize win streak counter
  let winStreak = 0;
  let maxWinStreak = 0;

  // Iterate over the trade entries and calculate streaks
  tradeEntries.forEach(entry => {
    if (entry.outcome === 'Win') {
      winStreak++;
      if (winStreak > maxWinStreak) {
        maxWinStreak = winStreak;
      }
    } else if (entry.outcome === 'Lose') {
      winStreak = 0; // Reset win streak after a loss
    }
  });

  // setup1, setup2, and setup3 Trades
  const setup1Trades = tradeEntries.filter(entry => entry.setup === 'setup1');
  const setup2Trades = tradeEntries.filter(entry => entry.setup === 'setup2');
  const setup3Trades = tradeEntries.filter(entry => entry.setup === 'setup3');

  // Calculate win rates for setups
  const setup1WinRate = setup1Trades.length ? (setup1Trades.filter(e => e.outcome === 'Win').length / setup1Trades.length) * 100 : 0;
  const setup2WinRate = setup2Trades.length ? (setup2Trades.filter(e => e.outcome === 'Win').length / setup2Trades.length) * 100 : 0;
  const setup3WinRate = setup3Trades.length ? (setup3Trades.filter(e => e.outcome === 'Win').length / setup3Trades.length) * 100 : 0;

  // Calculate total and average pips
  const totalPips = tradeEntries.reduce((acc, entry) => {
    return entry.outcome === 'Win' || entry.outcome === 'Breakeven'
      ? acc + Math.abs(entry.pips)
      : acc - Math.abs(entry.pips);
  }, 0);

  const averagePips = totalTrades ? totalPips / totalTrades : 0;
  const winRate = totalTrades ? (wins / totalTrades) * 100 : 0;

  // Update Overall Stats
  document.getElementById('win-rate').textContent = `${winRate.toFixed(2)}%`;
  document.getElementById('total-trades').textContent = totalTrades;
  document.getElementById('total-pips').textContent = totalPips.toFixed(2);
  document.getElementById('average-pips').textContent = averagePips.toFixed(2);
  document.getElementById('wins').textContent = wins;
  document.getElementById('losses').textContent = losses;
  document.getElementById('win-streak').textContent = winStreak;

  // Update Setup Win Rates
  document.getElementById('setup1-win-rate').textContent = `${setup1WinRate.toFixed(2)}%`;
  document.getElementById('setup2-win-rate').textContent = `${setup2WinRate.toFixed(2)}%`;
  document.getElementById('setup3-win-rate').textContent = `${setup3WinRate.toFixed(2)}%`;

  // Define Entry Types for Calculation
  const entryTypes = [
    { id: 'entry1-win-rate', name: 'entry1' },
    { id: 'entry2rent-win-rate', name: 'entry2' },
    { id: 'entry3-win-rate', name: 'entry3' },
    { id: 'entry4-win-rate', name: 'entry4' },
    { id: 'entry5-win-rate', name: 'entry5' }
  ];

  // Calculate and Update Win Rates for Each Entry Type
  entryTypes.forEach(entry => {
    const filteredTrades = tradeEntries.filter(trade => trade.entry === entry.name);
    const winCount = filteredTrades.filter(trade => trade.outcome === 'Win').length;
    const winRate = filteredTrades.length ? (winCount / filteredTrades.length) * 100 : 0;
    document.getElementById(entry.id).textContent = `${winRate.toFixed(2)}%`;
  });

  // Timeframe Win Rates
  const timeframes = ['5min', '15min', '30min', '1hr', '4hr'];

  timeframes.forEach(timeframe => {
    const timeframeTrades = tradeEntries.filter(entry => entry.timeframe === timeframe);
    const timeframeWinCount = timeframeTrades.filter(entry => entry.outcome === 'Win').length;
    const timeframeWinRate = timeframeTrades.length ? (timeframeWinCount / timeframeTrades.length) * 100 : 0;
    document.getElementById(`t${timeframe}`).textContent = `${timeframeWinRate.toFixed(2)}%`;
  });

  // Session Win Rates (Asia, Pre London, London, Pre New York, New York)
  const sessions = [
    { id: 'Asia', name: 'Asia' },
    { id: 'PreLondon', name: 'Pre London' },
    { id: 'London', name: 'London' },
    { id: 'PreNewYork', name: 'Pre New York' },
    { id: 'NewYork', name: 'New York' }
  ];

  sessions.forEach(session => {
    const sessionTrades = tradeEntries.filter(entry => entry.session === session.name);
    const sessionWinCount = sessionTrades.filter(entry => entry.outcome === 'Win').length;
    const sessionWinRate = sessionTrades.length ? (sessionWinCount / sessionTrades.length) * 100 : 0;
    document.getElementById(session.id).textContent = `${sessionWinRate.toFixed(2)}%`;
  });
});
