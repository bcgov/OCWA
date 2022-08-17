
import json
from config import Config

def test_v1_rules_get_policies_happy_path(client, mockdb):
    config = Config()
    response = client.get('/v1/export-data', headers=[('Authorization', 'Bearer '+config.data['testJWT'])])
    assert response.status_code == 200
    resp = json.loads(response.data.decode('utf-8'))
    assert len(resp) == 2

def test_v1_rules_get_policy_with_missing_rules(client, mockdb):
    config = Config()
    response = client.get('/v1/bad-policy', headers=[('Authorization', 'Bearer '+config.data['testJWT'])])
    assert response.status_code == 500
    resp = json.loads(response.data.decode('utf-8'))
    assert resp['error'] == 'Missing rules from policy'

def test_v1_rules_get_rule_where_name_exists(client, mockdb):
    config = Config()
    response = client.get('/v1/rules/rule1', headers=[('Authorization', 'Bearer '+config.data['testJWT'])])
    assert response.status_code == 200
    resp = json.loads(response.data.decode('utf-8'))
    assert len(resp) == 1
    assert resp[0]['mandatory'] == False

def test_v1_rules_get_rule_where_name_exists_and_mandatory_rule(client, mockdb):
    config = Config()
    response = client.get('/v1/rules/rule2', headers=[('Authorization', 'Bearer '+config.data['testJWT'])])
    assert response.status_code == 200
    resp = json.loads(response.data.decode('utf-8'))
    assert len(resp) == 1
    assert resp[0]['mandatory'] == True

def test_v1_rules_get_rule_where_name_not_exists(client, mockdb):
    config = Config()
    response = client.get('/v1/rules/ruleX', headers=[('Authorization', 'Bearer '+config.data['testJWT'])])
    assert response.status_code == 200
    resp = json.loads(response.data.decode('utf-8'))
    assert len(resp) == 0


def test_v1_rules_replace_policy_bad_data(client, mockdb):
    config = Config()
    response = client.post('/v1', 
                       data=json.dumps(dict()),
                       content_type='application/json',
                       headers=[('Authorization', 'Bearer ' + config.data['testJWT'])])
    assert response.status_code == 200
    resp = json.loads(response.data.decode('utf-8'))
    assert resp['error'] == 'name is a required attribute'

def test_v1_rules_replace_policy_no_rules(client, mockdb):
    config = Config()
    response = client.post('/v1', 
                       data=json.dumps({"name":"export-code","rules":[]}),
                       content_type='application/json',
                       headers = [('Authorization', 'Bearer ' + config.data['testJWT'])])
    assert response.status_code == 200
    resp = json.loads(response.data.decode('utf-8'))
    assert resp['error'] == 'policy must have atleast one rule'

def test_v1_rules_add_policy(client, mockdb):
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
        'name': 'export-code',
        'rules': ['rule1']
    }
    config = Config()
    response = client.post('/v1', 
                       data=json.dumps(request),
                       content_type='application/json',
                       headers=[('Authorization', 'Bearer ' + config.data['testJWT'])])
    assert response.status_code == 200
    resp = json.loads(response.data.decode('utf-8'))

    assert resp['success'] == 'Written successfully'

    count = mockdb.Policies.objects.count()
    assert count == 3

def test_v1_rules_replace_policy(client, mockdb):
    request = {
        'rules': ['rule1']
    }
    config = Config()
    response = client.post('/v1/' + 'export-data', 
                       data=json.dumps(request),
                       content_type='application/json',
                       headers=[('Authorization', 'Bearer ' + config.data['testJWT'])])
    assert response.status_code == 200
    resp = json.loads(response.data.decode('utf-8'))

    assert resp['success'] == 'Written successfully'

    count = mockdb.Policies.objects.count()
    assert count == 2

def test_v1_rules_replace_rules(client, mockdb):
    rule_set = """ 
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
        'rule_set': rule_set
    }
    config = Config()
    response = client.post('/v1/rules',
                       data=json.dumps(request),
                       content_type='application/json',
                       headers=[('Authorization', 'Bearer ' + config.data['testJWT'])])
    print("Hi")
    print(response.data)
    assert response.status_code == 200
    resp = json.loads(response.data.decode('utf-8'))

    assert resp['success'] == 'Written successfully'

    count = mockdb.Rules.objects.count()
    assert count == 5

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
    response = client.post('/v1/rules/rule_3', 
                       data=json.dumps({"rule":rule}),
                       content_type='application/json',
                       headers=[('Authorization', 'Bearer ' + config.data['testJWT'])])
    assert response.status_code == 200
    resp = json.loads(response.data.decode('utf-8'))

    assert resp['error'] == 'Invalid json'

def test_v1_rules_replace_rule_with_name_mismatch(client, mockdb):
    rule = """ 
        rule new_rule_1 { 
            source = "${file.size} < 100"
        }
    """
    config = Config()
    response = client.post('/v1/rules/rule_3', 
                       data=json.dumps({"rule":rule}),
                       content_type='application/json',
                       headers = [('Authorization', 'Bearer ' + config.data['testJWT'])])
    assert response.status_code == 200
    resp = json.loads(response.data.decode('utf-8'))
    assert resp['error'] == 'rule name mismatch with provided hcl and url'

def test_v1_rules_replace_rule_with_source_missing(client, mockdb):
    rule = """ 
        rule new_rule_1 { 
        }
    """
    config = Config()
    response = client.post('/v1/rules/new_rule_1', 
                       data=json.dumps({"rule":rule}),
                       content_type='application/json',
                       headers = [('Authorization', 'Bearer ' + config.data['testJWT'])])
    resp = json.loads(response.data.decode('utf-8'))
    assert response.status_code == 200
    assert resp['error'] == 'source is a required attribute'
