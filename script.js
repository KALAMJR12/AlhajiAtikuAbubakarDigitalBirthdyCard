/* script.js
 - Quiz logic
 - Confetti celebration
 - html2canvas export to portrait image
 - Download + Share via Web Share API (files) with fallbacks
*/

const quizData = [
  { question: "Which year did Atiku become Nigeria's Vice President?", options: ["1999","2007","1997","2003"], answer: "1999" },
  { question: "Which initiative focuses on youth empowerment by the foundation?", options: ["Youth Digital Impact Program","Clean Nigeria Campaign","Eco Fund","None"], answer: "Youth Digital Impact Program" },
  { question: "Atiku is known for advocating which area in Nigeria?", options: ["Education","Sports","Transportation","Tourism"], answer: "Education" },
  { question: "Which sector does the foundation emphasize for youth training?", options: ["Digital skills","Agriculture only","Only sports","Manufacturing"], answer: "Digital skills" },
  { question: "Who founded the Youth Digital Impact Program?", options: ["Sheik Ahmad Tijjani Umar","An NGO","State Govt","A business"], answer: "Sheik Ahmad Tijjani Umar" }
];

let currentQuestion = 0;
let score = 0;

// DOM
const landing = document.getElementById('landing');
const startBtn = document.getElementById('start-btn');
const playerNameInput = document.getElementById('playerName');

const quiz = document.getElementById('quiz');
const questionText = document.getElementById('question-text');
const optionsDiv = document.getElementById('options');
const feedback = document.getElementById('feedback');

const final = document.getElementById('final');
const scoreText = document.getElementById('score-text');

const confettiCanvas = document.getElementById('confetti-canvas');

const downloadBtn = document.getElementById('download-btn');
const shareWhatsApp = document.getElementById('share-whatsapp');
const shareFacebook = document.getElementById('share-facebook');
const shareTwitter = document.getElementById('share-twitter');
const playAgainBtn = document.getElementById('play-again');

const shareCard = document.getElementById('shareCard');
const cardName = document.getElementById('cardName');
const cardScore = document.getElementById('cardScore');

// Start quiz
startBtn.addEventListener('click', () => {
  landing.classList.add('hidden');
  quiz.classList.remove('hidden');
  currentQuestion = 0;
  score = 0;
  loadQuestion();
});

// Load question
function loadQuestion() {
  feedback.textContent = '';
  const q = quizData[currentQuestion];
  questionText.textContent = q.question;
  optionsDiv.innerHTML = '';
  q.options.forEach(opt => {
    const b = document.createElement('button');
    b.textContent = opt;
    b.addEventListener('click', () => checkAnswer(opt));
    optionsDiv.appendChild(b);
  });
}

// Check answer
function checkAnswer(selected) {
  const q = quizData[currentQuestion];
  if (selected === q.answer) {
    score++;
    feedback.textContent = '✅ Correct!';
    feedback.style.color = 'green';
  } else {
    feedback.textContent = '❌ Wrong!';
    feedback.style.color = 'red';
  }
  currentQuestion++;
  setTimeout(() => {
    if (currentQuestion < quizData.length) loadQuestion();
    else showFinal();
  }, 650);
}

// Show final
function showFinal() {
  quiz.classList.add('hidden');
  final.classList.remove('hidden');
  scoreText.textContent = `You scored ${score}/${quizData.length}!`;

  // Update off-screen share card content
  const userName = (playerNameInput.value || 'Guest').trim();
  cardName.textContent = `Name: ${userName}`;
  cardScore.textContent = `I scored ${score}/${quizData.length} on the Atiku Birthday Quiz!`;

  // Show shareCard off-screen so html2canvas can render it (keeps off-UI)
  shareCard.style.display = 'block';

  // Launch confetti
  launchConfetti();
}

// Confetti using canvas-confetti library
function launchConfetti() {
  // use the CDN confetti function
  const duration = 4 * 1000;
  const animationEnd = Date.now() + duration;

  (function frame() {
    confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 } });
    confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 } });
    if (Date.now() < animationEnd) requestAnimationFrame(frame);
  })();
}

// Generate portrait image (high quality)
async function generateShareImagePNG() {
  // ensure shareCard is visible and rendered
  shareCard.style.display = 'block';

  // html2canvas with high scale for quality
  const canvas = await html2canvas(shareCard, {
    scale: 3,
    useCORS: true,
    backgroundColor: '#ffffff'
  });

  // return as data URL and blob
  const dataUrl = canvas.toDataURL('image/png');
  const blob = await (await fetch(dataUrl)).blob();
  return { dataUrl, blob };
}

// Download image
downloadBtn.addEventListener('click', async () => {
  try {
    const { dataUrl } = await generateShareImagePNG();
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `Atiku_Birthday_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error(err);
    alert('Download failed. Please try again.');
  }
});

// Generic file share using Web Share API (files)
async function tryNativeFileShare(blob, filename, text) {
  try {
    const file = new File([blob], filename, { type: blob.type });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: 'Atiku Birthday Quiz', text });
      return true;
    }
    return false;
  } catch (err) {
    console.warn('Native share error', err);
    return false;
  }
}

// WhatsApp share: try native share (Android), fallback to wa.me with text + download prompt
shareWhatsApp.addEventListener('click', async () => {
  const shareText = `I scored ${score}/${quizData.length} on the Atiku Birthday Quiz! 🎉 Join the Atiku Movement: +234 800 000 0000`;
  try {
    const { blob } = await generateShareImagePNG();
    const didShare = await tryNativeFileShare(blob, `AtikuQuiz_${Date.now()}.png`, shareText);
    if (!didShare) {
      // fallback: direct text prefilled
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
      alert('Direct image share to WhatsApp Status is not supported by this browser. The image has been prepared — please download it and upload to your WhatsApp Status manually.');
    }
  } catch (err) {
    console.error(err);
    alert('Sharing failed. Please download the image and upload to your WhatsApp Status manually.');
  }
});

// Facebook / device share button
shareFacebook.addEventListener('click', async () => {
  const shareText = `I scored ${score}/${quizData.length} on the Atiku Birthday Quiz! 🎉`;
  try {
    const { blob } = await generateShareImagePNG();
    const didShare = await tryNativeFileShare(blob, `AtikuQuiz_${Date.now()}.png`, shareText);
    if (!didShare) {
      // Download fallback
      const { dataUrl } = await generateShareImagePNG();
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `Atiku_Birthday_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      alert('Your device/browser does not support direct image sharing. The image was downloaded for manual upload to Facebook.');
    }
  } catch (err) {
    console.error(err);
    alert('Could not share image. Please download and upload manually.');
  }
});

// Twitter share (intent link - image must be attached manually)
shareTwitter.addEventListener('click', async () => {
  const text = `I scored ${score}/${quizData.length} on the Atiku Birthday Quiz! 🎉`;
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
});

// Play again
playAgainBtn.addEventListener('click', () => {
  final.classList.add('hidden');
  landing.classList.remove('hidden');
  shareCard.style.display = 'none';
});
