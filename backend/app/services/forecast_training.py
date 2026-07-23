import pandas as pd

from app.services.geo_forecast import get_region



def prepare_events(events):


    data=[]


    for event in events:


        data.append({

            "date":event.event_date,

            "category":event.category,

            "country":event.country,

            "region":get_region(
                event.country
            )

        })


    df=pd.DataFrame(data)


    df["date"]=pd.to_datetime(
        df["date"]
    )


    return df

def create_training_dataset(df):

    print(
        result.groupby(
            "category"
        )
        .size()
    )
    
    result=(

        df.groupby(
            [
                pd.Grouper(
                    key="date",
                    freq="W"
                ),
                "category",
                "region",
                "country"
            ]
        )

        .size()

        .reset_index(
            name="count"
        )

    )


    return result