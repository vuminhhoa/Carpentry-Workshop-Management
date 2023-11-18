import React, { useState, useEffect } from 'react';
import { Layout, Menu, Row, Avatar, Dropdown, Space } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  UserOutlined,
  DownOutlined,
  UsergroupAddOutlined,
  SisternodeOutlined,
  ClusterOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useDispatch } from 'react-redux';
import { authActions } from 'store/slices/auth.slice';
import ModalChangePassword from 'components/ModalChangePassword';
import { CURRENT_USER } from 'constants/auth.constant';
import './index.css';
import userApi from 'api/user.api';
import logo from '../../assets/logo.png';

const { Header, Sider, Content, Footer } = Layout;
interface LayoutProps {
  children: React.ReactNode;
}

type MenuItem = Required<MenuProps>['items'][number];

const LayoutSystem = (props: LayoutProps) => {
  const dispatch = useDispatch();
  const [image, setImage] = useState<any>('');
  const navigate = useNavigate();
  const location = useLocation();
  const pathName: any = location.pathname.split('/');
  const [collapsed, setCollapsed] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] =
    useState<boolean>(false);
  const user: any = JSON.parse(localStorage.getItem(CURRENT_USER) || '');

  const getUserImage = () => {
    userApi
      .getProfile(user.id)
      .then((res: any) => {
        setImage(res.data.data.user.image);
      })
      .catch();
  };

  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group'
  ): any {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }

  const items: MenuProps['items'] = [
    getItem(
      'Quản lý thiết bị',
      '/equipments',

      <ClusterOutlined style={{ fontSize: '20px' }} />,
      [
        getItem('Danh sách thiết bị', '/list_equipments'),
        getItem('Nhập thiết bị đơn lẻ', '/create_equipment'),
      ]
    ),

    getItem(
      'Quản lý vật tư',
      '/supplies',

      <SisternodeOutlined style={{ fontSize: '20px' }} />,
      [
        getItem('Danh sách vật tư', '/list_supplies'),

        getItem('Nhập vật tư đơn lẻ', '/create_supply'),
      ]
    ),
    getItem(
      'Quản lý đơn hàng',
      '/orders',

      <UserOutlined style={{ fontSize: '20px' }} />,
      [
        getItem('Danh sách đơn hàng', '/list'),
        getItem('Thêm mới đơn hàng', '/create'),
      ]
    ),
    getItem(
      'Quản lý chấm công',
      '/timekeeping_logs',

      <UsergroupAddOutlined style={{ fontSize: '20px' }} />,
      [
        getItem('Danh sách chấm công', '/list_timekeeping_logs'),
        getItem('Chấm công ngày', '/create_timekeeping_log'),
      ]
    ),
    getItem(
      'Quản lý thợ',
      '/carpenters',

      <UserOutlined style={{ fontSize: '20px' }} />,
      [
        getItem('Danh sách thợ', '/list_carpenters'),
        getItem('Thêm mới thợ', '/create_carpenter'),
      ]
    ),
  ];

  const onClick: MenuProps['onClick'] = (e) => {
    navigate(`${e.keyPath[1]}${e.keyPath[0]}`);
  };

  const handleLogout = () => {
    dispatch(authActions.logout());
  };

  useEffect(() => {
    getUserImage();
  }, [user.id]);

  return (
    <Layout>
      <Header className="bg-white  px-4  flex flex-row items-center justify-between ">
        {React.createElement(
          collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
          {
            className: 'trigger menu-icon p-[10px]',
            onClick: () => {
              setCollapsed(!collapsed);
            },
          }
        )}
        <div
          className="flex flex-row items-center cursor-pointer  "
          onClick={() => navigate('/')}
        >
          <Space>
            <img src={logo} alt="logo" className="logo" />
            <div className="font-medium text-base ">
              <h2>XƯỞNG MỘC TOÀN HẠNH</h2>
            </div>
          </Space>
        </div>

        <Space className="h-[40px] flex flex-row items-center">
          {/* notifications */}

          {/* Avatar */}
          <Dropdown
            trigger={['click']}
            arrow
            className="trigger items-center flex flex-row h-[40px] "
            overlay={
              <Menu className="rounded-lg">
                <Menu.Item key="profile">
                  <Link to="/profile">Tài khoản</Link>
                </Menu.Item>
                <Menu.Item key="change_password">
                  <Row onClick={() => setShowChangePasswordModal(true)}>
                    Thay đổi mật khẩu
                  </Row>
                </Menu.Item>
                <Menu.Item key="signout" onClick={handleLogout}>
                  Đăng xuất
                </Menu.Item>
              </Menu>
            }
            placement="bottomRight"
          >
            <Space>
              <Avatar
                src={image}
                icon={<UserOutlined />}
                className="w-[40px] h-[40px] flex flex-row place-content-center"
              />

              <div className="h-[40px] flex flex-row items-center">
                {user?.name || user?.email}
              </div>
              <DownOutlined className=" flex flex-row " />
            </Space>
          </Dropdown>
        </Space>
      </Header>
      <Layout className="min-h-screen">
        <Sider
          trigger={null}
          collapsed={collapsed}
          width="250px"
          className="bg-white  p  "
          collapsedWidth={72}
        >
          <Menu
            mode="inline"
            onClick={onClick}
            defaultSelectedKeys={[`/${pathName[2]}`]}
            defaultOpenKeys={[`/${pathName[1]}`]}
            items={items}
            triggerSubMenuAction="click"
            className="font-medium "
          />
        </Sider>

        <Layout>
          <Content
            style={{
              margin: '24px 16px',
            }}
          >
            <div
              className="site-layout-background"
              style={{
                maxWidth: '1600px',
                margin: '0 auto',
                padding: 20,
              }}
            >
              {props.children}
            </div>
          </Content>
          <Footer>
            <div className="text-base font-medium">Copyright © 2023 Hòa Vũ</div>
          </Footer>
        </Layout>
      </Layout>

      <ModalChangePassword
        showChangePasswordModal={showChangePasswordModal}
        setShowChangePasswordModal={() => setShowChangePasswordModal(false)}
      />
    </Layout>
  );
};

export default LayoutSystem;
