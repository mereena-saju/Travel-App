var data = {
    temp: '',
    depDate: '',
    city: '',
    img: '',
    diffDays: '',
    daysTrip: ''
}

function getMinMax(d) {
    var dd = d.getDate();
    var mm = d.getMonth() + 1; //January is 0!
    var yyyy = d.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    d = yyyy + '-' + mm + '-' + dd;
    return d;
}
//INIT
async function getGeoCode() {
    event.preventDefault();
    let city = document.getElementById('zip').value;
    data.city = city;

    let dDate = new Date(document.getElementById('depDate').value);
    data.depDate = dDate.toDateString();

    const retDate = new Date(document.getElementById('retDate').value);
    data.daysTrip = Client.calculateTimeDiff(dDate, retDate)

    let imgJson = await postData('/getPixabay', { 'query': city })
    data.img = imgJson.hits[0].webformatURL;
    postData('/getGeoAddress', { 'city': city }).then(function (data) {
        let latLng = { 'lat': data.address.lat, 'lng': data.address.lng };
        processTemp(latLng);

    })

}

// Async POST
const postData = async (url = '', data = {}) => {
    const resp = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    try {
        const newData = await resp.json();
        return newData
    } catch (error) {
        console.log("error", error);
    }
}

const processTemp = async (latLng = '') => {
    let d = new Date();
    let newDate = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
    const now = new Date(newDate);
    const departDate = new Date(document.getElementById('depDate').value);

    const diffDays = Client.calculateTimeDiff(now, departDate);
    data.diffDays = diffDays;

    if (diffDays <= 7) {
        postData('/getCurrent', latLng).then(function (weatherData) {
            data.temp = weatherData.data[0].temp + '°C ' + ', ' + weatherData.data[0].weather.description;
            updateUI();
        })
    } else {
        postData('/getForecast', latLng).then(function (weatherData) {
            const depDate = document.getElementById('depDate').value;
            for (var i = 0; i < weatherData.data.length; i++) {
                if (weatherData.data[i].datetime === depDate) {
                    data.temp = weatherData.data[i].temp + '°C ' + ', ' + weatherData.data[i].weather.description;
                    updateUI();
                }
            }
        })
    }
}

//Dynamially updating the UI
const updateUI = async () => {

    document.getElementById('entryTitle').innerHTML = 'Your Trip Details:'
    document.getElementById('entryTable').className = 'entry';
    document.getElementById('city').innerHTML = 'My Trip to: ' + data.city;
    document.getElementById('diffDays').innerHTML = data.city + ' is ' + data.diffDays + ' days away';
    document.getElementById('startdate').innerHTML = 'Departure Date: ' + data.depDate;
    document.getElementById('temp').innerHTML = 'Typical Weather for then is: ' + data.temp;
    document.getElementById('pic').src = data.img;
    document.getElementById('daysTrip').innerHTML = 'Total no. of days: ' + data.daysTrip + ' days';
}


document.addEventListener("DOMContentLoaded", (event) => {
    // Calendar daterestriction
    var today = new Date();
    today.setDate(today.getDate()+1);
    var minDate = getMinMax(today);
    var result = new Date(minDate);
    result.setDate(result.getDate() + 16);
    var maxDate = getMinMax(result);

    document.getElementById('depDate').setAttribute("min", minDate);
    document.getElementById('depDate').setAttribute("max", maxDate);
    document.getElementById('retDate').setAttribute("min", minDate);
    document.getElementById('retDate').setAttribute("max", maxDate);

    document.getElementById('generate').addEventListener('click', getGeoCode);
});

export { getGeoCode }