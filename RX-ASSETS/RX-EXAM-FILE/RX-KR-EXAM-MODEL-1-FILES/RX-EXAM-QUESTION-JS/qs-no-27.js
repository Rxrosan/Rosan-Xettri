// qs-no-27.js - Multiple possible questions for Question 27

const questionsForNumber27 = [
    {
        id: 1,
        instruction: {
            text: "[Q-ID : 1]<br><br> 27.다음을 듣고 들은 내용과 관계있는 그림을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "",
            image: null,
            audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-7.mp3"
        },
        options: [
            { text: "", image: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-IMAGE/IMG-25.jpg", audio: null },
            { text: "", image: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-IMAGE/IMG-26.jpg", audio: null },
            { text: "", image: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-IMAGE/IMG-24.jpg", audio: null },
            { text: "", image: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-IMAGE/IMG-27.jpg", audio: null }
        ],
        answer: 4
    },
    
];

// Register these questions with the manager
registerQuestionSet(27, questionsForNumber27);