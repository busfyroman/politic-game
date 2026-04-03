import Link from "next/link";
import Image from "next/image";

const CHARACTERS = [
  { name: "Robert Fico", role: "Predseda vlády", photo: "/assets/photos/robert-fico.jpg", ability: "Atentát Speech" },
  { name: "Robert Kaliňák", role: "Minister obrany", photo: "/assets/photos/robert-kalinak.jpg", ability: "Obrana rozpočtu" },
  { name: "Matúš Šutaj Eštok", role: "Minister vnútra", photo: "/assets/photos/matus-sutaj-estok.jpg", ability: "Odpočúvanie" },
  { name: "Andrej Danko", role: "Predseda NR SR", photo: "/assets/photos/danko-andrej.jpg", ability: "Ruský kontakt" },
  { name: "Rudolf Huliak", role: "Minister ŽP", photo: "/assets/photos/rudolf-huliak.png", ability: "Medveď útočí" },
];

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative flex flex-col items-center justify-center min-h-screen px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#0a0a1a]" />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffd700' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />

        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <h1
            className="text-5xl md:text-7xl font-black tracking-tight mb-4"
            style={{
              background: "linear-gradient(135deg, #ffd700 0%, #ffaa00 50%, #ff8800 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              textShadow: "0 0 40px rgba(255,215,0,0.3)",
            }}
          >
            KRADNI A VLÁDNI
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-2">
            Satirická akčná hra o slovenských politikoch
          </p>
          <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
            Vyber si ministra, kradni peniaze občanom, unikaj NAKA a uplatcaj cez Gašpara!
          </p>

          <Link
            href="/game"
            className="inline-block px-12 py-4 text-xl font-black rounded-2xl transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #ffd700, #ffaa00)",
              color: "#000",
              boxShadow: "0 0 30px rgba(255,215,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)",
            }}
          >
            HRAŤ TERAZ
          </Link>
        </div>
      </section>

      <section className="py-20 px-4 bg-[#0f0f23]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-yellow-400">
            Vyber si ministra
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {CHARACTERS.map((char) => (
              <div key={char.name} className="flex flex-col items-center p-4 rounded-xl bg-white/5 border border-white/10 hover:border-yellow-600/40 transition-all">
                <Image
                  src={char.photo}
                  alt={char.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full object-cover ring-2 ring-yellow-500/30 mb-3"
                />
                <h3 className="text-sm font-bold text-white/90">{char.name}</h3>
                <p className="text-[10px] text-white/40 mt-1">{char.role}</p>
                <p className="text-[10px] text-yellow-400/60 mt-1">{char.ability}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[#1a1a2e]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-yellow-400">Ako hrať</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "💰", title: "Kradni", desc: "Zbieraj peniaze z kancelárií a chodbieb. Combo systém zvyšuje zisk!" },
              { icon: "🚔", title: "Unikaj", desc: "NAKA a polícia ťa prenasledujú. Použi schopnosti na útek!" },
              { icon: "💰", title: "Uplácaj", desc: "Zavolaj Gašparovi a podplať nepriateľov. Ale stojí to peniaze!" },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-xl bg-white/5 border border-white/10">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-bold text-white/90 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 bg-[#0a0a14] text-center text-gray-600 text-sm">
        <p>Satirická hra. Všetky postavy sú fiktívne (ale inšpirované realitou).</p>
        <p className="mt-1 text-gray-700">KRADNI A VLÁDNI &copy; 2026</p>
      </footer>
    </div>
  );
};

export default HomePage;
