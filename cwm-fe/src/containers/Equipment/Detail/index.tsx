import { useState, useEffect } from 'react';
import { FilePdfFilled, EditFilled } from '@ant-design/icons';
import { Button, Divider, Table } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import image from 'assets/image.png';
import type { ColumnsType } from 'antd/es/table';
import equipmentApi from 'api/equipment.api';
import moment from 'moment';
import Loading from 'components/Loading';
import { formatCurrency } from 'utils/globalFunc.util';
interface DataType {
  key_1: string;
  value_1: string;
  key_2: string;
  value_2: string;
}

const Detail = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { id } = params;
  const [equipment, setEquipment] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const columns: ColumnsType<DataType> = [
    {
      title: 'Trường',
      dataIndex: 'key_1',
      key: 'key_1',
    },
    {
      title: 'Giá trị',
      dataIndex: 'value_1',
      key: 'value_1',
    },
    {
      title: 'Trường',
      dataIndex: 'key_2',
      key: 'key_2',
    },
    {
      title: 'Giá trị',
      dataIndex: 'value_2',
      key: 'value_2',
    },
  ];

  const getDetailEquipment = (id: any) => {
    setLoading(true);
    equipmentApi
      .detail(id)
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          setEquipment(data.equipment);
        }
      })
      .catch()
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getDetailEquipment(id);
  }, [id]);

  const data: DataType[] = [
    {
      key_1: 'Nước sản xuất',
      value_1: `${
        equipment?.manufacturing_country ? equipment.manufacturing_country : ''
      }`,
      key_2: 'Trạng thái',
      value_2: `${
        equipment?.Equipment_Status?.name
          ? equipment.Equipment_Status?.name
          : ''
      }`,
    },
    {
      key_1: 'Đơn vị tính',
      value_1: `${equipment?.unit ? equipment?.unit : ''}`,
      key_2: 'Số lượng',
      value_2: `${equipment?.quantity ? equipment?.quantity : ''}`,
    },
    {
      key_1: 'Đơn giá',
      value_1: `${
        equipment?.unit_price ? formatCurrency(equipment.unit_price) : ''
      }`,
      key_2: 'Thành tiền',
      value_2: `${formatCurrency(
        Number(equipment.quantity) * Number(equipment.unit_price)
      )}`,
    },

    {
      key_1: 'Ngày tạo',
      value_1: `${moment(equipment?.createdAt).format('HH:mm:ss DD/MM/YYYY')}`,
      key_2: 'Ngày cập nhật gần nhất',
      value_2: `${moment(equipment?.updatedAt).format('HH:mm:ss DD/MM/YYYY')}`,
    },
  ];

  return (
    <div>
      <div className="flex-between-center">
        <div className="font-medium text-lg">HỒ SƠ THIẾT BỊ</div>
        <div className="flex flex-row gap-6">
          <Button className="button_excel ">
            <FilePdfFilled />
            <div className="font-medium text-md text-[#5B69E6]">Xuất PDF</div>
          </Button>
          <Button
            className="button_excel"
            onClick={() =>
              navigate(`/equipments/update_equipment/${equipment.id}`)
            }
          >
            <EditFilled />
            <div className="font-medium text-md text-[#5B69E6]">
              Cập nhật thiết bị
            </div>
          </Button>
        </div>
      </div>
      <Divider />
      {loading ? (
        <Loading />
      ) : (
        <div id="detail" className="">
          <div className="flex flex-row gap-6 my-8">
            <div className="basis-3/4">
              <div className="font-bold text-2xl">{equipment?.name}</div>
              <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                className="shadow-md mt-4"
              />
            </div>
            <div className="flex flex-col gap-4 items-center basis-1/4 ">
              <div className="text-center leading-9">Hình ảnh thiết bị</div>
              <img
                src={equipment?.image || image}
                className="rounded-lg w-52 h-52 mb-9"
                alt="Ảnh thiết bị"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Detail;
