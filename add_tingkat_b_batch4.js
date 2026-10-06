const fs = require('fs');
let data;
try {
  data = JSON.parse(fs.readFileSync('grammar-units.json', 'utf8'));
} catch(e) { process.exit(1); }

const updates = [
  {
    unit: 115, // Unless, as long as, provided
    questions: [
      { id: 'u115-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I\'ll come tomorrow ___ I have to work.', options: ['unless', 'if'], answer_index: 0, explanation: '"Unless" berarti "kecuali jika" (if not).' },
      { id: 'u115-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'You can borrow my car ___ (as long) as you drive carefully.', accepted_answers: ['as long'], explanation: '"As long as" berarti asalkan/dengan syarat.' },
      { id: 'u115-h-1', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Rewrite using unless: "I won\'t go if you don\'t go." -> "I won\'t go ___ you go."', accepted_answers: ['unless'], explanation: '"Unless" sudah bermakna negatif, sehingga "don\'t go" berubah menjadi positif "go".' }
    ]
  },
  {
    unit: 116, // As (as I walked, as I said)
    questions: [
      { id: 'u116-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I slipped ___ I was getting off the bus.', options: ['as', 'like'], answer_index: 0, explanation: '"As" bisa bermakna "pada saat yang bersamaan" (ketika).' },
      { id: 'u116-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: '___ (As) I was tired, I went to bed early.', accepted_answers: ['As'], explanation: '"As" di awal kalimat bisa bermakna "Karena" (Because/Since).' },
      { id: 'u116-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which sentence means "Because they live near us, we see them often"?', options: ['As they live near us, we see them often.', 'As they live near us.'], answer_index: 0, explanation: 'Gunakan "as" untuk menghubungkan alasan dengan akibatnya dalam satu kalimat utuh.' }
    ]
  },
  {
    unit: 117, // Like and as
    questions: [
      { id: 'u117-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'What a beautiful house! It\'s ___ a palace.', options: ['like', 'as'], answer_index: 0, explanation: '"Like" berarti mirip dengan / seperti (tapi bukan istana sungguhan).' },
      { id: 'u117-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'He works ___ (as) a manager in a hotel.', accepted_answers: ['as'], explanation: '"As" berarti berfungsi/berperan sebagai (dia memang manajer sungguhan).' },
      { id: 'u117-h-1', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Complete: "Nobody knows him ___ (as/like) I do."', accepted_answers: ['as'], explanation: 'Jika diikuti subjek + verb (I do), gunakan "as". Jika hanya diikuti Noun/Pronoun (me), gunakan "like".' }
    ]
  },
  {
    unit: 118, // Like / as if / as though
    questions: [
      { id: 'u118-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'You look ___ you\'ve seen a ghost!', options: ['as if', 'as'], answer_index: 0, explanation: '"As if" (seolah-olah) diikuti oleh subjek + verb.' },
      { id: 'u118-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I don\'t feel ___ (like) going out tonight.', accepted_answers: ['like'], explanation: '"Feel like doing something" adalah frasa yang berarti sedang ingin melakukan sesuatu.' },
      { id: 'u118-h-1', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Fix the error: "He talks as if he knows everything." (Assume he doesn\'t know everything - unreal)', accepted_answers: ['knew'], explanation: 'Untuk situasi yang tidak nyata (dia aslinya tidak tahu), "as if" diikuti Past Tense.' }
    ]
  },
  {
    unit: 119, // During, for, while
    questions: [
      { id: 'u119-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'We didn\'t speak ___ the meal.', options: ['during', 'while'], answer_index: 0, explanation: '"During" diikuti oleh kata benda (Noun: the meal).' },
      { id: 'u119-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'We didn\'t speak ___ (while) we were eating.', accepted_answers: ['while'], explanation: '"While" diikuti oleh subjek + verb (we were eating).' },
      { id: 'u119-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which is correct?', options: ['I fell asleep during the film.', 'I fell asleep for the film.'], answer_index: 0, explanation: '"For" digunakan untuk DURASI WAKTU (for two hours). "During" untuk NAMA KEJADIAN.' }
    ]
  },
  {
    unit: 120, // By and until, by the time
    questions: [
      { id: 'u120-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I will be working ___ 5 o\'clock.', options: ['until', 'by'], answer_index: 0, explanation: '"Until" berarti proses terus berlanjut sampai titik waktu tersebut.' },
      { id: 'u120-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'Please send me the report ___ (by) Friday.', accepted_answers: ['by'], explanation: '"By" berarti batas waktu maksimal (paling lambat hari Jumat).' },
      { id: 'u120-h-1', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Complete: "___ (By/Until) the time we got to the cinema, the film had already started."', accepted_answers: ['By'], explanation: 'Frasa "By the time" digunakan jika suatu kejadian sudah terlanjur terjadi pada batas waktu tersebut.' }
    ]
  },
  {
    unit: 123, // In / at / on (time)
    questions: [
      { id: 'u123-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I\'ll see you ___ Friday.', options: ['on', 'in'], answer_index: 0, explanation: 'Gunakan "on" untuk hari dan tanggal.' },
      { id: 'u123-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'We are travelling ___ (in/at/on) October.', accepted_answers: ['in'], explanation: 'Gunakan "in" untuk bulan, tahun, dan musim.' },
      { id: 'u123-h-1', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Type the missing prepositions: "I usually wake up ___ 7 o\'clock ___ the morning ___ Sundays." (Separate answers with a space)', accepted_answers: ['at in on'], explanation: 'Jam menggunakan AT, bagian hari (morning) menggunakan IN, hari spesifik (Sundays) menggunakan ON.' }
    ]
  },
  {
    unit: 124, // In / on / at (place 1)
    questions: [
      { id: 'u124-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'There\'s a spider ___ the ceiling.', options: ['on', 'in'], answer_index: 0, explanation: '"On" digunakan untuk permukaan (surface).' },
      { id: 'u124-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'Turn left ___ (at/in) the traffic lights.', accepted_answers: ['at'], explanation: '"At" digunakan untuk titik spesifik dalam perjalanan/lokasi.' },
      { id: 'u124-h-1', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Type the missing prepositions: "He is waiting ___ the bus stop ___ the end of the street." (Separate answers with a space)', accepted_answers: ['at at'], explanation: 'Keduanya adalah titik spesifik lokasi (bus stop dan ujung jalan), jadi gunakan AT.' }
    ]
  },
  {
    unit: 125, // In / on / at (place 2)
    questions: [
      { id: 'u125-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'He is sitting ___ the back of the car.', options: ['in', 'at'], answer_index: 0, explanation: 'Untuk mobil dan taksi, gunakan "in the back".' },
      { id: 'u125-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'The answers are ___ (on/at) the back of the book.', accepted_answers: ['at'], explanation: 'Untuk halaman belakang buku, gunakan "at".' },
      { id: 'u125-h-1', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Type the missing prepositions: "I saw him sitting ___ the back row of the cinema, right ___ the corner." (Separate answers with a space)', accepted_answers: ['in in'], explanation: 'Dalam barisan (row) menggunakan IN. Untuk pojok ruangan dalam gedung (corner of a room) juga menggunakan IN.' }
    ]
  },
  {
    unit: 126, // In / on / at (place 3)
    questions: [
      { id: 'u126-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I read about it ___ the newspaper.', options: ['in', 'on'], answer_index: 0, explanation: 'Bahan bacaan cetak (buku, koran, majalah) menggunakan "in".' },
      { id: 'u126-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I saw the news ___ (on/in) TV.', accepted_answers: ['on'], explanation: 'Layar elektronik (TV, internet, komputer) menggunakan "on".' },
      { id: 'u126-h-1', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Type the missing prepositions: "We stayed ___ a nice hotel ___ a small island." (Separate answers with a space)', accepted_answers: ['at on', 'in on'], explanation: 'Hotel bisa AT/IN. Pulau selalu menggunakan ON.' }
    ]
  },
  {
    unit: 127, // To / at / in / into
    questions: [
      { id: 'u127-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'We walked ___ the city centre.', options: ['to', 'at'], answer_index: 0, explanation: '"To" menunjukkan arah pergerakan (menuju).' },
      { id: 'u127-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'What time did you arrive ___ (in/to) London?', accepted_answers: ['in'], explanation: '"Arrive" tidak pernah menggunakan "to". Untuk kota besar atau negara, gunakan "in".' },
      { id: 'u127-h-1', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Type the missing prepositions: "We went ___ a party ___ John\'s house." (Separate answers with a space)', accepted_answers: ['to at'], explanation: 'Pergi menuju acara (TO). Lokasi terjadinya acara tersebut (AT).' }
    ]
  },
  {
    unit: 128, // In / on / at (other uses)
    questions: [
      { id: 'u128-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I\'m going on holiday. I\'ll be away ___ business.', options: ['on', 'for'], answer_index: 0, explanation: 'Frasa baku: "on holiday", "on business", "on a trip".' },
      { id: 'u128-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'Water boils ___ (at) 100 degrees Celsius.', accepted_answers: ['at'], explanation: 'Suhu, kecepatan, dan harga menggunakan "at".' },
      { id: 'u128-h-1', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Type the missing prepositions: "Did you pay ___ cash or ___ credit card?" (Separate answers with a space)', accepted_answers: ['in by'], explanation: 'Uang tunai adalah "in cash", sedangkan metode pembayaran elektronik/kartu adalah "by credit card".' }
    ]
  },
  {
    unit: 129, // By (by car, by chance)
    questions: [
      { id: 'u129-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'We travelled ___ train.', options: ['by', 'in'], answer_index: 0, explanation: 'Transportasi umum tanpa kata sandang (the/a/my) menggunakan "by".' },
      { id: 'u129-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'We travelled ___ (in) my car.', accepted_answers: ['in'], explanation: 'Jika ada kata "my/a/the" sebelum kendaraan pribadi (car/taxi), gunakan "in".' },
      { id: 'u129-h-1', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Type the missing prepositions: "We went ___ train, but they went ___ their own car." (Separate answers with a space)', accepted_answers: ['by in'], explanation: 'Tanpa the/my (by train). Ada awalan their (in their car).' }
    ]
  },
  {
    unit: 130, // Noun + preposition
    questions: [
      { id: 'u130-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'The cause ___ the fire is unknown.', options: ['of', 'for'], answer_index: 0, explanation: 'Pasangannya adalah "cause of", BUKAN "cause for".' },
      { id: 'u130-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'There has been an increase ___ (in/of) prices.', accepted_answers: ['in'], explanation: '"Increase / decrease" (peningkatan/penurunan dalam hal tertentu) dipasangkan dengan "in".' },
      { id: 'u130-h-1', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Type the missing prepositions: "She showed me a photograph ___ her family, and gave me an invitation ___ the wedding." (Separate answers with a space)', accepted_answers: ['of to'], explanation: 'Foto seseorang = photograph of. Undangan menuju acara = invitation to.' }
    ]
  },
  {
    unit: 131, // Adjective + preposition 1
    questions: [
      { id: 'u131-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'It was nice ___ you to help me.', options: ['of', 'for'], answer_index: 0, explanation: 'Untuk memuji perilaku seseorang, gunakan "nice / kind / good + OF + somebody".' },
      { id: 'u131-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'Are you angry ___ (with/about) me?', accepted_answers: ['with'], explanation: 'Marah KEPADA seseorang = angry with/at somebody.' },
      { id: 'u131-h-1', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Type the missing prepositions: "I was delighted ___ the present, but I felt sorry ___ the person who bought it." (Separate answers with a space)', accepted_answers: ['with for', 'by for'], explanation: 'Senang akan sesuatu = delighted with. Merasa kasihan pada = sorry for.' }
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
console.log('Tingkat B Batch 4 done!');
