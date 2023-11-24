import { useState, useEffect } from 'react';
import { FilePdfFilled, EditFilled } from '@ant-design/icons';
import { Button, Divider, Table } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import image from 'assets/image.png';
import type { ColumnsType } from 'antd/es/table';
import carpenterApi from 'api/carpenter.api';
import moment from 'moment';
import Loading from 'components/Loading';
interface DataType {
  key_1: string;
  value_1: string;
  key_2: string;
  value_2: string;
}

const DetailCarpenter = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { id } = params;
  const [carpenter, setCarpenter] = useState<any>({});
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

  const getDetailCarpenter = (id: any) => {
    setLoading(true);
    carpenterApi
      .detail(id)
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          setCarpenter(data.carpenter);
        }
      })
      .catch()
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getDetailCarpenter(id);
  }, [id]);

  const data: DataType[] = [
    {
      key_1: 'Địa chỉ',
      value_1: `${carpenter?.address ? carpenter.address : ''}`,
      key_2: 'Trạng thái',
      value_2: `${
        carpenter?.Carpenter_Status?.name
          ? carpenter.Carpenter_Status?.name
          : ''
      }`,
    },
    {
      key_1: 'Điện thoại',
      value_1: `${carpenter?.phone ? carpenter?.phone : ''}`,
      key_2: 'Giới tính',
      value_2: `${carpenter?.gender ? carpenter?.gender : ''}`,
    },

    {
      key_1: 'Ngày tạo',
      value_1: `${moment(carpenter?.createdAt).format('HH:mm:ss DD/MM/YYYY')}`,
      key_2: 'Ngày cập nhật gần nhất',
      value_2: `${moment(carpenter?.updatedAt).format('HH:mm:ss DD/MM/YYYY')}`,
    },
  ];

  return (
    <div>
      <div className="flex-between-center">
        <div className="font-medium text-lg">THÔNG TIN THỢ</div>
        <div className="flex flex-row gap-6">
          <Button className="button_excel ">
            <FilePdfFilled />
            <div className="font-medium text-md text-[#5B69E6]">Xuất PDF</div>
          </Button>
          <Button
            className="button_excel"
            onClick={() =>
              navigate(`/carpenters/update_carpenter/${carpenter.id}`)
            }
          >
            <EditFilled />
            <div className="font-medium text-md text-[#5B69E6]">
              Cập nhật thông tin thợ
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
              <div className="font-bold text-2xl">{carpenter?.name}</div>
              <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                className="shadow-md mt-4"
              />
            </div>
            <div className="flex flex-col gap-4 items-center basis-1/4 ">
              <div className="text-center leading-9">Ảnh đại diện</div>
              <img
                src={carpenter?.image || image}
                className="rounded-lg w-52 h-52 mb-9"
                alt="Ảnh đại diện thợ"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailCarpenter;
