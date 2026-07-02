from sqlalchemy import create_engine

DATABASE_URL = "postgresql://postgres:newpassword123@localhost:5432/smarterp"

try:
    engine = create_engine(DATABASE_URL)
    conn = engine.connect()
    print("CONNECTED SUCCESSFULLY")
    conn.close()
except Exception as e:
    print("ERROR:")
    print(e)