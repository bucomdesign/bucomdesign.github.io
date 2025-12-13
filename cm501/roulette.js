
const sections = {
  1: ["Michaela","Izzy","Savannah","Tala","Natalie","Ava","HaoYuan","Jocelyn","Sydney","Anna",
      "Lheyaa","Julie","Alisa","Olivia","Nancy","Blair","Victoria","Nia","Muneeb","Donald"],
  2: ["Lance","Anna","Kayla","Delia","Keira","Samantha","Erin","Mickie","Kirsten","Ananya",
      "Amanda","Zoe","Maddy","Kacey","Mily","Mina","Amelia","Nadezhda","Marina","Yiyu"],
  3: ["Kaylin","Becky","Piper","Olivia","Teresa","Will","Ali","Sidi","Emily","Scarlett",
      "Crystal","Ziyi","Ava","Nikki","Annie","Lincoln","Erik","Jessica","Sanyu","Claudia"]
};

// Fun GIFs for winners
const winGifs = [
  "https://media.giphy.com/media/l0amJzVHIAfl7jMDos/giphy.gif", // Minions cheering
  "https://media.giphy.com/media/nVxZT5UwcE652/giphy.gif",      // Office dance
  "https://media.giphy.com/media/kyLYXonQYYfwYDIeZl/giphy.gif", // Pikachu
  "https://media.giphy.com/media/artj9tzCn9s4/giphy.gif",        // Spongebob
  "https://media.giphy.com/media/11sBLVxNs7v6WA/giphy.gif",      // Minions clapping
  "https://media.giphy.com/media/Is1O1TWV0LEJi/giphy.gif",       // Patrick Star
  "https://media.giphy.com/media/IwAZ6dvvvaTtdI8rIn/giphy.gif"   // The Office YES
];

// Initialize picked lists from localStorage
const picked = {
  1: JSON.parse(localStorage.getItem('picked1')) || [],
  2: JSON.parse(localStorage.getItem('picked2')) || [],
  3: JSON.parse(localStorage.getItem('picked3')) || []
};

const resultEl = document.getElementById('result');
const spinBtn = document.getElementById('spinBtn');
const statusMsg = document.getElementById('status-msg');
const gifEl = document.getElementById('win-gif');

let isSpinning = false;
let rouletteInterval;

function updateSectionInfo() {
  const section = document.getElementById("section").value;
  if (!picked[section]) picked[section] = []; // Safety check
  const count = picked[section].length;
  const total = sections[section].length;
  
  if (statusMsg) statusMsg.innerText = `Picked: ${count} / ${total}`;
  if (resultEl) {
      resultEl.innerText = "?";
      resultEl.style.opacity = "1";
      resultEl.style.transform = "scale(1)";
  }
  if (gifEl) gifEl.style.display = "none";
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
  if (gifEl) gifEl.style.display = "none";
  
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
  
  // Update UI Text
  resultEl.innerText = `${winner}`;
  resultEl.style.opacity = 1;
  resultEl.style.transform = "scale(1.1)";
  
  // Show Random GIF
  const randomGif = winGifs[Math.floor(Math.random() * winGifs.length)];
  if(gifEl) {
      gifEl.src = randomGif;
      gifEl.style.display = "block";
  }
  
  spinBtn.innerText = "Pick Student";
  spinBtn.style.opacity = "1";
  spinBtn.disabled = false;
  isSpinning = false;
  
  updateSectionInfo(); // Update counts
  statusMsg.innerText = `Winner!`;

  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#CC0000', '#000000', '#ffffff'],
    zIndex: 10001 // Ensure it's above modal
  });
}

function resetSection() {
  if(confirm("Are you sure you want to reset the history for this section?")) {
    const section = document.getElementById("section").value;
    picked[section] = [];
    localStorage.setItem(`picked${section}`, JSON.stringify([]));
    updateSectionInfo();
  }
}

// Initial Load
document.addEventListener('DOMContentLoaded', updateSectionInfo);

