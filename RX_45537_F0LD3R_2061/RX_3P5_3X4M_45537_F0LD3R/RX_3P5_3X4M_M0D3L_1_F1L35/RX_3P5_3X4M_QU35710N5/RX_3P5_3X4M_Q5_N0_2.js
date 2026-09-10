// qs-no-2.js - Multiple possible questions for Question 2

const questionsForNumber2 = [
    {
        id: 1,
        instruction: {
            text: "[Q-ID : 1]<br><br> 2. 빈칸에 든어갈 가장 알맞은 것을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "작업 - - - - - - - - - -",
            image: null,
            audio: null
        },
        options: [
            { text: "24세", image: null, audio: null },
            { text: "여자", image: null, audio: null },
            { text: "대구시", image: null, audio: null },
            { text: "농부", image: null, audio: null }
        ],
        answer: 4
    },
    {
        id: 2,
        instruction: {
            text: "[Q-ID : 2]<br><br> 2. 빈칸에 든어갈 가장 알맞은 것을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "국적 - - - - - - - - - -",
            image: null,
            audio: null
        },
        options: [
            { text: "남자", image: null, audio: null },
            { text: "베트남", image: null, audio: null },
            { text: "어부", image: null, audio: null },
            { text: "부산시", image: null, audio: null }
        ],
        answer: 2
    },
    {
        id: 3,
        instruction: {
            text: "[Q-ID : 3]<br><br> 2. 빈칸에 든어갈 가장 알맞은 것을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "머리가 너무 길어요 내일 머리를 자르러 - - - - - - - - - - 에 갈 거에요.",
            image: null,
            audio: null
        },
        options: [
            { text: "우체국", image: null, audio: null },
            { text: "미용실", image: null, audio: null },
            { text: "커피숍", image: null, audio: null },
            { text: "편의점", image: null, audio: null }
        ],
        answer: 2
    },
    {
        id: 4,
        instruction: {
            text: "[Q-ID : 4]<br><br> 2.다음 그림을 보고 맞는 단어나 문장을 고르십시오",
            image: null,
            audio: null
        },
        questionBody: {
            text: "",
            image: "RX_45537_F0LD3R_2061/RX_3P5_3X4M_45537_F0LD3R/RX_3P5_3X4M_1M463/IMG-3.jpg",
            audio: null
        },
        options: [
            { text: "굴착기입니다.", image: null, audio: null },
            { text: "경운기입니다.", image: null, audio: null },
            { text: "트랙터입니다.", image: null, audio: null },
            { text: "지게차입니다", image: null, audio: null }
        ],
        answer: 4
    },
    {
        id: 5,
        instruction: {
            text: "[Q-ID : 5]<br><br> 2. 다음 그림을 보고 맞는 단어나 문장을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: null,
            image: "RX_45537_F0LD3R_2061/RX_3P5_3X4M_45537_F0LD3R/RX_3P5_3X4M_1M463/IMG-29.jpg",
            audio: null
        },
        options: [
            { text: "착암기 – 바위를 뚫어요.", image: null, audio: null },
            { text: "착암기 – 광석을 운반해요.", image: null, audio: null },
            { text: "컨베이어 – 바위를 뚫어요.", image: null, audio: null },
            { text: "컨베이어 – 광석을 운반해요.", image: null, audio: null }
        ],
        answer: 1
    },
        {
        id: 6,
        instruction: {
            text: "[Q-ID : 6]<br><br> 2. 다음 중 밑줄 친 부분이 맞는 것은 무엇입니까?", 
            image: null, 
            audio: null
        },
        questionBody: {
            text: "", 
            image: null, 
            audio: null
        },
        options: [
            { text: "옷장<u>가</u> 있어요.", image: null, audio: null },
            { text: "저는 농부<u>이</u> 아닙니다.", image: null, audio: null },
            { text: "저는 텔레비전<u>를</u> 봐요.", image: null, audio: null },
            { text: "선생님<u>은</u> 한국 사람입니다.", image: null, audio: null }
        ],
        answer: 4
    },
        {
        id: 7,
        instruction: {
        text: "[Q-ID : 7]<br><br> 2. 다음 설명에 알맞은 어휘를 고르십시오.", 
            image: null, 
            audio: null
        },
        questionBody: {
            text: " 금속이나 나무에 뜷린 구멍을 더 넓히거나 매끄럽게 다듬는 데 사용하는 공구입니다.", 
            image: null, 
            audio: null
        },
        options: [
            { text: " 풀러 ", image: null, audio: null },
            { text: " 리머 ", image: null, audio: null },
            { text: " 베어링 ", image: null, audio: null },
            { text: " 드릴링머신 ", image: null, audio: null }
        ],
        answer: 2
    },
    {
        id: 8,
        instruction: {
            text: "[Q-ID : 8]<br><br> 2. 빈칸에 든어갈 가장 알맞은 것을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: " 시간이 없으니까 이야기할 때는 요점만 __________ 말해 주세요.",
            image: null,
            audio: null
        },
        options: [
            { text: " 길게 ", image: null, audio: null },
            { text: " 자세히 ", image: null, audio: null },
            { text: " 짧게 ", image: null, audio: null },
            { text: " 빠르게 ", image: null, audio: null }
        ],
        answer: 3
    },
    

];

// Register these questions with the manager
registerQuestionSet(2, questionsForNumber2);