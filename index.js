const popupInfo = document.querySelector(".popup-info");
const exitBtn = document.querySelector(".exit-btn");
const main = document.querySelector(".main");
const continueBtn = document.querySelector(".continue-btn");
const quizSection = document.querySelector(".quiz-section");
const quizBox = document.querySelector(".quiz-box");
const resultBox = document.querySelector(".result-box");
const goHomeBtn = document.querySelector(".goHome-btn");
const choose = document.querySelector(".choose");
const countdownTime = 30;

choose.addEventListener("click",()=>{
  window.location.href = '/choose';
})

exitBtn.addEventListener("click", () => {
  popupInfo.classList.remove("active");
  main.classList.remove("active");
});

continueBtn.addEventListener("click", () => {
  quizSection.classList.add("active");
  popupInfo.classList.remove("active");
  main.classList.remove("active");
  quizBox.classList.add("active");
  showQuestions(0);
  questionCounter(1);
  headerScore();
  startTimer();
});

let questionCount = 0;
let questionNumb = 1;
let userScore = 0;
const nextBtn = document.querySelector(".next-btn");

nextBtn.addEventListener("click", () => {
  if (questionCount < questions.length - 1) {
    questionCount++;
    showQuestions(questionCount);
    questionNumb++;
    questionCounter(questionNumb);
    nextBtn.classList.remove("active");
  } else {
    showResultBox();
  }
});

const optionList = document.querySelector(".option-list");

function showQuestions(index) {
  const questionText = document.querySelector(".question-text");
  questionText.textContent = `${questions[index].numb}. ${questions[index].question}`;

  let optionTag = `<div class="option">${questions[index].options[0]}</div>
                     <div class="option">${questions[index].options[1]}</div>
                     <div class="option">${questions[index].options[2]}</div>
                     <div class="option">${questions[index].options[3]}</div>`;

  optionList.innerHTML = optionTag;

  const option = document.querySelectorAll(".option");
  for (let i = 0; i < option.length; i++) {
    option[i].setAttribute("onclick", "optionSelected(this)");
  }
}

function optionSelected(answer) {
  let userAnswer = answer.textContent;
  let correctAnswer = questions[questionCount].answer;
  let allOptions = optionList.children.length;
  if (userAnswer == correctAnswer) {
    console.log("Correct");
    answer.classList.add("correct");
    userScore += 1;
    headerScore();
  } else {
    answer.classList.add("incorrect");

    for (let i = 0; i < allOptions; i++) {
      if (optionList.children[i].textContent == correctAnswer) {
        optionList.children[i].setAttribute("class", "option correct");
      }
    }
  }
  for (let i = 0; i < allOptions; i++) {
    optionList.children[i].classList.add("disabled");
  }
  nextBtn.classList.add("active");
}

function questionCounter(index) {
  const questionTotal = document.querySelector(".question-total");
  questionTotal.textContent = `${index} of ${questions.length} Questions`;
}

function headerScore() {
  const headerScoreText = document.querySelector(".header-score");
  headerScoreText.textContent = `Score: ${userScore}/${questions.length}`;
}

function showResultBox(){
  quizBox.classList.remove("active");
  resultBox.classList.add("active");
  quizBox.remove();
  const scoreText=document.querySelector(".score-text");
  scoreText.textContent=`Your Score ${userScore} out of ${questions.length}`;

  const circularProgress=document.querySelector(".circular-progress");
  const progressValue=document.querySelector(".progress-value");
  let progressStartValue=-1;
  let progressEndValue=Math.floor((userScore/questions.length)*100);
  let speed=20;

  let progress=setInterval(() => {
    progressStartValue++;
    progressValue.textContent=`${progressStartValue}%`;
    circularProgress.style.background=`conic-gradient(#c40094 ${progressStartValue*3.6}deg,rgba(255,255,255,0.1) 0deg)`;
    if(progressStartValue==progressEndValue){
      clearInterval(progress);
    }
  }, speed);
}

function startTimer() {
  let timer = countdownTime;
  const countdownElement = document.getElementById('countdown');

  const timerInterval = setInterval(() => {
      const minutes = Math.floor(timer / 60);
      const seconds = timer % 60;

      countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

      if (timer === 0) {
          clearInterval(timerInterval);
          countdownElement.textContent = 'Time is up!';
          showResultBox();
      } else {
          timer--;
      }
  }, 1000);
}

goHomeBtn.addEventListener("click",()=>{
  quizSection.classList.remove("active");
  nextBtn.classList.remove("active");
  resultBox.classList.remove("active");
  window.location.href = '/quizz.html';
});