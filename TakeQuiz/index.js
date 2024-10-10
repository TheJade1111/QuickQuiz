document.addEventListener("DOMContentLoaded", () => {
  showQuestion(0);
  questionCounter(1);
  headerScore();
});
let questionCount = 0;
let questionNumb = 1;
let correct = 0;
let userScore=0;
const nextBtn = document.querySelector(".next-btn");
const optionList = document.querySelector(".option-list");
const quizBox = document.querySelector(".quiz-box");
const resultBox = document.querySelector(".result-box");
const tryAgainBtn = document.querySelector(".tryAgain-btn");
const goHomeBtn = document.querySelector(".goHome-btn");

function showQuestion(index) {
  const questionText = document.querySelector(".question-text");
  questionText.textContent = `${questions[index].numb}. ${questions[index].question}`;

  let optionTag = `<div class="option"><span>${questions[index].options[0]}</span></div>
                   <div class="option"><span>${questions[index].options[1]}</span></div>
                   <div class="option"><span>${questions[index].options[2]}</span></div>
                   <div class="option"><span>${questions[index].options[3]}</span></div>`;

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
    answer.classList.add("correct");
    userScore+=1;
    headerScore();
  }
  else{
    answer.classList.add("incorrect");

    for(let i=0;i<allOptions;i++){
      if(optionList.children[i].textContent==correctAnswer){
        optionList.children[i].setAttribute("class","option correct");
      }
    }
  }
  for(let i=0;i<allOptions;i++){
    optionList.children[i].classList.add("disabled");
  }
  nextBtn.classList.add("active");
}


nextBtn.addEventListener("click", () => {
  if (questionCount < questions.length - 1) {
    questionCount++;
    showQuestion(questionCount);
    questionNumb++;
    questionCounter(questionNumb);
    nextBtn.classList.remove("active");
  } else {
    showResultBox();
  }
});

tryAgainBtn.addEventListener("click",()=>{
   quizBox.classList.add("active");
   nextBtn.classList.remove("active");
   resultBox.classList.remove("active");

   questionCount=0;
   questionNumb=1;
   userScore=0;
   showQuestions(questionCount);
   questionCounter(questionNumb);
   headerScore();
});

goHomeBtn.addEventListener("click",()=>{
  quizSection.classList.remove("active");
  nextBtn.classList.remove("active");
  resultBox.classList.remove("active");

  questionCount=0;
  questionNumb=1;
  userScore=0;
  showQuestions(questionCount);
  questionCounter(questionNumb);
  headerScore();
});

function questionCounter(index) {
  const questionTotal = document.querySelector(".question-total");
  questionTotal.textContent = `${index} of ${questions.length} Questions`;
}

function headerScore(){
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
  let progressEndValue=(userScore/questions.length)*100;
  let speed=20;

  let progress=setInterval(() => {
    progressStartValue++;
    progressValue.textContent=`${progressStartValue}%`;
    circularProgress.style.background=`conic-gradient(red ${progressStartValue*3.6}deg,rgba(255,255,255,0.1) 0deg);`
    if(progressStartValue==progressEndValue){
      clearInterval(progress);
    }
  }, speed);
}