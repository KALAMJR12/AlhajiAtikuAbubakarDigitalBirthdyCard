/* script.js
   - quiz logic
   - confetti launch
   - generate shareable image via html2canvas
   - download + share via Web Share API fallback
*/

const quizData = [
  { question: "Which year did Atiku become Nigeria's Vice President?", options: ["1999","2007","1997","2003"], answer: "1999" },
  { question: "Which initiative focuses on youth empowerment by the foundation?", options: ["Youth Digital Impact Program", "Clean Nigeria Campaign", "Eco Fund", "None"], answer: "Youth Digital Impact Program" },
  { question: "Atiku is known for advocating which area in Nigeria?", options: ["Education","Sports","Transportation","Tourism"], answer: "Education" },
  { question: "Which sector does the foundation emphasize for youth training?", options: ["Digital skills","Agriculture only","Only sports","Manufacturing"], answer: "Digital skills" },
  { question: "Who founded the Youth Digital Impact Program?", options: ["Sheik Ahmad Tijjani Umar", "An NGO", "State Govt", "A business"], answer: "Sheik Ahmad Tijjani Umar" }
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

// start quiz
startBtn.addEventListener('click', () => {
  landing.classList.add('hidden');
  quiz.classList.remove('hidden');
  currentQuestion = 0;
  score = 0;
  loadQuestion();
});

// load a question
function loadQuestion(){
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

// check answer
function checkAnswer(selected){
  const q = quizData[currentQuestion];
  if (selected === q.answer){
    score++;
    feedback.textContent = '✅ Correct!';
    feedback.style.color = 'green';
  } else {
    feedback.textContent = '❌ Wrong!';
    feedback.style.color = 'red';
  }
  currentQuestion++;
  setTimeout(() => {
    if (currentQuestion < quizData.length){
      loadQuestion();
    } else {
      showFinal();
    }
  }, 700);
}

// show final
function showFinal(){
  quiz.classList.add('hidden');
  final.classList.remove('hidden');
  scoreText.textContent = `You scored ${score}/${quizData.length}!`;

  // write to hidden share card
  const userName = (playerNameInput.value || 'Guest').trim();
  cardName.textContent = `Name: ${userName}`;
  cardScore.textContent = `I scored ${score}/${quizData.length} on the Atiku Birthday Quiz!`;

  // launch confetti
  launchConfetti();

  // ensure shareCard is rendered by browser (it's offscreen but visible)
  shareCard.style.display = 'block';
}

// confetti using canvas-confetti
function launchConfetti(){
  // use the included confetti lib
  const duration = 4 * 1000;
  const end = Date.now() + duration;

  (function frame(){
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
    });
    confetti({
      particleCount: 6,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

// generate image using html2canvas
async function generateShareImage() {
  // ensure share card is visible to the renderer
  shareCard.style.display = 'block';

  // use high scale for quality
  const canvas = await html2canvas(shareCard, { scale: 3, useCORS: true, backgroundColor: null });

  // restore hidden positioning (still off-screen)
  // keep shareCard off-screen so it doesn't show in UI
  shareCard.style.display = 'block';

  return canvas.toDataURL('image/png');
}

// download handler
downloadBtn.addEventListener('click', async () => {
  try {
    const dataUrl = await generateShareImage();
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `Atiku_Birthday_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    alert('Could not generate image. Please try again.');
    console.error(err);
  }
});

// share via Web Share API if supported (with file)
async function shareFileUsingWebShare(dataUrl, filename, text) {
  try {
    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], filename, { type: blob.type });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: "Atiku Birthday Quiz",
        text
      });
      return true;
    }
    return false;
  } catch (err) {
    console.warn('Web Share failed', err);
    return false;
  }
}

// WhatsApp share button - attempt native share with file, otherwise fallback to wa.me text
shareWhatsApp.addEventListener('click', async () => {
  const shareText = `I scored ${score}/${quizData.length} on the Atiku Birthday Quiz! 🎉 Join the Atiku Movement: +234 800 000 0000`;
  try {
    const dataUrl = await generateShareImage();
    const usedNative = await shareFileUsingWebShare(dataUrl, 'AtikuQuiz.png', shareText);
    if (!usedNative) {
      // fallback: direct prefilled text
      const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      window.open(waUrl, '_blank');
      alert('If you want to share an image to WhatsApp Status, download the card and upload to your Status manually (Android allows direct share via device share).');
    }
  } catch (err) {
    console.error(err);
    alert('Sharing not supported on this device. Please download the image and upload to your WhatsApp status.');
  }
});

// Facebook share
shareFacebook.addEventListener('click', async () => {
  const shareText = `I scored ${score}/${quizData.length} on the Atiku Birthday Quiz! 🎉`;
  try {
    const dataUrl = await generateShareImage();
    const usedNative = await shareFileUsingWebShare(dataUrl, 'AtikuQuiz.png', shareText);
    if (!usedNative) {
      alert('Please download the image and post to Facebook/Stories manually (or use your device share options).');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `Atiku_Birthday_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  } catch (err) {
    console.error(err);
    alert('Sharing not available — please download the image and upload to Facebook.');
  }
});

// Twitter share (link-based - image cannot be auto-uploaded)
shareTwitter.addEventListener('click', async () => {
  try {
    const text = `I scored ${score}/${quizData.length} on the Atiku Birthday Quiz! 🎉`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  } catch (err) {
    console.error(err);
  }
});

// play again
playAgainBtn.addEventListener('click', () => {
  final.classList.add('hidden');
  landing.classList.remove('hidden');
  shareCard.style.display = 'none'; // hide offscreen card
});
