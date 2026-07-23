import pandas as pd

from prophet import Prophet



def train_forecast_model(data):


    # Prophet requiere:
    # ds = fecha
    # y = valor a predecir


    df = data.rename(
        columns={
            "date":"ds",
            "count":"y"
        }
    )


    model = Prophet(
        yearly_seasonality=True,
        weekly_seasonality=False,
        daily_seasonality=False
    )


    model.fit(
        df[
            [
                "ds",
                "y"
            ]
        ]
    )


    return model