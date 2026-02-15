// qs-no-11.js - Multiple possible questions for Question 11

const questionsForNumber11 = [
    {
        id: 11,
        instruction: {
            text: "[QID-1]<br> 11. 빈칸에 들어갈 가장 알맞은 것을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "지급 방법 - - - - - - ",
            image: null,
            audio: null
        },
        options: [
            { text: "생일 선물", image: null, audio: null },
            { text: "통장 입금", image: null, audio: null },
            { text: "가족 모임", image: null, audio: null },
            { text: "출근 시간", image: null, audio: null }
        ],
        answer: 2
    },
    
];

// Register these questions with the manager
registerQuestionSet(11, questionsForNumber11);