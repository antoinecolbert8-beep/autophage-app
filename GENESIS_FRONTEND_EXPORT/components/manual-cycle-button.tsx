"use client";

import { useFormStatus } from "react-dom";
import { triggerManualCycle } from "@/actions/actions";
import { useState } from "react";
import { Zap, RotateCcw, CheckCircle, AlertTriangle } from "lucide-react";

export function ForceCycleButton() {
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    async function handleSubmit(formData: FormData) {
        setMessage(null);
        try {
            const result = await triggerManualCycle();
            if (result.success) {
                setMessage({ text: "Cycle Executed Successfully! Ad Created.", type: 'success' });
            } else {
                setMessage({ text: result.error || result.message || "Operation failed", type: 'error' });
            }
        } catch (e) {
            setMessage({ text: "System Error during invocation", type: 'error' });
        }
    }

    return (
        <div className="w-full">
            <form action={handleSubmit}>
                <SubmitButton />
            </form>
            {message && (
                <div className={`mt-4 p-3 rounded text-sm flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-800' : 'bg-red-900/50 text-red-400 border border-red-800'}`}>
                    {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    {message.text}
                </div>
            )}
        </div>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
            {pending ? (
                <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    EXECUTING...
                </>
            ) : (
                <>
                    <Zap className="w-4 h-4" />
                    TRIGGER FORCE CYCLE
                </>
            )}
        </button>
    );
}

