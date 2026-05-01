// qs-no-22.js - Multiple possible questions for Question 22

const questionsForNumber22 = [
    {
        id: 1,
        instruction: {
            text: "[Q-ID : 1]<br><br> 22. 들은 것을 고르십시오.",
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
    {
        id: 2,
       instruction: {
            text: "[Q-ID : 2]<br><br>22. 다음을 듣고 빈칸에 알맞은 것을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text:  "오른쪽으로 ________ .",
            image: null,
            audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-70.mp3"
        },
        options: [
            { text: "가세요", image: null, audio: null},
            { text: "다세요", image: null, audio: null},
            { text: "바세요", image: null, audio: null},
            { text: "사세요", image: null, audio: null}
        ],
        answer: 1
    },
];

// Register these questions with the manager
registerQuestionSet(22, questionsForNumber22);