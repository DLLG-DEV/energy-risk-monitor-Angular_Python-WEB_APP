import logging

from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models.alarm import Alarm
from app.models.user import User
from app.models.forecast import Forecast
from app.models.notification import Notification
from datetime import datetime

from app.services.email.email_service import send_email


logger = logging.getLogger(__name__)

def get_active_alarms(
    db: Session
):


    alarms = db.query(Alarm)\
        .filter(
            Alarm.active == True,
            Alarm.is_deleted == False
        )\
        .all()
        
    return alarms

def get_last_forecast(
    db: Session
):

    latest_forecast_date = (
        db.query(Forecast.forecast_date)
        .filter(Forecast.active == True)
        .order_by(desc(Forecast.forecast_date))
        .first()
    )

    if not latest_forecast_date:

        logger.warning(
            "No existen forecasts disponibles."
        )

        return None, []

    forecasts = (
        db.query(Forecast)
        .filter(
            Forecast.active == True,
            Forecast.forecast_date == latest_forecast_date[0]
        )
        .all()
    )

    logger.info(
        "Forecast activo obtenido. Fecha: %s | Registros: %s",
        latest_forecast_date[0],
        len(forecasts)
    )

    return latest_forecast_date[0], forecasts

def get_user_by_alarm(
    db: Session,
    alarm: Alarm
):

    return db.query(User)\
        .filter(
            User.id == alarm.user_id
        )\
        .first()

def filter_forecasts_by_alarm(
    alarm: Alarm,
    forecasts: list
):

    matches = [

        forecast

        for forecast in forecasts

        if (
            (alarm.country is None or alarm.country == forecast.country)
            and
            (
                alarm.category is None
                or alarm.category.upper() == "TODAS"
                or alarm.category == forecast.category
            )
        )
    ]

    return matches
        
def generate_alert_email(
    forecasts:list,
    forecast_date
):


    body = f"""

    <!DOCTYPE html>
    <html>

    <body style="
    margin:0;
    padding:0;
    background:#020617;
    font-family:Arial;
    color:white;
    ">


    <table width="100%"
    style="
    background:#020617;
    padding:40px;
    ">


    <tr>

    <td align="center">


    <div style="
    width:600px;
    background:#0f172a;
    border-radius:20px;
    border:1px solid #334155;
    overflow:hidden;
    ">



    <div style="
    background:linear-gradient(
        135deg,
        #2563eb,
        #38bdf8
    );
    padding:30px;
    text-align:center;
    ">


    <h1>
    🌎 Energy Risk Monitor
    </h1>


    <p>
    Sistema inteligente de monitoreo energético
    </p>


    </div>



    <div style="
    padding:35px;
    ">


    <h2 style="
    color:#38bdf8;
    ">

    🚨 Alerta de riesgo detectada

    </h2>



    <p style="
    color:#94a3b8;
    ">

    Fecha:

    <b>
    {forecast_date}
    </b>

    </p>


    """



    for forecast in forecasts:


        probability = (
            forecast.confidence * 100
        )


        risk_color = (

            "#f87171"

            if forecast.risk_level == "HIGH"

            else

            "#fbbf24"

        )



        body += f"""


        <div style="
        margin-top:20px;
        padding:20px;
        background:#111827;
        border-radius:15px;
        border-left:5px solid #38bdf8;
        ">


        <h3 style="
        color:#38bdf8;
        ">

        🌎 {forecast.country}

        </h3>



        <p>

        <b>
        Categoría:
        </b>

        <br>

        {forecast.category}

        </p>



        <p>

        <b>
        Nivel de riesgo:
        </b>

        <br>


        <span style="
        color:{risk_color};
        font-weight:bold;
        ">

        {forecast.risk_level}

        </span>

        </p>



        <p>

        <b>
        Probabilidad:
        </b>

        <br>

        {probability:.2f}%

        </p>



        <p>

        <b>
        Eventos esperados:
        </b>

        <br>

        {forecast.expected_events}

        </p>



        </div>

        """



    body += """

    <br>


    <p style="
    color:#64748b;
    text-align:center;
    ">

    Energy Risk Monitor © 2026

    </p>


    </div>


    </td>

    </tr>


    </table>


    </body>

    </html>

    """



    return body

async def send_alert_email(
    email:str,
    body:str
):


    await send_email(

        email=email,

        subject="🚨 Alerta ERM - Nuevos riesgos detectados",

        body=body

    )
    
def save_notification_logs(
    db:Session,
    alarm:Alarm,
    user:User,
    forecasts:list
):


    for forecast in forecasts:


        notification = Notification(

            alarm_id=alarm.id,

            forecast_id=forecast.id,

            email=user.email,

            status="SENT",

            sent_at=datetime.utcnow()

        )


        db.add(
            notification
        )



    db.commit()
    
async def process_alerts(
    db: Session
):


    alarms = get_active_alarms(
        db
    )


    if not alarms:

        return {
            "status": "OK",
            "alarms_processed": 0,
            "alerts_sent": 0
        }



    forecast_date, forecasts = get_last_forecast(
        db
    )


    if not forecasts:

        return {
            "status": "OK",
            "alarms_processed": len(alarms),
            "alerts_sent": 0
        }



    alerts_sent = 0



    for alarm in alarms:


        user = get_user_by_alarm(
            db,
            alarm
        )


        if not user:

            print(
                "Usuario no encontrado para alarma %s",
                alarm.id
            )

            print(
            "Alarma %s encontró %s coincidencias",
            alarm.id,
            len(matches)
            )
            continue



        matches = filter_forecasts_by_alarm(
            alarm,
            forecasts
        )


        if not matches:

            continue



        body = generate_alert_email(

            forecasts=matches,

            forecast_date=forecast_date

        )



        try:

            await send_alert_email(

                email=user.email,

                body=body

            )


            save_notification_logs(

                db=db,

                alarm=alarm,

                user=user,

                forecasts=matches

            )


            alerts_sent += 1


            logger.info(

                "Alerta enviada correctamente a %s",

                user.email

            )
            
            print("todo Corerect")


        except Exception:

            db.rollback()

            logger.exception(

                "Error enviando alerta a %s",

                user.email

            )



    return {

        "status": "OK",

        "alarms_processed": len(alarms),

        "forecasts_used": len(forecasts),

        "alerts_sent": alerts_sent,

        "forecast_date": str(forecast_date)

    }