var url = window.location.href;
var id = url.slice(-24);
var title = document.querySelector("#title").textContent;
var pieChart;

axios.get("/poll/data/" + id)
  .then(function(res) {
    setupChart(res.data);
  });

document.querySelector("#submit-btn").addEventListener("click", function() {
  var selected = document.querySelector("input[name='vote']:checked").nextElementSibling;
  if(!selected) return;
  var vote = "";
  if(selected.value) vote = selected.value;
  else vote = selected.textContent;

  axios.post("/poll/vote/" + id, { vote: vote })
    .then(function(res) {
      updateChart(res.data);
    })
    .catch(function(err) {
      console.log(err);
    });
});

document.querySelector("#share-btn").addEventListener("click", function() {
  var w = 600;
  var h = 280;
  var y = window.outerHeight / 2 + window.screenY - (h / 2)
  var x = window.outerWidth / 2 + window.screenX - (w / 2)
  var twitterUrl = "https://twitter.com/intent/tweet?text=" + title + "&url=" + url + "&hashtags=ExpressPolls";
  var windowFeatures = "menubar=no,width=" + w + ",height=" + h + ",top=" + y + ",left=" + x;
  window.open(twitterUrl, "", windowFeatures);
});

function setupChart(poll) {
  if(!poll) return;

  var data = {
    labels: [],
    datasets: [{
      label: "# of Votes",
      data: [],
      backgroundColor: [
        "#808dc4",
        "#73b749",
        "#954cd0",
        "#c4964c",
        "#5a3f87",
        "#d2513c",
        "#5bac96",
        "#cf5898",
        "#4f6630",
        "#884546"
      ],
      borderColor: "#333",
      borderWidth: 1
    }]
  };

  poll.options.forEach(function(option) {
    data.labels.push(option.text);
    data.datasets[0].data.push(option.count);
  });

  pieChart = new Chart("poll-chart", {
    type: "doughnut",
    data: data,
    options: {
      cutoutPercentage: 35,
      legend: {
        position: "bottom",
        labels: {
          fontFamily: "Roboto",
          fontSize: 18,
          fontColor: "#333",
          boxWidth: 30
        }
      }
    }
  });
}

function updateChart(poll) {
  pieChart.config.data.datasets[0].data = [];
  pieChart.config.data.labels = [];

  poll.options.forEach(function (option) {
    pieChart.config.data.labels.push(option.text);
    pieChart.config.data.datasets[0].data.push(option.count);
  });

  console.log(pieChart.config.data);
  pieChart.update();
}