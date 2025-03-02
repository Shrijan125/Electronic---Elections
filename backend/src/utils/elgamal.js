const p = 23n;
const g = 5n;   
const x = 6n; 
const y = g ** x % p;

export const publicKey = { p, g, y };
export const privateKey = { p, x };

export const encrypt = (publicKey, message) => {
    const { g, p, y } = publicKey;
    const k = BigInt(Math.floor(Math.random() * Number(p - 1n))) + 1n;
    const c1 = g ** k % p;
    const gm = g ** message % p; 
    const s = y ** k % p;
    const c2 = (gm * s) % p;
    return { c1, c2 };
};

export const decrypt = (privateKey, ciphertext) => {
    const { c1, c2 } = ciphertext;
    const { p, x } = privateKey;
    const s = c1 ** x % p;
    const sInv = s ** (p - 2n) % p;
    const gm = (c2 * sInv) % p;
    
    for (let m = 0n; m < p; m++) {
        if ((g ** m % p) === gm) {
            return m;
        }
    }
    return 0n; 
};


export const multiplyCiphertexts = (cipher1, cipher2, publicKey) => {
    const { p } = publicKey;
    return {
        c1: (cipher1.c1 * cipher2.c1) % p,
        c2: (cipher1.c2 * cipher2.c2) % p,
    };
};