"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";

const RouteMap = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] bg-sand/50 rounded-2xl animate-pulse flex items-center justify-center">
      <p className="text-warm-gray font-light">Karte wird geladen...</p>
    </div>
  ),
});

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const days = [
  {
    date: "29. Mai",
    weekday: "Donnerstag",
    title: "Aufbruch nach Pisa & Toskana",
    activities: [
      "Frühmorgens Abfahrt aus Tübingen (ca. 7–8h Fahrt)",
      "Zwischenstopp am Schiefen Turm von Pisa",
      "Weiterfahrt durch die toskanische Hügellandschaft",
    ],
    accommodation: "Castellare di Tonda",
    accommodationDetail: "Ferienanlage mit Pool, inkl. Frühstück",
    image: "/images/pisa.jpg",
    color: "bg-terracotta",
  },
  {
    date: "30. Mai",
    weekday: "Freitag",
    title: "La Dolce Vita in der Toskana",
    activities: [
      "Freier Tag zum Entspannen",
      "Pool und Natur der Ferienanlage genießen",
      "Optional: Ausflug in die toskanischen Hügel",
    ],
    accommodation: "Castellare di Tonda",
    accommodationDetail: "",
    image: "/images/toskana.jpg",
    color: "bg-olive",
  },
  {
    date: "31. Mai",
    weekday: "Samstag",
    title: "Florenz — Wiege der Renaissance",
    activities: [
      "Fahrt nach Florenz (ca. 1 Stunde)",
      "Hop-on Hop-off Bus durch die Stadt",
      "Ponte Vecchio, Duomo, Piazza della Signoria",
    ],
    accommodation: "Design Loft Belle",
    accommodationDetail: "Privates Apartment in Florenz, Garage verfügbar",
    image: "/images/florenz.jpg",
    color: "bg-gold",
  },
  {
    date: "1. Juni",
    weekday: "Sonntag",
    title: "Siena & Weiter nach Piombino",
    activities: [
      "Optional: Halt in Siena, Piazza del Campo",
      "Fahrt durch die Toskana Richtung Küste",
      "Abend in Piombino am Hafen",
    ],
    accommodation: "Hotel Est",
    accommodationDetail: "Piombino, direkt am Fährhafen",
    image: "/images/siena.jpg",
    color: "bg-terracotta-dark",
  },
  {
    date: "2. Juni",
    weekday: "Montag",
    title: "Überfahrt zur Insel Elba",
    activities: [
      "Fähre Piombino → Elba (ca. 1 Stunde)",
      "Check-in im Strandresort Ortano Mare",
      "Erster Nachmittag am Meer",
    ],
    accommodation: "Ortano Mare Village & Resort",
    accommodationDetail: "All-Inclusive, Strand, Pool, Animation",
    image: "/images/elba.jpg",
    color: "bg-sea",
  },
  {
    date: "3.–4. Juni",
    weekday: "Dienstag & Mittwoch",
    title: "Elba erkunden",
    activities: [
      "Traumstrände: Fetovaia, Cavoli, Marina di Campo",
      "Portoferraio und die Festungen",
      "Seilbahn auf den Monte Capanne (1.019 m)",
    ],
    accommodation: "Ortano Mare Village & Resort",
    accommodationDetail: "All-Inclusive",
    image: "/images/elba.jpg",
    color: "bg-terracotta",
  },
  {
    date: "5. Juni",
    weekday: "Donnerstag",
    title: "Heimreise via Gardasee",
    activities: [
      "Morgenfähre zurück aufs Festland",
      "Fahrt Richtung Norden (ca. 5–6h)",
      "Zwischenstopp Sirmione am Gardasee",
    ],
    accommodation: "Zuhause in Tübingen",
    accommodationDetail: "",
    image: "/images/gardasee.jpg",
    color: "bg-olive",
  },
];

const tips = [
  {
    title: "ZTL Florenz",
    text: "Nicht in die Innenstadt fahren — schwere Strafen drohen. Direkt zum Parkplatz der Unterkunft navigieren.",
  },
  {
    title: "Hop-on Hop-off",
    text: "Perfekt mit Kindern. Florenz ohne endloses Laufen in der Hitze entdecken. Tickets vorab online buchen.",
  },
  {
    title: "Strände auf Elba",
    text: "Fetovaia — Postkarten-Bucht mit türkisem Wasser. Marina di Campo — flach und kinderfreundlich.",
  },
  {
    title: "Monte Capanne",
    text: "Seilbahn auf 1.019 m — grandioser Rundblick über die gesamte Insel und bis nach Korsika.",
  },
  {
    title: "Gardasee-Stopp",
    text: "Sirmione an der Südspitze. Thermalquellen, Altstadt-Gassen, Eis am See — perfekter Zwischenhalt.",
  },
];

