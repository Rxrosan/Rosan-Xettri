// qs-no-2.js - Multiple possible questions for Question 2

const questionsForNumber2 = [
    {
        id: 1,
        instruction: {
            text: "2. 빈칸에 든어갈 가장 알맞은 것을 고르십시오.",
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
            text: "2. 빈칸에 든어갈 가장 알맞은 것을 고르십시오.",
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
        answer: 3
    },
    {
        id: 3,
        instruction: {
            text: "2. 빈칸에 든어갈 가장 알맞은 것을 고르십시오.",
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

];

// Register these questions with the manager
registerQuestionSet(2, questionsForNumber2);