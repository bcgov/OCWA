import subprocess
import os
import signal
import json
import sys

def run(command):
    process = subprocess.Popen(command, shell=True, preexec_fn=os.setsid)
    return process


CONFIG={}
KEY=""
SECRET=""
BUCKET=""

with open('./microservices/requestApi/config/default.json') as json_fp:
    CONFIG=json.load(json_fp)
    KEY=CONFIG['storageApi']['key']
    SECRET=CONFIG['storageApi']['secret']
    BUCKET=CONFIG['storageApi']['bucket']

print("KEY="+KEY+" SECRET="+SECRET+" BUCKET="+BUCKET)
minio = run('export MINIO_ACCESS_KEY="'+KEY+'" && export MINIO_SECRET_KEY="'+SECRET+'" && minio server ./minioTmp')
tusd = run('export AWS_ACCESS_KEY_ID="'+KEY+'" && export AWS_SECRET_ACCESS_KEY="'+SECRET+'" && export AWS_REGION=us-east-1 && tusd -s3-endpoint http://localhost:9000 -s3-bucket '+BUCKET)
# forumA = run('cd ./microservices/forumApi && npm i && npm run dev')
policyA = run('cd ./microservices/policyApi && source venv/bin/activate && pip install -r requirements.txt && python wsgi.py')
projA = run('cd ./microservices/projectApi && npm i && npm run dev')
reqA = run('cd ./microservices/requestApi && npm i && npm run dev')
validateA = run('cd ./microservices/validateApi && source venv/bin/activate && pip install -r requirements.txt && python wsgi.py')
# frontend = run('cd ./frontend && npm i && npm start')

def signal_handler(sig, frame):
    print("Closing all processes")
    os.killpg(os.getpgid(minio.pid), signal.SIGTERM)
    os.killpg(os.getpgid(tusd.pid), signal.SIGTERM)
    # os.killpg(os.getpgid(forumA.pid), signal.SIGTERM)
    os.killpg(os.getpgid(policyA.pid), signal.SIGTERM)
    os.killpg(os.getpgid(projA.pid), signal.SIGTERM)
    os.killpg(os.getpgid(reqA.pid), signal.SIGTERM)
    os.killpg(os.getpgid(validateA.pid), signal.SIGTERM)
    # os.killpg(os.getpgid(frontend.pid), signal.SIGTERM)
    print("Succesfully quit OCWA")
    sys.exit(0)


signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)

signal.pause()