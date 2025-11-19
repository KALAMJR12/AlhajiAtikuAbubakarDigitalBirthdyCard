const usernameInput = document.getElementById("username");
const startBtn = document.getElementById("start-btn");
const quizDiv = document.getElementById("quiz");
const landingDiv = document.getElementById("landing");
const finalDiv = document.getElementById("final");

const qText = document.getElementById("question-text");
const optBox = document.getElementById("options");
const feedback = document.getElementById("feedback");
const scoreText = document.getElementById("score-text");

let current = 0;
let score = 0;
let username = "";

// Basic Sample Questions
const questions = [
  {
    q: "What year was Atiku born?",
    options: ["1942", "1946", "1950", "1952"],
    ans: 1
  },
  {
    q: "Atiku served as Vice President under which administration?",
    options: ["Jonathan", "Buhari", "Obasanjo", "Yar’adua"],
    ans: 2
  },
  {
    q: "Which state is Atiku from?",
    options: ["Kaduna", "Adamawa", "Kano", "Sokoto"],
    ans: 1
  }
];

startBtn.onclick = () => {
  username = usernameInput.value.trim();
  if (!username) return alert("Enter your name!");

  landingDiv.classList.add("hidden");
  quizDiv.classList.remove("hidden");
  loadQuestion();
};

function loadQuestion() {
  let q = questions[current];
  qText.textContent = q.q;

  optBox.innerHTML = "";
  q.options.forEach((opt, i) => {
    let btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => check(i);
    optBox.appendChild(btn);
  });
}

function check(i) {
  if (i === questions[current].ans) {
    score++;
    feedback.textContent = "Correct!";
    feedback.style.color = "green";
  } else {
    feedback.textContent = "Wrong!";
    feedback.style.color = "red";
  }

  setTimeout(() => {
    feedback.textContent = "";
    current++;
    if (current >= questions.length) return finish();
    loadQuestion();
  }, 800);
}

function finish() {
  quizDiv.classList.add("hidden");
  finalDiv.classList.remove("hidden");

  scoreText.textContent = `${username}, you scored ${score} / ${questions.length}`;

  // Fill share card data
  document.getElementById("sc-username").textContent = username;
  document.getElementById("sc-score").textContent = `Score: ${score}/${questions.length}`;
}

/* ==== GENERATE SHARE IMAGE ==== */
async function generateImage() {
  const element = document.getElementById("share-card");
  return await html2canvas(element, { scale: 2 });
}

/* ==== DOWNLOAD ==== */
document.getElementById("download-btn").onclick = async () => {
  const canvas = await generateImage();
  const link = document.createElement("a");
  link.download = "Atiku_Birthday_Card.png";
  link.href = canvas.toDataURL();
  link.click();
};

/* ==== WhatsApp STATUS SHARE ==== */
document.getElementById("share-whatsapp").onclick = async () => {
  const canvas = await generateImage();
  canvas.toBlob((blob) => {
    const file = new File([blob], "atiku-card.png", { type: "image/png" });
    const data = {
      files: [file],
      text: "My Atiku Birthday Quiz Result!"
    };
    if (navigator.canShare && navigator.canShare(data)) {
      navigator.share(data);
    } else {
      alert("Your device does not support direct WhatsApp image sharing.");
    }
  });
};

/* FACEBOOK SHARE */
document.getElementById("share-facebook").onclick = () => {
  const url = encodeURIComponent(window.location.href);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
};
