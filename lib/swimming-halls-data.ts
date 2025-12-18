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
}

export const swimmingHallData: SwimmingHall[] = [
  {
    swimmingHallName: 'Matinkylän uimahalli',
    latitude: 60.167,
    longitude: 24.750,
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
