// qs-no-17.js - Multiple possible questions for Question 17

const questionsForNumber17 = [
    {
        id: 1,
        instruction: {
            text: "[Q-ID : 1]<br><br> 17. 다음 설명에 알맞은 어휘를 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "손에 쥐고 철사를 끊거나 구부릴 때 쓰는 도구입니다. 전선이나 작은 부품을 잡을 때도 사용합니다.",
            image: null,
            audio: null
        },
        options: [
            { text: "쇠톱", image: null, audio: null },
            { text: "망치", image: null, audio: null },
            { text: "토치", image: null, audio: null },
            { text: "펜치", image: null, audio: null }
        ],
        answer: 4
    },
    {
        id: 2,
        instruction: {
            text: "[Q-ID : 2]<br><br>17. 다음 설명에 알맞은 어휘를 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "음식 재료를 갈거나 으깨는 데 사용하는 도구입니다. 주로 마늘이나 생강을 다질 때 사용하며, 손으로 눌러 사용하는 경우가 많습니다.",
            image: null,
            audio: null
        },
        options: [
            { text: "칼", image: null, audio: null },
            { text: "냄비", image: null, audio: null },
            { text: "국자", image: null, audio: null },
            { text: "다지기 ", image: null, audio: null }
        ],
        answer: 4
    },
    
];

// Register these questions with the manager
registerQuestionSet(17, questionsForNumber17);