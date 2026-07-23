import requests

from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session

from app.models.event import Event
from app.core.config import settings

import time
import pycountry
import reverse_geocoder as rg
from app.routers.admin.logs_by_admin import create_log

geo = rg.RGeocoder()

# =====================================================
# MAPEO NASA -> ERM
# =====================================================

CATEGORY_MAP = {

    "wildfires": "FIRE",

    "volcanoes": "VOLCANO",

    "severeStorms": "STORM",

    "floods": "FLOOD",

    "earthquakes": "EARTHQUAKE",

    "seaLakeIce": "ICE"

}

# cache de países
country_cache = {}



# =====================================================
# OBTENER CATALOGO NASA
# =====================================================

def get_nasa_categories():

    print("\n==============================")
    print("CONSULTANDO CATALOGO NASA")
    print("==============================")


    response = requests.get(
        settings.API_NASA_EONET,
        params={
            "limit":5000
        },
        timeout=120
    )


    response.raise_for_status()


    events = response.json().get(
        "events",
        []
    )


    categories={}


    for event in events:

        for category in event.get("categories",[]):

            categories[
                category["id"]
            ] = category["title"]



    print("\nCATEGORIAS ENCONTRADAS")


    for key,value in categories.items():

        print(
            f"{key} -> {value}"
        )


    print(
        "TOTAL:",
        len(categories)
    )


    return categories

# =====================================================
# CONVERTIR UNIDAD DE TIEMPO
# =====================================================

def convert_to_days(
    amount:int,
    unit:str
):

    unit = unit.lower()


    conversions = {

        "day":1,
        "days":1,

        "month":30,
        "months":30,

        "year":365,
        "years":365

    }


    if unit not in conversions:

        raise ValueError(
            "Unidad de tiempo no válida"
        )


    return amount * conversions[unit]



# =====================================================
# OBTENER EVENTOS HISTORICOS NASA EONET
# =====================================================

# def get_last_years_events(years):

#     print("\n==============================")
#     print(f"CONSULTANDO NASA EVENTS {years} AÑOS")
#     print("==============================")


#     end = datetime.now(timezone.utc)

#     start = end - timedelta(
#         days=365 * years
#     )


#     url = settings.API_NASA_EONET


#     params = {

#         "start": start.strftime("%Y-%m-%d"),

#         "end": end.strftime("%Y-%m-%d"),

#         "limit": 10000

#     }


#     all_events=[]

#     seen=set()

#     page=1


#     while True:


#         print(
#             f"\nPAGINA {page}"
#         )


#         response=requests.get(

#             url,

#             params=params,

#             timeout=120

#         )


#         response.raise_for_status()


#         data=response.json()


#         events=data.get(
#             "events",
#             []
#         )


#         print(
#             "Eventos recibidos:",
#             len(events)
#         )


#         if not events:

#             break



#         nuevos=0


#         for event in events:


#             event_id=event.get("id")


#             if event_id not in seen:

#                 seen.add(event_id)

#                 all_events.append(event)

#                 nuevos+=1



#         print(
#             "Nuevos:",
#             nuevos
#         )



#         next_page=data.get(
#             "next"
#         )


#         if not next_page:

#             print(
#                 "No existe siguiente pagina"
#             )

#             break



#         url=next_page


#         params={}


#         page+=1



#         # protección contra errores de API

#         if page > 500:

#             print(
#                 "Limite seguridad alcanzado"
#             )

#             break



#     print("\n==============================")
#     print("TOTAL EVENTOS NASA")
#     print("==============================")


#     print(
#         len(all_events)
#     )


#     return all_events

