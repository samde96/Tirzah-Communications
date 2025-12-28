'use client'

import { useState } from 'react'
import { PopupModal } from 'react-calendly'
import { Button } from '@/components/ui/button'

interface CalendlyButtonProps {
    buttonText?: string
    buttonClassName?: string
    buttonStyle?: React.CSSProperties
    buttonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    calendlyUrl?: string
}

export default function CalendlyButton({
    buttonText = 'Grab a coffee',
    buttonClassName = '',
    buttonStyle,
    buttonVariant,
    calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/your-calendly-link'
}: CalendlyButtonProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Button
                style={buttonStyle}
                variant={buttonVariant}
                className={buttonClassName}
                onClick={() => setIsOpen(true)}
            >
                {buttonText}
            </Button>

            <PopupModal
                url={calendlyUrl}
                onModalClose={() => setIsOpen(false)}
                open={isOpen}
                rootElement={document.getElementById('__next') || document.body}
            />
        </>
    )
}
