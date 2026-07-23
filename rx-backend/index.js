const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Supabase Connection
const SUPABASE_URL = 'https://xorxoovezlgqcaeyqpdp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_5_yPXUnjJVe3dy13X5nkXQ_afJ7rCvM';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// १. Signup / Register API (ニックネーム समेत)
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, address, phone, dob, nickname, password, role } = req.body;

    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'इमेल पहिले नै दर्ता भइसकेको छ!' });
    }

    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email, address, phone, dob, nickname, password, role: role || 'user' }])
      .select();

    if (error) throw error;

    res.json({ message: 'खाता सफलतापूर्वक सिर्जना भयो!', user: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// २. Login API
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single();

    if (error || !data) {
      return res.status(401).json({ error: 'इमेल वा पासवर्ड मिलेन!' });
    }

    res.json({ message: 'लगइन सफल भयो!', user: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ३. Find Account API (Email/Phone र Nickname जाँच्नको लागि)
app.post('/api/find-account', async (req, res) => {
  try {
    const { identifier, nickname } = req.body;

    let query = supabase.from('users').select('id, name, email, phone, dob, nickname');
    if (identifier.includes('@')) {
      query = query.ilike('email', identifier);
    } else {
      query = query.eq('phone', identifier);
    }

    const { data, error } = await query.single();

    if (error || !data) {
      return res.status(404).json({ error: 'यो विवरण अनुसार कुनै खाता भेटिएन!' });
    }

    if (!data.nickname || data.nickname.toLowerCase() !== nickname.toLowerCase()) {
      return res.status(400).json({ error: 'निकनेम (Nick Name) मिलेन!' });
    }

    res.json({ success: true, user: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ४. Reset Password API (새로운 비밀번호 업데이트)
app.post('/api/reset-password', async (req, res) => {
  try {
    const { identifier, newPassword } = req.body;

    let query = supabase.from('users').update({ password: newPassword });
    if (identifier.includes('@')) {
      query = query.eq('email', identifier);
    } else {
      query = query.eq('phone', identifier);
    }

    const { data, error } = await query.select();

    if (error) throw error;

    res.json({ message: 'पासवर्ड सफलतापूर्वक परिवर्तन भयो!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 सर्भर पोर्ट ${PORT} मा चलिरहेको छ!`);
});