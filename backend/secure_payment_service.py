from flask import Flask
from flask_wtf.csrf import CSRFProtect

app = Flask(__name__)
csrf = CSRFProtect(app)

# Configure security headers
app.config.update(
    SECRET_KEY='your-secure-key-here',
    SESSION_COOKIE_SAMESITE='Strict',
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_HTTPONLY=True,
    CSRF_USE_SESSIONS=True
)

@app.route('/process-payment', methods=['POST'])
@csrf.exempt  # Only if using external PCI-compliant processor
def process_payment():
    # Payment processing logic here
    return "Payment processed securely"

if __name__ == '__main__':
    app.run(ssl_context='adhoc')
