from datetime import datetime


def generate_prediction(model):


    future = model.make_future_dataframe(

        periods=13,

        freq="W"

    )


    forecast = model.predict(
        future
    )


    today = datetime.utcnow()


    forecast = forecast[
        forecast["ds"] > today
    ]


    result = forecast[

        [
            "ds",
            "yhat",
            "yhat_lower",
            "yhat_upper"
        ]

    ]


    return result