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
            image: "RX_45537_F0LD3R_2061/RX_3P5_3X4M_45537_F0LD3R/RX_3P5_3X4M_1M463/IMG-7.jpg",
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
            image: "RX_45537_F0LD3R_2061/RX_3P5_3X4M_45537_F0LD3R/RX_3P5_3X4M_1M463/IMG-39.jpg",
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
    {
        id: 3,
        instruction: {
            text: "[Q-ID : 3]<br><br>10. 빔칸에 들어칼 가장 알맞은 것을 고르십시오. ",
            image: null,
            audio: null
        },
        questionBody: {
            text: " 저는 일하는 화사가 좀 멉니다. 기숙사에서 회사까지 __________ 가는 버스가 없슺니다. 그래서 저는 버스를 타고 오거리에서 내려 자하철로 갈아탑니다. ",
            image: null,
            audio: null
        },
        options: [
            { text: " 특히 ", image: null, audio: null },
            { text: " 바로 ", image: null, audio: null },
            { text: " 빨리 ", image: null, audio: null },
            { text: " 오래 ", image: null, audio: null }
        ],
        answer: 2
    },
    {
        id: 6,
        instruction: {
            text: "[Q-ID : 6]<br><br>10. 다음 글을 읽고 내용과 같은 것을 고르십시오. ",
            image: null,
            audio: null
        },
        questionBody: {
            text: " 국제 항공 소포를 이용하면 외국으로 물건을 비교적 저럼하게 보낼 수 있으며, 베송 진행 상황을 인터넷으로 확인할 수 있습니다. 항공 소포로 의류, 서류, 장난감 등을 보낼 수 있지만, 신선 식품, 위험 물질, 현금은 보낼 수 없습니다. 국내에서는 귀중품이나 조용한 물건을 보낼 때 안전하게 받는 사람에게 절달되는 택배 서비스를 이용하면 좋습니다. ",
            image: null,
            audio: null
        },
        options: [
            { text: " 국내에서는 귀중품을 보낼 때 일반 소포가 더 안잔합니다. ", image: null, audio: null },
            { text: " 항공 소포는 외국으로 물건을 보낼 때 빠르자만 비쌉니다. ", image: null, audio: null },
            { text: " 항공 소포는 인터넷으로 배송 사항을 확인할 수 있습니다. ", image: null, audio: null },
            { text: " 항공 소포는 외국으로 물건을 보낼 때 비교적 저렴합니다. ", image: null, audio: null }
        ],
        answer: 4
    },
];

// Register these questions with the manager
registerQuestionSet(10, questionsForNumber10);