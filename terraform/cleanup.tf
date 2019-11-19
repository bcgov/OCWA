
resource "null_resource" "cleanup" {

    depends_on = [
        docker_network.private_network
    ]

    provisioner "local-exec" {
        when = "destroy"
        command= "rm -rf _tmp"
    }
}
