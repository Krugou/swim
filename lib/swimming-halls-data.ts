export const reservationUrl =
  'https://resurssivaraus.espoo.fi/liikunnantilavaraus/haku/?ResourceIDs=';

export interface RelatedLink {
  relatedLinkName: string;
  url: string;
}

export interface SwimmingHall {
  swimmingHallName: string;
  relatedLinks: RelatedLink[];
  latitude: number;
  longitude: number;
  description?: string;
  facilities?: string[];
  opening?: string;
  phone?: string;
  address?: string;
}

export const swimmingHallData: SwimmingHall[] = [
  {
    swimmingHallName: 'Matinkylän uimahalli',
    latitude: 60.167,
    longitude: 24.75,
    description: 'Modern 50m swimming hall with therapy pool and gym facilities.',
    facilities: ['50m Pool', 'Therapy Pool', 'Gym', 'Sauna', 'Changing Rooms', 'Lockers'],
    opening: 'Mon-Fri: 6:00-21:00, Sat-Sun: 8:00-18:00',
    phone: '+358 9 816 29400',
    address: 'Säterinkatu 8, 02230 Espoo',
    relatedLinks: [
      {
        relatedLinkName: 'Terapia-allas',
        url: '24790',
      },
      {
        relatedLinkName: 'Kuntosali',
        url: '24847',
      },
      {
        relatedLinkName: '50m, koko allas',
        url: '24767',
      },
      {
        relatedLinkName: 'Swim',
        url: '24767,24790',
      },
    ],
  },
  {
    swimmingHallName: 'Leppävaaran uimahalli',
    latitude: 60.218,
    longitude: 24.813,
    description: 'Large swimming complex with indoor and outdoor pools.',
    facilities: ['Indoor Pool', 'Outdoor Pool (Summer)', 'Therapy Pool', 'Gym', 'Sauna', 'Café'],
    opening: 'Mon-Fri: 6:00-21:00, Sat-Sun: 8:00-18:00',
    phone: '+358 9 816 28000',
    address: 'Veräjäpellonkatu 30, 02650 Espoo',
    relatedLinks: [
      {
        relatedLinkName: 'Terapia-allas',
        url: '18509',
      },
      {
        relatedLinkName: 'Kuntosali',
        url: '16083',
      },
      {
        relatedLinkName: 'Maauimala, koko allas',
        url: '19191',
      },
      {
        relatedLinkName: 'Iso allas, koko allas',
        url: '16074',
      },
      {
        relatedLinkName: 'Swim',
        url: '18509,16074',
      },
      {
        relatedLinkName: 'Swim(summer)',
        url: '18509,19191,16074',
      },
    ],
  },
  {
    swimmingHallName: 'Espoonlahden uimahalli',
    latitude: 60.146,
    longitude: 24.666,
    description: '50m competition pool with gym facilities.',
    facilities: ['50m Pool', 'Gym', 'Sauna', 'Changing Rooms', 'Lockers'],
    opening: 'Mon-Fri: 6:00-21:00, Sat-Sun: 8:00-18:00',
    phone: '+358 9 816 27500',
    address: 'Sairaalaportinkatu 1, 02320 Espoo',
    relatedLinks: [
      {
        relatedLinkName: 'Kuntosali 1 (yläsali)',
        url: '16765',
      },
      {
        relatedLinkName: 'Vapaaharjoittelukuntosali',
        url: '15958',
      },
      {
        relatedLinkName: '50 m, koko allas',
        url: '15939',
      },
    ],
  },
  {
    swimmingHallName: 'Keski-Espoon uimahalli',
    latitude: 60.207,
    longitude: 24.655,
    description: 'Swimming hall with therapy pool and gym.',
    facilities: ['Pool', 'Therapy Pool', 'Gym', 'Sauna', 'Changing Rooms'],
    opening: 'Mon-Fri: 6:00-21:00, Sat-Sun: 8:00-18:00',
    phone: '+358 9 816 26600',
    address: 'Säterinkatu 9, 02650 Espoo',
    relatedLinks: [
      {
        relatedLinkName: 'Terapia-allas',
        url: '16650',
      },
      {
        relatedLinkName: 'Kuntosali',
        url: '16654',
      },
      {
        relatedLinkName: 'Iso allas, koko allas',
        url: '16645',
      },
      {
        relatedLinkName: 'Swim',
        url: '16650,16645',
      },
    ],
  },
  {
    swimmingHallName: 'Olari uimahalli',
    latitude: 60.181,
    longitude: 24.734,
    description: 'Neighborhood swimming hall with gym.',
    facilities: ['Pool', 'Gym', 'Sauna', 'Changing Rooms', 'Lockers'],
    opening: 'Mon-Fri: 6:00-21:00, Sat-Sun: 8:00-18:00',
    phone: '+358 9 816 25900',
    address: 'Olarin tennistie 1, 02210 Espoo',
    relatedLinks: [
      {
        relatedLinkName: 'Koko allas',
        url: '15968',
      },
      {
        relatedLinkName: 'Kuntosali',
        url: '15967',
      },
    ],
  },
];
