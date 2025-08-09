import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

async def test_connection():
    try:
        client = AsyncIOMotorClient(os.getenv('MONGO_URL'))
        print(f"Connecting to: {os.getenv('MONGO_URL')}")
        
        # Test basic connection
        await client.admin.command('ping')
        print("✓ MongoDB connection successful!")
        
        # Test database access
        await client.myapp.command('ping')
        print("✓ Database access successful!")
        
        # Test inserting a document
        result = await client.myapp.items.insert_one({"name": "test", "count": 1})
        print(f"✓ Insert successful! ID: {result.inserted_id}")
        
        # Clean up test document
        await client.myapp.items.delete_one({"name": "test"})
        print("✓ Test document cleaned up")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_connection())

