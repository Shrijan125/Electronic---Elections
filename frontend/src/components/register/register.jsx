import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import PrimaryInput from '../primary_input';
import SubmitButton from '../submit_button';
import { BASE_URL } from '../../constants';

const Register = () => {
    const [name, setName] = useState('');

    const registerVoter = async () => {
        if (!name || name.trim() === '') {
            toast.error('Full Name is required', { position: 'top-right' });
            return;
        }
        try {
            const url = BASE_URL + '/registervoter';
            await axios.post(url, { fullName: name });
            toast.success('Voter registered successfully', { position: 'top-right' });
        } catch (error) {
            toast.error('Failed to register voter', { position: 'top-right' });
        }
    };

    return (
        <div className='flex flex-col items-center gap-4 mt-16'>
            <h1 className='text-purple-200 font-extrabold text-center text-4xl mb-11'>Register your Voter!</h1>
            <PrimaryInput
                placeholder='John Doe'
                setChange={setName}
                labeltext={"Enter Voter's name"}
                value={name}
            />
            <SubmitButton text='Submit' onClick={registerVoter} />
        </div>
    );
};

export default Register;
