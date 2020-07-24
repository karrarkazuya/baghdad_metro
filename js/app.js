class Metro {
    constructor() {
        this.imageDpi = 200;
        this.map = [[[788,715],[788,676],[773,659],[758,641],[742,622],[727,607],[712,588],[696,562],[696,537],[695,492],[655,447],[638,448],[609,447],[554,464],[528,492],[498,502],[455,504],[427,504],[390,507],[355,507],[324,505],[299,437],[299,405],[300,370],[335,321],[361,290],[384,264],[415,229]],[[749,166],[733,185],[718,202],[703,218],[688,236],[671,256],[656,274],[640,290],[623,308],[604,333],[577,360],[555,384],[525,420],[495,439],[470,440],[443,440],[391,440],[354,438],[329,438],[301,439],[261,437],[230,437],[208,429],[200,394],[199,359],[200,324],[198,289],[199,254]],[[593,535],[639,484],[654,448],[656,413],[632,368],[602,334],[572,299],[524,282],[479,298],[447,333],[423,359],[400,386],[393,412],[393,438],[408,484],[427,501],[483,568],[523,582],[569,562],[593,536]],[[928,539],[896,539],[867,540],[834,540],[804,539],[771,539],[735,538],[694,537],[665,510],[640,483],[626,466],[609,449],[588,421],[556,385],[540,368],[526,352],[509,334],[478,299],[461,283],[446,264],[431,246],[415,227],[392,201],[378,185],[351,178]],[[689,165],[670,184],[656,201],[639,219],[625,237],[610,251],[595,272],[570,296],[548,327],[524,350],[510,367],[496,424],[496,503],[496,544],[482,565],[448,580],[408,579],[368,580],[340,579],[304,581],[277,579],[245,578],[214,579],[166,561],[135,562]],[[850,412],[835,430],[818,448],[804,465],[788,483],[773,500],[757,518],[734,539],[698,537],[665,535],[633,535],[594,535],[554,519],[530,488],[495,439],[479,370],[463,349],[447,334],[403,282],[384,264]],[[626,112],[610,132],[593,149],[578,166],[561,185],[547,201],[532,220],[524,245],[525,279],[525,350],[523,420],[553,461],[579,492],[595,535],[572,623],[532,640],[501,640],[449,607],[447,579]],[[797,183],[770,211],[750,238],[726,264],[703,289],[678,319],[656,343],[636,371],[618,385],[601,405],[586,421],[551,463],[529,487],[505,516],[498,545],[498,617],[501,640],[500,668],[498,702],[499,729],[498,753],[502,752]],[[522,175],[521,210],[524,245],[524,280],[508,334],[476,369],[455,395],[444,439],[427,506],[391,502],[371,544],[369,580],[362,614],[345,633],[329,650],[315,668],[300,684],[283,703],[265,724]], [[703,412],[657,412],[619,386],[554,384],[521,419],[494,425],[455,397],[425,361],[371,319],[333,323],[308,319],[279,320],[251,322],[222,332],[199,359],[175,386],[153,413],[129,439]]];
        this.colors = ['#f35d10', '#e10765', '#ffc038', '#0091cf', '#19864d', '#7eca36', '#1d409c', '#943904', '#5c085e', '#f191ac'];
        this.activeColor = '#ffff00';
        this.whereTrainAt = [Math.floor(Math.random() * this.map[0].length), Math.floor(Math.random() * this.map[1].length), Math.floor(Math.random() * this.map[2].length), Math.floor(Math.random() * this.map[3].length), Math.floor(Math.random() * this.map[4].length), Math.floor(Math.random() * this.map[5].length), Math.floor(Math.random() * this.map[6].length), Math.floor(Math.random() * this.map[7].length), Math.floor(Math.random() * this.map[8].length), Math.floor(Math.random() * this.map[9].length)];
        this.trainDestination = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.trainSpeeds = [5000, 8000, 7000, 9000, 4000, 6800, 6600, 3300, 4600, 2100];
        this.intervals = [];

        this.can = document.getElementById('canvas');
        this.ctx = this.can.getContext('2d');

        this.render(-1);
    }

    render(line) {
        let p = this;
        for (let index = 0; index < this.intervals.length; index++) {
            const element = this.intervals[index];
            clearInterval(element);
            document.getElementById("line_"+index).style.display = "none";
        }
        this.intervals = [];
        this.ctx.clearRect(0, 0, this.can.width, this.can.height);
        for (let index = line < 0 ? 0 : line; index < this.map.length; index++) {
            const element = this.map[index];
            this.renderLine(element, index);
            this.renderStations(element, index);
            let t = setInterval(function () {
                p.moveTrain(index);
            }, this.trainSpeeds[index]);
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

        this.ctx.strokeStyle = this.colors[index];
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }


    renderStations(data, index) {
        for (let station = 0; station < data.length; station++) {
            let line = data[station];
            this.ctx.beginPath();
            this.ctx.arc(line[0], line[1], 3, 0, 2 * Math.PI);
            this.ctx.lineWidth = 5;
            this.ctx.strokeStyle = this.colors[index];
            this.ctx.stroke();
        }
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
       let data = this.map[index];
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
           this.stationColorChange(element[0], element[1], this.colors[index]);
       }
       
       this.stationColorChange(data[whereTrainAt][0], data[whereTrainAt][1], this.activeColor);
       document.getElementById('train_'+index).textContent = whereTrainAt;
       document.getElementById('time_left_'+index).textContent = (this.trainSpeeds[index] / 1000) + " Min";
       document.getElementById("line_"+index).style.display = "block";

       
   }

}