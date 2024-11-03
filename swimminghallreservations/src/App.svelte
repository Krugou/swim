<script lang="ts">
  import { onMount } from 'svelte';
  import { reservationUrl, swimmingHallData } from './data';

  let swimmingHalls: any[] = [];

  const fetchData = async (urlToFetch: string): Promise<any> => {
    const proxyUrl = 'https://users.metropolia.fi/~aleksino/proxytest.php?url=' + encodeURIComponent(urlToFetch);
    try {
      const response = await fetch(proxyUrl);
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  onMount(() => {
    const fourHoursBeforeNow = Math.floor(Date.now() / 1000 - 4 * 60 * 60);
    const fourHoursFromNow = Math.floor(Date.now() / 1000 + 4 * 60 * 60);

    swimmingHallData.forEach(async (hall) => {
      const hallData = { ...hall, assets: [] };

      for (const asset of hall.swimmingAssets) {
        const fetchUrl = `https://resurssivaraus.espoo.fi/Tailored/prime_product_intranet/espoo/web/Calendar/ReservationData.aspx?resourceid%5B%5D=${asset.url}&start=${fourHoursBeforeNow}&end=${fourHoursFromNow}&_=${fourHoursBeforeNow}`;
        const data = await fetchData(fetchUrl);

        const currentTime = new Date();
        const oneHourFromNow = new Date(currentTime.getTime() + 60 * 60 * 1000);
        const twoHoursFromNow = new Date(currentTime.getTime() + 2 * 60 * 60 * 1000);
        const threeHoursFromNow = new Date(currentTime.getTime() + 3 * 60 * 60 * 1000);

        let hasReservationInNext1Hour = false;
        let hasReservationInNext2Hours = false;
        let hasReservationInNext3Hours = false;
        let hasFreeReservation = false;

        data.forEach((reservation: any) => {
          const reservationStart = new Date(reservation.start);
          const reservationEnd = new Date(reservation.end);

          if (reservationStart <= oneHourFromNow && reservationEnd > currentTime) {
            hasReservationInNext1Hour = true;
          }

          if (reservationStart <= twoHoursFromNow && reservationEnd > currentTime) {
            hasReservationInNext2Hours = true;
          }

          if (reservationStart <= threeHoursFromNow && reservationEnd > currentTime) {
            hasReservationInNext3Hours = true;
          }

          if (reservation.title.includes('Vapaaharjoitte')) {
            hasFreeReservation = true;
          }
        });

        hallData.assets.push({
          ...asset,
          hasReservationInNext1Hour,
          hasReservationInNext2Hours,
          hasReservationInNext3Hours,
          hasFreeReservation
        });
      }

      swimmingHalls = [...swimmingHalls, hallData];
    });
  });
</script>

<style>
  .red-circle {
    background-color: #991b1b;
    border-radius: 50%;
    height: 1rem;
    width: 1rem;
    margin: 0.25rem;
  }
</style>

<h1 class="text-2xl text-center m-2 p-2 bg-blue-500 text-white rounded">Swimming hall schedules</h1>
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
  {#each swimmingHalls as hall}
    <div class="border p-4 rounded shadow bg-white">
      <h2 class="text-xl font-bold mb-2 text-blue-500">{hall.swimmingHallName}</h2>
      <ul>
        {#each hall.assets as asset}
          <li class="flex space-x-4">
            <a href="{reservationUrl + asset.url}" class="inline-block bg-blue-500 m-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">{asset.swimmingAssetName}</a>
            <a href="https://resurssivaraus.espoo.fi/Tailored/prime_product_intranet/espoo/web/Calendar/ReservationData.aspx?resourceid%5B%5D={asset.url}&start={Math.floor(Date.now() / 1000 - 4 * 60 * 60)}&end={Math.floor(Date.now() / 1000 + 4 * 60 * 60)}&_={Math.floor(Date.now() / 1000 - 4 * 60 * 60)}" class="inline-block {asset.hasFreeReservation ? 'bg-green-500 hover:bg-green-700' : asset.hasReservationInNext1Hour ? 'bg-red-500 hover:bg-red-700' : 'bg-green-500 hover:bg-green-700'} text-white font-bold py-2 px-4 rounded">R</a>
            <div class="flex flex-row">
              <span class="red-circle" style="visibility: {asset.hasReservationInNext1Hour && !asset.hasFreeReservation ? 'visible' : 'hidden'}"></span>
              <span class="red-circle" style="visibility: {asset.hasReservationInNext2Hours && !asset.hasFreeReservation ? 'visible' : 'hidden'}"></span>
              <span class="red-circle" style="visibility: {asset.hasReservationInNext3Hours && !asset.hasFreeReservation ? 'visible' : 'hidden'}"></span>
            </div>
          </li>
        {/each}
      </ul>
    </div>
  {/each}
</div>
