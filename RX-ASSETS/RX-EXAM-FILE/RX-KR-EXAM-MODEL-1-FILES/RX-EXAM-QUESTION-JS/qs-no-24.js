// qs-no-24.js - Multiple possible questions for Question 24

const questionsForNumber24 = [
    {
        id: 1,
        instruction: {
            text: "[Q-ID : 1]<br><br> 24.다음을 듣고 들은 내용과 관계있는 그림을 고르십시오.",
            image: null,
            audio: null,
        },
        questionBody: {
            text: "",
            image: null,
            audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-4.mp3"
        },
        options: [
            { text: "", image: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-IMAGE/IMG-12.jpg", audio: null },
            { text: "", image: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-IMAGE/IMG-14.jpg", audio: null },
            { text: "", image: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-IMAGE/IMG-15.jpg", audio: null },
            { text: "", image: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-IMAGE/IMG-13.jpg", audio: null }
        ],
        answer: 2
    },
    {
        id: 2,
        instruction: {
            text: "[Q-ID : 2]<br><br>24. 다음을 듣고 들은 내용과 관계있는 그림을 고르십시오.",
            image: null,
            audio: null,
        },
        questionBody: {
            text: "",
            image: null,
            audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-72.mp3"
        },
        options: [
            { text: "", image: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-IMAGE/IMG-101.jpg", audio: null },
            { text: "", image: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-IMAGE/IMG-102.jpg", audio: null },
            { text: "", image: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-IMAGE/IMG-103.jpg", audio: null },
            { text: "", image: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-IMAGE/IMG-104.jpg", audio: null }
        ],
        answer: 3
    },
   
];

// Register these questions with the manager
registerQuestionSet(24, questionsForNumber24);