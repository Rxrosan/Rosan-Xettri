const questions = [
  {
    question: " 1<br> 오늘은 월요일입니다. 내일은 화요일입니다.",
    options: { a: "날짜", b: "휴일", c: "요일", d: "장소" },
    answer: "c",
    explanation: "Review Not aviable."
  },
  {
    question: " 2<br>사과가 맛있습니다. 바나나도 맛있습니다. ",
    options: { a: "과일", b: "날씨", c: "직업", d: "나이" },
    answer: "a",
    explanation: "Review Not aviable."
  },
  {
    question: " 3<br>다음 단어와 관계있는 것을 무엇입니까 ?<br> <br> 배 , 버스 , 자동차 , 지하철 <br> <br> ",
    options: { a: " 신다 ", b: " 타다 ", c: " 버리다 ", d: " 건너다 " },
    answer: "b",
    explanation: "Review Not aviable."
  },
  {
    question: " 4<br>다음 단어의 반대말을 고르십시오.<br> <br> 짧다<br> <br> ",
    options: { a: " 멀다 ", b: " 많다 ", c: " 길다 ", d: " 적다 " },
    answer: "c",
    explanation: "Review Not aviable."
  },
  {
    question: "5<br> ",
    options: { a: "자동차 입니다.", b: "전화기 입니다.", c: " 냉장고 입니다.", d: "세탁기 입니다." },
    answer: "c",
    explanation: "",
    image: "ASSETS/KR-EXAM-FILES/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-3/IMG/img1.jpg"
  },
  {
    question: " 6<br>가게에 갑니다. 모자를 삽니다.",
    options: { a: "공부", b: "이름", c: "물건", d: "쇼핑" },
    answer: "d",
    explanation: "Review Not aviable."
  },
  {
    question: " 7<br>7월에는 수업이 없습니다. 학교에 안 갑니다. ",
    options: { a: "위치", b: "방학", c: "여행", d: "계절" },
    answer: "b",
    explanation: "Review Not aviable."
  },
  {
    question: " 8<br>비가 옵니다.----을 씁니다.",
    options: { a: "안경", b: "양말", c: "우산", d: "지갑" },
    answer: "c",
    explanation: "Review Not aviable."
  },
  {
    question: " 9<br>영화를-----. 정말 재미있습니다.",
    options: { a: "봅니다", b: "잡니다", c: "보냅니다", d: "마십니다" },
    answer: "a",
    explanation: "Review Not aviable."
  },{
    question: "10<br> ",
    options: { a: "신발장 입니다.", b: "식탁 입니다.", c: " 옷장 입니다.", d: "주스 입니다." },
    answer: "c",
    explanation: "",
    image: "ASSETS/KR-EXAM-FILES/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-3/IMG/img2.jpg"
  },
  {
    question: " 11<br>한국 가수를 좋아합니다. 매일 한국 ------를 듣습니다. ",
    options: { a: "편지", b: "전화", c: "시계", d: "노래" },
    answer: "d",
    explanation: "Review Not aviable."
  },
  
  {
    question: " 12<br>저는 선생님입니다. 학교에서 학생들을 ----. ",
    options: { a: "읽습니다", b: "물어봅니다", c: "가르칩니다", d: "입습니다" },
    answer: "c",
    explanation: "Review Not aviable."
  },
  {
    question: " 13<br>저는 요즘 ----. 시간이 없습니다.",
    options: { a: "바쁩니다", b: "작습니다", c: "무겁습니다", d: "조용합니다" },
    answer: "a",
    explanation: "Review Not aviable."
  },
  {
    question: " 14<br>저는 김민수 씨를 모릅니다. 내일---- 만납니다.",
    options: { a: "항상", b: "제일", c: "보통", d: "처음" },
    answer: "d",
    explanation: "Review Not aviable."
  },
  {
    question: "15<br> ",
    options: { a: "버스 입니다.", b: " 기차 입니다", c: "택시 입니다.", d: "차 입니다." },
    answer: "c",
    explanation: "",
    image: "ASSETS/KR-EXAM-FILES/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-3/IMG/img3.jpg"
  },
  {
    question: " 16<br>저는 볼펜이 없습니다. 연필----있습니다. ",
    options: { a: "을", b: "만", c: "도", d: "다리" },
    answer: "b",
    explanation: "Review Not aviable."
  },
  {
    question: " 17<br>저는 요리를 잘 못합니다. 그래서 음식을 보통 사 먹습니다. 오늘 저녁은 집 근처 식당에서 불고기를 먹을 겁니다",
    options: { a: "저는 요리를 자주 합니다.", b: "집 근처에 식당이 없습니다.", c: "저는 오늘 불고기를 먹을 겁니다.", d: "저는 오늘 집에서 저녁을 먹습니다." },
    answer: "c",
    explanation: "Review Not aviable."
  },
  {
    question: " 18<br>어제 친구가 한국에 왔습니다. 오늘 우리 집에 놀러 올 겁니다. 저는 집을 깨끗하게 청소했습니다. ",
    options: { a: "친구하고 집을 청소할 겁니다.", b: "친구가 오늘 한국에 왔습니다.", c: "저는 친구 집에 갈 겁니다.", d: "저는 오늘 친구를 만납니다." },
    answer: "d",
    explanation: "Review Not aviable."
  },
  {
    question: " 19<br>저는 보통 버스를 탑니다. ----- 지하철을 탑니다.",
    options: { a: "항상", b: "아주", c: "빨리", d: "가끔" },
    answer: "d",
    explanation: "Review Not aviable."
  },
  {
    question: "20<br> ",
    options: { a: "나라", b: "도시", c: "지도", d: "집" },
    answer: "c",
    explanation: "",
    image: "ASSETS/KR-EXAM-FILES/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-3/IMG/img4.jpg"
  },
  {
    question: "21<br> 듣고 가장 알맞은 것을 고르십시오.",
    options: { a: "당신의 여동생이 이름은 뭐 입니까 ?", b: " 단신의 여동생 있어요 ?", c: "제 여동생 열다섯 살 입니다.", d: "오늘 여동생랑 시장 갑니다." },
    answer: "a",
    explanation: "Review not Aviable.",
    audio: "ASSETS/KR-EXAM-FILES/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-3/AUDIO/audio1.mp3"
  },
  {
    question: "22<br> 듣고 가장 알맞은 것을 고르십시오.",
    options: { a: "이 소 다섯 원 입니다 .", b: "이 양말 오백 원 입니다 .", c: "이 모자 오백 원 입니다 .", d: "이 지갑 오백 원 입니다 ." },
    answer: "d",
    explanation: "Review not Aviable.",
    audio: "ASSETS/KR-EXAM-FILES/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-3/AUDIO/audio2.mp3"
  },
  {
    question: "23<br> 듣고 가장 알맞은 것을 고르십시오.",
    options: { a: "이  소 입니다.", b: "이 가방  입니다.", c: "이 물소  입니다.", d: "이 사람 입니다." },
    answer: "d",
    explanation: "Review not Aviable.",
    audio: "ASSETS/KR-EXAM-FILES/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-3/AUDIO/audio3.mp3"
  },
  {
    question: "24<br> 듣고 가장 알맞은 것을 고르십시오.",
    options: { a: "제 여동생이 없어요.", b: "제 누나이 없어요.", c: "제 남동생이 없어요.", d: "제 할머니이 없어요." },
    answer: "c",
    explanation: "Review not Aviable.",
    audio: "ASSETS/KR-EXAM-FILES/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-3/AUDIO/audio4.mp3"
  },
  {
    question: "25<br> 듣고 가장 알맞은 것을 고르십시오.",
    options: { a: "당신이 음식을 요리하세요.", b: "저는 집에 갑니다 .", c: "당신 어디 갑니까 ?", d: "아이구 ,뭐 생겨요 ?" },
    answer: "a",
    explanation: "Review not Aviable.",
    audio: "ASSETS/KR-EXAM-FILES/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-3/AUDIO/audio5.mp3"
  },
  {
    question: "26<br> 듣고 가장 알맞은 것을 고르십시오.",
    options: { a: "어디 가고 싶어요 ?", b: "닭 고기를 먹을래요 ?", c: "저는 고기를 먹고 싶어요.", d: "이 고기는 뭣은 입니까 ?" },
    answer: "a",
    explanation: "Review not Aviable.",
    audio: "ASSETS/KR-EXAM-FILES/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-3/AUDIO/audio6.mp3"
  },
  {
    question: "27<br> 듣고 가장 알맞은 것을 고르십시오.",
    options: { a: "안녕하세요.", b: "제 친구 집에 갑니다 .", c: "안녕하세요 ,제 이름은 깨 시 로선 입니다 .", d: "안녕하세요 ,저는 집에 갑니다 ." },
    answer: "d",
    explanation: "Review not Aviable.",
    audio: "ASSETS/KR-EXAM-FILES/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-3/AUDIO/audio7.mp3"
  },
  {
    question: "28<br> 듣고 가장 알맞은 것을 고르십시오.",
    options: { a: "네 , 저를 닭고기 좋아해요.", b: "네 , 저는 너를 사랑합니다.", c: "네 , 저는 집에 가고 싶어요.", d: "이 장미꽃 저를 많이 좋아해요." },
    answer: "b",
    explanation: "Review not Aviable.",
    audio: "ASSETS/KR-EXAM-FILES/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-3/AUDIO/너이 저를 사랑 합니까.mp3"
  },
  {
    question: "29<br> 듣고 가장 알맞은 것을 고르십시오.",
    options: { a: "여기에서 시장까지 일시 십분 걸렀어요", b: "여기에서 시장까지 일십 열분 걸렀어요", c: "여기에서 시장까지 한시 십분 걸렀어요", d: "여기에서 시장까지 한시 열분 걸렀어요" },
    answer: "c",
    explanation: "Review not Aviable.",
    audio: "ASSETS/KR-EXAM-FILES/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-3/AUDIO/여기에서 시장까지 얼마나 걸렀어요.mp3"
  },
  {
    question: "30<br> 듣고 가장 알맞은 것을 고르십시오.",
    options: { a: "이 시발은 구십구 원 입니다.", b: "이 시발은 아흔아홉 원 입니다.", c: "이 시발은 구십구 돈 입니다.", d: "이 시발은 아흔아홉 돈 입니다." },
    answer: "a",
    explanation: "Review not Aviable.",
    audio: "ASSETS/KR-EXAM-FILES/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-3/AUDIO/이 신발을 얼마 입니까.mp3"
  },
  {
    question: "31<br> 듣고 가장 알맞은 것을 고르십시오.",
    options: { a: "저는 스물 살 년 입니다.", b: "저는 이십 살 입니다.", c: "저는 이십 살 년 입니다.", d: "저는 스물 살 입니다." },
    answer: "d",
    explanation: "Review not Aviable.",
    audio: "ASSETS/KR-EXAM-FILES/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-3/AUDIO/몇 살 입니까.mp3"
  },
  {
    question: "32<br> 듣고 가장 알맞은 것을 고르십시오.",
    options: { a: "아니요 , 저는 물소 고기를 먹지않아요.", b: "네 , 저는 닭고기를 먹고 싶어요.", c: "불고기를 좋아해요.", d: "이 고기는 뭐의 입니까 ?" },
    answer: "b",
    explanation: "Review not Aviable.",
    audio: "ASSETS/KR-EXAM-FILES/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-3/AUDIO/닭 고기를 먹을래요.mp3"
  },
  {
    question: "33<br> 듣고 가장 알맞은 것을 고르십시오.",
    options: { a: "괜찮아요.", b: "만나서 반갑습니다.", c: "네팔 나라에서 왔어요.", d: "외국에서 왔어요." },
    answer: "c",
    explanation: "Review not Aviable.",
    audio: "ASSETS/KR-EXAM-FILES/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-3/AUDIO/어느 나라에서 왔어요.mp3"
  },
  {
    question: "34<br> 듣고 가장 알맞은 것을 고르십시오.",
    options: { a: "그럼 병원까지 갑시다.", b: "그럼 은행까지 갑시다.", c: "그럼 학교까지 갑시다.", d: "그럼 회사까지 갑시다." },
    answer: "a",
    explanation: "Review not Aviable.",
    audio: "ASSETS/KR-EXAM-FILES/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-3/AUDIO/머리가 많이 아파요.mp3"
  },
  {
    question: "35<br> 듣고 가장 알맞은 것을 고르십시오.",
    options: { a: " 친구를 배고픈 것 같아요.", b: "친구들이 영화를 보는 것 같아요.", c: " 문제가 어려워 보여요.", d: "저를  많이 고팠어요." },
    answer: "d",
    explanation: "Review not Aviable.",
    audio: "ASSETS/KR-EXAM-FILES/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-3/AUDIO/당신을 무엇은 됐어요.mp3"
  },
  {
    question: "36<br> 듣고 가장 알맞은 것을 고르십시오.",
    options: { a: "이 킬로 그램에 몇 그램 입니까 ?", b: "일 킬로 그램에 몇 그램 입니까 ?", c: "한 킬로 그램에 몇 그램 입니까 ?", d: "두 킬로 그램에 몇 그램 입니까 ?" },
    answer: "b",
    explanation: "Review not Aviable.",
    audio: "ASSETS/KR-EXAM-FILES/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-3/AUDIO/일 킬로 그램에 천 그램 입니다.mp3"
  },
  {
    question: "37<br> 듣고 가장 알맞은 것을 고르십시오.",
    options: { a: "오전 몇 시 입니까 ?", b: "오후 몇 시 입니까 ?", c: "올해 몇 시 입니까 ?", d: "내일 몇 시 입니까 ?" },
    answer: "b",
    explanation: "Review not Aviable.",
    audio: "ASSETS/KR-EXAM-FILES/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-3/AUDIO/오후 네시 삼분 입니다.mp3"
  },
  {
   question: "37<br> 듣고 가장 알맞은 것을 고르십시오.",
    options: { a: "다음에 날씨 많이 좋알거에요.", b: "모래 비가 왈거에요.", c: "오늘 날씨 너무 좋아요.", d: "내일 날씨 좋알거에요" },
    answer: "c",
    explanation: "Review not Aviable.",
    audio: "ASSETS/KR-EXAM-FILES/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-3/AUDIO/오늘 날씨가 어떤 입니까.mp3"
  },
  {
    question: "37<br> 듣고 가장 알맞은 것을 고르십시오.",
    options: { a: "지금 얼마나 시 입니까 ?", b: "지금 누구 시 입니까 ?", c: "지금 뭐 시 입니까 ?", d: "지금 몇 시 입니까 ?" },
    answer: "d",
    explanation: "Review not Aviable.",
    audio: "ASSETS/KR-EXAM-FILES/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-3/AUDIO/지금 한시 십분 입니다.mp3"
  },
  {
    question: "37<br> 듣고 가장 알맞은 것을 고르십시오.",
    options: { a: "지금 다섯 시 오분 입니다.", b: "지금 오시 오분 입니다.", c: "지금 오시 다섯분 입니다.", d: "지금 다섯시 다섯 분 입니다." },
    answer: "a",
    explanation: "Review not Aviable.",
    audio: "ASSETS/KR-EXAM-FILES/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-3/AUDIO/지금 몇 시 입니까.mp3"
  },
];