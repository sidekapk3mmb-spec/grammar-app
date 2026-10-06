const fs = require('fs');
let data;
try {
  data = JSON.parse(fs.readFileSync('grammar-units.json', 'utf8'));
} catch (e) {
  console.error('Error reading JSON:', e);
  process.exit(1);
}

const newUnits = [
  {
    unit: 146,
    title: 'Common Translation Traps (Kesalahan Translasi)',
    section: { title: 'Bonus: Indonesian Learner Specials', description: 'Pitfalls for Indonesian speakers.' },
    explanation: {
      summary: 'Bahasa Inggris dan Bahasa Indonesia memiliki aturan dasar yang berbeda. Kesalahan paling umum yang dilakukan orang Indonesia adalah menerjemahkan kata per kata (direct translation).\n\nMisalnya, kalimat nominal. Di bahasa Indonesia kita bisa bilang "Dia cantik", tapi di bahasa Inggris butuh "To Be" menjadi "She is beautiful".',
      pattern: 'Subject + To Be + Adjective/Noun (Bukan Subject + Adjective)',
      key_points: [
        '**Verbal vs Nominal:** Jika tidak ada kata kerja (makan, lari), wajib gunakan "To Be" (am, is, are, was, were).',
        '**-ed vs -ing Adjectives:** "I am boring" berarti "Saya membosankan". Jika kamu merasa bosan, gunakan "-ed": "I am bored".',
        '**Plurals (Jamak):** Jangan lupa akhiran -s/-es untuk benda lebih dari satu. "Many cars" bukan "Many car".'
      ],
      examples: [
        { en: 'I am bored right now.', id: 'Saya bosan sekarang. (Bukan: I am boring)' },
        { en: 'She is very smart.', id: 'Dia sangat pintar. (Bukan: She very smart)' },
        { en: 'I have many books.', id: 'Saya punya banyak buku. (Bukan: I have many book)' }
      ]
    },
    practice: {
      status: 'ready',
      questions: [
        { id: 'u146-q1', type: 'multiple_choice', prompt: 'I ___ very tired today.', options: ['am', 'is', 'feel to be'], answer_index: 0, explanation: 'Butuh to be (am) untuk I.' },
        { id: 'u146-q2', type: 'multiple_choice', prompt: 'This movie is so ___.', options: ['bored', 'boring'], answer_index: 1, explanation: 'Filmnya memberikan efek (membosankan), jadi pakai -ing.' },
        { id: 'u146-q3', type: 'fill_blank', prompt: 'She has three ___. (cat/cats)', accepted_answers: ['cats'], explanation: 'Plural noun harus diakhiri dengan s.' }
      ]
    }
  },
  {
    unit: 147,
    title: 'Spoken Grammar (Singkatan Lisan)',
    section: { title: 'Bonus: Indonesian Learner Specials', description: 'Pitfalls for Indonesian speakers.' },
    explanation: {
      summary: 'Dalam percakapan sehari-hari (spoken English), native speakers jarang mengucapkan kata secara penuh. Mereka menggunakan singkatan informal (*contractions*). Ini penting agar kamu bisa mengerti film, musik, dan percakapan kasual.\n\nContoh yang paling umum adalah Gonna (Going to), Wanna (Want to), dan Gotta (Got to / Have to).',
      pattern: 'Gonna = Going to | Wanna = Want to | Gotta = (Have) got to',
      key_points: [
        '**Gonna:** Digunakan untuk rencana masa depan. Hanya boleh digunakan setelah "To Be". Contoh: "I\'m gonna sleep" (Benar). "I gonna sleep" (Salah).',
        '**Wanna:** Artinya ingin. "I wanna go home".',
        '**Gotta:** Artinya harus. "I gotta go now".'
      ],
      examples: [
        { en: 'I\'m gonna call you later.', id: 'Aku akan meneleponmu nanti.' },
        { en: 'Do you wanna build a snowman?', id: 'Apakah kamu ingin membuat orang orangan salju?' },
        { en: 'I gotta leave in 5 minutes.', id: 'Aku harus pergi 5 menit lagi.' }
      ]
    },
    practice: {
      status: 'ready',
      questions: [
        { id: 'u147-q1', type: 'multiple_choice', prompt: 'I\'m ___ tell him the truth.', options: ['wanna', 'gonna', 'gotta'], answer_index: 1, explanation: 'Karena ada "am" sebelumnya, singkatan dari "going to" adalah "gonna".' },
        { id: 'u147-q2', type: 'multiple_choice', prompt: 'We ___ go now, it\'s late!', options: ['gonna', 'wanna', 'gotta'], answer_index: 2, explanation: 'Gotta = must/have to.' }
      ]
    }
  },
  {
    unit: 148,
    title: 'Situational Phrasal Verbs',
    section: { title: 'Bonus: Indonesian Learner Specials', description: 'Pitfalls for Indonesian speakers.' },
    explanation: {
      summary: 'Menghafal *phrasal verbs* dari kamus sangat membosankan. Cara terbaik adalah menghafalnya berdasarkan situasi.\n\nMisalnya, saat berada di lingkungan kantor/profesional vs saat sedang berkumpul (*hang out*) dengan teman.',
      pattern: 'Hafalkan berdasarkan Konteks, bukan alfabet.',
      key_points: [
        '**Office Context:** Wrap up (menyelesaikan), Fill in for (menggantikan sementara), Sort out (menyelesaikan masalah).',
        '**Casual Context:** Hang out (nongkrong), Catch up (bertemu untuk ngobrol tentang hal terbaru), Drop by (mampir).'
      ],
      examples: [
        { en: 'Let\'s wrap up this meeting.', id: 'Mari kita selesaikan meeting ini.' },
        { en: 'Can I drop by your house later?', id: 'Bolehkah aku mampir ke rumahmu nanti?' }
      ]
    },
    practice: {
      status: 'ready',
      questions: [
        { id: 'u148-q1', type: 'multiple_choice', prompt: 'I need to ___ up with John, I haven\'t seen him in months.', options: ['catch', 'hang', 'wrap'], answer_index: 0, explanation: 'Catch up artinya bertemu untuk membicarakan kabar.' },
        { id: 'u148-q2', type: 'multiple_choice', prompt: 'Can you ___ in for me while I\'m on leave?', options: ['drop', 'fill', 'sort'], answer_index: 1, explanation: 'Fill in for = menggantikan sementara.' }
      ]
    }
  },
  {
    unit: 149,
    title: 'Master Tenses Timeline',
    section: { title: 'Bonus: Indonesian Learner Specials', description: 'Pitfalls for Indonesian speakers.' },
    explanation: {
      summary: 'Untuk menguasai Tenses, jangan hafal rumusnya, tapi pahami LOGIKA WAKTU (Timeline)-nya.\n\nBahasa Inggris membagi waktu menjadi 3 garis besar: Masa Lalu (Past), Sekarang (Present), dan Masa Depan (Future). Lalu dibagi lagi karakternya: Simple (Fakta/Rutinitas), Continuous (Sedang terjadi), Perfect (Sudah terjadi, efeknya masih ada).',
      pattern: 'Timeline: Past <--- Perfect ---> Present ---> Future',
      key_points: [
        '**Present Simple vs Continuous:** Simple untuk fakta permanen ("I live in Jakarta"). Continuous untuk kejadian sementara saat ini ("I am staying at a hotel").',
        '**Past Simple vs Present Perfect:** Past Simple waktunya sudah selesai ("I lived in Paris in 2010"). Present Perfect kejadian di masa lalu tapi masih nyambung ke sekarang ("I have lived here for 5 years").'
      ],
      examples: [
        { en: 'I lost my key.', id: 'Aku menghilangkan kunciku. (Dulu, sekarang mungkin udah ketemu)' },
        { en: 'I have lost my key.', id: 'Aku telah kehilangan kunciku. (Sampai sekarang masih hilang, aku nggak bisa masuk rumah)' }
      ]
    },
    practice: {
      status: 'ready',
      questions: [
        { id: 'u149-q1', type: 'multiple_choice', prompt: 'Oh no! I ___ my wallet! I can\'t pay for this coffee.', options: ['lost', 'have lost'], answer_index: 1, explanation: 'Karena ada efek di masa sekarang ("I can\'t pay"), gunakan Present Perfect.' },
        { id: 'u149-q2', type: 'multiple_choice', prompt: 'Water ___ at 100 degrees Celsius.', options: ['boils', 'is boiling'], answer_index: 0, explanation: 'Fakta absolut menggunakan Present Simple.' }
      ]
    }
  }
];

const existingUnitNumbers = new Set(data.units.map(u => u.unit));
newUnits.forEach(nu => {
  if (!existingUnitNumbers.has(nu.unit)) {
    data.units.push(nu);
  }
});

fs.writeFileSync('grammar-units.json', JSON.stringify(data, null, 2));
console.log('Successfully appended Bonus Units 146-149!');
