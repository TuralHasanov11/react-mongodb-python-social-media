from pydantic import BaseModel, EmailStr, ValidationError, validator

class RegisterData(BaseModel):
  firstName: str = 'aa'
  lastName: str = 'aa'
  email: EmailStr = 'test@test.com'
  password: str = 'password'
  confirmPassword: str = 'password'

  @validator('confirmPassword')
  def passwords_match(cls, v, values, **kwargs):
    if 'password' in values and v != values['password']:
        raise ValueError('passwords do not match')
    return v

class LoginData(BaseModel):
  email: EmailStr = 'test@test.com'
  password: str = 'password'

class PostCreateUpdateData(BaseModel):
  title: str = ''
  message: str = ''
  tags: list = []
  selectedFile: str = ''

class CommentData(BaseModel):
  comment: str

class User(BaseModel):
  id: str
  username: str
  email: EmailStr
