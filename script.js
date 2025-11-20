const questions = [
    {
        question: "What is Atiku's full name?",
        options: ["Alhaji Atiku Abubakar", "Atiku Muhammad", "Atiku Ibrahim", "Atiku Hassan"],
        correct: 0
    },
    {
        question: "In which year was Atiku born?",
        options: ["1944", "1946", "1948", "1950"],
        correct: 1
    },
    {
        question: "What position did Atiku hold from 1999 to 2007?",
        options: ["Governor", "Vice President", "Senator", "Minister"],
        correct: 1
    },
    {
        question: "Which state is Atiku from?",
        options: ["Kano", "Kaduna", "Adamawa", "Katsina"],
        correct: 2
    },
    {
        question: "What university did Atiku establish?",
        options: ["Atiku University", "American University of Nigeria", "Nigerian American College", "Adamawa State University"],
        correct: 1
    }
];

let currentQuestionIndex = 0;
let score = 0;
let answered = false;
let userName = '';

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function startQuiz() {
    const nameInput = document.getElementById('user-name');
    userName = nameInput.value.trim();
    
    if (!userName) {
        alert('Please enter your name to start the quiz!');
        nameInput.focus();
        return;
    }
    
    currentQuestionIndex = 0;
    score = 0;
    answered = false;
    showScreen('quiz-page');
    loadQuestion();
}

function loadQuestion() {
    answered = false;
    const question = questions[currentQuestionIndex];
    
    document.getElementById('current-question').textContent = currentQuestionIndex + 1;
    document.getElementById('total-questions').textContent = questions.length;
    document.getElementById('question-text').textContent = question.question;
    
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.onclick = () => selectAnswer(index);
        optionsContainer.appendChild(button);
    });
    
    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').className = 'feedback';
    document.getElementById('next-btn').style.display = 'none';
}

function selectAnswer(selectedIndex) {
    if (answered) return;
    
    answered = true;
    const question = questions[currentQuestionIndex];
    const buttons = document.querySelectorAll('.option-btn');
    const feedback = document.getElementById('feedback');
    
    buttons.forEach((button, index) => {
        button.disabled = true;
        if (index === question.correct) {
            button.classList.add('correct');
        } else if (index === selectedIndex && selectedIndex !== question.correct) {
            button.classList.add('incorrect');
        }
    });
    
    if (selectedIndex === question.correct) {
        score++;
        feedback.textContent = '✓ Correct! Well done!';
        feedback.className = 'feedback correct';
    } else {
        feedback.textContent = '✗ Incorrect. The correct answer is: ' + question.options[question.correct];
        feedback.className = 'feedback incorrect';
    }
    
    document.getElementById('next-btn').style.display = 'block';
}

function nextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    showScreen('result-page');
    document.getElementById('user-name-display').textContent = userName;
    document.getElementById('score-text').textContent = `You scored ${score}/${questions.length}`;
}

async function captureCardAtFixedSize() {
    const card = document.getElementById('result-card');
    const clone = card.cloneNode(true);
    
    clone.style.position = 'fixed';
    clone.style.left = '-9999px';
    clone.style.top = '0';
    clone.style.width = '1080px';
    clone.style.height = '1350px';
    clone.style.maxWidth = 'none';
    clone.style.transform = 'none';
    clone.style.padding = '80px 60px';
    clone.style.background = '#333333';
    clone.style.border = '6px solid #D3B76C';
    clone.style.borderRadius = '20px';
    
    const title = clone.querySelector('.card-title');
    if (title) {
        title.style.fontSize = '3.6rem';
        title.style.marginBottom = '60px';
        title.style.color = '#D3B76C';
        title.style.fontWeight = '700';
    }
    
    const imageContainer = clone.querySelector('.image-container');
    if (imageContainer) {
        imageContainer.style.width = '400px';
        imageContainer.style.height = '400px';
        imageContainer.style.margin = '40px 0';
    }
    
    const profileImage = clone.querySelector('.profile-image');
    if (profileImage) {
        profileImage.style.border = '10px solid #D3B76C';
    }
    
    const sponsorText = clone.querySelector('.sponsor-text');
    if (sponsorText) {
        sponsorText.style.fontSize = '2.4rem';
        sponsorText.style.margin = '40px 0';
        sponsorText.style.color = '#D3B76C';
        sponsorText.style.fontWeight = '600';
    }
    
    const userNameDisplay = clone.querySelector('.user-name-display');
    if (userNameDisplay) {
        userNameDisplay.style.fontSize = '2.8rem';
        userNameDisplay.style.margin = '30px 0';
        userNameDisplay.style.color = '#D3B76C';
        userNameDisplay.style.fontWeight = '700';
    }
    
    const scoreText = clone.querySelector('.score-text');
    if (scoreText) {
        scoreText.style.fontSize = '3rem';
        scoreText.style.marginTop = '20px';
        scoreText.style.color = '#ffffff';
        scoreText.style.fontWeight = '700';
    }
    
    document.body.appendChild(clone);
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const canvas = await html2canvas(clone, {
        width: 1080,
        height: 1350,
        scale: 1,
        backgroundColor: '#333333',
        useCORS: true,
        allowTaint: true,
        logging: false
    });
    
    document.body.removeChild(clone);
    
    return canvas;
}

async function downloadCard() {
    try {
        const canvas = await captureCardAtFixedSize();
        
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = 'atiku-birthday-card.png';
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
        });
    } catch (error) {
        console.error('Error downloading card:', error);
        alert('Failed to download the card. Please try again.');
    }
}

async function shareToWhatsApp() {
    try {
        const canvas = await captureCardAtFixedSize();
        
        canvas.toBlob(async (blob) => {
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], 'card.png', { type: 'image/png' })] })) {
                try {
                    const file = new File([blob], 'atiku-birthday-card.png', { type: 'image/png' });
                    await navigator.share({
                        title: 'Birthday Celebration',
                        text: '🎉 Happy Birthday Alhaji Atiku! 🎉',
                        files: [file]
                    });
                } catch (shareError) {
                    if (shareError.name !== 'AbortError') {
                        alert('Your browser does not allow direct image sharing. Please download instead.');
                    }
                }
            } else {
                alert('Your browser does not allow direct image sharing. Please download the card and share manually.');
            }
        });
    } catch (error) {
        console.error('Error sharing to WhatsApp:', error);
        alert('Failed to share. Please download the card and share manually.');
    }
}

function shareToFacebook() {
    const text = encodeURIComponent('🎉 Happy Birthday Alhaji Atiku! 🎉\nTest your knowledge about Atiku!');
    const url = window.location.href;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${text}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
}

function restartQuiz() {
    showScreen('landing-page');
    document.getElementById('user-name').value = '';
    document.getElementById('user-name').focus();
}
