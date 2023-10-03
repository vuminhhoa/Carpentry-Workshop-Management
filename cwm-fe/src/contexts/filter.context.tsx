import React, { createContext, useEffect, useState } from 'react';
import filterApi from 'api/filter.api';
import { ACCESS_TOKEN, CURRENT_USER } from 'constants/auth.constant';

interface FilterContextData {
  equipment_statuses: Array<object>[];
  carpenter_statuses: Array<object>[];
  user: any;
}

export const FilterContext = createContext<FilterContextData>({
  equipment_statuses: [],
  carpenter_statuses: [],
  user: {},
});

interface FilterContextProps {
  children: React.ReactNode;
}

const FilterContextProvider: React.FC<FilterContextProps> = ({ children }) => {
  const [equipment_statuses, setEquipmentStatuses] = useState([]);
  const [carpenter_statuses, setCarpenterStatuses] = useState([]);

  const access_token: any = localStorage.getItem(ACCESS_TOKEN);
  const user: any = JSON.parse(localStorage.getItem(CURRENT_USER) || '{}');

  const getAllFilter = async () => {
    await Promise.all([filterApi.getStatusEquipmentApi()])
      .then((res: any) => {
        const [equipment_statuses] = res;
        setEquipmentStatuses(equipment_statuses?.data?.data?.statuses);
      })
      .catch((error) => console.log('error', error));
    await Promise.all([filterApi.getCarpenterStatusApi()])
      .then((res: any) => {
        const [carpenter_statuses] = res;
        setCarpenterStatuses(carpenter_statuses?.data?.data?.statuses);
      })
      .catch((error) => console.log('error', error));
  };

  useEffect(() => {
    if (access_token) {
      getAllFilter();
    }
  }, [access_token]);

  const FilterContextData = {
    equipment_statuses,
    carpenter_statuses,
    user,
  };
  return (
    <FilterContext.Provider value={FilterContextData}>
      {children}
    </FilterContext.Provider>
  );
};

export default FilterContextProvider;
