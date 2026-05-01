// qs-no-19.js - Multiple possible questions for Question 19

const questionsForNumber19 = [
    {
        id: 1,
        instruction: {
            text: "[Q-ID : 1]<br><br> 19. 다음 글을 읽고 내용과 같은 것을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: null,
            image: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-IMAGE/IMG-8.jpg",
            audio: null
        },
        options: [
            { text: "회사 직원은 누구나 휴게실을 이용할 수 있습니다.", image: null, audio: null },
            { text: "휴게실 이용 후에는 문을 열어 두고 나가야 합니다.", image: null, audio: null },
            { text: "점심 도시락을 싸 가서 휴게실에서 먹을 수 있습니다.", image: null, audio: null },
            { text: "사내 휴게실의 출입문 비밀번호는 따로 없습니다.", image: null, audio: null }
        ],
        answer: 1
    },
    {
        id: 2,
        instruction: {
            text: "[Q-ID : 2]<br><br>19. 다음 글을 읽고 내용과 같은 것을 고르십시오.",
            image: null,
            audio: null
        },
        questionBody: {
            text: null,
            image: "RX-ASSETS/RX-EXAM-FILE/RX-EXAM-IMAGE/IMG-96.jpg",
            audio: null
        },
        options: [
            { text: "특정 직원만 복사기를 사용할 수 있습니다.", image: null, audio: null },
            { text: "문서가 분실되었을 수 있으니 꼭 확인하세요.", image: null, audio: null },
            { text: "복사기는 개인적인 용도로 사용할 수 있습니다.", image: null, audio: null },
            { text: "용지나 토너가 부족하면 집에서 가져와야 합니다.", image: null, audio: null }
        ],
        answer: 2
    },
];

// Register these questions with the manager
registerQuestionSet(19, questionsForNumber19);