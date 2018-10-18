
import json
from config import Config

def test_v1_rules_get_policies_happy_path(client, mockdb):
    config = Config()
    response = client.get('/v1/', headers=[('Authorization', 'Bearer '+config.data['testJWT'])])
    resp = json.loads(response.data.decode('utf-8'))
    assert len(resp) == 2

def test_v1_rules_get_rule_where_name_exists(client, mockdb):
    config = Config()
    response = client.get('/v1/rule1', headers=[('Authorization', 'Bearer '+config.data['testJWT'])])
    resp = json.loads(response.data.decode('utf-8'))
    assert len(resp) == 1
    assert resp[0]['mandatory'] == False

def test_v1_rules_get_rule_where_name_exists_and_mandatory_rule(client, mockdb):
    config = Config()
    response = client.get('/v1/rule2', headers=[('Authorization', 'Bearer '+config.data['testJWT'])])
    resp = json.loads(response.data.decode('utf-8'))
    assert len(resp) == 1
    assert resp[0]['mandatory'] == True

def test_v1_rules_get_rule_where_name_not_exists(client, mockdb):
    config = Config()
    response = client.get('/v1/ruleX', headers=[('Authorization', 'Bearer '+config.data['testJWT'])])
    resp = json.loads(response.data.decode('utf-8'))
    assert len(resp) == 0


def test_v1_rules_replace_policy_bad_data(client, mockdb):
    config = Config()
    response = client.post('/v1', 
                       data=json.dumps(dict()),
                       content_type='application/json',
                       headers=[('Authorization', 'Bearer ' + config.data['testJWT'])])
    resp = json.loads(response.data.decode('utf-8'))
    assert response.status_code == 200
    assert resp['error'] == 'policy is a required attribute'

def test_v1_rules_replace_policy_no_rules(client, mockdb):
    config = Config()
    response = client.post('/v1', 
                       data=json.dumps({"policy":"some_domain_other_than_rule resource {}"}),
                       content_type='application/json',
                       headers = [('Authorization', 'Bearer ' + config.data['testJWT'])])
    resp = json.loads(response.data.decode('utf-8'))
    assert response.status_code == 200
    assert resp['error'] == 'Invalid json'

def test_v1_rules_replace_policy(client, mockdb):
    policy = """ 
        rule new_rule_1 { 
            source = "${file.size} < 100"
        }
        rule new_rule_2 {
            source = "${file.type} == 'js' || ${file.type} == 'css'"
        }
        rule new_rule_3 {
            source = "${file.type} == 'jpg'"
        }
    """

    request = {
        'policy': policy
    }
    config = Config()
    response = client.post('/v1', 
                       data=json.dumps(request),
                       content_type='application/json',
                       headers=[('Authorization', 'Bearer ' + config.data['testJWT'])])
    resp = json.loads(response.data.decode('utf-8'))

    assert response.status_code == 200
    assert resp['success'] == 'Written successfully'

    count = mockdb.Rules.objects.count()
    assert count == 3


    rules = mockdb.Rules.objects().order_by('name')
    assert rules[0].name == 'new_rule_1'
    assert rules[1].name == 'new_rule_2'
    assert rules[2].name == 'new_rule_3'


def test_v1_rules_replace_rule_with_invalid_json(client, mockdb):
    rule = """ 
        another_domain abc { 
        }
    """
    config = Config()
    response = client.post('/v1/rule_3', 
                       data=json.dumps({"rule":rule}),
                       content_type='application/json',
                       headers=[('Authorization', 'Bearer ' + config.data['testJWT'])])
    resp = json.loads(response.data.decode('utf-8'))

    assert response.status_code == 200
    assert resp['error'] == 'Invalid json'

def test_v1_rules_replace_rule_with_name_mismatch(client, mockdb):
    rule = """ 
        rule new_rule_1 { 
            source = "${file.size} < 100"
        }
    """
    config = Config()
    response = client.post('/v1/rule_3', 
                       data=json.dumps({"rule":rule}),
                       content_type='application/json',
                       headers = [('Authorization', 'Bearer ' + config.data['testJWT'])])
    resp = json.loads(response.data.decode('utf-8'))
    assert response.status_code == 200
    assert resp['error'] == 'rule name mismatch with provided hcl and url'

def test_v1_rules_replace_rule_with_source_missing(client, mockdb):
    rule = """ 
        rule new_rule_1 { 
        }
    """
    config = Config()
    response = client.post('/v1/new_rule_1', 
                       data=json.dumps({"rule":rule}),
                       content_type='application/json',
                       headers = [('Authorization', 'Bearer ' + config.data['testJWT'])])
    resp = json.loads(response.data.decode('utf-8'))
    assert response.status_code == 200
    assert resp['error'] == 'source is a required attribute'


# def test_v1_rules_replace_rule_success_without_mandatory(client, mockdb):
#     rule = """ 
#         rule rule4 { 
#             source = "${file.size} < 100"
#         }
#     """

#     response = client.post('/v1/rule4', 
#                        data=json.dumps({"rule":rule}),
#                        content_type='application/json')
#     resp = json.loads(response.data.decode('utf-8'))
#     assert response.status_code == 200
#     print(resp)
#     assert resp['success'] == 'Written successfully'
