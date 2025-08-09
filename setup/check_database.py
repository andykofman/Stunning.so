import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

async def check_database():
    try:
        client = AsyncIOMotorClient(os.getenv('MONGO_URL'))
        db = client.myapp
        
        print("Checking current database state...")
        
        # Check existing items
        items = await db.items.find().to_list(100)
        print(f"Current items in database: {len(items)}")
        for item in items:
            print(f"  - {item}")
        
        # Check indexes
        indexes = await db.items.list_indexes().to_list(100)
        print(f"\nIndexes on items collection:")
        for idx in indexes:
            print(f"  - {idx}")
        
        # Check if 'ahmed' already exists
        ahmed_item = await db.items.find_one({"name": "ahmed"})
        if ahmed_item:
            print(f"\n❌ Item 'ahmed' already exists: {ahmed_item}")
            print("This would cause a duplicate key error!")
        else:
            print("\n✓ No item named 'ahmed' found")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(check_database())

