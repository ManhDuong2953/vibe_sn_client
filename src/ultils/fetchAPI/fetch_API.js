// import { toast } from "react-toastify";

// const fetchData = async (url, options = {}) => {
//   try {

//     const mergedOptions = {
//       ...options,
//       credentials: "include",
//       headers: {
//         ...options.headers,
//       },
//     };

//     const response = await fetch(url, mergedOptions);

//     if (!response.ok) {
//       // Kiểm tra xem phản hồi có phải là JSON không
//       let errorResponse;
//       try {
//         errorResponse = await response.json();
//       } catch (e) {
//         toast.error(response?.statusText);
//       }
//       errorResponse?.message && toast.error(errorResponse?.message);
//     }

//     // Kiểm tra xem phản hồi có phải là JSON không
//     let data;

//     try {
//       data = await response.json();
//     } catch (e) {
//       data = response;
//     }

//     if (data?.status === true || data?.status === 200 || data?.status === 201 || data?.status === 304) {
//       data.status = true;
//     } else {
//       data.status = false;
//     }

//     if (data?.status === false && data?.message) {
//       toast.error(data?.message);
//     } else if (data?.message) {
//       toast.success(data?.message);
//     }

//     return data;
//   } catch (error) {
//     console.error(error.message ?? error);
//   }
// };

// export const getData = async (url_endpoint, headers = {}) => {
//   const url = url_endpoint;
//   const options = {
//     method: "GET",
//     headers: {
//       ...headers,
//     },
//   };

//   return await fetchData(url, options);
// };
// export const postData = async (url_endpoint, payload, headers = {}) => {
//   const url = url_endpoint;
//   const isFormData = payload instanceof FormData;

//   const options = {
//     method: "POST",
//     headers: {
//       ...headers,
//       ...(isFormData ? {} : { "Content-Type": "application/json" }), // Xóa Content-Type nếu payload là FormData
//     },
//     body: isFormData ? payload : JSON.stringify(payload), // Không sử dụng JSON.stringify nếu payload là FormData
//   };

//   return await fetchData(url, options);
// };

// export const putData = async (url_endpoint, payload, headers = {}) => {
//   const url = url_endpoint;
//   const isFormData = payload instanceof FormData;

//   const options = {
//     method: "PUT",
//     headers: {
//       ...headers,
//       ...(isFormData ? {} : { "Content-Type": "application/json" }), // Xóa Content-Type nếu payload là FormData
//     },
//     body: isFormData ? payload : JSON.stringify(payload), // Không sử dụng JSON.stringify nếu payload là FormData
//   };

//   return await fetchData(url, options);
// };

// export const deleteData = async (url_endpoint, headers = {}) => {
//   const url = url_endpoint;
//   const options = {
//     method: "DELETE",
//     headers: {
//       ...headers,
//       "Content-Type": "application/json",
//     },
//   };
//   return await fetchData(url, options);
// };
import axios from "axios";
import { toast } from "react-toastify";

// Tạo instance axios chung
const axiosInstance = axios.create({
  withCredentials: true, // gửi cookie
  timeout: 120000, // timeout 15s
});

// Hàm xử lý phản hồi chung
const handleResponse = (response) => {
  const data = response.data;

  if ([true, 200, 201, 204, 304].includes(data?.status)) {
    data.status = true;
  } else {
    data.status = false;
  }

  if (data?.status === false && data?.message) {
    toast.error(data.message);
  } else if (data?.message) {
    toast.success(data.message);
  }

  return data;
};

// Hàm xử lý lỗi chung
const handleError = (error) => {
    // Nếu lỗi do timeout thì chỉ return, không toast
  if (error.code === "ECONNABORTED") {
    return { status: false, message: "Yêu cầu đã hủy bởi phản hồi quá thời hạn!" };
  }
  // Axios ném lỗi khi status >= 400
  const errMsg =
    error.response?.data?.message ||
    error.response?.statusText ||
    error.message ||
    "Network Error";
  toast.error(errMsg);
  return { status: false, message: errMsg };
};

// Hàm gọi API chung
const fetchData = async (url, options = {}) => {
  try {
    const method = options.method?.toLowerCase() || "get";

    const config = {
      url,
      method,
      headers: options.headers || {},
      withCredentials: true,
    };

    // Nếu có body
    if (options.body) {
      if (options.body instanceof FormData) {
        config.data = options.body; // FormData
      } else {
        config.data = JSON.stringify(options.body);
        config.headers["Content-Type"] = "application/json";
      }
    }

    // Đối với DELETE: không gửi data nếu rỗng
    if (method === "delete" && !config.data) delete config.data;

    const response = await axiosInstance(config);
    return handleResponse(response);
  } catch (error) {

    return handleError(error);
  }
};

// --- Export các method ---

export const getData = async (url_endpoint, headers = {}) => {
  return await fetchData(url_endpoint, { method: "GET", headers });
};

export const postData = async (url_endpoint, payload, headers = {}) => {
  return await fetchData(url_endpoint, {
    method: "POST",
    body: payload,
    headers,
  });
};

export const putData = async (url_endpoint, payload, headers = {}) => {
  return await fetchData(url_endpoint, {
    method: "PUT",
    body: payload,
    headers,
  });
};

export const deleteData = async (url_endpoint, headers = {}) => {
  return await fetchData(url_endpoint, { method: "DELETE", headers });
};
