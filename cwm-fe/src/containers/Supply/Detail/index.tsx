import { useState, useEffect } from 'react';
import { FilePdfFilled, EditFilled } from '@ant-design/icons';
import { Button, Divider, Table } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import image from 'assets/image.png';
import type { ColumnsType } from 'antd/es/table';
import supplyApi from 'api/supply.api';
import moment from 'moment';
import Loading from 'components/Loading';
import { formatCurrency } from 'utils/globalFunc.util';
interface DataType {
  key_1: string;
  value_1: string;
  key_2: string;
  value_2: string;
}

const DetailSupply = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { id } = params;
  const [supply, setSupply] = useState<any>({});
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

  const getDetailSupply = (id: any) => {
    setLoading(true);
    supplyApi
      .detail(id)
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          setSupply(data.supply);
        }
      })
      .catch()
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getDetailSupply(id);
  }, [id]);

  const data: DataType[] = [
    {
      key_1: 'Nước sản xuất',
      value_1: `${
        supply?.manufacturing_country ? supply.manufacturing_country : ''
      }`,
      key_2: 'Trạng thái',
      value_2: `${
        supply?.Supply_Status?.name ? supply.Supply_Status?.name : ''
      }`,
    },
    {
      key_1: 'Đơn vị tính',
      value_1: `${supply?.unit ? supply?.unit : ''}`,
      key_2: 'Số lượng',
      value_2: `${supply?.quantity ? supply?.quantity : ''}`,
    },
    {
      key_1: 'Đơn giá',
      value_1: `${supply?.unit_price ? formatCurrency(supply.unit_price) : ''}`,
      key_2: 'Thành tiền',
      value_2: `${formatCurrency(
        Number(supply.quantity) * Number(supply.unit_price)
      )}`,
    },

    {
      key_1: 'Ngày tạo',
      value_1: `${moment(supply?.createdAt).format('HH:mm:ss DD/MM/YYYY')}`,
      key_2: 'Ngày cập nhật gần nhất',
      value_2: `${moment(supply?.updatedAt).format('HH:mm:ss DD/MM/YYYY')}`,
    },
  ];

  return (
    <div>
      <div className="flex-between-center">
        <div className="font-medium text-lg">HỒ SƠ VẬT TƯ</div>
        <div className="flex flex-row gap-6">
          <Button className="button_excel ">
            <FilePdfFilled />
            <div className="font-medium text-md text-[#5B69E6]">Xuất PDF</div>
          </Button>
          <Button
            className="button_excel"
            onClick={() => navigate(`/supplies/update_supply/${supply.id}`)}
          >
            <EditFilled />
            <div className="font-medium text-md text-[#5B69E6]">
              Cập nhật vật tư
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
              <div className="font-bold text-2xl">{supply?.name}</div>
              <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                className="shadow-md mt-4"
              />
            </div>
            <div className="flex flex-col gap-4 items-center basis-1/4 ">
              <div className="text-center leading-9">Hình ảnh vật tư</div>
              <img
                src={supply?.image || image}
                className="rounded-lg w-52 h-52 mb-9"
                alt="Ảnh vật tư"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailSupply;
