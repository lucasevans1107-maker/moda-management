import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Overview from './pages/Overview';
import Requests from './pages/Requests';
import RequestDetail from './pages/RequestDetail';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Vendors from './pages/Vendors';
import Receptionist from './pages/Receptionist';
import Settings from './pages/Settings';
import HomeownerView from './pages/HomeownerView';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Overview />} />
          <Route path="requests" element={<Requests />} />
          <Route path="requests/:id" element={<RequestDetail />} />
          <Route path="properties" element={<Properties />} />
          <Route path="properties/:id" element={<PropertyDetail />} />
          <Route path="vendors" element={<Vendors />} />
          <Route path="receptionist" element={<Receptionist />} />
          <Route path="settings" element={<Settings />} />
          <Route path="homeowner-view/:requestId" element={<HomeownerView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
