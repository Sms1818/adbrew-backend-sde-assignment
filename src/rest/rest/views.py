from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json, logging, os
from pymongo import MongoClient
from .todo_service import TodoService
from .exceptions import TodoServiceError


logger = logging.getLogger(__name__)

mongo_uri = 'mongodb://' + os.environ["MONGO_HOST"] + ':' + os.environ["MONGO_PORT"]
db = MongoClient(mongo_uri)['test_db']

todo_service=TodoService(db)

class TodoListView(APIView):

    def get(self, request):
        try:
            todo_items= todo_service.get_all_todo_items()

            return Response(todo_items, status=status.HTTP_200_OK)

        except TodoServiceError:
            logger.exception("Failed to fetch todo items")
            return Response(
                {"error":"Unable to fetch todo items!"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
    def post(self, request):

        description=request.data.get("description")

        if not description:
            return Response(
                {"error":"Description is required!"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            todo_item= todo_service.create_todo(description)
            return Response(
                todo_item,
                status=status.HTTP_201_CREATED,
            )

        except TodoServiceError:
            logger.exception("Failed to create todo item.")

            return Response(
                {"error": "Unable to create todo item."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


        return Response({}, status=status.HTTP_200_OK)

