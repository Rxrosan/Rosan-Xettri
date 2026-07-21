const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
// अनलाइन (Render) र लोकल (Localhost) दुवैमा चल्ने बनाउन यो तरिका अपनाइएको हो
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Supabase Connection
const SUPABASE_URL = 'https://xorxoovezlgqcaeyqpdp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_5_yPXUnjJVe3dy13X5nkXQ_afJ7rCvM';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// १. Signup / Register API
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, address, phone, dob, password, role } = req.body;

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
      .insert([{ name, email, address, phone, dob, password, role: role || 'user' }])
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

// ३. Check Email API (OTP पठाउन अघि युजर छ/छैन जाँच्न)
app.post('/api/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    const { data, error } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'यो इमेलबाट कुनै खाता भेटिएन!' });
    }

    res.json({ exists: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ४. Reset Password API
app.post('/api/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const { data, error } = await supabase
      .from('users')
      .update({ password: newPassword })
      .eq('email', email)
      .select();

    if (error) throw error;

    res.json({ message: 'पासवर्ड सफलतापूर्वक परिवर्तन भयो!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 सर्भर पोर्ट ${PORT} मा चलिरहेको छ!`);
});