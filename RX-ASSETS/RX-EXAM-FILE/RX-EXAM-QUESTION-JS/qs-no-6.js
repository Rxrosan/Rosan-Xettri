// qs-no-6.js - Multiple possible questions for Question 6

const questionsForNumber6 = [
    {
        id: 1,
        instruction: {
            text: "6. 다음 글을 읽고 내용과 같은 것을 고르십시오.", image: "EXAM-FILE/RX-EXAM-IMAGE/IMG-1.png", audio: null
        },
        questionBody: {
            text: "", image: null, audio: null
        },
        options: [
            { text: "", image: "EXAM-FILE/RX-EXAM-IMAGE/IMG-1.png", audio: null },
            { text: "", image: "EXAM-FILE/RX-EXAM-IMAGE/IMG-1.png", audio: null },
            { text: "", image: "EXAM-FILE/RX-EXAM-IMAGE/IMG-1.png", audio: null },
            { text: "", image: "EXAM-FILE/RX-EXAM-IMAGE/IMG-1.png", audio: null }
        ],
        answer: 4
    },
    
];

// Register these questions with the manager
registerQuestionSet(6, questionsForNumber6);