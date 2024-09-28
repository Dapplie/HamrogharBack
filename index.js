const express = require('express');
const cors = require('cors');
var multer = require('multer');
var upload = multer();
const authRoutes = require('./routes/Auth')
const profileRoutes = require('./routes/Profile')
const BookNowRouter = require('./routes/BookNow')
const Chat = require('./routes/Chat')
const AdminAccount = require('./routes/AdminAccount')
const Tenant_profile = require('./routes/tenantProfile')
const multer_router = require('./routes/multer')
const RealEstateRoutes = require('./routes/RealEstate')
const notification_router = require('./routes/Notification')

require('./db');
// const os = require('os');

const PORT = process.env.PORT || 3030;
// const IP_ADDRESS = getPrivateIpAddress();

// function getPrivateIpAddress() {
//     const interfaces = os.networkInterfaces();
//     for (let interfaceName in interfaces) {
//         const interfaceInfo = interfaces[interfaceName];
//         for (let i = 0; i < interfaceInfo.length; i++) {
//             const info = interfaceInfo[i];
//             if (!info.internal && info.family === 'IPv4') {
//                 return info.address;
//             }
//         }
//     }
//     return '127.0.0.1'; 
// }

const app = express();
// fjefoierjfoir
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

app.use(express.json());
// ewuhfiuewhfiuehfiurehf
app.use('/uploads', express.static('uploads'));
app.use('/upload', multer_router);
app.use(upload.array());

app.use('/auth', authRoutes);
app.use('/profile_routes', profileRoutes);
app.use('/real_estate', RealEstateRoutes);
app.use('/book_now', BookNowRouter);
app.use('/chat', Chat);
app.use('/admin_account', AdminAccount);
app.use('/tenant_profile', Tenant_profile);
app.use('/notification', notification_router);


app.use((error, req, res, next) => {
  if (error) {
    const message = error.message || 'Something went wrong. Try again later.';
    const status = error.status || 500;
    return res.status(status).send(message);
  }
});
// feiuhfiurehf
app.listen(PORT,   () => {
  console.log(`server started on http://localhost:${PORT}`);
});
