// qs-no-13.js - Multiple possible questions for Question 13

const questionsForNumber13 = [
    {
        id: 13,
        instruction: {
            text: "[QID-1]<br> 13. 빈칸에 들어갈 가장 알맞은 것을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "오늘은 다른 날보다 길이 많이 막힙니다. - - - - - 가지 않으면 회사에 늦을 것 같습니다.",
            image: null,
            audio: null
        },
        options: [
            { text: "서두르게", image: null, audio: null },
            { text: "조심해서", image: null, audio: null },
            { text: "조심하게", image: null, audio: null },
            { text: "서둘러서", image: null, audio: null }
        ],
        answer: 4
    },
    
];

// Register these questions with the manager
registerQuestionSet(13, questionsForNumber13);