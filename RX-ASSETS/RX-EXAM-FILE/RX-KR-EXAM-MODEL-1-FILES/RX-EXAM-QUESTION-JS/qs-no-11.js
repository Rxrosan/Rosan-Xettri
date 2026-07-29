// qs-no-11.js - Multiple possible questions for Question 11

const questionsForNumber11 = [
    {
        id: 1,
        instruction: {
            text: "[Q-ID : 1]<br><br> 11. 빈칸에 들어갈 가장 알맞은 것을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "지급 방법 - - - - - - ",
            image: null,
            audio: null
        },
        options: [
            { text: "생일 선물", image: null, audio: null },
            { text: "통장 입금", image: null, audio: null },
            { text: "가족 모임", image: null, audio: null },
            { text: "출근 시간", image: null, audio: null }
        ],
        answer: 2
    },
    {
        id: 2,
        instruction: {
            text: "[Q-ID : 2]<br><br>11. 다음 글을 읽고 물음에 답하십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "다음은 경상남도 지역에 살고 있는 외국인 근로자들의 일하는 시간을 조사한 것입니다. 표에 대한 설명으로 맞는 것을 고르십시오.",
            image: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-IMAGE/IMG-95.jpg",
            audio: null
        },
        options: [
            { text: "대부분의 사람들은 하루 8시간 일하는 것을 좋아합니다.", image: null, audio: null },
            { text: "하루 10시간 일하는 것이 하루 8시간 일하는 것보다 적습니다.", image: null, audio: null },
            { text: "하루 12시간 이상 일하는 것과 하루 12시간 일하는 것은 같은 인원이다.", image: null, audio: null },
            { text: "대부분의 사람들은 다른 사람들보다 더 많은 하루 12시간 일하는 것을 좋아합니다.", image: null, audio: null }
        ],
        answer: 4
    },
    
];

// Register these questions with the manager
registerQuestionSet(11, questionsForNumber11);