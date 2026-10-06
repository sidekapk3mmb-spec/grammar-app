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
    unit: 1,
    questions: [
      {
        id: 'u1-medium-1',
        type: 'multiple_choice',
        difficulty: 'medium',
        source: 'ai_generated',
        prompt: 'Why ___ at me like that? Is there something wrong with my hair?',
        options: ['do you look', 'are you looking', 'you are looking'],
        answer_index: 1,
        explanation: 'Situasi sedang terjadi saat ini (now). Urutan pertanyaan yang benar adalah "are + subjek + verb-ing".'
      },
      {
        id: 'u1-medium-2',
        type: 'fill_blank',
        difficulty: 'medium',
        source: 'ai_generated',
        prompt: "It's getting cold. I ___ going inside now.",
        accepted_answers: ['am', "'m"],
        explanation: 'Menggunakan present continuous untuk tindakan yang sedang dilakukan saat ini.'
      }
    ]
  },
  {
    unit: 2,
    questions: [
      {
        id: 'u2-medium-1',
        type: 'multiple_choice',
        difficulty: 'medium',
        source: 'ai_generated',
        prompt: 'My father ___ very hard. He starts at 7 o\'clock and finishes at 8 o\'clock.',
        options: ['is working', 'works', 'work'],
        answer_index: 1,
        explanation: 'Fakta atau rutinitas sehari-hari menggunakan present simple. Subjek tunggal menggunakan akhiran -s.'
      },
      {
        id: 'u2-medium-2',
        type: 'fill_blank',
        difficulty: 'medium',
        source: 'ai_generated',
        prompt: 'What time ___ the bank open?',
        accepted_answers: ['does'],
        explanation: 'Pertanyaan dalam present simple dengan subjek tunggal (the bank) menggunakan kata bantu "does".'
      }
    ]
  },
  {
    unit: 5,
    questions: [
      {
        id: 'u5-medium-1',
        type: 'multiple_choice',
        difficulty: 'medium',
        source: 'ai_generated',
        prompt: 'It was warm, so I ___ off my coat.',
        options: ['take', 'took', 'taken'],
        answer_index: 1,
        explanation: 'Kejadian berurutan di masa lalu. Kata "was" menandakan past tense, jadi gunakan Verb-2 (took).'
      },
      {
        id: 'u5-medium-2',
        type: 'fill_blank',
        difficulty: 'medium',
        source: 'ai_generated',
        prompt: 'We were very tired, so we ___ not go out last night.',
        accepted_answers: ['did'],
        explanation: 'Kalimat negatif di masa lampau yang memiliki kata kerja (go) memerlukan kata bantu "did".'
      }
    ]
  },
  {
    unit: 6,
    questions: [
      {
        id: 'u6-medium-1',
        type: 'multiple_choice',
        difficulty: 'medium',
        source: 'ai_generated',
        prompt: 'I waved to her, but she ___.',
        options: ['didn\'t look', 'wasn\'t looking', 'isn\'t looking'],
        answer_index: 1,
        explanation: 'Tindakan yang sedang berlangsung (tidak melihat) pada saat kejadian lain terjadi (melambaikan tangan) di masa lalu.'
      },
      {
        id: 'u6-medium-2',
        type: 'fill_blank',
        difficulty: 'medium',
        source: 'ai_generated',
        prompt: 'What ___ you doing at 10 o\'clock yesterday?',
        accepted_answers: ['were'],
        explanation: 'Menanyakan kegiatan spesifik yang sedang berlangsung di waktu tertentu di masa lalu.'
      }
    ]
  },
  {
    unit: 79,
    questions: [
      {
        id: 'u79-medium-1',
        type: 'multiple_choice',
        difficulty: 'medium',
        source: 'ai_generated',
        prompt: 'Can you give me ___ about the places to visit?',
        options: ['some advices', 'an advice', 'some advice'],
        answer_index: 2,
        explanation: '"Advice" adalah uncountable noun (tidak bisa dihitung). Tidak bisa memakai "an" atau ditambahkan huruf s.'
      },
      {
        id: 'u79-medium-2',
        type: 'fill_blank',
        difficulty: 'medium',
        source: 'ai_generated',
        prompt: 'I don\'t have ___ money with me. Can you lend me some?',
        accepted_answers: ['any'],
        explanation: 'Dalam kalimat negatif untuk sesuatu yang uncountable (money), kita menggunakan "any".'
      }
    ]
  },
  {
    unit: 80,
    questions: [
      {
        id: 'u80-medium-1',
        type: 'multiple_choice',
        difficulty: 'medium',
        source: 'ai_generated',
        prompt: 'I\'m not very busy today. I haven\'t got ___ to do.',
        options: ['much', 'many', 'a lot'],
        answer_index: 0,
        explanation: 'Dalam kalimat negatif untuk hal yang abstrak / uncountable (things to do), kita gunakan "much".'
      },
      {
        id: 'u80-medium-2',
        type: 'fill_blank',
        difficulty: 'medium',
        source: 'ai_generated',
        prompt: 'He isn\'t popular. He has very ___ friends.',
        accepted_answers: ['few'],
        explanation: 'Maknanya negatif (hampir tidak ada teman). Karena friends adalah kata benda yang dapat dihitung, gunakan "few".'
      }
    ]
  },
  {
    unit: 81,
    questions: [
      {
        id: 'u81-medium-1',
        type: 'multiple_choice',
        difficulty: 'medium',
        source: 'ai_generated',
        prompt: '___ cars have wheels.',
        options: ['All of', 'All', 'Every'],
        answer_index: 1,
        explanation: 'Saat berbicara tentang suatu hal secara umum (mobil-mobil di seluruh dunia), gunakan "All" tanpa "of".'
      },
      {
        id: 'u81-medium-2',
        type: 'fill_blank',
        difficulty: 'medium',
        source: 'ai_generated',
        prompt: '___ of my friends live in London. They all live in Jakarta.',
        accepted_answers: ['None'],
        explanation: 'Konteksnya tidak ada satupun teman yang tinggal di London. Pasangannya "of" adalah "None".'
      }
    ]
  },
  {
    unit: 121,
    questions: [
      {
        id: 'u121-medium-1',
        type: 'multiple_choice',
        difficulty: 'medium',
        source: 'ai_generated',
        prompt: 'I usually wake up early ___ the morning.',
        options: ['at', 'on', 'in'],
        answer_index: 2,
        explanation: 'Bagian hari secara umum (morning, afternoon, evening) selalu menggunakan preposisi "in".'
      },
      {
        id: 'u121-medium-2',
        type: 'fill_blank',
        difficulty: 'medium',
        source: 'ai_generated',
        prompt: 'We are meeting ___ Tuesday afternoon.',
        accepted_answers: ['on'],
        explanation: 'Jika hari (Tuesday) disebutkan secara spesifik, preposisinya harus mengikuti hari, yaitu "on".'
      }
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
      // Check if question id already exists to prevent duplicate runs
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
