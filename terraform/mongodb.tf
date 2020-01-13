data "docker_registry_image" "mongodb" {
  name = "mongo:4.2.1"
}

resource "docker_image" "mongodb" {
  name          = data.docker_registry_image.mongodb.name
  pull_triggers = [data.docker_registry_image.mongodb.sha256_digest]
  keep_locally  = true
}

resource "docker_container" "ocwa_mongodb" {
  image   = docker_image.mongodb.latest
  name    = "ocwa_mongodb"
  restart = "on-failure"
  volumes {
    host_path      = "${var.hostRootPath}/data/mongodb"
    container_path = "/data/db"
  }
  networks_advanced {
    name = docker_network.private_network.name
  }

  healthcheck {
    test         = ["CMD", "/bin/sh", "-c", "echo 'show databases' | mongo"]
    interval     = "5s"
    timeout      = "5s"
    start_period = "10s"
    retries      = 20
  }
}

data "template_file" "mongodb_script" {
  template = file("${path.module}/scripts/mongodb.tpl")
  vars = {
    MONGO_USERNAME = var.mongodb["username"]
    MONGO_PASSWORD = random_string.mongoSuperPassword.result
  }
}

data "template_file" "formio_script" {
  template = file("${path.module}/scripts/formio.tpl")
  vars = {
    MONGO_USERNAME = var.mongodb["username"]
    MONGO_PASSWORD = random_string.mongoSuperPassword.result
  }
}

resource "local_file" "mongodb_script" {
  content  = data.template_file.mongodb_script.rendered
  filename = "${var.hostRootPath}/mongodb_script.js"
}

resource "local_file" "formio_script" {
  content  = data.template_file.formio_script.rendered
  filename = "${var.hostRootPath}/formio_script.js"
}

resource "null_resource" "mongodb_first_time_install" {
  provisioner "local-exec" {
    command = "${path.module}/scripts/wait-for-healthy.sh ocwa_mongodb"
  }

  provisioner "local-exec" {
    environment = {
      SCRIPT_PATH = var.hostRootPath
    }
    command = "docker run --net=ocwa_vnet -v \"$SCRIPT_PATH:/work\" mongo:4.2.1 mongo mongodb://ocwa_mongodb/oc_db /work/mongodb_script.js"
  }
  depends_on = [docker_container.ocwa_mongodb]
}

resource "null_resource" "mongodb_formio_first_Time_install" {
  provisioner "local-exec" {
    command = "${path.module}/scripts/wait-for-healthy.sh ocwa_mongodb"
  }

  provisioner "local-exec" {
    command = "sleep 30"
  }

  provisioner "local-exec" {
    environment = {
      SCRIPT_PATH = var.hostRootPath
    }
    command = "docker run --net=ocwa_vnet -v \"$SCRIPT_PATH:/work\" mongo:4.2.1 mongo mongodb://ocwa_mongodb/formioapp /work/formio_script.js"
  }


  provisioner "local-exec" {
    environment = {
      SCRIPT_PATH = var.hostRootPath
    }
    command = "docker run --net=ocwa_vnet -v \"$SCRIPT_PATH/..:/work\" mongo:4.2.1 mongoimport  --uri=mongodb://${var.mongodb["username"]}:${random_string.mongoSuperPassword.result}@ocwa_mongodb:27017/formioapp --file=/work/scripts/formio/actionItems.json --collection=actionitems"
  }

  provisioner "local-exec" {
    environment = {
      SCRIPT_PATH = var.hostRootPath
    }
    command = "docker run --net=ocwa_vnet -v \"$SCRIPT_PATH/..:/work\" mongo:4.2.1 mongoimport  --uri=mongodb://${var.mongodb["username"]}:${random_string.mongoSuperPassword.result}@ocwa_mongodb:27017/formioapp --file=/work/scripts/formio/actions.json --collection=actions"
  }

  provisioner "local-exec" {
    environment = {
      SCRIPT_PATH = var.hostRootPath
    }
    command = "docker run --net=ocwa_vnet -v \"$SCRIPT_PATH/..:/work\" mongo:4.2.1 mongoimport  --uri=mongodb://${var.mongodb["username"]}:${random_string.mongoSuperPassword.result}@ocwa_mongodb:27017/formioapp --file=/work/scripts/formio/forms.json --collection=forms"
  }

  provisioner "local-exec" {
    environment = {
      SCRIPT_PATH = var.hostRootPath
    }
    command = "docker run --net=ocwa_vnet -v \"$SCRIPT_PATH/..:/work\" mongo:4.2.1 mongoimport  --uri=mongodb://${var.mongodb["username"]}:${random_string.mongoSuperPassword.result}@ocwa_mongodb:27017/formioapp --file=/work/scripts/formio/projects.json --collection=projects"
  }

  provisioner "local-exec" {
    environment = {
      SCRIPT_PATH = var.hostRootPath
    }
    command = "docker run --net=ocwa_vnet -v \"$SCRIPT_PATH/..:/work\" mongo:4.2.1 mongoimport  --uri=mongodb://${var.mongodb["username"]}:${random_string.mongoSuperPassword.result}@ocwa_mongodb:27017/formioapp --file=/work/scripts/formio/roles.json --collection=roles"
  }

  provisioner "local-exec" {
    environment = {
      SCRIPT_PATH = var.hostRootPath
    }
    command = "docker run --net=ocwa_vnet -v \"$SCRIPT_PATH/..:/work\" mongo:4.2.1 mongoimport  --uri=mongodb://${var.mongodb["username"]}:${random_string.mongoSuperPassword.result}@ocwa_mongodb:27017/formioapp --file=/work/scripts/formio/schema.json --collection=schema"
  }

  provisioner "local-exec" {
    environment = {
      SCRIPT_PATH = var.hostRootPath
    }
    command = "docker run --net=ocwa_vnet -v \"$SCRIPT_PATH/..:/work\" mongo:4.2.1 mongoimport  --uri=mongodb://${var.mongodb["username"]}:${random_string.mongoSuperPassword.result}@ocwa_mongodb:27017/formioapp --file=/work/scripts/formio/submissions.json --collection=submissions"
  }

  provisioner "local-exec" {
    environment = {
      SCRIPT_PATH = var.hostRootPath
    }
    command = "docker run --net=ocwa_vnet -v \"$SCRIPT_PATH/..:/work\" mongo:4.2.1 mongoimport  --uri=mongodb://${var.mongodb["username"]}:${random_string.mongoSuperPassword.result}@ocwa_mongodb:27017/formioapp --file=/work/scripts/formio/tokens.json --collection=tokens"
  }

  provisioner "local-exec" {
    environment = {
      SCRIPT_PATH = var.hostRootPath
    }
    command = "docker run --net=ocwa_vnet mongo:4.2.1 mongo mongodb://${var.mongodb["username"]}:${random_string.mongoSuperPassword.result}@ocwa_mongodb:27017/formioapp --eval \"db.forms.find({})\""
  }


  depends_on = [docker_container.ocwa_mongodb, docker_container.formio, local_file.formio_script]
}

