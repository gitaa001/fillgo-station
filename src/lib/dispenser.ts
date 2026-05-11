export type Dispenser = {
  id: string;
  name: string;
  lng: number;
  lat: number;
  status: string;
  location: string;
  isLive?: boolean;
};

export const dispensers: Dispenser[] = [
  {
    id: "DS001",

    name: "Dispenser Al Wasath",

    lng: 107.768917,
    lat: -6.928188,

    status: "available",

    location:
      "Gedung A ITB Jatinangor",

    isLive: false,
  },

  {
    id: "DS002",

    name: "Dispenser GKU 3",

    lng: 107.770097,
    lat: -6.927159,

    status: "low",

    location:
      "GKU 3 ITB Jatinangor",

    isLive: false,
  },

  {
    id: "DS003",

    name: "Dispenser Plaza Utama",

    lng: 107.769341,
    lat: -6.929133,

    status: "low",

    location: "Plaza Utama",

    isLive: false,
  },

  {
    id: "DS004",

    name: "Dispenser Koica",

    lng: 107.769943,
    lat: -6.927691,

    status: "available",

    location:
      "Center for Cyber Security KOICA",

    isLive: true,
  },
];