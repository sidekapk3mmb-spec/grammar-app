const fs = require('fs');
let data;
try {
  data = JSON.parse(fs.readFileSync('grammar-units.json', 'utf8'));
} catch(e) { process.exit(1); }

const updates = [
  {
    unit: 92, // Relative clauses / pronouns
    questions: [
      { id: 'u92-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I don\'t like stories ___ have unhappy endings.', options: ['who', 'that'], answer_index: 1, explanation: '"Stories" adalah benda mati, gunakan "that" atau "which".' },
      { id: 'u92-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'The window ___ (which/who) was broken has now been repaired.', accepted_answers: ['which', 'that'], explanation: '"Window" adalah benda, gunakan "which" atau "that".' },
      { id: 'u92-h-1', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Combine into one sentence: "I met a woman. She can speak six languages." -> "I met a woman ___ can speak six languages."', accepted_answers: ['who', 'that'], explanation: '"Woman" adalah orang (subjek).' }
    ]
  },
  {
    unit: 98, // Adjectives and adverbs 1 (quick/quickly)
    questions: [
      { id: 'u98-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'Our holiday was too short. The time passed very ___.', options: ['quick', 'quickly'], answer_index: 1, explanation: 'Kita membutuhkan kata keterangan (adverb) untuk menjelaskan KATA KERJA "passed".' },
      { id: 'u98-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'Tom is a ___ (careful) driver.', accepted_answers: ['careful'], explanation: 'Menjelaskan kata benda (driver), gunakan kata sifat (adjective).' },
      { id: 'u98-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which sentence is grammatically correct?', options: ['You look perfectly tonight.', 'You look perfect tonight.'], answer_index: 1, explanation: 'Kata kerja panca indera (look, smell, taste, sound, feel) selalu diikuti kata sifat (Adjective), bukan Adverb (-ly).' }
    ]
  },
  {
    unit: 100, // Adjectives and adverbs 2 (well/fast/late/hard)
    questions: [
      { id: 'u100-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I tried ___ to remember her name, but I couldn\'t.', options: ['hard', 'hardly'], answer_index: 0, explanation: '"Hard" berarti dengan keras/sungguh-sungguh. "Hardly" berarti hampir tidak.' },
      { id: 'u100-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'Please don\'t drive so ___ (fast).', accepted_answers: ['fast'], explanation: '"Fast" adalah adverb sekaligus adjective. Tidak ada kata "fastly".' },
      { id: 'u100-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Difference: "He works hard" vs "He hardly works".', options: ['"Hardly works" means he works very intensely.', '"Hardly works" means he almost does NO work.'], answer_index: 1, explanation: '"Hardly" bermakna negatif (hampir tidak).' }
    ]
  },
  {
    unit: 101, // So and such
    questions: [
      { id: 'u101-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'It was ___ a beautiful day that we went to the beach.', options: ['so', 'such'], answer_index: 1, explanation: '"Such" selalu diikuti oleh kata benda (a beautiful DAY).' },
      { id: 'u101-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'The weather is ___ (so/such) beautiful.', accepted_answers: ['so'], explanation: '"So" langsung diikuti oleh kata sifat tanpa kata benda di belakangnya.' },
      { id: 'u101-h-1', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Fix the error: "I have never read a so good book." -> "I have never read ___ a good book."', accepted_answers: ['such'], explanation: 'Strukturnya adalah "such a/an + adjective + noun".' }
    ]
  },
  {
    unit: 102, // Enough and too
    questions: [
      { id: 'u102-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'You\'re always at home. You don\'t go out ___.', options: ['enough', 'too'], answer_index: 0, explanation: '"Enough" diletakkan SETELAH kata kerja (go out enough).' },
      { id: 'u102-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I can\'t wait for them. I don\'t have ___ (enough) time.', accepted_answers: ['enough'], explanation: '"Enough" diletakkan SEBELUM kata benda (enough time).' },
      { id: 'u102-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Fix the error: "He is enough tall to play basketball."', options: ['He is too tall to play basketball.', 'He is tall enough to play basketball.'], answer_index: 1, explanation: '"Enough" selalu diletakkan SETELAH kata sifat (tall enough).' }
    ]
  },
  {
    unit: 103, // Quite, pretty, rather and fairly
    questions: [
      { id: 'u103-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'It\'s ___ cold outside. You should wear a coat.', options: ['quite', 'quite a'], answer_index: 0, explanation: '"Quite" memodifikasi kata sifat "cold". Tidak butuh "a".' },
      { id: 'u103-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'She lives in ___ (quite/a) small house.', accepted_answers: ['quite a'], explanation: 'Struktur umumnya adalah "quite a/an + adjective + noun".' },
      { id: 'u103-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which conveys a negative or critical meaning?', options: ['The movie was rather boring.', 'The movie was quite good.'], answer_index: 0, explanation: '"Rather" sering digunakan untuk ide-ide negatif atau hal yang tidak diharapkan.' }
    ]
  },
  {
    unit: 104, // Comparison 1 (cheaper, more expensive)
    questions: [
      { id: 'u104-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'This hotel is ___ than the other one.', options: ['more cheap', 'cheaper'], answer_index: 1, explanation: 'Kata sifat dengan satu suku kata (cheap) ditambahkan akhiran -er.' },
      { id: 'u104-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'Health and happiness are ___ (important) than money.', accepted_answers: ['more important'], explanation: 'Kata sifat panjang menggunakan "more".' },
      { id: 'u104-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Is it correct to say: "It is more colder today"?', options: ['Yes.', 'No, it should be "It is colder today".'], answer_index: 1, explanation: 'Tidak boleh menggabungkan "more" dengan kata yang berakhiran -er (Double comparative salah).' }
    ]
  },
  {
    unit: 105, // Comparison 2 (much better)
    questions: [
      { id: 'u105-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'It\'s ___ cheaper to go by bus than by train.', options: ['much', 'many'], answer_index: 0, explanation: 'Untuk menguatkan komparatif, kita menggunakan "much" (jauh lebih murah).' },
      { id: 'u105-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'The situation is getting ___ (bad) and worse.', accepted_answers: ['worse'], explanation: 'Menyatakan keadaan yang terus meningkat (semakin lama semakin...) menggunakan pengulangan "worse and worse".' },
      { id: 'u105-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Complete: "The earlier we leave, ___ we will arrive."', options: ['the soonest', 'the sooner'], answer_index: 1, explanation: 'Struktur "The + comparative ..., the + comparative ..." berarti "Semakin..., semakin...".' }
    ]
  },
  {
    unit: 106, // Comparison 3 (as ... as)
    questions: [
      { id: 'u106-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'Rome is not ___ old as Athens.', options: ['so', 'too'], answer_index: 0, explanation: 'Dalam kalimat negatif, kita bisa memakai "not as ... as" atau "not so ... as".' },
      { id: 'u106-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I don\'t know ___ (many) people as you do.', accepted_answers: ['as many'], explanation: 'Menyatakan "sebanyak" = as many/much ... as.' },
      { id: 'u106-h-1', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Rewrite: "You are taller than me." -> "I am not as ___ (tall) as you."', accepted_answers: ['tall'], explanation: 'Di antara "as ... as", kembalikan kata sifat ke bentuk dasarnya (tanpa -er).' }
    ]
  },
  {
    unit: 107, // Superlatives
    questions: [
      { id: 'u107-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'What is the ___ river in the world?', options: ['longest', 'most long'], answer_index: 0, explanation: 'Satu suku kata menggunakan -est.' },
      { id: 'u107-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'It was ___ (bad) film I\'ve ever seen.', accepted_answers: ['the worst'], explanation: 'Bentuk superlatif dari bad adalah "the worst".' },
      { id: 'u107-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Fix the error: "He is the oldest of the two brothers."', options: ['He is the older of the two brothers.', 'He is the most old of the two brothers.'], answer_index: 0, explanation: 'Jika hanya membandingkan DUA hal/orang, bahasa Inggris formal menggunakan "the older", BUKAN superlatif (oldest).' }
    ]
  },
  {
    unit: 108, // Word order (place and time)
    questions: [
      { id: 'u108-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'Which is correct?', options: ['I go to the gym every day.', 'I go every day to the gym.'], answer_index: 0, explanation: 'Tempat (to the gym) diletakkan sebelum waktu (every day).' },
      { id: 'u108-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'He arrived ___ (at the hotel / early).', accepted_answers: ['at the hotel early'], explanation: 'Tempat dulu, baru waktu.' },
      { id: 'u108-h-1', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Put in order: (yesterday / a lot of money / I / won)', accepted_answers: ['I won a lot of money yesterday'], explanation: 'Subjek + Verb + Objek (tidak boleh dipisah) + Waktu (di akhir).' }
    ]
  },
  {
    unit: 111, // Still, yet, already
    questions: [
      { id: 'u111-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I wrote to him last month, but he ___ hasn\'t replied.', options: ['still', 'yet'], answer_index: 0, explanation: '"Still" diletakkan sebelum kata kerja negatif untuk menekankan situasi belum berubah.' },
      { id: 'u111-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'Has it stopped raining ___ (yet)?', accepted_answers: ['yet'], explanation: '"Yet" selalu di akhir kalimat tanya atau negatif.' },
      { id: 'u111-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Difference: "He still hasn\'t arrived" vs "He hasn\'t arrived yet".', options: ['"Still" shows surprise or impatience. "Yet" is just a neutral fact.', 'No difference.'], answer_index: 0, explanation: '"Still hasn\'t" mengandung emosi kekesalan karena menunggu lama.' }
    ]
  },
  {
    unit: 112, // Even
    questions: [
      { id: 'u112-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'He never shouts, ___ when he is angry.', options: ['even', 'also'], answer_index: 0, explanation: '"Even" (bahkan) digunakan untuk menunjukkan sesuatu yang mengejutkan atau tidak biasa.' },
      { id: 'u112-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I got up very early, but John got up ___ (even) earlier.', accepted_answers: ['even'], explanation: '"Even" dengan bentuk komparatif berarti "lebih ... lagi".' },
      { id: 'u112-h-1', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Rewrite using even: "Despite the fact that it was raining, we played football." -> "___ though it was raining, we played football."', accepted_answers: ['Even'], explanation: '"Even though" lebih kuat daripada sekadar "Although".' }
    ]
  },
  {
    unit: 113, // Although, though, even though, in spite of, despite
    questions: [
      { id: 'u113-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'We went out ___ the rain.', options: ['in spite of', 'although'], answer_index: 0, explanation: '"In spite of" atau "despite" selalu diikuti Noun Phrase (the rain). "Although" diikuti subjek + verb.' },
      { id: 'u113-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: '___ (Although) I was tired, I couldn\'t sleep.', accepted_answers: ['Although', 'Though', 'Even though'], explanation: 'Diikuti oleh klausa penuh (I was tired).' },
      { id: 'u113-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Fix the error: "Despite of the traffic, we arrived on time."', options: ['Despite the traffic...', 'In spite the traffic...'], answer_index: 0, explanation: '"Despite" TIDAK PERNAH diikuti oleh "of". (Hanya "In spite of" yang pakai of).' }
    ]
  },
  {
    unit: 114, // In case
    questions: [
      { id: 'u114-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'Take an umbrella ___ it rains.', options: ['if', 'in case'], answer_index: 1, explanation: '"In case" berarti berjaga-jaga (lakukan sekarang, karena mungkin nanti terjadi).' },
      { id: 'u114-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I\'ll leave my phone number in ___ (case) you need to contact me.', accepted_answers: ['case'], explanation: '"In case" bermakna untuk berjaga-jaga.' },
      { id: 'u114-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Difference: "I\'ll buy some food if Tom comes" vs "I\'ll buy some food in case Tom comes".', options: ['"If" means I wait for Tom to come before I buy. "In case" means I buy it now just to be ready.', '"If" means I will buy it now.'], answer_index: 0, explanation: '"If" = nunggu kejadiannya baru bertindak. "In case" = sedia payung sebelum hujan.' }
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
console.log('Tingkat B Batch 3 done!');
