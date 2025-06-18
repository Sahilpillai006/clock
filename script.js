const digitIds = ['d0', 'd1', 'd2', 'd3', 'd4', 'd5'];

digitIds.forEach(id => {
  const container = document.getElementById(id);
  for (let i = 0; i <= 9; i++) {
    const digit = document.createElement('div');
    digit.textContent = i;
    container.appendChild(digit);
  }
});

function updateClock() {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  const s = now.getSeconds().toString().padStart(2, '0');
  const timeStr = h + m + s;

  // Midnight drop effect
  if (timeStr === '000000') {
    digitIds.forEach(id => {
      const el = document.getElementById(id);
      el.style.transition = 'transform 0.8s ease-in-out';
      el.style.transform = `translateY(0px)`;
    });
  } else {
    digitIds.forEach((id, i) => {
      const num = parseInt(timeStr[i]);
      const el = document.getElementById(id);
      el.style.transition = 'transform 0.4s ease-in-out';
      el.style.transform = `translateY(-${num * 60}px)`;
    });
  }

  // Update readable clock & timezone
  document.getElementById("readableTime").textContent = now.toLocaleTimeString();
  document.getElementById("timezone").textContent = Intl.DateTimeFormat().resolvedOptions().timeZone;
}

updateClock();
setInterval(updateClock, 1000);
