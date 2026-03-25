// qs-no-22.js - Multiple possible questions for Question 22

const questionsForNumber22 = [
    {
        id: 22,
        instruction: {
            text: "22. 들은 것을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "저는 - - - - - - - - - -  채팅을 하고 있습니다.",
            image: null,
            audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-2.mp3"
        },
        options: [
            { text: "화상", image: null, audio: null},
            { text: "축산", image: null, audio: null},
            { text: "화장", image: null, audio: null},
            { text: "책상", image: null, audio: null}
        ],
        answer: 1
    },
];

// Register these questions with the manager
registerQuestionSet(22, questionsForNumber22);