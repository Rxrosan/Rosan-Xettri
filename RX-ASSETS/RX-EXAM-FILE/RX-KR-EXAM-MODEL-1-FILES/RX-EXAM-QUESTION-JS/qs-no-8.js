// qs-no-8.js - Multiple possible questions for Question 8

const questionsForNumber8 = [
    {
        id: 1,
        instruction: {
            text: "[Q-ID : 1]<br><br> 8. 다음 단어와 관계있는 것은 무엇입니까?",
            image: null,
            audio: null
        },
        questionBody: {
            text: "복장",
            image: null,
            audio: null
        },
        options: [
            { text: "작업복", image: null, audio: null },
            { text: "컴퓨터", image: null, audio: null },
            { text: "비빔밥", image: null, audio: null },
            { text: "기차표", image: null, audio: null }
        ],
        answer: 1
    },
    {
        id: 2,
        instruction: {
            text: "[Q-ID : 2]<br><br> 8. 다음 단어와 관계있는 것은 무엇입니까?",
            image: null,
            audio: null
        },
        questionBody: {
            text: "병원",
            image: null,
            audio: null
        },
        options: [
            { text: "우산", image: null, audio: null },
            { text: "의사 ", image: null, audio: null },
            { text: "청바지", image: null, audio: null },
            { text: "자전거", image: null, audio: null }
        ],
        answer: 2
    },
    
];

// Register these questions with the manager
registerQuestionSet(8, questionsForNumber8);