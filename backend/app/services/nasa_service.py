import requests

from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.models.event import Event
from app.core.config import settings

import time
import pycountry
import reverse_geocoder as rg

geo = rg.RGeocoder()

CATEGORY_MAP = {
    "Wildfires": "FIRE",
    "Volcanoes": "VOLCANO",
    "Severe Storms": "STORM",
    "Floods": "FLOOD",
    "Earthquakes": "EARTHQUAKE"
}

def get_nasa_events():

    response = requests.get(
        settings.API_NASA_EONET,
        params={
            "limit": 1000
        },
        timeout=30
    )

    response.raise_for_status()

    return response.json()["events"]

def get_last_5_years_events():

    print("\n==============================")
    print("CONSULTANDO NASA EONET")
    print("==============================")

    end = datetime.utcnow()
    start = end - timedelta(days=365 * 6)

    print(f"Fecha inicio: {start}")
    print(f"Fecha fin:    {end}")

    t0 = time.time()

    response = requests.get(
        settings.API_NASA_EONET,
        params={
            "start": start.strftime("%Y-%m-%d"),
            "end": end.strftime("%Y-%m-%d"),
            "limit": 5000
        },
        timeout=120
    )

    print(f"Status Code NASA: {response.status_code}")
    print(f"Tiempo NASA: {time.time()-t0:.2f} segundos")

    response.raise_for_status()

    events = response.json()["events"]

    print(f"Eventos recibidos: {len(events)}")

    return events

def normalize_category(category: str):
    return CATEGORY_MAP.get(
        category,
        "OTHER"
    )


def normalize_coordinates(geometry: list):
    if not geometry:
        return None

    latest = geometry[-1]

    coordinates = latest.get("coordinates", [])

    if len(coordinates) < 2:

        return None

    event_date = None

    if latest.get("date"):
        event_date = datetime.fromisoformat(
            latest["date"].replace("Z", "")
        )

    return {
        "latitude": coordinates[1],
        "longitude": coordinates[0],
        "event_date": event_date
    }

def get_country(lat: float, lng: float):

    try:

        result = geo.query(
            [
                (lat, lng)
            ]
        )

        if result:

            country_code = result[0]["cc"]

            country = pycountry.countries.get(
                alpha_2=country_code
            )

            if country:
                return country.name


    except Exception as e:

        print(
            f"Error obteniendo pais: {e}"
        )


    return "UNKNOWN"

def save_events(db: Session, events: list):

    imported = 0
    skipped = 0

    existing_ids = {
        x[0] for x in db.query(Event.external_id).all()
    }
            
    print("\n==============================")
    print("INICIANDO IMPORTACION")
    print("==============================")
    print(f"Total eventos: {len(events)}")

    try:

        for index, item in enumerate(events, start=1):

            print("\n-----------------------------------")
            print(f"Evento {index}/{len(events)}")
            print(f"ID NASA: {item['id']}")
            print(f"Titulo : {item.get('title')}")

            geometry = normalize_coordinates(
                item.get("geometry", [])
            )

            if geometry is None:

                print("Sin coordenadas")

                skipped += 1

                continue

            print(f"Latitud : {geometry['latitude']}")
            print(f"Longitud: {geometry['longitude']}")

            if item["id"] in existing_ids:
                skipped +=1
                continue
            
            print("Calculando pais...") 

            t0 = time.time()

            country = get_country(
                geometry["latitude"],
                geometry["longitude"]
            )

            print(
                f"Pais: {country} "
                f"({time.time()-t0:.2f} segundos)"
            )

            category = "OTHER"

            if item.get("categories"):

                category = normalize_category(
                    item["categories"][0]["title"]
                )

            print(f"Categoria: {category}")

            event = Event(

                external_id=item["id"],

                title=item.get("title"),

                category=category,

                country=country,

                latitude=geometry["latitude"],

                longitude=geometry["longitude"],

                event_date=geometry["event_date"]

            )

            db.add(event)
                        
            existing_ids.add(
                item["id"]
            )

            imported += 1

            print("Agregado a la sesion SQLAlchemy")

        print("\n==============================")
        print("REALIZANDO COMMIT...")
        print("==============================")

        t0 = time.time()

        db.commit()

        print(
            f"Commit terminado "
            f"({time.time()-t0:.2f} segundos)"
        )

        print("\n==============================")
        print("IMPORTACION FINALIZADA")
        print("==============================")
        print(f"Importados : {imported}")
        print(f"Omitidos   : {skipped}")

        return {

            "imported": imported,

            "skipped": skipped

        }

    except Exception as e:

        print("\nERROR DURANTE IMPORTACION")
        print(e)

        db.rollback()

        raise