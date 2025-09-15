const sections = {
  1: ["Michaela","Izzy","Savannah","Tala","Natalie","Ava","HaoYuan","Jocelyn","Sydney","Anna",
      "Lheyaa","Julie","Alisa","Olivia","Nancy","Blair","Victoria","Nia","Muneeb","Donald"],
  2: ["Lance","Anna","Kayla","Delia","Keira","Samantha","Erin","Mickie","Kirsten","Ananya",
      "Amanda","Zoe","Maddy","Kacey","Mily","Mina","Amelia","Nadezhda","Marina","Yiyu"],
  3: ["Kaylin","Becky","Piper","Olivia","Teresa","Will","Ali","Sidi","Emily","Scarlett",
      "Crystal","Ziyi","Ava","Nikki","Annie","Lincoln","Erik","Jessica","Sanyu","Claudia"]
};

const picked = {
  1: JSON.parse(localStorage.getItem('picked1')) || [],
  2: JSON.parse(localStorage.getItem('picked2')) || [],
  3: JSON.parse(localStorage.getItem('picked3')) || []
};

let rouletteInterval;

function startRoulette() {
  const section = document.getElementById("section").value;
  const available = sections[section].filter(s => !picked[section].includes(s));

  if (available.length === 0) {
    document.getElementById("result").innerText = "✅ All students picked! Reset to start again.";
    return;
  }

  let i = 0;
  rouletteInterval = setInterval(() => {
    document.getElementById("result").innerText = available[i % available.length];
    document.getElementById("result").classList.remove("highlight");
    i++;
  }, 100);

  setTimeout(() => {
    clearInterval(rouletteInterval);
    const student = available[Math.floor(Math.random() * available.length)];
    picked[section].push(student);

    localStorage.setItem(`picked${section}`, JSON.stringify(picked[section]));

    const resultDiv = document.getElementById("result");
    resultDiv.innerText = `🎯 ${student}`;
    resultDiv.classList.add("highlight");

    fireConfetti();
  }, 3000);
}

function resetSection() {
  const section = document.getElementById("section").value;
  picked[section] = [];
  localStorage.setItem(`picked${section}`, JSON.stringify([]));
  const resultDiv = document.getElementById("result");
  resultDiv.innerText = `🔄 Section ${section} reset. Ready to go again!`;
  resultDiv.classList.remove("highlight");
}

function fireConfetti() {
  const duration = 2 * 1000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 } });
    confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 } });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
