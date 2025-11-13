// Quiz Data
const quizData = [
    { question: "Which year did Atiku become Nigeria's Vice President?", options: ["1999", "2007", "1997", "2003"], answer: "1999" },
    { question: "Which initiative focuses on youth empowerment by the foundation?", options: ["Youth Digital Impact Program", "Clean Nigeria Campaign", "Eco Fund", "None"], answer: "Youth Digital Impact Program" },
    { question: "Atiku is known for advocating which area in Nigeria?", options: ["Education", "Sports", "Transportation", "Tourism"], answer: "Education" }
];

let currentQuestion = 0;
let score = 0;

// DOM Elements
const landing = document.getElementById('landing');
const startBtn = document.getElementById('start-btn');
const quiz = document.getElementById('quiz');
const questionText = document.getElementById('question-text');
const optionsDiv = document.getElementById('options');
const feedback = document.getElementById('feedback');
const final = document.getElementById('final');
const scoreText = document.getElementById('score-text');

const downloadBtn = document.getElementById('download-btn');
const shareWhatsApp = document.getElementById('share-whatsapp');
const shareFacebook = document.getElementById('share-facebook');
const shareTwitter = document.getElementById('share-twitter');
const confettiCanvas = document.getElementById('confetti-canvas');

// Start Quiz
startBtn.addEventListener('click', () => {
    landing.classList.add('hidden');
    quiz.classList.remove('hidden');
    loadQuestion();
});

// Load Question
function loadQuestion() {
    feedback.textContent = '';
    const current = quizData[currentQuestion];
    questionText.textContent = current.question;
    optionsDiv.innerHTML = '';
    current.options.forEach(option => {
        const btn = document.createElement('button');
        btn.textContent = option;
        btn.addEventListener('click', () => checkAnswer(option));
        optionsDiv.appendChild(btn);
    });
}

// Check Answer
function checkAnswer(selected) {
    const current = quizData[currentQuestion];
    if (selected === current.answer) {
        score++;
        feedback.textContent = "✅ Correct!";
        feedback.style.color = "green";
    } else {
        feedback.textContent = "❌ Wrong!";
        feedback.style.color = "red";
    }

    currentQuestion++;
    setTimeout(() => {
        if (currentQuestion < quizData.length) {
            loadQuestion();
        } else {
            showFinal();
        }
    }, 800);
}

// Show Final
function showFinal() {
    quiz.classList.add('hidden');
    final.classList.remove('hidden');
    scoreText.textContent = `You scored ${score}/${quizData.length}!`;

    // Launch confetti
    launchConfetti();
}

// Shareable Image
function captureCard() {
    html2canvas(document.getElementById('final-card')).then(canvas => {
        const link = document.createElement('a');
        link.download = 'birthday_quiz.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}

// Share Buttons
downloadBtn.addEventListener('click', captureCard);

shareWhatsApp.addEventListener('click', () => {
    const text = `I scored ${score}/${quizData.length} on the Atiku Birthday Quiz! 🎉`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
});

shareFacebook.addEventListener('click', () => {
    alert("Download the image and share on Facebook status!"); // Facebook doesn't allow direct image sharing via link
});

shareTwitter.addEventListener('click', () => {
    const text = `I scored ${score}/${quizData.length} on the Atiku Birthday Quiz! 🎉`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
});
