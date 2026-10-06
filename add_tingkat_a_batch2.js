const fs = require('fs');

let data;
try {
  data = JSON.parse(fs.readFileSync('grammar-units.json', 'utf8'));
} catch (e) {
  console.error('Error reading JSON:', e);
  process.exit(1);
}

const updates = [
  {
    unit: 10, // Present perfect continuous vs simple
    questions: [
      { id: 'u10-medium-1', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I ___ (read) this book, but I haven\'t finished it yet.', accepted_answers: ['have been reading', "'ve been reading"], explanation: 'Proses membaca masih berlangsung dan belum selesai.' },
      { id: 'u10-medium-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I ___ (read) this book, you can have it back.', accepted_answers: ['have read', "'ve read"], explanation: 'Proses membaca sudah tuntas sepenuhnya, jadi gunakan present perfect simple.' },
      { id: 'u10-hard-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which sentence means that the car is permanently broken and cannot be fixed?', options: ["He has repaired the car.", "He has been repairing the car."], answer_index: 0, explanation: 'Has repaired artinya perbaikannya sudah tuntas. Wait, the question is tricky. Let\'s change the prompt. Which sentence means the repair is COMPLETE?', answer_index: 0, explanation: '"Has repaired" = tuntas. "Has been repairing" = masih dalam proses.' },
      { id: 'u10-hard-2', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Fix the error: "How long have you been knowing her?"', options: ["How long have you know her?", "How long have you known her?", "How long do you know her?"], answer_index: 1, explanation: '"Know" adalah state verb, tidak boleh memakai -ing. Gunakan present perfect simple.' }
    ]
  },
  {
    unit: 11, // How long have you (been)
    questions: [
      { id: 'u11-medium-1', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'They are married. They ___ (be) married for ten years.', accepted_answers: ['have been', "'ve been"], explanation: 'Gunakan present perfect untuk sesuatu yang dimulai di masa lalu dan masih berlangsung.' },
      { id: 'u11-medium-2', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'We ___ waiting here for 20 minutes.', options: ['are', 'have been'], answer_index: 1, explanation: 'Jika ada durasi waktu ("for 20 minutes"), gunakan present perfect continuous.' },
      { id: 'u11-hard-1', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Rewrite using "How long": "When did it start raining?" -> "___ has it been raining?"', accepted_answers: ['How long'], explanation: '"When" digunakan untuk menanyakan titik waktu (past simple). "How long" digunakan untuk durasi yang masih berlangsung.' },
      { id: 'u11-hard-2', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which is correct?', options: ["I have a car since 2010.", "I have had a car since 2010.", "I am having a car since 2010."], answer_index: 1, explanation: 'Gunakan present perfect (have had) karena ada "since 2010". "Have" adalah state verb jadi tidak boleh -ing.' }
    ]
  },
  {
    unit: 12, // For and since, when and how long
    questions: [
      { id: 'u12-medium-1', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I have been studying ___ three hours.', accepted_answers: ['for'], explanation: '"For" digunakan untuk durasi waktu (3 jam).' },
      { id: 'u12-medium-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I have been studying ___ 8 o\'clock.', accepted_answers: ['since'], explanation: '"Since" digunakan untuk titik awal waktu di masa lampau.' },
      { id: 'u12-hard-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Choose the correct preposition: "I haven\'t seen him ___ Monday."', options: ['since', 'for', 'from'], answer_index: 0, explanation: 'Senin (Monday) adalah titik awal waktu, jadi gunakan since.' },
      { id: 'u12-hard-2', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Is it correct to say: "It\'s two years since I last saw Joe"?', options: ['Yes, it is perfectly correct.', 'No, it should be "It was two years".'], answer_index: 0, explanation: 'Struktur "It is [waktu] since [past simple]" sangat umum dalam bahasa Inggris.' }
    ]
  },
  {
    unit: 13, // Present perfect vs past simple 1
    questions: [
      { id: 'u13-medium-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: '___ my keys. I can\'t find them anywhere.', options: ['I lost', "I've lost"], answer_index: 1, explanation: 'Gunakan present perfect karena ada efek di masa sekarang (tidak bisa menemukannya).' },
      { id: 'u13-medium-2', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: '___ my keys yesterday. But I found them this morning.', options: ['I lost', "I've lost"], answer_index: 0, explanation: 'Ada keterangan waktu lampau yang sudah selesai ("yesterday"), jadi gunakan past simple.' },
      { id: 'u13-hard-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which sentence implies the inventor is still alive?', options: ['My grandfather invented a new type of engine.', 'My grandfather has invented a new type of engine.'], answer_index: 1, explanation: 'Present perfect (has invented) digunakan untuk pengalaman hidup seseorang yang masih hidup. Jika sudah meninggal, wajib Past Simple.' },
      { id: 'u13-hard-2', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Fix the error: "Did you ever eat sushi?" (Assume the speaker is asking about life experience up to now)', accepted_answers: ['Have you ever eaten'], explanation: 'Untuk pengalaman hidup sampai detik ini, gunakan "Have you ever + V3".' }
    ]
  },
  {
    unit: 14, // Present perfect vs past simple 2
    questions: [
      { id: 'u14-medium-1', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I ___ (not/buy) anything yesterday.', accepted_answers: ['did not buy', "didn't buy"], explanation: 'Ada keterangan waktu lampau spesifik (yesterday).' },
      { id: 'u14-medium-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I ___ (not/buy) anything today.', accepted_answers: ['have not bought', "haven't bought"], explanation: 'Waktu "today" belum selesai, jadi gunakan present perfect.' },
      { id: 'u14-hard-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which is correct if it is currently 10 AM?', options: ['Did you see John this morning?', 'Have you seen John this morning?'], answer_index: 1, explanation: 'Karena sekarang jam 10 pagi, maka "this morning" belum berakhir. Gunakan present perfect.' },
      { id: 'u14-hard-2', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which is correct if it is currently 3 PM (Afternoon)?', options: ['Did you see John this morning?', 'Have you seen John this morning?'], answer_index: 0, explanation: 'Karena sekarang sudah sore, maka "this morning" sudah menjadi waktu lampau yang usai. Gunakan past simple.' }
    ]
  },
  {
    unit: 15, // Past perfect
    questions: [
      { id: 'u15-medium-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'When we arrived at the party, Paul ___ already gone home.', options: ['has', 'had'], answer_index: 1, explanation: 'Kejadian pulang lebih dulu terjadi sebelum kejadian tiba (keduanya di masa lalu). Gunakan Past Perfect (had + V3).' },
      { id: 'u15-medium-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I didn\'t know who she was. I ___ (never/see) her before.', accepted_answers: ['had never seen', "'d never seen"], explanation: 'Pengalaman sebelum titik tertentu di masa lalu.' },
      { id: 'u15-hard-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Difference in meaning. What happened first? "When I arrived, they were having dinner."', options: ['I arrived first.', 'They started having dinner first.'], answer_index: 1, explanation: 'Past continuous (were having) menandakan aktivitas sudah dimulai dan sedang berlangsung ketika saya datang.' },
      { id: 'u15-hard-2', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'What happened first? "When I arrived, they had had dinner."', options: ['I arrived first.', 'They finished dinner first.'], answer_index: 1, explanation: 'Past perfect (had had) berarti aktivitas makan malam sudah selesai sepenuhnya sebelum saya datang.' }
    ]
  },
  {
    unit: 16, // Past perfect continuous
    questions: [
      { id: 'u16-medium-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I was very tired when I arrived home. I ___ hard all day.', options: ['have been working', 'had been working'], answer_index: 1, explanation: 'Konteksnya masa lalu ("was tired"). Jadi gunakan Past Perfect Continuous.' },
      { id: 'u16-medium-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'The ground was wet. It ___ (rain).', accepted_answers: ['had been raining', "'d been raining"], explanation: 'Efek hujan (basah) terlihat di masa lalu ("was wet").' },
      { id: 'u16-hard-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Choose the correct form: "When the boys came into the house, their clothes were dirty, their hair was untidy. They ___ (play) football."', options: ['had played', 'had been playing'], answer_index: 1, explanation: 'Berfokus pada aktivitas intensif dan durasinya di masa lalu yang menyebabkan mereka kotor (proses), bukan hasil akhirnya.' },
      { id: 'u16-hard-2', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which is correct?', options: ['We had been good friends for many years.', 'We had been being good friends for many years.'], answer_index: 0, explanation: '"Be" (sebagai teman baik) adalah state verb, tidak bisa dipakaikan -ing (being). Gunakan past perfect simple.' }
    ]
  },
  {
    unit: 20, // I'll and I'm going to
    questions: [
      { id: 'u20-medium-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: '"I\'ve got a terrible headache." - "Have you? Wait here, I ___ get you an aspirin."', options: ['will', 'am going to'], answer_index: 0, explanation: 'Keputusan yang diambil secara spontan saat itu juga menggunakan "will".' },
      { id: 'u20-medium-2', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: '"Why are you turning on the TV?" - "I ___ watch the news."', options: ['will', 'am going to'], answer_index: 1, explanation: 'Niat atau rencana yang sudah dipikirkan sebelum berbicara menggunakan "going to".' },
      { id: 'u20-hard-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Look at those dark clouds! It ___ rain.', options: ['will', 'is going to'], answer_index: 1, explanation: 'Untuk memprediksi sesuatu berdasarkan BUKTI yang terlihat sekarang, wajib gunakan "going to".' },
      { id: 'u20-hard-2', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: '"I don\'t know how to use this camera." - "It\'s easy. I ___ (show) you."', accepted_answers: ['will show', "'ll show"], explanation: 'Menawarkan bantuan secara spontan selalu menggunakan "will".' }
    ]
  },
  {
    unit: 21, // Will/shall 1
    questions: [
      { id: 'u21-medium-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: '___ I open the window?', options: ['Will', 'Shall'], answer_index: 1, explanation: 'Untuk menawarkan bantuan atau meminta saran menggunakan I / We, gunakan "Shall".' },
      { id: 'u21-medium-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I don\'t think it ___ (rain) this afternoon.', accepted_answers: ['will', "'ll"], explanation: 'Memprediksi opini masa depan dengan "I think / I don\'t think" umumnya menggunakan "will".' },
      { id: 'u21-hard-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which sentence is a request to someone else?', options: ['Shall I shut the door?', 'Will you shut the door?'], answer_index: 1, explanation: '"Will you" digunakan untuk meminta orang lain melakukan sesuatu. "Shall I" untuk menawarkan diri sendiri.' },
      { id: 'u21-hard-2', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Fix the error: "I will be late for work tomorrow if I don\'t hurry. Will we take a taxi?"', accepted_answers: ['Shall we'], explanation: 'Mengajukan ide/saran untuk dilakukan bersama-sama selalu menggunakan "Shall we", bukan "Will we".' }
    ]
  },
  {
    unit: 22, // Will/shall 2
    questions: [
      { id: 'u22-medium-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I promise I ___ tell anybody what you said.', options: ["won't", "am not going to"], answer_index: 0, explanation: 'Janji (promises) selalu diucapkan dengan "will" atau "won\'t".' },
      { id: 'u22-medium-2', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'The car ___ start. I think the battery is dead.', options: ["doesn't", "won't"], answer_index: 1, explanation: '"Won\'t" bisa digunakan untuk benda mati yang seolah-olah "menolak" untuk bekerja.' },
      { id: 'u22-hard-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which response indicates refusal?', options: ['I won\'t do it.', 'I am not doing it.'], answer_index: 0, explanation: '"I won\'t" digunakan ketika seseorang bersikeras menolak melakukan sesuatu.' },
      { id: 'u22-hard-2', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: '"I need some money." - "Don\'t worry, I ___ (lend) you some."', accepted_answers: ['will lend', "'ll lend"], explanation: 'Bentuk janji atau bantuan seketika.' }
    ]
  }
];

// Re-map the hard question in u10 correctly
updates[0].questions[2].prompt = 'Which sentence means that the repair is completely finished?';

let addedCount = 0;

for (const update of updates) {
  const unitObj = data.units.find(u => u.unit === update.unit);
  if (unitObj) {
    if (!unitObj.practice) {
      unitObj.practice = { status: 'ready', questions: [] };
    }
    if (!unitObj.practice.questions) {
      unitObj.practice.questions = [];
    }
    
    for (const q of update.questions) {
      if (!unitObj.practice.questions.find(eq => eq.id === q.id)) {
        unitObj.practice.questions.push(q);
        addedCount++;
      }
    }
  }
}

if (addedCount > 0) {
  fs.writeFileSync('grammar-units.json', JSON.stringify(data, null, 2));
  console.log(`Successfully added ${addedCount} questions across ${updates.length} units.`);
} else {
  console.log('No new questions added. Maybe they already exist?');
}
