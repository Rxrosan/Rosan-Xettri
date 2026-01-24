// qs-no-4.js - Multiple possible questions for Question 4

const questionsForNumber4 = [
    {
        id: 1,
        instruction: {
            text: "4. 다음 중 밑출 친 부분이 맞는 것을 고르십시오.",
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
            text: "4. 다음 중 밑출 친 부분이 맞는 것을 고르십시오.",
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
            text: "4. 다음 중 밑출 친 부분이 맞는 것을 고르십시오.",
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
    
];

// Register these questions with the manager
registerQuestionSet(4, questionsForNumber4);