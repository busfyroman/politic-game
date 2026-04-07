export interface MinisterDef {
  id: string;
  name: string;
  photo: string;
  abilityName: string;
  abilitySk: string;
  citizenQuote: string;
  effect?: "investigation_slow" | "global_multiplier" | "click_boost" | "event_delay";
  effectValue?: number;
}

export const MINISTERS: MinisterDef[] = [
  {
    id: "robert-fico",
    name: "Robert Fico",
    photo: "/assets/photos/robert-fico.jpg",
    abilityName: "Atentát Speech",
    abilitySk: "2x imunita na 8 sekúnd",
    citizenQuote: "Pán premiér povedal, že sa nič nestalo. Tak asi OK.",
    effect: "global_multiplier",
    effectValue: 2,
  },
  {
    id: "robert-kalinak",
    name: "Robert Kaliňák",
    photo: "/assets/photos/robert-kalinak.jpg",
    abilityName: "Obrana rozpočtu",
    abilitySk: "Automaticky kradne z rozpočtu obrany",
    citizenQuote: "Vojaci trénujú s drevenými puškami, ale hlavné je že minister má nové auto.",
  },
  {
    id: "matus-sutaj-estok",
    name: "Matúš Šutaj Eštok",
    photo: "/assets/photos/matus-sutaj-estok.jpg",
    abilityName: "Odpočúvanie",
    abilitySk: "Vidí nepriateľov cez steny na 10s",
    citizenQuote: "Sloboda tlače je zaručená. Ak nepíšete o vláde.",
    effect: "event_delay",
    effectValue: 1.5,
  },
  {
    id: "danko-andrej",
    name: "Andrej Danko",
    photo: "/assets/photos/danko-andrej.jpg",
    abilityName: "Ruský kontakt",
    abilitySk: "Zmrazí všetkých nepriateľov na 5s",
    citizenQuote: "SNS = Slúžime Našim Schránkam.",
  },
  {
    id: "rudolf-huliak",
    name: "Rudolf Huliak",
    photo: "/assets/photos/rudolf-huliak.png",
    abilityName: "Medveď útočí",
    abilitySk: "Rozoženie všetkých NAKA agentov",
    citizenQuote: "Na Slovensku je krásne. Hlavne keď tu nebývate.",
  },
];

export const GASPAR = {
  id: "gaspar-tibor",
  name: "Tibor Gašpar",
  photo: "/assets/photos/gaspar-tibor.jpg",
};

export const CITIZEN_QUOTES = [
  "Ďakujeme pánovi premiérovi za nové Porsche. My si kúpime chlieb.",
  "Na diaľnicu z Bratislavy do Košíc pôjdeme až v roku 2187.",
  "Doktor mi povedal, že na operáciu si mám počkať 3 roky. Alebo zaplatiť.",
  "Učiteľka zarábala 700€. Teraz zarábia 650€. Ďakujeme, Kamenický.",
  "Syn chcel ísť na univerzitu. Teraz ide do Írska.",
  "Dôchodca dostal prídavok 1,50€. Minister dostal prídavok 15 000€.",
  "Cena elektriny stúpla. Vraj investícia do budúcnosti. Čia budúcnosť?",
  "Dedko predáva zeleninu pri ceste. Minister kupuje vilu pri mori.",
  "Školy nemajú učebnice. Vláda má nové autá.",
  "Most sa zrútil. Ale asfalt pod ním bol čerstvo urobený. Za dvojnásobnú cenu.",
  "Sestričky štrajkujú za 800€. Poradca ministra zarába 5000€.",
  "Potraviny zdraželi o 30%. Platy o 2%. Asi sme zlí v matike.",
  "Mladý pár si nemôže dovoliť byt. Minister si dovolí tretí.",
  "Slovensko - krajina plná potenciálu. Väčšinu ho ukradli.",
  "Vraj konsolidácia. Konsolidujú si účty v zahraničí.",
];

export const STEAL_QUOTES = [
  "Pre vlasť!", "Nic sa nestalo!", "Kto by to nevzal?",
  "Pre dobro národa!", "Verejný záujem!", "Nikto sa nedozvie!",
  "To je len odmena!", "Slúžim ľuďom!", "Zaslúžená odmena!",
  "Investícia!", "Štátny záujem!", "Toto je normálne!",
];

export const CAUGHT_QUOTES = [
  "Toto je politicky motivované!", "Ja som nevinný! Prezumpcia neviny!",
  "To boli falošné dôkazy!", "Znova tá opozícia!", "Médiá za všetko môžu!",
];

