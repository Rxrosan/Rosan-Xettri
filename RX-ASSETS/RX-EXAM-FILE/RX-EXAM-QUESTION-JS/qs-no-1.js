// qs-no-1.js - Multiple possible questions for Question 1

const questionsForNumber1 = [
    {
        id: 1,
        instruction: {
            text: "1. 다음 단어와 관계있는 무엇입니까 ?",
            image: null,
            audio: null
        },
        questionBody: {
            text: "나라",
            image: null,
            audio: null
        },
        options: [
            { text: "네팔", image:null , audio: null },
            { text: "남자", image: null, audio: null },
            { text: "30세", image: null, audio: null },
            { text: "회사원", image: null, audio: null }
        ],
        answer: 1
    },
    {
        id: 2,
        instruction: {
            text: "1. 다음 단어와 관계있는 것은 무엇입니까 ?",
            image: null,
            audio: null
        },
        questionBody: {
            text: "소파",
            image: null,
            audio: null
        },
        options: [
            { text: "날씨", image: null, audio: null },
            { text: "계절", image: null, audio: null },
            { text: "가구", image: null, audio: null },
            { text: "취미", image: null, audio: null }
        ],
        answer: 3
    },
    {
        id: 3,
        instruction: {
            text: "1. 다음 단어와 관계있는 맞는 문장을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "가방",
            image: null,
            audio: null
        },
        options: [
            { text: "물건", image: null, audio: null },
            { text: "장소", image: null, audio: null },
            { text: "음식", image: null, audio: null },
            { text: "나라", image: null, audio: null }
        ],
        answer: 1
    },
    {
        id: 4,
        instruction: {
            text: "1. 다음 단어와 관계있는 맞는 문장을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "7월 15일",
            image: null,
            audio: null
        },
        options: [
            { text: "시간", image: null, audio: null },
            { text: "계절", image: null, audio: null },
            { text: "이름", image: null, audio: null },
            { text: "날짜", image: null, audio: null }
        ],
        answer: 4
    },
        {
        id: 5,
        instruction: {
            text: "1. 다음 단어와 관계있는 맞는 문장을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "토요일, 일요일",
            image: null,
            audio: null
        },
        options: [
            { text: "주중", image: null, audio: null },
            { text: "날짜", image: null, audio: null },
            { text: "주말", image: null, audio: null },
            { text: "평일", image: null, audio: null }
        ],
        answer: 3
    },
];

// Register these questions with the manager
registerQuestionSet(1, questionsForNumber1);