// qs-no-37.js - Multiple possible questions for Question 37

const questionsForNumber37 = [
    {
        id: 1,
        instruction: {
            text: "[Q-ID : 1]<br><br> 37.다음을 듣고 질문에 알맞은 대답을 고르십시오",
            image: null,
            audio: null
        },
        questionBody: {
            text: "미용실은 어디에 있습니까 ?",
            image: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-IMAGE/IMG-44.jpg",
            audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-17.mp3"
        },
        options: [
            { text: "", image: null, audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-20.mp3" },
            { text: "", image: null, audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-18.mp3" },
            { text: "", image: null, audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-19.mp3" },
            { text: "", image: null, audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-21.mp3" }
        ],
        answer: 1
    },
    
];

// Register these questions with the manager
registerQuestionSet(37, questionsForNumber37);