export const VOICE_QUOTES = [
  "Nič sa nestalo, ideme ďalej!", "Všetko je pod kontrolou!",
  "Rozpočet je vyrovnaný. Proste je.", "Ja som tu pre ľudí. Pre seba tiež.",
  "Zákon je na našej strane!", "Kradneme pre vlasť!",
  "Toto nie je korupcia, toto je politika!", "My nekradneme. My prerozdeľujeme!",
  "Ľudia nám veria. A to je ich chyba.", "Opozícia klame! My len trochu kradneme.",
  "Na dôchodok si treba nasporiť. Ja už mám.",
  "Pracujeme pre národ. Národ platí.", "Obedy zadarmo? Nie, tie sú len pre nás.",
  "Slovensko si zaslúži lepšiu budúcnosť. My si zaslúžime vilu.",
];

export const SKILL_QUOTES: Record<string, string[]> = {
  bribe: ["Berieme?", "Tu máte niečo pod stôl.", "Diskrétne.", "Gašpar to zariadil."],
  freeze: ["Stáť! Tlačová konferencia!", "Nič sa nestalo!", "Všetci zamrznite!"],
  immunity: ["Mám imunitu!", "Som nedotknuteľný!", "Podľa ústavy som chránený!"],
  scatter: ["NAKA zrušená!", "Všetci domov!", "Reorganizácia!"],
};

export interface SkillDef {
  id: string;
  name: string;
  icon: string;
  cost: number;
  color: string;
}

export const SKILLS: SkillDef[] = [
  { id: "bribe", name: "Podplatiť (Gašpar)", icon: "💰", cost: 2000, color: "#fbbf24" },
  { id: "freeze", name: "Tlačovka", icon: "🎤", cost: 1000, color: "#60a5fa" },
  { id: "immunity", name: "Imunita", icon: "🛡️", cost: 3000, color: "#34d399" },
  { id: "scatter", name: "Zrušiť NAKA", icon: "📋", cost: 5000, color: "#f472b6" },
];

export const T = 40;

export type EnemyType = "naka" | "police" | "journalist";
export type ItemType = "coin" | "bag" | "gold" | "doc";

export interface LevelItemDef { x: number; y: number; type: ItemType; value: number }
export interface LevelEnemyDef { type: EnemyType; waypoints: { x: number; y: number }[] }
export interface RoomLabel { name: string; x: number; y: number }

export interface LevelDef {
  id: number;
  name: string;
  subtitle: string;
  map: string[];
  items: LevelItemDef[];
  enemies: LevelEnemyDef[];
  rooms: RoomLabel[];
  spawnX: number;
  spawnY: number;
  target: number;
  timeLimit: number;
  floorColor: string;
  wallColor: string;
  wallAccent: string;
}

export type TileType = "wall" | "floor" | "door" | "table";

export const parseTile = (c: string): TileType => {
  if (c === "W") return "wall";
  if (c === "D") return "door";
  if (c === "T") return "table";
  return "floor";
};

const lvl1Map = [
  "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
  "W.....WW....WW............WW.....WW....W",
  "W..T..WW..T.WW......TT....WW.....WW.T..W",
  "W.....WW....WW............WW.....WW....W",
  "W.....DD....DD............DD.....DD....W",
  "WWWWWWWDWWWWWWWD.........WWWDWWWWWWDWWWW",
  "W......................................W",
  "W......................................W",
  "W......................................W",
  "WWWWWWDWWWWWWW....WWWW....WWWWWWWDWWWWWW",
  "W..T..WW.....W....WWWW....W......WW.T..W",
  "W.....DD..T..D....DDDD..T.D......DD....W",
  "W.....WW.....W....WWWW....W......WW....W",
  "WWWWWWWWWWWWWWDDWWWWWWWWDDWWWWWWWWWWWWWW",
  "W......................................W",
  "W..WWWWWW....WWWDDWWW....WWWWWW........W",
  "W..W.T..D....W......W....D..T.W........W",
  "W..W....W....W..TT..W....W....W........W",
  "W..W....W....W......W....W....W........W",
  "W..WWWWWW....WWWWWWWW....WWWWWW........W",
  "W......................................W",
  "W......................................W",
  "WWWWWWWWWWWWDDWWWWWWWWWWWWDDWWWWWWWWWWWW",
  "W........W..........W..........W.......W",
  "W...TT...D..........D..........D..TT...W",
  "W........W.....TT...W....TT....W.......W",
  "W........W..........W..........W.......W",
  "WWWWWDWWWWWWDWWWWWWWWWDWWWWWWWWWWDWWWWWW",
  "W......................................W",
  "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
];

