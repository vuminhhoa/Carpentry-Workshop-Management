import { Button, Divider, Form, Input, Select } from 'antd';
import { useContext, useState } from 'react';
import ava from 'assets/image.png';
import { convertBase64, options } from 'utils/globalFunc.util';
import equipmentApi from 'api/equipment.api';
import { toast } from 'react-toastify';
import { FilterContext } from 'contexts/filter.context';
import { useNavigate, useParams } from 'react-router-dom';

const { Option } = Select;
const { TextArea } = Input;

const ImportOne = () => {
  const { equipment_statuses } = useContext(FilterContext);
  const [form] = Form.useForm();
  const [selectedImage, setSelectedImage] = useState<any>('');
  const [image, setImage] = useState<any>('');
  const [type, setType] = useState({});
  const [loading, setLoading] = useState<boolean>(false);
  const [dataChange, setDataChange] = useState<any>({});
  const navigate = useNavigate();

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
    equipmentApi
      .create(data)
      .then((res: any) => {
        const { success, message } = res.data;
        if (success) {
          toast.success('Thêm mới thiết bị thành công!');
          setImage('');
          setSelectedImage('');
          form.resetFields();
          navigate(`/equipments/list_equipments`);
        } else {
          toast.error(message);
        }
      })
      .catch()
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">NHẬP THIẾT BỊ</div>
      </div>

      <Divider />
      <div className="flex flex-row gap-6 my-8">
        <Form
          form={form}
          className="basis-3/4"
          layout="vertical"
          size="large"
          onFinish={onFinish}
          onChange={onchange}
        >
          <div className="grid grid-cols-2 gap-5">
            <Form.Item
              label="Tên thiết bị"
              name="name"
              required
              rules={[{ required: true, message: 'Hãy nhập tên thiết bị!' }]}
              className="mb-5"
            >
              <Input
                placeholder="Nhập tên thiết bị"
                allowClear
                className="input"
              />
            </Form.Item>

            <Form.Item
              label="Mã thiết bị"
              className="mb-5"
              name="code"
              required
              rules={[{ required: true, message: 'Hãy nhập tên thiết bị!' }]}
            >
              <Input
                placeholder="Nhập mã thiết bị"
                allowClear
                className="input"
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <Form.Item
              label="Nước sản suất"
              name="manufacturing_country"
              className="mb-5"
            >
              <Input
                placeholder="Nhập nước sản xuất"
                allowClear
                className="input"
              />
            </Form.Item>
            <Form.Item
              label="Đơn vị tính "
              name="unit"
              className="mb-5"
              required
              rules={[{ required: true, message: 'Hãy nhập đơn vị tính!' }]}
            >
              <Input
                placeholder="Nhập đơn vị tính"
                allowClear
                className="input"
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <Form.Item
              label="Số lượng"
              name="quantity"
              required
              rules={[{ required: true, message: 'Hãy nhập số lượng!' }]}
              className="mb-5"
            >
              <Input placeholder="Nhập số lượng" allowClear className="input" />
            </Form.Item>

            <Form.Item
              label="Đơn giá"
              name="unit_price"
              className="mb-5"
              required
              rules={[{ required: true, message: 'Hãy nhập đơn giá!' }]}
            >
              <Input placeholder="Nhập đơn giá" allowClear className="input" />
            </Form.Item>
          </div>

          <Form.Item>
            <Button
              className="button-primary"
              htmlType="submit"
              loading={loading}
            >
              Thêm
            </Button>
          </Form.Item>
        </Form>

        <div className="flex flex-col gap-4 items-center basis-1/4 ">
          <div className="text-center leading-9 ">Hình ảnh thiết bị</div>
          {selectedImage === '' ? (
            <img
              src={ava}
              alt="Hình ảnh thiết bị"
              className="w-52 h-52  rounded-lg"
            />
          ) : (
            <div
              className="w-52 h-52 rounded-lg bg-center bg-no-repeat bg-cover"
              style={{ backgroundImage: `url(${selectedImage})` }}
            ></div>
          )}
          {/* </label> */}
          <div className="mt-6">Chọn hình ảnh thiết bị</div>
          <input
            type="file"
            className="block file:bg-violet-100 file:text-violet-700 text-slate-500 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold hover:file:bg-violet-200"
            id="inputImage"
            onChange={(e: any) => handleChangeImg(e)}
          />
        </div>
      </div>
    </div>
  );
};

export default ImportOne;