const budget = [
  { item: "Castellare di Tonda (2 Nächte)", cost: "250" },
  { item: "Design Loft Florenz (1 Nacht)", cost: "130" },
  { item: "Hotel Est Piombino (1 Nacht)", cost: "80" },
  { item: "Ortano Mare Resort (3 Nächte, AI)", cost: "1.200" },
  { item: "Benzin + Maut (hin & zurück)", cost: "350" },
  { item: "Fähre Piombino ↔ Elba", cost: "150" },
  { item: "Essen & Trinken (außerhalb AI)", cost: "250" },
  { item: "Eintritte & Aktivitäten", cost: "120" },
  { item: "Puffer", cost: "52" },
];

const heroSlides = [
  { src: "/images/hero-florenz-1.jpg", alt: "Ponte Vecchio, Florenz" },
  { src: "/images/hero-elba-1.jpg", alt: "Spiaggia di Sansone, Elba" },
  { src: "/images/hero-florenz-2.jpg", alt: "Panorama von Florenz" },
  { src: "/images/hero-elba-2.jpg", alt: "Portoferraio, Elba" },
  { src: "/images/hero-toskana.jpg", alt: "Toskanische Zypressen" },
];

export default function Home() {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0 });
  const [showBudget, setShowBudget] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const target = new Date("2026-05-29T06:00:00").getTime();
    const update = () => {
      const diff = target - Date.now();
      if (diff <= 0) return setCountdown({ days: 0, hours: 0, mins: 0 });
      setCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        mins: Math.floor((diff / 60000) % 60),
      });
    };
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* ===== HERO ===== */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        <motion.div
          style={{ y: heroY }}
          className="absolute inset-x-0 -top-[200px] bottom-0"
        >
          {heroSlides.map((slide, i) => (
            <Image
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              className={`object-cover transition-opacity duration-[2000ms] ${
                i === currentSlide ? "opacity-100" : "opacity-0"
              }`}
              sizes="100vw"
            />
          ))}
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-dark/50 via-dark/20 to-dark/70" />

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-sm md:text-base tracking-[0.3em] uppercase font-light mb-4"
          >
            Toskana & Insel Elba
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl mb-6 leading-tight"
          >
            Saris Italienreise
            <span className="block text-gold">2026</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-lg md:text-xl font-light mb-12"
          >
            2 Erwachsene & 2 Kinder — 29. Mai bis 5. Juni
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex gap-8 md:gap-12"
          >
            {[
              { val: countdown.days, label: "Tage" },
              { val: countdown.hours, label: "Stunden" },
              { val: countdown.mins, label: "Minuten" },
            ].map(({ val, label }) => (
              <div key={label} className="text-center">
                <span className="font-serif text-4xl md:text-6xl block">
                  {val}
                </span>
                <span className="text-xs tracking-[0.2em] uppercase font-light opacity-70">
                  {label}
                </span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="absolute bottom-10 flex flex-col items-center gap-6"
            aria-hidden
          >
            <div className="flex gap-2">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-500 cursor-pointer ${
                    i === currentSlide
                      ? "bg-white w-6"
                      : "bg-white/40 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2"
            >
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ===== ROUTE MAP ===== */}
      <section className="py-20 md:py-28 px-6 md:px-12 lg:px-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-6xl mx-auto"
        >
          <motion.p
            variants={fadeInUp}
            className="text-terracotta tracking-[0.2em] uppercase text-sm font-light mb-3"
          >
            Die Route
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="font-serif text-3xl md:text-5xl mb-4"
          >
            Von Tübingen bis zur Insel Elba
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-warm-gray max-w-xl mb-12 font-light"
          >
            Über 1.500 km durch die schönsten Landschaften Italiens — mit Halt
            in Pisa, zwei Nächten in der Toskana, einem Tag in Florenz und drei
            Tagen auf Elba.
          </motion.p>
          <motion.div
            variants={fadeInUp}
            className="h-[400px] md:h-[550px] rounded-2xl overflow-hidden shadow-xl"
          >
            <RouteMap />
          </motion.div>
        </motion.div>
      </section>

      {/* ===== TIMELINE ===== */}
      <section className="py-20 md:py-28 px-6 md:px-12 lg:px-20 bg-sand/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="mb-16"
          >
            <motion.p
              variants={fadeInUp}
              className="text-terracotta tracking-[0.2em] uppercase text-sm font-light mb-3"
            >
              Tag für Tag
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="font-serif text-3xl md:text-5xl"
            >
              Die Reise im Detail
            </motion.h2>
          </motion.div>

          <div className="space-y-8 md:space-y-12">
            {days.map((day, i) => (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: "easeOut" as const }}
              >
                <div
                  className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-500 ${
                    i % 2 === 0 ? "md:mr-12" : "md:ml-12"
                  }`}
                >
                  <div className="md:flex">
                    <div className="relative h-52 md:h-auto md:w-72 flex-shrink-0 overflow-hidden">
                      <div
                        className={`absolute inset-0 ${day.color} z-[1]`}
                      />
                      <Image
                        src={day.image}
                        alt={day.title}
                        fill
                        className="object-cover z-[2] mix-blend-overlay opacity-50"
                        sizes="(max-width: 768px) 100vw, 288px"
                      />
                      <div className="absolute inset-0 z-[3] flex flex-col items-center justify-center text-white">
                        <span className="text-xs tracking-[0.2em] uppercase font-light opacity-80">
                          {day.weekday}
                        </span>
                        <span className="font-serif text-3xl mt-1">
                          {day.date}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 md:p-8 flex-1">
                      <h3 className="font-serif text-xl md:text-2xl text-dark mb-4">
                        {day.title}
                      </h3>
                      <ul className="space-y-2 mb-6">
                        {day.activities.map((act) => (
                          <li
                            key={act}
                            className="flex items-start gap-3 text-warm-gray font-light"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-terracotta mt-2 flex-shrink-0" />
                            {act}
                          </li>
                        ))}
                      </ul>
                      <div
                        className={`flex items-center gap-3 text-sm rounded-lg px-4 py-2.5 ${
                          day.accommodation === "Zuhause in Tübingen"
                            ? "text-dark bg-gold/10"
                            : "text-olive bg-olive/5"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className="w-4 h-4 flex-shrink-0"
                        >
                          {day.accommodation === "Zuhause in Tübingen" ? (
                            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M9 22V12h6v10" />
                          ) : (
                            <path d="M3 21V7a2 2 0 012-2h14a2 2 0 012 2v14M3 21h18M9 21v-4a2 2 0 012-2h2a2 2 0 012 2v4M3 10h18" />
                          )}
                        </svg>
                        <span className="font-medium">
                          {day.accommodation}
                        </span>
                        {day.accommodationDetail && (
                          <span className="text-warm-gray hidden sm:inline">
                            — {day.accommodationDetail}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TIPS ===== */}
      <section className="py-20 md:py-28 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="mb-12"
          >
            <motion.p
              variants={fadeInUp}
              className="text-terracotta tracking-[0.2em] uppercase text-sm font-light mb-3"
            >
              Gut zu wissen
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="font-serif text-3xl md:text-5xl"
            >
              Tipps & Empfehlungen
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tips.map((tip, i) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-2 h-8 rounded-full bg-terracotta mb-4" />
                <h3 className="font-serif text-lg mb-2">{tip.title}</h3>
                <p className="text-warm-gray font-light text-sm leading-relaxed">
                  {tip.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-12 px-6 bg-dark text-white/60">
        <div className="max-w-6xl mx-auto text-center">
          <p className="font-serif text-2xl text-white/90 mb-2">
            Buon Viaggio!
          </p>
          <p className="text-sm font-light mb-8">
            Familie Sari — Tübingen → Italien 2026
          </p>
          <button
            onClick={() => setShowBudget(true)}
            className="text-xs tracking-[0.15em] uppercase text-white/30 hover:text-white/60 transition-colors duration-300 border border-white/10 hover:border-white/30 rounded-full px-5 py-2 cursor-pointer"
          >
            Reisebudget anzeigen
          </button>
        </div>
      </footer>

      {/* ===== BUDGET MODAL ===== */}
      <AnimatePresence>
        {showBudget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-dark/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowBudget(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-cream rounded-2xl p-6 md:p-8 max-w-lg w-full max-h-[80vh] overflow-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-2xl text-dark">
                  Kostenzusammenstellung
                </h3>
                <button
                  onClick={() => setShowBudget(false)}
                  className="w-8 h-8 rounded-full bg-sand flex items-center justify-center text-warm-gray hover:text-dark transition-colors cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-4 h-4"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-0">
                {budget.map((b) => (
                  <div
                    key={b.item}
                    className="flex justify-between items-start gap-4 py-3 border-b border-sand/80 last:border-0"
                  >
                    <span className="text-sm text-warm-gray font-light">
                      {b.item}
                    </span>
                    <span className="text-sm font-medium text-dark whitespace-nowrap">
                      {b.cost} &euro;
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t-2 border-terracotta/30 flex justify-between items-center">
                <span className="font-serif text-lg text-dark">Gesamt</span>
                <span className="font-serif text-2xl text-terracotta">
                  ca. 2.582 &euro;
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
