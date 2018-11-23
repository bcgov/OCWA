from mongoengine import *


class Results(Document):
    file_id=StringField(required=True)
    message=StringField()
    rule_id=StringField(required=True)
    state=IntField(min_value=0, max_value=2)
    mandatory=BooleanField(required=True, default=True)


