import React from 'react';

export default ({ type = 'checkbox',value,placeholder, name, className, errors = [], ...props }) => {
    return (

        <div className="flex flex-col items-start ">
        
        <input
        type={type}
         className=""
         />
      </div>
  );
};
