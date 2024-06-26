const fetchData = async (url, options = {}) => {
  try {
    const mergedOptions = {
      headers: {
        ...options.headers,
      },
      ...options, // Merge các tùy chọn khác
    };

    const response = await fetch(url, mergedOptions);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export const getData = async (url_endpoint, headers = {}) => {
  const url = url_endpoint;
  const options = {
    method: 'GET',
    headers: {
      ...headers,
    },
  };
  
  return await fetchData(url, options);
};

export const postData = async (url_endpoint, payload, headers = {}) => {
  const url = url_endpoint;
  const options = {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  };
  return await fetchData(url, options);
};

export const putData = async (url_endpoint, payload, headers = {}) => {
  const url = url_endpoint;
  const options = {
    method: 'PUT',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  };
  return await fetchData(url, options);
};

export const deleteData = async (url_endpoint, headers = {}) => {
  const url = url_endpoint;
  const options = {
    method: 'DELETE',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  };
  return await fetchData(url, options);
};
