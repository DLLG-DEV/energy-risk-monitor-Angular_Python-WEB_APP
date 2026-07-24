import asyncio

from app.services.email.email_service import send_email



async def test():


    await send_email(

        email="sleos2203@gmail.com",

        subject="ERM prueba",

        body="""

        <h1>
        Energy Risk Monitor
        </h1>

        <p>
        Correo de prueba funcionando.
        </p>

        """

    )



asyncio.run(test())