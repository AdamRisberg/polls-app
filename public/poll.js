var id = window.location.href.slice(-24);

fetch("/poll/data/" + id)
  .then(function(res) {
    return res.json();
  })
  .then(function (poll) {
    setupChart(poll);
  });

function setupChart(poll) {
  if(!poll) return;
  var data = {
    labels: [],
    datasets: [{
      label: "# of Votes",
      data: [],
      backgroundColor: [
        "rgb(0,255,0)",
        "rgb(0,255,255)",
        "rgb(255,0,255)",
        "rgb(255,255,0)"
      ]
    }]
  };

  poll.options.forEach(function(option) {
    data.labels.push(option.text);
    data.datasets[0].data.push(option.count);
  });

  var pieChart = new Chart("poll-chart", {
    type: "doughnut",
    data: data,
    options: {
      responsive: false,
      cutoutPercentage: 35
    }
  });
}