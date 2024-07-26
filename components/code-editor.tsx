"use client"
import  getCodeOutput  from '@/helper/getCodeOutput';
import { useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import LanguagePicker from '@/components/languagePicker';
import ThemePicker from '@/components/themePicker';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Editor from '@monaco-editor/react';


export default function CodeEditor() {
  const [code, setCode] = useState<string>("//this is the editor");
  const [input, setInput] = useState<string>("");
  const [lang, setLang] = useState<string>("javascript");
  const [theme, setTheme] = useState("light");
  const [output, setOutput] = useState<string>()
  const [time, setTime] = useState<number>()
  const [wallTime, setWallTime] = useState<number>()
  const [color, setColor] = useState<string>('#FFFFFF')
  const oppColor = color === '#FFFFFF' ? '#1E1E1E' : '#FFFFFF';

  useEffect(() => {
    console.log(`Theme changed to: ${theme}`);
    console.log(`Color changed to: ${color}`);
  }, [theme, color]);

  const { toast } = useToast()

  function handleInputChange(e:any){
    setInput(e.target.value)
  }
  function handleEditorChange(value:any, event:any) {
    setCode(value)
  }
  function handleLanguageChange(language: string) {
    setLang(language);
  }
  function handleThemeChange(theme: string) {
    setTheme(theme);
    if(theme==="light"){
      setColor('#FFFFFF')
      console.log(color)
    }else if (theme==="vs-dark"){
      setColor('#1E1E1E')
      console.log(color)
    }

  }
  function handleOutputValue(ResponseOutput:any) {
    setOutput(ResponseOutput[0]);
    setTime(ResponseOutput[1]);
    setWallTime(ResponseOutput[2]);
  }
  return (
    <div className='flex flex-row p-7'>
      <div className='w-[70%] flex flex-col' style={{background: color, color:oppColor}}>
        <div  style={{background: color}}>
          <LanguagePicker style={{background: color, color:oppColor}} onLanguageChange={handleLanguageChange} color={color}/>
          <ThemePicker style={{background: color, color:oppColor}} onThemeChange={handleThemeChange} color={color}/>
        </div>
        <Editor
          height="70vh"
          language={lang}
          onChange={handleEditorChange}
          theme={theme}
          value={code}
          className='border-zinc-950'
        />
      </div>
      <div className='w-[30%] p-3' style={{background: color, color:oppColor}}>
        <Button
          className='bg-green-600 hover:bg-slate-600'
          variant={"default"}
          onClick={async () => {
            toast({
              title: "Code running",
              description: `Running ${lang} code`,
            })
            handleOutputValue(await getCodeOutput(code, input, lang))
          }}
        >
          Run
        </Button>
        <Button
          className='bg-red-600 hover:bg-slate-600'
          variant={"destructive"}
          onClick={() => {
            setCode("");
            toast({
              title: "Cleared",
              description: "The code in the editor has just been cleared",
            })
          }}
        >
          Clear
        </Button>
        <div className='flex flex-col h-[90%]'>
          <Textarea onChange={handleInputChange} style={{background: color, color:oppColor}} className='h-[50%]'/>
          <Textarea className='h-[50%] text-lime-500 border-zinc-950' readOnly value={`Input:\n${input.split("").join("") == "" ?'none': input}\nOutput:\n${output ? output : 'Run code to see output'}\nWallTime:\n${wallTime ? wallTime: 'Run code to see wallTime'} \n Time:\n${time ? time: 'Run code to see Time'}`}  style={{background: color}}/>
        </div>
      </div>
    </div>
  );
}