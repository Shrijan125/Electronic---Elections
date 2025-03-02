export const mod = (n, p) => {
    let result = n % p;
    return result >= 0n ? result : result + p;
  };

 export  const modInverse = (a, p) => {
    let t = 0n, newT = 1n;
    let r = p, newR = a;
  
    while (newR !== 0n) {
      let quotient = r / newR;
      [t, newT] = [newT, t - quotient * newT];
      [r, newR] = [newR, r - quotient * newR];
    }
  
    if (t < 0n) t += p;
    return t;
  };
  