const fs = require('fs');
let data;
try {
  data = JSON.parse(fs.readFileSync('grammar-units.json', 'utf8'));
} catch(e) { process.exit(1); }

const updates = [
  {
    unit: 132, // Adjective + preposition 2
    questions: [
      { id: 'u132-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I feel sorry ___ George.', options: ['for', 'about'], answer_index: 0, explanation: 'Sorry FOR somebody = kasihan pada seseorang.' },
      { id: 'u132-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'Are you excited ___ (about/for) going on holiday?', accepted_answers: ['about'], explanation: 'Excited ABOUT something.' },
      { id: 'u132-h-1', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Type the missing prepositions: "I am impressed ___ her English, but I am not satisfied ___ the test results." (Separate answers with a space)', accepted_answers: ['with with', 'by with'], explanation: 'Kagum pada = impressed with/by. Puas dengan = satisfied with.' }
    ]
  },
  {
    unit: 133, // Verb + preposition 1
    questions: [
      { id: 'u133-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'He apologised ___ the police officer.', options: ['to', 'for'], answer_index: 0, explanation: 'Meminta maaf KEPADA seseorang = apologise TO somebody.' },
      { id: 'u133-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I don\'t care ___ (about/for) money.', accepted_answers: ['about'], explanation: 'Tidak peduli tentang = care about.' },
      { id: 'u133-h-1', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Type the missing prepositions: "She explained the problem ___ us, and then apologised ___ being late." (Separate answers with a space)', accepted_answers: ['to for'], explanation: 'Explain something TO somebody. Apologise FOR something.' }
    ]
  },
  {
    unit: 134, // Verb + preposition 2
    questions: [
      { id: 'u134-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I called the restaurant to ask ___ a table.', options: ['for', 'about'], answer_index: 0, explanation: 'Meminta sesuatu = ask FOR something.' },
      { id: 'u134-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'Does this umbrella belong ___ (to) you?', accepted_answers: ['to'], explanation: 'Milik seseorang = belong TO.' },
      { id: 'u134-h-1', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Type the missing prepositions: "I searched everywhere ___ my keys, but I didn\'t want to ask anyone ___ help." (Separate answers with a space)', accepted_answers: ['for for'], explanation: 'Mencari sesuatu = search FOR. Meminta bantuan = ask FOR help.' }
    ]
  },
  {
    unit: 135, // Verb + preposition 3
    questions: [
      { id: 'u135-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'They accused me ___ telling lies.', options: ['of', 'for'], answer_index: 0, explanation: 'Menuduh seseorang melakukan sesuatu = accuse somebody OF doing.' },
      { id: 'u135-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I prefer tea ___ (to) coffee.', accepted_answers: ['to'], explanation: 'Lebih memilih A daripada B = prefer A TO B.' },
      { id: 'u135-h-1', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Type the missing prepositions: "He congratulated me ___ passing the exam, but he blamed the teacher ___ his own failure." (Separate answers with a space)', accepted_answers: ['on for'], explanation: 'Selamat atas = congratulate ON. Menyalahkan orang atas sesuatu = blame somebody FOR something.' }
    ]
  },
  {
    unit: 136, // Verb + preposition 4
    questions: [
      { id: 'u136-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'The book consists ___ 10 chapters.', options: ['of', 'from'], answer_index: 0, explanation: 'Terdiri dari = consist OF.' },
      { id: 'u136-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'Did you invite him ___ (to/for) the party?', accepted_answers: ['to'], explanation: 'Mengundang ke acara = invite TO.' },
      { id: 'u136-h-1', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Type the missing prepositions: "She spends a lot of money ___ clothes, but she never provides her children ___ enough food." (Separate answers with a space)', accepted_answers: ['on with'], explanation: 'Menghabiskan uang untuk = spend money ON. Menyediakan sesuatu untuk seseorang = provide somebody WITH something.' }
    ]
  },
  {
    unit: 137, // Phrasal verbs 1
    questions: [
      { id: 'u137-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'Can you turn ___ the radio? It\'s too quiet.', options: ['up', 'on'], answer_index: 0, explanation: '"Turn up" berarti mengeraskan volume.' },
      { id: 'u137-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'The car broke ___ (down) on the motorway.', accepted_answers: ['down'], explanation: '"Break down" berarti mogok (mesin rusak).' },
      { id: 'u137-h-1', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Type the missing particle: "I had to fill ___ a form, and then hand it ___ to the receptionist." (Separate answers with a space)', accepted_answers: ['in in', 'out in'], explanation: 'Mengisi formulir = fill in/out. Menyerahkan = hand in.' }
    ]
  },
  {
    unit: 138, // Phrasal verbs 2
    questions: [
      { id: 'u138-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I need to find ___ what time the train leaves.', options: ['out', 'up'], answer_index: 0, explanation: '"Find out" berarti mencari tahu informasi.' },
      { id: 'u138-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'Please put ___ (out/off) your cigarette.', accepted_answers: ['out'], explanation: '"Put out" berarti mematikan api/rokok.' },
      { id: 'u138-h-1', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Type the missing particle: "We tried to work ___ a solution, but eventually we had to give ___." (Separate answers with a space)', accepted_answers: ['out up'], explanation: 'Mencari solusi = work out. Menyerah = give up.' }
    ]
  },
  {
    unit: 139, // Phrasal verbs 3
    questions: [
      { id: 'u139-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'Look ___ ! There\'s a car coming.', options: ['out', 'up'], answer_index: 0, explanation: '"Look out" berarti awas/hati-hati.' },
      { id: 'u139-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'We are looking ___ (forward) to our holiday.', accepted_answers: ['forward'], explanation: '"Look forward to" berarti sangat menantikan.' },
      { id: 'u139-h-1', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Type the missing particle: "I don\'t get ___ well with my boss, so I try to keep ___ of his way." (Separate answers with a space)', accepted_answers: ['on out'], explanation: 'Akur/berteman baik = get on well with. Menghindar = keep out of the way.' }
    ]
  },
  {
    unit: 140, // Phrasal verbs 4
    questions: [
      { id: 'u140-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'Don\'t let me ___. I am relying on you.', options: ['down', 'off'], answer_index: 0, explanation: '"Let somebody down" berarti mengecewakan.' },
      { id: 'u140-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I can\'t put ___ (up) with this noise anymore!', accepted_answers: ['up'], explanation: '"Put up with" berarti menoleransi/tahan terhadap sesuatu yang mengganggu.' },
      { id: 'u140-h-1', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Type the missing particle: "He made ___ a story to explain why he was late, but I could easily see ___ his lies." (Separate answers with a space)', accepted_answers: ['up through'], explanation: 'Mengarang cerita = make up. Menyadari kebohongan = see through.' }
    ]
  },
  {
    unit: 141, // Phrasal verbs 5
    questions: [
      { id: 'u141-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I ran ___ an old friend yesterday.', options: ['into', 'over'], answer_index: 0, explanation: '"Run into" berarti tidak sengaja bertemu.' },
      { id: 'u141-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I can\'t make ___ (out) what it says. The writing is too small.', accepted_answers: ['out'], explanation: '"Make out" berarti bisa membaca/memahami secara visual atau audio dengan susah payah.' },
      { id: 'u141-h-1', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Type the missing particle: "The meeting was put ___ until next week because the manager was held ___ in traffic." (Separate answers with a space)', accepted_answers: ['off up'], explanation: 'Ditunda = put off. Tertahan = held up.' }
    ]
  },
  {
    unit: 142, // Phrasal verbs 6
    questions: [
      { id: 'u142-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'She takes ___ her father. They are very similar.', options: ['after', 'over'], answer_index: 0, explanation: '"Take after" berarti mewarisi sifat/kemiripan fisik keluarga.' },
      { id: 'u142-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'A big company has taken ___ (over) our business.', accepted_answers: ['over'], explanation: '"Take over" berarti mengambil alih.' },
      { id: 'u142-h-1', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Type the missing particle: "He took ___ swimming to lose weight, but gave it ___ after a week." (Separate answers with a space)', accepted_answers: ['up up'], explanation: 'Memulai hobi/kebiasaan baru = take up. Berhenti/menyerah = give up.' }
    ]
  },
  {
    unit: 143, // Phrasal verbs 7
    questions: [
      { id: 'u143-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'My alarm went ___ at 6 AM.', options: ['off', 'on'], answer_index: 0, explanation: '"Go off" untuk alarm berarti berbunyi menyala.' },
      { id: 'u143-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'Please go ___ (on) with your story. I\'m listening.', accepted_answers: ['on'], explanation: '"Go on" berarti lanjutkan.' },
      { id: 'u143-h-1', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Type the missing particle: "The bomb went ___ in the city centre, and the police cordoned ___ the area." (Separate answers with a space)', accepted_answers: ['off off'], explanation: 'Meledak = go off. Menutup area dengan pita polisi = cordon off.' }
    ]
  },
  {
    unit: 144, // Phrasal verbs 8
    questions: [
      { id: 'u144-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'It took him a long time to get ___ his illness.', options: ['over', 'off'], answer_index: 0, explanation: '"Get over" berarti pulih / sembuh dari sakit atau kekecewaan.' },
      { id: 'u144-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I don\'t know how we will get ___ (by) without money.', accepted_answers: ['by'], explanation: '"Get by" berarti bertahan hidup dengan sumber daya seadanya.' },
      { id: 'u144-h-1', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Type the missing particle: "I tried to call him, but I couldn\'t get ___, so I left a message, but he never got ___ to me." (Separate answers with a space)', accepted_answers: ['through back'], explanation: 'Tersambung telepon = get through. Membalas (telepon/pesan) = get back (to someone).' }
    ]
  },
  {
    unit: 145, // Phrasal verbs 9
    questions: [
      { id: 'u145-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I want to set ___ my own company.', options: ['up', 'out'], answer_index: 0, explanation: '"Set up" berarti mendirikan/membangun (bisnis).' },
      { id: 'u145-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'We set ___ (off) early to avoid the traffic.', accepted_answers: ['off', 'out'], explanation: '"Set off" berarti memulai perjalanan (berangkat).' },
      { id: 'u145-h-1', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Type the missing particle: "He turned ___ late for the meeting, and it turned ___ that he had forgotten the documents." (Separate answers with a space)', accepted_answers: ['up out'], explanation: 'Tiba/muncul = turn up. Ternyata (berakhir dengan fakta) = turn out.' }
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
console.log('Tingkat B Final Batch 5 done!');
