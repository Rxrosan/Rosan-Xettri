// qs-no-39.js - Multiple possible questions for Question 39

const questionsForNumber39 = [
    {
        id: 1,
        instruction: {
            text: "[Q-ID : 1]<br><br> 39.다음을 잘 듣고 내용과 같은 것을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "내일부터 연장 근무를 하는 이유가 무엇입니까?",
            image: null,
            audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-23.mp3"
        },
        options: [
            { text: "두시간이 걸려서.", image: null, audio: null },
            { text: "주문이 밀려서.", image: null, audio: null },
            { text: "일이 밀려서.", image: null, audio: null },
            { text: "주문이 취소해서.", image: null, audio: null }
        ],
        answer: 2
    },
    
];

// Register these questions with the manager
registerQuestionSet(39, questionsForNumber39);