"use client";

import { useFormStatus } from "react-dom";
import { Loader2, ArrowRight } from "lucide-react";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {pending ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <>
          Create Business Account <ArrowRight className="h-5 w-5" />
        </>
      )}
    </button>
  );
}