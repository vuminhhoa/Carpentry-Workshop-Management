import { Button, DatePicker, Divider, Form, Input, Select, Table } from 'antd';
import { useContext, useEffect, useState } from 'react';
import ava from 'assets/image.png';
import { convertBase64, options } from 'utils/globalFunc.util';
import timekeepingLogApi from 'api/timekeepingLog.api';
import { toast } from 'react-toastify';
import { FilterContext } from 'contexts/filter.context';
import { useNavigate, useParams } from 'react-router-dom';
import carpenterApi from 'api/carpenter.api';

const { Option } = Select;
const { TextArea } = Input;
interface Carpenter {
  id: number;
  name: string;
}

interface Timekeeping_Log {
  carpenter_id: number | string;
  work_number: string;
  note: string;
}
const CreateTimekeepingLog = () => {
  const [form] = Form.useForm();
  const [selectedImage, setSelectedImage] = useState<any>('');
  const [image, setImage] = useState<any>('');
  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);
  const [type, setType] = useState({});
  const params: any = useParams();
  const { date } = params;

  const [loading, setLoading] = useState<boolean>(false);
  const [dataChange, setDataChange] = useState<any>({});
  const navigate = useNavigate();
  const [note, setNote] = useState<string>('');
  const [carpenters, setCarpenters] = useState<Carpenter[]>([]);
  const [timekeepingLogData, setTimekeepingLogData] = useState<
    Timekeeping_Log[]
  >([]);
  const columns = [
    {
      title: 'Tên thợ',
      dataIndex: 'carpenter_id',
      key: 'carpenter_id',
      render: (
        text: number | string,
        record: Timekeeping_Log,
        index: number
      ) => (
        <Select
          style={{ width: '100%' }}
          value={text}
          onChange={(value: number | string) =>
            handleCarpenterChange(value, index)
          }
        >
          {carpenters.map((carpenter) => (
            <Option key={carpenter.id} value={carpenter.id}>
              {carpenter.name}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Số công',
      dataIndex: 'work_number',
      key: 'work_number',
      render: (text: string, record: Timekeeping_Log, index: number) => (
        <Input
          value={text}
          onChange={(e) => handleWorkNumberChange(e, index)}
        />
      ),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      render: (text: string, record: Timekeeping_Log, index: number) => (
        <Input value={text} onChange={(e) => handleNoteChange(e, index)} />
      ),
    },
  ];
  const handleChangeImg = async (e: any) => {
    let file = e.target.files[0];
    if (file) {
      let img = URL.createObjectURL(file);
      let fileBase64 = await convertBase64(file);
      setSelectedImage(img);
      setImage(fileBase64);
    }
  };

  const onchange = async (e: any) => {
    const newDataChange = { ...dataChange, [e.target.id]: e.target.value };
    setDataChange(newDataChange);
  };

  const onFinish = (values: any) => {
    let data = { ...values, image, department_id: 1, status_id: 2 };
    setLoading(true);
    timekeepingLogApi
      .create(data)
      .then((res: any) => {
        const { success, message } = res.data;
        if (success) {
          toast.success('Thêm mới chấm công thành công!');
          setImage('');
          setSelectedImage('');
          form.resetFields();
          navigate(`/supplies/list_supplies`);
        } else {
          toast.error(message);
        }
      })
      .catch()
      .finally(() => setLoading(false));
  };
  const getCarpenters = () => {
    setLoading(true);
    carpenterApi
      .search({})
      .then((res: any) => {
        const { success, data } = res.data;
        let carpenters = data.carpenters;
        if (success) {
          setCarpenters(carpenters);
        }
      })
      .catch()
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    getCarpenters();
  }, []);

  const handleNoteChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedAttendanceData = [...timekeepingLogData];
    updatedAttendanceData[index].note = e.target.value;
    setTimekeepingLogData(updatedAttendanceData);
  };

  const handleWorkNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedAttendanceData = [...timekeepingLogData];
    updatedAttendanceData[index].work_number = e.target.value;
    setTimekeepingLogData(updatedAttendanceData);
  };

  const handleCarpenterChange = (value: number | string, index: number) => {
    const updatedAttendanceData = [...timekeepingLogData];
    updatedAttendanceData[index].carpenter_id = value;
    setTimekeepingLogData(updatedAttendanceData);
  };

  const handleAddRow = () => {
    setTimekeepingLogData([
      ...timekeepingLogData,
      { carpenter_id: '', work_number: '', note: '' },
    ]);
  };

  const handleUpdate = () => {
    const data = {
      data: {
        date: date,
        note: note,
      },
      carpenters: timekeepingLogData,
    };
    setLoadingUpdate(true);
    timekeepingLogApi
      .create(data)
      .then((res: any) => {
        const { success } = res.data;
        if (success) {
          toast.success('Chấm công thành công');
        } else {
          toast.error('Chấm công thất bại');
        }
      })
      .catch()
      .finally(() => setLoadingUpdate(false));
    console.log(JSON.stringify(data));
  };
  console.log(carpenters);
  return (
    <div>
      <div className="flex-between-center">
        <div className="title">CHẤM CÔNG NGÀY {date}</div>
      </div>

      <Divider />
      <div className="flex flex-row gap-6 my-8 ">
        <div className="w-[100%]">
          <Input
            placeholder="Ghi chú"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <Button onClick={handleAddRow} className="button-primary">
            Thêm thợ
          </Button>
          <Table
            columns={columns}
            dataSource={timekeepingLogData}
            pagination={false}
          />
          <Button
            onClick={handleUpdate}
            htmlType="submit"
            className="button-primary"
            loading={loadingUpdate}
          >
            Chấm công
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateTimekeepingLog;
