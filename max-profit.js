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
 *
 *   if n < 7:  fill with Pubs => pubs = floor(n / 4)
 *   if n >= 7: fill with Theatres => theatres = floor(n / 5)
 *              add one Pub if remainder (n % 5) >= 4
 */

const maxProfit = (n) => {
  const theatres = n < 7 ? 0 : Math.floor(n / 5);
  const pubs = n < 7 ? Math.floor(n / 4) : n % 5 >= 4 ? 1 : 0;

  let total = 0;
  let timeUsed = 0;
  for (let i = 0; i < theatres; i++) {
    timeUsed += 5;
    total += 1500 * (n - timeUsed);
  }
  for (let i = 0; i < pubs; i++) {
    timeUsed += 4;
    total += 1000 * (n - timeUsed);
  }

  console.log(`Input: Time Unit ${n}`);
  console.log(`Earnings: $${total}`);
  console.log(`T: ${theatres} P: ${pubs} C: 0`);
};

maxProfit(7);
maxProfit(8);
maxProfit(13);
