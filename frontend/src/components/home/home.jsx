import React from 'react'
import PrimaryButton from '../primary_button';
import { BASE_URL } from '../../constants';
import axios from 'axios';
import toast from 'react-hot-toast';

const Home = () => {
    async function handleClick() {
       try {
         const url = BASE_URL + '/tallyvote';
        await axios.get(url);
       } catch (error) {
        toast.error('Failed to tally votes. Please try again!', {position:'top-right'})
       }
    }
    const buttons = [
        {
          text : 'Register Voter',
          link : '/register'
        },
        {
          text : 'Cast Vote',
          link : '/vote'
        },
        {
          text : 'Tally Votes',
          link : '/tally'
        },
        {
          text: 'Authorise Voter',
          link: '/authorise'
        }
      ];
    return <div className='flex items-center flex-col gap-14'>
    <h1 className='text-purple-200 font-extrabold text-center mt-16 text-4xl'>Welcome to Electronic-Elections!</h1>
    <div className='flex gap-4 flex-col'>
      {
        buttons.map((button, index) => (
        index===2 ? <PrimaryButton key={index} text={button.text} link={button.link} onClick={handleClick} /> : <PrimaryButton key={index} text={button.text} link={button.link} />
        ))
      }
    </div>
    </div>
}

export default Home