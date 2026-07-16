import psycopg2

try:
    conexion = psycopg2.connect(
        host="localhost",
        port="9001",
        database="postgres",
        user="postgres",
        password="1234"
    )

    print("✅ Conexión exitosa a PostgreSQL")

    cursor = conexion.cursor()

    cursor.execute("SELECT version();")

    version = cursor.fetchone()

    print("Versión de PostgreSQL:")
    print(version[0])

    cursor.close()
    conexion.close()

    print("✅ Conexión cerrada correctamente")

except Exception as e:
    print("❌ Error al conectar:")
    print(e)