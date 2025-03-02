import React, { useState } from 'react'
import PrimaryInput from '../primary_input'
import SubmitButton from '../submit_button';
import toast from 'react-hot-toast';
import { BASE_URL } from '../../constants';
import axios from 'axios';

const TallyVotes = () => {
    const [authorityid, setAuthorityid] = useState('');
    const [totalVotes, setTotalVotes] = useState();
    const [yesVotes, setYesVotes] = useState();
    const [noVotes, setNoVotes] = useState();
    async function handleClick() {
        const authorityIds = authorityid.split(',').map(item => item.trim());
        if(authorityIds.length === 0)
        {
            toast.error('Please enter atleast one id!',{position:'top-right'});
            return;
        }
        try {
            const url = BASE_URL + '/reconstructtally';
            const {data,status} = await axios.post(url, {
                authorityIds 
            });

            if (status === 200) {
                toast.success('Votes fetched successfully!', { position: 'top-right' });
                setTotalVotes(data.totalVotes);
                setYesVotes(data.totalYesVotes);
                setNoVotes(data.totalVotes - data.totalYesVotes);    
              } else {
                toast.error(data.message || 'Failed to get tally!', { position: 'top-right' });
              }
            
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
          
                switch (status) {
                  case 404:
                    toast.error(data.message || 'Voter not found', { position: 'top-right' });
                    break;
                  case 403:
                    toast.error(data.message || 'Voter not authorised', { position: 'top-right' });
                    break;
                  case 400:
                    toast.error(data.message || 'Missing required fields', { position: 'top-right' });
                    break;
                  default:
                    toast.error(data.message || 'Failed to cast your vote', { position: 'top-right' });
                }
              } else {
                toast.error('Network error. Please try again later.', { position: 'top-right' });
              }
        }
    }
  return (
    <div className='flex flex-col items-center gap-4 mt-16'>
    <h1 className='text-purple-200 font-extrabold text-center text-4xl mb-11'>Tally your Votes!</h1>
        <div className='flex'>
            <div className='flex flex-col gap-2'>
                <PrimaryInput labeltext={'Enter authority id'} placeholder={'1, 2, 8'} setChange={setAuthorityid} value={authorityid}></PrimaryInput>
                <SubmitButton text={'Get Results'} onClick={handleClick}></SubmitButton>
            </div>
        </div>
        <div>
            {totalVotes && <div className='flex flex-col gap-2'>
                <h1 className='text-purple-200 font-extrabold text-center text-2xl'>Total Votes: {totalVotes}</h1>
                <h1 className='text-purple-200 font-extrabold text-center text-2xl'>Party1 Votes: {yesVotes}</h1>
                <h1 className='text-purple-200 font-extrabold text-center text-2xl'>Party2 Votes: {noVotes}</h1>
            </div>}
        </div>
    </div>
  )
}

export default TallyVotes