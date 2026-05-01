// qs-no-20.js - Multiple possible questions for Question 20

const questionsForNumber20 = [
    {
        id: 1,
        instruction: {
            text: "[Q-ID : 1]<br><br> 20. 다음 글을 읽고 내용과 같은 것을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "한국에서 일하는 외국인 근로자는 4대 사회보험 혜택을 받습니다. 4대 사회보험 중 산재보험은 사업주만 가입하면 되지만 국민연금, 건강보험, 고용보험은 사업주와 근로자 모두 반드시 가입해야 합니다. 외국인 근로자는 질병, 부상, 상해, 실업 등이 발생하였을 때 가입한 4대 보험의 보험금을 받을 수 있습니다.",
            image: null,
            audio: null
        },
        options: [
            { text: "근로자는 가입하고 싶은 보험을 선택하여 가입할 수 있습니다.", image: null, audio: null },
            { text: "산재보험은 근로자와 사업주가 모두 가입해야 합니다.", image: null, audio: null },
            { text: "사업주는 4대 사회보험에 모두 가입해야 합니다.", image: null, audio: null },
            { text: "사업주는 사고가 발생하면 보험금을 받을 수 있습니다.", image: null, audio: null }
        ],
        answer: 3
    },
    {
        id: 2,
        instruction: {
            text: "[Q-ID : 2]<br><br>20. 다음 글을 읽고 내용과 같은 것을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "가구 제작 전에 필요한 준비 작업에는 도면 작성, 재료 구매, 도구 준비 등이 포함됩니다. 이러한 준비 작업이 끝나면 본격적으로 가구를 만들기 시작할 수 있습니다. ",
            image: null,
            audio: null
        },
        options: [
            { text: "가구 제작은 도면 작성 없이 시작할 수 있습니다.", image: null, audio: null },
            { text: "가구 제작 전에는 특별한 준비 작업이 필요 없습니다. ", image: null, audio: null },
            { text: "준비 작업이 끝나면 가구 제작을 시작할 수 있습니다.  ", image: null, audio: null },
            { text: "재료 구매와 도구 준비는 가구 제작 후에 이루어집니다. ", image: null, audio: null }
        ],
        answer: 3
    },
    
];

// Register these questions with the manager
registerQuestionSet(20, questionsForNumber20);