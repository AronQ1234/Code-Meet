import React, { ReactNode } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Button } from './ui/button';
  

interface MeetingDialogProps {
    isOpen: boolean;
    onClose: () => void; 
    tittle: string;
    className?: string;  
    children? :ReactNode;
    buttonText?: string;
    handleClick?: () => void;
    image?: string;
    buttonIcon?: string;
}

const MeetingDialog = ({isOpen, onClose, tittle, className, children, buttonText, handleClick, image, buttonIcon}: MeetingDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='flex w-fu\ max-w-[520px] flex-col gap-6 border-none bg-dark-1 px-6 py-9 text-white'>
            <div className='flex flex-col gap-6'>
                {image && (
                    <div className='flex justify-center'>
                        <Image src={image} alt='image' width={72} height={72} />
                    </div>
                )}
                <h1 className={cn('text-3xl font-bold leading-[42px]',className)}>{tittle}</h1>
                {children}
                <Button className='bg-blue-1 focus-visible:ring-0 focus-visible:ring-offset-0' onClick={handleClick}>
                    {buttonIcon && (
                        <Image src={buttonIcon} alt='button icon' width={13} height={13}/>
                    )} &nbsp;
                    {buttonText || "Schedule meeting"}
                </Button>
            </div>
        </DialogContent>
    </Dialog>

  )
}

export default MeetingDialog