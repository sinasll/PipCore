// Get the current date
let currentDate = new Date();

// Function to update the month and year labels
function updateCalendarLabels() {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];
  document.getElementById('monthLabel').textContent = monthNames[currentDate.getMonth()];
  document.getElementById('yearLabel').textContent = currentDate.getFullYear();
}

// Function to generate stats for the current month
function generateStats() {
  const statsContainer = document.getElementById('stats');
  statsContainer.innerHTML = ''; // Clear previous stats

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const tradeEntries = JSON.parse(localStorage.getItem('tradeEntries')) || [];

  // Filter trades for the current month
  const currentMonthTrades = tradeEntries.filter(trade => {
    const tradeDate = new Date(trade.date);
    return tradeDate.getMonth() === month && tradeDate.getFullYear() === year;
  });

  const totalTrades = currentMonthTrades.length;
  const totalPips = currentMonthTrades.reduce((total, trade) => total + parseFloat(trade.pips), 0);

  // Counting win and lose trades
  const winTrades = currentMonthTrades.filter(trade => trade.outcome.toLowerCase() === 'win').length;
  const loseTrades = currentMonthTrades.filter(trade => trade.outcome.toLowerCase() === 'lose').length;

  // Calculating win rate and average pips
  const winRate = totalTrades > 0 ? ((winTrades / totalTrades) * 100).toFixed(2) : 0;
  const averagePips = totalTrades > 0 ? (totalPips / totalTrades).toFixed(2) : 0;

  const stats = [
    { title: 'Win Rate', value: `${winRate}%` },
    { title: 'Total Trades', value: totalTrades.toString() },
    { title: 'Total Pips', value: totalPips.toFixed(2) },
    { title: 'Average Pips', value: averagePips },
    { title: 'Wins', value: winTrades.toString() },
    { title: 'Losses', value: loseTrades.toString() }
  ];

// Grouping by stats section (Win Rate, Total Trades, etc.)
const statGroups = [
  { title: 'MONTH STATS', stats: stats },
  { title: 'Setups', stats: getSetupsStats(currentMonthTrades) },
  { title: 'Entries', stats: getEntriesStats(currentMonthTrades) },
  { title: 'Timeframes', stats: getTimeframesStats(currentMonthTrades) }, // Moved above Sessions
  { title: 'Sessions', stats: getSessionsStats(currentMonthTrades) } // Moved below Timeframes
];


  // Generate stat cards for each group
  statGroups.forEach(group => {
    // Create group title and apply styles
    const groupTitle = document.createElement('h1');
    groupTitle.textContent = group.title;
    groupTitle.style.color = 'var(--accent-color)';
    groupTitle.style.fontSize = '20px'; 
    groupTitle.style.textAlign = 'center'; 
    groupTitle.style.marginBottom = '10px'; 
    statsContainer.appendChild(groupTitle);

    group.stats.forEach(stat => {
      const statCard = document.createElement('div');
      statCard.classList.add('stat-card');

      const statTitle = document.createElement('h3');
      statTitle.textContent = stat.title;

      const statValue = document.createElement('p');
      statValue.textContent = stat.value;

      statCard.appendChild(statTitle);
      statCard.appendChild(statValue);
      statsContainer.appendChild(statCard);
    });
  });
}

// Function to calculate setup stats
function getSetupsStats(trades) {
  const setups = [...new Set(trades.map(trade => trade.setup))]; // Unique setups
  return setups.map(setup => {
    const tradesForSetup = trades.filter(trade => trade.setup === setup);
    const setupWinRate = tradesForSetup.length > 0 ? 
      ((tradesForSetup.filter(trade => trade.outcome.toLowerCase() === 'win').length / tradesForSetup.length) * 100).toFixed(2)
      : 0;

    return { title: `${setup}`, value: `${setupWinRate}%` };
  });
}

// Function to calculate entry stats
function getEntriesStats(trades) {
  const entries = [...new Set(trades.map(trade => trade.entry))]; // Unique entries
  return entries.map(entry => {
    const tradesForEntry = trades.filter(trade => trade.entry === entry);
    const entryWinRate = tradesForEntry.length > 0 ? 
      ((tradesForEntry.filter(trade => trade.outcome.toLowerCase() === 'win').length / tradesForEntry.length) * 100).toFixed(2)
      : 0;

    return { title: `${entry}`, value: `${entryWinRate}%` };
  });
}

// Function to calculate timeframe stats
function getTimeframesStats(trades) {
  const timeframes = ['5min', '15min', '30min', '1hr', '4hr'];
  return timeframes.map(timeframe => {
    const tradesForTimeframe = trades.filter(trade => trade.timeframe === timeframe);
    const timeframeWinRate = tradesForTimeframe.length > 0 ? 
      ((tradesForTimeframe.filter(trade => trade.outcome.toLowerCase() === 'win').length / tradesForTimeframe.length) * 100).toFixed(2)
      : 0;

    return { title: `${timeframe} Timeframe`, value: `${timeframeWinRate}%` };
  });
}


// Function to calculate session stats
function getSessionsStats(trades) {
  const sessions = ['Asia', 'Pre London', 'London', 'Pre New York', 'New York'];
  return sessions.map(session => {
    const tradesForSession = trades.filter(trade => trade.session === session);
    const sessionWinRate = tradesForSession.length > 0 ? 
      ((tradesForSession.filter(trade => trade.outcome.toLowerCase() === 'win').length / tradesForSession.length) * 100).toFixed(2)
      : 0;

    return { title: `${session}`, value: `${sessionWinRate}%` };
  });
}

// Function to calculate timeframe stats for the calendar
function getTimeframesStats(trades) {
  // Fetch timeframes from localStorage
  const timeframes = JSON.parse(localStorage.getItem('timeframes')) || ['5min', '15min', '30min', '1hr', '4hr'];

  return timeframes.map(timeframe => {
    const tradesForTimeframe = trades.filter(trade => trade.timeframe === timeframe);
    const timeframeWinRate = tradesForTimeframe.length > 0 ?
      ((tradesForTimeframe.filter(trade => trade.outcome.toLowerCase() === 'win').length / tradesForTimeframe.length) * 100).toFixed(2)
      : 0;

    return { title: `${timeframe}`, value: `${timeframeWinRate}%` };
  });
}

// Navigation functions
function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  updateCalendarLabels();
  generateStats();
}

function prevMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  updateCalendarLabels();
  generateStats();
}

function nextYear() {
  currentDate.setFullYear(currentDate.getFullYear() + 1);
  updateCalendarLabels();
  generateStats();
}

function prevYear() {
  currentDate.setFullYear(currentDate.getFullYear() - 1);
  updateCalendarLabels();
  generateStats();
}

// Event listeners for navigation buttons
document.getElementById('nextMonth').addEventListener('click', nextMonth);
document.getElementById('prevMonth').addEventListener('click', prevMonth);
document.getElementById('nextYear').addEventListener('click', nextYear);
document.getElementById('prevYear').addEventListener('click', prevYear);

// Initial setup
updateCalendarLabels();
generateStats();
