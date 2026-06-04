import os
from dotenv import load_dotenv

import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException

load_dotenv()

configuration = sib_api_v3_sdk.Configuration()
configuration.api_key['api-key'] = os.getenv("BREVO_API_KEY")

api_instance = sib_api_v3_sdk.TransactionalEmailsApi(
    sib_api_v3_sdk.ApiClient(configuration)
)

sender = {
    "name": "Synapse",
    "email": "mvishrutha.cs24@bmsce.ac.in"
}

email = sib_api_v3_sdk.SendSmtpEmail(
    to=[
        {
            "email": "vishrutha.m06@gmail.com"
        }
    ],
    sender=sender,
    subject="Brevo Test",
    html_content="<h1>Hello from Synapse!</h1>"
)

try:
    response = api_instance.send_transac_email(email)
    print(response)

except ApiException as e:
    print(e)