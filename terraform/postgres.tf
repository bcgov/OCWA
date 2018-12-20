data "docker_registry_image" "postgres" {
  name = "postgres:9.6.9"
}

resource "docker_image" "postgres" {
  name          = "${data.docker_registry_image.postgres.name}"
  pull_triggers = ["${data.docker_registry_image.postgres.sha256_digest}"]
}

resource "docker_container" "ocwa_postgres" {
  image = "${docker_image.postgres.latest}"
  name = "ocwa_postgres"
  volumes = { 
    host_path = "${var.hostRootPath}/data/postgres"
    container_path = "/var/lib/postgresql/data"
  }
  env = [
      "POSTGRES_USER=padmin",
      "POSTGRES_PASSWORD=${random_string.postgresSuperPassword.result}"
  ]
  networks_advanced = { name = "${docker_network.private_network.name}" }

  healthcheck = {
    test = ["CMD-SHELL", "pg_isready -U pgadmin"]
    interval = "30s"
    timeout = "30s"
    retries = 3
  }
}

data "template_file" "postgres_script" {
  template = "${file("${path.module}/scripts/psql.tpl")}"
  vars = {
     POSTGRES_APP_USERNAME = "${var.postgres["username"]}",
     POSTGRES_APP_PASSWORD = "${random_string.postgresAppPassword.result}"
  }
}

resource "local_file" "postgres_script" {
    content = "${data.template_file.postgres_script.rendered}"
    filename = "${var.hostRootPath}/postgres_script.psql"
}

resource "null_resource" "postgres_first_time_install" {
  provisioner "local-exec" {
    command = "scripts/wait-for-healthy.sh ocwa_postgres"
  }

  provisioner "local-exec" {
    environment = {
      SCRIPT_PATH = "${var.hostRootPath}"
      POSTGRES_USER = "padmin"
      POSTGRES_PASSWORD = "${random_string.postgresSuperPassword.result}"
    }
    command = "docker run --net=ocwa_vnet -v $SCRIPT_PATH:/work postgres:9.6.9 psql postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@ocwa_postgres -f /work/postgres_script.psql"
  }

  depends_on = ["docker_container.ocwa_postgres"]
}
