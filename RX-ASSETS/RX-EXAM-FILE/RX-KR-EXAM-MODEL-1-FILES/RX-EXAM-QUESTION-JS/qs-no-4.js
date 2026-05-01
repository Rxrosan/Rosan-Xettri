// qs-no-4.js - Multiple possible questions for Question 4

const questionsForNumber4 = [
    {
        id: 1,
        instruction: {
            text: "[Q-ID : 1]<br><br> 4. 다음 중 밑출 친 부분이 맞는 것을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "",
            image: null,
            audio: null
        },
        options: [
            { text: "열쇠<u>은</u> 책상 위에 있어요.", image: null, audio: null },
            { text: "지갑<u>는</u> 없어요.", image: null, audio: null },
            { text: "달력<u>이</u> 아니예요", image: null, audio: null },
            { text: "동생<u>가</u> 운전기사에요.", image: null, audio: null }
        ],
        answer: 3
    },
    {
        id: 2,
        instruction: {
            text: "[Q-ID : 2]<br><br> 4. 다음 중 밑출 친 부분이 맞는 것을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "",
            image: null,
            audio: null
        },
        options: [
            { text: "전화<u>에</u> 해요.", image: null, audio: null },
            { text: "물<u>을</u> 마셔요.", image: null, audio: null },
            { text: "책<u>이</u> 읽어요.", image: null, audio: null },
            { text: "신문<u>는</u> 봐요.", image: null, audio: null }
        ],
        answer: 2
    },
    {
        id: 3,
        instruction: {
            text: "[Q-ID : 3]<br><br> 4. 다음 중 밑출 친 부분이 맞는 것을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "",
            image: null,
            audio: null
        },
        options: [
            { text: "전커피를 <u>마시요</u>.", image: null, audio: null },
            { text: "회사에 <u>가아요</u>.", image: null, audio: null },
            { text: "운동을 <u>하요</u>.", image: null, audio: null },
            { text: "텔레비전<u>을</u> 봐요.", image: null, audio: null }
        ],
        answer: 4
    },
    {
        id: 4,
        instruction: {
            text: "[Q-ID : 4]<br><br> 4. 다음 그림을 보고 맞는 단어나 문장을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: null,
            image: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-IMAGE/IMG-5.jpg",
            audio: null
        },
        options: [
            { text: "바닥이 미끄러우니까 조심하세요.", image: null, audio: null },
            { text: "불이 붙을 수 있으니까 조심하세요.", image: null, audio: null },
            { text: "떨어질 수 있으니까 조심하세요.", image: null, audio: null },
            { text: "전기가 흐르니까 조심하세요.", image: null, audio: null }
        ],
        answer: 3
    },
    {
        id: 5,
        instruction: {
            text: "[Q-ID : 5]<br><br> 4. 빈칸에 들어갈 가장 알맞은 것을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: null,
            image: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-IMAGE/IMG-92.jpg",
            audio: null
        },
        options: [
            { text: "로", image: null, audio: null },
            { text: "리", image: null, audio: null },
            { text: "르", image: null, audio: null },
            { text: "러", image: null, audio: null }
        ],
        answer: 3
    },
    
];

// Register these questions with the manager
registerQuestionSet(4, questionsForNumber4);