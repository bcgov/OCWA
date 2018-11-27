#!/bin/bash -e

export KEYCLOAK_HOME=`pwd`/keycloak
export PATH=$PATH:$KEYCLOAK_HOME/bin

keycloak/bin/kcadm.sh config credentials --server http://ocwa_keycloak:8080/auth --realm master --user $KEYCLOAK_USER --client admin-cli --password $KEYCLOAK_PASSWORD

keycloak/bin/kcadm.sh create realms -s realm=ocwa -s enabled=true -o

CID=$(kcadm.sh create clients -r ocwa -f /work/scripts/keycloak-client-outputchecker.json -s clientId=outputchecker -s enabled=true -s clientAuthenticatorType=client-secret -s secret=$KEYCLOAK_CLIENT_SECRET -s "redirectUris=[\"http://*\",\"https://*\"]" -i)

echo "Client = $CID"

kcadm.sh get clients/$CID -r ocwa

GID=$(kcadm.sh create groups -r ocwa -s name=exporter -i)

echo "Group = $GID"

TUID=$(kcadm.sh create users -r ocwa -s username=testuser -s enabled=true -s email=testuser@nowhere.com -s firstName=TestF -s lastName=TestL -i)

echo "User = $TUID"

kcadm.sh update users/$TUID/groups/$GID -r ocwa -s realm=ocwa -s userId=$TUID -s groupId=$GID -n

kcadm.sh set-password -r ocwa --username testuser --new-password $TESTUSER_PASSWORD

# kcadm.sh create users -r ocwa -s username=testuser3 -s enabled=true -s email=testuser3@nowhere.com -s firstName=TestF -s lastName=TestL
