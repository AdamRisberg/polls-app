var url = window.location.href;
var id = url.slice(-24);
var title = document.querySelector("#title").textContent;
var pieChart;

Chart.plugins.register({
  afterDraw: function(chart) {
    var empty = chart.data.datasets[0].data.every(function(val) {
      return !val;
    });
    if(empty) {
      var ctx = chart.chart.ctx;
      var width = chart.chart.width;
      var height = chart.chart.height
      chart.clear();

      ctx.save();
      ctx.textAlign = "center";
      ctx.fillStyle = "#171316";
      ctx.fillText("No votes to display", width / 2, height / 2);
      ctx.restore();
    }
  }
});

axios.get("/poll/data/" + id)
  .then(function(res) {
    setupChart(res.data);
  })
  .catch(function(err) {
    console.log(err);
  });

document.querySelector("#submit-btn").addEventListener("click", function() {
  var selected = document.querySelector("input[name='vote']:checked");
  if(!selected) return;
  selected = selected.nextElementSibling;
  var vote = "";
  if(selected.value) vote = selected.value;
  else vote = selected.textContent;

  axios.post("/poll/vote/" + id, { vote: vote })
    .then(function(res) {
      disableSubmit();
      updateChart(res.data);
    })
    .catch(function(err) {
      console.log(err.message);
    });
});

document.querySelector("#share-btn").addEventListener("click", function() {
  var w = 600;
  var h = 260;
  var y = window.outerHeight / 2 + window.screenY - (h / 2)
  var x = window.outerWidth / 2 + window.screenX - (w / 2)
  var twitterUrl = "https://twitter.com/intent/tweet?text=" + title + "&url=" + url + "&hashtags=ExpressPolls";
  var windowFeatures = "menubar=no,width=" + w + ",height=" + h + ",top=" + y + ",left=" + x;
  window.open(twitterUrl, "", windowFeatures);
});

var deleteBtn = document.querySelector("#delete-btn");
if(deleteBtn) {
  deleteBtn.addEventListener("click", function() {
    axios.delete("/poll/" + id)
      .then(function(res) {
        window.location.href = res.data;
      })
      .catch(function(err) {
        console.log(err.message);
      });
  });
}

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

  pieChart.update();
}

function disableSubmit() {
  var btn = document.querySelector("#submit-btn");
  btn.textContent = "Already Voted";
  btn.setAttribute("disabled", "");
  btn.classList.remove("sub-btn");
  btn.classList.remove("btn-hover");
  btn.classList.add("sub-disabled");
}