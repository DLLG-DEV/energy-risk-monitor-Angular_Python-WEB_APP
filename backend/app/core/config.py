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

settings = Settings()