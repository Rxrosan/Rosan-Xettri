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
    {
        id: 3,
        instruction: {
            text: "[Q-ID : 3]<br><br>9. 다음 단어의 비슷한 말은 무엇입니까 ? ",
            image: null,
            audio: null
        },
        questionBody: {
            text: "거실 ",
            image: null,
            audio: null
        },
        options: [
            { text: " 근로자가 거주하는 곳이에요. ", image: null, audio: null },
            { text: " 음식을 조리하는 곳이에요. ", image: null, audio: null },
            { text: " 자동차를 보관하는 곳이에요. ", image: null, audio: null },
            { text: " 가족이 함께 모여 생활하는 곳이에요.", image: null, audio: null }
        ],
        answer: 4
    },
    {
        id: 4,
        instruction: {
            text: "[Q-ID : 4]<br><br>9. 빔칸에 들어칼 가장 알맞은 것을 고르십시오. ",
            image: null,
            audio: null
        },
        questionBody: {
            text: " 20 분 후에 친구와 커피숍에서 __________ 해서 지금 영화 보러 가기 어렵습니다. ",
            image: null,
            audio: null
        },
        options: [
            { text: " 만들기로 ", image: null, audio: null },
            { text: " 만나기로 ", image: null, audio: null },
            { text: " 만들려고 ", image: null, audio: null },
            { text: " 모시려고 ", image: null, audio: null }
        ],
        answer: 2
    },
    {
        id: 5,
        instruction: {
            text: "[Q-ID : 5]<br><br>9. 다음 글을 읽고 내용과 같은 것을 고르십시오. ",
            image: null,
            audio: null
        },
        questionBody: {
            text: " 사다리를 사용할 때에는 항상 안전에 유의해야 합니다. 사다리를 설치할 때는 단단한 바닥에두고, 기울기가 지나치게 크지 핞도록 해야 합니다. 올라갈 때에는 두 손을 사용해 균형을 잡아야 하며, 한쪽에만 몸을 기대지 않도록 주의해야 합니다. 또안 높은 곳에서 작업할 경우에는 반드시 안전모와 안전벨트를 착용해 사고를 예방해야 합니다. ",
            image: null,
            audio: null
        },
        options: [
            { text: " 사다리는 단단하지 않은 바닥에도 세울 수 있습니다. ", image: null, audio: null },
            { text: " 사다리를 오를 때는 반드시 두 손을 사용해야 합니다. ", image: null, audio: null },
            { text: " 안전모와 안전벨트를 착용해야 사고를 당할 수 있습니다. ", image: null, audio: null },
            { text: " 사다리를 사용할 대는 한쪽으로 몸을 기대는 것이 안전합니다. ", image: null, audio: null }
        ],
        answer: 2
    },
    
];

// Register these questions with the manager
registerQuestionSet(9, questionsForNumber9);