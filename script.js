const digitIds = ['d0', 'd1', 'd2', 'd3', 'd4', 'd5'];

// Populate each digit column with 0-9
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

  // Get hours, minutes, seconds with leading zeros
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  const s = now.getSeconds().toString().padStart(2, '0');
  const timeStr = h + m + s; // Combined string like "024508"

  // Loop through each digit position and animate to current number
  digitIds.forEach((id, i) => {
    const num = parseInt(timeStr[i]);
    const el = document.getElementById(id);
    const container = el.parentElement; // The .digit-container
    const height = container.clientHeight;

    el.style.transition = 'transform 0.4s ease-in-out';
    el.style.transform = `translateY(-${num * height}px)`;
  });

  // Special bounce animation at exactly midnight
  if (timeStr === '000000') {
    digitIds.forEach(id => {
      const el = document.getElementById(id);
      el.style.transform += ' scale(0.95)';
      setTimeout(() => {
        el.style.transform = el.style.transform.replace(' scale(0.95)', '');
      }, 300);
    });
  }

  // Show human-readable time and timezone
  document.getElementById("readableTime").textContent = now.toLocaleTimeString();
  document.getElementById("timezone").textContent = Intl.DateTimeFormat().resolvedOptions().timeZone;
}

// Initial call and update every second
updateClock();
setInterval(updateClock, 1000);
