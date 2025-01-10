import React from 'react';

export default function Marker({ text, onClick, bg}) {
  const style = {
    'tabIndex': '0',
    'backgroundColor': bg,
    'color': 'white',
    'height': '2.5rem',
    'width': '2.5rem',
    'minWidth': 'max-content',
    'borderRadius': '50%',
    'display': 'flex',
    'alignItems': 'center',
    'justifyContent': 'center',
  };

  return(
    <div 
      onClick={onClick}
      style={style}
    >
      {text}
    </div>
  )
}
