from pymongo.errors import PyMongoError
from .exceptions import TodoServiceError
class TodoService:
    def __init__(self,db):
        self.collection=db["todos"]

    def get_all_todo_items(self):

        try:
            todos=self.collection.find().sort("_id",1)

            todo_items=[]
            for todo in todos:
                todo_items.append(
                    {
                        "id": str(todo["_id"]),
                        "description": todo["description"],
                    }
                )

            return todo_items

        except PyMongoError as ex:
            raise TodoServiceError("Failed to retrieve todo items.") from ex

    def create_todo(self, description):

        try:

            inserted_todo=self.collection.insert_one(
                {
                    "description":description,
                }
            )

            return {
                "id": str(inserted_todo.inserted_id),
                "description": description,
            }

        except PyMongoError as ex:
            raise TodoServiceError("Failed to create todo item.") from ex