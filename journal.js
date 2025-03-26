// ======================
// Haptic Feedback Utility
// ======================
function triggerHaptic() {
  if (window.Telegram?.WebApp?.HapticFeedback) {
    window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
  }
}

// ======================
// Trade Form Submission
// ======================
document.getElementById('tradeForm').addEventListener('submit', function(e) {
  e.preventDefault();
  triggerHaptic();

  // Get form values
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  const session = document.getElementById('session').value;
  const pair = document.getElementById('pair').value;
  const setup = document.getElementById('setup').value;
  const entry = document.getElementById('entry').value;
  const timeframe = document.getElementById('timeframe').value;
  const buySell = document.getElementById('buySell').value;
  const pips = document.getElementById('pips').value;
  const outcome = document.getElementById('outcome').value;

  // Create trade object
  const newTrade = {
    date, time, session, pair, setup, entry, timeframe, buySell, pips, outcome
  };

  // Save to localStorage
  const tradeEntries = JSON.parse(localStorage.getItem('tradeEntries')) || [];
  tradeEntries.push(newTrade);
  localStorage.setItem('tradeEntries', JSON.stringify(tradeEntries));

  // Add to UI
  addTradeToCards(newTrade, tradeEntries.length - 1);

  // Reset form
  document.getElementById('tradeForm').reset();
});

// ======================
// Trade Card Management
// ======================
function loadTrades() {
  const tradeEntries = JSON.parse(localStorage.getItem('tradeEntries')) || [];
  tradeEntries.forEach((trade, index) => {
    addTradeToCards(trade, index);
  });
}

function addTradeToCards(trade, index) {
  const tradesList = document.getElementById('tradesList');
  const tradeCard = document.createElement('div');
  tradeCard.classList.add('trade-card', 'minimized');
  tradeCard.dataset.index = index;

  tradeCard.innerHTML = `
    <h3>Trade ${index + 1}</h3>
    <div class="card-details" style="display: none;">
      <p><strong>Date:</strong> <span class="editable" data-field="date">${trade.date}</span></p>
      <p><strong>Time:</strong> <span class="editable" data-field="time">${trade.time}</span></p>
      <p><strong>Session:</strong> <span class="editable" data-field="session">${trade.session}</span></p>
      <p><strong>Pair:</strong> <span class="editable" data-field="pair">${trade.pair}</span></p>
      <p><strong>Setup:</strong> <span class="editable" data-field="setup">${trade.setup}</span></p>
      <p><strong>Playbook Entry:</strong> <span class="editable" data-field="entry">${trade.entry}</span></p>
      <p><strong>Timeframe:</strong> <span class="editable" data-field="timeframe">${trade.timeframe}</span></p>
      <p><strong>Buy/Sell:</strong> <span class="editable" data-field="buySell">${trade.buySell}</span></p>
      <p><strong>Pips:</strong> <span class="editable" data-field="pips">${trade.pips}</span></p>
      <p><strong>Outcome:</strong> <span class="editable" data-field="outcome">${trade.outcome}</span></p>
    </div>
    <div class="card-buttons">
      <button class="view-btn">View</button>
      <button class="edit-btn">Edit</button>
      <button class="delete-btn" data-index="${index}">Delete</button>
      <button class="share-btn" data-index="${index}">Share</button>
    </div>
  `;

  tradesList.appendChild(tradeCard);

  // Add event listeners with haptic feedback
  tradeCard.querySelector('.view-btn').addEventListener('click', function() {
    triggerHaptic();
    toggleCardDetails(tradeCard, this);
  });

  tradeCard.querySelector('.edit-btn').addEventListener('click', function() {
    triggerHaptic();
    toggleEditMode(tradeCard, this);
  });

  tradeCard.querySelector('.delete-btn').addEventListener('click', function() {
    triggerHaptic();
    deleteTrade(index);
  });

  tradeCard.querySelector('.share-btn').addEventListener('click', function() {
    triggerHaptic();
    showShareOptions(trade);
  });
}

