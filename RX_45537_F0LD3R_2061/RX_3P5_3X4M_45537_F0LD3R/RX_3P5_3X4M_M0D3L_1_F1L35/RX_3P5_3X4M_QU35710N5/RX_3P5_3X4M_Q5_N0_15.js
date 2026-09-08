// qs-no-15.js - Multiple possible questions for Question 15

const questionsForNumber15 = [
    {
        id: 1,
        instruction: {
            text: "[Q-ID : 1]<br><br> 15. 빈칸에 들어갈 가장 알맞은 것을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "못에 찔렸을 때는 상처가 가벼워도 바로 소독을 해야 합니다. 그리고 병원에 가서 진료를 받고 주사를 - - - - - .",
            image: null,
            audio: null
        },
        options: [
            { text: "놓는 것이 좋습니다", image: null, audio: null },
            { text: "맞지 않도록 합니다", image: null, audio: null },
            { text: "맞는 것이 좋습니다", image: null, audio: null },
            { text: "놓지 않도록 합니다", image: null, audio: null }
        ],
        answer: 3
    },
    {
        id: 2,
        instruction: {
            text: "[Q-ID : 2]<br><br>15. 빈칸에 들어갈 가장 알맞은 것을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "비가 많이 와서 옷이 다 젖었습니다. 집에 들어가자마자 옷을 ________ 따뜻한 물로 샤워를 했습니다.",
            image: null,
            audio: null
        },
        options: [
            { text: "벗고 ", image: null, audio: null },
            { text: "벗으면", image: null, audio: null },
            { text: "벗으려고", image: null, audio: null },
            { text: "벗느라고", image: null, audio: null }
        ],
        answer: 1
    },
    {
        id: 3,
        instruction: {
            text: "[Q-ID : 3]<br><br>15. 빈칸에 들어갈 가장 알맞은 것을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "저는 오늘 공장에서 부품을 _____________ 그래서 어제 필요한 나사와 공구를 준비했어요.",
            image: null,
            audio: null
        },
        options: [
            { text: "청소할 거에요", image: null, audio: null },
            { text: "용접할 거에요", image: null, audio: null },
            { text: "조립할 거에요", image: null, audio: null },
            { text: "주문할 거에요", image: null, audio: null }
        ],
        answer: 3
    },
    
];

// Register these questions with the manager
registerQuestionSet(15, questionsForNumber15);