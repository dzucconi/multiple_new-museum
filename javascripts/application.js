(function($) {
  "use strict";

  // Fisher-Yates shuffle
  $.shuffle = function(arr) {
    var length, j, t;

    length = arr.length;

    while (--length > 0) {
      j           = ~~(Math.random() * (length + 1));
      t           = arr[j];
      arr[j]      = arr[length];
      arr[length] = t;
    };

    return arr;
  };

  $.toQueryString = function(options) {
    return $.map(options, function(value, key) {
      return key + "=" + value;
    }).join("&");
  };

  $.randomColor = function() {
    return "%23" + ("000000" + (Math.random() * 0xFFFFFF << 0).toString(16)).slice(-6);
  };
}(jQuery));

(function(exports) {
  "use strict";

  var months, initialize;

  months = [
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

  initialize = function() {
    $.getJSON("archiver/lib/data/data.json", function(data) {
      var links = $.map($.shuffle(data), function(record) {
        var options;

        options = {
          year:     record.ending[0],
          month:    months[record.ending[1] - 1],
          day:      record.ending[2],
          color:    $.randomColor(),
          bgcolor:  $.randomColor()
        };

        if (record.time != null) {
          $.extend(options, {
            hour:   record.time.ending[0],
            minute: record.time.ending[1]
          });
        }

        return "<a href='http://xxith.com/?" + $.toQueryString(options) + "' target='_blank'>" +
          record.title +
        "</a>";
      });

      $("body").html(links.join(", "));
    });
  }

  $(function() { initialize(); });
}(this));
