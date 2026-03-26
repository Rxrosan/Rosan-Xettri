// qs-no-15.js - Multiple possible questions for Question 15

const questionsForNumber15 = [
    {
        id: 1,
        instruction: {
            text: "[Q-ID : 1]<br><br> 15. 빈칸에 들어갈 가장 알맞은 것을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "못에 찔렸을 때는 상처가 가벼워도 바로 소독을 해야 합니다. 그리고 병원에 가서 진료를 받고 주사를 - - - - - .",
            image: null,
            audio: null
        },
        options: [
            { text: "놓는 것이 좋습니다", image: null, audio: null },
            { text: "맞지 않도록 합니다", image: null, audio: null },
            { text: "맞는 것이 좋습니다", image: null, audio: null },
            { text: "놓지 않도록 합니다", image: null, audio: null }
        ],
        answer: 3
    },
    
];

// Register these questions with the manager
registerQuestionSet(15, questionsForNumber15);