import { toast } from "react-toastify";
import getToken from "../getToken/get_token";


const fetchData = async (url, options = {}) => {
  try {
    const token = getToken();

    const mergedOptions = {
      ...options,
      credentials: 'include',
      headers: {
        ...options.headers,
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    };


    const response = await fetch(url, mergedOptions);

    if (!response.ok) {
      // Kiểm tra xem phản hồi có phải là JSON không
      let errorResponse;
      try {
        errorResponse = await response.json();
      } catch (e) {
        throw new Error(response.statusText);
      }
      throw new Error(errorResponse?.message || 'An error occurred');
    }

    // Kiểm tra xem phản hồi có phải là JSON không
    let data;
    try {
      data = await response.json();
    } catch (e) {
      data = response;
    }

    if (data?.status === false && data.data?.message) {
      toast.error(data?.data?.message);
    } else if (data?.message) {
      toast.success(data?.message);
    }

    return data;
  } catch (error) {
    console.log(error.message ?? error);
    toast.error(error.message ?? error);
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
