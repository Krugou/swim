import {reservationUrl, swimmingHallData} from './data';
import './style.css';
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
 <h1 class="text-2xl text-center m-2 p-2 bg-blue-500 text-white rounded">Swimming hall schedules</h1>
    <div id="app" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <!-- Swimming halls will be inserted here -->
    </div>
`;

const app = document.getElementById('app') as HTMLElement;
const fourHoursBeforeNow = Math.floor(Date.now() / 1000 - 4 * 60 * 60);
const fourHoursFromNow = Math.floor(Date.now() / 1000 + 4 * 60 * 60);

const fetchData = (urlToFetch: string): Promise<any> => {
	const proxyUrl =
		'https://users.metropolia.fi/~aleksino/proxytest.php?url=' +
		encodeURIComponent(urlToFetch);

	return fetch(proxyUrl)
		.then((response) => response.json())
		.catch((error) => console.error('Error:', error));
};
interface Reservation {
	start: string;
	end: string;
	title: string;
	// Add other properties as needed
}
swimmingHallData.forEach((hall) => {
	const hallElement = document.createElement('div');
	hallElement.className = 'border p-4 rounded shadow bg-white';

	const hallName = document.createElement('h2');
	hallName.className = 'text-xl font-bold mb-2 text-blue-500';
	hallName.textContent = hall.swimmingHallName;
	hallElement.appendChild(hallName);

	const linksList = document.createElement('ul');
	hall.swimmingAssets.forEach((link) => {
		const fetchUrl = `https://resurssivaraus.espoo.fi/Tailored/prime_product_intranet/espoo/web/Calendar/ReservationData.aspx?resourceid%5B%5D=${link.url}&start=${fourHoursBeforeNow}&end=${fourHoursFromNow}&_=${fourHoursBeforeNow}`;
		fetchData(fetchUrl).then((data) => {
			const currentTime = new Date();
			const oneHourFromNow = new Date(currentTime.getTime() + 60 * 60 * 1000);
			const twoHoursFromNow = new Date(
				currentTime.getTime() + 2 * 60 * 60 * 1000
			);
			const threeHoursFromNow = new Date(
				currentTime.getTime() + 3 * 60 * 60 * 1000
			);

			let hasReservationInNext1Hour = false;
			let hasReservationInNext2Hours = false;
			let hasReservationInNext3Hours = false;
			let hasFreeReservation = false;

			data.forEach((reservation: Reservation) => {
				const reservationStart = new Date(reservation.start);
				const reservationEnd = new Date(reservation.end);

				if (
					reservationStart <= oneHourFromNow &&
					reservationEnd > currentTime
				) {
					hasReservationInNext1Hour = true;
					console.log(
						'🚀 ~ fetchData ~ hasReservationInNext1Hour:',
						hasReservationInNext1Hour
					);
				}

				if (
					reservationStart <= twoHoursFromNow &&
					reservationEnd > currentTime
				) {
					hasReservationInNext2Hours = true;
					console.log(
						'🚀 ~ fetchData ~ hasReservationInNext2Hours:',
						hasReservationInNext2Hours
					);
				}
				if (
					reservationStart <= threeHoursFromNow &&
					reservationEnd > currentTime
				) {
					hasReservationInNext3Hours = true;
					console.log(
						'🚀 ~ fetchData ~ hasReservationInNext3Hours:',
						hasReservationInNext3Hours
					);
				}

				if (reservation.title.includes('Vapaaharjoitte')) {
					hasFreeReservation = true;
					console.log(
						'🚀 ~ fetchData ~ hasFreeReservation:',
						hasFreeReservation
					);
				}
			});

			if (hasFreeReservation) {
				linkReservations.className =
					'inline-block bg-green-500 m-4 hover:bg-green-700 text-white font-bold py-2 px-4 rounded';
			} else if (hasReservationInNext1Hour) {
				linkReservations.className =
					'inline-block bg-red-500 m-4 hover:bg-red-700 text-white font-bold py-2 px-4 rounded';
			} else {
				linkReservations.className =
					'inline-block bg-green-500 m-4 hover:bg-green-700 text-white font-bold py-2 px-4 rounded';
			}
			const circlesContainer = document.createElement('div');
			circlesContainer.className = 'flex flex-row';
			const oneHourCircle = document.createElement('span');
			oneHourCircle.className =
				'inline-block h-4 w-4 bg-red-800 rounded-full m-1';
			oneHourCircle.style.visibility =
				hasReservationInNext1Hour && !hasFreeReservation ? 'visible' : 'hidden';

			const twoHoursCircle = document.createElement('span');
			twoHoursCircle.className =
				'inline-block h-4 w-4 bg-red-800 rounded-full m-1';
			twoHoursCircle.style.visibility =
				hasReservationInNext2Hours && !hasFreeReservation
					? 'visible'
					: 'hidden';

			const threeHoursCircle = document.createElement('span');
			threeHoursCircle.className =
				'inline-block h-4 w-4 bg-red-800 rounded-full m-1';
			threeHoursCircle.style.visibility =
				hasReservationInNext3Hours && !hasFreeReservation
					? 'visible'
					: 'hidden';
			circlesContainer.appendChild(oneHourCircle);
			circlesContainer.appendChild(twoHoursCircle);
			circlesContainer.appendChild(threeHoursCircle);

			linkReservations.appendChild(circlesContainer);
		});
		const linkItem = document.createElement('li');
		linkItem.className = 'flex space-x-4';
		const linkElement = document.createElement('a');
		const linkReservations = document.createElement('a');
		linkReservations.href = fetchUrl;
		linkReservations.textContent = 'R';
		linkElement.href = reservationUrl + link.url;
		linkElement.textContent = link.swimmingAssetName;
		linkElement.className =
			'inline-block bg-blue-500 m-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded';
		linkReservations.className =
			'inline-block bg-blue-500 m-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded';

		linkItem.appendChild(linkElement);
		linkItem.appendChild(linkReservations);
		linksList.appendChild(linkItem);
	});
	hallElement.appendChild(linksList);

	app.appendChild(hallElement);
});
