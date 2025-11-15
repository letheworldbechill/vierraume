const rooms = document.querySelectorAll(".room");
const summaryText = document.getElementById("summaryText");

/* Toggle Room */
function toggleRoom(el, name) {
  el.classList.toggle("done");

  const checkbox = el.querySelector(".task-checkbox");
  checkbox.checked = el.classList.contains("done");

  saveProgress();
  updateSummary();
}


/* Save Progress */
function saveProgress() {
  const status = [...rooms].map(r => r.classList.contains("done"));
  localStorage.setItem("roomProgress", JSON.stringify(status));

  const date = new Date().toLocaleDateString();
  localStorage.setItem("lastUpdated", date);
}


/* Load Progress */
function loadProgress() {
  const status = JSON.parse(localStorage.getItem("roomProgress"));

  if (status) {
    status.forEach((done, i) => {
      if (done) {
        rooms[i].classList.add("done");
        rooms[i].querySelector(".task-checkbox").checked = true;
      }
    });
  }

  updateSummary();
}


/* Summary Text */
function updateSummary() {
  const doneCount = document.querySelectorAll(".room.done").length;

  if (doneCount === 4) {
    summaryText.textContent = "🌿 Alle vier Räume sind vollständig frei. Ruhe erreicht.";
    saveHistory(4);
  } 
  else if (doneCount > 0) {
    summaryText.textContent = `✨ ${doneCount} von 4 Räumen sind frei.`;
  } 
  else {
    summaryText.textContent = "Noch kein Raum vollständig frei.";
  }
}


/* Reset Day */
function resetDay() {
  rooms.forEach(r => {
    r.classList.remove("done");
    r.querySelector(".task-checkbox").checked = false;
  });

  localStorage.removeItem("roomProgress");
  summaryText.textContent = "Neuer Tag gestartet.";
}


/* History / Chart */
function saveHistory(value) {
  let data = JSON.parse(localStorage.getItem("clarityHistory")) || [];
  const date = new Date().toLocaleDateString();

  if (!data.find(d => d.date === date)) {
    data.push({ date, value });
    if (data.length > 7) data.shift();
    localStorage.setItem("clarityHistory", JSON.stringify(data));
    renderChart(data);
  }
}


function renderChart(data) {
  const ctx = document.getElementById("chart").getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.map(d => d.date),
      datasets: [{
        label: "Freie Räume",
        data: data.map(d => d.value),
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 4,
          ticks: { stepSize: 1 }
        }
      }
    }
  });
}


/* Init */
window.addEventListener("load", () => {
  loadProgress();
  const data = JSON.parse(localStorage.getItem("clarityHistory")) || [];
  if (data.length) renderChart(data);
});
