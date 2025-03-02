 import { mod, modInverse } from "./helpers.js";


export const evaluatePolynomial = (coefficients, x, prime) => {
    let result = 0n;
    let power = 1n;
    
    for (const coeff of coefficients) {
      result = mod(result + mod(coeff * power, prime), prime);
      power = mod(power * x, prime);
    }
    
    return result;
  };
export  const generateShares = (secret, numShares, threshold, prime) => {
    if (numShares < threshold) {
      throw new Error('Number of shares must be >= threshold');
    }
  
    const coefficients = [secret];
    for (let i = 1; i < threshold; i++) {
      const coeff = BigInt(Math.floor(Math.random() * Number(prime)));
      coefficients.push(coeff);
    }
  
    const shares = [];
    for (let x = 1n; x <= BigInt(numShares); x++) {
      const y = evaluatePolynomial(coefficients, x, prime);
      shares.push({ x, y });
    }
  
    return shares;
  };

 export const reconstructSecret = (shares, prime) => {
    let secret = 0n;
  
    for (let i = 0; i < shares.length; i++) {
      let numerator = 1n;
      let denominator = 1n;
  
      for (let j = 0; j < shares.length; j++) {
        if (i !== j) {
          numerator = mod(numerator * mod(-shares[j].x, prime), prime);
          denominator = mod(denominator * mod(shares[i].x - shares[j].x, prime), prime);
        }
      }
  
      const lagrangeCoeff = mod(numerator * modInverse(denominator, prime), prime);
      secret = mod(secret + mod(shares[i].y * lagrangeCoeff, prime), prime);
    }
  
    return secret;
  };
  