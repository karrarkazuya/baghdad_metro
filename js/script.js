class MetroMap {

    constructor() {
        this.data = new window.Data();
        this.viewMap();
    }

    viewMap(){
        // Initialize the map and set its view to Baghdad
        var map = L.map('map').setView([33.3152, 44.3661], 13);

        // Add a lighter dark-themed tile layer
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: 'Baghdad Metro &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        }).addTo(map);

        // Locate the user's current location
        map.locate({ setView: true, maxZoom: 16 });

        // Function to handle location found event
        function onLocationFound(e) {
            var userLatLng = e.latlng;

            // Add a marker at the user's current location
            var marker = L.marker(userLatLng).addTo(map);

            // Attach a click event to the marker
            marker.on('click', function() {
                marker.bindPopup("انت هنا").openPopup();
            });

            // Optionally, open the popup automatically when the map is first loaded
            marker.bindPopup("انت هنا حالياً").openPopup();
        }

        // Function to handle location error event
        function onLocationError(e) {
            alert("نحتاج موقعك حتى نعرضك على الخريطة");
        }


        // Add event listeners for location found and location error
        map.on('locationfound', onLocationFound);
        map.on('locationerror', onLocationError);



        // Latitude and Longitude to be converted to map coordinates
        const lat = 33.284078;  // Replace with your latitude
        const lon = 44.396432; // Replace with your longitude

        // Convert the lat/lon to map coordinates
        const mapCoords = [lat, lon];

        /*
        // Create a draggable marker
        const marker = L.marker(mapCoords, { draggable: true }).addTo(map);

        // Add an event listener for the dragend event
        marker.on('dragend', function (event) {
            const marker = event.target;
            const position = marker.getLatLng();
            // Create a new <p> element
            const pElement = document.createElement('p');

            // Set the content of the <p> element
            pElement.textContent = `{"latitude": ${position.lat}, "longitude": ${position.lng}},`;

            // Find the <div> element with id "log"
            const logDiv = document.getElementById('log');

            // Append the <p> element to the <div>
            logDiv.appendChild(pElement);
        });
        */

        let paths = this.data.paths();
      
        for (let index = 0; index < paths.length; index++) {
            var route = paths[index]['route'];
            var color = paths[index]['color'];
            var name = paths[index]['name'];

            // Convert the path coordinates to an array of LatLng objects
            route = route.map(function(point) {
                return [point.latitude, point.longitude];
            });


            let path = L.polyline.antPath(route, {
                "delay": 2000,
                "dashArray": [
                20,
                100
                ],
                "weight": 8,
                "color": "#000000",
                "pulseColor": color,
                "paused": false,
                "reverse": false,
                "hardwareAccelerated": true
            });

            path.addTo(map);
            this.addClickablePath(path, name);
            
            // map.fitBounds(path.getBounds())
        }

    }

    addClickablePath(path, name){
        path.on('click', function() {
            path.bindPopup(name).openPopup();
        });
    }
}

// just to kick things on
new MetroMap();
