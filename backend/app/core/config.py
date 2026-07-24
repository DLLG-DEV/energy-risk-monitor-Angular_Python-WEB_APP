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
    
    API_NASA_EONET = os.getenv(
        "API_NASA_EONET"
    )

    USER_ROLE_ID = os.getenv(
        "USER_ROLE_ID"
    )

    # ==========================
    # EMAIL CONFIG
    # ==========================


    MAIL_USERNAME = os.getenv(
        "MAIL_USERNAME"
    )


    MAIL_PASSWORD = os.getenv(
        "MAIL_PASSWORD"
    )


    MAIL_SERVER = os.getenv(
        "MAIL_SERVER"
    )


    MAIL_PORT = int(
        os.getenv("MAIL_PORT")
    )


    MAIL_FROM = os.getenv(
        "MAIL_FROM"
    )


settings = Settings()