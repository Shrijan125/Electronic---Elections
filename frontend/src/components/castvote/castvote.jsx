import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import PrimaryInput from '../primary_input';
import SubmitButton from '../submit_button';
import { BASE_URL } from '../../constants';

const CastVote = () => {
    const [name, setName] = useState('');

    const Vote = async (vote) => {
        if (!name || name.trim() === '') {
            toast.error('Full Name is required', { position: 'top-right' });
            return;
        }

        try {
            const url = BASE_URL + '/castvote'
            const { data, status } = await axios.post(url, { 
                fullName: name, 
                vote 
            });

            if (status === 200) {
                toast.success('Vote cast successfully!', { position: 'top-right' });
            } else {
                toast.error(data.message || 'Failed to cast your vote', { position: 'top-right' });
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
    };

    return (
        <div className='flex flex-col items-center gap-4 mt-16'>
            <h1 className='text-purple-200 font-extrabold text-center text-4xl mb-11'>Cast Your Vote!</h1>
            <PrimaryInput 
                placeholder='John Doe' 
                setChange={setName} 
                labeltext={"Enter Voter's name"} 
                value={name} 
            />
            <SubmitButton text='Party 1' onClick={() => Vote('yes')} />
            <SubmitButton text='Party 2' onClick={() => Vote('no')} />
        </div>
    );
};

export default CastVote;
