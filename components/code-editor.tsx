"use client"
import  getCodeOutput  from '@/helper/getCodeOutput';
import { useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import LanguagePicker from '@/components/languagePicker';
import ThemePicker from '@/components/themePicker';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Editor from '@monaco-editor/react';
import useSocket from '@/hooks/useSocket';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation'
import MeetingDialog from './MeetingDialog';
import { Input } from './ui/input';

interface CodeEditorProps {
  collab: boolean;
}

//TODO: copy link button create meeting button 

export default function CodeEditor({collab}:CodeEditorProps) {
  const [code, setCode] = useState<string>("//this is the editor");
  const [input, setInput] = useState<string>("");
  const [lang, setLang] = useState<string>("javascript");
  const [theme, setTheme] = useState("light");
  const [output, setOutput] = useState<string>()
  const [time, setTime] = useState<number>()
  const [wallTime, setWallTime] = useState<number>()
  const [color, setColor] = useState<string>('#FFFFFF')
  const oppColor = color === '#FFFFFF' ? '#1E1E1E' : '#FFFFFF';
  const { toast } = useToast()
  const router = useRouter();
  const pathname = usePathname();
  const socket = useSocket(collab);
  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}${pathname}`;
  const [isJoineing, setIsJoineing] = useState<boolean>(false)
  const [values, setValues] = useState({
    link: ''
  });

  useEffect(() => {
    console.log(`Theme changed to: ${theme}`);
    console.log(`Color changed to: ${color}`);
  }, [theme, color]);

  if(collab){
    console.log(collab)
    useEffect(() => {
      socket?.on('code-change', (newCode) => {
        setCode(newCode);
      });
  
      return () => {
        socket?.off('code-change');
      };
    }, [socket]);
    useEffect(() => {
      socket?.on('lang-change', (currentLang) => {
        setLang(currentLang);
      });
  
      return () => {
        socket?.off('lang-change');
      };
    }, [socket]);
  }

  function handleInputChange(e:any){
    setInput(e.target.value)
  }
  function handleEditorChange(value:any, event:any) {
    const newCode = value;
    setCode(newCode)
    if(collab){
      socket?.emit('code-change', newCode);
    }
    
  }
  function handleLanguageChange(language: string) {
    setLang(language);
    if(collab){
      socket?.emit('lang-change', language);
    }
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
  function handleCopyText(){
    navigator.clipboard.writeText(meetingLink);
    toast({ title: 'Link Copied' });
  }
  function handleCreateEditor(){
    const id = crypto.randomUUID();
    router.push(`/code-editor/${id}`)
    toast({
      title: "Collaborative Editor Created",
      description: "Editor that can be added it by multy users created!"
    })
  }
  function handleLeaveEditor(){
    router.push(`/code-editor/`)
    toast({
      title: "Disconected sucessfuly from the editor"
    })
  }
  return (
    <div className='flex flex-row p-7'>
      <div className='w-[70%] flex flex-col' style={{background: color, color:oppColor}}>
        <div  style={{background: color}}>
          <LanguagePicker style={{background: color, color:oppColor}} onLanguageChange={handleLanguageChange} color={color} langChange={collab? lang : ""}/>
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
          className='bg-orange-1 hover:bg-slate-600'
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
        {collab? (
          <>
            <Button
              className='bg-purple-1 hover:bg-slate-600'
              variant={"secondary"}
              onClick={handleCopyText}
            >
              <abbr title='copies the link for a collaborative code editor(editor with multiply users) meeting'>Copy link</abbr>
            </Button>
            <Button
              className='bg-red-600 hover:bg-slate-600'
              variant={"link"}
              onClick={handleLeaveEditor}
            ><abbr title='Leaves collaborative code editor(editor with multiply users)'>Leave</abbr> </Button>
          </>
        ) : (
          <>
            <Button
              className='bg-purple-1 hover:bg-slate-600'
              variant={"link"}
              onClick={handleCreateEditor}
            >
              <abbr title='Creates collaborative code editor(editor with multiply users)'>Create</abbr>
            </Button>
            <Button
              className=' bg-sky-500 hover:bg-slate-600'
              variant={"link"}
              onClick={()=>{setIsJoineing(true)}}
            >
              <abbr title='Joins collaborative code editor(editor with multiply users)'>Join</abbr> 
            </Button>
            <MeetingDialog 
              isOpen = {isJoineing}
              onClose = {() => setIsJoineing(false)}
              tittle = 'Type the link here'
              className="text-center"
              buttonText="Join Collab-edit"
              handleClick={()=> router.push(values.link)}
            >
              <Input 
                placeholder="Collaborative editor link" 
                className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                onChange={(e)=>setValues({link: e.target.value})}
              />
            </MeetingDialog>
        </>
        )}
        
        

        <div className='flex flex-col h-[90%]'>
          <Textarea onChange={handleInputChange} style={{background: color, color:oppColor}} className='h-[50%]'/>
          <Textarea className='h-[50%] text-lime-500 border-zinc-950' readOnly value={`Input:\n${input.split("").join("") == "" ?'none': input}\nOutput:\n${output ? output : 'Run code to see output'}\nWallTime:\n${wallTime ? wallTime: 'Run code to see wallTime'} \n Time:\n${time ? time: 'Run code to see Time'}`}  style={{background: color}}/>
        </div>
      </div>
    </div>
  );
}