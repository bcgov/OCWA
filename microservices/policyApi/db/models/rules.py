from mongoengine import *


class Rules(Document):
    name=StringField(required=True, unique=True)
    source=StringField(required=True)
    mandatory=BooleanField(required=True, default=False)