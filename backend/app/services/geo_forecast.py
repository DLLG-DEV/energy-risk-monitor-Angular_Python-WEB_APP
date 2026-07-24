def get_region(country):

    country = normalize_country(country)

    regions = {
        "United States": "North America",
        "Canada": "North America",
        "Mexico": "North America",
        "Brazil": "South America",
        "Argentina": "South America",
        "Chile": "South America",
        "Germany": "Europe",
        "France": "Europe",
        "Spain": "Europe",
        "China": "Asia",
        "Japan": "Asia",
        "India": "Asia",
        "Australia": "Oceania",
        "New Zealand": "Oceania",
        "Africa": [
            "Zambia",
            "Angola",
            "Tanzania, United Republic of",
            "Kenya",
            "Nigeria",
            "Egypt",
            "Ethiopia",
            "Mozambique",
            "Zimbabwe",
        ],
    }

    return regions.get(country, "Other")


def normalize_country(country):

    if not country:
        return None

    country = country.strip()

    aliases = {
        "USA": "United States",
        "US": "United States",
        "México": "Mexico",
        "Brasil": "Brazil",
        "UK": "United Kingdom",
    }

    return aliases.get(country, country)
