import { useRef, useState } from "react";

interface SpeechRecognitionResultLike {
  results: { [index: number]: { [index: number]: { transcript: string } } };
}

interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionResultLike) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/** Browser speech-to-text, shared by the AI input flows. Calls `onResult`
 *  with each transcript as it comes in - the caller decides how to fold it
 *  into whatever text it's building up. */
export function useSpeechToText(onResult: (transcript: string) => void) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recogRef = useRef<SpeechRecognitionLike | null>(null);

  const toggle = () => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      setError("Voice input isn't available in this browser.");
      return;
    }
    setError(null);
    if (listening) {
      recogRef.current?.stop();
      return;
    }
    const recognition = new Ctor();
    recognition.lang = "en-GB";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      onResult(event.results[0][0].transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recogRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  return { listening, error, toggle };
}
