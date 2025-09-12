'use client';
import { useUI } from '@/context/UIContext';
import { useEffect } from 'react';

export default function Popup() {
    const { message, setMessage } = useUI();

    useEffect(() => {
        if (!message) return;

        const timer = setTimeout(() => {
            setMessage('');
        }, 5000);

        return () => clearTimeout(timer);
    }, [message, setMessage]);

    if (!message) return null;

    return (
        <div className=" fixed top-4 right-4 flex flex-col gap-3 z-999 max-w-[400px]">
            <div className="popup-message-error">{message}</div>
        </div>
    );
}
