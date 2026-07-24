import pandas as pd
from app.models.event import Event
from app.models.forecast import Forecast
from app.routers.admin.logs_by_admin import create_log
from app.routers.forecast.predictor import generate_prediction
from app.routers.forecast.risk import calculate_risk
from app.routers.forecast.traine import train_forecast_model
from app.services.geo_forecast import get_region


def generate_forecast(db, current_user):

    # Desactivar forecast anterior
    deactivate_old_forecast(db)

    events = db.query(Event).all()

    rows = []

    for event in events:
        rows.append(
            {
                "date": event.event_date,
                "category": event.category,
                "country": event.country,
                "region": get_region(event.country),
            }
        )

    df = pd.DataFrame(rows)

    if df.empty:
        return []

    df["date"] = pd.to_datetime(df["date"])

    #
    # Agrupación semanal por país
    #

    country_grouped = (
        df.groupby([pd.Grouper(key="date", freq="W"), "category", "region", "country"])
        .size()
        .reset_index(name="count")
    )

    saved = []

    used_series = set()

    #
    # 1) Forecast por país
    #

    for keys, group in country_grouped.groupby(["category", "region", "country"]):
        category, region, country = keys

        # poca historia
        if len(group) < 10:
            continue

        model = train_forecast_model(group)

        prediction = generate_prediction(model)

        for _, row in prediction.iterrows():
            expected = max(0, round(row["yhat"]))

            forecast = Forecast(
                forecast_date=row["ds"],
                category=category,
                region=region,
                country=country,
                expected_events=expected,
                confidence=0.80,
                risk_level=calculate_risk(expected),
                lower_bound=row["yhat_lower"],
                upper_bound=row["yhat_upper"],
                model_version="Prophet_v1",
                extra_data={"training_points": len(group), "level": "country"},
                active=True,
            )

            db.add(forecast)

            saved.append(forecast)

        used_series.add((category, region))

    #
    # 2) Forecast regional fallback
    #

    regional_grouped = (
        df.groupby([pd.Grouper(key="date", freq="W"), "category", "region"])
        .size()
        .reset_index(name="count")
    )

    for keys, group in regional_grouped.groupby(["category", "region"]):
        category, region = keys

        # evitar duplicar
        if (category, region) in used_series:
            continue

        if len(group) < 10:
            continue

        model = train_forecast_model(group)

        prediction = generate_prediction(model)

        for _, row in prediction.iterrows():
            expected = max(0, round(row["yhat"]))

            forecast = Forecast(
                forecast_date=row["ds"],
                category=category,
                region=region,
                country=None,
                expected_events=expected,
                confidence=0.70,
                risk_level=calculate_risk(expected),
                lower_bound=row["yhat_lower"],
                upper_bound=row["yhat_upper"],
                model_version="Prophet_v1",
                extra_data={"training_points": len(group), "level": "region"},
                active=True,
            )

            db.add(forecast)

            saved.append(forecast)

    db.commit()

    create_log(
        db,
        current_user,
        "EXECUTE",
        "FORECAST",
        "Generación de nuevo forecast ejecutada",
        new_data={"records_generated": len(saved), "model": "Prophet_v1"},
    )

    return saved


def deactivate_old_forecast(db):

    db.query(Forecast).filter(Forecast.active == True).update({Forecast.active: False})

    db.commit()
