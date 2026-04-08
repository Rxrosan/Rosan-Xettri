// qs-no-28.js - Multiple possible questions for Question 28

const questionsForNumber28 = [
    {
        id: 1,
        instruction: {
            text: "[Q-ID : 1]<br><br> 28.다음을 듣고 들은 내용과 관계있는 그림을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "",
            image: null,
            audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-8.mp3"
        },
        options: [
            { text: "", image: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-IMAGE/IMG-29.jpg", audio: null },
            { text: "", image: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-IMAGE/IMG-30.jpg", audio: null },
            { text: "", image: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-IMAGE/IMG-31.jpg", audio: null },
            { text: "", image: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-IMAGE/IMG-28.jpg", audio: null }
        ],
        answer: 1
    },
    
];

// Register these questions with the manager
registerQuestionSet(28, questionsForNumber28);