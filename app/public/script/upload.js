document.getElementById('file-upload').addEventListener('change', function(event) {
    const fileInput = event.target;
    const fileName = fileInput.files[0] ? fileInput.files[0].name : "Click file to upload";
    document.getElementById('upload-text').textContent = fileName;
});