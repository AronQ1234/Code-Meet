"use client"

import { useState } from "react"
import HomeCard from "./HomeCard"
import { useRouter } from "next/navigation"
import MeetingDialog from "./MeetingDialog"
import { useUser } from "@clerk/nextjs"
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from "./ui/textarea"
import ReactDatePicker from 'react-datepicker'
import { Input } from "./ui/input"

const MeetingTypeList = () => {
  const router = useRouter()
  const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>()
  const { user } = useUser();
  const client = useStreamVideoClient()
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: '',
    link: ''
  });
  const [callDetailes, setCallDetailes] = useState<Call>();
  const {toast} = useToast();
  const createMeeting =  async () => {
    if (!client || !user) return;
    try {
      if(!values.dateTime) {
        toast({
          title: "Please select a date and a time",
        })
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call('default', id);
      if(!call) throw new Error('Failed to create call')
      const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || 'Instant meeting';
      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description
          }
        }
      })
      setCallDetailes(call);

      if (!values.description) {
        router.push(`/meeting/${call.id}`)
      }
      toast({
        title: "Meeting Created",
      })
      
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to create meeting",
      })
    }
  }

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetailes?.id}`

  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
      <HomeCard 
        img="/icons/add-meeting.svg"
        tittle="New Meeting"
        description="Start an instant meeting"
        handleClick={() => setMeetingState('isInstantMeeting')}
        className="bg-orange-1"
      />
      <HomeCard
        img="/icons/schedule.svg"
        tittle="Schedule Meeting"
        description="Plan your meeting"
        handleClick={() => setMeetingState('isScheduleMeeting')}
        className="bg-blue-1"
      />
      <HomeCard
        img="/icons/recordings.svg"
        tittle="View Recordings"
        description="Check out your recordings"
        handleClick={() => router.push('/recordings')}
        className="bg-purple-1"
      />
      <HomeCard
        img="/icons/join-meeting.svg"
        tittle="Join Meeting"
        description="Via invitation link"
        handleClick={() => setMeetingState('isJoiningMeeting')}
        className="bg-yellow-1"
      />

      {!callDetailes ? (
          <MeetingDialog 
          isOpen = {meetingState === 'isScheduleMeeting'}
          onClose = {() => setMeetingState(undefined)}
          tittle = 'Create Meeting'
          handleClick = {createMeeting}
        >
          <div className="flex flex-col gap-2.5">
            <label className="text-base text-normal leading-[22px] text-sky-2">Add a description</label>
            <Textarea className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0" onChange={
              (e) =>{
                setValues({...values, description: e.target.value})
              }
            }/>
            <div className="flex w-full flex-col gap-2.5">
              <label className="text-base text-normal leading-[22px] text-sky-2">Select date and time</label>
              <ReactDatePicker
                selected={values.dateTime}
                onChange={(date) => setValues({...values, dateTime: date!})}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="time"
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-full rounded bg-dark-3 p-2 focus:outline-none"
              />
            </div>
          </div>
        </MeetingDialog> 
      ) : (
        <MeetingDialog 
          isOpen = {meetingState === 'isScheduleMeeting'}
          onClose = {() => setMeetingState(undefined)}
          tittle = 'Meeting Created'
          className="text-center"
          buttonText="Copy meeting link"
          handleClick = {()=>{
            navigator.clipboard.writeText(meetingLink)
            toast({ title: 'Link copied'})
          }}
          image="/icons/checked.svg"
          buttonIcon="/icona/copy.svg"
        />
      )}

      <MeetingDialog 
        isOpen = {meetingState === 'isInstantMeeting'}
        onClose = {() => setMeetingState(undefined)}
        tittle = 'Start an instant meeting'
        className="text-center"
        buttonText="Start Meeting"
        handleClick = {createMeeting}
      />
      <MeetingDialog 
        isOpen = {meetingState === 'isJoiningMeeting'}
        onClose = {() => setMeetingState(undefined)}
        tittle = 'Type the link here'
        className="text-center"
        buttonText="Join Meeting"
        handleClick={()=> router.push(values.link)}
      >
        <Input 
          placeholder="Meeting link" 
          className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={(e)=>setValues({ ...values, link: e.target.value})}
        />
      </MeetingDialog>
    </section>
  )
}

export default MeetingTypeList