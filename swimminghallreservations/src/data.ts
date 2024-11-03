const reservationUrl =
	'https://resurssivaraus.espoo.fi/liikunnantilavaraus/haku/?ResourceIDs=';
type SwimmingAsset = {
	swimmingAssetName: string;
	url: string;
	tracks?: {trackName: string; url: string}[];
};
type HallData = {
	swimmingHallName: string;
	swimmingAssets: SwimmingAsset[];
}[];
const swimmingHallData: HallData = [
	{
		swimmingHallName: 'Matinkylän uimahalli',
		swimmingAssets: [
			{
				swimmingAssetName: 'Terapia-allas',
				url: '24790',
			},
			{
				swimmingAssetName: 'Kuntosali',
				url: '24847',
			},
			{
				swimmingAssetName: '50m, koko allas',
				url: '24767',
				tracks: [
					{trackName: 'Rata 1', url: '24768'},
					{trackName: 'Rata 2', url: '24769'},
					{trackName: 'Rata 3', url: '24770'},
					{trackName: 'Rata 4', url: '24771'},
					{trackName: 'Rata 5', url: '24772'},
					{trackName: 'Rata 6', url: '24773'},
					{trackName: 'Rata 7', url: '24774'},
					{trackName: 'Rata 8', url: '24775'},
				],
			},
		],
	},
	{
		swimmingHallName: 'Leppävaaran uimahalli',
		swimmingAssets: [
			{
				swimmingAssetName: 'Terapia-allas',
				url: '18509',
			},
			{
				swimmingAssetName: 'Kuntosali',
				url: '16083',
			},
			{
				swimmingAssetName: 'Maauimala, koko allas',
				url: '19191',
			},
			{
				swimmingAssetName: 'Iso allas, koko allas',
				url: '16074',
			},
		],
	},
	{
		swimmingHallName: 'Espoonlahden uimahalli',
		swimmingAssets: [
			{
				swimmingAssetName: 'Kuntosali 1 (yläsali)',
				url: '16765',
			},
			{
				swimmingAssetName: 'Vapaaharjoittelukuntosali',
				url: '15958',
			},
			{
				swimmingAssetName: '50 m, koko allas',
				url: '15939',
			},
		],
	},
	{
		swimmingHallName: 'Keski-Espoon uimahalli',
		swimmingAssets: [
			{
				swimmingAssetName: 'Terapia-allas',
				url: '16650',
			},
			{
				swimmingAssetName: 'Kuntosali',
				url: '16654',
			},
			{
				swimmingAssetName: 'Iso allas, koko allas',
				url: '16645',
			},
		],
	},
	{
		swimmingHallName: 'Olari uimahalli',
		swimmingAssets: [
			{
				swimmingAssetName: 'Koko allas',
				url: '15968',
			},
			{
				swimmingAssetName: 'Kuntosali',
				url: '15967',
			},
		],
	},
];

export {reservationUrl, swimmingHallData};
