import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pydantic import BaseModel, Field

load_dotenv()

class ItemIn(BaseModel):
    name: str = Field(min_length=1)
    count: int = Field(ge=0)

async def test_endpoint_logic():
    try:
        # Setup like in your main.py
        client = AsyncIOMotorClient(os.getenv('MONGO_URL'))
        db = client.myapp
        
        print("Testing endpoint logic...")
        
        # Create the same data as your curl request
        item_data = {"name": "ahmed", "count": 2000}
        item = ItemIn(**item_data)
        print(f"✓ Pydantic model created: {item}")
        
        # Test the same database operation as your endpoint
        res = await db.items.insert_one(item.model_dump())
        print(f"✓ Insert successful! ID: {res.inserted_id}")
        
        # Test the response format
        response = {"id": str(res.inserted_id), **item.model_dump()}
        print(f"✓ Response would be: {response}")
        
        # Clean up
        await db.items.delete_one({"_id": res.inserted_id})
        print("✓ Test document cleaned up")
        
    except Exception as e:
        print(f"❌ Error in endpoint logic: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_endpoint_logic())

