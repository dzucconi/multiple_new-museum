;(function(exports) {
  var randomColor = function() {
    return "#" + (Math.random() * 0xFFFFFF << 0).toString(16);
  };

  var queryString = function(options) {
    var _queryString = $.map(options, function(value, key) {
      return key + "=" + value;
    }).join("&");

    return "http://xxith.com/?" + _queryString
  }

  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  var initialize = function() {
    $.getJSON("/archiver/lib/data/data.json", function(data) {
      var links = $.map(data, function(record) {
        var date = record.mid.split("-");

        var options = {
          year: date[0],
          month: months[date[1] - 1],
          day: date[2],
          color: randomColor(),
          bgcolor: randomColor()
        };

        var href = queryString(options);

        return "<a href='" + href + "' target='_blank'>" + record.title + "</a>";
      });

      $("body").html(links.join("<br>"));
    });
  }

  $(function() { initialize(); });
}(this));