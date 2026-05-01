// qs-no-30.js - Multiple possible questions for Question 30

const questionsForNumber30 = [
    {
        id: 1,
        instruction: {
            text: "[Q-ID : 1]<br><br> 30.다음을 듣고 질문에 알맞은 대답을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "",
            image: null,
            audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-10.mp3"
        },
        options: [
            { text: "네, 신분증이 있어요.", image: null, audio: null },
            { text: "아니요, 지갑에 들어 있어요.", image: null, audio: null },
            { text: "네, 신분증이에요.", image: null, audio: null },
            { text: "아니요, 가방에 없어요.", image: null, audio: null }
        ],
        answer: 2
    },
    {
        id: 2,
        instruction: {
            text: "[Q-ID : 2]<br><br>30. 다음을 듣고 질문에 알맞은 대답을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "",
            image: null,
            audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-82.mp3"
        },
        options: [
            { text: null, image: null, audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-83.mp3" },
            { text: null, image: null, audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-84.mp3" },
            { text: null, image: null, audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-85.mp3" },
            { text: null, image: null, audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-86.mp3" }
        ],
        answer: 4
    },
    
];

// Register these questions with the manager
registerQuestionSet(30, questionsForNumber30);