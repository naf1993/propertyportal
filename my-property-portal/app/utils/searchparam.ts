export const getSearchParams = (url: string) => {
    // Use URL API to parse the query string
    const params = new URL(url, "http://localhost").searchParams;
    const result: Record<string, string> = {};
  
    // Iterate over searchParams and add them to result
    for (const [key, value] of params.entries()) {
      result[key] = value;
    }
  
    return result;
  };
  