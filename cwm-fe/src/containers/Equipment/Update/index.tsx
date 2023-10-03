import { Button, Divider, Form, Input, Select } from 'antd';
import { useContext, useEffect, useState } from 'react';
import ava from 'assets/image.png';
import { convertBase64 } from 'utils/globalFunc.util';
import { useNavigate, useParams } from 'react-router-dom';
import equipmentApi from 'api/equipment.api';
import { toast } from 'react-toastify';
import { FilterContext } from 'contexts/filter.context';
import Loading from 'components/Loading';


const UpdateEquipment = () => {
  const { equipment_statuses } = useContext(FilterContext);
  console.log(equipment_statuses);
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
  const [equipment, setEquipment] = useState<any>({});

  const handleChangeImg = async (e: any) => {
    let file = e.target.files[0];
    if (file) {
      let img = URL.createObjectURL(file);
      let fileBase64 = await convertBase64(file);
      setSelectedImage(img);
      setImage(fileBase64);
    }
  };

  const getDetailEquipment = (id: any) => {
    setLoading(true);
    equipmentApi
      .detail(id)
      .then((res: any) => {
        const { success, data } = res.data;
        let equipment = data.equipment;
        if (success) {
          form.setFieldsValue({
            id: equipment.id,
            name: equipment.name,
            code: equipment.code,
            status_id: equipment.status_id,
            manufacturing_country: equipment.manufacturing_country,
            unit: equipment.unit,
            unit_price: equipment.unit_price,
            quantity: equipment.quantity,
            image: equipment.image,
          });
          setEquipment(equipment);
          setImage(equipment.image);
        }
      })
      .catch()
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    getDetailEquipment(id);
  }, [id]);

  const onFinish = (values: any) => {
    const data = { ...values, image };
    setLoadingUpdate(true);
    equipmentApi
      .update(data)
      .then((res: any) => {
        const { success } = res.data;
        if (success) {
          toast.success('Cập nhật thiết bị thành công');
          navigate(`/equipments/detail_equipment/${equipment.id}`);
        } else {
          toast.error('Cập nhật thiết bị thất bại');
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
        <div className="title">CẬP NHẬT THIẾT BỊ</div>
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
                label="Trạng thái thiết bị"
                name="status_id"
                required
                rules={[
                  { required: true, message: 'Hãy chọn trạng thái thiết bị!' },
                ]}
                className="mb-5"
              >
                <Select
                  showSearch
                  placeholder="Chọn trạng thái thiết bị"
                  optionFilterProp="children"
                  allowClear
                  filterOption={(input, option) =>
                    (option!.label as unknown as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={options(equipment_statuses)}
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
                  { required: true, message: 'Hãy nhập xuất sứ của thiết bị!' },
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
                  { required: true, message: 'Hãy nhập xuất sứ của thiết bị!' },
                ]}
              >
                <Input
                  placeholder="Nhập số lượng thiết bị"
                  allowClear
                  className="input"
                />
              </Form.Item>

              <Form.Item
                label="Đơn giá"
                name="unit_price"
                required
                rules={[
                  { required: true, message: 'Hãy nhập xuất sứ của thiết bị!' },
                ]}
                className="mb-5"
              >
                <Input
                  placeholder="Nhập xuất sứ của thiết bị"
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
            <div className="text-center leading-9 ">Hình ảnh thiết bị</div>

            {selectedImage === '' ? (
              <img
                src={image !== null ? image : ava}
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
            <div className="mt-6">Thay đổi hình ảnh thiết bị</div>
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

export default UpdateEquipment;
