// qs-no-31.js - Multiple possible questions for Question 31

const questionsForNumber31 = [
    {
        id: 1,
        instruction: {
            text: "[Q-ID : 1]<br><br> 31.다음을 듣고 질문에 알맞은 대답을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "",
            image: null,
            audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-11.mp3"
        },
        options: [
            { text: "아니요, 가본적이 있어요.", image: null, audio: null },
            { text: "네, 제주도에서 먹어봤어요.", image: null, audio: null },
            { text: "아니요, 제주도는 멀어요.", image: null, audio: null },
            { text: "아니요, 가본적이 없어요.", image: null, audio: null }
        ],
        answer: 4
    },
    {
        id: 2,
        instruction: {
            text: "[Q-ID : 2]<br><br>31. 다음을 듣고 질문에 알맞은 대답을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "",
            image: null,
            audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-87.mp3"
        },
        options: [
            { text: null, image: null, audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-88.mp3" },
            { text: null, image: null, audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-89.mp3" },
            { text: null, image: null, audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-90.mp3" },
            { text: null, image: null, audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-91.mp3" }
        ],
        answer: 3
    },
    
];

// Register these questions with the manager
registerQuestionSet(31, questionsForNumber31);