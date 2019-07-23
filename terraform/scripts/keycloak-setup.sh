#!/bin/bash -e

export KEYCLOAK_HOME=`pwd`/keycloak
export PATH=$PATH:$KEYCLOAK_HOME/bin

keycloak/bin/kcadm.sh config credentials --server http://ocwa_keycloak:8080/auth --realm master --user $KEYCLOAK_USER --client admin-cli --password $KEYCLOAK_PASSWORD

keycloak/bin/kcadm.sh create realms -s realm=ocwa -s enabled=true -o

CID=$(kcadm.sh create clients -r ocwa -f /work/scripts/keycloak-client-outputchecker.json -s clientId=outputchecker -s enabled=true -s clientAuthenticatorType=client-secret -s secret=$KEYCLOAK_CLIENT_SECRET -s "redirectUris=[\"http://*\",\"https://*\"]" -i)

echo "Client = $CID"

kcadm.sh get clients/$CID -r ocwa

GID1=$(kcadm.sh create groups -r ocwa -s name=exporter -i)
GID2=$(kcadm.sh create groups -r ocwa -s name=project_1 -i)
GID3=$(kcadm.sh create groups -r ocwa -s name=oc -i)
GID4=$(kcadm.sh create groups -r ocwa -s name=project_override_1 -i)
GID5=$(kcadm.sh create groups -r ocwa -s name=researchers -i)
GID6=$(kcadm.sh create groups -r ocwa -s name=reporter -i)

echo "Group = $GID1"
echo "Group = $GID2"
echo "Group = $GID3"
echo "Group = $GID4"
echo "Group = $GID5"
echo "Group = $GID6"

TUID=$(kcadm.sh create users -r ocwa -s username=testuser -s enabled=true -s email=testuser@nowhere.com -s firstName=TestF -s lastName=TestL -i)

echo "User = $TUID"

kcadm.sh update users/$TUID/groups/$GID1 -r ocwa -s realm=ocwa -s userId=$TUID -s groupId=$GID1 -n

kcadm.sh update users/$TUID/groups/$GID2 -r ocwa -s realm=ocwa -s userId=$TUID -s groupId=$GID2 -n

kcadm.sh set-password -r ocwa --username testuser --new-password $TESTUSER_PASSWORD

# kcadm.sh create users -r ocwa -s username=testuser3 -s enabled=true -s email=testuser3@nowhere.com -s firstName=TestF -s lastName=TestL

TUID=$(kcadm.sh create users -r ocwa -s username=researcher_1 -s enabled=true -s email=researcher_1@nowhere.com -s firstName=ResF -s lastName=ResL -i)

kcadm.sh update users/$TUID/groups/$GID1 -r ocwa -s realm=ocwa -s userId=$TUID -s groupId=$GID1 -n
kcadm.sh update users/$TUID/groups/$GID2 -r ocwa -s realm=ocwa -s userId=$TUID -s groupId=$GID2 -n
kcadm.sh update users/$TUID/groups/$GID5 -r ocwa -s realm=ocwa -s userId=$TUID -s groupId=$GID5 -n
kcadm.sh set-password -r ocwa --username researcher_1 --new-password researcher_1_password

TUID=$(kcadm.sh create users -r ocwa -s username=researcher_2 -s enabled=true -s email=researcher_2@nowhere.com -s firstName=ResF -s lastName=ResL -i)
kcadm.sh update users/$TUID/groups/$GID1 -r ocwa -s realm=ocwa -s userId=$TUID -s groupId=$GID1 -n
kcadm.sh update users/$TUID/groups/$GID4 -r ocwa -s realm=ocwa -s userId=$TUID -s groupId=$GID4 -n
kcadm.sh update users/$TUID/groups/$GID5 -r ocwa -s realm=ocwa -s userId=$TUID -s groupId=$GID5 -n
kcadm.sh set-password -r ocwa --username researcher_2 --new-password researcher_2_password

TUID=$(kcadm.sh create users -r ocwa -s username=researcher_3 -s enabled=true -s email=researcher_3@nowhere.com -s firstName=ResF -s lastName=ResL -i)
kcadm.sh update users/$TUID/groups/$GID1 -r ocwa -s realm=ocwa -s userId=$TUID -s groupId=$GID1 -n
kcadm.sh update users/$TUID/groups/$GID2 -r ocwa -s realm=ocwa -s userId=$TUID -s groupId=$GID2 -n
kcadm.sh update users/$TUID/groups/$GID5 -r ocwa -s realm=ocwa -s userId=$TUID -s groupId=$GID5 -n
kcadm.sh set-password -r ocwa --username researcher_3 --new-password researcher_3_password

TUID=$(kcadm.sh create users -r ocwa -s username=reporter_1 -s enabled=true -s email=reporter_1@nowhere.com -s firstName=ReporterF -s lastName=ReporterL -i)
kcadm.sh update users/$TUID/groups/$GID6 -r ocwa -s realm=ocwa -s userId=$TUID -s groupId=$GID6 -n
kcadm.sh set-password -r ocwa --username reporter_1 --new-password reporter_1_password

OCUID=$(kcadm.sh create users -r ocwa -s username=ocuser_1 -s enabled=true -s email=ocuser@nowhere.com -s firstName=OutCheckF -s lastName=OutCheckL -i)
echo "User = $OCUID"

kcadm.sh update users/$OCUID/groups/$GID3 -r ocwa -s realm=ocwa -s userId=$OCUID -s groupId=$GID3 -n
kcadm.sh set-password -r ocwa --username ocuser_1 --new-password ocuser_1_password
