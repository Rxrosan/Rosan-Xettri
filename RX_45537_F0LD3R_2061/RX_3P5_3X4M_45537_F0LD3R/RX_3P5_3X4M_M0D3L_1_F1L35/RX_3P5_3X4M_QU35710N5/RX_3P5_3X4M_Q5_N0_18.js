// qs-no-18.js - Multiple possible questions for Question 18

const questionsForNumber18 = [
    {
        id: 1,
        instruction: {
            text: "[Q-ID : 1]<br><br> 18. 다음 글을 읽고 무엇에 대한 글인지 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "한국 사람들은 계절마다 즐겨 먹는 음식이 있습니다. 여름에는 차갑고 시원한 냉면, 콩국수, 팥빙수 등을 많이 먹습니다. 겨울에는 뜨거운 국이나 따뜻한 팥죽, 군고구마, 호떡 등을 자주 먹습니다.",
            image: null,
            audio: null
        },
        options: [
            { text: "음식 재료", image: null, audio: null },
            { text: "계절 음식", image: null, audio: null },
            { text: "조리 시기", image: null, audio: null },
            { text: "조리 방법", image: null, audio: null }
        ],
        answer: 2
    },
    {
        id: 2,
        instruction: {
            text: "[Q-ID : 2]<br><br>18. 다음 글을 읽고 무엇에 대한 글인지 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "위험한 화학물질은 라벨을 부착하여 보관하세요. 잘못 사용할 경우 큰 사고가 발생할 수 있습니다. ",
            image: null,
            audio: null
        },
        options: [
            { text: " 경고  ", image: null, audio: null },
            { text: " 안내 ", image: null, audio: null },
            { text: " 칭찬 ", image: null, audio: null },
            { text: " 소개", image: null, audio: null }
        ],
        answer: 1
    },
    {
        id: 3,
        instruction: {
            text: "[Q-ID : 3]<br><br>18. 다음 글을 읽고 무엇에 대한 글인지 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "한국에서는 설날이 되면 가족들이 함께 모입니다. 그리고 떠국을 먹고 서로 새해 인사를 합니다. 아이들은 어른들에게 세배를 하고 세뱃돈을 받기도 합니다. ",
            image: null,
            audio: null
        },
        options: [
            { text: " 한국의 명절 문화 ", image: null, audio: null },
            { text: " 한국의 음식 종류 ", image: null, audio: null },
            { text: " 한국의 계절 활동 ", image: null, audio: null },
            { text: " 한국의 명절 종류 ", image: null, audio: null }
        ],
        answer: 1
    },
    {
        id: 4,
        instruction: {
            text: "[Q-ID : 4]<br><br>18. 다음 글을 읽고 무엇에 대한 글인지 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: " 원사는 습기와 직사광선에 민감하여 보관 방법이 중요합니다. 사용하지 않을 때는 밀폐 용기에 넣어 건조하고 서늘한 곳에 보관해야 하며, 색상이 변하거나 상하지 않도록 먼지와 햇핓을 피하는 것이 좋슺니다.",
            image: null,
            audio: null
        },
        options: [
            { text: " 원사 보관 방법 ", image: null, audio: null },
            { text: " 옷 만들기 순서 ", image: null, audio: null },
            { text: " 염색 가공 순서 ", image: null, audio: null },
            { text: " 원사 구매 요령 ", image: null, audio: null }
        ],
        answer: 1
    },
];

// Register these questions with the manager
registerQuestionSet(18, questionsForNumber18);