def get_last_days_events(days:int):


    print("\n==============================")
    print(
        f"CONSULTANDO NASA EONET ULTIMOS {days} DIAS"
    )
    print("==============================")


    end = datetime.now(
        timezone.utc
    )


    start = end - timedelta(
        days=days
    )



    url=settings.API_NASA_EONET



    params={

        "start":
        start.strftime("%Y-%m-%d"),


        "end":
        end.strftime("%Y-%m-%d"),


        "limit":500

    }



    all_events=[]

    seen=set()


    page=1



    while True:



        print(
            f"Pagina {page}"
        )



        response=requests.get(
            url,
            params=params,
            timeout=120
        )



        response.raise_for_status()



        data=response.json()



        events=data.get(
            "events",
            []
        )



        print(
            f"Eventos recibidos: {len(events)}"
        )



        if not events:

            break




        for event in events:


            event_id=event.get("id")



            if event_id not in seen:

                seen.add(event_id)

                all_events.append(event)




        next_page=data.get(
            "next"
        )



        if not next_page:

            break



        url=next_page

        params={}



        page+=1



        if page > 500:

            print(
                "Protección paginación activada"
            )

            break





    print("==============================")
    print(
        f"TOTAL EVENTOS: {len(all_events)}"
    )
    print("==============================")


    return all_events
# =====================================================
# NORMALIZAR CATEGORIA
# =====================================================

def normalize_category(category_id):

    return CATEGORY_MAP.get(
        category_id,
        "OTHER"
    )

# =====================================================
# NORMALIZAR COORDENADAS
# =====================================================

def normalize_geometry_points(geometry):

    points=[]

    seen_dates=set()


    for point in geometry:


        coordinates=point.get(
            "coordinates",
            []
        )


        if len(coordinates)<2:

            continue



        event_date=None


        if point.get("date"):


            event_date=datetime.fromisoformat(

                point["date"]
                .replace(
                    "Z",
                    "+00:00"
                )

            )



        key=str(
            event_date
        )


        if key in seen_dates:

            continue



        seen_dates.add(key)



        points.append({

            "latitude":coordinates[1],

            "longitude":coordinates[0],

            "event_date":event_date

        })


    return points



# =====================================================
# PAIS CON CACHE
# =====================================================

def build_country_cache(events):

    print("\n==============================")
    print("CALCULANDO PAISES")
    print("==============================")

    unique_points = {}

    for item in events:

        geometries = normalize_geometry_points(
            item.get("geometry", [])
        )

        for geometry in geometries:

            key = (
                round(geometry["latitude"], 5),
                round(geometry["longitude"], 5)
            )

            unique_points[key] = (
                geometry["latitude"],
                geometry["longitude"]
            )

    print(
        f"Coordenadas únicas: {len(unique_points)}"
    )

    coordinates = list(unique_points.values())

    t0 = time.time()

    results = geo.query(coordinates)

    print(
        f"Geocoder terminado en {time.time()-t0:.2f}s"
    )

    cache = {}

    for key, result in zip(unique_points.keys(), results):

        country = "UNKNOWN"

        try:

            obj = pycountry.countries.get(
                alpha_2=result["cc"]
            )

            if obj:

                country = obj.name

        except Exception:

            pass

        cache[key] = country

    print(
        f"Países cacheados: {len(cache)}"
    )

    return cache

# =====================================================
# GUARDAR EVENTOS
# =====================================================

