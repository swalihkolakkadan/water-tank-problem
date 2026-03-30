/**
 * Ever Quint - Max Profit Problem
 *
 * Commercial Park is excluded entirely.
 * Proof: In the same 10 units a CP takes, you can build 2 Theatres instead.
 *   2 Theatres earn: 1500(n-5) + 1500(n-10) = 3000n - 22500
 *   1 CP earns:      2000(n-10)              = 2000n - 20000
 *
 * Theatre beats Pub when n > 7. Proof: 1500(n-5) > 1000(n-4) => n > 7.
 * At n = 7 they tie. Below n = 7 only Pub is worth building.
 * However since multiple combinations can hit the same max earnings,
 * we use DP to find the max and trace back all valid solutions.
 *
 * Time complexity: O(n) | Space complexity: O(n)
 */

const buildings = [
  { name: "T", buildTime: 5, rate: 1500 },
  { name: "P", buildTime: 4, rate: 1000 },
];

/**
 * Approach 1 - Mathematical (max earnings only, does not find all solutions):
 * Works for most cases but misses alternate combinations that hit the same max.
 * e.g. for n=49 it only returns T:9 P:1 and misses T:8 P:2.
 *
 * const maxProfit = (n) => {
 *   const theatres = n < 7 ? 0 : Math.floor(n / 5);
 *   const pubs = n < 7 ? Math.floor(n / 4) : (n % 5 >= 4 ? 1 : 0);
 *
 *   let total = 0;
 *   let timeUsed = 0;
 *   for (let i = 0; i < theatres; i++) { timeUsed += 5; total += 1500 * (n - timeUsed); }
 *   for (let i = 0; i < pubs; i++) { timeUsed += 4; total += 1000 * (n - timeUsed); }
 *
 *   console.log(`Input: Time Unit ${n}`);
 *   console.log(`Earnings: $${total}`);
 *   console.log(`T: ${theatres} P: ${pubs} C: 0`);
 * };
 */

/**
 * Approach 2 - Brute force recursion (finds all solutions, exponential time):
 * Tries every possible sequence but recomputes overlapping subproblems.
 * Time complexity: O(2^(n/4)) | Space complexity: O(n/4)
 *
 * const maxProfit = (n) => {
 *   let maxEarnings = 0;
 *   let bestSolutions = [];
 *
 *   const recurse = (timeUsed, counts, earnings) => {
 *     let builtSomething = false;
 *     for (const b of buildings) {
 *       const finishTime = timeUsed + b.buildTime;
 *       if (finishTime > n) continue;
 *       builtSomething = true;
 *       counts[b.name] = (counts[b.name] || 0) + 1;
 *       recurse(finishTime, counts, earnings + b.rate * (n - finishTime));
 *       counts[b.name]--;
 *     }
 *     if (!builtSomething) {
 *       const key = JSON.stringify({ T: counts.T || 0, P: counts.P || 0 });
 *       if (earnings > maxEarnings) { maxEarnings = earnings; bestSolutions = [key]; }
 *       else if (earnings === maxEarnings && !bestSolutions.includes(key)) bestSolutions.push(key);
 *     }
 *   };
 *
 *   recurse(0, {}, 0);
 *   console.log(`Input: Time Unit ${n}`);
 *   console.log(`Earnings: $${maxEarnings}`);
 *   bestSolutions.forEach((s, i) => {
 *     const { T, P } = JSON.parse(s);
 *     console.log(`  ${i + 1}. T: ${T} P: ${P} C: 0`);
 *   });
 * };
 */

/**
 * Approach 3 - DP (finds all solutions, linear time):
 * Build dp[t] = max earnings from timeUsed t onwards.
 * Track which buildings led to the max at each t, then trace back all paths.
 * Time complexity: O(n) | Space complexity: O(n)
 */
const maxProfit = (n) => {
  const dp = new Array(n + 1).fill(0);
  const choices = new Array(n + 1).fill(null).map(() => []);

  for (let t = n - 1; t >= 0; t--) {
    let best = 0;

    if (t + 5 <= n) {
      const earn = 1500 * (n - t - 5) + dp[t + 5];
      if (earn > best) {
        best = earn;
        choices[t] = ["T"];
      } else if (earn === best) choices[t].push("T");
    }

    if (t + 4 <= n) {
      const earn = 1000 * (n - t - 4) + dp[t + 4];
      if (earn > best) {
        best = earn;
        choices[t] = ["P"];
      } else if (earn === best) choices[t].push("P");
    }

    dp[t] = best;
  }

  const solutions = new Set();

  const trace = (t, counts) => {
    if (choices[t].length === 0) {
      solutions.add(JSON.stringify({ T: counts.T, P: counts.P }));
      return;
    }
    for (const b of choices[t]) {
      const next = b === "T" ? t + 5 : t + 4;
      trace(next, {
        T: counts.T + (b === "T" ? 1 : 0),
        P: counts.P + (b === "P" ? 1 : 0),
      });
    }
  };

  trace(0, { T: 0, P: 0 });

  console.log(`Input: Time Unit ${n}`);
  console.log(`Earnings: $${dp[0]}`);
  console.log(`Solutions:`);
  [...solutions].forEach((s, i) => {
    const { T, P } = JSON.parse(s);
    console.log(`  ${i + 1}. T: ${T} P: ${P} C: 0`);
  });
};

maxProfit(7);
maxProfit(8);
maxProfit(13);
maxProfit(49);
