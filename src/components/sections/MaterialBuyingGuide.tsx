import Link from "next/link";

const guides = {
  copper: {
    heading: "מה כדאי לדעת לפני שמוכרים נחושת?",
    questions: [
      ["מה ההבדל בין נחושת נקייה לכבלים או לחומר מעורב?", "משקל של כבל כולל גם את הבידוד, ומשקל של ציוד עשוי לכלול פלסטיק ומתכות נוספות. לכן הצעת מחיר לנחושת נקייה אינה זהה להצעה לכבלים או לציוד שלם. בתמונות כדאי להראות גם את החומר וגם את מצבו, ולציין אם מדובר בצינורות, בכבלים, בשבבים או בחלקים מעורבים."],
      ["איך מקבלים הצעת מחיר לנחושת לקילו?", "מציינים את סוג הנחושת, הכמות המשוערת, מיקום החומר והאם נדרש איסוף או פירוק. מחירון כללי הוא נקודת התייחסות בלבד: יש לאשר הצעה עדכנית לחומר המסוים ולברר אם המשקל הוא של החומר כולו או של המתכת לאחר מיון."],
      ["יש גם ברזל או אלומיניום באותו פינוי?", "ציינו בנפרד אילו חומרים נוספים קיימים ומה הכמות המשוערת מכל סוג. תמונות של כל קבוצת חומרים יעזרו להעריך את הפינוי בלי להניח שלכל התכולה אותו ערך לקילו."],
    ],
    related: [["/materials/cable", "קניית כבלי חשמל"], ["/materials/iron", "קניית ברזל"], ["/materials/brass", "קניית פליז"]],
  },
  iron: {
    heading: "איך מתכוננים למכירת ברזל ולפינוי?",
    questions: [
      ["אילו פרטים חשובים בפינוי ברזל מאתר או ממפעל?", "תארו את סוג הברזל: שאריות ייצור, פרופילים, קונסטרוקציה או ציוד. הוסיפו כמות משוערת, מידות של חלקים גדולים, מיקום ודרכי גישה. אם הברזל עדיין מחובר למבנה או למכונה, ציינו זאת מראש כדי לברר בנפרד את היקף הפירוק והפינוי."],
      ["איך נקבעת הצעת מחיר לברזל?", "ההערכה תלויה בסוג החומר, במשקל ובמצבו, לצד מיון, העמסה, פירוק והובלה ככל שנדרשים. ברזל מעורב בבטון או בחומרים אחרים אינו שקול בהכרח לברזל נקי. לפני הסכמה מבררים איך מתבצעת השקילה ומה כלול בהצעה."],
      ["אפשר לפנות גם לגבי כמות קטנה?", "גם אדם פרטי יכול לשלוח תמונות ולברר אפשרות רכישה. יש לציין את הכמות ואת היישוב כדי לבדוק התאמה ותנאי איסוף מראש. תיאום הפינוי נעשה לפי החומר והעבודה הנדרשת בכל מקרה."],
    ],
    related: [["/materials/copper", "קניית נחושת"], ["/materials/aluminum", "קניית אלומיניום"], ["/materials/motor", "קניית מנועי חשמל"]],
  },
};

export function MaterialBuyingGuide({ slug }: { slug: string }) {
  const guide = guides[slug as keyof typeof guides];
  if (!guide) return null;
  return (
    <section className="bg-terex-gray py-14 md:py-20" aria-labelledby="material-guide-heading">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        <h2 id="material-guide-heading" className="text-2xl font-black text-terex-navy md:text-3xl">{guide.heading}</h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {guide.questions.map(([question, answer]) => (
            <div key={question} className="bg-white p-7">
              <h3 className="text-lg font-bold text-terex-navy">{question}</h3>
              <p className="mt-4 leading-relaxed text-terex-muted">{answer}</p>
            </div>
          ))}
        </div>
        <nav aria-label="מתכות נוספות לפינוי" className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
          {guide.related.map(([href, label]) => <Link key={href} href={href} className="font-bold text-terex-blue underline underline-offset-4">{label}</Link>)}
        </nav>
      </div>
    </section>
  );
}
