import { Authority } from "../models/authority.model.js";
import { Voter } from "../models/voter.model.js";
import { Vote } from "../models/votes.model.js";
import { encrypt, publicKey, privateKey, multiplyCiphertexts, decrypt } from "../utils/elgamal.js";
import { generateShares, reconstructSecret } from "../utils/shammirs.js";
import { v4 as uuidv4 } from 'uuid';

const registervoter = async (req, res) => {
  try {
      const { fullName } = req.body;
  
      if (!fullName) {
          return res.status(400).json({ message: "Please provide a fullName" });
      }
  
      const existingVoter = await Voter.findOne({ fullName });
      
      if (existingVoter) {
          return res.status(400).json({ message: "Voter already exists" });
      }
  
      const newVoter =  await Voter.create({ fullName });
  
      if(!newVoter) {
          return res.status(500).json({ message: "Voter registration failed" });
      }
  
      return res.status(201).json({ message: "Voter registered successfully" });
  } catch (error) {
        return res.status(500).json({ message: "Voter registration failed" });
  }

};

const authorisevoter = async (req, res) => {
    try {
        const { fullName } = req.body;

        if (!fullName) {
            return res.status(400).json({ message: "Please provide a fullName" });
        }

        const voter = await Voter.findOne({ fullName});

        if (!voter) {
            return res.status(404).json({ message: "Voter not found" });
        }

        if (voter.authorised) {
            return res.status(400).json({ message: "Voter already authorised" });
        }

        await Voter.updateOne({ fullName }, { authorised: true });

        return res.status(201).json({ message: "Voter authorised successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Voter authorisation failed" });
    }
};


const castvote = async (req, res) => {
    try {      
        const { vote, fullName } = req.body;
        

        if (!fullName || !vote) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
    
        const voter = await Voter.findOne({ fullName });
    
        if (!voter) {
            return res.status(404).json({ message: 'Voter not found' });
        }
    
        if (!voter.authorised) {
            return res.status(403).json({ message: 'Voter not authorised' });
        }
    
        if (voter.votereceipt) {
            return res.status(403).json({ message: 'Voter has already cast a vote' });
        }
    
        const { c1, c2 } = vote === 'yes' ? encrypt(publicKey, 1n) : encrypt(publicKey, 0n);
    
        const receiptToken = uuidv4();
    
        await Vote.create({
            encryptedVotec1: c1.toString(),
            encryptedVotec2: c2.toString(),
            receiptToken,
        });
    
        await Voter.updateOne({ fullName }, { votereceipt: receiptToken });
    
        return res.status(200).json({ message: 'Vote successfully cast' });
    } catch (error) {
        console.error('Error casting vote:', error);
        return res.status(500).json({ message: 'Failed to cast vote' });
    }
};

const tallyvote = async (req, res) => {
    try {
        const votes = await Vote.find();
        
        let aggregatedCiphertext = { 
            c1: 1n, 
            c2: 1n
        };
    
        votes.forEach(({ encryptedVotec1, encryptedVotec2 }) => {
            const ciphertext = {
                c1: BigInt(encryptedVotec1),
                c2: BigInt(encryptedVotec2),
            };
    
            aggregatedCiphertext = multiplyCiphertexts(
                aggregatedCiphertext, 
                ciphertext, 
                publicKey
            );
        });
    
        const totalYesVotes = decrypt(privateKey, aggregatedCiphertext);
        
        const prime = 2311n;
        const shares = generateShares(totalYesVotes, 5, 3, prime);
        
        await Authority.deleteMany({});
        for (let i = 0; i < shares.length; i++) {
            await Authority.create({
                authorityId: i + 1,
                shareX: shares[i].x.toString(),
                shareY: shares[i].y.toString()
            });
        }
    
        return res.status(200).json({ 
            message: 'Tally computed and shared among authorities',
            numberOfShares: shares.length
        });
    } catch (error) {
        console.error('Error tallying votes:', error);
        return res.status(500).json({ message: 'Failed to tally votes' });
    }
};

const reconstructTally = async (req, res) => {
    try {
        const { authorityIds } = req.body;
        
        if (!Array.isArray(authorityIds) || authorityIds.length < 3) {
            return res.status(400).json({ 
                message: 'At least 3 authority IDs required'
            });
        }


        const shares = await Authority.find({
            authorityId: { $in: authorityIds }
        });

        if (shares.length !== authorityIds.length) {
            return res.status(404).json({ 
                message: 'Enterd incorrect authority IDs' 
            });
        }

        const formattedShares = shares.map(share => ({
            x: BigInt(share.shareX),
            y: BigInt(share.shareY)
        }));


        const prime = 2311n;
        const totalYesVotes = reconstructSecret(formattedShares, prime);
        const totalVotes = await Vote.countDocuments();

        return res.status(200).json({ 
            totalYesVotes: Number(totalYesVotes),
            totalVotes: Number(totalVotes),
        });
    } catch (error) {
        console.error('Error reconstructing tally:', error);
        return res.status(500).json({ 
            message: 'Failed to reconstruct tally'
        });
    }
};
export {registervoter, authorisevoter, castvote, tallyvote, reconstructTally};