from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from bson import json_util
import json
import os


class MongoDB:
    def __init__(self):
        load_dotenv()
        mongo_user = os.getenv("MONGO_USER")
        mongo_password = os.getenv("MONGO_PW")
        uri = f"mongodb+srv://{mongo_user}:{mongo_password}@cluster0.7jk1c.mongodb.net/?retryWrites=true&w=majority"
        self.client = AsyncIOMotorClient(uri)
        self.db = self.client["mlh-2025"]  # Replace with your database name

    async def get_collection(self, collection_name):
        return self.db[collection_name]

    async def insert_one(self, collection_name, document):
        collection = await self.get_collection(collection_name)
        result = await collection.insert_one(document)
        return result.inserted_id

    async def find(self, collection_name, query, limit=0):
        collection = await self.get_collection(collection_name)
        cursor = collection.find(query)
        # Convert MongoDB cursor to list and serialize properly
        documents = [doc async for doc in cursor]
        return json.loads(json_util.dumps(documents))


async def close(self):
    self.client.close()
