// qs-no-6.js - Multiple possible questions for Question 6

const questionsForNumber6 = [
    {
        id: 1,
        instruction: {
            text: "[Q-ID : 1]<br><br> 6. 다음 중 밑줄 친 부분이 맞는 것은 무엇입니까?", 
            image: null, 
            audio: null
        },
        questionBody: {
            text: "", 
            image: null, 
            audio: null
        },
        options: [
            { text: "친구한테서 선물을 <u>받았어요</u>.", image: null, audio: null },
            { text: "퇴근할 때 문을 <u>달으세요</u>.", image: null, audio: null },
            { text: "심심하면 한국 노래를 <u>듣어요</u>.", image: null, audio: null },
            { text: "오늘 시내에서 많이 <u>걷었어요</u>.", image: null, audio: null }
        ],
        answer: 1
    },
    {
        id: 2,
        instruction: {
            text: "[Q-ID : 2]<br><br>6. 다음 중 밑줄 친 부분이 맞는 것은 무엇입니까?", 
            image: null, 
            audio: null
        },
        questionBody: {
            text: null, 
            image: null, 
            audio: null
        },
        options: [
            { text: "집에서 </u>쉬었습니다.", image: null, audio: null },
            { text: "<u>가족와 </u>외식했어요.", image: null, audio: null },
            { text: "<u>공원아서 </u>산책했어요..", image: null, audio: null },
            { text: "<u>친구과 </u>영화를 봤어요.", image: null, audio: null }
        ],
        answer: 1
    },
    
];

// Register these questions with the manager
registerQuestionSet(6, questionsForNumber6);