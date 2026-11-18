"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";

/** Client error boundary. Strings are inlined per language because messages are not shipped to the client. */
const copy: Record<string, { title: string; text: string; retry: string; home: string }> = {
  de: { title: "Da ist etwas schiefgelaufen", text: "Beim Laden dieser Seite ist ein Fehler aufgetreten. Bitte versuch es noch einmal.", retry: "Erneut versuchen", home: "Zur Startseite" },
  en: { title: "Something went wrong", text: "An error occurred while loading this page. Please try again.", retry: "Try again", home: "Back to home" },
  ar: { title: "حدث خطأ ما", text: "حدث خطأ أثناء تحميل هذه الصفحة. يُرجى المحاولة مرة أخرى.", retry: "إعادة المحاولة", home: "العودة إلى الصفحة الرئيسية" },
  ku: { title: "Tiştek xelet çû", text: "Di barkirina vê rûpelê de çewtiyek çêbû. Ji kerema xwe dîsa biceribînin.", retry: "Dîsa biceribîne", home: "Vegere rûpela sereke" },
  tr: { title: "Bir şeyler ters gitti", text: "Bu sayfa yüklenirken bir hata oluştu. Lütfen tekrar deneyin.", retry: "Tekrar dene", home: "Ana sayfaya dön" },
};

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const params = useParams<{ locale?: string }>();
  const locale = params.locale && copy[params.locale] ? params.locale : "de";
  const t = copy[locale];
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main className="on-dark hero-backdrop grid min-h-dvh place-items-center px-6 text-center text-soft">
      <div>
        <h1 className="text-3xl text-white sm:text-4xl">{t.title}</h1>
        <p className="mx-auto mt-4 max-w-md text-lg">{t.text}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="bg-brand-gradient min-h-12 rounded-full px-6 font-display font-bold text-navy">{t.retry}</button>
          <a href={`/${locale}`} className="inline-flex min-h-12 items-center rounded-full border border-white/30 px-6 font-display font-bold text-white">{t.home}</a>
        </div>
      </div>
    </main>
  );
}
