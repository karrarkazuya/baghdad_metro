class Metro {
    constructor() {

        this.imageDpi = 200;
        this.metro_data = [];

        this.activeColor = '#ffff00';

        this.selectedStation = -1;

        this.whereTrainAt = [];
        this.trainDestination = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.intervals = [];

        this.can = document.getElementById('canvas');
        this.ctx = this.can.getContext('2d');


        // reading the data into the merto data
        fetch('data/data.json')
        .then(response => response.json())
        .then((data) => {
            this.metro_data = data;
            this.setData();
            this.setElements();
            this.render();
        })
        .catch(error => console.error(error));

        //this.text();
    }

    setData(){
        this.whereTrainAt = [];
        for (let index = 0; index < this.metro_data.length; index++) {
            const element = this.metro_data[index];
            this.whereTrainAt.push(
                Math.floor(Math.random() * element.path.length)
            );
        }
    }

    setElements(){
        // Elements that can must be filled
        const lineSelect = document.getElementById('line_select');
        const myTable = document.getElementById('myTable');

        // Loop through the array 
        for (let index = 0; index < this.metro_data.length; index++) {
            // adding the select lines
            const line = this.metro_data[index];
            var option = document.createElement('option');
            option.textContent = line.name;
            option.value = index;
            lineSelect.appendChild(option);
            // adding the rows for states

            // Create a new row element
            const newRow = document.createElement('tr');
            newRow.id = "line_" + index;

            // Create new cell elements for the row
            const cell1 = document.createElement('td');
            const cell2 = document.createElement('td');
            const cell3 = document.createElement('td');
            const cell4 = document.createElement('td');

            // Set the text content of the cells
            cell1.textContent = '...';
            cell1.id = "train_" + index;
            cell1.className = "px-4 py-3";

            cell2.textContent = '...';
            cell2.id = "line_name_" + index;
            cell2.className = "px-4 py-3 text-lg text-gray-900";

            cell3.textContent = '...';
            cell3.id = "station_name_" + index;
            cell3.className = "px-4 py-3 text-lg text-gray-900";

            cell4.textContent = '...';
            cell4.id = "time_left_" + index;
            cell4.className = "px-4 py-3";

            // Append the cells to the row
            newRow.appendChild(cell1);
            newRow.appendChild(cell2);
            newRow.appendChild(cell3);
            newRow.appendChild(cell4);

            // Append the row to the table body
            const tableBody = document.getElementById('lines_tbody');
            tableBody.appendChild(newRow);
        }
    }

    setStationsData(line){
        
        const lineSelect = document.getElementById('station_select');

        lineSelect.innerHTML = "";
        
        var option = document.createElement('option');
        option.textContent = "All";
        option.value = -1;
        lineSelect.appendChild(option);


        if (line > -1) {
            for (let index = 0; index < this.metro_data[line].stations.length; index++) {
                const element = this.metro_data[line].stations[index];
    
                var option = document.createElement('option');
                option.textContent = element.name;
                option.value = index;
                option.selected = index == this.selectedStation;
                lineSelect.appendChild(option);
            }
        }
    }

    setStation(){
        const lineSelect = document.getElementById('station_select');
        this.selectedStation = lineSelect.value;
        this.render();
    }

    text(){
        // Get canvas element
        const canvas = document.getElementById('canvas');

        // Set canvas dimensions
        canvas.width = 500;
        canvas.height = 500;

        // Get canvas context
        const context = canvas.getContext('2d');

        // Set line properties
        context.strokeStyle = '#000'; // Set stroke color
        context.lineWidth = 5; // Set stroke width

        // Draw a line
        context.beginPath();
        context.moveTo(100, 100); // Move to starting point (x,y)
        context.lineTo(400, 400); // Draw line to ending point (x,y)
        context.stroke(); // Draw the line

    }

    render() {
        var line = document.getElementById("line_select").value;

        if (line > -1) {
            document.getElementById('line_viewed').textContent = this.metro_data[line].name;
            this.setStationsData(line);
        } else {
            document.getElementById('line_viewed').textContent = "All";
            this.selectedStation = -1;
            this.setStationsData(line);
        }
        let p = this;
        for (let index = 0; index < this.intervals.length; index++) {
            const element = this.intervals[index];
            clearInterval(element);
            document.getElementById("line_"+index).style.display = "none";
        }
        this.intervals = [];
        this.ctx.clearRect(0, 0, this.can.width, this.can.height);

        for (let index = line < 0 ? 0 : line; index < this.metro_data.length; index++) {
            const element = this.metro_data[index].path;
            
            this.renderLine(element, index);
            this.renderStations(element, index);

            let t = setInterval(function () {
                p.moveTrain(index);
            }, this.metro_data[index].speed);
            this.intervals.push(t);
            if(line >= 0)
                break;
        }
    }

    renderLine(data, index) {
        this.ctx.beginPath();

        this.ctx.moveTo(data[0][0], data[0][1]);
        for (let station = 0; station < data.length; station++) {
            let line = data[station];

            this.ctx.lineTo(line[0], line[1]);
            this.ctx.fillRect(line[0], line[1], 1, 1);
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

        }

        this.ctx.strokeStyle = this.metro_data[index].color;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }


    renderStations(data, index) {
        for (let station = 0; station < data.length; station++) {
            let line = data[station];

            if(this.selectedStation == station){
                this.drawStar(line[0], line[1], 5, 15, 10);
            }else{
                this.ctx.beginPath();
                this.ctx.arc(line[0], line[1], 3, 0, 2 * Math.PI);
                this.ctx.lineWidth = 5;
                this.ctx.strokeStyle = this.metro_data[index].color;
            }
            
            this.ctx.stroke();
        }
    }

    drawStar(cx,cy,spikes,outerRadius,innerRadius){
        var rot=Math.PI/2*3;
        var x=cx;
        var y=cy;
        var step=Math.PI/spikes;
  
        this.ctx.beginPath();
        this.ctx.moveTo(cx,cy-outerRadius)
        for(var i=0;i<spikes;i++){
          x=cx+Math.cos(rot)*outerRadius;
          y=cy+Math.sin(rot)*outerRadius;
          this.ctx.lineTo(x,y)
          rot+=step
  
          x=cx+Math.cos(rot)*innerRadius;
          y=cy+Math.sin(rot)*innerRadius;
          this.ctx.lineTo(x,y)
          rot+=step
        }
        this.ctx.lineTo(cx,cy-outerRadius);
        this.ctx.closePath();
        this.ctx.lineWidth=5;
        this.ctx.strokeStyle='green';
        this.ctx.stroke();
        this.ctx.fillStyle='skyblue';
        this.ctx.fill();
      }
  

    stationColorChange(x, y, color) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, 3, 0, 2 * Math.PI);
        this.ctx.lineWidth = 5;
        this.ctx.strokeStyle = color;
        this.ctx.stroke();
    }


    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }


   moveTrain(index){
       let data = this.metro_data[index].path;
       let whereTrainAt = this.whereTrainAt[index];
       if(this.trainDestination == 0){
            whereTrainAt = whereTrainAt + 1;
            if(whereTrainAt >= data.length){
                this.trainDestination = 1;
                whereTrainAt = data.length - 1;
            }
            this.whereTrainAt[index] = whereTrainAt;
            
       }else{
            whereTrainAt = whereTrainAt - 1;
            if(whereTrainAt <= 0){
                this.trainDestination = 0;
                whereTrainAt = 0;
            }
            this.whereTrainAt[index] = whereTrainAt;
       }
       
       for (let i = 0; i < data.length; i++) {
           const element = data[i];
           this.stationColorChange(element[0], element[1], this.metro_data[index].color);
       }
       
       this.stationColorChange(data[whereTrainAt][0], data[whereTrainAt][1], this.activeColor);
       document.getElementById('train_'+index).textContent = whereTrainAt;
       document.getElementById('line_name_'+index).textContent = this.metro_data[index].name;
       document.getElementById('station_name_'+index).textContent = this.metro_data[index].stations[whereTrainAt].name;
       document.getElementById('time_left_'+index).textContent = (this.metro_data[index].speed / 1000) + " Min";
       document.getElementById("line_"+index).style.display = "table-row";

       
   }

}