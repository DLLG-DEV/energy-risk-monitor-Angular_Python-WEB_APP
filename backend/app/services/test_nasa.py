# import requests
# from datetime import datetime, timedelta, timezone
# from collections import Counter

# from app.core.config import settings

# def get_nasa_events():

#     end = datetime.now(timezone.utc)

#     start = end - timedelta(days=365 * 5)


#     print("==============================")
#     print("CONSULTANDO NASA EONET")
#     print("==============================")


#     print("Inicio:", start)
#     print("Fin:", end)


#     all_events = []

#     limit = 5000

#     offset = 0

#     max_pages = 100  # seguridad contra ciclos infinitos


#     existing_ids = set()


#     page = 0


#     while page < max_pages:


#         print(
#             f"\nConsultando offset {offset}"
#         )


#         response = requests.get(

#             settings.API_NASA_EONET,

#             params={

#                 "start": start.strftime("%Y-%m-%d"),

#                 "end": end.strftime("%Y-%m-%d"),

#                 "limit": limit,

#                 "offset": offset

#             },

#             timeout=120

#         )


#         response.raise_for_status()


#         data = response.json()


#         events = data.get(
#             "events",
#             []
#         )


#         print(
#             f"Eventos pagina: {len(events)}"
#         )


#         if not events:

#             print(
#                 "No hay más eventos."
#             )

#             break



#         new_events = []


#         for event in events:

#             event_id = event.get("id")


#             if event_id not in existing_ids:

#                 existing_ids.add(event_id)

#                 new_events.append(event)



#         print(
#             f"Nuevos eventos: {len(new_events)}"
#         )



#         if not new_events:

#             print(
#                 "Página repetida. Finalizando."
#             )

#             break



#         all_events.extend(
#             new_events
#         )


#         # si regresó menos que el límite
#         # probablemente es la última página

#         if len(events) < limit:

#             print(
#                 "Última página encontrada."
#             )

#             break



#         offset += limit

#         page += 1



#     print("\n==============================")
#     print("TOTAL EVENTOS OBTENIDOS")
#     print("==============================")

#     print(
#         len(all_events)
#     )


#     return all_events

# def analyze_categories(events):

#     categories = []


#     print("\n==============================")
#     print("ANALIZANDO CATEGORIAS")
#     print("==============================")


#     for event in events:


#         nasa_categories = event.get(
#             "categories",
#             []
#         )


#         for category in nasa_categories:


#             categories.append(
#                 category["title"]
#             )


#     counter = Counter(categories)



#     print("\nTOTAL CATEGORIAS ENCONTRADAS:")
#     print(
#         len(counter)
#     )



#     print("\n==============================")
#     print("CLASIFICACION NASA")
#     print("==============================")


#     for name,total in counter.most_common():

#         print(
#             f"{name}: {total}"
#         )



# def analyze_examples(events):


#     print("\n==============================")
#     print("EJEMPLOS DE EVENTOS")
#     print("==============================")


#     for event in events[:20]:

#         categories = [
#             x["title"]
#             for x in event.get(
#                 "categories",
#                 []
#             )
#         ]


#         print(
#             event["title"],
#             "->",
#             categories
#         )



# def main():


#     events = get_nasa_events()


#     print(
#         f"\nEventos recibidos TOTAL: {len(events)}"
#     )


#     analyze_categories(
#         events
#     )


#     analyze_examples(
#         events
#     )



# if __name__ == "__main__":

#     main()