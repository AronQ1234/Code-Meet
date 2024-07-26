import React from 'react'

const LanguagePicker = ({onLanguageChange, color}:any,) => {
    const handleChange = (e:any) => {
      setTimeout(() => {
        onLanguageChange(e.target.value);
        console.log(e.target.value)
      }, 0);
    };
  const OppColor = color === '#FFFFFF' ? '#1E1E1E' : '#FFFFFF';
  console.log(OppColor)
  return (
    <select onChange={handleChange}  style={{background: color, color:OppColor}}>
        <option  style={{background: color, color:OppColor}} value="javascript">JavaScript</option>
        <option  style={{background: color, color:OppColor}} value="python">Pyhton</option>
        <option  style={{background: color, color:OppColor}} value="cpp">C++</option>
        <option  style={{background: color, color:OppColor}} value="typescript">Typescript</option>
        <option  style={{background: color, color:OppColor}} value="c">C</option>
        <option  style={{background: color, color:OppColor}} value="csharp">C#</option>
        <option  style={{background: color, color:OppColor}} value="java">Java</option>
        <option  style={{background: color, color:OppColor}} value="erlang">Erlang</option>
        <option  style={{background: color, color:OppColor}} value="basic">Basic</option>
        <option  style={{background: color, color:OppColor}} value="go">Go</option>
        <option  style={{background: color, color:OppColor}} value="lua">Lua</option>
        <option  style={{background: color, color:OppColor}} value="php">PHP</option>
        <option  style={{background: color, color:OppColor}} value="ruby">Ruby</option>
        <option  style={{background: color, color:OppColor}} value="rust">Rust</option>
        <option  style={{background: color, color:OppColor}} value="elixir">Elixir</option>
    </select>
  )
}

export default LanguagePicker