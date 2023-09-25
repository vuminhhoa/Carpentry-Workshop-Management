import axiosClient from './axiosClient';
import { CommonResponse } from 'types/common.type';

const supplyApi = {
  list(params: any): Promise<CommonResponse> {
    for (let i in params) {
      if (!params[i]) {
        delete params[i];
      }
    }
    const paramString = new URLSearchParams(params).toString();
    const url = `supply/list?${paramString}`;
    return axiosClient.get(url);
  },
  listEqCorresponding(params: any): Promise<CommonResponse> {
    for (let i in params) {
      if (!params[i]) {
        delete params[i];
      }
    }
    const paramString = new URLSearchParams(params).toString();
    const url = `supply/list_equipment_corresponding?${paramString}`;
    return axiosClient.get(url);
  },
  create(params: object): Promise<CommonResponse> {
    const url = 'supply/create';
    return axiosClient.post(url, params);
  },
  detail(id: number): Promise<CommonResponse> {
    const url = `supply/detail?id=${id}`;
    return axiosClient.get(url);
  },
  delete(id: number): Promise<CommonResponse> {
    const url = 'supply/delete';
    return axiosClient.delete(url, {
      data: { id },
    });
  },
  importSupplyForEquipment(params: object): Promise<CommonResponse> {
    const url = 'supply/import_supply_for_equipment';
    return axiosClient.post(url, params);
  },
  importSuppliesForEquipment(params: object): Promise<CommonResponse> {
    const url = 'supply/import_supplies_for_equipment';
    return axiosClient.post(url, params);
  },
  listSupplyOfEq(page: number, equipment_id: number): Promise<CommonResponse> {
    const url = `supply/list_supply_of_equipment?page=${page}&equipment_id=${equipment_id}`;
    return axiosClient.get(url);
  },
  uploadExcel(params: any): Promise<CommonResponse> {
    const url = 'supply/import_by_excel';
    return axiosClient.post(url, params);
  },
};

export default supplyApi;