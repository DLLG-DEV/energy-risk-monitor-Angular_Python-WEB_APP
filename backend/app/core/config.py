from dotenv import load_dotenv
import os

load_dotenv()

class Settings:

    DATABASE_URL = os.getenv(
        "DATABASE_URL"
    )

    FRONTEND_URL = os.getenv(
        "LOCAL_FRONTEND_URL"
    )

    VIEWER_ROLE_ID = int(
        os.getenv("VIEWER_ROLE_ID")
    )
    
    ADMIN_ROLE_ID = int(
        os.getenv("ADMIN_ROLE_ID")
    )
    
    SECRET_KEY = os.getenv(
        "SECRET_KEY"
    )

    ALGORITHM = os.getenv(
        "ALGORITHM"
    )

    ACCESS_TOKEN_EXPIRE_MINUTES = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")
    )



settings = Settings()