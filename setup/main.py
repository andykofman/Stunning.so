import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()
app = FastAPI()

client = AsyncIOMotorClient(os.getenv("MONGO_URL"))
db = client.myapp  # Explicitly specify the database name

class ItemIn(BaseModel):
    name: str = Field(min_length=1)
    count: int = Field(ge=0)

@app.on_event("startup")
async def init_indexes():
    try:
        # Test basic connection first
        print(f"Attempting to connect to: {os.getenv('MONGO_URL')}")
        await client.admin.command('ping')
        print("MongoDB connection successful!")
        
        # Test database access
        await db.command("ping")
        print("Database access successful!")
        
        # Try to create the index
        await db.items.create_index("name", unique=True)
        print("Index created successfully!")
    except Exception as e:
        print(f"Database setup error: {e}, full error: {e}")
        # Don't fail startup, just log the error
        pass

@app.post("/items")
async def create_item(item: ItemIn):
    try:
        res = await db.items.insert_one(item.model_dump())
        return {"id": str(res.inserted_id), **item.model_dump()}
    except Exception as e:
        if "E11000" in str(e):
            raise HTTPException(status_code=409, detail="name already exists")
        raise

@app.get("/items")
async def list_items():
    return [ { "_id": str(d["_id"]), "name": d["name"], "count": d["count"] }
             for d in await db.items.find().to_list(100) ]

@app.get("/items/{name}")
async def get_item(name: str):
    d = await db.items.find_one({"name": name})
    if not d:
        raise HTTPException(status_code=404, detail="not found")
    d["_id"] = str(d["_id"])
    return d

@app.patch("/items/{name}")
async def inc_item(name: str):
    res = await db.items.find_one_and_update(
        {"name": name}, {"$inc": {"count": 1}}, return_document=True
    )
    if not res:
        raise HTTPException(status_code=404, detail="not found")
    res["_id"] = str(res["_id"])
    return res
