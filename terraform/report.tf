data "template_file" "report" {
  template = "${file("${path.module}/scripts/report.tpl")}"
  vars = {
    requestApiDigest = "${data.docker_registry_image.ocwa_request_api.sha256_digest}"      
    policyApiDigest = "${data.docker_registry_image.ocwa_policy_api.sha256_digest}"      
    projectApiDigest = "${data.docker_registry_image.ocwa_project_api.sha256_digest}"      
    validateApiDigest = "${data.docker_registry_image.ocwa_validate_api.sha256_digest}"      
    forumApiDigest = "${data.docker_registry_image.ocwa_forum_api.sha256_digest}"      
    frontendDigest = "${data.docker_registry_image.ocwa_frontend.sha256_digest}"      
  }
}

resource "local_file" "report_script" {
    content = "${data.template_file.report.rendered}"
    filename = "${var.hostRootPath}/config/nginx/www/version/index.html"
}


data "template_file" "terraform_lock" {
  template = "${file("${path.module}/scripts/terraform.lock.tpl")}"
  vars = {
    owner = "${var.images["owner"]}"      
    requestApiDigest = "@${data.docker_registry_image.ocwa_request_api.sha256_digest}"      
    policyApiDigest = "@${data.docker_registry_image.ocwa_policy_api.sha256_digest}"      
    projectApiDigest = "${data.docker_registry_image.ocwa_project_api.sha256_digest}"      
    validateApiDigest = "@${data.docker_registry_image.ocwa_validate_api.sha256_digest}"      
    forumApiDigest = "@${data.docker_registry_image.ocwa_forum_api.sha256_digest}"      
    frontendDigest = "@${data.docker_registry_image.ocwa_frontend.sha256_digest}"      
  }
}

resource "local_file" "terraform_lock" {
    content = "${data.template_file.terraform_lock.rendered}"
    filename = "terraform.auto.tfvars.pending"
}
