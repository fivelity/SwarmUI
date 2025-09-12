class LoginHandler {
    constructor() {
        this.usernameInput = document.getElementById('username_input');
        this.passwordInput = document.getElementById('password_input');
        this.loginButton = document.getElementById('login_button');
        this.loginErrorBlock = document.getElementById('login_error_block');
        this.errorNoUsername = translatable("Please enter a valid username.");
        this.errorNoPassword = translatable("Please enter a valid password.");
        this.errorLoginFailedUnknown = translatable("Login failed (reason unknown), please check your inputs and try again.\nIf this issue persists, please contact the instance owner.");
        this.errorLoginFailedGeneral = translatable("Login failed (incorrect username or password), please check your inputs and try again.");
        this.errorLoginFailedRatelimit = translatable("Login failed (ratelimit reached), please wait a minute before trying again.");
        this.messageLoggingIn = translatable("Logging in, please wait...");
        this.messageLoginSuccess = translatable("Login successful! Redirecting...");

        this.loginButton.addEventListener('click', () => this.doLogin());
        this.passwordInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.doLogin();
            }
        });
    }

    showError(message) {
        this.loginErrorBlock.style.display = 'block';
        this.loginErrorBlock.textContent = message;
    }

    hideError() {
        this.loginErrorBlock.style.display = 'none';
    }

    showMessage(message) {
        this.hideError();
        // Could show a success message elsewhere if desired
    }

    async doLogin() {
        this.hideError();
        let username = this.usernameInput.value;
        let password = this.passwordInput.value;
        if (username.length < 1) {
            this.showError(this.errorNoUsername.get());
            return;
        }
        if (password.length < 1) {
            this.showError(this.errorNoPassword.get());
            return;
        }
        this.loginButton.disabled = true;
        this.loginButton.textContent = this.messageLoggingIn.get();
        let inData = {
            username: username,
            password: await doPasswordClientPrehash(username, password)
        };
        sendJsonToServer(`API/Login`, inData, (status, data) => {
            data ??= {};
            if (data.success) {
                this.loginButton.textContent = this.messageLoginSuccess.get();
                setTimeout(() => {
                    window.location.href = './Text2Image';
                }, 500);
                return;
            }
            this.loginButton.disabled = false;
            this.loginButton.textContent = 'Login';
            if (data.error_id == 'invalid_login') {
                this.showError(this.errorLoginFailedGeneral.get());
            }
            else if (data.error_id == 'ratelimit') {
                this.showError(this.errorLoginFailedRatelimit.get());
            }
            else {
                this.showError(this.errorLoginFailedUnknown.get());
            }
        });
    }
}

let loginHandler = new LoginHandler();
