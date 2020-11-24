
/**
 * Get result frrom api call and throw error if applicable
 * @param {string} url - url for API call
 * @return {object} - intended data returned
 */
export default async function fetcher(url) {
  const res = await fetch(url);
  const data = await res.json();
  if (res.status !== 200) {
    throw new Error(data.message);
  }
  return data;
};
