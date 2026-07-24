def calculate_risk(events):

    if events >= 50:
        return "CRITICAL"

    if events >= 30:
        return "HIGH"

    if events >= 10:
        return "MEDIUM"

    return "LOW"
