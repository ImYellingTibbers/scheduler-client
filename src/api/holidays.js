export function getPublicHolidays(year, countryCode = 'US') {
  const url = `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`;
  return fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .catch((err) => {
      console.error('getPublicHolidays error', err);
      return [];
    });
}
