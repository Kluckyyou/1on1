import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Login from './pages/Login/LoginPage';
import Register from './pages/Register/RegisterPage';
import Dashboard from './pages/Dashboard/DashboardPage';
import Account from './pages/Account/AccountPage';
import Contacts from './pages/Contacts/ContactsPage';
import ContactDetail from './pages/ContactDetail/ContactDetail';
import Notifications from './pages/Notifications/NotificationsPage';
function App() {
    return <BrowserRouter>
        <Routes>
            <Route path="/">
                <Route index element={<Login />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="account" element={<Account />} />
                <Route path="contacts" element={<Contacts />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="contact-detail/:contactId" element={<ContactDetail />} />
            </Route>
        </Routes>
    </BrowserRouter>;
}

export default App; // Make sure you have this line to export App