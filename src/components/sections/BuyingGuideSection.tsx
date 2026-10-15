import Link from "next/link";

export function BuyingGuideSection() {
  return (
    <section id="buying-guide" className="bg-terex-gray py-16 md:py-24" aria-labelledby="buying-guide-heading">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        <span className="terex-section-label">לפני שמוכרים</span>
        <h2 id="buying-guide-heading" className="mt-4 text-3xl font-black text-terex-navy md:text-4xl">
          קניית מתכות מפרטיים, קבלנים ומפעלים
        </h2>
        <p className="mt-6 max-w-3xl text-base leading-relaxed text-terex-muted md:text-lg">
          יש לכם מתכת מפירוק, שאריות ייצור או ציוד שיצא משימוש? כדי לבדוק אפשרות רכישה ופינוי,
          מתחילים בזיהוי החומר, הכמות ומיקום האיסוף. הפרטים האלה עוזרים להבין מה נדרש ולהכין הצעה שמתאימה למתכת שלכם.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="bg-white p-7 md:p-9">
            <h3 className="text-xl font-bold text-terex-navy">מכירת מתכות מאדם פרטי</h3>
            <p className="mt-4 leading-relaxed text-terex-muted">
              שלחו תמונות של החומר, ציינו מהיכן הוא מגיע ומה הכמות המשוערת. אם מדובר בפריט בודד או בכמות קטנה,
              כדאי לבדוק מראש אם ניתן לתאם איסוף ומהם התנאים. אין צורך לדעת את המשקל המדויק כדי להתחיל בבירור.
            </p>
          </div>
          <div className="bg-white p-7 md:p-9">
            <h3 className="text-xl font-bold text-terex-navy">פינוי מתכות ממפעל או מאתר בנייה</h3>
            <p className="mt-4 leading-relaxed text-terex-muted">
              בפינוי עסקי חשוב לצרף רשימת חומרים וציוד, היקף משוער, לוח זמנים ותמונות של דרכי הגישה.
              ציינו אם נדרש פירוק, אם קיימת גישה לרכב איסוף ואם החומרים ממוינים או מעורבים.
              כך אפשר לתאם את היקף העבודה לפני הגעה לשטח.
            </p>
          </div>
        </div>
        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <div>
            <h3 className="text-2xl font-bold text-terex-navy">מה משפיע על הצעת המחיר?</h3>
            <p className="mt-4 leading-relaxed text-terex-muted">
              סוג המתכת, הניקיון שלה, המשקל והצורך במיון או בפירוק משפיעים על ההערכה.
              גם מיקום החומר ודרך האיסוף חשובים. מחיר לקילו של חומר נקי אינו בהכרח המחיר של ציוד שלם או של תערובת מתכות.
              לפני שסוגרים, מבררים מה כוללת ההצעה ואיך ייקבע המשקל לתשלום.
            </p>
            <p className="mt-4 leading-relaxed text-terex-muted">
              אפשר לקרוא עוד על <Link href="/materials/copper" className="font-bold text-terex-blue underline underline-offset-4">קניית נחושת</Link>,{" "}
              <Link href="/materials/iron" className="font-bold text-terex-blue underline underline-offset-4">קניית ברזל</Link> ו־{" "}
              <Link href="/materials/aluminum" className="font-bold text-terex-blue underline underline-offset-4">קניית אלומיניום</Link>.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-terex-navy">מה לשלוח כדי לקבל הצעה?</h3>
            <ul className="mt-4 list-disc space-y-3 pr-5 leading-relaxed text-terex-muted">
              <li>סוג החומר ותמונות ברורות של המתכת או הציוד.</li>
              <li>כמות משוערת, משקל אם ידוע, ומידות של פריטים גדולים.</li>
              <li>יישוב האיסוף, קומה, גישה לרכב והאם נדרש פירוק.</li>
              <li>מועד רצוי לפינוי ופרטי קשר לתיאום.</li>
            </ul>
            <Link href="#contact" className="mt-6 inline-block font-bold text-terex-blue underline underline-offset-4">
              לבירור רכישה ואיסוף — השאירו פרטים
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
