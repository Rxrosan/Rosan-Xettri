// qs-no-21.js - Multiple possible questions for Question 21

const questionsForNumber21 = [
    {
        id: 1,
        instruction: {
            text: "[Q-ID : 1]<br><br> 21. 들은 것을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "",
            image: null,
            audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-1.mp3"
        },
        options: [
            { text: "끓다", image: null, audio: null},
            { text: "신다", image: null, audio: null},
            { text: "삶다", image: null, audio: null},
            { text: "싫다", image: null, audio: null}
        ],
        answer: 4
    },
    {
        id: 2,
        instruction: {
            text: "[Q-ID : 2]<br><br>21. 다음을 듣고 질문에 알맞은 대답을 고르십시오",
            image: null,
            audio: null
        },
        questionBody: {
            text:  null,
            image: null,
            audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-69.mp3"
        },
        options: [
            { text: "물라요", image: null, audio: null},
            { text: "몰라요", image: null, audio: null},
            { text: "몰러요", image: null, audio: null},
            { text: "물러요", image: null, audio: null}
        ],
        answer: 2
    },
    
    
];

// Register these questions with the manager
registerQuestionSet(21, questionsForNumber21);