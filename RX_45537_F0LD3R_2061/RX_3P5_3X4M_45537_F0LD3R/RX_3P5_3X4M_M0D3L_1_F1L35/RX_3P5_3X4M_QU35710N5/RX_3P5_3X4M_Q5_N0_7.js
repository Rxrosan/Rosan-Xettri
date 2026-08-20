// qs-no-7.js - Multiple possible questions for Question 7

const questionsForNumber7 = [
    {
        id: 1,
        instruction: {
            text: "[Q-ID : 1]<br><br> 7. 이 병원이 문을 여는 시간은 언제입니까?",
            image: null,
            audio: null
        },
        questionBody: {
            text: null,
            image: "RX_45537_F0LD3R_2061/RX_3P5_3X4M_45537_F0LD3R/RX_3P5_3X4M_1M463/IMG-6.jpg",
            audio: null
        },
        options: [
            { text: "튼튼치과입니다.", image: null, audio: null },
            { text: "김미소입니다.", image: null, audio: null },
            { text: "오전 아홉 시입니다.", image: null, audio: null },
            { text: "부천시입니다.", image: null, audio: null }
        ],
        answer: 3
    },
    {
        id: 2,
        instruction: {
            text: "[Q-ID : 2]<br><br> 7. 다음 글을 읽고 물음에 답하십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: "이 학원의 소장은 누구입니까?",
            image: "RX_45537_F0LD3R_2061/RX_3P5_3X4M_45537_F0LD3R/RX_3P5_3X4M_1M463/IMG-32.jpg",
            audio: null
        },
        options: [
            { text: "김세연입니다.", image: null, audio: null },
            { text: "서울특별시입니다.", image: null, audio: null },
            { text: "비즈니스 영어입니다.", image: null, audio: null },
            { text: "오전 10시 ~ 오후 9시.", image: null, audio: null }
        ],
        answer: 1
    },

];

// Register these questions with the manager
registerQuestionSet(7, questionsForNumber7);