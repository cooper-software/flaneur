from tenthousandfeet import TenThousandFeet
from flaneur import app

def get_client():
    return TenThousandFeet(app.config['TENTHOUSANDFEET']['token'])