def save_events(
    db: Session,
    events: list,
    user
):

    imported = 0
    skipped = 0
    batch = []

    print("\n==============================")
    print("IMPORTANDO EVENTOS")
    print("==============================")

    total_events = len(events)

    existing_ids = {
        x[0]
        for x in db.query(Event.external_id).all()
    }

    # ------------------------------------
    # CACHE DE PAISES
    # ------------------------------------

    t_cache = time.perf_counter()

    country_cache = build_country_cache(events)

    cache_time = time.perf_counter() - t_cache

    print(f"\nCache de países construida en {cache_time:.2f} s")

    global_start = time.perf_counter()

    try:

        for event_number, item in enumerate(events, start=1):

            event_start = time.perf_counter()

            nasa_id = item["id"]
            title = item.get("title")

            # ------------------------------------
            # Categoria
            # ------------------------------------

            if item.get("categories"):

                category = normalize_category(
                    item["categories"][0]["id"]
                )

            else:

                category = "OTHER"

            # ------------------------------------
            # Normalizar geometrías
            # ------------------------------------

            t_geometry = time.perf_counter()

            geometries = normalize_geometry_points(
                item.get("geometry", [])
            )

            geometry_time = time.perf_counter() - t_geometry

            event_imported = 0
            event_skipped = 0

            object_time = 0

            # ------------------------------------
            # Crear objetos
            # ------------------------------------

            for index, geometry in enumerate(geometries):

                if geometry["event_date"]:

                    geometry_id = geometry["event_date"].strftime(
                        "%Y%m%d%H%M%S"
                    )

                else:

                    geometry_id = str(index)

                external_id = f"{nasa_id}_{geometry_id}"

                if external_id in existing_ids:

                    skipped += 1
                    event_skipped += 1
                    continue

                key = (
                    round(geometry["latitude"], 5),
                    round(geometry["longitude"], 5)
                )

                country = country_cache.get(
                    key,
                    "UNKNOWN"
                )

                t_object = time.perf_counter()

                batch.append(

                    Event(

                        external_id=external_id,

                        title=title,

                        category=category,

                        country=country,

                        latitude=geometry["latitude"],

                        longitude=geometry["longitude"],

                        event_date=geometry["event_date"]

                    )

                )

                object_time += (
                    time.perf_counter() - t_object
                )

                existing_ids.add(external_id)

                imported += 1
                event_imported += 1

            # ------------------------------------
            # Estadísticas
            # ------------------------------------

            event_elapsed = (
                time.perf_counter() - event_start
            )

            total_elapsed = (
                time.perf_counter() - global_start
            ) + cache_time

            average = total_elapsed / event_number

            eta = average * (
                total_events - event_number
            )

            # imprimir únicamente cada 100 eventos
            if (
                event_number % 100 == 0
                or event_number == total_events
            ):

                print("\n====================================================")
                print(f"EVENTO {event_number}/{total_events}")
                print(f"NASA ID             : {nasa_id}")
                print(f"GEOMETRIAS          : {len(geometries)}")
                print(f"INSERTADOS EVENTO   : {event_imported}")
                print(f"OMITIDOS EVENTO     : {event_skipped}")
                print(f"NORMALIZAR GEOMETRIA: {geometry_time:.6f} s")
                print(f"CREAR OBJETOS       : {object_time:.6f} s")
                print(f"TIEMPO EVENTO       : {event_elapsed:.6f} s")
                print(f"PROMEDIO            : {average:.6f} s/evento")
                print(f"ETA                 : {eta:.1f} s")

        print("\n==============================")
        print("GUARDANDO EN BASE DE DATOS")
        print("==============================")

        t_insert = time.perf_counter()

        db.bulk_save_objects(batch)

        db.commit()
        
        create_log(
            db,
            user,
            "EXECUTE",
            "EVENTS",
            "Importación de eventos NASA EONET ejecutada",
            new_data={
                "imported": imported,
                "skipped": skipped,
                "source": "NASA EONET"
            }
        )

        insert_time = (
            time.perf_counter() - t_insert
        )

        total_time = (
            time.perf_counter() - global_start
        ) + cache_time

        print("\n==============================")
        print("FINALIZADO")
        print("==============================")

        print(f"Eventos procesados : {total_events}")
        print(f"Insertados         : {imported}")
        print(f"Omitidos           : {skipped}")
        print(f"Tiempo cache       : {cache_time:.2f} s")
        print(f"Tiempo INSERT SQL  : {insert_time:.2f} s")
        print(f"Tiempo total       : {total_time:.2f} s")
        print(f"Promedio/evento    : {total_time/total_events:.6f} s")

        return {

            "imported": imported,

            "skipped": skipped

        }

    except Exception as e:

        db.rollback()

        print("\n==============================")
        print("ERROR DURANTE IMPORTACION")
        print("==============================")

        print(e)

        raise