// ======================
// Card Interaction Functions
// ======================
function toggleCardDetails(card, button) {
  const details = card.querySelector('.card-details');
  const isHidden = details.style.display === 'none';

  if (isHidden) {
    details.style.display = 'block';
    card.classList.remove('minimized');
    button.textContent = 'Hide';
  } else {
    details.style.display = 'none';
    card.classList.add('minimized');
    button.textContent = 'View';
  }
  
  card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function toggleEditMode(card, button) {
  const isEditing = card.classList.contains('editing');
  
  if (isEditing) {
    saveEdits(card, button);
  } else {
    enterEditMode(card, button);
  }
}

function enterEditMode(card, button) {
  card.classList.add('editing');
  button.textContent = 'Save';
  
  const editableFields = card.querySelectorAll('.editable');
  editableFields.forEach(field => {
    field.contentEditable = 'true';
    field.style.border = '1px dashed #E6B33C';
    field.style.backgroundColor = 'rgba(230, 179, 60, 0.1)';
    field.style.padding = '2px';
    field.style.borderRadius = '3px';
    
    field.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveEdits(card, button);
      }
    });
  });
  
  const details = card.querySelector('.card-details');
  if (details.style.display === 'none') {
    details.style.display = 'block';
    card.classList.remove('minimized');
    card.querySelector('.view-btn').textContent = 'Hide';
  }
  
  setTimeout(() => {
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
  
  if ('ontouchstart' in window) {
    const dismissKeyboard = function(e) {
      if (!card.contains(e.target)) {
        saveEdits(card, button);
        document.removeEventListener('touchstart', dismissKeyboard);
      }
    };
    
    setTimeout(() => {
      document.addEventListener('touchstart', dismissKeyboard, { once: true });
    }, 300);
  }
}

function saveEdits(card, button) {
  const index = card.dataset.index;
  const tradeEntries = JSON.parse(localStorage.getItem('tradeEntries')) || [];
  const updatedTrade = tradeEntries[index];
  
  const editableFields = card.querySelectorAll('.editable');
  editableFields.forEach(field => {
    const fieldName = field.dataset.field;
    updatedTrade[fieldName] = field.textContent;
  });
  
  tradeEntries[index] = updatedTrade;
  localStorage.setItem('tradeEntries', JSON.stringify(tradeEntries));
  
  card.classList.remove('editing');
  button.textContent = 'Edit';
  
  editableFields.forEach(field => {
    field.contentEditable = 'false';
    field.style.border = 'none';
    field.style.backgroundColor = 'transparent';
  });
  
  if (document.activeElement) {
    document.activeElement.blur();
  }
}

// ======================
// Delete/Share Modals
// ======================
function deleteTrade(index) {
  triggerHaptic();
  
  let existingModal = document.getElementById('deleteModal');
  if (existingModal) existingModal.remove();

  let modal = document.createElement('div');
  modal.id = 'deleteModal';
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  modal.style.zIndex = '1001';
  modal.style.fontSize = '10px';

  let modalContent = document.createElement('div');
  modalContent.style.backgroundColor = '#000';
  modalContent.style.color = '#E6B33C';
  modalContent.style.border = '2px solid #E6B33C';
  modalContent.style.padding = '20px';
  modalContent.style.textAlign = 'center';
  modalContent.style.fontFamily = "'Press Start 2P', sans-serif";
  modalContent.style.maxWidth = '300px';
  modalContent.style.borderRadius = '10px';

  let text = document.createElement('p');
  text.textContent = 'ARE YOU SURE TO DELETE?';
  modalContent.appendChild(text);

  let confirmBtn = document.createElement('button');
  confirmBtn.textContent = 'YES';
  confirmBtn.style.backgroundColor = '#E6B33C';
  confirmBtn.style.color = '#000';
  confirmBtn.style.border = 'none';
  confirmBtn.style.padding = '10px 20px';
  confirmBtn.style.cursor = 'pointer';
  confirmBtn.style.fontSize = '10px';
  confirmBtn.style.margin = '10px';
  confirmBtn.style.fontFamily = "'Press Start 2P', sans-serif";
  confirmBtn.onclick = function() {
    triggerHaptic();
    const tradeEntries = JSON.parse(localStorage.getItem('tradeEntries')) || [];
    tradeEntries.splice(index, 1);
    localStorage.setItem('tradeEntries', JSON.stringify(tradeEntries));
    document.getElementById('tradesList').innerHTML = '';
    loadTrades();
    modal.remove();
  };

  let cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'NO';
  cancelBtn.style.backgroundColor = '#E6B33C';
  cancelBtn.style.color = '#000';
  cancelBtn.style.border = 'none';
  cancelBtn.style.padding = '10px 20px';
  cancelBtn.style.cursor = 'pointer';
  cancelBtn.style.fontSize = '10px';
  cancelBtn.style.margin = '10px';
  cancelBtn.style.fontFamily = "'Press Start 2P', sans-serif";
  cancelBtn.onclick = function() {
    triggerHaptic();
    modal.remove();
  };

  modalContent.appendChild(confirmBtn);
  modalContent.appendChild(cancelBtn);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
}

function showShareOptions(trade) {
  triggerHaptic();
  
  let existingModal = document.getElementById('shareModal');
  if (existingModal) existingModal.remove();

  let modal = document.createElement('div');
  modal.id = 'shareModal';
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  modal.style.zIndex = '1001';
  modal.style.fontSize = '10px';

  let modalContent = document.createElement('div');
  modalContent.style.backgroundColor = '#000';
  modalContent.style.color = '#E6B33C';
  modalContent.style.border = '2px solid #E6B33C';
  modalContent.style.padding = '20px';
  modalContent.style.textAlign = 'center';
  modalContent.style.fontFamily = "'Press Start 2P', sans-serif";
  modalContent.style.maxWidth = '300px';
  modalContent.style.borderRadius = '10px';

  let title = document.createElement('h3');
  title.textContent = 'Share Trade As:';
  modalContent.appendChild(title);

  const shareButtons = [
    { text: 'Text', action: () => shareTradeAsText(trade) },
    { text: 'CSV', action: () => shareTradeAsCSV(trade) },
    { text: 'PDF', action: () => shareTradeAsPDF(trade) }
  ];

  shareButtons.forEach(btn => {
    let button = document.createElement('button');
    button.textContent = btn.text;
    button.style.backgroundColor = '#E6B33C';
    button.style.color = '#000';
    button.style.border = 'none';
    button.style.padding = '10px 20px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '10px';
    button.style.margin = '10px';
    button.style.fontFamily = "'Press Start 2P', sans-serif";
    button.onclick = function() {
      triggerHaptic();
      btn.action();
      modal.remove();
    };
    modalContent.appendChild(button);
  });

  modal.appendChild(modalContent);
  document.body.appendChild(modal);
}

// ======================
// Sharing Functions
// ======================
function shareTradeAsText(trade) {
  const tradeDetails = `Trade Details:
    Date: ${trade.date}
    Time: ${trade.time}
    Session: ${trade.session}
    Pair: ${trade.pair}
    Setup: ${trade.setup}
    Playbook Entry: ${trade.entry}
    Timeframe: ${trade.timeframe}
    Buy/Sell: ${trade.buySell}
    Pips: ${trade.pips}
    Outcome: ${trade.outcome}`;

  if (navigator.share) {
    navigator.share({
      title: `Trade Details - ${trade.date} ${trade.time}`,
      text: tradeDetails
    }).catch(error => console.error('Error sharing:', error));
  } else {
    alert('Web Share API not supported. Here are the trade details:\n\n' + tradeDetails);
  }
}

function shareTradeAsCSV(trade) {
  const csvContent = `Date,Time,Session,Pair,Setup,Playbook Entry,Timeframe,Buy/Sell,Pips,Outcome\n${trade.date},${trade.time},${trade.session},${trade.pair},${trade.setup},${trade.entry},${trade.timeframe},${trade.buySell},${trade.pips},${trade.outcome}`;
  const blob = new Blob([csvContent], { type: 'text/csv' });

  if (navigator.share) {
    navigator.share({
      title: `Trade Details - ${trade.date} ${trade.time}`,
      files: [new File([blob], `trade-${trade.date}-${trade.time}.csv`, { type: 'text/csv' })]
    }).catch(error => console.error('Error sharing:', error));
  } else {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `trade-${trade.date}-${trade.time}.csv`;
    link.click();
  }
}

function shareTradeAsPDF(trade) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(12);
  doc.text(`Trade Details:`, 10, 10);
  doc.text(`Date: ${trade.date}`, 10, 20);
  doc.text(`Time: ${trade.time}`, 10, 30);
  doc.text(`Session: ${trade.session}`, 10, 40);
  doc.text(`Pair: ${trade.pair}`, 10, 50);
  doc.text(`Setup: ${trade.setup}`, 10, 60);
  doc.text(`Playbook Entry: ${trade.entry}`, 10, 70);
  doc.text(`Timeframe: ${trade.timeframe}`, 10, 80);
  doc.text(`Buy/Sell: ${trade.buySell}`, 10, 90);
  doc.text(`Pips: ${trade.pips}`, 10, 100);
  doc.text(`Outcome: ${trade.outcome}`, 10, 110);

  const pdfBlob = doc.output('blob');

  if (navigator.share) {
    navigator.share({
      title: `Trade Details - ${trade.date} ${trade.time}`,
      files: [new File([pdfBlob], `trade-${trade.date}-${trade.time}.pdf`, { type: 'application/pdf' })]
    }).catch(error => console.error('Error sharing:', error));
  } else {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(pdfBlob);
    link.download = `trade-${trade.date}-${trade.time}.pdf`;
    link.click();
  }
}

