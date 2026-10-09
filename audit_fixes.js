const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'grammar-units.json');
let rawData = fs.readFileSync(filePath, 'utf8');
let data = JSON.parse(rawData);

let shuffledCount = 0;
let removedQuestionsCount = 0;

// Function to check if a question prompt contains certain keywords
const hasKeyword = (prompt, keywords) => {
    const lowerPrompt = prompt.toLowerCase();
    return keywords.some(kw => lowerPrompt.includes(kw.toLowerCase()));
};

data.units.forEach(unit => {
  if (unit.practice && unit.practice.questions) {
    
    // 1. Filter out specific bad AI questions based on user audit
    const originalLength = unit.practice.questions.length;
    unit.practice.questions = unit.practice.questions.filter(q => {
        const p = q.prompt;
        
        // Unit 1: Remove "have been working" and "is going to"
        if (unit.unit === 1) {
            if (hasKeyword(p, ["have been working", "'ve been working", "dark clouds"])) return false;
        }
        // Unit 5: Remove "used to" and "promised"
        if (unit.unit === 5) {
            if (hasKeyword(p, ["used to", "promise"])) return false;
        }
        // Unit 17: Remove "used to"
        if (unit.unit === 17) {
            if (hasKeyword(p, ["used to"])) return false;
        }
        // Unit 60: Remove the "went to the shop" (to buy vs for to buy)
        if (unit.unit === 60) {
            if (hasKeyword(p, ["went to the shop", "some milk"])) return false;
        }
        
        return true;
    });
    
    removedQuestionsCount += (originalLength - unit.practice.questions.length);

    // 2. Shuffle options for multiple choice questions
    unit.practice.questions.forEach(q => {
      if (q.type === 'multiple_choice' && q.options && q.options.length > 1) {
        // Record correct answer string
        const correctAnswerString = q.options[q.answer_index];
        
        // Create an array of indices and shuffle them
        let indices = Array.from({ length: q.options.length }, (_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        
        const newOptions = indices.map(i => q.options[i]);
        const newAnswerIndex = newOptions.indexOf(correctAnswerString);
        
        if (newOptions.join('|') !== q.options.join('|')) {
            shuffledCount++;
        }
        
        q.options = newOptions;
        q.answer_index = newAnswerIndex;
      }
    });
  }
});

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');

console.log('=== AUDIT FIX REPORT ===');
console.log(`Soal dihapus (karena out-of-topic): ${removedQuestionsCount}`);
console.log(`Soal pilihan ganda yang opsinya berhasil diacak: ${shuffledCount}`);
console.log('File grammar-units.json telah diperbarui.');
