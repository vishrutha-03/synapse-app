#It defines data shapes for auth requests using Pydantic.
from pydantic import BaseModel

class UserCreate(BaseModel):   #for signup
    name: str
    email: str
    password: str


class UserLogin(BaseModel):   #for login
    email: str
    password: str