#!/bin/sh

#
# Shell script to decode jwts
#


secret=${JWT_SECRET}

base64_encode()
{
	input=${1:-$(</dev/stdin)}
	# Use `tr` to URL encode the output from base64.
	printf '%s' "${input}" | base64 | tr -d '=' | tr '/+' '_-' | tr -d '\n'
}

base64_decode()
{
	input=${1:-$(</dev/stdin)}
	# A standard base64 string should always be `n % 4 == 0`. We made the base64
	# string URL safe when we created the JWT, which meant removing the `=`
	# signs that are there for padding. Now we must add them back to get the
	# proper length.
	remainder=$((${#input} % 4));
	if [ $remainder -eq 1 ];
	then
		>2& echo "fatal error. base64 string is unexepcted length"
	elif [[ $remainder -eq 2 || $remainder -eq 3 ]];
	then
		input="${input}$(for i in `seq $((4 - $remainder))`; do printf =; done)"
	fi
	printf '%s' "${input}" | base64 --decode
}

verify_signature()
{
	header_and_payload=${1}
	expected=$(echo "${header_and_payload}" | hmacsha256_encode | base64_encode)
	actual=${2}

	if [ "${expected}" = "${actual}" ]
	then
	    echo "signature verified"
		exit 0
	else
	    echo "invalid signature"
		exit 403
	fi
}

hmacsha256_encode()
{
	input=${1:-$(</dev/stdin)}
	printf '%s' "${input}" | openssl dgst -binary -sha256 -hmac "${secret}"
}

# Read the token from stdin
token=${1:-$(</dev/stdin)};

if [ "$token" = "" ]
then
    exit 403
fi

header=$(echo "$token" | cut -d'.' -f1 -)
payload=$(echo "$token" | cut -d'.' -f2 -)
signature=$(echo "$token" | cut -d'.' -f3 -)

if [ "$header" = "" ]
then
    exit 403
fi
if [ "$payload" = "" ]
then
    exit 403
fi
if [ "$signature" = "" ]
then
    exit 403
fi

verify_signature "${header}.${payload}" "${signature}"