import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/shared/Layout'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import NewPPPAccount from './pages/NewPPPAccount'
import PPPAccounts from './pages/PPPAccounts'
import EditPPPAccount from './pages/EditPPPAccount'
import PPPClient from './pages/PPPClient'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoutes'
import Modal from 'react-modal';
import PPPProfiles from './pages/PPPProfiles'
import MikrotikRouter from './pages/MikrotikRouter'
import Customers from './pages/Customers'
import Client from './pages/Client'
import Pool from './pages/Pool'
import PPPServer from './pages/PPPServer'
import SMSConfig from './pages/SMSConfig'
import PaymentConfig from './pages/PaymentConfig'
import Addresses from './pages/Addresses'
import DHCPServer from './pages/DHCPServer'
import DHCPNetwork from './pages/DHCPNetwork'
import DHCPPackage from './pages/DHCPPackages'
import EmailConfig from './pages/EmailConfig'
import StaticPage from './pages/StaticPage'
import Phone from './pages/Phone'
import HotspotPackage from './pages/HotspotPackage'
import Unifi from './pages/Unifi'
import ActiveDevices from './pages/ActiveDevices'
import AccessPoints from './pages/AccessPoints'
import HotspotEvents from './pages/HotspotEvents'
import PaymentsReport from './pages/PaymentsReport'
import MpesaExpress from './pages/MpesaExpress'
import ConnectionsReport from './pages/ConnectionsReport '
import SentSMS from './pages/SentSMS'
import SentEmails from './pages/SentEmails'
import PPPoEClients from './pages/PPPoEClients'
import StaticClients from './pages/StaticClients'
import UserProfile from './pages/UserProfile'
import ChangeUsersPassword from './pages/ChangeUsersPassword'
import SendPasswordEmail from './pages/SendPasswordEmail'

Modal.setAppElement('#root');
function Logout() {
    localStorage.clear()
    return <Navigate to="/login" />
}

function RegisterAndLogout() {
    localStorage.clear()
    return <Register />
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<ProtectedRoute > <Layout /> </ProtectedRoute>}>
                    <Route index element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
                    <Route path="products" element={<ProtectedRoute> <Products /> </ProtectedRoute>} />
                    <Route path="ppp-accounts" element={<ProtectedRoute> <PPPAccounts /> </ProtectedRoute>} />
                    <Route path="ppp/profiles" element={<ProtectedRoute> <PPPProfiles /> </ProtectedRoute>} />
                    <Route path="new-ppp-account" element={<ProtectedRoute> <NewPPPAccount /> </ProtectedRoute>} />
                    <Route path="ppp-account-edit" element={<ProtectedRoute> <EditPPPAccount /> </ProtectedRoute>} />
                    <Route path="client/ppp" element={<ProtectedRoute> <PPPClient /> </ProtectedRoute>} />
                    <Route path="client" element={<ProtectedRoute> <Client /> </ProtectedRoute>} />
                    <Route path="router" element={<ProtectedRoute> <MikrotikRouter />  </ProtectedRoute>} />
                    <Route path="email" element={<ProtectedRoute> <EmailConfig />  </ProtectedRoute>} />
                    <Route path="pool" element={<ProtectedRoute> <Pool/>  </ProtectedRoute>} />
                    <Route path="ppp-server" element={<ProtectedRoute> <PPPServer/>  </ProtectedRoute>} />
                    <Route path="customers" element={<ProtectedRoute> <Customers /> </ProtectedRoute>} />
                    <Route path="sms" element={<ProtectedRoute> <SMSConfig /> </ProtectedRoute>} />
                    <Route path="mpesa" element={<ProtectedRoute> <PaymentConfig/> </ProtectedRoute>} />
                    <Route path="addresses" element={<ProtectedRoute> <Addresses /> </ProtectedRoute>} />
                    <Route path="dhcp/server" element={<ProtectedRoute> <DHCPServer /> </ProtectedRoute>} />
                    <Route path="dhcp/network" element={<ProtectedRoute> <DHCPNetwork /> </ProtectedRoute>} />
                    <Route path="dhcp/packages" element={<ProtectedRoute> <DHCPPackage /> </ProtectedRoute>} />
                    <Route path="products" element={<ProtectedRoute> <Products /> </ProtectedRoute>} />
                    <Route path="/packages" element={<ProtectedRoute> <HotspotPackage /> </ProtectedRoute>} />
                    <Route path="/unifi" element={<ProtectedRoute> <Unifi /> </ProtectedRoute>} />
                    <Route path="/devices" element={<ProtectedRoute> <ActiveDevices /> </ProtectedRoute>} />
                    <Route path="/access-points" element={<ProtectedRoute> <AccessPoints /> </ProtectedRoute>} />
                    <Route path="/events" element={<ProtectedRoute> <HotspotEvents /> </ProtectedRoute>} />
                    <Route path="/payments" element={<ProtectedRoute> <PaymentsReport /> </ProtectedRoute>} />
                    <Route path="/connections" element={<ProtectedRoute> <ConnectionsReport/> </ProtectedRoute>} />
                    <Route path="/mpesa-express" element={<ProtectedRoute> <MpesaExpress/> </ProtectedRoute>} />
                    <Route path="/sent-sms" element={<ProtectedRoute> <SentSMS /> </ProtectedRoute>} />
                    <Route path="/sent-emails" element={<ProtectedRoute> <SentEmails /> </ProtectedRoute>} />
                    <Route path="/customers/ppp" element={<ProtectedRoute> <PPPoEClients /> </ProtectedRoute>} />
                    <Route path="/customers/static" element={<ProtectedRoute> <StaticClients /> </ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute> <UserProfile /> </ProtectedRoute>} />
                </Route>
                <Route path="/password/recover" element={<ChangeUsersPassword />} />
                <Route path="/forgot-password" element={<SendPasswordEmail />} />
                <Route path="/register" element={<RegisterAndLogout />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/guest/s/default" element={<StaticPage />} />
                <Route path="/phone" element={<Phone />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    )
}

export default App
