// qs-no-16.js - Multiple possible questions for Question 16

const questionsForNumber16 = [
    {
        id: 1,
        instruction: {
            text: "[Q-ID : 1]<br><br> 16. 빈칸에 들어갈 가장 알맞은 것을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "어두운 곳에서 작업할 때는 가시성이 높은 - - - - - . 이것을 입으면 멀리서도 잘 보여 사고를 막을 수 있습니다.",
            image: null,
            audio: null
        },
        options: [
            { text: "반사 조끼를 착용해야 합니다", image: null, audio: null },
            { text: "환기 장치를 작동해야 합니다", image: null, audio: null },
            { text: "비상 계단을 이용해야 합니다", image: null, audio: null },
            { text: "보호 장갑을 구매해야 합니다", image: null, audio: null }
        ],
        answer: 1
    },
    {
        id: 2,
        instruction: {
            text: "[Q-ID : 2]<br><br>16. 빈칸에 들어갈 가장 알맞은 것을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "아침에 늦잠을 자서 급하게 나왔습니다. 지하철에 ________ 회사에 전화를 했습니다.",
            image: null,
            audio: null
        },
        options: [
            { text: "타면", image: null, audio: null },
            { text: "타고 ", image: null, audio: null },
            { text: "타려고", image: null, audio: null },
            { text: "타느라고", image: null, audio: null }
        ],
        answer: 2
    },
    
];

// Register these questions with the manager
registerQuestionSet(16, questionsForNumber16);