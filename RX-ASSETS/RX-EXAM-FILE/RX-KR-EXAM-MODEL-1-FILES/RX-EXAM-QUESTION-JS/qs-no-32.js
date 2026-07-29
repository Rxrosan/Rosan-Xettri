// qs-no-32.js - Multiple possible questions for Question 32

const questionsForNumber32 = [
    {
        id: 1,
        instruction: {
            text: "[Q-ID : 1]<br><br> 32.다음을 듣고 질문에 알맞은 대답을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "",
            image: null,
            audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-12.mp3"
        },
        options: [
            { text: "아니요, 좋아하지 않아요.", image: null, audio: null },
            { text: "네, 미여국이 아주 맛있어요.", image: null, audio: null },
            { text: "아니요, 김치가 많아요.", image: null, audio: null },
            { text: "네, 기침을 해요.", image: null, audio: null }
        ],
        answer: 1
    },
    {
        id: 2,
        instruction: {
            text: "[Q-ID : 2]<br><br>32. 다음을 듣고 질문에 알맞은 대답을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "",
            image: null,
            audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-92.mp3"
        },
        options: [
            { text: null, image: null, audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-93.mp3" },
            { text: null, image: null, audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-94.mp3" },
            { text: null, image: null, audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-95.mp3" },
            { text: null, image: null, audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-96.mp3" }
        ],
        answer: 4
    },
   
];

// Register these questions with the manager
registerQuestionSet(32, questionsForNumber32);