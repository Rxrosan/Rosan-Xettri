// qs-no-3.js - Multiple possible questions for Question 3

const questionsForNumber3 = [

        {
        id: 1,
        instruction: {
            text: "[Q-ID : 1]<br><br> 3. 다음 중 밑출 친 부분이 맞는 문장을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "",
            image: null,
            audio: null
        },
        options: [
            { text: "방에 옷장<u>가</u> 없어요.", image: null, audio: null },
            { text: "저는 농부<u>이</u> 아니에요.", image: null, audio: null },
            { text: "유수프는 식당<u>에</u> 밥을 먹어요.", image: null, audio: null },
            { text: "다라 씨는 회사<u>에</u> 있어요.", image: null, audio: null }
        ],
        answer: 4
    },
    {
        id: 2,
        instruction: {
            text: "[Q-ID : 2]<br><br> 3. 다음 중 밑출 친 부분이 맞는 문장을 고르십시오.",
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
            { text: "선생님<u>은</u> 한국 사람입니다.", image: null, audio: null },
            { text: "저는 농부<u>이</u> 아닙니다.", image: null, audio: null },
            { text: "저는 텔레비전<u>이</u> 봐요.", image: null, audio: null }
        ],
        answer: 2
    },
    {
        id: 3,
        instruction: {
            text: "[Q-ID : 3]<br><br> 3. 다음 중 밑출 친 부분이 맞는 문장을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "",
            image: null,
            audio: null
        },
        options: [
            { text: "수요일에 영화관에 <u>가었어요</u>.", image: null, audio: null },
            { text: "작년에 한국에 <u>오였어요</u>.", image: null, audio: null },
            { text: "어제 신문을 <u>읽었어요</u>.", image: null, audio: null },
            { text: "주말에 <u>일하았어요</u>.", image: null, audio: null }
        ],
        answer: 3
    },
    {
        id: 4,
        instruction: {
            text: "[Q-ID : 4]<br><br> 3. 다음 그림을 보고 맞는 단어나 문장을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: null,
            image: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-IMAGE/IMG-4.jpg",
            audio: null
        },
        options: [
            { text: "피아노를 치고 있습니다.", image: null, audio: null },
            { text: "책을 읽고 있습니다.", image: null, audio: null },
            { text: "밥을 먹고 있습니다.", image: null, audio: null },
            { text: "친구를 만나고 있습니다.", image: null, audio: null }
        ],
        answer: 1
    },
    {
        id: 5,
        instruction: {
            text: "[Q-ID : 5]<br><br> 3. 다음 그림을 보고 맞는 단어나 문장을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: null,
            image: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-IMAGE/IMG-91.jpg",
            audio: null
        },
        options: [
            { text: "위험한 곳이니까 조심하세요.", image: null, audio: null },
            { text: " 다칠 수 있으니까 조심하세요.", image: null, audio: null },
            { text: "바닥에 장애물이 있으니까 조심하세요.", image: null, audio: null },
            { text: "방사능이 나오는 물질이 있으니까 조심하세요.", image: null, audio: null }
        ],
        answer: 1
    },
    
];

// Register these questions with the manager
registerQuestionSet(3, questionsForNumber3);