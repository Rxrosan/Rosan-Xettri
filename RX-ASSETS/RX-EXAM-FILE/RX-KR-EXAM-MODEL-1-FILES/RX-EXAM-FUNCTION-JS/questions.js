// questions.js - Contains all question data
const questions = [
    {
        id: 1,
        instruction: {
            text: "[1~4] 다음 그림을 보고 맞는 단어나 문장을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "1. 무엇입니까?",
            image: "https://cdn-icons-png.flaticon.com/512/2921/2921935.png",
            audio: null
        },
        options: [
            { text: "", image: "https://cdn-icons-png.flaticon.com/512/2921/2921935.png", audio: null },
            { text: "가위입니다.", image: null, audio: null },
            { text: "안경입니다.", image: null, audio: null },
            { text: "가방입니다.", image: null, audio: null }
        ],
        answer: 4
    },
    {
        id: 2,
        instruction: {
            text: "[1~4] 다음 그림을 보고 맞는 단어나 문장을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "2. 무엇입니까?",
            image: "https://cdn-icons-png.flaticon.com/512/1869/1869659.png",
            audio: null
        },
        options: [
            { text: "책상입니다.", image: null, audio: null },
            { text: "의자입니다.", image: null, audio: null },
            { text: "", image: "https://cdn-icons-png.flaticon.com/512/1869/1869659.png", audio: null },
            { text: "침대입니다.", image: null, audio: null }
        ],
        answer: 2
    },
    {
        id: 21,
        instruction: {
            text: "[21~25] 잘 듣고 내용과 관계있는 그림을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "21. 다음 중 '사과'는 무엇입니까?",
            image: null,
            audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        },
        options: [
            { image: "https://cdn-icons-png.flaticon.com/512/415/415733.png", audio: null },
            { image: "https://cdn-icons-png.flaticon.com/512/1041/1041373.png", audio: null },
            { image: "https://cdn-icons-png.flaticon.com/512/688/688844.png", audio: null },
            { image: "https://cdn-icons-png.flaticon.com/512/1155/1155280.png", audio: null }
        ],
        answer: 1
    }
    // Add more questions as needed...
];