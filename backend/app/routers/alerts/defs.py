from datetime import datetime, timedelta


def calculate_next_alert_date(frequency, preferred_day):

    now = datetime.utcnow()

    if frequency == "DAILY":
        return now + timedelta(days=1)

    if frequency == "WEEKLY":
        return now + timedelta(days=7)

    if frequency == "MONTHLY":
        day = preferred_day or 1

        return datetime(now.year, now.month, day)

    return now
