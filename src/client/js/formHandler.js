function handleSubmit(event) {
    event.preventDefault()

    // check what text was put into the form field
    let formText = document.getElementById('name').value

    if (Client.checkForName(formText)) {
        console.log("::: Form Submitted :::")
        const baseUrl = 'http://localhost:8081/sentiment';
        const headers = {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: formText })
        };

        //API CALL
        fetch(baseUrl, headers)
            .then(res => res.json())
            .then(function (res) {
                updateUI(res);
            })
    } else {
        alert('Invalid URL')
    }

}

function updateUI(res) {
    document.getElementById('pol').innerHTML = "Polarity: " + res.polarity;
    document.getElementById('sub').innerHTML = "Subjectivity: " + res.subjectivity;
    document.getElementById('polCon').innerHTML = "Polarity Confidence: " + res.polarityConfidence;
    document.getElementById('subCon').innerHTML = "Subjectivity Confidence: " + res.subjectivityConfidence;
}

export { handleSubmit }
