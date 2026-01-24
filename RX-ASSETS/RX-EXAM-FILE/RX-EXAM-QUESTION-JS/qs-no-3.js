// qs-no-3.js - Multiple possible questions for Question 3

const questionsForNumber3 = [

        {
        id: 1,
        instruction: {
            text: "3. 다음 중 밑출 친 부분이 맞는 문장을 고르십시오.",
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
            text: "3. 다음 중 밑출 친 부분이 맞는 문장을 고르십시오.",
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
            { text: "저는 텔레비전<u>을</u> 봐요.", image: null, audio: null }
        ],
        answer: 2
    },
    {
        id: 3,
        instruction: {
            text: "3. 다음 중 밑출 친 부분이 맞는 문장을 고르십시오.",
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
    
];

// Register these questions with the manager
registerQuestionSet(3, questionsForNumber3);