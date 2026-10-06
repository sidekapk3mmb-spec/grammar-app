const fs = require('fs');
let data;
try {
  data = JSON.parse(fs.readFileSync('grammar-units.json', 'utf8'));
} catch(e) { process.exit(1); }

const updates = [
  {
    unit: 34, // Should 2
    questions: [
      { id: 'u34-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I demand that he ___.', options: ['apologises', 'should apologise'], answer_index: 1, explanation: 'Kata kerja "demand", "suggest", "recommend" sering diikuti oleh "should".' },
      { id: 'u34-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'It is strange that he ___ (be) late. He is usually on time.', accepted_answers: ['should be'], explanation: 'Kata sifat emosional/penilaian seperti strange, odd, funny, sering diikuti "should".' },
      { id: 'u34-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'What does this mean: "If he should call, tell him I\'m out."', options: ['If he MUST call...', 'If by any chance he calls...'], answer_index: 1, explanation: '"If... should..." bermakna "Seandainya secara kebetulan/kecil kemungkinan hal itu terjadi".' },
      { id: 'u34-h-2', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Fix the sentence: "I suggested that she goes to the doctor."', options: ['I suggested that she should go to the doctor.', 'I suggested her to go to the doctor.'], answer_index: 0, explanation: '"Suggest" tidak pernah diikuti "somebody to do something". Harus "that somebody (should) do something".' }
    ]
  },
  {
    unit: 35, // Had better, It's time
    questions: [
      { id: 'u35-m-1', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'It\'s cold. You ___ (had/better) wear a coat.', accepted_answers: ['had better', "'d better"], explanation: 'Memberi saran kuat untuk situasi spesifik.' },
      { id: 'u35-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'You\'d better ___ (not/go) out tonight.', accepted_answers: ['not go'], explanation: 'Bentuk negatifnya adalah "had better not + bare infinitive".' },
      { id: 'u35-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Difference between "had better" and "should": "You ___ lock the door when you go out." (General advice)', options: ['had better', 'should'], answer_index: 1, explanation: '"Should" untuk saran umum/selalu. "Had better" untuk situasi gawat saat ini.' },
      { id: 'u35-h-2', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Fix the error: "It\'s late. It\'s time we go home."', accepted_answers: ['went'], explanation: 'Struktur "It is time somebody did something" SELALU diikuti Verb-2 (Past Tense) meskipun maknanya sekarang.' }
    ]
  },
  {
    unit: 36, // Would
    questions: [
      { id: 'u36-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I ___ love to live by the sea.', options: ['will', 'would'], answer_index: 1, explanation: 'Berkhayal/berimajinasi tentang sesuatu yang tidak nyata sekarang menggunakan "would".' },
      { id: 'u36-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'When we were children, we ___ (would/play) in the park every day.', accepted_answers: ['would play', "'d play"], explanation: '"Would" bisa digunakan untuk menceritakan kebiasaan berulang di masa lampau (mirip "used to").' },
      { id: 'u36-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'What does this mean: "He wouldn\'t listen to me."', options: ['He didn\'t have the ability to listen.', 'He refused to listen.'], answer_index: 1, explanation: '"Wouldn\'t" di masa lampau berarti seseorang bersikeras menolak melakukan sesuatu.' },
      { id: 'u36-h-2', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which is correct to describe past habit?', options: ['I would live in London.', 'I used to live in London.'], answer_index: 1, explanation: '"Would" tidak bisa digunakan untuk \'state\' atau keadaan menetap di masa lalu (seperti live/be/know). Harus pakai "used to".' }
    ]
  },
  {
    unit: 38, // If I do and if I did
    questions: [
      { id: 'u38-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'If I ___ the answer, I would tell you.', options: ['know', 'knew'], answer_index: 1, explanation: 'Conditional tipe 2 (unreal present) menggunakan Past Simple pada klausa If.' },
      { id: 'u38-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I wouldn\'t mind living in England if the weather ___ (be) better.', accepted_answers: ['were', 'was'], explanation: 'Mengkhayalkan cuaca yang berbeda dari kenyataan saat ini.' },
      { id: 'u38-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Difference in meaning: "If I find a wallet..." vs "If I found a wallet..."', options: ['"Find" means it is likely/possible. "Found" means I am just imagining it.', '"Find" is past. "Found" is future.'], answer_index: 0, explanation: 'Tipe 1 (find) untuk kemungkinan nyata. Tipe 2 (found) hanya khayalan semata.' },
      { id: 'u38-h-2', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Fix the error: "I would be very scared if somebody would point a gun at me."', accepted_answers: ['pointed'], explanation: 'Dalam struktur "If" tipe khayalan, klausa If-nya TIDAK BOLEH mengandung "would". Harus pakai Past Simple (pointed).' }
    ]
  },
  {
    unit: 39, // If I knew / I wish I knew
    questions: [
      { id: 'u39-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I wish I ___ a car. It would make life easier.', options: ['have', 'had'], answer_index: 1, explanation: '"Wish" tentang kondisi saat ini menggunakan Past Simple (had), karena itu adalah khayalan (unreal).' },
      { id: 'u39-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'It\'s raining. I wish it ___ (stop).', accepted_answers: ['would stop'], explanation: 'Untuk mengharapkan suatu kejadian/perubahan perilaku orang lain terjadi SEKARANG, gunakan "wish... would".' },
      { id: 'u39-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which sentence is grammatically INCORRECT?', options: ['I wish I would have a car.', 'I wish I had a car.'], answer_index: 0, explanation: 'Kita TIDAK BOLEH menggunakan "wish + would" jika subjeknya sama ("I wish I would...") atau untuk state verbs (kepemilikan/have).' },
      { id: 'u39-h-2', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Rewrite using wish: "I regret that I don\'t know her number." -> "I wish I ___ her number."', accepted_answers: ['knew'], explanation: 'Faktanya "don\'t know" (present). Khayalannya harus mundur satu tense menjadi Past Simple (knew).' }
    ]
  },
  {
    unit: 40, // If I had known / I wish I had known
    questions: [
      { id: 'u40-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'If I ___ you were in hospital, I would have visited you.', options: ['knew', 'had known'], answer_index: 1, explanation: 'Khayalan tentang MASA LALU (Tipe 3) harus memakai Past Perfect (had + V3).' },
      { id: 'u40-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I feel sick. I wish I ___ (not/eat) so much.', accepted_answers: ['had not eaten', "hadn't eaten"], explanation: 'Penyesalan tentang MASA LALU menggunakan Past Perfect.' },
      { id: 'u40-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Fix the error: "If I would have known, I would have told you."', options: ['If I had known, I would have told you.', 'If I knew, I would have told you.'], answer_index: 0, explanation: 'Klausa "If" di masa lalu TIDAK BOLEH memakai "would have". Harus murni "had + V3".' },
      { id: 'u40-h-2', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Mixed conditional meaning: "If I had gone to bed earlier, I wouldn\'t be tired now."', options: ['Both actions are in the past.', 'The condition is in the past, but the result is in the present.'], answer_index: 1, explanation: 'Ini adalah campuran (mixed). "Had gone" = andai dulu tidur cepat. "Wouldn\'t be" = sekarang tidak lelah.' }
    ]
  },
  {
    unit: 41, // Wish
    questions: [
      { id: 'u41-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I wish you ___ stop shouting. It\'s annoying.', options: ['will', 'would'], answer_index: 1, explanation: 'Gunakan "wish ... would" untuk mengeluhkan kebiasaan orang lain yang mengganggu.' },
      { id: 'u41-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I wish you ___ (not/keep) interrupting me.', accepted_answers: ["wouldn't keep", "would not keep"], explanation: 'Keluhan tentang hal yang berulang kali dilakukan seseorang.' },
      { id: 'u41-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Why is this sentence wrong? "I wish I would be taller."', options: ['We can\'t use "would" with "I" as the subject of the wish.', 'Because "be" is a state verb, so we cannot use "would" for states.'], answer_index: 1, explanation: 'Meskipun kita bisa pakai "wish...would" untuk orang lain, kita tidak bisa memakainya untuk keadaan/sifat (state). Harus pakai Past Simple: "I wish I were/was taller".' },
      { id: 'u41-h-2', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'What is the difference: "I hope you pass the exam" vs "I wish you passed the exam"?', options: ['"Hope" is for possible futures. "Wish" is for regrets/unreal things.', 'There is no difference.'], answer_index: 0, explanation: 'Harapan tentang masa depan yang BISA terjadi harus memakai "HOPE", bukan "WISH".' }
    ]
  },
  {
    unit: 43, // Passive 2
    questions: [
      { id: 'u43-m-1', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'A new supermarket is ___ (build) next to our house.', accepted_answers: ['being built'], explanation: 'Present continuous pasif (sedang dibangun) = is/are + being + V3.' },
      { id: 'u43-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'Has the room ___ (clean) yet?', accepted_answers: ['been cleaned'], explanation: 'Present perfect pasif (sudahkah dibersihkan) = has/have + been + V3.' },
      { id: 'u43-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Change to passive: "Somebody has stolen my keys."', options: ['My keys have stolen.', 'My keys have been stolen.'], answer_index: 1, explanation: 'Pasif dari Present Perfect membutuhkan "been" di tengahnya.' },
      { id: 'u43-h-2', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which sentence is grammatically correct?', options: ['The concert was cancelled.', 'The concert has cancelled.'], answer_index: 0, explanation: 'Konser tidak bisa membatalkan dirinya sendiri (aktif). Ia harus "dibatalkan" (pasif - was cancelled).' }
    ]
  },
  {
    unit: 44, // Passive 3
    questions: [
      { id: 'u44-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I was offered the job, but I refused it. = The job ___ to me, but I refused it.', options: ['was offered', 'offered'], answer_index: 0, explanation: 'Pekerjaan itu ditawarkan (pasif).' },
      { id: 'u44-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I don\'t like ___ (tell) what to do.', accepted_answers: ['being told'], explanation: 'Setelah kata kerja seperti like, hate, enjoy, pasifnya menjadi "being + V3".' },
      { id: 'u44-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Change into passive starting with "I": "Somebody gave me a book."', options: ['A book was given to me.', 'I was given a book.'], answer_index: 1, explanation: 'Keduanya benar, tapi instruksi meminta mulai dengan "I". Dalam bahasa Inggris, sangat umum manusia (penerima) dijadikan subjek pasif.' },
      { id: 'u44-h-2', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'He was born in 1990. (Where ___ he born?)', accepted_answers: ['was'], explanation: 'Kata "born" (lahir) SELALU berbentuk pasif dengan to be (was/were).' }
    ]
  },
  {
    unit: 45, // It is said that / He is said to / Be supposed to
    questions: [
      { id: 'u45-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'It is said that he ___ 100 years old.', options: ['is', 'to be'], answer_index: 0, explanation: 'Setelah "It is said THAT...", kita menggunakan klausa biasa dengan subjek dan kata kerja (he is).' },
      { id: 'u45-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'He is said ___ (be) 100 years old.', accepted_answers: ['to be'], explanation: 'Setelah subjek spesifik (He is said...), selalu diikuti oleh infinitive "to...".' },
      { id: 'u45-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'What does "supposed to" mean here: "You are supposed to be at work by 8:00."', options: ['It is believed that you are at work.', 'It is the rule/expectation that you are at work.'], answer_index: 1, explanation: '"Be supposed to" bermakna tugas, kewajiban, atau ekspektasi yang seharusnya dipatuhi (tapi sering kali tidak dilakukan).' },
      { id: 'u45-h-2', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Rewrite using "supposed": "People say that the new Batman movie is very good." -> "The new Batman movie is ___ to be very good."', accepted_answers: ['supposed'], explanation: '"Supposed to" juga bisa berarti "katanya / menurut rumor".' }
    ]
  }
];

let addedCount = 0;
for (const update of updates) {
  const unitObj = data.units.find(u => u.unit === update.unit);
  if (unitObj) {
    if (!unitObj.practice) unitObj.practice = { status: 'ready', questions: [] };
    if (!unitObj.practice.questions) unitObj.practice.questions = [];
    for (const q of update.questions) {
      if (!unitObj.practice.questions.find(eq => eq.id === q.id)) {
        unitObj.practice.questions.push(q);
        addedCount++;
      }
    }
  }
}
if (addedCount > 0) fs.writeFileSync('grammar-units.json', JSON.stringify(data, null, 2));
