// qs-no-2.js - Multiple possible questions for Question 2

const questionsForNumber33 = [
    {
        id: 1,
        instruction: {
            text: "[Q-ID : 1]<br><br> 33.다음을 듣고 질문에 알맞은 대답을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "",
            image: null,
            audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-13.mp3"
        },
        options: [
            { text: "일년 쫌 댔어요.", image: null, audio: null },
            { text: "지난 주에 갔어요.", image: null, audio: null },
            { text: "다음 주에 가려고 했어요.", image: null, audio: null },
            { text: "어제 방문을 했어요.", image: null, audio: null }
        ],
        answer: 3
    },
    {
        id: 2,
        instruction: {
            text: "[Q-ID : 2]<br><br>33. 다음을 듣고 질문에 알맞은 대답을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "",
            image: null,
            audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-97.mp3"
        },
        options: [
            { text: null, image: null, audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-98.mp3" },
            { text: null, image: null, audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-99.mp3" },
            { text: null, image: null, audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-100.mp3" },
            { text: null, image: null, audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-101.mp3" }
        ],
        answer: 3
    },
    
];

// Register these questions with the manager
registerQuestionSet(33, questionsForNumber33);