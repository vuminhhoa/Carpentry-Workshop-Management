import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Signin from 'containers/Signin';
import Signup from 'containers/Signup';
import ResetPassword from 'containers/ResetPassword';
import NotFoundPage from 'containers/NotFoundPage';
import PrivateRoute from 'routes/PrivateRoute';
import List from 'containers/Equipment/List';
import Detail from 'containers/Equipment/Detail';
import ImportOne from 'containers/Equipment/ImportOne';
import UpdateEquipment from 'containers/Equipment/Update';

import Department from 'containers/Organization/Department';
import CreateDepartment from 'containers/Organization/Department/create';
import DetailDepartment from 'containers/Organization/Department/detail';
import Provider from 'containers/Organization/Provider';
import CreateProvider from 'containers/Organization/Provider/create';
import DetailProvider from 'containers/Organization/Provider/detail';
import User from 'containers/User';
import CreateUser from 'containers/User/create';
import DetailUser from 'containers/User/detail';

import EquipmentStatus from 'containers/Category/Equipment_Status';
import CreateEquipmentStatus from 'containers/Category/Equipment_Status/create';
import DetailEquipmentStatus from 'containers/Category/Equipment_Status/detail';
import ActiveAccount from 'containers/ActiveAccount';
import SetRole from 'containers/Setting/SetRole';
import UpdatePermission from 'containers/Setting/SetRole/update';

import Supply from 'containers/Supply';
import SupplyCreate from 'containers/Supply/create';
import SupplyImportExcel from 'containers/Supply/ImportExcel';
import SupplyDetail from 'containers/Supply/detail';
import ListEqCorresponding from 'containers/Supply/ListEqCorresponding';
import { ToastContainer } from 'react-toastify';
import EmailConfig from 'containers/Setting/Symtem/EmailConfig';
import Profile from 'containers/Profile';
import ReactGA from 'react-ga';
import TagManager, { TagManagerArgs } from 'react-gtm-module';

const TRACKING_ID = process.env.REACT_APP_TRACKING_ID || '';
ReactGA.initialize(TRACKING_ID);

const GTM_ID = process.env.REACT_APP_GTM_ID || '';
const tagManagerArgs: TagManagerArgs = {
  gtmId: GTM_ID,
};
TagManager.initialize(tagManagerArgs);

const App = () => {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<PrivateRoute>{/* <Dashboard /> */}</PrivateRoute>}
          />

          {/* Equipment Routes */}
          <Route
            path="/equipments/list_equipments"
            element={
              <PrivateRoute>
                <List />
              </PrivateRoute>
            }
          />
          <Route
            path="/equipments/create_equipment"
            element={
              <PrivateRoute>
                <ImportOne />
              </PrivateRoute>
            }
          />
          <Route
            path="/equipments/detail_equipment/:id"
            element={
              <PrivateRoute>
                <Detail />
              </PrivateRoute>
            }
          />
          <Route
            path="/equipments/update_equipment/:id"
            element={
              <PrivateRoute>
                <UpdateEquipment />
              </PrivateRoute>
            }
          />
          <Route
            path="/equipments/import_one_eq"
            element={
              <PrivateRoute>
                <ImportOne />
              </PrivateRoute>
            }
          />

          {/* Supply Routes */}
          <Route
            path="/supplies/list_supplies"
            element={
              <PrivateRoute>
                <Supply />
              </PrivateRoute>
            }
          />
          <Route
            path="/supplies/import_excel_sp"
            element={
              <PrivateRoute>
                <SupplyImportExcel />
              </PrivateRoute>
            }
          />
          <Route
            path="/supplies/detail_supply/:id"
            element={
              <PrivateRoute>
                <SupplyDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/supplies/create_supply"
            element={
              <PrivateRoute>
                <SupplyCreate />
              </PrivateRoute>
            }
          />
          <Route
            path="/supplies/list_equipment_corresponding/:id"
            element={
              <PrivateRoute>
                <ListEqCorresponding />
              </PrivateRoute>
            }
          />

          {/* Organization Routes */}
          <Route
            path="/organization/department"
            element={
              <PrivateRoute>
                <Department />
              </PrivateRoute>
            }
          />
          <Route
            path="/organization/department/create"
            element={
              <PrivateRoute>
                <CreateDepartment />
              </PrivateRoute>
            }
          />
          <Route
            path="/organization/department/detail/:id"
            element={
              <PrivateRoute>
                <DetailDepartment />
              </PrivateRoute>
            }
          />
          <Route
            path="/organization/provider"
            element={
              <PrivateRoute>
                <Provider />
              </PrivateRoute>
            }
          />
          <Route
            path="/organization/provider/create"
            element={
              <PrivateRoute>
                <CreateProvider />
              </PrivateRoute>
            }
          />
          <Route
            path="/organization/provider/detail/:id"
            element={
              <PrivateRoute>
                <DetailProvider />
              </PrivateRoute>
            }
          />

          {/* User Routes */}
          <Route
            path="/user/list_user"
            element={
              <PrivateRoute>
                <User />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/create_user"
            element={
              <PrivateRoute>
                <CreateUser />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/detail/:id"
            element={
              <PrivateRoute>
                <DetailUser />
              </PrivateRoute>
            }
          />

          {/* Profile Routes */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* Category Routes */}

          {/* Group */}

          {/* Status */}
          <Route
            path="/category/status"
            element={
              <PrivateRoute>
                <EquipmentStatus />
              </PrivateRoute>
            }
          />
          <Route
            path="/category/status/create"
            element={
              <PrivateRoute>
                <CreateEquipmentStatus />
              </PrivateRoute>
            }
          />
          <Route
            path="/category/status/detail/:id"
            element={
              <PrivateRoute>
                <DetailEquipmentStatus />
              </PrivateRoute>
            }
          />

          {/* Setting Routes */}
          <Route
            path="/setting/role"
            element={
              <PrivateRoute>
                <SetRole />
              </PrivateRoute>
            }
          />
          <Route
            path="/setting/role/update/:role/:id"
            element={
              <PrivateRoute>
                <UpdatePermission />
              </PrivateRoute>
            }
          />

          <Route
            path="/setting/email-config"
            element={
              <PrivateRoute>
                <EmailConfig />
              </PrivateRoute>
            }
          />

          {/* Auth Routes */}
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/active/:active_token" element={<ActiveAccount />} />
          <Route path="/reset_password" element={<ResetPassword />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default App;
