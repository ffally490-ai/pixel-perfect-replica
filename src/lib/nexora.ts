export const PHONE = "+243 996 845 079";
export const EMAIL = "arsenenzanzu19@icloud.com";
export const ADDRESS = "Avenue de la Paix, n°12, Commune de Bulengera, Butembo, Nord-Kivu, RDC";
export const WA_LINK = `https://wa.me/243996845079?text=${encodeURIComponent(
  "Bonjour Nexora, je souhaite un abonnement internet",
)}`;

export const NAV = [
  { href: "#accueil", label: "Accueil" },
  { href: "#reseau", label: "Réseau" },
  { href: "#apropos", label: "À propos" },
  { href: "#services", label: "Services" },
  { href: "#offres", label: "Offres" },
  { href: "#couverture", label: "Couverture" },
  { href: "#support", label: "Support" },
  { href: "#espace-client", label: "Espace client" },
  { href: "#contact", label: "Contact" },
];

export type DeviceKind = "cambium" | "nanostation" | "litebeam" | "router" | "starlink";

export const DEVICES: Record<DeviceKind, { name: string; role: string; range: string; text: string }> = {
  cambium: {
    name: "Cambium ePMP",
    role: "Point d'accès / émetteur",
    range: "Jusqu'à 5 km par secteur",
    text: "Antenne secteur installée en haut de nos pylônes. Elle diffuse la connexion vers des dizaines de clients à la fois.",
  },
  nanostation: {
    name: "Ubiquiti NanoStation",
    role: "Récepteur client",
    range: "1 à 3 km",
    text: "Petit récepteur fixé sur votre toit, orienté vers notre pylône. Il capte le signal et l'amène chez vous par câble.",
  },
  litebeam: {
    name: "Ubiquiti LiteBeam",
    role: "Liaison longue distance",
    range: "Jusqu'à 15 km",
    text: "Antenne parabolique très directive, utilisée pour relier deux pylônes ou un client éloigné avec un débit stable.",
  },
  router: {
    name: "Routeur Wi-Fi client",
    role: "Distribution dans le bâtiment",
    range: "30 à 50 m en intérieur",
    text: "Il transforme le signal reçu en Wi-Fi pour vos téléphones, ordinateurs et télévisions, avec mot de passe sécurisé.",
  },
  starlink: {
    name: "Site central Starlink",
    role: "Source de la connexion",
    range: "Liaison satellite",
    text: "Notre data center reçoit la connexion par satellite et fibre, puis la redistribue vers tous nos pylônes de Butembo.",
  },
};

export const COMMUNES = [
  { name: "Bulengera", quartiers: ["Kalemire", "Matanda", "Rughenda", "Vungi", "Bwinongo"] },
  { name: "Kimemi", quartiers: ["Kitulu", "Vutsundo", "Mukuna", "Lumumba", "Kambali"] },
  { name: "Mususa", quartiers: ["Kimbulu", "Mutiri", "Vulindi", "Mihake", "Kyaghala"] },
  { name: "Vulamba", quartiers: ["Kalimbya", "Bwinyole", "Vutetse", "Mukuna-Haut", "Wanamahika"] },
];
