import React from 'react'

const ThemePicker = ({onThemeChange, color}:any, ) => {
  const handleChange = (e:any) => {
    setTimeout(() => {
      onThemeChange(e.target.value);
      console.log(e.target.value)
    }, 0);
  };
  const OppColor = color === '#FFFFFF' ? '#1E1E1E' : '#FFFFFF';
  
  return (
    <select style={{background: color, color:OppColor}} onChange={handleChange}>
        <option style={{background: color, color:OppColor}} value="light">Light</option>
        <option style={{background: color, color:OppColor}} value="vs-dark">Vs Dark</option>
    </select>
  )
}

export default ThemePicker