const lvl2Map = [
  "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
  "W..T..WW..T.WW.............WW...T.WW.T.W",
  "W.....WW....WW.............WW.....WW...W",
  "W.....DD....DD.............DD.....DD...W",
  "WWWWWWWWDWWWWWWW.WWWWWWWW....WWWWWWWDWWW",
  "W................D.TTTT.D..............W",
  "W................W......W..............W",
  "W................WWWWWWWW..............W",
  "WWWWWWWWDWWWWWWW.WWWDDWWW....WWWWWWWDWWW",
  "W.....WW....WW.............WW.....WW...W",
  "W..T..DD..T.DD.............DD..T..DD.T.W",
  "W.....WW....WW.............WW.....WW...W",
  "WWWWWWWWWWWWWWWWWWDDWWWWWWWWWWWWWWWWWWWW",
  "W......................................W",
  "W......................................W",
  "W..WWWWWWW....WWWWWWWWWW....WWWWWWW....W",
  "W..W..T..D....D........D....D..T..W....W",
  "W..W.....W....W...TT...W....W.....W....W",
  "W..W.....W....W........W....W.....W....W",
  "W..WWWWWWW....WWWWWWWWWW....WWWWWWW....W",
  "W......................................W",
  "W......................................W",
  "WWWWWWWWWWDDWWWWWWWWWWWWWWWWDDWWWWWWWWWW",
  "W.........W...........W..........W.....W",
  "W...TT....D...........D..........D..T..W",
  "W.........W.....TTTT..W..........W.....W",
  "W.........W...........W..........W.....W",
  "WWWWWWDWWWWWWWWDWWWWWWWWDWWWWWWWWWWDWWWW",
  "W......................................W",
  "W.......T.........T.........T.......T..W",
  "W......................................W",
  "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
];

const lvl3Map = [
  "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
  "W.WT.W..WT.W..WT.W......WT.W..WT.W..WTWW",
  "W.D..D..D..D..D..D......D..D..D..D..D.DW",
  "W.W..W..W..W..W..W......W..W..W..W..W.WW",
  "WWDWWWWWDWWWWWDWWWWWWWWWDWWWWWDWWWWWDWWW",
  "W......................................W",
  "W......................................W",
  "W......................................W",
  "WWDWWWWWDWWWWWDWWWWWWWWWDWWWWWDWWWWWDWWW",
  "W.W..W..W..W..W..W......W..W..W..W..W.WW",
  "W.DT.D..DT.D..DT.D......DT.D..DT.D..DTDW",
  "W.W..W..W..W..W..W......W..W..W..W..W.WW",
  "WWWWWWWWWWWWWWWWWWDDWWWWWWWWWWWWWWWWWWWW",
  "W......................................W",
  "W......................................W",
  "W...WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW....W",
  "W...W.......TTTTTTTTTTTTTTT.......W....W",
  "W...D.............................D....W",
  "W...W.......TTTTTTTTTTTTTTT.......W....W",
  "W...WWWWWWWWWWWWWWDDWWWWWWWWWWWWWWW....W",
  "W......................................W",
  "W......................................W",
  "WWWWWWWWWWDDWWWWWWWWWWWWWWWWDDWWWWWWWWWW",
  "W.........W...............W............W",
  "W...TT....D...............D.....TT.....W",
  "W.........W.....WWWTTWW...W............W",
  "W.........W.....W.....W...W............W",
  "W.........W.....D.....D...W............W",
  "W.........W.....WWWWWWW...W............W",
  "WWWWWWDWWWWWWWWWWWWWWWWWWWWWWWWWWWDWWWWW",
  "W......................................W",
  "W.......T.........T.........T.......T..W",
  "W......................................W",
  "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
];