// ======================
// Filtering
// ======================
function filterTrades(filterType, customDate = null) {
  const tradeEntries = JSON.parse(localStorage.getItem('tradeEntries')) || [];
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);
  const lastMonth = new Date(today);
  lastMonth.setDate(lastMonth.getDate() - 30);

  const filteredTrades = tradeEntries.filter(trade => {
    const tradeDate = new Date(`${trade.date}T${trade.time}`);
    
    switch (filterType) {
      case 'today': return tradeDate.toDateString() === today.toDateString();
      case 'yesterday': return tradeDate.toDateString() === yesterday.toDateString();
      case 'lastWeek': return tradeDate >= lastWeek && tradeDate <= today;
      case 'lastMonth': return tradeDate >= lastMonth && tradeDate <= today;
      case 'custom': return tradeDate.toDateString() === new Date(customDate).toDateString();
      default: return true;
    }
  });

  document.getElementById('tradesList').innerHTML = '';
  filteredTrades.forEach((trade, index) => addTradeToCards(trade, index));
}

// ======================
// Filter Event Listeners
// ======================
document.getElementById('filter').addEventListener('change', function() {
  triggerHaptic();
  const filterValue = this.value;
  const customDateContainer = document.getElementById('customDateContainer');
  
  if (filterValue === 'custom') {
    customDateContainer.style.display = 'block';
  } else {
    customDateContainer.style.display = 'none';
    filterTrades(filterValue);
  }
});

document.getElementById('customDate').addEventListener('change', function() {
  triggerHaptic();
  filterTrades('custom', this.value);
});

document.getElementById('clearFilter').addEventListener('click', function() {
  triggerHaptic();
  document.getElementById('filter').value = 'all';
  document.getElementById('customDateContainer').style.display = 'none';
  filterTrades('all');
});

// ======================
// Initialization
// ======================
document.addEventListener('DOMContentLoaded', loadTrades);