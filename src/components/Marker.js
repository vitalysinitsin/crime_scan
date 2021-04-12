import React from 'react';

export default function Marker({ text }) {
  const style = {
    'backgroundColor': 'rgb(50,50,50)',
    'color': 'white',
    'height': '2.5rem',
    'width': '2.5rem',
    'min-width': 'max-content',
    'borderRadius': '50%',
    'display': 'flex',
    'alignItems': 'center',
    'justifyContent': 'center',
    'cursor': 'pointer',
    'border': '3px solid grey'
  };

  return(
    <div 
      style={style}
    >
      <span>{text}</span>
    </div>
  )
}
