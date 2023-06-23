import { useCallback, useEffect, useRef } from "react"

export default function useTimeout(callback: () => void, delay: number) {
    const callbackRef = useRef(callback) // riferimento alla funzione di callback da eseguire dopo un certo delay
    const timeoutRef = useRef<ReturnType<typeof setInterval>>() // riferimento alla funzione di timeout principale

    // viene assegnata al relativo riferimento la funzione di callback
    useEffect(() => {
        callbackRef.current = callback
    }, [callback])

    // funzione che associa "timeoutRef" al timeout principale
    const set = useCallback(() => {
        timeoutRef.current = setTimeout(() => callbackRef.current(), delay)
    }, [delay])

    // funzione che elimina il timeout associato a "timeoutRef"
    const clear = useCallback(() => {
        timeoutRef.current && clearTimeout(timeoutRef.current)
    }, [])

    // chiama la funzione che imposta il timeout principale
    useEffect(() => {
        set()
        return clear
    }, [delay, set, clear])

    // funzione che resetta il timeout principale
    const reset = useCallback(() => {
        clear()
        set()
    }, [clear, set])

    return { reset, clear }
}