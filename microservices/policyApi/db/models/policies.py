from mongoengine import *

class Policies(Document):
    name=StringField(required=True, unique=True)
    rules=ListField(StringField(required=True))
