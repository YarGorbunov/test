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
    prevButtonObject;//ссылка на кнопку предыдущего вопроса
    finishTestObject;//это поле содержит функцию finishTest как объект
    pagerButtonsObjects;//массив ссылок на кнопки пейджера на странице
    pagerObject;//сам пейджер на странице
    constructor(questions, questionTextObject, radioObjects, answersObjects, buttonObject, resultObject, prevButtonObject, pagerObject, firstPagerButton){
        this.questions=questions;
        this.questionTextObject=questionTextObject;
        this.radioObjects=radioObjects;
        this.answersObjects=answersObjects;
        this.buttonObject=buttonObject;
        this.resultObject=resultObject;
        this.prevButtonObject=prevButtonObject;
        this.pagerButtonsObjects=new Array(this.questions.length);
        this.pagerButtonsObjects[0]=firstPagerButton;
        this.pagerObject=pagerObject;
        this.currentQuestion=0;
        this.result=0;
        this.initTest();
        this.createPagerButtons();

    }

    initTest() {
        this.buttonObject.addEventListener("click", bind(this, this.startTest), { once: true });//событие с настройкой once само отключится после одного срабатывания
        this.prevButtonObject.addEventListener("click", bind(this, this.prevQuestion));
    }

    startTest(){
        this.buttonObject.innerHTML="Next question";//меняем надпись на кнопке
        this.questionTextObject.innerHTML=this.questions[0].questionText;//устанавливаем текст первого вопроса
        this.radioObjects.forEach(function(element){element.style.display="inline-block";});//включаем отображение радиокнопок
        for (let i=0;i<this.answersObjects.length;i++){//записываем варианты ответа
            this.answersObjects[i].innerHTML=this.questions[0].answers[i].answerText;
        }
        this.nextQuestionObject=bind(this, this.nextQuestion);//сохраняем функцию NextQuestion как объект, чтобы потом можно было отвязать эту функцию от кнопки(ебоманый js)
        this.finishTestObject=bind(this, this.finishTest);
        this.buttonObject.addEventListener("click", this.nextQuestionObject);//привязываем событи к кнопке
        this.pagerObject.style.display="flex";//включаем отображение пейджера
        this.pagerButtonsObjects[0].disabled=false;//включаем первую кнопку
        this.pagerButtonsObjects[0].addEventListener("click", bind(this, function(){ this.changeQuestion(0);} ) );//привязываем функцию к кнопке
    }

    nextQuestion(){//у меня чувство что я не пойму это утром. функция считывает выбранный ответ, записывает его, и отображает следующий
        for(let i=0;i<this.radioObjects.length;i++){ //ищем выбранный вариант
            if (this.radioObjects[i].checked===true) this.questions[this.currentQuestion].chosedAnswer=this.radioObjects[i].value;
        }
        if (this.questions[this.currentQuestion].chosedAnswer===-1) return 0; //если вариант не выбран выходим из функции
        this.radioObjects[this.questions[this.currentQuestion].chosedAnswer].checked=false;//убираем выбор с радиокнопок
        this.currentQuestion++;
        if (this.questions[this.currentQuestion].chosedAnswer!=-1) this.radioObjects[this.questions[this.currentQuestion].chosedAnswer].checked=true;//отображаем выбранный ранее вариант ответа
        this.questionTextObject.innerHTML=this.questions[this.currentQuestion].questionText;//меняем текст вопроса
        for (let i=0;i<this.answersObjects.length;i++){//меняем текст вариантов ответа
            this.answersObjects[i].innerHTML=this.questions[this.currentQuestion].answers[i].answerText;
        }
        if (this.currentQuestion===1){//включаем отображение кнопки возврата со второго вопроса
            this.prevButtonObject.style.display="block";
        }
        if (this.currentQuestion===this.questions.length-1) {//эта часть выполняется если вопрос на который переключились только что является последним
            this.buttonObject.removeEventListener("click", this.nextQuestionObject); //отвязываем nextQuestion от кнопки
            this.buttonObject.addEventListener("click", this.finishTestObject);//привязываем finishTest взамен
            this.buttonObject.innerHTML="Finish";
        }
        if (this.pagerButtonsObjects[this.currentQuestion].disabled===true){//если достигли нового вопроса(такого которого еще не было), включаем кнопку пейджера и задаем нужное событие при нажатии
            this.pagerButtonsObjects[this.currentQuestion].disabled=false;
            let currquest=this.currentQuestion;//записываем значение текущего вопроса, чтобы потом предать его ПО ЗНАЧЕНИЮ
            this.pagerButtonsObjects[this.currentQuestion].addEventListener("click", bind(this, function(){ this.changeQuestion(currquest);}));//привязываем событие на соответствующую кнопку пейджера
        }
    }

    finishTest(){//подсчитывает последний вопрос, скрывает интерфейс теста и выводит результат
        for(let i=0;i<this.radioObjects.length;i++){ //ищем выбранный вариант
            if (this.radioObjects[i].checked===true) this.questions[this.currentQuestion].chosedAnswer=this.radioObjects[i].value;
        }
        if (this.questions[this.currentQuestion].chosedAnswer===-1) return 0; //если вариант не выбран выходим из функции
        this.radioObjects.forEach(function(element){element.style.display="none";});//скрываем радиокнопки
        this.answersObjects.forEach(function(element){element.style.display="none";});//скрываем радиокнопки
        this.buttonObject.style.display="none";
        this.questionTextObject.style.display="none";
        this.prevButtonObject.style.display="none";
        this.pagerObject.style.display="none";
        for (let i=0;i<this.questions.length;i++){//подсчитываем результат
            this.result+=this.questions[i].answers[this.questions[i].chosedAnswer].points;
        }
        this.resultObject.innerHTML="Your result is "+this.result+" points";
    }

    prevQuestion(){
        if (this.currentQuestion===this.questions.length-1) {
            this.buttonObject.addEventListener("click", this.nextQuestionObject); //привязываем nextQuestion от кнопки
            this.buttonObject.removeEventListener("click", this.finishTestObject);//отвязываем finishTest взамен
            this.buttonObject.innerHTML="Next question";
        }
        this.currentQuestion--;
        this.questionTextObject.innerHTML=this.questions[this.currentQuestion].questionText;//меняем текст вопроса
        for (let i=0;i<this.answersObjects.length;i++){//меняем текст вариантов ответа
            this.answersObjects[i].innerHTML=this.questions[this.currentQuestion].answers[i].answerText;
        }
        if (this.questions[this.currentQuestion].chosedAnswer!=-1) this.radioObjects[this.questions[this.currentQuestion].chosedAnswer].checked=true;//отображаем выбранный ранее вариант ответа
    }

    createPagerButtons(){//создает нужное кол-во кнопок пейджера по образу и подобию первой, также полностью заполняет массив pagerButtons Objects
        let firstBtn=this.pagerObject.innerHTML;//в эту переменную сохранили первую кнопку вместе с div,в котором она лежит
        for (let i=1;i<this.questions.length;i++){
            this.pagerObject.innerHTML+=firstBtn;//клонируем первую кнопку
        }
        let buttons=this.pagerObject.querySelectorAll(".pager-button");//взяли в массив все кнопки в пейджере
        buttons.forEach(function (element, index) { element.id=element.id.slice(0,element.id.length-1)+(index+1); element.innerHTML=index+1; } );//делаем каждой кнопке нужный id
        for (let i=0;i<buttons.length;i++){//заполняем массив pagerButtonsObjects
            this.pagerButtonsObjects[i]=buttons[i];
        }
    }

    changeQuestion(questionNumber){//считывает ответ на текущий вопрос, отображает вопрос questionNumber, используется пейджером
        if(this.currentQuestion === questionNumber) return 0;
        if (questionNumber===0) this.prevButtonObject.style.display="none";//если переключаемся на первый вопрос выключаем кнопку
        else this.prevButtonObject.style.display="block";
        for(let i=0;i<this.radioObjects.length;i++){ //ищем выбранный вариант
            if (this.radioObjects[i].checked===true) this.questions[this.currentQuestion].chosedAnswer=this.radioObjects[i].value;
        }
        if (this.currentQuestion===this.questions.length-1) {
            this.buttonObject.addEventListener("click", this.nextQuestionObject); //привязываем nextQuestion от кнопки
            this.buttonObject.removeEventListener("click", this.finishTestObject);//отвязываем finishTest взамен
            this.buttonObject.innerHTML="Next question";
        }
        this.currentQuestion=questionNumber;
        this.questionTextObject.innerHTML=this.questions[this.currentQuestion].questionText;//меняем текст вопроса
        for (let i=0;i<this.answersObjects.length;i++){//меняем текст вариантов ответа
            this.answersObjects[i].innerHTML=this.questions[this.currentQuestion].answers[i].answerText;
        }
        if (this.questions[this.currentQuestion].chosedAnswer!=-1) this.radioObjects[this.questions[this.currentQuestion].chosedAnswer].checked=true;//отображаем выбранный ранее вариант ответа
        if (this.currentQuestion===this.questions.length-1) {
            this.buttonObject.removeEventListener("click", this.nextQuestionObject); //отвязываем nextQuestion от кнопки
            this.buttonObject.addEventListener("click", this.finishTestObject);//привязываем finishTest взамен
            this.buttonObject.innerHTML="Finish";
        }
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
    },
    {
        "text":"QUESTION TEXT3",
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
    },
    {
        "text":"QUESTION TEXT4",
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
    let buttonObject=document.querySelector("button#next-button");
    let resultObject=document.getElementById("result");
    let prevButtonObject=document.getElementById("prev-button");
    let pagerObject=document.getElementById("test-pager");
    let firstPagerButton=document.querySelector(".pager-button");
    let test1=new Test(questions,questionTextObject,radioObjects,answersObjects,buttonObject,resultObject, prevButtonObject, pagerObject, firstPagerButton);
});
