// qs-no-10.js - Multiple possible questions for Question 10

const questionsForNumber10 = [
    {
        id: 1,
        instruction: {
            text: "[Q-ID : 1]<br><br> 10. 다음 글을 읽고 물음에 답하십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: " 한국의 수산물 수입 현황에 대한 설명으로 맞는 것은 무엇입니까?",
            image: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-IMAGE/IMG-7.jpg",
            audio: null
        },
        options: [
            { text: "한국이 수산물을 수입하는 국가 중 2위는 노르웨이입니다.", image: null, audio: null },
            { text: "한국이 수입하는 수산물 중 베트남산은 5% 미만입니다.", image: null, audio: null },
            { text: "한국은 수산물을 중국에서 가장 많이 수입합니다.", image: null, audio: null },
            { text: "한국은 미국보다 러시아에서 수산물을 더 많이 수입합니다.", image: null, audio: null }
        ],
        answer: 4
    },
    {
        id: 2,
        instruction: {
            text: "[Q-ID : 2]<br><br>10. 다음 작업에 대한 올바른 순서를 선택하세요.",
            image: null,
            audio: null
        },
        questionBody: {
            text: " 한국의 수산물 수입 현황에 대한 설명으로 맞는 것은 무엇입니까?",
            image: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-IMAGE/IMG-94.jpg",
            audio: null
        },
        options: [
            { text: "a-c-b", image: null, audio: null },
            { text: "a-b-c", image: null, audio: null },
            { text: "c-a-b", image: null, audio: null },
            { text: "c-b-a", image: null, audio: null }
        ],
        answer: 4
    },
];

// Register these questions with the manager
registerQuestionSet(10, questionsForNumber10);