export const LEVELS: LevelDef[] = [
  {
    id: 1,
    name: "Úrad vlády",
    subtitle: "Začiatky korupcie",
    map: lvl1Map,
    target: 20000,
    timeLimit: 150,
    spawnX: 20 * T + T / 2, spawnY: 14 * T + T / 2,
    floorColor: "#141418", wallColor: "#1e1e2e", wallAccent: "#2a2a3c",
    rooms: [
      { name: "Kancelária A", x: 3 * T, y: 2 * T },
      { name: "Kancelária B", x: 9 * T, y: 2 * T },
      { name: "Zasadačka", x: 16 * T, y: 2 * T },
      { name: "Kancelária premiéra", x: 30 * T, y: 2 * T },
      { name: "Kancelária C", x: 36 * T, y: 2 * T },
      { name: "Archív", x: 3 * T, y: 11 * T },
      { name: "Tajná miestnosť", x: 15 * T, y: 11 * T },
      { name: "Trezor", x: 28 * T, y: 11 * T },
      { name: "Pokladňa", x: 36 * T, y: 11 * T },
      { name: "Výbor A", x: 5 * T, y: 17 * T },
      { name: "Rokovacia sála", x: 15 * T, y: 17 * T },
      { name: "Výbor B", x: 28 * T, y: 17 * T },
      { name: "Lobby", x: 5 * T, y: 25 * T },
      { name: "Bufet", x: 16 * T, y: 25 * T },
      { name: "Poradca", x: 30 * T, y: 25 * T },
    ],
    items: [
      { x: 4 * T, y: 2 * T, type: "doc", value: 2000 },
      { x: 10 * T, y: 2 * T, type: "doc", value: 2000 },
      { x: 16 * T, y: 2 * T, type: "bag", value: 1000 },
      { x: 30 * T, y: 2 * T, type: "gold", value: 5000 },
      { x: 36 * T, y: 2 * T, type: "gold", value: 5000 },
      { x: 6 * T, y: 7 * T, type: "coin", value: 100 },
      { x: 12 * T, y: 7 * T, type: "coin", value: 100 },
      { x: 20 * T, y: 7 * T, type: "coin", value: 100 },
      { x: 28 * T, y: 7 * T, type: "coin", value: 100 },
      { x: 35 * T, y: 7 * T, type: "coin", value: 100 },
      { x: 3 * T, y: 11 * T, type: "bag", value: 1000 },
      { x: 15 * T, y: 11 * T, type: "gold", value: 5000 },
      { x: 28 * T, y: 11 * T, type: "gold", value: 5000 },
      { x: 36 * T, y: 11 * T, type: "bag", value: 1000 },
      { x: 5 * T, y: 17 * T, type: "bag", value: 1000 },
      { x: 16 * T, y: 17 * T, type: "doc", value: 2000 },
      { x: 28 * T, y: 17 * T, type: "bag", value: 1000 },
      { x: 5 * T, y: 25 * T, type: "coin", value: 100 },
      { x: 16 * T, y: 25 * T, type: "bag", value: 1000 },
      { x: 30 * T, y: 25 * T, type: "doc", value: 2000 },
      { x: 10 * T, y: 14 * T, type: "coin", value: 100 },
      { x: 20 * T, y: 14 * T, type: "coin", value: 100 },
      { x: 30 * T, y: 14 * T, type: "coin", value: 100 },
      { x: 10 * T, y: 21 * T, type: "coin", value: 100 },
      { x: 20 * T, y: 21 * T, type: "coin", value: 100 },
      { x: 30 * T, y: 21 * T, type: "coin", value: 100 },
      { x: 10 * T, y: 28 * T, type: "coin", value: 100 },
      { x: 30 * T, y: 28 * T, type: "coin", value: 100 },
    ],
    enemies: [
      { type: "naka", waypoints: [{ x: 6 * T, y: 7 * T }, { x: 35 * T, y: 7 * T }, { x: 35 * T, y: 14 * T }, { x: 6 * T, y: 14 * T }] },
      { type: "naka", waypoints: [{ x: 35 * T, y: 21 * T }, { x: 6 * T, y: 21 * T }, { x: 6 * T, y: 28 * T }, { x: 35 * T, y: 28 * T }] },
      { type: "police", waypoints: [{ x: 20 * T, y: 7 * T }, { x: 20 * T, y: 14 * T }, { x: 20 * T, y: 21 * T }, { x: 20 * T, y: 28 * T }] },
    ],
  },
  {
    id: 2,
    name: "Parlament",
    subtitle: "Organizovaný zločin",
    map: lvl2Map,
    target: 50000,
    timeLimit: 180,
    spawnX: 20 * T + T / 2, spawnY: 14 * T + T / 2,
    floorColor: "#12141a", wallColor: "#1a2030", wallAccent: "#253045",
    rooms: [
      { name: "Kancelária A", x: 3 * T, y: 2 * T },
      { name: "Kancelária B", x: 9 * T, y: 2 * T },
      { name: "Rokovacia sála", x: 20 * T, y: 5 * T },
      { name: "Kancelária C", x: 32 * T, y: 2 * T },
      { name: "Archív", x: 3 * T, y: 10 * T },
      { name: "Tajný archív", x: 9 * T, y: 10 * T },
      { name: "Predsedníctvo", x: 32 * T, y: 10 * T },
      { name: "Výbor A", x: 5 * T, y: 17 * T },
      { name: "Veľká sála", x: 17 * T, y: 17 * T },
      { name: "Výbor B", x: 31 * T, y: 17 * T },
      { name: "Trezor", x: 5 * T, y: 25 * T },
      { name: "Centrálna sála", x: 16 * T, y: 25 * T },
      { name: "Pokladňa", x: 34 * T, y: 25 * T },
    ],
    items: [
      { x: 4 * T, y: 2 * T, type: "gold", value: 5000 },
      { x: 10 * T, y: 2 * T, type: "doc", value: 3000 },
      { x: 32 * T, y: 2 * T, type: "gold", value: 5000 },
      { x: 20 * T, y: 6 * T, type: "bag", value: 1500 },
      { x: 22 * T, y: 6 * T, type: "bag", value: 1500 },
      { x: 4 * T, y: 10 * T, type: "bag", value: 1500 },
      { x: 10 * T, y: 10 * T, type: "gold", value: 5000 },
      { x: 32 * T, y: 10 * T, type: "gold", value: 5000 },
      { x: 6 * T, y: 17 * T, type: "bag", value: 1500 },
      { x: 17 * T, y: 17 * T, type: "gold", value: 5000 },
      { x: 31 * T, y: 17 * T, type: "bag", value: 1500 },
      { x: 5 * T, y: 25 * T, type: "gold", value: 5000 },
      { x: 16 * T, y: 25 * T, type: "doc", value: 3000 },
      { x: 34 * T, y: 25 * T, type: "gold", value: 5000 },
      { x: 8 * T, y: 6 * T, type: "coin", value: 200 },
      { x: 30 * T, y: 6 * T, type: "coin", value: 200 },
      { x: 8 * T, y: 13 * T, type: "coin", value: 200 },
      { x: 20 * T, y: 13 * T, type: "coin", value: 200 },
      { x: 30 * T, y: 13 * T, type: "coin", value: 200 },
      { x: 10 * T, y: 21 * T, type: "coin", value: 200 },
      { x: 20 * T, y: 21 * T, type: "coin", value: 200 },
      { x: 30 * T, y: 21 * T, type: "coin", value: 200 },
      { x: 10 * T, y: 29 * T, type: "coin", value: 200 },
      { x: 20 * T, y: 29 * T, type: "coin", value: 200 },
      { x: 30 * T, y: 29 * T, type: "coin", value: 200 },
    ],
    enemies: [
      { type: "naka", waypoints: [{ x: 5 * T, y: 6 * T }, { x: 35 * T, y: 6 * T }, { x: 35 * T, y: 13 * T }, { x: 5 * T, y: 13 * T }] },
      { type: "naka", waypoints: [{ x: 35 * T, y: 21 * T }, { x: 5 * T, y: 21 * T }, { x: 5 * T, y: 30 * T }, { x: 35 * T, y: 30 * T }] },
      { type: "police", waypoints: [{ x: 20 * T, y: 6 * T }, { x: 20 * T, y: 13 * T }, { x: 20 * T, y: 21 * T }, { x: 20 * T, y: 30 * T }] },
      { type: "journalist", waypoints: [{ x: 5 * T, y: 30 * T }, { x: 35 * T, y: 30 * T }] },
    ],
  },
  {
    id: 3,
    name: "Brusel",
    subtitle: "Európska liga",
    map: lvl3Map,
    target: 100000,
    timeLimit: 210,
    spawnX: 20 * T + T / 2, spawnY: 14 * T + T / 2,
    floorColor: "#101418", wallColor: "#162030", wallAccent: "#1e3050",
    rooms: [
      { name: "Kancelária A", x: 3 * T, y: 1 * T },
      { name: "Kancelária B", x: 9 * T, y: 1 * T },
      { name: "Kancelária C", x: 15 * T, y: 1 * T },
      { name: "Kancelária D", x: 25 * T, y: 1 * T },
      { name: "Kancelária E", x: 31 * T, y: 1 * T },
      { name: "Kancelária F", x: 37 * T, y: 1 * T },
      { name: "Trezor A", x: 3 * T, y: 10 * T },
      { name: "Trezor B", x: 9 * T, y: 10 * T },
      { name: "Trezor C", x: 15 * T, y: 10 * T },
      { name: "Trezor D", x: 25 * T, y: 10 * T },
      { name: "Európsky parlament", x: 18 * T, y: 17 * T },
      { name: "Tajná sála", x: 18 * T, y: 26 * T },
      { name: "Komisia A", x: 5 * T, y: 24 * T },
      { name: "Komisia B", x: 30 * T, y: 24 * T },
    ],
    items: [
      { x: 3 * T, y: 1 * T, type: "gold", value: 8000 },
      { x: 9 * T, y: 1 * T, type: "gold", value: 8000 },
      { x: 15 * T, y: 1 * T, type: "gold", value: 8000 },
      { x: 25 * T, y: 1 * T, type: "gold", value: 8000 },
      { x: 31 * T, y: 1 * T, type: "gold", value: 8000 },
      { x: 37 * T, y: 1 * T, type: "gold", value: 8000 },
      { x: 3 * T, y: 10 * T, type: "doc", value: 5000 },
      { x: 9 * T, y: 10 * T, type: "gold", value: 8000 },
      { x: 15 * T, y: 10 * T, type: "doc", value: 5000 },
      { x: 25 * T, y: 10 * T, type: "gold", value: 8000 },
      { x: 15 * T, y: 17 * T, type: "gold", value: 8000 },
      { x: 25 * T, y: 17 * T, type: "gold", value: 8000 },
      { x: 20 * T, y: 16 * T, type: "doc", value: 5000 },
      { x: 20 * T, y: 18 * T, type: "doc", value: 5000 },
      { x: 19 * T, y: 26 * T, type: "gold", value: 8000 },
      { x: 8 * T, y: 6 * T, type: "coin", value: 300 },
      { x: 15 * T, y: 6 * T, type: "coin", value: 300 },
      { x: 25 * T, y: 6 * T, type: "coin", value: 300 },
      { x: 35 * T, y: 6 * T, type: "coin", value: 300 },
      { x: 5 * T, y: 14 * T, type: "bag", value: 2000 },
      { x: 15 * T, y: 14 * T, type: "coin", value: 300 },
      { x: 25 * T, y: 14 * T, type: "coin", value: 300 },
      { x: 35 * T, y: 14 * T, type: "bag", value: 2000 },
      { x: 10 * T, y: 21 * T, type: "coin", value: 300 },
      { x: 20 * T, y: 21 * T, type: "coin", value: 300 },
      { x: 30 * T, y: 21 * T, type: "coin", value: 300 },
      { x: 10 * T, y: 31 * T, type: "coin", value: 300 },
      { x: 20 * T, y: 31 * T, type: "coin", value: 300 },
      { x: 30 * T, y: 31 * T, type: "coin", value: 300 },
    ],
    enemies: [
      { type: "naka", waypoints: [{ x: 5 * T, y: 6 * T }, { x: 35 * T, y: 6 * T }] },
      { type: "naka", waypoints: [{ x: 35 * T, y: 14 * T }, { x: 5 * T, y: 14 * T }] },
      { type: "naka", waypoints: [{ x: 5 * T, y: 21 * T }, { x: 35 * T, y: 21 * T }, { x: 35 * T, y: 32 * T }, { x: 5 * T, y: 32 * T }] },
      { type: "police", waypoints: [{ x: 20 * T, y: 6 * T }, { x: 20 * T, y: 14 * T }, { x: 20 * T, y: 21 * T }, { x: 20 * T, y: 32 * T }] },
      { type: "journalist", waypoints: [{ x: 5 * T, y: 32 * T }, { x: 35 * T, y: 32 * T }, { x: 35 * T, y: 21 * T }, { x: 5 * T, y: 21 * T }] },
    ],
  },
];

