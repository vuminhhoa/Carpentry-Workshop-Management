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

import User from 'containers/User';
import CreateUser from 'containers/User/create';
import DetailUser from 'containers/User/detail';

import ActiveAccount from 'containers/ActiveAccount';

import { ToastContainer } from 'react-toastify';
import Profile from 'containers/Profile';
import ReactGA from 'react-ga';
import TagManager, { TagManagerArgs } from 'react-gtm-module';

import UpdateCarpenter from 'containers/Carpenter/Update';
import DetailCarpenter from 'containers/Carpenter/Detail';
import CreateCarpenter from 'containers/Carpenter/Create';
import ListCarpenters from 'containers/Carpenter/List';

import CreateSupply from 'containers/Supply/Create';
import DetailSupply from 'containers/Supply/Detail';
import ListSupply from 'containers/Supply/List';
import UpdateSupply from 'containers/Supply/Update';

import CreateTimekeepingLog from 'containers/TimekeepingLog/Create';
import DetailTimekeepingLog from 'containers/TimekeepingLog/Detail';
import ListTimekeepingLog from 'containers/TimekeepingLog/List';
import UpdateTimekeepingLog from 'containers/TimekeepingLog/Update';

import CreateOrder from 'containers/Order/Create';
import DetailOrder from 'containers/Order/Detail';
import ListOrder from 'containers/Order/List';
import UpdateOrder from 'containers/Order/Update';

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
          {/* Carpenter Routes */}
          <Route
            path="/carpenters/list_carpenters"
            element={
              <PrivateRoute>
                <ListCarpenters />
              </PrivateRoute>
            }
          />
          <Route
            path="/carpenters/create_carpenter"
            element={
              <PrivateRoute>
                <CreateCarpenter />
              </PrivateRoute>
            }
          />
          <Route
            path="/carpenters/detail_carpenter/:id"
            element={
              <PrivateRoute>
                <DetailCarpenter />
              </PrivateRoute>
            }
          />
          <Route
            path="/carpenters/update_carpenter/:id"
            element={
              <PrivateRoute>
                <UpdateCarpenter />
              </PrivateRoute>
            }
          />
          {/* Timekeeping Log Routes */}
          <Route
            path="/timekeeping_logs/list_timekeeping_logs"
            element={
              <PrivateRoute>
                <ListTimekeepingLog />
              </PrivateRoute>
            }
          />
          <Route
            path="/timekeeping_logs/create/:date"
            element={
              <PrivateRoute>
                <CreateTimekeepingLog />
              </PrivateRoute>
            }
          />
          <Route
            path="/timekeeping_logs/detail/:date"
            element={
              <PrivateRoute>
                <DetailTimekeepingLog />
              </PrivateRoute>
            }
          />
          <Route
            path="/timekeeping_logs/update/:date"
            element={
              <PrivateRoute>
                <UpdateTimekeepingLog />
              </PrivateRoute>
            }
          />
          {/* Order Routes */}
          <Route
            path="/orders/list"
            element={
              <PrivateRoute>
                <ListOrder />
              </PrivateRoute>
            }
          />
          <Route
            path="/orders/create"
            element={
              <PrivateRoute>
                <CreateOrder />
              </PrivateRoute>
            }
          />
          <Route
            path="/orders/detail/:id"
            element={
              <PrivateRoute>
                <DetailOrder />
              </PrivateRoute>
            }
          />
          <Route
            path="/orders/update/:id"
            element={
              <PrivateRoute>
                <UpdateOrder />
              </PrivateRoute>
            }
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
                <ListSupply />
              </PrivateRoute>
            }
          />
          <Route
            path="/supplies/update_supply/:id"
            element={
              <PrivateRoute>
                <UpdateSupply />
              </PrivateRoute>
            }
          />
          <Route
            path="/supplies/detail_supply/:id"
            element={
              <PrivateRoute>
                <DetailSupply />
              </PrivateRoute>
            }
          />
          <Route
            path="/supplies/create_supply"
            element={
              <PrivateRoute>
                <CreateSupply />
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
