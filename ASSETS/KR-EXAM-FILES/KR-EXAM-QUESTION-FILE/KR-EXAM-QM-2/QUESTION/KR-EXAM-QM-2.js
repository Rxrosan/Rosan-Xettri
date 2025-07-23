const questions = [
  {
    question: " 1<br> 가 :괜찮아요? 많이 아파 보여요.<br>나 :_______에 걸렸어요. 열도 나고 목도 아파요.",
    options: { a: "약", b: "감기", c: "병원", d: "기침" },
    answer: "b",
    explanation: "Review Not aviable."
  },
  {
    question: " 2<br>저는 구청에서 한국말을 배웠어요.  1월부터 6월까지 6 _____ 동안 배웠어요. ",
    options: { a: "개월", b: "시간", c: "년", d: "월" },
    answer: "a",
    explanation: "Review Not aviable."
  },
  {
    question: " 3<br>제가 제일 좋아하는 ________은/는 가을입니다. ",
    options: { a: "음식", b: "운동", c: "과일", d: "계절" },
    answer: "d",
    explanation: "Review Not aviable."
  },
  {
    question: " 4<br>친구가 오늘 10시 비행기로 한국에 오기 때문에 _________에 마중 가요. ",
    options: { a: "기차역", b: "정류장", c: "공항", d: "항구" },
    answer: "c",
    explanation: "Review Not aviable."
  },
  {
    question: " 5<br>가：이 ________ 이름이 뭐예요?<br>나：수박이에요. 주로 여름철에 많이 먹는데, 아주 달아요. ",
    options: { a: "과일", b: "고기", c: "과자", d: "식당" },
    answer: "a",
    explanation: "Review Not aviable."
  },
  {
    question: " 6<br>가：시장에 가서 무엇을 샀어요?<br>나：아무것도 사지 않고 _________만 했어요. ",
    options: { a: "회의", b: "등산", c: "물건", d: "구경" },
    answer: "d",
    explanation: "Review Not aviable."
  },
  {
    question: " 7<br>가：어디에서 살아요?<br>나：직장 동료들과 함께 회사 _________에서 살아요. ",
    options: { a: "화장실", b: "기숙사", c: "공원", d: "교실" },
    answer: "b",
    explanation: "Review Not aviable."
  },
  {
    question: " 8<br>저는 올해 열아홉 살입니다. ________에 스무 살이 됩니다. ",
    options: { a: "작년", b: "나이", c: "내년", d: "어제" },
    answer: "c",
    explanation: "Review Not aviable."
  },
  {
    question: " 9<br>가：내일 __________이/가 어때요?<br>나：비가 오고 바람이 많이 불 거예요. ",
    options: { a: "날씨", b: "날짜", c: "계절", d: "시간" },
    answer: "a",
    explanation: "Review Not aviable."
  },
  {
    question: " 10<br>오늘은 9월 11일입니다. _________은/는 9월 12일입니다. ",
    options: { a: "그저께", b: "어제", c: "모레", d: "내일" },
    answer: "d",
    explanation: "Review Not aviable."
  },
  {
    question: " 11<br>저는 _________이/가 나빠요. 그래서 안경을 쓰지 않으면 잘 안 보여요. ",
    options: { a: "머리", b: "눈", c: "귀", d: "손" },
    answer: "b",
    explanation: "Review Not aviable."
  },
  {
    question: " 12<br>오늘은 우리 공장에 일이 별로 없었습니다. 그래서 오늘은 기계를 한 ______만 사용했습니다. ",
    options: { a: "마리", b: "켤레", c: "대", d: "병" },
    answer: "c",
    explanation: "Review Not aviable."
  },
  {
    question: " 13<br>가：공중전화를 걸려고 하는데 100원짜리 _________ 있어요?<br>나：아니요, 저도 없어요. 지폐만 있어요. ",
    options: { a: "동전", b: "지갑", c: "가방", d: "종이" },
    answer: "a",
    explanation: "Review Not aviable."
  },
  {
    question: " 14<br>가：머리가 많이 아파요.<br>나：머리가 아프면 ________을/를 드세요. 그건 처방전 없이 약국에서 살 수 있어요. ",
    options: { a: "소화제", b: "항생제", c: "치약", d: "두통약" },
    answer: "d",
    explanation: "Review Not aviable."
  },
  {
    question: " 15<br>가：아저씨, 이 생선 얼마예요?<br>나：한 ________에 2,000원이에요. ",
    options: { a: "마리", b: "잔", c: "시간", d: "명" },
    answer: "a",
    explanation: "Review Not aviable."
  },
  {
    question: " 16<br>아침에 일어나니까 ________가 많이 아팠습니다. 그래서 약국에 가서 두통약을 사 먹었습니다. ",
    options: { a: "이", b: "머리", c: "배", d: "다리" },
    answer: "b",
    explanation: "Review Not aviable."
  },
  {
    question: " 17<br>가：한국의 전통 옷이 한복이지요? 한복은 언제 입어요?<br>나：설날이나 추석 같은 __________에 주로 입어요. ",
    options: { a: "결혼식", b: "계절", c: "명절", d: "겨울" },
    answer: "c",
    explanation: "Review Not aviable."
  },
  {
    question: " 18<br>가：회사에 외국 사람도 있어요?<br>나：네, 세 ____ 있어요. ",
    options: { a: "장", b: "개", c: "권", d: "명" },
    answer: "d",
    explanation: "Review Not aviable."
  },
  {
    question: " 19<br>오늘은 금요일입니다. ________은/는 일요일입니다. ",
    options: { a: "어제", b: "그제", c: "내일", d: "모레" },
    answer: "d",
    explanation: "Review Not aviable."
  },
  {
    question: " 20<br>한국 사람은 밥하고 김치, 고기, 생선, 나물 같은 __________을 먹습니다. ",
    options: { a: "그릇", b: "과일", c: "반찬", d: "후식" },
    answer: "c",
    explanation: "Review Not aviable."
  },
  {
    question: "21<br> 듣고 가장 알맞은 것을 고르십시오.",
    options: { a: "당신의 여동생이 이름은 뭐 입니까 ?", b: " 단신의 여동생 있어요 ?", c: "제 여동생 열다섯 살 입니다.", d: "오늘 여동생랑 시장 갑니다." },
    answer: "a",
    explanation: "Review not Aviable.",
    audio: "ASSETS/KR-EXAM-FILES/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-2/AUDIO/audio1.mp3"
  },
  {
    question: "22<br> 듣고 가장 알맞은 것을 고르십시오.",
    options: { a: "이 지갑의 다섯 원 입니다 .", b: "이 양말 오백 원 입니다 .", c: "이 모자 오백 원 입니다 .", d: "이 지갑의 오백 원 입니다 ." },
    answer: "d",
    explanation: "Review not Aviable.",
    audio: "ASSETS/KR-EXAM-FILES/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-2/AUDIO/audio2.mp3"
  },
  {
    question: "23<br> 듣고 가장 알맞은 것을 고르십시오.",
    options: { a: "이 가방은 소의 입니다.", b: "이 가방 제는 입니다.", c: "이 소 제는 입니다.", d: "이 가방 없어요." },
    answer: "b",
    explanation: "Review not Aviable.",
    audio: "ASSETS/KR-EXAM-FILES/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-2/AUDIO/audio3.mp3"
  },
  {
    question: "24<br> 듣고 가장 알맞은 것을 고르십시오.",
    options: { a: "제  이름은 깨 시 로선 입니다 .", b: "제 남동생 이름은 깨 시 로선 입니다 .", c: "제 친구 이름은 깨 시 로선 입니다 .", d: "제 아버지 이름은 깨 시 로선 입니다 ." },
    answer: "c",
    explanation: "Review not Aviable.",
    audio: "ASSETS/KR-EXAM-FILES/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-2/AUDIO/audio4.mp3"
  },
  {
    question: "25<br> 듣고 가장 알맞은 것을 고르십시오.",
    options: { a: "당신이 음식을 요리해요.", b: "저는 뭐 해요 ?", c: "당신 어디 갑니까 ?", d: "아이구 ,뭐 일어나요 ." },
    answer: "a",
    explanation: "Review not Aviable.",
    audio: "ASSETS/KR-EXAM-FILES/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-2/AUDIO/audio5.mp3"
  },
  {
    question: "26<br> 듣고 가장 알맞은 것을 고르십시오.",
    options: { a: "당신을 물소 고기를 먹고 좋아요 ?", b: "당신을 고기를 먹고 좋아요 ?", c: "저는 고기를 먹고 싶어요.", d: "이 고기는 뭣은 입니까 ?" },
    answer: "a",
    explanation: "Review not Aviable.",
    audio: "ASSETS/KR-EXAM-FILES/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-2/AUDIO/audio6.mp3"
  },
  {
    question: "27<br> 듣고 가장 알맞은 것을 고르십시오.",
    options: { a: "당신은 집에 갑니까 ?", b: "당신에 이름은 뭐 입니까 ?", c: "어디 갑니까 ?", d: "당신의 집 어디로 있습니까 ?" },
    answer: "d",
    explanation: "Review not Aviable.",
    audio: "ASSETS/KR-EXAM-FILES/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-2/AUDIO/audio7.mp3"
  },
  {
    question: "28<br> 듣고 가장 알맞은 것을 고르십시오.",
    options: { a: "내일 갑니다.", b: "당신이 오늘 뭣은 먹습니까 ?", c: "식당에 먹습니다.", d: "닥 고기를 먹습니다." },
    answer: "b",
    explanation: "Review not Aviable.",
    audio: "ASSETS/KR-EXAM-FILES/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-2/AUDIO/audio8.mp3"
  },
  {
    question: "29<br> 듣고 가장 알맞은 것을 고르십시오.",
    options: { a: "물소 입니까 ?", b: "비행기 입니다.", c: "제 친구 입니다 .", d: "소 입니다." },
    answer: "c",
    explanation: "Review not Aviable.",
    audio: "ASSETS/KR-EXAM-FILES/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-2/AUDIO/audio9.mp3"
  },
  {
    question: "30<br> 듣고 가장 알맞은 것을 고르십시오.",
    options: { a: "아이구 이 사람은 많이 바배 있어요 .", b: "아이구 이 사람은 많이 소 있어요 .", c: "아이구 이 사람은 바배 있어요 .", d: "아이구  사람은 많이  있어요 ." },
    answer: "a",
    explanation: "Review not Aviable.",
    audio: "ASSETS/KR-EXAM-FILES/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-/AUDIO/audio10.mp3"
  },
  {
    question: "31<br> 듣고 가장 알맞은 것을 고르십시오.",
    options: { a: "그 사람은 누구 밉니까 ?", b: "남동생 입니다.", c: "여동생 입니다 .", d: "당신의 남동생 있습니까 ?" },
    answer: "d",
    explanation: "Review not Aviable.",
    audio: "ASSETS/KR-EXAM-FILES/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-2/AUDIO/audio11.mp3"
  },
  {
    question: "32<br> 듣고 가장 알맞은 것을 고르십시오.",
    options: { a: "집에 가.", b: "저는 뭣은 해요 ?", c: "빨리 하라.", d: "뭐 입니까 ?" },
    answer: "b",
    explanation: "Review not Aviable.",
    audio: "ASSETS/KR-EXAM-FILES/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-2/AUDIO/audio12.mp3"
  },
  {
    question: "33<br> 듣고 가장 알맞은 것을 고르십시오.",
    options: { a: "뭐 해요 ?", b: "왜 가요 ?", c: "당신 뭣은 싶어요 ?", d: "집에 갑니까 ?" },
    answer: "c",
    explanation: "Review not Aviable.",
    audio: "ASSETS/KR-EXAM-FILES/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-2/AUDIO/audio13.mp3"
  },
  {
    question: "34<br> 듣고 가장 알맞은 것을 고르십시오.",
    options: { a: "깨 시 로선 입니다 .", b: "친구 입니다.", c: "학생 입니다 .", d: "선생님 입니다." },
    answer: "a",
    explanation: "Review not Aviable.",
    audio: "ASSETS/KR-EXAM-FILES/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-2/AUDIO/audio14.mp3"
  },
  {
    question: "35<br> 듣고 가장 알맞은 것을 고르십시오.",
    options: { a: "내일 비가 와을거예요.", b: "저는 싶어요.", c: " 여자 많이 예쁘어요.", d: "날시 많이 좋아요." },
    answer: "d",
    explanation: "Review not Aviable.",
    audio: "ASSETS/KR-EXAM-FILES/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-2/AUDIO/audio15.mp3"
  },
  {
    question: "36<br> 듣고 가장 알맞은 것을 고르십시오.",
    options: { a: "아녕하세요 .", b: "안녕하세요 , 저는 집에 갑니다 .", c: "몰라요 .", d: "어디 갑니까 ?" },
    answer: "b",
    explanation: "Review not Aviable.",
    audio: "ASSETS/KR-EXAM-FILES/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-2/AUDIO/audio16.mp3"
  },
  {
    question: "37<br> 듣고 가장 알맞은 것을 고르십시오.",
    options: { a: "안녕하세요", b: "감사합니다", c: "네", d: "안녕하십니까" },
    answer: "a",
    explanation: "Review not Aviable.",
    audio: "ASSETS/KR-EXAM-FILES/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-2/AUDIO/audio17.mp3"
  },
  {
    question: " 38<br>가：더 드세요.<br>나：많이 먹었어요. _________이/가 불러서 더 먹을 수 없어요. ",
    options: { a: "눈", b: "발", c: "입", d: "배" },
    answer: "d",
    explanation: "Review Not aviable."
  },
  {
    question: " 39<br>가：이 약은 언제 먹는 거예요?<br>나：하루 세 ____ 드세요. 아침, 점심, 저녁 식사 후에 드시면 됩니다. ",
    options: { a: "명", b: "번", c: " 장", d: "대" },
    answer: "b",
    explanation: "Review Not aviable."
  },
  {
    question: " 40<br>가：지수 씨는 술을 잘 마셔요?<br>나：맥주 한 _____쯤은 마실 수 있어요. ",
    options: { a: "마리", b: "대", c: "병", d: " 장" },
    answer: "c",
    explanation: "Review Not aviable."
  },
];
