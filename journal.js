document.getElementById('tradeForm').addEventListener('submit', function (e) {
  e.preventDefault();

  // Gather the form values
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

  // Create a new trade object
  const newTrade = {
    date,
    time,
    session,
    pair,
    setup,
    entry,
    timeframe,
    buySell,
    pips,
    outcome,
  };

  // Retrieve existing trades from localStorage or initialize as an empty array
  const tradeEntries = JSON.parse(localStorage.getItem('tradeEntries')) || [];

  // Add the new trade to the array
  tradeEntries.push(newTrade);

  // Save the updated trade entries back to localStorage
  localStorage.setItem('tradeEntries', JSON.stringify(tradeEntries));

  // Add the new trade to the card list
  addTradeToCards(newTrade, tradeEntries.length - 1);

  // Reset the form after submission
  document.getElementById('tradeForm').reset();
});

// Function to load and display trades from localStorage
function loadTrades() {
  const tradeEntries = JSON.parse(localStorage.getItem('tradeEntries')) || [];
  tradeEntries.forEach((trade, index) => {
    addTradeToCards(trade, index);
  });
}

// Function to add a trade as a minimized card with View, Delete, and Print buttons
function addTradeToCards(trade, index) {
  const tradesList = document.getElementById('tradesList');
  const tradeCard = document.createElement('div');
  tradeCard.classList.add('trade-card', 'minimized'); // Start as minimized

  tradeCard.innerHTML = `
    <h3>Trade ${index + 1}</h3>
    <div class="card-details" style="display: none;"> <!-- Initially hidden -->
      <p><strong>Date:</strong> ${trade.date}</p>
      <p><strong>Time:</strong> ${trade.time}</p>
      <p><strong>Session:</strong> ${trade.session}</p>
      <p><strong>Pair:</strong> ${trade.pair}</p>
      <p><strong>Setup:</strong> ${trade.setup}</p>
      <p><strong>Playbook Entry:</strong> ${trade.entry}</p>
      <p><strong>Timeframe:</strong> ${trade.timeframe}</p>
      <p><strong>Buy/Sell:</strong> ${trade.buySell}</p>
      <p><strong>Pips:</strong> ${trade.pips}</p>
      <p><strong>Outcome:</strong> ${trade.outcome}</p>
    </div>
    <button class="view-btn">View</button>
    <button class="delete-btn" data-index="${index}">Delete</button>
    <button class="print-btn" data-index="${index}">Print</button>
  `;

  tradesList.appendChild(tradeCard);

  // Add event listener for the View button
  const viewButton = tradeCard.querySelector('.view-btn');
  viewButton.addEventListener('click', function () {
    toggleCardDetails(tradeCard, viewButton);
  });

  // Add event listener for the Delete button
  tradeCard.querySelector('.delete-btn').addEventListener('click', function () {
    deleteTrade(index);
  });

  // Add event listener for the Print button
  tradeCard.querySelector('.print-btn').addEventListener('click', function () {
    printTradeAsPDF(trade);
  });
}

// Function to toggle card details
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
}

function deleteTrade(index) {
  // Check if modal already exists, remove it
  let existingModal = document.getElementById("deleteModal");
  if (existingModal) {
    existingModal.remove();
  }

  // Create modal container
  let modal = document.createElement("div");
  modal.id = "deleteModal";
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  modal.style.display = "flex";
  modal.style.alignItems = "center";
  modal.style.justifyContent = "center";
  modal.style.zIndex = "1001";
  modal.style.fontSize = "10px";

  // Create modal content
  let modalContent = document.createElement("div");
  modalContent.style.backgroundColor = "#000";
  modalContent.style.color = "#FFD700";
  modalContent.style.border = "2px solid #FFD700";
  modalContent.style.padding = "20px";
  modalContent.style.textAlign = "center";
  modalContent.style.fontFamily = "'Press Start 2P', sans-serif";
  modalContent.style.maxWidth = "300px";
  modalContent.style.borderRadius = "10px";

  // Create confirmation text
  let text = document.createElement("p");
  text.textContent = "ARE YOU SURE TO DELETE?";
  modalContent.appendChild(text);

  // Create Yes button
  let confirmBtn = document.createElement("button");
  confirmBtn.textContent = "YES";
  confirmBtn.style.backgroundColor = "#FFD700";
  confirmBtn.style.color = "#000";
  confirmBtn.style.border = "none";
  confirmBtn.style.padding = "10px 20px";
  confirmBtn.style.cursor = "pointer";
  confirmBtn.style.fontSize = "10px";
  confirmBtn.style.margin = "10px";
  confirmBtn.style.fontFamily = "'Press Start 2P', sans-serif";
  confirmBtn.onclick = function () {
    // Retrieve existing trades from localStorage
    const tradeEntries = JSON.parse(localStorage.getItem("tradeEntries")) || [];

    // Remove the trade at the specified index
    tradeEntries.splice(index, 1);

    // Save the updated trade entries back to localStorage
    localStorage.setItem("tradeEntries", JSON.stringify(tradeEntries));

    // Reload the trades to update the card list
    document.getElementById("tradesList").innerHTML = "";
    loadTrades();

    // Remove modal
    modal.remove();
  };

  // Create No button
  let cancelBtn = document.createElement("button");
  cancelBtn.textContent = "NO";
  cancelBtn.style.backgroundColor = "#FFD700";
  cancelBtn.style.color = "#000";
  cancelBtn.style.border = "none";
  cancelBtn.style.padding = "10px 20px";
  cancelBtn.style.cursor = "pointer";
  cancelBtn.style.fontSize = "10px";
  cancelBtn.style.margin = "10px";
  cancelBtn.style.fontFamily = "'Press Start 2P', sans-serif";
  cancelBtn.onclick = function () {
    modal.remove();
  };

  // Append buttons to modal content
  modalContent.appendChild(confirmBtn);
  modalContent.appendChild(cancelBtn);
  modal.appendChild(modalContent);

  // Append modal to body
  document.body.appendChild(modal);
}

// Function to print trade details as PDF
function printTradeAsPDF(trade) {
  const { jsPDF } = window.jspdf;  // Initialize jsPDF

  const doc = new jsPDF();

  // Add the trade details to the PDF
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

  // Download the PDF
  doc.save(`trade-${trade.date}-${trade.time}.pdf`);
}

// Load trades when the page is loaded
document.addEventListener('DOMContentLoaded', loadTrades);
