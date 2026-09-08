// qs-no-12.js - Multiple possible questions for Question 12

const questionsForNumber12 = [
    {
        id: 1,
        instruction: {
            text: "[Q-ID : 1]<br><br> 12. 빈칸에 들어갈 가장 알맞은 것을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "한국어를 배우고 싶지만 학원에 갈 시간이 없습니다. 그래서 퇴근 후에 인터넷 강의를 - - - - - 한국어를 공부하고 있습니다.",
            image: null,
            audio: null
        },
        options: [
            { text: "들으면서", image: null, audio: null },
            { text: "듣자마자", image: null, audio: null },
            { text: "들으려고", image: null, audio: null },
            { text: "듣느라고", image: null, audio: null }
        ],
        answer: 1
    },
    {
        id: 2,
        instruction: {
            text: "[Q-ID : 2]<br><br>12. 빈칸에 들어갈 가장 알맞은 것을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "예약 시간: _____________",
            image: null,
            audio: null
        },
        options: [
            { text: "작업", image: null, audio: null },
            { text: "오후 3시", image: null, audio: null },
            { text: "통장 입금", image: null, audio: null },
            { text: "생일 선물", image: null, audio: null }
        ],
        answer: 2
    },
    {
        id: 3,
        instruction: {
            text: "[Q-ID : 3]<br><br>12. 빈칸에 들어갈 가장 알맞은 것을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "작년에 오랜만에 다녀와서 부모님을 _____________ 정말 반가웠습니다.",
            image: null,
            audio: null
        },
        options: [
            { text: "만나서", image: null, audio: null },
            { text: "만나면", image: null, audio: null },
            { text: "보는 대신에", image: null, audio: null },
            { text: "만나는 대신에", image: null, audio: null }
        ],
        answer: 1
    },
    
];

// Register these questions with the manager
registerQuestionSet(12, questionsForNumber12);