// qs-no-23.js - Multiple possible questions for Question 23

const questionsForNumber23 = [
    {
        id: 1,
        instruction: {
            text: "[Q-ID : 1]<br><br> 23.다음을 듣고 들은 내용과 관계있는 그림을 고르십시오.",
            image: null,
            audio: null,
        },
        questionBody: {
            text: "",
            image: null,
            audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-3.mp3"
        },
        options: [
            { text: "", image: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-IMAGE/IMG-10.jpg", audio: null },
            { text: "", image: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-IMAGE/IMG-9.jpg", audio: null },
            { text: "", image: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-IMAGE/IMG-11.jpg", audio: null },
            { text: "", image: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-IMAGE/IMG-1.jpg", audio: null }
        ],
        answer: 4
    },
     {
        id: 2,
        instruction: {
            text: "[Q-ID : 2]<br><br>23. 다음을 듣고 들은 내용과 관계있는 그림을 고르십시오.",
            image: null,
            audio: null,
        },
        questionBody: {
            text: "",
            image: null,
            audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-71.mp3"
        },
        options: [
            { text: "", image: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-IMAGE/IMG-97.jpg", audio: null },
            { text: "", image: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-IMAGE/IMG-98.jpg", audio: null },
            { text: "", image: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-IMAGE/IMG-99.jpg", audio: null },
            { text: "", image: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-IMAGE/IMG-100.jpg", audio: null }
        ],
        answer: 2
    },
    
];

// Register these questions with the manager
registerQuestionSet(23, questionsForNumber23);