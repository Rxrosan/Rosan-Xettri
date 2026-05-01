// qs-no-1.js - Multiple possible questions for Question 1

const questionsForNumber1 = [
    {
        id: 1,
        instruction: {
            text: "[Q-ID : 1]<br><br> 1. 다음 단어와 관계있는 무엇입니까 ?",
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
            text: "[Q-ID : 2]<br><br> 1. 다음 단어와 관계있는 것은 무엇입니까 ?",
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
            text: "[Q-ID : 3]<br><br> 1. 다음 단어와 관계있는 맞는 문장을 고르십시오.",
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
            text: "[Q-ID : 4]<br><br> 1. 다음 단어와 관계있는 맞는 문장을 고르십시오.",
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
            text: "[Q-ID : 5]<br><br> 1. 다음 단어와 관계있는 맞는 문장을 고르십시오.",
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
    {
        id: 6,
        instruction: {
            text: "[Q-ID : 6]<br><br> 1. 다음 그림을 보고 맞는 단어나 문장을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: null,
            image: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-IMAGE/IMG-2.jpg",
            audio: null
        },
        options: [
            { text: "가위입니다.", image: null, audio: null },
            { text: "가방입니다.", image: null, audio: null },
            { text: "안경입니다.", image: null, audio: null },
            { text: "볼펜입니다.", image: null, audio: null }
        ],
        answer: 2
    },
    {
    id: 7,
    instruction: {
        text: "[Q-ID : 7]<br><br> 1. 다음 그림을 보고 맞는 단어나 문장을 고르십시오.",
        image: null,
        audio: null
    },
    questionBody: {
        text: null,
        image:"RX-ASSETS/RX-EXAM-FILE/RX-EXAM-IMAGE/IMG-89.jpg",
        audio: null
    },
    options: [
        { text: "세탁기.", image:null , audio: null },
        { text: "냉장고.", image: null, audio: null },
        { text: "예초기.", image: null, audio: null },
        { text: "청소기.", image: null, audio: null }
    ],
    answer: 3
    },
    
];

// Register these questions with the manager
registerQuestionSet(1, questionsForNumber1);