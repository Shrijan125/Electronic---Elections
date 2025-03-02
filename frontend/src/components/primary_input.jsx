import React from 'react';

const PrimaryInput = ({ labeltext, setChange, value, placeholder }) => {
  return (
    <div className='flex flex-col gap-1 items-start'>
      <label htmlFor='votername' className='font-black text-xs text-purple-200'>{labeltext}</label>
      <input
        id='votername'
        onChange={(e) => { setChange(e.target.value); }}
        name='votername'
        placeholder={placeholder}
        value={value}
        className="border w-[300px] placeholder:text-purple-200/60 text-purple-200 border-purple-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 rounded-lg p-2"
      />
    </div>
  );
}

export default PrimaryInput
