// qs-no-13.js - Multiple possible questions for Question 13

const questionsForNumber13 = [
    {
        id: 1,
        instruction: {
            text: "[Q-ID : 1]<br><br> 13. 빈칸에 들어갈 가장 알맞은 것을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "오늘은 다른 날보다 길이 많이 막힙니다. - - - - - 가지 않으면 회사에 늦을 것 같습니다.",
            image: null,
            audio: null
        },
        options: [
            { text: "서두르게", image: null, audio: null },
            { text: "조심해서", image: null, audio: null },
            { text: "조심하게", image: null, audio: null },
            { text: "서둘러서", image: null, audio: null }
        ],
        answer: 4
    },
    {
        id: 2,
        instruction: {
            text: "[Q-ID : 2]<br><br>13. 빈칸에 들어갈 가장 알맞은 것을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "요즘 스트레스를 많이 받아서 퇴근 후에 공원에서 산책을 ________ 마음이 좀 편해졌어요.",
            image: null,
            audio: null
        },
        options: [
            { text: "하면서 ", image: null, audio: null },
            { text: "하려고", image: null, audio: null },
            { text: "하자마자", image: null, audio: null },
            { text: "하느라고", image: null, audio: null }
        ],
        answer: 1
    },
    
];

// Register these questions with the manager
registerQuestionSet(13, questionsForNumber13);