export const ENEMY_STATS: Record<EnemyType, { speed: number; chaseSpeed: number; detectRange: number; color: string; chaseColor: string; label: string }> = {
  naka: { speed: 80, chaseSpeed: 130, detectRange: 130, color: "#1e3a5f", chaseColor: "#dc2626", label: "NAKA" },
  police: { speed: 100, chaseSpeed: 170, detectRange: 90, color: "#1e4a1e", chaseColor: "#ef4444", label: "PZ" },
  journalist: { speed: 60, chaseSpeed: 80, detectRange: 180, color: "#4a1e5f", chaseColor: "#a855f7", label: "PRESS" },
};

export const COMBO_MULTIPLIERS = [1, 1.5, 2, 3, 5, 8, 10];
export const COMBO_TIMEOUT = 2000;
export const COMBO_COLORS = ["#ffffff", "#fde68a", "#fbbf24", "#f59e0b", "#ef4444", "#dc2626", "#9333ea"];

export interface CatchQuestOption {
  text: string;
  icon: string;
  penaltyMult: number;
  wantedChange: number;
  moneyCost?: number;
  scatterEnemies?: boolean;
  immunity?: number;
  freezeEnemies?: number;
  resultText: string;
  resultColor: string;
}

export interface CatchQuest {
  title: string;
  description: string;
  icon: string;
  options: CatchQuestOption[];
}

