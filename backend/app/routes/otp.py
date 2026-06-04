from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.database import otp_collection

import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException

from dotenv import load_dotenv
import os
import random

load_dotenv()

router = APIRouter(
    prefix="/otp",
    tags=["otp"]
)

class EmailRequest(BaseModel):
    email: str

class VerifyRequest(BaseModel):
    email: str
    otp: str


configuration = sib_api_v3_sdk.Configuration()
configuration.api_key['api-key'] = os.getenv("BREVO_API_KEY")

api_instance = sib_api_v3_sdk.TransactionalEmailsApi(
    sib_api_v3_sdk.ApiClient(configuration)
)


@router.post("/send")
async def send_otp(data: EmailRequest):

    if not data.email.endswith("@bmsce.ac.in"):
        raise HTTPException(
            status_code=400,
            detail="Only BMSCE emails allowed"
        )

    otp = str(random.randint(100000, 999999))

    await otp_collection.delete_many({
        "email": data.email
    })

    await otp_collection.insert_one({
        "email": data.email,
        "otp": otp
    })

    sender = {
        "name": "Synapse",
        "email": "mvishrutha.cs24@bmsce.ac.in"
    }

    email = sib_api_v3_sdk.SendSmtpEmail(
        to=[{"email": data.email}],
        sender=sender,
        subject="Synapse OTP Verification",
        html_content=f"""
        <h2>Your OTP is:</h2>
        <h1>{otp}</h1>
        """
    )

    try:
        api_instance.send_transac_email(email)
    except ApiException as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    return {
        "message": "OTP sent"
    }


@router.post("/verify")
async def verify_otp(data: VerifyRequest):

    record = await otp_collection.find_one({
        "email": data.email,
        "otp": data.otp
    })

    if not record:
        raise HTTPException(
            status_code=400,
            detail="Invalid OTP"
        )

    await otp_collection.delete_many({
        "email": data.email
    })

    return {
        "verified": True
    }