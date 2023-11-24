import { Button, Divider, Input, Select, Table } from 'antd';
import { useEffect, useState } from 'react';
import timekeepingLogApi from 'api/timekeepingLog.api';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import carpenterApi from 'api/carpenter.api';

const { Option } = Select;
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
  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);
  const params: any = useParams();
  const { date } = params;
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
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
          navigate(`/timekeeping_logs/list_timekeeping_logs`);
        } else {
          toast.error('Chấm công thất bại');
        }
      })
      .catch()
      .finally(() => setLoadingUpdate(false));
  };
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
