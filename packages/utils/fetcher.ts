export const fetcher = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    console.error(response);
    throw new Error("Failed to fetch data");
  }

  return response.json();
};
