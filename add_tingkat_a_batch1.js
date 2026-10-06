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
    unit: 3, // Present continuous vs simple 1
    questions: [
      {
        id: 'u3-medium-1',
        type: 'multiple_choice',
        difficulty: 'medium',
        source: 'ai_generated',
        prompt: 'Let\'s go out. It ___ now.',
        options: ['doesn\'t rain', 'isn\'t raining', 'not raining'],
        answer_index: 1,
        explanation: 'Fokus pada apa yang sedang terjadi SEKARANG (now), bukan fakta umum. Jadi gunakan present continuous.'
      },
      {
        id: 'u3-medium-2',
        type: 'fill_blank',
        difficulty: 'medium',
        source: 'ai_generated',
        prompt: 'Julia is very good at languages. She ___ four languages very well.',
        accepted_answers: ['speaks'],
        explanation: 'Kemampuan berbicara bahasa adalah fakta atau kebenaran umum (simple present).'
      },
      {
        id: 'u3-hard-1',
        type: 'multiple_choice',
        difficulty: 'hard',
        source: 'ai_generated',
        prompt: 'Which sentence asks about a person\'s profession/job?',
        options: ['What are you doing?', 'What do you do?'],
        answer_index: 1,
        explanation: '"What do you do?" adalah present simple untuk menanyakan fakta/pekerjaan tetap. "What are you doing?" menanyakan apa yang sedang dilakukan detik ini.'
      },
      {
        id: 'u3-hard-2',
        type: 'multiple_choice',
        difficulty: 'hard',
        source: 'ai_generated',
        prompt: 'Which of the following is grammatically CORRECT?',
        options: ['Are you speaking English?', 'Do you speak English?', 'Do you speaking English?'],
        answer_index: 1,
        explanation: 'Menanyakan apakah seseorang bisa/biasa berbahasa Inggris adalah fakta umum, maka butuh "Do + you + bare infinitive (speak)".'
      }
    ]
  },
  {
    unit: 4, // Present continuous vs simple 2 (state verbs)
    questions: [
      {
        id: 'u4-medium-1',
        type: 'multiple_choice',
        difficulty: 'medium',
        source: 'ai_generated',
        prompt: 'I ___ you should sell your car.',
        options: ['am thinking', 'think', 'thinks'],
        answer_index: 1,
        explanation: 'Jika "think" berarti "believe" atau memiliki opini, tidak boleh dipakai dalam bentuk -ing.'
      },
      {
        id: 'u4-medium-2',
        type: 'fill_blank',
        difficulty: 'medium',
        source: 'ai_generated',
        prompt: 'Are you hungry? ___ you want something to eat?',
        accepted_answers: ['Do'],
        explanation: '"Want" adalah state verb (tidak bisa -ing), sehingga untuk bertanya selalu menggunakan "Do".'
      },
      {
        id: 'u4-hard-1',
        type: 'multiple_choice',
        difficulty: 'hard',
        source: 'ai_generated',
        prompt: 'Why is "thinking" used in the continuous form here: "I am thinking about it"?',
        options: [
          'Because "think" here means to have an opinion.',
          'Because "think" here means to consider or have in mind.',
          'Because it is an absolute fact.'
        ],
        answer_index: 1,
        explanation: '"Think" boleh diberi -ing (thinking) HANYA JIKA maknanya adalah proses berpikir / mempertimbangkan sesuatu.'
      },
      {
        id: 'u4-hard-2',
        type: 'fill_blank',
        difficulty: 'hard',
        source: 'ai_generated',
        prompt: 'Fix the error in this sentence by typing the correct verb form: "I am not believing him."',
        accepted_answers: ['do not believe', 'don\'t believe'],
        explanation: '"Believe" adalah kata kerja kondisi (state verb) yang tidak boleh dipakaikan -ing.'
      }
    ]
  },
  {
    unit: 7, // Present perfect 1
    questions: [
      {
        id: 'u7-medium-1',
        type: 'multiple_choice',
        difficulty: 'medium',
        source: 'ai_generated',
        prompt: 'Are they still having dinner? - No, they ___.',
        options: ['have finished', 'finished', 'are finished'],
        answer_index: 0,
        explanation: 'Ada efek di masa sekarang (dinner-nya sudah selesai). "Have + V3" tepat.'
      },
      {
        id: 'u7-medium-2',
        type: 'fill_blank',
        difficulty: 'medium',
        source: 'ai_generated',
        prompt: 'Is he still in London? No, he ___ gone to Paris.',
        accepted_answers: ['has', "'s"],
        explanation: '"Has gone" berarti dia pergi ke Paris dan saat ini sedang dalam perjalanan atau baru saja sampai.'
      },
      {
        id: 'u7-hard-1',
        type: 'multiple_choice',
        difficulty: 'hard',
        source: 'ai_generated',
        prompt: 'If John is currently in Italy on a holiday, which sentence is correct?',
        options: ['He has been to Italy.', 'He has gone to Italy.'],
        answer_index: 1,
        explanation: '"Has gone to" artinya sudah berangkat dan masih di sana. "Has been to" artinya sudah pernah ke sana tapi sekarang sudah pulang.'
      },
      {
        id: 'u7-hard-2',
        type: 'fill_blank',
        difficulty: 'hard',
        source: 'ai_generated',
        prompt: 'Look! Somebody ___ (break) that window.',
        accepted_answers: ['has broken', "'s broken"],
        explanation: 'Kejadian barusan terjadi dan efeknya (kacanya pecah) bisa dilihat sekarang, maka gunakan Present Perfect.'
      }
    ]
  },
  {
    unit: 8, // Present perfect 2 (just, already, yet)
    questions: [
      {
        id: 'u8-medium-1',
        type: 'multiple_choice',
        difficulty: 'medium',
        source: 'ai_generated',
        prompt: 'Don\'t forget to pay the bill. - I\'ve ___ paid it.',
        options: ['just', 'already', 'yet'],
        answer_index: 1,
        explanation: '"Already" digunakan untuk sesuatu yang selesai lebih awal dari perkiraan.'
      },
      {
        id: 'u8-medium-2',
        type: 'fill_blank',
        difficulty: 'medium',
        source: 'ai_generated',
        prompt: 'Has the post arrived ___?',
        accepted_answers: ['yet'],
        explanation: '"Yet" selalu diletakkan di akhir kalimat tanya atau negatif pada Present Perfect.'
      },
      {
        id: 'u8-hard-1',
        type: 'multiple_choice',
        difficulty: 'hard',
        source: 'ai_generated',
        prompt: 'Which response is the most correct British English grammar for: "Would you like something to eat?"',
        options: ['No thanks, I just had lunch.', 'No thanks, I have lunch just.', 'No thanks, I\'ve just had lunch.'],
        answer_index: 2,
        explanation: 'British English (buku Murphy) mewajibkan Present Perfect untuk kata "just" (baru saja). I have + just + V3.'
      },
      {
        id: 'u8-hard-2',
        type: 'fill_blank',
        difficulty: 'hard',
        source: 'ai_generated',
        prompt: 'He is still eating his dinner. He hasn\'t ___ yet.',
        accepted_answers: ['finished', 'done'],
        explanation: 'Bentuk negatif dari Present Perfect (has not + V3).'
      }
    ]
  },
  {
    unit: 9, // Present perfect continuous
    questions: [
      {
        id: 'u9-medium-1',
        type: 'multiple_choice',
        difficulty: 'medium',
        source: 'ai_generated',
        prompt: 'You\'re out of breath. ___?',
        options: ['Have you run', 'Have you been running', 'Are you running'],
        answer_index: 1,
        explanation: 'Aktivitas yang baru saja selesai tapi efeknya (kehabisan napas) masih terlihat jelas SEKARANG (Present perfect continuous).'
      },
      {
        id: 'u9-medium-2',
        type: 'fill_blank',
        difficulty: 'medium',
        source: 'ai_generated',
        prompt: 'It\'s still raining. It ___ been raining for two hours.',
        accepted_answers: ['has', "'s"],
        explanation: 'Present perfect continuous (has + been + V-ing) menunjukkan aksi dimulai dari dulu dan belum selesai.'
      },
      {
        id: 'u9-hard-1',
        type: 'multiple_choice',
        difficulty: 'hard',
        source: 'ai_generated',
        prompt: 'Which sentence implies that the job is NOT finished yet?',
        options: ['I\'ve painted my bedroom.', 'I\'ve been painting my bedroom.'],
        answer_index: 1,
        explanation: 'Continuous (been painting) berfokus pada PROSES yang masih berlangsung. Simple (painted) berarti sudah tuntas seluruhnya.'
      },
      {
        id: 'u9-hard-2',
        type: 'fill_blank',
        difficulty: 'hard',
        source: 'ai_generated',
        prompt: 'Fix the error in this sentence by typing the correct verb form for "am learning": "I am learning English for a long time."',
        accepted_answers: ['have been learning', "'ve been learning"],
        explanation: 'Jika ada durasi waktu yang masih berjalan ("for a long time"), tidak boleh menggunakan am/is/are + V-ing.'
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
