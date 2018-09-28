import json
import os
import logging


class DefaultConfig:
    data = None
    def __init__(self):
        _default_data_path = 'config/default.json'
        with open(_default_data_path) as json_data_file:
            self.data = json.load(json_data_file)


class ProductionConfig(DefaultConfig):
    def __init__(self):
        _prod_data_path = 'config/production.json'
        if (os.path.isfile(_prod_data_path)):
            with open(_prod_data_path) as json_data_file:
                prod_data = json.load(json_data_file)
                self.data.update(prod_data)


class DevelopmentConfig(DefaultConfig):
    def __init__(self):
        super().__init__()
        _dev_data_path = 'config/development.json'
        if (os.path.isfile(_dev_data_path)):
            with open(_dev_data_path) as json_data_file:
                dev_data = json.load(json_data_file)
                self.data.update(dev_data)


class TestingConfig(DefaultConfig):
    def __init__(self):
        _test_data_path = 'config/test.json'
        if (os.path.isfile(_test_data_path)):
            with open(_test_data_path) as json_data_file:
                test_data = json.load(json_data_file)
                self.data.update(test_data)


class Config:
    environment = os.getenv('ENVIRONMENT', os.getenv('ENV', 'development')).lower()
    conf = None
    data = None
    logger = logging.getLogger(__name__)

    def __init__(self):
        if not Config.conf:
            self.logger.debug("initializing config")
            if self.environment == "production":
                Config.conf = ProductionConfig()
            elif self.environment == "test" or self.environment == "testing":
                Config.conf = TestingConfig()
            else:
                Config.conf = DevelopmentConfig()
            Config.data = Config.conf.data


