// ===== rx-forgot-password.js ===== //
(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
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
                
                if (!auth.otpStartTimestamp) {
                    auth.otpStartTimestamp = Date.now();
                }
                
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
                        
                        if (!auth.isOtpVerified) {
                            forgotModule.resetOtpButtonToResend();
                        }
                        auth.savePageState();
                        return;
                    }
                    
                    if (el.sendOtpBtn && !auth.isOtpVerified) {
                        el.sendOtpBtn.textContent = 'WAIT ' + counter + 's';
                    }
                    
                    auth.savePageState();
                }, 1000);
            },

            startOtpCountdown: function() {
                auth.otpStartTimestamp = Date.now();
                forgotModule.startOtpCountdownFrom(auth.otpTotalDuration);
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
                setTimeout(auth.syncPasswordToggles, 100);
                auth.savePageState();
            }
        };

        // Export module safely into accessible global scope mappings
        window._rxForgot = forgotModule;

        // Broadcast token payload sequences
        if (el.sendOtpBtn) {
            el.sendOtpBtn.addEventListener('click', function() {
                if (auth.isOtpSending) return;
                
                const email = el.resetEmail.value.trim();
                
                if (!email) {
                    auth.setStatus(el.resetStatus, 'Please enter your email address.', 'error');
                    return;
                }

                if (!email.includes('@') || !email.includes('.')) {
                    auth.setStatus(el.resetStatus, 'Please enter a valid email address.', 'error');
                    return;
                }

                const user = auth.registeredUsers.find(u => u.email === email);
                
                if (!user) {
                    auth.setStatus(el.resetStatus, 'No account found with that email.', 'error');
                    return;
                }

                auth.isOtpSending = true;
                auth.generatedOtp = String(Math.floor(100000 + Math.random() * 900000));
                
                console.log('========================================');
                console.log('OTP FOR PASSWORD RESET\nEmail: ' + email + '\nOTP: ' + auth.generatedOtp);
                console.log('========================================');
                
                auth.resetIdentifier = email;
                auth.setStatus(el.resetStatus, 'OTP sent successfully!', 'success');
                
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
                
                if (el.sendOtpBtn) {
                    el.sendOtpBtn.disabled = true;
                    el.sendOtpBtn.textContent = 'WAIT ' + auth.otpTotalDuration + 's';
                    el.sendOtpBtn.className = 'login-btn cooldown';
                }
                
                forgotModule.startOtpCountdown();
                setTimeout(() => auth.isOtpSending = false, 500);
                auth.savePageState();
            });
        }

        // Real-time direct match parser routines
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
                            el.sendOtpBtn.textContent = ' VERIFIED';
                            el.sendOtpBtn.className = 'login-btn verified';
                        }
                        
                        forgotModule.stopOtpTimer();
                        auth.otpRemainingSeconds = 0;
                        auth.otpStartTimestamp = null;
                        
                        if (el.resetNewPassword) {
                            setTimeout(() => el.resetNewPassword.focus(), 300);
                        }
                        setTimeout(auth.syncPasswordToggles, 100);
                    } else {
                        auth.setStatus(el.resetStatus, 'Invalid OTP. Please try again.', 'error');
                        if (el.passwordSection) el.passwordSection.classList.remove('active');
                    }
                } else {
                    if (el.passwordSection && !auth.isOtpVerified) el.passwordSection.classList.remove('active');
                }
                auth.savePageState();
            });
        }

        // Commit modifications onto local structural storage keys
        if (el.resetPasswordBtn) {
            el.resetPasswordBtn.addEventListener('click', function() {
                if (!auth.isOtpVerified) {
                    auth.setStatus(el.resetStatus, 'Please verify OTP first.', 'error');
                    return;
                }

                const newPassword = el.resetNewPassword.value.trim();
                const confirmPassword = el.resetConfirmPassword.value.trim();

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

                const userIndex = auth.registeredUsers.findIndex(u => u.email === auth.resetIdentifier);

                if (userIndex === -1) {
                    auth.setStatus(el.resetStatus, 'User not found. Please try again.', 'error');
                    return;
                }

                auth.registeredUsers[userIndex].password = newPassword;
                localStorage.setItem('rxUsers', JSON.stringify(auth.registeredUsers));
                auth.setStatus(el.resetStatus, 'Password reset successfully!', 'success');

                setTimeout(function() {
                    auth.showPage('loginSection');
                    if (el.loginEmail) el.loginEmail.value = auth.resetIdentifier;
                    if (el.loginPassword) el.loginPassword.value = '';
                    auth.setStatus(el.loginStatus, 'Password reset! Please login.', 'success');
                    
                    forgotModule.resetForgotForm();
                    sessionStorage.removeItem('rxPageState');
                }, 1500);
            });
        }

        if (el.resetConfirmPassword) el.resetConfirmPassword.addEventListener('keypress', e => { if (e.key === 'Enter') el.resetPasswordBtn.click(); });
        if (el.resetNewPassword) el.resetNewPassword.addEventListener('keypress', e => { if (e.key === 'Enter') el.resetConfirmPassword.focus(); });
        if (el.resetEmail) el.resetEmail.addEventListener('keypress', e => { if (e.key === 'Enter') el.sendOtpBtn.click(); });

        // ========================================
        // ===== INITIALIZATION ORCHESTRATION =====
        // ========================================

        // 1. Process data metrics reconstruction first and retrieve any existing page histories[cite: 3]
        const preservedRouteTarget = auth.restorePageState();

        // 2. Default Navigation Routing Checks: Ensure screens stay on the actual active view instead of snapping backward[cite: 3]
        if (preservedRouteTarget) {
            auth.showPage(preservedRouteTarget, false);
        } else {
            // Safe fallback rule to protect direct initial hits[cite: 3]
            if (!sessionStorage.getItem('rxPageState')) {
                auth.showPage('loginSection', false);
            }
        }

        // 3. Seal baseline parameters safely inside the page layer metrics state tracker[cite: 3]
        auth.savePageState();

        console.log('========================================');
        console.log('Modular Application Context loaded successfully');
        console.log('Registered Users Total:', auth.registeredUsers.length);
        console.log('Stay Open Persistence Architecture: REPAIR COMPLETE');
        console.log('========================================');
    });
})();