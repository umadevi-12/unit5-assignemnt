const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const router = express.Router();
const User = require('../models/User');
const { sendMail } = require('../utils/mailer');


router.post('/signup', async (req, res) => { });

router.post('/login', async (req, res) => {  });

router.post('/forgot-password', async (req, res) => { });
router.post('/reset-password', async (req, res) => { });

module.exports = router;
