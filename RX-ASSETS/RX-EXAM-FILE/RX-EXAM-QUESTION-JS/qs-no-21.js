// qs-no-21.js - Multiple possible questions for Question 21

const questionsForNumber21 = [
    {
        id: 21,
        instruction: {
            text: "[~]",
            image: null,
            audio: null
        },
        questionBody: {
            text: "",
            image: null,
            audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-20.mp3"
        },
        options: [
            { text: "", image: null, audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-20.mp3"},
            { text: "", image: null, audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-20.mp3" },
            { text: "", image: null, audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-20.mp3" },
            { text: "", image: null, audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-20.mp3" }
        ],
        answer: 4
    },
    
];

// Register these questions with the manager
registerQuestionSet(21, questionsForNumber21);