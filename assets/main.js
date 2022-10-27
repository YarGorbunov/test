function bind(scope, fn) { //возвращает функцию fn с this равным scope
    return function() {
       return fn.apply(scope);//apply возвращает функцию но с фиксированным значением this
    }
 }
class Test{
    questions; // массив объектов Question
    questionTextObject; // Ссылка на текст вопроса на странице
    radioObjects;//массив ссылок на радиокнопки
    answersObjects;//массив ссылок на ярлыки радиокнопок с ответами
    buttonObject;//ссылка на кнопку для след вопроса
    currentQuestion; // номер текущего вопроса
    result;//шкала для оценки результата
    nextQuestionObject;//это поле содержит функцию nextQuestion как объект
    resultObject;//ссылка на элемент куда будем писать результат
    constructor(questions,questionTextObject,radioObjects,answersObjects,buttonObject,resultObject){
        this.questions=questions;
        this.questionTextObject=questionTextObject;
        this.radioObjects=radioObjects;
        this.answersObjects=answersObjects;
        this.buttonObject=buttonObject;
        this.resultObject=resultObject;
        this.currentQuestion=0;
        this.result=0;
        this.initTest();
    }

    initTest() {
        this.buttonObject.addEventListener("click", bind(this, this.startTest), { once: true });//событие с настройкой once само отключится после одного срабатывания
    }

    startTest(){
        this.buttonObject.innerHTML="Next question";//меняем надпись на кнопке
        this.questionTextObject.innerHTML=this.questions[0].questionText;//устанавливаем текст первого вопроса
        this.radioObjects.forEach(function(element){element.style.display="inline-block";});//включаем отображение радиокнопок
        for (let i=0;i<this.answersObjects.length;i++){//записываем варианты ответа
            this.answersObjects[i].innerHTML=this.questions[0].answers[i].answerText;
        }
        this.nextQuestionObject=bind(this, this.nextQuestion);//сохраняем функцию NextQuestion как объект, чтобы потом можно было отвязать эту функцию от кнопки(ебоманый js)
        this.buttonObject.addEventListener("click", this.nextQuestionObject);//привязываем событи к кнопке
    }

    nextQuestion(){//у меня чувство что я не пойму это утром. функция считывает выбранный ответ, записывает его, и отображает следующий
        for(let i=0;i<this.radioObjects.length;i++){ //ищем выбранный вариант
            if (this.radioObjects[i].checked===true) this.questions[this.currentQuestion].chosedAnswer=this.radioObjects[i].value;
        }
        if (this.questions[this.currentQuestion].chosedAnswer===-1) return 0; //если вариант не выбран выходим из функции
        this.result+=this.questions[this.currentQuestion].answers[this.questions[this.currentQuestion].chosedAnswer].points;//прибавляем к результату нужный балл
        this.radioObjects[this.questions[this.currentQuestion].chosedAnswer].checked=false;//убираем выбор с радиокнопок
        this.currentQuestion++;
        this.questionTextObject.innerHTML=this.questions[this.currentQuestion].questionText;//меняем текст вопроса
        for (let i=0;i<this.answersObjects.length;i++){//меняем текст вариантов ответа
            this.answersObjects[i].innerHTML=this.questions[this.currentQuestion].answers[i].answerText;
        }
        if (this.currentQuestion===this.questions.length-1) {//эта часть выполняется если вопрос на который переключились только что является последним
            this.buttonObject.removeEventListener("click", this.nextQuestionObject); //отвязываем nextQuestion от кнопки
            this.buttonObject.addEventListener("click", bind(this, this.finishTest));//привязываем finishTest взамен
            this.buttonObject.innerHTML="Finish";
        }
    }

    finishTest(){//подсчитывает последний вопрос, скрывает интерфейс теста и выводит результат
        for(let i=0;i<this.radioObjects.length;i++){ //ищем выбранный вариант
            if (this.radioObjects[i].checked===true) this.questions[this.currentQuestion].chosedAnswer=this.radioObjects[i].value;
        }
        if (this.questions[this.currentQuestion].chosedAnswer===-1) return 0; //если вариант не выбран выходим из функции
        this.result+=this.questions[this.currentQuestion].answers[this.questions[this.currentQuestion].chosedAnswer].points;//прибавляем к результату нужный балл
        this.radioObjects.forEach(function(element){element.style.display="none";});//скрываем радиокнопки
        this.answersObjects.forEach(function(element){element.style.display="none";});//скрываем радиокнопки
        this.buttonObject.style.display="none";
        this.questionTextObject.style.display="none";
        this.resultObject.innerHTML="Your result is "+this.result+" points";
    }
}
class Question{
    questionText;//текст вопроса
    answers;//массив с вариантами ответов и их разбалловками
    chosedAnswer;//выбранный вариант ответа
    constructor(questionText,answers){
        this.questionText=questionText;
        this.answers=answers;
        this.chosedAnswer=-1;
    }
}

let questionsList = [
    {
        "text":"QUESTION TEXT1",
        "answers": [
            {
                "answerText": "ANSWER TEXT1",
                "points": 1
            },
            {
                "answerText": "ANSWER TEXT2",
                "points": 2
            },
            {
                "answerText": "ANSWER TEXT3",
                "points": 3
            },
            {
                "answerText": "ANSWER TEXT4",
                "points": 4
            },
            {
                "answerText": "ANSWER TEXT5",
                "points": 5
            }
        ]
    },
    {
        "text":"QUESTION TEXT2",
        "answers": [
            {
                "answerText": "ANSWER TEXT6",
                "points": 6
            },
            {
                "answerText": "ANSWER TEXT7",
                "points": 7
            },
            {
                "answerText": "ANSWER TEXT8",
                "points": 8
            },
            {
                "answerText": "ANSWER TEXT9",
                "points": 9
            },
            {
                "answerText": "ANSWER TEXT10",
                "points": 10
            }
        ]
    }
];


window.addEventListener("DOMContentLoaded", function(){
    // i love you yarik mjbnjjuhb
    let questions=new Array(questionsList.length);
    for(let i=0;i<questions.length;i++){
        questions[i]=new Question(questionsList[i].text,questionsList[i].answers);
    }
    let questionTextObject=this.document.getElementById("question-text");
    let radioObjects=document.querySelectorAll("input");
    let answersObjects=document.querySelectorAll("label");
    let buttonObject=document.querySelector("button");
    let resultObject=document.getElementById("result");
    let test1=new Test(questions,questionTextObject,radioObjects,answersObjects,buttonObject,resultObject);
});
