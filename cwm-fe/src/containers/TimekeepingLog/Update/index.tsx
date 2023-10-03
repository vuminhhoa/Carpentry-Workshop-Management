import { ImportOutlined } from '@ant-design/icons';
import { Button, DatePicker, Divider, Form, Input, Select, Image } from 'antd';
import { useContext, useEffect, useState } from 'react';
import ava from 'assets/image.png';
import { convertBase64, formatCurrency } from 'utils/globalFunc.util';
import { useNavigate, useParams } from 'react-router-dom';
import supplyApi from 'api/supply.api';
import { toast } from 'react-toastify';
import { FilterContext } from 'contexts/filter.context';
import moment from 'moment';
import Loading from 'components/Loading';

const { TextArea } = Input;

const UpdateSupply = () => {
  const options = (array: any) => {
    return array.map((item: any) => {
      let o: any = {};
      o.value = item.id;
      o.label = item.name;
      return o;
    });
  };

  const navigate = useNavigate();
  const params: any = useParams();
  const { id } = params;
  const [form] = Form.useForm();
  const [selectedImage, setSelectedImage] = useState<any>('');
  const [image, setImage] = useState<any>('');
  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataChange, setDataChange] = useState<any>({});
  const [supply, setSupply] = useState<any>({});
  const [type, setType] = useState({});

  const handleChangeImg = async (e: any) => {
    let file = e.target.files[0];
    if (file) {
      let img = URL.createObjectURL(file);
      let fileBase64 = await convertBase64(file);
      setSelectedImage(img);
      setImage(fileBase64);
    }
  };

  const getDetailSupply = (id: any) => {
    setLoading(true);
    supplyApi
      .detail(id)
      .then((res: any) => {
        const { success, data } = res.data;
        let supply = data.supply;
        if (success) {
          form.setFieldsValue({
            id: supply.id,
            name: supply.name,
            code: supply.code,
            status_id: supply.status_id,
            manufacturing_country: supply.manufacturing_country,
            unit: supply.unit,
            unit_price: supply.unit_price,
            quantity: supply.quantity,
            image: supply.image,
          });
          setSupply(supply);
          setImage(supply.image);
        }
      })
      .catch()
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    getDetailSupply(id);
  }, [id]);

  const onFinish = (values: any) => {
    const data = { ...values, image };
    setLoadingUpdate(true);
    supplyApi
      .update(data)
      .then((res: any) => {
        const { success } = res.data;
        if (success) {
          toast.success('Cập nhật vật tư thành công');
          navigate(`/supplys/detail_supply/${supply.id}`);
        } else {
          toast.error('Cập nhật vật tư thất bại');
        }
      })
      .catch()
      .finally(() => setLoadingUpdate(false));
  };

  const onchange = (e: any) => {
    const newDataChange = { ...dataChange, [e.target.id]: e.target.value };
    console.log(newDataChange);
    setDataChange(newDataChange);
  };

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">CẬP NHẬT VẬT TƯ</div>
      </div>

      <Divider />
      {loading ? (
        <Loading />
      ) : (
        // <div className="flex-between mt-10">
        <div className="flex flex-row gap-6 my-8">
          <Form
            form={form}
            className="basis-3/4 "
            layout="vertical"
            size="large"
            onFinish={onFinish}
            onChange={onchange}
          >
            <Form.Item name="id" className="mb-5 hidden ">
              <Input className="input" />
            </Form.Item>

            <div className="grid grid-cols-2 gap-5">
              <Form.Item
                label="Tên vật tư"
                name="name"
                required
                rules={[{ required: true, message: 'Hãy nhập tên vật tư!' }]}
                className="mb-5"
              >
                <Input
                  placeholder="Nhập tên vật tư"
                  allowClear
                  className="input"
                />
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <Form.Item
                label="Nước sản xuất"
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
                label="Đơn vị tính"
                name="unit"
                className="mb-5"
                required
                rules={[
                  { required: true, message: 'Hãy nhập xuất sứ của vật tư!' },
                ]}
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
                className="mb-5"
                required
                rules={[
                  { required: true, message: 'Hãy nhập xuất sứ của vật tư!' },
                ]}
              >
                <Input
                  placeholder="Nhập số lượng vật tư"
                  allowClear
                  className="input"
                />
              </Form.Item>

              <Form.Item
                label="Đơn giá"
                name="unit_price"
                required
                rules={[
                  { required: true, message: 'Hãy nhập xuất sứ của vật tư!' },
                ]}
                className="mb-5"
              >
                <Input
                  placeholder="Nhập xuất sứ của vật tư"
                  allowClear
                  className="input"
                />
              </Form.Item>
            </div>

            <Form.Item>
              <Button
                htmlType="submit"
                className="button-primary"
                loading={loadingUpdate}
              >
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
          <div className="flex flex-col gap-4 items-center basis-1/4 ">
            <div className="text-center leading-9 ">Hình ảnh vật tư</div>

            {selectedImage === '' ? (
              <img
                src={image !== null ? image : ava}
                alt="Hình ảnh vật tư"
                className="w-52 h-52  rounded-lg"
              />
            ) : (
              <div
                className="w-52 h-52 rounded-lg bg-center bg-no-repeat bg-cover"
                style={{ backgroundImage: `url(${selectedImage})` }}
              ></div>
            )}
            {/* </label> */}
            <div className="mt-6">Thay đổi hình ảnh vật tư</div>
            <input
              type="file"
              className="block file:bg-violet-100 file:text-violet-700 text-slate-500 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold hover:file:bg-violet-200"
              id="inputImage"
              onChange={(e: any) => handleChangeImg(e)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateSupply;
