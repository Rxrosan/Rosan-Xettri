// qs-no-40.js - Multiple possible questions for Question 40

const questionsForNumber40 = [
    {
        id: 1,
        instruction: {
            text: "[Q-ID : 1]<br><br> 40.다음을 잘 듣고 내용과 같은 것을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "제주도에 대한 알맞은 것을 고르십시오.",
            image: null,
            audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-24.mp3"
        },
        options: [
            { text: "제주도는 동쪽에 있습니다.", image: null, audio: null },
            { text: "제주도는 한국의 제일 작은 섬입니다.", image: null, audio: null },
            { text: "제주도는 하와이보다 큽니다.", image: null, audio: null },
            { text: "제주도는 한국의 큰 섬입니다.", image: null, audio: null }
        ],
        answer: 4
    },
    {
        id: 2,
        instruction: {
            text: "[Q-ID : 2]<br><br> 40.다음을 잘 듣고 내용과 같은 것을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "다음 이야기를 듣고 들은 내용과 같은 것을 고르십시오.",
            image: null,
            audio: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-AUDIO/AUDIO-112.mp3"
        },
        options: [
            { text: "약국은 사거리에 있습니다.", image: null, audio: null },
            { text: "약국은 회사 안에 있습니다.", image: null, audio: null },
            { text: "남자가 약국에 가고 있습니다.", image: null, audio: null },
            { text: "여자가 약국에 가고 있습니다.", image: null, audio: null }
        ],
        answer: 3
    },
   
];

// Register these questions with the manager
registerQuestionSet(40, questionsForNumber40);