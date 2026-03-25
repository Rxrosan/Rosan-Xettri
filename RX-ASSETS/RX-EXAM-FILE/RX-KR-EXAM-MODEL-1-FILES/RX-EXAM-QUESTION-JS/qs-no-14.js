// qs-no-14.js - Multiple possible questions for Question 14

const questionsForNumber14 = [
    {
        id: 14,
        instruction: {
            text: "[QID-1]<br> 14. 빈칸에 들어갈 가장 알맞은 것을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "오늘은 날씨가 너무 덥습니다. 집에 오자마자 선풍기를 - - - - - 시원한 물을 마셨습니다.",
            image: null,
            audio: null
        },
        options: [
            { text: "틀려고", image: null, audio: null },
            { text: "틀고", image: null, audio: null },
            { text: "틀려면", image: null, audio: null },
            { text: "틀면", image: null, audio: null }
        ],
        answer: 2
    },
    
];

// Register these questions with the manager
registerQuestionSet(14, questionsForNumber14);