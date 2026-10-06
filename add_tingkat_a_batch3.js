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
    unit: 23, // I will be doing and I will have done
    questions: [
      { id: 'u23-medium-1', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'Don\'t phone between 7 and 8. We ___ (have) dinner then.', accepted_answers: ['will be having', "'ll be having"], explanation: 'Aktivitas sedang berlangsung pada titik waktu tertentu di masa depan.' },
      { id: 'u23-medium-2', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'Phone me after 8 o\'clock. We ___ dinner by then.', options: ['will finish', 'will have finished'], answer_index: 1, explanation: 'Aktivitas sudah akan selesai sebelum titik waktu tertentu di masa depan (Future Perfect).' },
      { id: 'u23-hard-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which sentence means "I intend to use the car, so you cannot borrow it"?', options: ['I will use the car this afternoon.', 'I will be using the car this afternoon.'], answer_index: 1, explanation: 'Future continuous (will be using) sering dipakai untuk menyatakan rencana rutin yang sudah pasti, sehingga tidak bisa diganggu gugat.' },
      { id: 'u23-hard-2', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Next year is Ted and Amy\'s 25th wedding anniversary. They ___ (be) married for 25 years.', accepted_answers: ['will have been', "'ll have been"], explanation: 'Mengukur durasi sebuah kejadian yang akan tercapai di masa depan (Future perfect).' }
    ]
  },
  {
    unit: 24, // When I do / When I've done / If and when
    questions: [
      { id: 'u24-medium-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I\'ll phone you when I ___ home.', options: ['get', 'will get'], answer_index: 0, explanation: 'Setelah kata "when" untuk kejadian masa depan, gunakan present simple, BUKAN will.' },
      { id: 'u24-medium-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'We\'ll go out when it ___ (stop) raining.', accepted_answers: ['stops'], explanation: 'Setelah klausa waktu (when, before, after, until), masa depan dinyatakan dengan present simple.' },
      { id: 'u24-hard-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which is correct to say: "I am going shopping later..."', options: ['When I go shopping, I\'ll buy some cheese.', 'If I go shopping, I\'ll buy some cheese.'], answer_index: 0, explanation: 'Gunakan "when" untuk sesuatu yang PASTI dilakukan. "If" untuk sesuatu yang belum pasti (mungkin ya, mungkin tidak).' },
      { id: 'u24-hard-2', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Choose the correct meaning: "When I\'ve phoned Kate, we can have dinner."', options: ['I am phoning her right now.', 'I must finish phoning her first before we eat.'], answer_index: 1, explanation: '"When I have done" (Present Perfect) menekankan bahwa satu hal harus SELESAI total sebelum hal lain bisa terjadi.' }
    ]
  },
  {
    unit: 25, // When I do and If I do (Similar to 24 in some editions, let's focus on conditional nuances)
    questions: [
      { id: 'u25-medium-1', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: '___ (If/When) I don\'t see you tomorrow, I will call you.', accepted_answers: ['If'], explanation: 'Menggunakan "If" karena ada kemungkinan hal itu tidak terjadi (belum pasti).' },
      { id: 'u25-medium-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: '___ (If/When) I go to sleep tonight, I will turn off the light.', accepted_answers: ['When'], explanation: 'Menggunakan "When" karena tidur di malam hari adalah sesuatu yang pasti.' },
      { id: 'u25-hard-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Fix the sentence: "I will be angry if it will happen again."', options: ['I will be angry if it happen again.', 'I will be angry if it happens again.'], answer_index: 1, explanation: 'Setelah "if" dalam tipe conditional pertama, gunakan present simple (happens), BUKAN will.' },
      { id: 'u25-hard-2', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which indicates the speaker is definitely going out?', options: ['If I go out, I\'ll get some bread.', 'When I go out, I\'ll get some bread.'], answer_index: 1, explanation: '"When" berarti sudah 100% niat keluar rumah. "If" berarti masih 50-50.' }
    ]
  },
  {
    unit: 27, // Could (do) and could have (done)
    questions: [
      { id: 'u27-medium-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I\'m so tired. I ___ sleep for a week.', options: ['can', 'could'], answer_index: 1, explanation: 'Gunakan "could" untuk hal yang tidak nyata/mustahil (unreal) atau sekadar kiasan.' },
      { id: 'u27-medium-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'We had a really good holiday. It ___ (not/be) better.', accepted_answers: ['could not have been', "couldn't have been"], explanation: 'Membicarakan sesuatu di masa lampau yang tidak mungkin bisa lebih baik lagi.' },
      { id: 'u27-hard-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'What does this mean: "I could have gone to the party, but I decided not to."', options: ['I was unable to go to the party.', 'I had the ability/chance to go, but I didn\'t.'], answer_index: 1, explanation: '"Could have + V3" digunakan untuk hal yang BISA dilakukan di masa lalu, tapi TIDAK dilakukan.' },
      { id: 'u27-hard-2', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Fix the error: "The situation was bad, but it can be worse."', accepted_answers: ['could have been'], explanation: 'Karena situasinya sudah terjadi di masa lalu ("was bad"), kemungkinan di masa lalu menggunakan "could have + V3".' }
    ]
  },
  {
    unit: 28, // Must and can't
    questions: [
      { id: 'u28-medium-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'You\'ve been travelling all day. You ___ be tired.', options: ['can', 'must'], answer_index: 1, explanation: '"Must" digunakan untuk kesimpulan logis yang sangat kita yakini benar (Pasti lelah).' },
      { id: 'u28-medium-2', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'That restaurant ___ be very good. It\'s always empty.', options: ["can't", "mustn't"], answer_index: 0, explanation: 'Lawan dari "must" (pasti) untuk kesimpulan logis adalah "can\'t" (tidak mungkin), BUKAN mustn\'t.' },
      { id: 'u28-hard-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'I lost one of my gloves. I ___ it somewhere.', options: ['must drop', 'must have dropped'], answer_index: 1, explanation: 'Untuk membuat kesimpulan logis (pasti jatuh) di MASA LALU, gunakan "must have + V3".' },
      { id: 'u28-hard-2', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Sarah hasn\'t contacted me. She ___ (can\'t / get) my message.', accepted_answers: ["can't have got", "can't have gotten"], explanation: 'Kesimpulan negatif di masa lampau ("tidak mungkin dia sudah terima") menggunakan "can\'t have + V3".' }
    ]
  },
  {
    unit: 29, // May and might 1
    questions: [
      { id: 'u29-medium-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I haven\'t decided where to go on holiday. I ___ go to Ireland.', options: ['may', 'will'], answer_index: 0, explanation: '"May" atau "might" digunakan untuk sesuatu yang belum pasti (mungkin terjadi).' },
      { id: 'u29-medium-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'Take an umbrella with you. It ___ (might/rain) later.', accepted_answers: ['might rain', 'may rain'], explanation: 'Menyatakan kemungkinan di masa depan.' },
      { id: 'u29-hard-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'What does this mean: "He may have gone to bed."', options: ['He definitely went to bed.', 'Perhaps he went to bed.'], answer_index: 1, explanation: '"May have + V3" artinya mungkin saja sesuatu SUDAH terjadi di masa lalu.' },
      { id: 'u29-hard-2', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which is correct?', options: ['I might not go out tonight.', 'I don\'t might go out tonight.'], answer_index: 0, explanation: 'Bentuk negatif dari might adalah "might not", tidak menggunakan do/does.' }
    ]
  },
  {
    unit: 30, // May and might 2
    questions: [
      { id: 'u30-medium-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I\'ll be late for dinner. I ___ be working until 8 o\'clock.', options: ['might', 'might be'], answer_index: 0, explanation: 'Strukturnt adalah might + be + V-ing (sedang bekerja).' },
      { id: 'u30-medium-2', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'What are you doing this weekend? - I don\'t know. I ___ to London.', options: ['might be going', 'might have gone'], answer_index: 0, explanation: '"Might be going" (kemungkinan rencana di masa depan yang belum pasti).' },
      { id: 'u30-hard-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'If the situation was unreal/imaginary, which word MUST be used?', options: ['May', 'Might'], answer_index: 1, explanation: 'Jika situasinya tidak nyata (unreal), kita HANYA boleh memakai "might", tidak boleh "may".' },
      { id: 'u30-hard-2', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'It\'s a good thing we took a map. We ___ (might/get) lost.', accepted_answers: ['might have got', 'might have gotten'], explanation: 'Kejadian nyaris terjadi di masa lampau tapi tidak terjadi, gunakan "might have + V3".' }
    ]
  },
  {
    unit: 31, // Have to and must
    questions: [
      { id: 'u31-medium-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'In many countries, men ___ do military service.', options: ['must', 'have to'], answer_index: 1, explanation: '"Have to" lebih tepat untuk aturan/hukum dari luar, bukan pendapat pribadi pembicara.' },
      { id: 'u31-medium-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I ___ (have to / work) late yesterday.', accepted_answers: ['had to work'], explanation: 'Bentuk lampau dari must / have to adalah "had to".' },
      { id: 'u31-hard-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Difference in meaning: "I must cut my hair" vs "I have to cut my hair"', options: ['"Must" means someone forces me. "Have to" means I want it.', '"Must" means I think it is necessary. "Have to" means it is an external rule or obligation.'], answer_index: 1, explanation: '"Must" sering dipakai untuk opini pribadi (saya merasa perlu). "Have to" bersumber dari luar (sekolah, bos, hukum).' },
      { id: 'u31-hard-2', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Fix the error: "He musts wear a uniform at work."', accepted_answers: ['must wear', 'has to wear'], explanation: '"Must" tidak pernah ditambah \'s\'. Alternatif terbaik adalah "has to wear" karena ini aturan.' }
    ]
  },
  {
    unit: 32, // Must mustn't needn't
    questions: [
      { id: 'u32-medium-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'You ___ tell anybody what I said. It\'s a secret.', options: ["don't have to", "mustn't"], answer_index: 1, explanation: '"Mustn\'t" berarti dilarang keras. "Don\'t have to" berarti tidak perlu (bebas memilih).' },
      { id: 'u32-medium-2', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'You ___ come with me if you don\'t want to.', options: ["mustn't", "don't have to"], answer_index: 1, explanation: '"Don\'t have to" artinya tidak diwajibkan / opsional.' },
      { id: 'u32-hard-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which sentence means: "He did it, but it was not necessary"?', options: ["He didn't need to do it.", "He needn't have done it."], answer_index: 1, explanation: '"Needn\'t have done" berarti aksi SUDAH dilakukan, padahal sebenarnya tidak perlu.' },
      { id: 'u32-hard-2', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Rewrite using needn\'t: "It wasn\'t necessary for you to bring an umbrella." -> "You ___ an umbrella."', accepted_answers: ["needn't have brought", "need not have brought"], explanation: 'Karena terlanjur dibawa di masa lalu (padahal tidak perlu), gunakan needn\'t have + V3.' }
    ]
  },
  {
    unit: 33, // Should 1
    questions: [
      { id: 'u33-medium-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'It\'s a good film. You ___ go and see it.', options: ['should', 'ought'], answer_index: 0, explanation: '"Should" digunakan untuk memberi saran.' },
      { id: 'u33-medium-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I don\'t ___ you should work so hard.', accepted_answers: ['think'], explanation: 'Struktur normal: "I don\'t think you should..." (bukan "I think you shouldn\'t").' },
      { id: 'u33-hard-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'What does this mean: "You should have apologised."', options: ['It was a good idea to apologise, but you didn\'t do it.', 'You apologised, and that was the right thing to do.'], answer_index: 0, explanation: '"Should have + V3" berarti seharusnya dilakukan di masa lalu (tapi kenyataannya TIDAK dilakukan).' },
      { id: 'u33-hard-2', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Fix the sentence: "I feel sick. I shouldn\'t eat so much chocolate last night."', accepted_answers: ["shouldn't have eaten", "should not have eaten"], explanation: 'Penyesalan di masa lalu wajib menggunakan "shouldn\'t have + V3".' }
    ]
  }
];

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
  console.log('No new questions added.');
}
