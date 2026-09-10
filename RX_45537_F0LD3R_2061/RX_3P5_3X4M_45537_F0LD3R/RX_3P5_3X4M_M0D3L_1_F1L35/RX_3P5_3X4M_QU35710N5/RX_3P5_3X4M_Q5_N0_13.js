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
    {
        id: 3,
        instruction: {
            text: "[Q-ID : 3]<br><br>13. 빈칸에 들어갈 가장 알맞은 것을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "우리 공장은 2 교대 근무제를 시행하고 있으며, 5 일마다 주간 근무와 _____________ 근무를 교대합니다.",
            image: null,
            audio: null
        },
        options: [
            { text: "교대", image: null, audio: null },
            { text: "야간", image: null, audio: null },
            { text: "야근", image: null, audio: null },
            { text: "잔업", image: null, audio: null }
        ],
        answer: 2
    },
        {
        id: 4,
        instruction: {
            text: "[Q-ID : 4]<br><br>13. 빔칸에 들어칼 가장 알맞은 것을 고르십시오. ",
            image: null,
            audio: null
        },
        questionBody: {
            text: " 오늘 아침부터 배가 아파는데 병원에서 진료를 몇 시까지 하는지 __________ 전화를 해 물어봤습니다. ",
            image: null,
            audio: null
        },
        options: [
            { text: " 안전해서 ", image: null, audio: null },
            { text: " 가득해서 ", image: null, audio: null },
            { text: " 충분해서 ", image: null, audio: null },
            { text: " 궁금해서 ", image: null, audio: null }
        ],
        answer: 4
    },
    {
        id: 5,
        instruction: {
            text: "[Q-ID : 5]<br><br>13. 빔칸에 들어칼 가장 알맞은 것을 고르십시오. ",
            image: null,
            audio: null
        },
        questionBody: {
            text: " 겨울철에 날씨가 매우 추워서 손발이 시려요. 집 안을 따뜻하게 만들려면 __________ 을/를 켜야 합니다. ",
            image: null,
            audio: null
        },
        options: [
            { text: " 난방 ", image: null, audio: null },
            { text: " 냉방 ", image: null, audio: null },
            { text: " 청소 ", image: null, audio: null },
            { text: " 점검 ", image: null, audio: null }
        ],
        answer: 1
    },
    
];

// Register these questions with the manager
registerQuestionSet(13, questionsForNumber13);