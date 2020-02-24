const add = async (a, b) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (a < 0 || b < 0) {
        reject("Numbers cant be negative");
      }
      resolve(a + b);
    }, 2000);
  });
};

const work = async () => {
  const sum = await add(1, 20);
  console.log("sum", sum);
  const sum2 = await add(sum, 5);
  console.log("sum2", sum2);
  const sum3 = await add(sum2, 10);
  console.log("sum3", sum3);
  return sum3;
};

const result = work();

result
  .then(output => {
    console.log("output", output);
  })
  .catch(err => {
    console.error("ERROR::", err);
  });
