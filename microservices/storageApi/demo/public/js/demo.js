document.getElementById('test').addEventListener("change", function(e) {
    // Get the selected file from the input element
    var file = e.target.files[0];

    // Create a new tus upload
    var upload = new tus.Upload(file, {
        endpoint: "http://ocwa-storage-api-cddi-dlt-dev.pathfinder.gov.bc.ca/files/",
        retryDelays: [0, 1000, 3000, 5000],
        metadata: {
            filename: file.name,
            filetype: file.type,
            jwt: "JWTHERE"
        },
        onError: function(error) {
            console.log("Failed because: " + error)
        },
        onProgress: function(bytesUploaded, bytesTotal) {
            var percentage = (bytesUploaded / bytesTotal * 100).toFixed(2);
            document.getElementById('progress').style.width = percentage + "%";
            console.log(bytesUploaded, bytesTotal, percentage + "%")
        },
        onSuccess: function() {
            console.log("Download %s from %s", upload.file.name, upload.url)
        }
    });

    // Start the upload
    upload.start()
});