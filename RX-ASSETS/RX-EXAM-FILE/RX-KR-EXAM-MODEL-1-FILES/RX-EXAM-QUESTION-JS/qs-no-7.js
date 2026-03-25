// qs-no-7.js - Multiple possible questions for Question 7

const questionsForNumber7 = [
    {
        id: 7,
        instruction: {
            text: "[QID-1]<br> 7. 이 병원이 문을 여는 시간은 언제입니까?",
            image: null,
            audio: null
        },
        questionBody: {
            text: null,
            image: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-IMAGE/IMG-6.png",
            audio: null
        },
        options: [
            { text: "튼튼치과입니다.", image: null, audio: null },
            { text: "김미소입니다.", image: null, audio: null },
            { text: "오전 아홉 시입니다.", image: null, audio: null },
            { text: "부천시입니다.", image: null, audio: null }
        ],
        answer: 3
    },

];

// Register these questions with the manager
registerQuestionSet(7, questionsForNumber7);