const dotenv = require('dotenv');
const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');

const { getDeviceId } = require('./middlewares/device');
const subscribe = require('./routes/subscribe');
const reminders = require('./routes/reminders');

dotenv.config();
const app = express();

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.json());

app.use(getDeviceId);

app.use('/subscribe', subscribe);
app.use('/reminders', reminders);

app.listen(process.env.PORT, () => console.log(`Server listenting on port ${process.env.PORT}`));