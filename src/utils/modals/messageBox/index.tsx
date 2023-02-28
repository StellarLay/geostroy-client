import React from 'react';

import '../../modal.scss';

const MessageBox = (props: any) => {
  return (
    <div className='message-box'>
      <span className='message-box__text'>{props.message}</span>
    </div>
  );
};

export default MessageBox;
