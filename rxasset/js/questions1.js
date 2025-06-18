const questions = [
  {
    question: " 이 사진 뭐의 입니까 ?",
    options: { a: "자동차 입니다.", b: "전화기 입니다.", c: "냉장고 입니다.", d: "세탁기 입니다." },
    answer: "c",
    explanation: "In Korea, fridge is called 냉장고.",
    image: "rxasset/QSM1/img/img1.jpg"
  },
  {
    question: " 당신의 이름은 뭐 입니까?",
    options: { a: "저는 학생입니다.", b: "깨 시 로선 입니다.", c: "집에 갑니다.", d: "안녕하세요." },
    answer: "b",
    explanation: "Question asks 'What is your name?'"
  },
  {
    question: "듣고 가장 알맞은 것을 고르십시오.",
    options: { a: "자기야, 사랑해. 너랑 결혼하고 싶어요.", b: "저는 학교 가고 싶어요", c: "밥을 먹고 싶어요", d: "영화를 보고 싶어요" },
    answer: "a",
    explanation: "Romantic sentence – matches the audio.",
    audio: "rxasset/QSM1/audio/audio1.mp3"
  },
  {
    question: " 이 사진은 뭐의 입니까?",
    options: { a: "돈 입니다.", b: "원 입나다.", c: "물소 입니다.", d: "소 입니다." },
    answer: "a",
    explanation: "Review not Aviable.",
    image: "rxasset/QSM1/img/img2.jpg"
  },
  {
    question: "이 사진은 뭐의 입니까?",
    options: { a: "짐대 입니다.", b: "텔레비전 입니다.", c: "노트북 입니다.", d: "컴프터 입니다" },
    answer: "d",
    explanation: "Review not Aviable.",
    image: "rxasset/QSM1/img/img14.jpg"
  },
  {
    question: " 저는 어제 시장에 가서 두 ...... 바지를 샀습니다.",
    options: { a: "개", b: "벌", c: "송이", d: "켤레" },
    answer: "b",
    explanation: "Review Not aviable."
  },
  {
    question: " 이 사진은 뭐의 입니까?",
    options: { a: "이 사진은 학교의 사진입니다.", b: "이 사진은 병원의 사진입니다.", c: "이 사진은 공원의 사진입니다.", d: "이 사진은 경찰서의 사진입니다." },
    answer: "a",
    explanation: "Review not Aviable.",
    image: "rxasset/QSM1/img/img21.jpg"
  },
  {
    question: " 이 소리는 무엇입니까?",
    options: { a: "전화벨", b: "문 여는 소리", c: "기차", d: "개 짖는 소리" },
    answer: "a",
    explanation: "Audio is a phone ringing.",
    audio: "rxasset/QSM1/audio/audio2.wav"
  },
  {
    question: "  이 사진은 뭐의 입니까?",
    options: { a: "버스 입니다.", b: "기차 입니다.", c: "택시 입니다.", d: "차 입니다." },
    answer: "c",
    explanation: "Review not Aviable.",
    image: "rxasset/QSM1/img/img15.jpg"
  },
  {
    question: "  이 사진은 뭐의 입니까?",
    options: { a: "소 입니다.", b: "모자 입니다", c: "바지 입니다.", d: "사자 입니다." },
    answer: "b",
    explanation: "Review not Aviable.",
    image: "rxasset/QSM1/img/img3.jpg"
  },
  {
    question: " 선픙기가 두 ....... 있습니다.",
    options: { a: "대", b: "개", c: "채", d: "켤레" },
    answer: "a",
    explanation: "Review not Aviable."
  },
  {
    question: " 저는 어제 시장에 갔어요, ...... 에서 과일을 샀어요.",
    options: { a: "여기", b: "커기", c: "저기", d: "어디" },
    answer: "a",
    explanation: "Review not Aviable."
  },
  {
    question: " 이 사진은 뭐의 입니까?",
    options: { a: "모자 입니다.", b: "유니픔 입니다.", c: "바지 입니다.", d: "가방 입니다." },
    answer: "c",
    explanation: "Review not Aviable.",
    image: "rxasset/QSM1/img/img4.jpg"
  },
  {
    question: " 가：내일 ....이/가 어때요?<br>나：비가 오고 바람이 많이 불 거예요.",
    options: { a: "시간", b: "날씨", c: "날짜", d: "계절" },
    answer: "b",
    explanation: "Review not Aviable."
  },
  {
    question: " 100000",
    options: { a: "십만", b: "천만", c: "만", d: "조" },
    answer: "a",
    explanation: "Review not Aviable."
  },
  {
    question: " 이 사진은 뭐의 입니까?",
    options: { a: "공항 입니다.", b: "자전거 입니다.", c: "배 입니다.", d: "비행기 입니다." },
    answer: "d",
    explanation: "Review not Aviable.",
    image: "rxasset/QSM1/img/img5.jpg"
  },
  {
    question: " 만오천백오십일",
    options: { a: "151515", b: "10500", c: "15151", d: "15235" },
    answer: "c",
    explanation: "Review not Aviable."
  },
  {
    question: " 지금 일요일 입니다, 모레 ..... 입니다.",
    options: { a: "화요일 입니다.", b: "월요일 입니다.", c: "토요일 입니다.", d: "목요일 입니다." },
    answer: "a",
    explanation: "Review not Aviable."
  },
  {
    question: " 이 사진은 뭐의 입니까?",
    options: { a: "선픙기 입니다.", b: "자동차 입니다.", c: "버스 입니다.", d: "차 입니다." },
    answer: "a",
    explanation: "Review not Aviable.",
    image: "rxasset/QSM1/img/img6.jpg"
  },
  {
    question: " 여기에서 제 집까지 ..... 입니다.",
    options: { a: "세 길로미터 거리", b: "삼 길로미터", c: "세 길로미터", d: "삼 길로미터 거리" },
    answer: "d",
    explanation: "Review not Aviable.'"
  },
  {
    question: "가: 지금 몇 시 입니까?<br>나: ....있어요.",
    options: { a: "일 시 삼 분", b: "한 시 세 분", c: "한 시 삼 분", d: "일 시 세 분" },
    answer: "c",
    explanation: "Review not Aviable."
  },
  {
    question: "  이 사진은 뭐의 입니까?",
    options: { a: "신발장 입니다.", b: "옷장 입니다.", c: "식탁 입니다.", d: "주스 입니다." },
    answer: "b",
    explanation: "Review not Aviable.",
    image: "rxasset/QSM1/img/img7.jpg"
  },
  {
    question: " 저는 밥... 먹습니다.",
    options: { a: "을", b: "븐", c: "은", d: "블" },
    answer: "a",
    explanation: "Review not Aviable."
  },
  {
    question: "  이 사진은 뭐의 입니까?",
    options: { a: "보도", b: "밥", c: "사과", d: "술" },
    answer: "c",
    explanation: "Review not Aviable.",
    image: "rxasset/QSM1/img/img16.jpg"
  },
  {
    question: "  이 사진은 뭐의 입니까?",
    options: { a: "버스 입니다.", b: "차 입니다.", c: "의자 입니다.", d: "짐대 입니다." },
    answer: "c",
    explanation: "Review not Aviable.",
    image: "rxasset/QSM1/img/img8.jpg"
  },
  {
    question: "  이 사진은 뭐의 입니까?",
    options: { a: "나라", b: "집", c: "지도", d: "도시" },
    answer: "c",
    explanation: "Review not Aviable.",
    image: "rxasset/QSM1/img/img17.jpg"
  },
  {
    question: " 이 사진은 뭐의 입니까?",
    options: { a: "구두가 세 켤레 있습니다.", b: "구두가 다섯 켤레 있습니다.", c: "구두가 네 켤레 있습니다.", d: "구두가 여섯 켤레 있습니다." },
    answer: "c",
    explanation: "Review not Aviable.",
    image: "rxasset/QSM1/img/img18.jpg"
  },
  {
    question: "  이 사진은 뭐의 입니까?",
    options: { a: "기차 입니다.", b: "택시 입니다.", c: "버스 입니다.", d: "자동차 입니다." },
    answer: "d",
    explanation: "Review not Aviable.",
    image: "rxasset/QSM1/img/img9.jpg"
  },
  {
    question: " 이 사진은 뭐의 입니까?",
    options: { a: "가방 입니다.", b: "차 입니다.", c: "공책 입니다.", d: "짐대 입니다." },
    answer: "c",
    explanation: "Review not Aviable.",
    image: "rxasset/QSM1/img/img19.jpg"
  },
  {
    question: " 이 사진은 뭐의 입니까?",
    options: { a: "여섯 사람이 회의를 하고 있습니다.", b: "다섯 사람이 회의를 하고 있습니다.", c: "네 사람이 회의를 하고 있습니다.", d: "세 사람이 회의를 하고 있습니다." },
    answer: "c",
    explanation: "Review not Aviable.",
    image: "rxasset/QSM1/img/img20.jpg"
  },
  {
    question: " 이 사진은 뭐의 입니까?",
    options: { a: "자전거 입니다.", b: "택시 입니다.", c: "버스 입니다.", d: "지하천 입니다." },
    answer: "a",
    explanation: "Review not Aviable.",
    image: "rxasset/QSM1/img/img10.jpg"
  },
  {
    question: " 이 사진은 뭐의 입니까?",
    options: { a: "집 입니다.", b: "공원 입니다.", c: "회사 입니다.", d: "하교 입니다." },
    answer: "a",
    explanation: "Review not Aviable.",
    image: "rxasset/QSM1/img/img22.jpg"
  },
  {
    question: "  이 사진은 뭐의 입니까?",
    options: { a: "라디오", b: "택시", c: "버스", d: "나라" },
    answer: "a",
    explanation: "Review not Aviable.",
    image: "rxasset/QSM1/img/img23.jpg"
  },
  {
    question: " 이 사진은 뭐의 입니까?",
    options: { a: "비행기 입니다.", b: "기차 입니다.", c: "트레그 입니다.", d: "유교 입니다." },
    answer: "b",
    explanation: "Review not Aviable.",
    image: "rxasset/QSM1/img/img11.jpg"
  },
  {
    question: " 길로미터",
    options: { a: "마리", b: "분", c: "거리", d: "무게" },
    answer: "c",
    explanation: "Review not Aviable."
  },
  {
    question: " 길로그램",
    options: { a: "거리", b: "본", c: "무게", d: "미국" },
    answer: "c",
    explanation: "Review not Aviable."
  },
  {
    question: "  이 사진은 뭐의 입니까?",
    options: { a: "신문 입니다.", b: "버스 입니다다", c: "책 입니다", d: "빗자루 입니다." },
    answer: "c",
    explanation: "Review not Aviable.",
    image: "rxasset/QSM1/img/img12.jpg"
  },
  {
    question: " 두.... 학생 하교 가요 .",
    options: { a: "명", b: "분", c: "학교", d: "공원" },
    answer: "a",
    explanation: "Review not Aviable."
  },
  {
    question: " 9999999",
    options: { a: "구구구구구구구", b: "구구십구만구구백구십구", c: "구백구십구만구천구백구십구", d: "백구십구만구천구백구구" },
    answer: "c",
    explanation: "Review not Aviable."
  },
  {
    question: " 이 사진은 뭐의 입니까?<br>",
    options: { a: "에어컨 입니다.", b: "사진 입니다.", c: "양돈 입니다.", d: "사진기 입니다" },
    answer: "d",
    explanation: "Review not Aviable.",
    image: "rxasset/QSM1/img/img13.jpg"
  },
];