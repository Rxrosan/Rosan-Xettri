// qs-no-38.js - Multiple possible questions for Question 38

const questionsForNumber38 = [
    {
        id: 1,
        instruction: {
            text: "[Q-ID : 1]<br><br> 38.다음을 잘 듣고 내용과 같은 것을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "",
            image: null,
            audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-22.mp3"
        },
        options: [
            { text: "작업자이 위험하니까 안전모를 써야 합니다.", image: null, audio: null },
            { text: "작업장이 위험하니까 보호복을 착용해야 합니다.", image: null, audio: null },
            { text: "작업장이 소음이 심하니까 청력보호구를 착용해야 합니다.", image: null, audio: null },
            { text: "작업장이 소음이 심하니까 귀를 보호하지 않아도 됩니다.", image: null, audio: null }
        ],
        answer: 3
    },
    
];

// Register these questions with the manager
registerQuestionSet(38, questionsForNumber38);