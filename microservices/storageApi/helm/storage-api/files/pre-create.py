#!/usr/bin/python3
import fileinput
import json
import os
import jwt

jsonStr = ""

for line in fileinput.input():
    jsonStr += line

js = json.loads(jsonStr)

if 'MetaData' in js:
    meta = js['MetaData']
    if 'jwt' in meta:
        tok = meta['jwt']
        jwtSecret = os.environ['JWT_SECRET']
        aud = os.environ['JWT_AUD']
        try:
            jwt.decode(tok, jwtSecret, audience=aud)
            #Valid JWT
            exit(0)
        except Exception as e:
            print(e)


print ('Either no JWT Or invalid JWT given')
#Forbidden because jwt not specified or invalid
exit(403)