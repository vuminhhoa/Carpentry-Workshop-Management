import { ImportOutlined } from '@ant-design/icons';
import { Button, DatePicker, Divider, Form, Input, Select, Image } from 'antd';
import { useContext, useEffect, useState } from 'react';
import ava from 'assets/image.png';
import { convertBase64, formatCurrency } from 'utils/globalFunc.util';
import { useNavigate, useParams } from 'react-router-dom';
import carpenterApi from 'api/carpenter.api';
import { toast } from 'react-toastify';
import { FilterContext } from 'contexts/filter.context';
import moment from 'moment';
import Loading from 'components/Loading';

const { TextArea } = Input;

const UpdateCarpenter = () => {
  const { carpenter_statuses } = useContext(FilterContext);
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
  const [carpenter, setCarpenter] = useState<any>({});
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

  const getDetailCarpenter = (id: any) => {
    setLoading(true);
    carpenterApi
      .detail(id)
      .then((res: any) => {
        const { success, data } = res.data;
        let carpenter = data.carpenter;
        if (success) {
          form.setFieldsValue({
            id: carpenter.id,
            name: carpenter.name,
            address: carpenter.address,
            phone: carpenter.phone,
            gender: carpenter.gender,
            status_id: carpenter.status_id,
            image: carpenter.image,
          });
          setCarpenter(carpenter);
          setImage(carpenter.image);
        }
      })
      .catch()
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    getDetailCarpenter(id);
  }, [id]);

  const onFinish = (values: any) => {
    const data = { ...values, image };
    console.log(data);
    setLoadingUpdate(true);
    carpenterApi
      .update(data)
      .then((res: any) => {
        const { success } = res.data;
        if (success) {
          toast.success('Cập nhật thợ thành công');
          navigate(`/carpenters/detail_carpenter/${carpenter.id}`);
        } else {
          toast.error('Cập nhật thợ thất bại');
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
        <div className="title">CẬP NHẬT THỢ</div>
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
                label="Tên thợ"
                name="name"
                required
                rules={[{ required: true, message: 'Hãy nhập tên thợ!' }]}
                className="mb-5"
              >
                <Input
                  placeholder="Nhập tên thợ"
                  allowClear
                  className="input"
                />
              </Form.Item>

              <Form.Item
                label="Trạng thái thợ"
                name="status_id"
                required
                rules={[
                  { required: true, message: 'Hãy chọn trạng thái thợ!' },
                ]}
                className="mb-5"
              >
                <Select
                  showSearch
                  placeholder="Chọn trạng thái thợ"
                  optionFilterProp="children"
                  allowClear
                  filterOption={(input, option) =>
                    (option!.label as unknown as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={options(carpenter_statuses)}
                />
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <Form.Item label="Địa chỉ" name="address" className="mb-5">
                <Input
                  placeholder="Nhập địa chỉ thợ"
                  allowClear
                  className="input"
                />
              </Form.Item>
              <Form.Item
                label="Số điện thoại"
                name="phone"
                className="mb-5"
                required
                rules={[
                  {
                    required: true,
                    message: 'Hãy nhập số điện thoại của thợ!',
                  },
                ]}
              >
                <Input
                  placeholder="Nhập số điện thoại"
                  allowClear
                  className="input"
                />
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <Form.Item label="Giới tính" name="gender" className="mb-5">
                <Input
                  placeholder="Nhập giới tính thợ"
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
            <div className="text-center leading-9 ">Hình ảnh thợ</div>

            {selectedImage === '' ? (
              <img
                src={image !== null ? image : ava}
                alt="Hình ảnh thợ"
                className="w-52 h-52  rounded-lg"
              />
            ) : (
              <div
                className="w-52 h-52 rounded-lg bg-center bg-no-repeat bg-cover"
                style={{ backgroundImage: `url(${selectedImage})` }}
              ></div>
            )}
            {/* </label> */}
            <div className="mt-6">Thay đổi hình ảnh thợ</div>
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

export default UpdateCarpenter;
