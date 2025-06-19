// script.js

const digitIds = ['d0', 'd1', 'd2', 'd3', 'd4', 'd5'];
let alarmTime = null;
let timerEndTime = null;

const hourSel = document.getElementById("alarmHour");
const minSel = document.getElementById("alarmMinute");
const timerSel = document.getElementById("timerSelect");
const stopAlarmBtn = document.getElementById("stopAlarmBtn");
const stopTimerBtn = document.getElementById("stopTimerBtn");
const audio = document.getElementById("alarmSound");
const herTimeEl = document.getElementById("herTime");
const timerDisplay = document.getElementById("timerDisplay");
const sweetMsg = document.getElementById("sweetMessage");

// Populate digits
for (let id of digitIds) {
  const container = document.getElementById(id);
  for (let i = 0; i <= 9; i++) {
    const digit = document.createElement('div');
    digit.textContent = i;
    container.appendChild(digit);
  }
}

// Populate selects
for (let h = 0; h < 24; h++) {
  let opt = new Option(h.toString().padStart(2, '0'), h);
  hourSel.appendChild(opt);
}
for (let m = 0; m < 60; m++) {
  let opt = new Option(m.toString().padStart(2, '0'), m);
  minSel.appendChild(opt);
}
for (let t = 1; t <= 120; t++) {
  let opt = new Option(t, t);
  timerSel.appendChild(opt);
}

// Clock logic
function updateClock() {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  const s = now.getSeconds().toString().padStart(2, '0');
  const timeStr = h + m + s;

  digitIds.forEach((id, i) => {
    const num = parseInt(timeStr[i]);
    const el = document.getElementById(id);
    el.style.transform = `translateY(-${num * 60}px)`;
  });

  document.getElementById("readableTime").textContent = now.toLocaleTimeString();
  document.getElementById("timezone").textContent = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Her time
  const options = { timeZone: 'Asia/Kolkata', timeStyle: 'medium' };
  const herTime = new Intl.DateTimeFormat([], options).format(now);
  herTimeEl.textContent = `Alna's Time: ${herTime}`;

  // Alarm trigger
  if (alarmTime && `${h}:${m}` === alarmTime) {
    triggerAlarm('alarm');
    alarmTime = null;
  }

  // Timer check
  if (timerEndTime) {
    const diff = timerEndTime - now;
    if (diff <= 0) {
      triggerAlarm('timer');
      timerEndTime = null;
      timerDisplay.textContent = "Time's up!";
      return;
    }
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    timerDisplay.textContent = `Timer: ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} remaining`;
    timerDisplay.style.display = "block";
  } else {
    timerDisplay.style.display = "none";
  }

  // Sweet messages
  const hr = now.getHours();
  let message = "";
  if (hr >= 6 && hr < 9) message = "Good morning, Alna ☀️";
  else if (hr >= 12 && hr < 14) message = "Had lunch, Alna? 🍱";
  else if (hr >= 21 || hr < 2) message = "Sleep well, Alna 🌙";
  sweetMsg.textContent = message;

  // Birthday special
  if (now.getMonth() === 8 && now.getDate() === 30 && h === '00' && m === '00' && s === '00') {
    alert("Happy Birthday, Alna 🎂 You make my time worthwhile.");
    const tts = new SpeechSynthesisUtterance("Happy Birthday, Alna. You make my time worthwhile.");
    speechSynthesis.speak(tts);
  }
}

// Alarm and timer buttons
function triggerAlarm(type = 'alarm') {
  audio.play();
  document.body.classList.add("alarm-effect");
  if (type === 'alarm') stopAlarmBtn.style.display = "inline-block";
  if (type === 'timer') stopTimerBtn.style.display = "inline-block";
}

function stopEverything() {
  audio.pause();
  audio.currentTime = 0;
  document.body.classList.remove("alarm-effect");
  stopAlarmBtn.style.display = "none";
  stopTimerBtn.style.display = "none";
  timerDisplay.textContent = "";
}

stopAlarmBtn.onclick = () => { alarmTime = null; stopEverything(); };
stopTimerBtn.onclick = () => { timerEndTime = null; stopEverything(); };

document.getElementById("setAlarmBtn").onclick = () => {
  const h = hourSel.value.padStart(2, '0');
  const m = minSel.value.padStart(2, '0');
  alarmTime = `${h}:${m}`;
  alert(`Alarm set for ${alarmTime}`);
};

document.getElementById("startTimerBtn").onclick = () => {
  const mins = parseInt(timerSel.value);
  if (!isNaN(mins) && mins > 0) {
    timerEndTime = new Date(Date.now() + mins * 60000);
    alert(`Timer set for ${mins} minute(s)`);
  }
};

setInterval(updateClock, 1000);
updateClock();
