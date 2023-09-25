import React, { createContext, useEffect, useState } from 'react';
import filterApi from 'api/filter.api';
import { ACCESS_TOKEN, CURRENT_USER } from 'constants/auth.constant';

interface FilterContextData {
  statuses: Array<object>[];
  user: any;
}

export const FilterContext = createContext<FilterContextData>({
  statuses: [],
  user: {},
});

interface FilterContextProps {
  children: React.ReactNode;
}

const FilterContextProvider: React.FC<FilterContextProps> = ({ children }) => {
  const [statuses, setStatuses] = useState([]);

  const access_token: any = localStorage.getItem(ACCESS_TOKEN);
  const user: any = JSON.parse(localStorage.getItem(CURRENT_USER) || '{}');

  const getAllFilter = async () => {
    await Promise.all([filterApi.getStatusEquipmentApi()])
      .then((res: any) => {
        const [statuses] = res;
        setStatuses(statuses?.data?.data?.statuses);
      })
      .catch((error) => console.log('error', error));
  };

  useEffect(() => {
    if (access_token) {
      getAllFilter();
    }
  }, [access_token]);

  const FilterContextData = {
    statuses,
    user,
  };
  console.log(statuses);
  return (
    <FilterContext.Provider value={FilterContextData}>
      {children}
    </FilterContext.Provider>
  );
};

export default FilterContextProvider;
