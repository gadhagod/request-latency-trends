const xhr = new XMLHttpRequest();

class FullChart {
    constructor() {
        this.x = 0;
        const ctx = document.getElementById("complete-chart").getContext("2d");
        this.startDate = new Date();
        this.startDate.setSeconds(this.startDate.getSeconds() + 2)
        this.chart = new Chart(ctx, {
            type: "line",
            showLine: true,
            data: {
                datasets: [{
                    borderColor: "rgba(0, 0, 0, 0.5)",
                    pointBackgroundColor: "rgba(0, 0, 0, 0.5)",
                    data: [],
                }]
            },
            options: {
                elements: {
                    point:{
                        radius: 0
                    }
                },
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    yAxes: {
                        ticks: {
                            beginAtZero: true
                        },
                        type: "linear",
                        grid: {
                            borderColor: "rgba(0, 0, 0, 1)",
                        },
                        ticks: {
                            color: "black"
                        },
                        max: 500,
                        min: 0
                    },
                    xAxes: {
                        type: "time",
                        grid: {
                            borderColor: "rgba(0, 0, 0, 1)",
                        },
                        ticks: {
                            color: "black",
                            maxTicksLimit: 20
                        },
                        time: {
                            unit: "second"
                        },
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    annotation: {
                        annotations: {
                            
                        }
                    }
                }
            }
        });
        console.log(this.chart.options.plugins)
        this.start()
    }

    start() {
        var thisClass = this
        setInterval(async () => {
            let before = new Date();
            xhr.onreadystatechange = function () {
                let point;
                if(this.readyState === 4) {
                    if (this.status === 200) {
                        let now = new Date();
                        let ping = now - before;
                        point = {x: before, y: ping};
                        thisClass.chart.data.datasets[0].data.push(point);
                        thisClass.chart.update();
                    } else {
                        thisClass.chart.data.datasets[0].data.push({x: before, y: 500});
                        let currentDate = new Date();
                        let lastDate = new Date();
                        lastDate.setSeconds(currentDate.getSeconds() - 2);
                        chart.chart.options.plugins.annotation.annotations[`box${lastDate.getTime()}`] = {
                            type: 'box',
                            xMin: lastDate,
                            xMax: new Date(),
                            yMin: 500,
                            yMax: 0,
                            xScaleID: "xAxes",
                            yScaleID: "yAxes",
                            backgroundColor: 'rgba(255, 99, 132, 0.25)'
                        }
                        thisClass.chart.update();
                    }
                }
            }
            xhr.open("GET", "https://rien-app.herokuapp.com");
            xhr.timeout = 500;
            xhr.ontimeout = () => {
                let currentDate = new Date();
                let lastDate = new Date();
                lastDate.setSeconds(currentDate.getSeconds() - 2);
                chart.chart.options.plugins.annotation.annotations[`box${lastDate.getTime()}`] = {
                    type: 'box',
                    xMin: lastDate, 
                    xMax: new Date(),
                    yMin: 500,
                    yMax: 0,
                    xScaleID: "xAxes",
                    yScaleID: "yAxes",
                    backgroundColor: 'rgba(255, 99, 132, 0.25)'
                }
                thisClass.chart.data.datasets[0].data.push({x: new Date(), y: 501});
                thisClass.chart.update();
            }
            try {
                xhr.send();
            } catch {
                point = {x: new before, y: 501};
                thisClass.chart.data.datasets[0].data.push(point);
                thisClass.chart.update();
            }
            if (this.chart.data.datasets[0].data.length >= 20) {
                this.chart.data.datasets[0].data.shift();
                chart.chart.options.scales.xAxes.min= chart.chart.data.datasets[0].data[0];
            }
        }, 2000);
    }
}

let chart = new FullChart(); 