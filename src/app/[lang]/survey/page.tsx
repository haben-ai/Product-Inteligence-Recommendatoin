import { notFound } from "next/navigation";
import { isLocale } from "@/content/ui";
import { SurveyFlow } from "@/components/survey/SurveyFlow";

export default async function SurveyPage({ params }: PageProps<"/[lang]/survey">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <SurveyFlow lang={lang} />;
}
