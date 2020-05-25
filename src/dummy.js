const arr = [7, 1, 2, 3, 3, 8, 1, 4, 5, 4, 6];

const uniqueReducer = (acc, cur) => {
  console.log(acc, cur);
  acc.has(cur) ? acc.delete(cur) : acc.add(cur);
  return acc;
};

const secondMaxReducer = (acc, cur) => {
  console.log(acc, cur);
  if (acc[0] > cur && cur > acc[1]) {
    acc[1] = cur;
  }
  if (cur > acc[0]) {
    acc[1] = acc[0];
    acc[0] = cur;
  }
  return acc;
};

const findUnique = (arr) => {
  return arr.reduce(uniqueReducer, new Set());
};

const findSecondMax = (arr) => {
  return arr.reduce(secondMaxReducer, [0, 0])[1];
};

const findNthMax = (arr, n) => {
  const nonDuplicateArr = [...new Set(arr)];
  console.log(nonDuplicateArr);
  nonDuplicateArr.sort((a, b) => a - b);
  console.log(nonDuplicateArr);
  return nonDuplicateArr.reverse()[n - 1];
};

// console.log(findUnique(arr));
// console.log(findSecondMax(arr));
// console.log(findNthMax(arr, 3));

const para = `The man behind the world's first major computer virus outbreak has admitted his guilt, 20 years after his software infected millions of machines worldwide.

Filipino Onel de Guzman, now 44, says he unleashed the Love Bug computer worm to steal passwords so he could access the internet without paying.

He claims he never intended it to spread globally.

And he says he regrets the damage his code caused.

"I didn't expect it would get to the US and Europe. I was surprised," he said in an interview for Crime Dot Com, a forthcoming book on cyber-crime.

The Love Bug pandemic began on 4 May, 2000.

Victims received an email attachment entitled LOVE-LETTER-FOR-YOU. It contained malicious code that would overwrite files, steal passwords, and automatically send copies of itself to all contacts in the victim's Microsoft Outlook address book.

Within 24 hours, it was causing major problems across the globe, reportedly infecting 45 million machines. It also overwhelmed organisations' email systems, and some IT managers disconnected parts of their infrastructure to prevent infection.

This led to estimates of damage and disruption running into billions of pounds.

In the UK, Parliament shut down its email network for several hours to protect itself, and even the Pentagon was reportedly affected.

The previous year, the Melissa bug is believed to have infected a million machines using similar tactics. However, Love Bug dwarfed previous outbreaks and exposed how vulnerable the world's increasing internet connectivity was to attack.

Investigators traced the virus to an email address registered to an apartment in Manila, capital of the Philippines.`;

// find the most frequently occuring character.

const alphabets = "abcdefghijklmnopqrstuvwxyz,.\"'-".split("");

console.log(alphabets);

const getFreq = (para) => {
  const freqs = {};
  let totalCounted = 0;
  for (let i = 0; i < para.length; i++) {
    const char = para.charAt(i).toLowerCase();
    if (totalCounted >= para.length) continue;
    if (freqs[char]) continue;
    let counter = 1;
    for (let j = i + 1; j < para.length; j++) {
      if (char === para.charAt(j).toLowerCase()) {
        counter++;
      }
    }
    // console.log(char, counter);
    freqs[char] = counter;
    totalCounted += counter;
    // console.log(totalCounted, para.length)
  }
  return freqs;
};

console.log(getFreq(para));

const getFrequency = (para) => {
  const frequencies = {};
  for (let i = 0; i < para.length; i++) {
    let character = para.charAt(i).toLowerCase();
    if (!alphabets.includes(character)) continue;
    if (frequencies[character]) {
      frequencies[character]++;
    } else {
      frequencies[character] = 1;
    }
  }
  return frequencies;
};

const getSortedFrequencies = (frequencies) => {
  const arrFreq = [];
  Object.keys(frequencies).forEach((character) => {
    arrFreq.push({ c: character, f: frequencies[character] });
  });

  arrFreq.sort((a, b) => a.f - b.f);
  //console.log(arrFreq);
  return arrFreq;
};

const getMostFrequentCharacter = (frequencies) => {
  let alphabetMax = { character: undefined, frequency: 0 };
  Object.keys(frequencies).forEach((character) => {
    if (frequencies[character] > alphabetMax.frequency) {
      alphabetMax = { character, frequency: frequencies[character] };
    }
  });
  return alphabetMax;
};

const freq = getFrequency(para);
console.log(freq);
// console.log(getSortedFrequencies(freq));
// console.log(getMostFrequentCharacter(freq));

// const add = async (a, b) => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       if (a < 0 || b < 0) {
//         reject("Numbers cant be negative");
//       }
//       resolve(a + b);
//     }, 2000);
//   });
// };

// const work = async () => {
//   const sum = await add(1, 20);
//   console.log("sum", sum);
//   const sum2 = await add(sum, 5);
//   console.log("sum2", sum2);
//   const sum3 = await add(sum2, 10);
//   console.log("sum3", sum3);
//   return sum3;
// };

// const result = work();

// result
//   .then(output => {
//     console.log("output", output);
//   })
//   .catch(err => {
//     console.error("ERROR::", err);
//   });