export const CATCH_QUESTS: CatchQuest[] = [
  {
    title: "NAKA ťa prichytila pri čine!",
    description: "Agent NAKA stojí pred tebou so spisom. Čo urobíš?",
    icon: "🚨",
    options: [
      { text: "Zavolať Gašpara Jr.", icon: "🤙", penaltyMult: 0.5, wantedChange: -1, resultText: "Gašpar Jr. to vybavil... čiastočne", resultColor: "#fbbf24" },
      { text: "Zavolať Gašpara Profíka", icon: "📞", penaltyMult: 0, moneyCost: 2000, wantedChange: -2, resultText: "Tibor to zariadil! Stálo to.", resultColor: "#22c55e" },
      { text: "Hodiť to na Matoviča", icon: "🤷", penaltyMult: 0, wantedChange: 3, resultText: "Matovič? URČITE za to môže!", resultColor: "#a855f7" },
      { text: "POLITICKY MOTIVOVANÉ!", icon: "😤", penaltyMult: 0.3, wantedChange: 1, resultText: "Klasika. Funguje vždy.", resultColor: "#f59e0b" },
    ],
  },
  {
    title: "Policajt ťa zastavil na chodbe!",
    description: "Muž zákona ti blokuje cestu. Tvoj ťah?",
    icon: "🚔",
    options: [
      { text: "Ukázať poslanecký preukaz", icon: "🪪", penaltyMult: 0, wantedChange: 1, resultText: "Preukaz stačil. Tentokrát.", resultColor: "#60a5fa" },
      { text: "Podplatiť na mieste", icon: "💶", penaltyMult: 0, moneyCost: 1500, wantedChange: 0, resultText: "Rýchla investícia do slobody!", resultColor: "#22c55e" },
      { text: "Zavolať Kaliňákovi", icon: "📱", penaltyMult: 0.5, wantedChange: -1, scatterEnemies: true, resultText: "Kaliňák: Všetci domov!", resultColor: "#f472b6" },
      { text: "Dať nohy na plecia!", icon: "🏃", penaltyMult: 0, wantedChange: 2, immunity: 3, resultText: "Bežíš ako nikdy! 3s imunita!", resultColor: "#34d399" },
    ],
  },
  {
    title: "Vyšetrovateľ: Máme na teba spis!",
    description: "Hrubý spis s tvojím menom. Situácia je vážna.",
    icon: "📋",
    options: [
      { text: "Zrušiť celý úrad!", icon: "🏚️", penaltyMult: 1, wantedChange: -3, scatterEnemies: true, resultText: "Úrad zrušený! Všetci domov!", resultColor: "#ef4444" },
      { text: "Dohodnúť sa diskrétne", icon: "🤝", penaltyMult: 0.3, wantedChange: -2, resultText: "Diskrétna dohoda. Ako vždy.", resultColor: "#22c55e" },
      { text: "Obviniť médiá", icon: "📰", penaltyMult: 0, wantedChange: 3, resultText: "Médiá za to môžu! Samozrejme!", resultColor: "#a855f7" },
      { text: "Tváriť sa prekvapene", icon: "🎭", penaltyMult: 0.7, wantedChange: 0, resultText: "Ja? Kradnúť? Nejaký omyl!", resultColor: "#fbbf24" },
    ],
  },
  {
    title: "Chytili ťa s taškou plnou peňazí!",
    description: "Taška praskla a eurá sa sypú na zem. Vysvetli to!",
    icon: "💼",
    options: [
      { text: "To sú moje osobné úspory!", icon: "💰", penaltyMult: 0.5, wantedChange: 1, resultText: "Nikto neverí, ale nemajú dôkaz.", resultColor: "#fbbf24" },
      { text: "Darček na Vianoce!", icon: "🎄", penaltyMult: 0.3, wantedChange: 1, resultText: "V apríli? Nech sa páči...", resultColor: "#22c55e" },
      { text: "To patrí štátu! (vraciam)", icon: "🏛️", penaltyMult: 1.2, wantedChange: -2, resultText: "Vraciaš štátu. Aký gentleman!", resultColor: "#60a5fa" },
      { text: "Ponúknuť im polovicu", icon: "🤝", penaltyMult: 0, moneyCost: 2500, wantedChange: -1, scatterEnemies: true, resultText: "Spravodlivé delenie! Všetci happy!", resultColor: "#34d399" },
    ],
  },
  {
    title: "Kontrola NKÚ — Nesedia ti čísla!",
    description: "Audítor NKÚ sa díva na tvoje výkazy. Čísla nesedia.",
    icon: "📊",
    options: [
      { text: "Sfalšovať výkazy", icon: "✏️", penaltyMult: 0.2, wantedChange: 2, resultText: "Čísla sa teraz \"zhodujú\"!", resultColor: "#f59e0b" },
      { text: "Zničiť dôkazy", icon: "🔥", penaltyMult: 0, wantedChange: 3, freezeEnemies: 3, resultText: "Dôkazy? Aké dôkazy? 🔥", resultColor: "#ef4444" },
      { text: "Chyba v systéme!", icon: "💻", penaltyMult: 0.6, wantedChange: -1, resultText: "IT oddelenie potvrdilo chybu. Asi.", resultColor: "#60a5fa" },
      { text: "Priznať sa (LOL)", icon: "😇", penaltyMult: 1.5, wantedChange: -5, resultText: "Všetci v šoku! Nikto to nečakal!", resultColor: "#a855f7" },
    ],
  },
  {
    title: "Agent NAKA: Rozprávaj, alebo idem vyššie!",
    description: "Agent ťa tlačí k stene. Chce mená. Čo urobíš?",
    icon: "🕵️",
    options: [
      { text: "Zavolať premiérovi", icon: "📞", penaltyMult: 0, wantedChange: 2, immunity: 3, resultText: "Premiér: Nechajte ho! 3s imunita!", resultColor: "#fbbf24" },
      { text: "Dovolenka v Dubaji (pre agenta)", icon: "✈️", penaltyMult: 0, moneyCost: 3000, wantedChange: -3, resultText: "Agent ide na dovolenku!", resultColor: "#22c55e" },
      { text: "Tlačovka o atentáte!", icon: "🎤", penaltyMult: 0.5, wantedChange: 0, freezeEnemies: 4, resultText: "Všetci zmrazení! Sledujú tlačovku!", resultColor: "#60a5fa" },
      { text: "Mlčať a čakať", icon: "🤐", penaltyMult: 0.8, wantedChange: -1, resultText: "Právo nevypovedať. Nudné, funguje.", resultColor: "#9ca3af" },
    ],
  },
  {
    title: "Niekto ťa natočil na mobil!",
    description: "Video ako kradneš sa šíri po internete. Konaj rýchlo!",
    icon: "📱",
    options: [
      { text: "Zhabať ten mobil!", icon: "🤳", penaltyMult: 0.3, wantedChange: 2, resultText: "Mobil zhabaný! Ale videli ďalší...", resultColor: "#ef4444" },
      { text: "Tvrdiť že to je deepfake", icon: "🤖", penaltyMult: 0, wantedChange: 1, resultText: "Deepfake! AI! Dezinformácia!", resultColor: "#a855f7" },
      { text: "Kúpiť to video", icon: "💸", penaltyMult: 0, moneyCost: 2000, wantedChange: -1, resultText: "Video kúpené a zmazané!", resultColor: "#22c55e" },
      { text: "Preobliecť sa", icon: "🥸", penaltyMult: 0, wantedChange: 0, immunity: 2, resultText: "Nové oblečenie! 2s imunita!", resultColor: "#34d399" },
    ],
  },
  {
    title: "Prokurátor: Máme zatykač!",
    description: "Špeciálny prokurátor mává zatykačom. Toto je vážne.",
    icon: "⚖️",
    options: [
      { text: "Odvolať sa na ústavný súd", icon: "🏛️", penaltyMult: 0.4, wantedChange: -1, resultText: "Súd rozhodne... o 2 roky.", resultColor: "#60a5fa" },
      { text: "Zaplatiť kauciu!", icon: "💰", penaltyMult: 0, moneyCost: 4000, wantedChange: 0, resultText: "Kaucia zaplatená! Slobodný!", resultColor: "#22c55e" },
      { text: "Psychická nespôsobilosť", icon: "🤪", penaltyMult: 0, wantedChange: 2, freezeEnemies: 3, resultText: "Znalec potvrdil. Všetci v šoku!", resultColor: "#f472b6" },
      { text: "Helikoptéra na strechu!", icon: "🚁", penaltyMult: 0, moneyCost: 5000, wantedChange: -2, immunity: 4, resultText: "VIP únik! 4s imunity!", resultColor: "#ffd700" },
    ],
  },
];
