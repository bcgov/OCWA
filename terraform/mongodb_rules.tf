data "template_file" "mongodb_rules_script" {
  template = file("${path.module}/scripts/mongodb-rules.tpl")
  vars = {
    MONGO_USERNAME = var.mongodb["username"]
    MONGO_PASSWORD = random_string.mongoSuperPassword.result
  }
}

resource "local_file" "mongodb_rules_script" {
  content  = data.template_file.mongodb_rules_script.rendered
  filename = "${var.hostRootPath}/mongodb_rules_script.js"
}

resource "null_resource" "mongodb_rules" {
  triggers = {
    "rules" = md5(local_file.mongodb_rules_script.content)
  }

  provisioner "local-exec" {
    environment = {
      SCRIPT_PATH = var.hostRootPath
    }
    command = "docker run --net=ocwa_vnet -v $SCRIPT_PATH:/work mongo:4.1.3 mongo mongodb://ocwa_mongodb/oc_db /work/mongodb_rules_script.js"
  }
  depends_on = [null_resource.mongodb_first_time_install]
}

