// qs-no-29.js - Multiple possible questions for Question 29

const questionsForNumber29 = [
    {
        id: 1,
        instruction: {
            text: "[Q-ID : 1]<br><br> 29.다음을 듣고 질문에 알맞은 대답을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "",
            image: null,
            audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-9.mp3"
        },
        options: [
            { text: "십분 남아요.", image: null, audio: null },
            { text: "회사예요.", image: null, audio: null },
            { text: "아버지세요.", image: null, audio: null },
            { text: "두명 있어요.", image: null, audio: null }
        ],
        answer: 3
    },
    {
        id: 2,
        instruction: {
            text: "[Q-ID : 2]<br><br>29. 다음을 듣고 질문에 알맞은 대답을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "",
            image: null,
            audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-77.mp3"
        },
        options: [
            { text: null, image: null, audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-78.mp3" },
            { text: null, image: null, audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-79.mp3" },
            { text: null, image: null, audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-80.mp3" },
            { text: null, image: null, audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-81.mp3" }
        ],
        answer: 1
    },
    
];

// Register these questions with the manager
registerQuestionSet(29, questionsForNumber29);