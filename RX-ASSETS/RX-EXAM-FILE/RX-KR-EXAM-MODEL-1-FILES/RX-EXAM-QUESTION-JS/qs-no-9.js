// qs-no-9.js - Multiple possible questions for Question 9

const questionsForNumber9 = [
    {
        id: 1,
        instruction: {
            text: "[Q-ID : 1]<br><br> 9. 다음 단어와 관계있는 것은 무엇입니까?",
            image: null,
            audio: null
        },
        questionBody: {
            text: "작업장",
            image: null,
            audio: null
        },
        options: [
            { text: "근로자가 운동하는 곳이에요.", image: null, audio: null },
            { text: "근로자가 상담하는 곳이에요.", image: null, audio: null },
            { text: "근로자가 일하는 곳이에요.", image: null, audio: null },
            { text: "근로자가 거주하는 곳이에요.", image: null, audio: null }
        ],
        answer: 3
    },
    {
        id: 2,
        instruction: {
            text: "[Q-ID : 2]<br><br>9. 다음 단어의 비슷한 말은 무엇입니까 ? ",
            image: null,
            audio: null
        },
        questionBody: {
            text: "잔존 ",
            image: null,
            audio: null
        },
        options: [
            { text: " 남다 ", image: null, audio: null },
            { text: " 줄다 ", image: null, audio: null },
            { text: " 빠지다 ", image: null, audio: null },
            { text: " 사라지다", image: null, audio: null }
        ],
        answer: 1
    },
    
];

// Register these questions with the manager
registerQuestionSet(9, questionsForNumber9);