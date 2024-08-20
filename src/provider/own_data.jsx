import React, { createContext, useEffect, useState } from "react";
import { API_GET_INFO_OWNER_PROFILE_BY_ID } from "../API/api_server";
import { getData } from "../ultils/fetchAPI/fetch_API";
import { useDispatch } from "react-redux";
import { setThemeFromContext } from "../redux/Reducer/reducer";

export const OwnDataContext = createContext(null);

function OwnDataProvider({ children }) {
    const [data, setData] = useState(null);
    const dispatch = useDispatch();
  
    useEffect(() => {
      if (data && data?.dark_theme) {
        dispatch(setThemeFromContext('dark'));
      } else {
        dispatch(setThemeFromContext('light'));
      }
    }, [data, dispatch]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getData(API_GET_INFO_OWNER_PROFILE_BY_ID);
                if (response.status) {
                    setData(response.data);
                }
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };
        fetchData();
    }, []);

    return (
        <OwnDataContext.Provider value={data}>
            {children}
        </OwnDataContext.Provider>
    );
}

export default OwnDataProvider;
