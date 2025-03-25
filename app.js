// Function to update stats and win rates
function updateStatsAndWinRates() {
  // Get trade entries from localStorage
  const tradeEntries = JSON.parse(localStorage.getItem('tradeEntries')) || [];
  const totalTrades = tradeEntries.length;

  // Calculate basic win/loss stats
  const wins = tradeEntries.filter(entry => entry.outcome === 'Win').length;
  const losses = tradeEntries.filter(entry => entry.outcome === 'Lose').length;

  // Calculate win streak
  let winStreak = 0;
  let maxWinStreak = 0;
  tradeEntries.forEach(entry => {
      if (entry.outcome === 'Win') {
          winStreak++;
          maxWinStreak = Math.max(maxWinStreak, winStreak);
      } else if (entry.outcome === 'Lose') {
          winStreak = 0;
      }
  });

  // Calculate setup win rates
  const setupStats = {};
  ['setup1', 'setup2', 'setup3'].forEach(setup => {
      const setupTrades = tradeEntries.filter(entry => entry.setup === setup);
      const winRate = setupTrades.length 
          ? (setupTrades.filter(e => e.outcome === 'Win').length / setupTrades.length) * 100 
          : 0;
      setupStats[setup] = winRate;
  });

  // Calculate pip statistics
  const totalPips = tradeEntries.reduce((acc, entry) => {
      return entry.outcome === 'Win' || entry.outcome === 'Breakeven'
          ? acc + Math.abs(entry.pips)
          : acc - Math.abs(entry.pips);
  }, 0);

  const averagePips = totalTrades ? totalPips / totalTrades : 0;
  const winRate = totalTrades ? (wins / totalTrades) * 100 : 0;

  // Update overall stats display
  const statsToUpdate = {
      'win-rate': `${winRate.toFixed(2)}%`,
      'total-trades': totalTrades,
      'total-pips': totalPips.toFixed(2),
      'average-pips': averagePips.toFixed(2),
      'wins': wins,
      'losses': losses,
      'win-streak': winStreak,
      'setup1-win-rate': `${setupStats.setup1.toFixed(2)}%`,
      'setup2-win-rate': `${setupStats.setup2.toFixed(2)}%`,
      'setup3-win-rate': `${setupStats.setup3.toFixed(2)}%`
  };

  Object.entries(statsToUpdate).forEach(([id, value]) => {
      document.getElementById(id).textContent = value;
  });

  // Update entry type win rates
  ['entry1', 'entry2', 'entry3', 'entry4', 'entry5'].forEach((entry, index) => {
      const filteredTrades = tradeEntries.filter(trade => trade.entry === entry);
      const winRate = filteredTrades.length 
          ? (filteredTrades.filter(trade => trade.outcome === 'Win').length / filteredTrades.length) * 100 
          : 0;
      document.getElementById(`entry${index+1}-win-rate`).textContent = `${winRate.toFixed(2)}%`;
  });

  // Update timeframe win rates
  ['5min', '15min', '30min', '1hr', '4hr'].forEach(timeframe => {
      const timeframeTrades = tradeEntries.filter(entry => entry.timeframe === timeframe);
      const winRate = timeframeTrades.length 
          ? (timeframeTrades.filter(entry => entry.outcome === 'Win').length / timeframeTrades.length) * 100 
          : 0;
      document.getElementById(`t${timeframe}`).textContent = `${winRate.toFixed(2)}%`;
  });

  // Update session win rates
  ['Asia', 'Pre London', 'London', 'Pre New York', 'New York'].forEach((session, index) => {
      const sessionTrades = tradeEntries.filter(entry => entry.session === session);
      const winRate = sessionTrades.length 
          ? (sessionTrades.filter(entry => entry.outcome === 'Win').length / sessionTrades.length) * 100 
          : 0;
      document.getElementById(['Asia', 'PreLondon', 'London', 'PreNewYork', 'NewYork'][index])
          .textContent = `${winRate.toFixed(2)}%`;
  });
}

// Initialize stats when page loads
document.addEventListener('DOMContentLoaded', updateStatsAndWinRates);