// qs-no-26.js - Multiple possible questions for Question 26

const questionsForNumber26 = [
    {
        id: 1,
        instruction: {
            text: "[Q-ID : 1]<br><br> 26.다음을 듣고 들은 내용과 관계있는 그림을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "",
            image: null,
            audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-6.mp3"
        },
        options: [
            { text: "", image: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-IMAGE/IMG-23.jpg", audio: null },
            { text: "", image: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-IMAGE/IMG-22.jpg", audio: null },
            { text: "", image: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-IMAGE/IMG-21.jpg", audio: null },
            { text: "", image: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-IMAGE/IMG-20.jpg", audio: null }
        ],
        answer: 3
    },
    
];

// Register these questions with the manager
registerQuestionSet(26, questionsForNumber26);