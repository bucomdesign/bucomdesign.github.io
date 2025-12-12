const sections = {
  1: ["Michaela","Izzy","Savannah","Tala","Natalie","Ava","HaoYuan","Jocelyn","Sydney","Anna",
      "Lheyaa","Julie","Alisa","Olivia","Nancy","Blair","Victoria","Nia","Muneeb","Donald"],
  2: ["Lance","Anna","Kayla","Delia","Keira","Samantha","Erin","Mickie","Kirsten","Ananya",
      "Amanda","Zoe","Maddy","Kacey","Mily","Mina","Amelia","Nadezhda","Marina","Yiyu"],
  3: ["Kaylin","Becky","Piper","Olivia","Teresa","Will","Ali","Sidi","Emily","Scarlett",
      "Crystal","Ziyi","Ava","Nikki","Annie","Lincoln","Erik","Jessica","Sanyu","Claudia"]
};

const emojis = ["🎯", "✨", "🎉", "🔥", "🌟", "💥", "🏆", "💫", "🎶", "🥳"];

// Initialize picked lists from localStorage
const picked = {
  1: JSON.parse(localStorage.getItem('picked1')) || [],
  2: JSON.parse(localStorage.getItem('picked2')) || [],
  3: JSON.parse(localStorage.getItem('picked3')) || []
};

const resultEl = document.getElementById('result');
const spinBtn = document.getElementById('spinBtn');
const resetBtn = document.getElementById('resetBtn');
const statusMsg = document.getElementById('status-msg');
let isSpinning = false;
let rouletteInterval;

function updateSectionInfo() {
  const section = document.getElementById("section").value;
  const count = picked[section].length;
  const total = sections[section].length;
  statusMsg.innerText = `Picked: ${count} / ${total}`;
  resultEl.innerText = "?";
  resultEl.style.opacity = "1";
  resultEl.style.transform = "scale(1)";
}

function startRoulette() {
  if(isSpinning) return;
  
  const section = document.getElementById("section").value;
  const available = sections[section].filter(s => !picked[section].includes(s));
  
  if (available.length === 0) {
    resultEl.innerText = "✅ Done!";
    statusMsg.innerText = "All students picked! Click ↻ to reset.";
    return;
  }

  isSpinning = true;
  spinBtn.innerText = "Spinning...";
  spinBtn.style.opacity = "0.7";
  spinBtn.disabled = true;
  statusMsg.innerText = "";
  
  let counter = 0;
  const maxSpins = 25;
  
  rouletteInterval = setInterval(() => {
    resultEl.innerText = available[Math.floor(Math.random() * available.length)];
    resultEl.style.opacity = 0.5;
    resultEl.style.transform = "scale(0.9)";
    counter++;
    
    if (counter > maxSpins) {
      clearInterval(rouletteInterval);
      finalizeSpin(available, section);
    }
  }, 80);
}

function finalizeSpin(available, section) {
  const winner = available[Math.floor(Math.random() * available.length)];
  
  // Update data
  picked[section].push(winner);
  localStorage.setItem(`picked${section}`, JSON.stringify(picked[section]));
  
  // Update UI
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
  resultEl.innerText = `${winner}`; // Keeping clean without emoji inside text for better spacing
  resultEl.style.opacity = 1;
  resultEl.style.transform = "scale(1.1)";
  
  spinBtn.innerText = "Pick Student";
  spinBtn.style.opacity = "1";
  spinBtn.disabled = false;
  isSpinning = false;
  
  updateSectionInfo(); // Update counts
  statusMsg.innerText = `${randomEmoji} Winner!`;

  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#CC0000', '#000000', '#ffffff']
  });
}

function resetSection() {
  if(confirm("Are you sure you want to reset the history for this section?")) {
    const section = document.getElementById("section").value;
    picked[section] = [];
    localStorage.setItem(`picked${section}`, JSON.stringify([]));
    resultEl.innerText = "?";
    updateSectionInfo();
  }
}

// Initial Load
updateSectionInfo();
