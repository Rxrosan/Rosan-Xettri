// ===== rx-forgot-password.js (Fully Fixed & Complete) ===== //
(function() {
    'use strict';

    // 🔑 Supabase Credentials
    const SUPABASE_URL = "https://xorxoovezlgqcaeyqpdp.supabase.co";
    const SUPABASE_ANON_KEY = "sb_publishable_5_yPXUnjJVe3dy13X5nkXQ_afJ7rCvM";

    // Supabase CDN स्वतः लोड गर्ने फंक्सन
    function loadSupabaseScript(callback) {
        if (window.supabase && typeof window.supabase.createClient === 'function') {
            callback();
            return;
        }
        const existingScript = document.querySelector('script[src*="supabase-js"]');
        if (existingScript) {
            existingScript.onload = callback;
            return;
        }
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
        script.async = true;
        script.onload = callback;
        script.onerror = function() {
            console.error("Failed to load Supabase CDN script.");
        };
        document.head.appendChild(script);
    }

    // Supabase Client तान्ने/बनाउने Helper Function
    function getSupabaseClient() {
        if (window.supabaseClient) return window.supabaseClient;
        if (window.supabase && typeof window.supabase.createClient === 'function') {
            window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            return window.supabaseClient;
        }
        return null;
    }

    document.addEventListener('DOMContentLoaded', function() {
        loadSupabaseScript(function() {
            console.log("Supabase library loaded successfully.");
        });

        const auth = window._rxAuth;
        if (!auth) return;

        const el = auth.elements;

        const forgotModule = {
            stopOtpTimer: function() {
                if (auth.otpTimerInterval) {
                    clearInterval(auth.otpTimerInterval);
                    auth.otpTimerInterval = null;
                }
            },

            resetOtpButtonToResend: function() {
                if (el.sendOtpBtn && !auth.isOtpVerified) {
                    el.sendOtpBtn.disabled = false;
                    el.sendOtpBtn.textContent = 'RESEND OTP';
                    el.sendOtpBtn.className = 'login-btn';
                }
            },

            startOtpCountdownFrom: function(remainingSeconds) {
                forgotModule.stopOtpTimer();
                let counter = remainingSeconds;
                auth.otpRemainingSeconds = counter;
                
                if (!auth.otpStartTimestamp) auth.otpStartTimestamp = Date.now();
                
                if (el.sendOtpBtn && !auth.isOtpVerified) {
                    el.sendOtpBtn.disabled = true;
                    el.sendOtpBtn.textContent = 'WAIT ' + counter + 's';
                    el.sendOtpBtn.className = 'login-btn cooldown';
                }
                
                auth.otpTimerInterval = setInterval(function() {
                    counter--;
                    auth.otpRemainingSeconds = counter;
                    
                    if (counter <= 0 || auth.isOtpVerified) {
                        forgotModule.stopOtpTimer();
                        auth.otpRemainingSeconds = 0;
                        auth.otpStartTimestamp = null;
                        if (!auth.isOtpVerified) forgotModule.resetOtpButtonToResend();
                        if (typeof auth.savePageState === 'function') auth.savePageState();
                        return;
                    }
                    
                    if (el.sendOtpBtn && !auth.isOtpVerified) {
                        el.sendOtpBtn.textContent = 'WAIT ' + counter + 's';
                    }
                    if (typeof auth.savePageState === 'function') auth.savePageState();
                }, 1000);
            },

            startOtpCountdown: function() {
                auth.otpStartTimestamp = Date.now();
                forgotModule.startOtpCountdownFrom(auth.otpTotalDuration);
            },

            // 🛠️ अब सीधै Resend लाई होइन, आफ्नै Render सर्भरको API मार्फत इमेल पठाउने (CORS फिक्स)
            sendEmailOTP: async function(toEmail, otpCode) {
                try {
                    const response = await fetch("https://rosan-xettri.onrender.com/api/send-email", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            email: toEmail,
                            subject: "Your Password Reset OTP - RX System",
                            htmlContent: `
                                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: #ffffff; border-radius: 10px;">
                                    <h2 style="color: #38bdf8;">Password Reset Verification</h2>
                                    <p>You requested to reset your password. Use the OTP code below to verify:</p>
                                    <div style="background: #1e293b; padding: 15px; font-size: 28px; font-weight: bold; letter-spacing: 5px; color: #4facfe; text-align: center; border-radius: 8px; margin: 20px 0;">
                                        ${otpCode}
                                    </div>
                                    <p style="font-size: 12px; color: #94a3b8;">If you did not request this, please ignore this email.</p>
                                </div>
                            `
                        })
                    });
                    const result = await response.json();
                    return response.ok && result.success;
                } catch(e) {
                    console.error("Email send error:", e);
                    return false;
                }
            },

            resetForgotForm: function() {
                forgotModule.stopOtpTimer();
                if (el.resetEmail) el.resetEmail.value = '';
                if (el.resetOtp) {
                    el.resetOtp.value = '';
                    el.resetOtp.disabled = false;
                }
                if (el.resetNewPassword) el.resetNewPassword.value = '';
                if (el.resetConfirmPassword) el.resetConfirmPassword.value = '';
                if (el.passwordSection) el.passwordSection.classList.remove('active');
                if (el.sendOtpBtn) {
                    el.sendOtpBtn.disabled = false;
                    el.sendOtpBtn.textContent = 'SEND OTP';
                    el.sendOtpBtn.className = 'login-btn';
                }
                if (el.resetStatus) {
                    el.resetStatus.className = 'login-status';
                    el.resetStatus.style.display = 'none';
                    el.resetStatus.textContent = '';
                }
                auth.generatedOtp = '';
                auth.isOtpVerified = false;
                auth.resetIdentifier = '';
                auth.isOtpSending = false;
                auth.otpRemainingSeconds = 0;
                auth.otpStartTimestamp = null;
                auth.otpTotalDuration = 60;
                if (typeof auth.syncPasswordToggles === 'function') setTimeout(auth.syncPasswordToggles, 100);
                if (typeof auth.savePageState === 'function') auth.savePageState();
            }
        };

        window._rxForgot = forgotModule;

        // 1. Send OTP Event
        if (el.sendOtpBtn) {
            el.sendOtpBtn.addEventListener('click', async function() {
                if (auth.isOtpSending) return;
                const email = el.resetEmail ? el.resetEmail.value.trim() : '';

                if (!email || !email.includes('@') || !email.includes('.')) {
                    auth.setStatus(el.resetStatus, 'Please enter a valid email address.', 'error');
                    return;
                }

                try {
                    const client = getSupabaseClient();
                    if (!client) {
                        auth.setStatus(el.resetStatus, 'Supabase client is loading. Please try again.', 'error');
                        return;
                    }

                    auth.setStatus(el.resetStatus, 'Checking account...', 'info');

                    // Supabase बाट इमेल चेक गर्ने
                    const { data, error } = await client
                        .from('users')
                        .select('email')
                        .ilike('email', email);

                    if (error) {
                        console.error("Supabase Error:", error);
                        auth.setStatus(el.resetStatus, 'DB Error: ' + error.message, 'error');
                        return;
                    }

                    if (!data || data.length === 0) {
                        auth.setStatus(el.resetStatus, 'No account found with that email.', 'error');
                        return;
                    }

                    auth.isOtpSending = true;
                    auth.setStatus(el.resetStatus, 'Sending OTP to your email...', 'info');

                    // 6 Digit OTP Generate गर्ने
                    auth.generatedOtp = String(Math.floor(100000 + Math.random() * 900000));
                    auth.resetIdentifier = email;

                    const isSent = await forgotModule.sendEmailOTP(email, auth.generatedOtp);

                    if (isSent) {
                        auth.setStatus(el.resetStatus, 'OTP sent to your email successfully!', 'success');
                    } else {
                        console.log("GENERATED OTP:", auth.generatedOtp);
                        auth.setStatus(el.resetStatus, 'OTP Generated!', 'success');
                    }

                    if (el.passwordSection) el.passwordSection.classList.remove('active');
                    auth.isOtpVerified = false;
                    
                    if (el.resetOtp) {
                        el.resetOtp.value = '';
                        el.resetOtp.disabled = false;
                        el.resetOtp.focus();
                    }
                    
                    forgotModule.stopOtpTimer();
                    auth.otpTotalDuration = 60;
                    auth.otpRemainingSeconds = auth.otpTotalDuration;
                    
                    forgotModule.startOtpCountdown();
                    setTimeout(() => auth.isOtpSending = false, 500);
                    if (typeof auth.savePageState === 'function') auth.savePageState();

                } catch (err) {
                    console.error("Forgot Password Error:", err);
                    auth.setStatus(el.resetStatus, 'Error connecting to database.', 'error');
                }
            });
        }

        // 2. Real-time OTP Matching
        if (el.resetOtp) {
            el.resetOtp.addEventListener('input', function() {
                this.value = this.value.replace(/\D/g, '');
                
                if (this.value.length === 6) {
                    if (this.value === auth.generatedOtp) {
                        auth.isOtpVerified = true;
                        if (el.passwordSection) el.passwordSection.classList.add('active');
                        auth.setStatus(el.resetStatus, 'OTP verified! Enter new password.', 'success');
                        el.resetOtp.disabled = true;
                        
                        if (el.sendOtpBtn) {
                            el.sendOtpBtn.disabled = true;
                            el.sendOtpBtn.textContent = 'VERIFIED';
                            el.sendOtpBtn.className = 'login-btn verified';
                        }
                        
                        forgotModule.stopOtpTimer();
                        auth.otpRemainingSeconds = 0;
                        auth.otpStartTimestamp = null;
                        
                        if (el.resetNewPassword) setTimeout(() => el.resetNewPassword.focus(), 300);
                        if (typeof auth.syncPasswordToggles === 'function') setTimeout(auth.syncPasswordToggles, 100);
                    } else {
                        auth.setStatus(el.resetStatus, 'Invalid OTP. Please try again.', 'error');
                        if (el.passwordSection) el.passwordSection.classList.remove('active');
                    }
                }
                if (typeof auth.savePageState === 'function') auth.savePageState();
            });
        }

        // 3. Reset Password Event
        if (el.resetPasswordBtn) {
            el.resetPasswordBtn.addEventListener('click', async function() {
                if (!auth.isOtpVerified) {
                    auth.setStatus(el.resetStatus, 'Please verify OTP first.', 'error');
                    return;
                }

                const newPassword = el.resetNewPassword ? el.resetNewPassword.value.trim() : '';
                const confirmPassword = el.resetConfirmPassword ? el.resetConfirmPassword.value.trim() : '';

                if (!newPassword || !confirmPassword) {
                    auth.setStatus(el.resetStatus, 'Please fill in both password fields.', 'error');
                    return;
                }

                if (newPassword.length < 6) {
                    auth.setStatus(el.resetStatus, 'Password must be at least 6 characters.', 'error');
                    return;
                }

                if (newPassword !== confirmPassword) {
                    auth.setStatus(el.resetStatus, 'Passwords do not match.', 'error');
                    return;
                }

                try {
                    const client = getSupabaseClient();
                    if (!client) {
                        auth.setStatus(el.resetStatus, 'Supabase client not loaded.', 'error');
                        return;
                    }

                    const { error } = await client
                        .from('users')
                        .update({ password: newPassword })
                        .eq('email', auth.resetIdentifier);

                    if (!error) {
                        auth.setStatus(el.resetStatus, 'Password reset successfully!', 'success');

                        setTimeout(function() {
                            if (typeof auth.showPage === 'function') auth.showPage('loginSection');
                            if (el.loginEmail) el.loginEmail.value = auth.resetIdentifier;
                            if (el.loginPassword) el.loginPassword.value = '';
                            auth.setStatus(el.loginStatus, 'Password reset! Please login with your new password.', 'success');
                            
                            forgotModule.resetForgotForm();
                            sessionStorage.removeItem('rxPageState');
                        }, 1500);
                    } else {
                        auth.setStatus(el.resetStatus, error.message || 'Password reset failed.', 'error');
                    }
                } catch (err) {
                    console.error("Reset Error:", err);
                    auth.setStatus(el.resetStatus, 'Error updating password in database.', 'error');
                }
            });
        }

        if (typeof auth.restorePageState === 'function') {
            const preservedRouteTarget = auth.restorePageState();
            if (preservedRouteTarget) {
                auth.showPage(preservedRouteTarget, false);
            } else {
                if (!sessionStorage.getItem('rxPageState') && typeof auth.showPage === 'function') {
                    auth.showPage('loginSection', false);
                }
            }
        }

        if (typeof auth.savePageState === 'function') auth.savePageState();
    });
})();