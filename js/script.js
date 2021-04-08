jQuery(document).ready(function ($) {
  // Load Data and options
  var graph_data = {
    red: {
      color: "rgba(196, 26, 30, 0.9)",
      data: [],
      marker: {
        symbol: "circle",
      },
    },
    yellow: {
      color: "rgba(255, 179, 53, 0.9)",
      data: [],
      marker: {
        symbol: "circle",
      },
    },
    purple: {
      color: "rgba(145, 103, 226, 0.9)",
      data: [],
      marker: {
        symbol: "circle",
      },
    },
    green: {
      color: "rgba(112, 181, 55, 0.9)",
      data: [],
      marker: {
        symbol: "circle",
      },
    },
    gray: {
      color: "rgba(199, 199, 199, 0.9)",
      data: [],
      marker: {
        symbol: "circle",
      },
    },
  };

  var json,
    json_final,
    max_dash_json,
    max_score = 0;

  if ($("#the-graph").length > 0) {
    $.getJSON("./data/graph-data.json", function (data) {
      var countries = [];
      var members = [];

      json = data["provisional-data"];
      json_final = data["final-data"];
      max_dash_json = data["max-data"];

      $(data["provisional-data"]).each(function (index, element) {
        // store unique country in an array
        if ($.inArray(element.user.country, countries) === -1) {
          countries.push(element.user.country);
        }

        // store members to array
        members.push(element.user.handle);

        // assign graph data
        $.each(element.data, function (i, v) {
          if (max_score < v.score) {
            max_score = v.score;
          }
          var tmp_date = new Date(v.date);
          var new_date = Date.UTC(
            tmp_date.getFullYear(),
            tmp_date.getMonth(),
            tmp_date.getDate(),
            tmp_date.getHours(),
            tmp_date.getMinutes(),
            tmp_date.getSeconds()
          );
          var arr = {
            x: new_date,
            y: v.score,
            handle: element.user.handle,
            submissions: element.data.length,
            img: element.user.avatar,
            country: element.user.country,
            rating: element.user.rating,
          };

          if (element.user.rating >= 2200) {
            // red
            graph_data.red.data.push(arr);
          } else if (element.user.rating >= 1500) {
            // yellow
            graph_data.yellow.data.push(arr);
          } else if (element.user.rating >= 1200) {
            // purple
            graph_data.purple.data.push(arr);
          } else if (element.user.rating >= 900) {
            // green
            graph_data.green.data.push(arr);
          } else {
            // gray
            graph_data.gray.data.push(arr);
          }
        });
      });

      // render country options
      countries.sort();
      var items = [];
      $(countries).each(function (index, element) {
        items.push(
          '<li><a href="javascript:;" class="selected" data-value="' +
            element +
            '">' +
            element +
            "</a></li>"
        );
      });
      $("#option-country").append(items.join(""));

      // render member options
      members.sort();
      var items = [];
      $(members).each(function (index, element) {
        items.push(
          '<li><a href="javascript:;" class="selected" data-value="' +
            element +
            '">' +
            element +
            "</a></li>"
        );
      });
      $("#option-member").append(items.join(""));

      // call load graph callback
      var tmp_data = [];
      $.each(graph_data, function (i, v) {
        if (v.data.length > 0) {
          tmp_data.push(v);
        }
      });

      var max_dash = {
        data: [],
        lineWidth: 1,
        dashStyle: "Dash",
        lineColor: "#666666",
        type: "scatter",
        marker: {
          enabled: false,
        },
        showInLegend: false,
        enableMouseTracking: false,
      };

      $(data["max-data"]).each(function (i, v) {
        var tmp_date = new Date(v.date);
        var new_date = Date.UTC(
          tmp_date.getFullYear(),
          tmp_date.getMonth(),
          tmp_date.getDate(),
          tmp_date.getHours(),
          tmp_date.getMinutes(),
          tmp_date.getSeconds()
        );
        var arr = {
          x: new_date,
          y: v.score,
        };

        max_dash.data.push(arr);
      });

      tmp_data.push(max_dash);

      load_graph(
        tmp_data,
        data["baseline-metric"],
        data["success-metric"],
        data["baseline_metric2"],
        data["marathon_tester_1"],
        data["marathon_tester_2"],
        data["marathon_tester_3"],
        data["max-metric"],
        max_score
      );
    });
  }

  // Select / Unselect Filter
  $(".filters").on("click", ".dropdown-menu a", function () {
    var $this = $(this);
    var selected = true;

    if ($this.hasClass("selected")) {
      $this.removeClass("selected");
      selected = false;
    } else {
      $this.addClass("selected");
      selected = true;
    }

    // check all
    // show/hide provisional/final scores
    if ($this.data("value") === "provisional") {
      $this.addClass("selected");
      $('#option-score a[data-value="final"]').removeClass("selected");
      $("#score-text").text("Provisional Score");
    } else if ($this.data("value") === "final") {
      $this.addClass("selected");
      $('#option-score a[data-value="provisional"]').removeClass("selected");
      $("#score-text").text("Final Score");
    } else {
      if ($this.data("value") === "All") {
        if (selected) {
          $this.parents("ul").find("a").addClass("selected");
        }
      } else {
        if (!selected) {
          $this
            .parents("ul")
            .find('a[data-value="All"]')
            .removeClass("selected");
        }
      }
    }

    redrawChart($("#option-score a.selected").data("value"));
  });

  // Radio input UI
  $(".ui-replace input").change(function () {
    var $this = $(this);
    var label = $(this).parents("label");

    $(".ui-replace").removeClass("selected");
    if ($(this).prop("checked")) {
      label.addClass("selected");
    } else {
      label.removeClass("selected");
    }

    if ($this.prop("name") == "contest_time") {
      redrawChart($("#option-score a.selected").data("value"));
    }
  });

  // Date Picker
  $(".daterange")
    .daterangepicker({
      opens: "center",
      autoApply: true,
      startDate: moment().subtract(1, "day"),
      endData: moment(),
    })
    .on("apply.daterangepicker", function (ev, picker) {
      $(".date-value").html(
        picker.startDate.format("MM/DD") +
          " to " +
          picker.endDate.format("MM/DD")
      );
      $(".date-value").data("startdate", picker.startDate);
      $(".date-value").data("enddate", picker.endDate);
      redrawChart($("#option-score a.selected").data("value"));
    });

  $(".date-value").html(
    moment($(".daterange").data("startDate")).format("MM/DD") +
      " to " +
      moment($(".daterange").data("endDate")).format("MM/DD")
  );

  // Toggle dropdown manually
  $(".dropdown-toggle").click(function () {
    var $this = $(this);
    $(".btn-group.open").removeClass("open");
    $this.parent().toggleClass("open");
  });

  // hide dropdown on click outside
  $("body").on("click", function (e) {
    if (
      !$(".btn-group").is(e.target) &&
      $(".btn-group").has(e.target).length === 0 &&
      $(".open").has(e.target).length === 0
    ) {
      $(".btn-group").removeClass("open");
    }
  });

  // Load the graph callback
  var chart;
  function load_graph(
    data,
    baseline_metric,
    success_metric,
    baseline_metric2,
    marathon_tester_1,
    marathon_tester_2,
    marathon_tester_3,
    max_metric,
    highScore
  ) {
    highScore = highScore + 5;
    if (highScore <= success_metric || highScore <= baseline_metric) {
      highScore =
        success_metric != "" ? success_metric + 5 : baseline_metric + 5;
    }
    chart = new Highcharts.Chart(
      {
        chart: {
          type: "scatter",
          plotBackgroundColor: "#f8f8f8",
          plotBorderColor: "#ffffff",
          plotBorderWidth: 1,
          renderTo: "the-graph",
        },
        credits: {
          enabled: false,
        },
        legend: {
          enabled: false,
        },
        title: {
          text: "",
        },
        xAxis: {
          type: "datetime",
          dateTimeLabelFormats: {
            day: "%m/%d",
          },
          title: {
            enabled: false,
          },
          lineWidth: 1,
          lineColor: "#d5d5d5",
          gridLineWidth: 10,
          gridLineColor: "#fff",
          minTickInterval: 3600 * 1000 * 24,
          labels: {
            useHTML: true,
            align: "center",
            formatter: function () {
              return (
                '<span class="timeline_label">' +
                Highcharts.dateFormat(this.dateTimeLabelFormat, this.value) +
                "</span>"
              );
            },
          },
          startOnTick: true,
        },
        yAxis: {
          title: {
            enabled: false,
          },
          lineWidth: 1,
          lineColor: "#d5d5d5",
          gridLineWidth: 0,
          min: 0,
          max: highScore,
          plotLines: [
            {
              color: "rgba(123, 188, 80, 0.5)",
              width: 3,
              value: success_metric,
              label: {
                text: '<span style="color:#7bbc50;"></span>',
                verticalAlign: "bottom",
              },
              zIndex: 2,
            },
            {
              color: "rgba(78, 78, 78, 0.5)",
              width: 3,
              value: baseline_metric,
              label: {
                text: '<span style="color:#4e4e4e;">Baseline</span>',
                verticalAlign: "bottom",
              },
              zIndex: 2,
            },
            {
              color: "rgba(78, 78, 78, 0.5)",
              width: 3,
              value: marathon_tester_1,
              label: {
                text: '<span style="color:#4e4e4e;"></span>',
              },
              zIndex: 2,
            },
            {
              color: "rgba(78, 78, 78, 0.5)",
              width: 3,
              value: marathon_tester_2,
              label: {
                text: '<span style="color:#4e4e4e;"></span>',
              },
              zIndex: 2,
            },
            {
              color: "rgba(78, 78, 78, 0.5)",
              width: 3,
              value: marathon_tester_3,
              label: {
                text: '<span style="color:#4e4e4e;"></span>',
              },
              zIndex: 2,
            },
            {
              color: "rgba(210, 0, 0, 0.5)",
              width: 3,
              value: max_metric,
              label: {
                text: '<span style="color:#DD0000;"></span>',
              },
              zIndex: 2,
            },
          ],
        },
        tooltip: {
          backgroundColor: "rgba(48, 53, 58, 0.9)",
          borderWidth: 0,
          borderRadius: 6,
          dateTimeLabelFormats: {
            day: "Submitted: %m/d/%Y",
          },
          style: {
            color: "#fff",
          },
          useHTML: true,
          formatter: function () {
            var d = new Date(this.point.x);
            var month = d.getUTCMonth() + 1;
            var html =
              '<div class="tooltip-header"><img src="' +
              this.point.img +
              '" class="tooltip-img" /><h5 class="tooltip-handle">' +
              this.point.handle +
              "</h5></div>";
            html +=
              '<div class="tooltip-body">' +
              this.point.submissions +
              " Submissions<br />";
            html += "Score: " + this.point.y + "<br/>";
            html +=
              "Submitted: " +
              month +
              "/" +
              d.getUTCDate() +
              "/" +
              d.getUTCFullYear() +
              "</div>";
            return html;
          },
        },
        series: data,
      },

      function (chart) {
        var $container = $(chart.container);
        var $labels = $container.find(
          ".highcharts-axis-labels .timeline_label"
        );
        var $thisLabel, $nextLabel, thisXPos, nextXPos, delta, newXPos;

        $labels.each(function () {
          $thisLabel = $(this).parent("span");
          thisXPos = parseInt($thisLabel.css("left"));

          $nextLabel = $thisLabel.next();
          // next position is either a label or the end of the axis
          nextXPos = $nextLabel.length
            ? parseInt($nextLabel.css("left"))
            : chart.axes[0].left + chart.axes[0].width;
          delta = (nextXPos - thisXPos) / 2.0;
          newXPos = thisXPos + delta;

          // remove the last label if it won't fit
          if ($nextLabel.length || $(this).width() + newXPos < nextXPos) {
            $thisLabel.css("left", newXPos + "px");
          } else {
            $thisLabel.remove();
          }
        });
      }
    );
  }

  function redrawChart(type) {
    // clear the series
    while (chart.series.length > 0) chart.series[0].remove(true);

    // render graph
    var selected_countries = [];
    var selected_members = [];
    var selected_rating = [];
    var tmp_data = [];

    var graph_startdate = "",
      graph_enddate = "";

    if ($(".challenge-status").hasClass("completed")) {
      graph_enddate = moment($("#status-challenge-enddate").data("date"));
    } else {
      graph_enddate = moment();
    }
    if ($(".challenge-status").hasClass("completed")) {
      graph_enddate = moment($("#status-challenge-startdate").data("date"));
    } else {
      graph_enddate = moment();
    }
    window.alert(graph_enddate);

    switch ($("input[type='radio'][name='contest_time']:checked").val()) {
      case "LAST 48 HR":
        graph_startdate = moment(graph_enddate).subtract(2, "days");
        break;

      case "LAST 24 HR":
        graph_startdate = moment(graph_enddate).subtract(1, "days");
        break;

      case "RANGE":
        graph_startdate = $(".date-value").data("startdate");
        graph_enddate = $(".date-value").data("enddate");

        if (graph_startdate == undefined) {
          graph_startdate = moment($(".daterange").data("startDate"));
        }

        if (graph_enddate == undefined) {
          graph_enddate = moment($(".daterange").data("endDate"));
        }

        break;

      default:
        // all
        graph_startdate = "";
        graph_enddate = "";
    }
    window.alert(graph_startdate);
    var json_data = {
      red: {
        color: "rgba(196, 26, 30, 0.9)",
        data: [],
        marker: {
          symbol: "circle",
        },
      },
      yellow: {
        color: "rgba(255, 179, 53, 0.9)",
        data: [],
        marker: {
          symbol: "circle",
        },
      },
      purple: {
        color: "rgba(145, 103, 226, 0.9)",
        data: [],
        marker: {
          symbol: "circle",
        },
      },
      green: {
        color: "rgba(112, 181, 55, 0.9)",
        data: [],
        marker: {
          symbol: "circle",
        },
      },
      gray: {
        color: "rgba(199, 199, 199, 0.9)",
        data: [],
        marker: {
          symbol: "circle",
        },
      },
    };
    /*
		// countries
		$('#option-country a.selected').each(function(index, element) {
			selected_countries.push($(this).data('value'));
		});

		// members
		$('#option-member a.selected').each(function(index, element) {
			selected_members.push($(this).data('value'));
		});

		// rating
		$('#option-rating a.selected').each(function(index, element) {
			selected_rating.push($(this).data('value'));
		});

		var json_type = type==='provisional' ? json : json_final;
*/
    $(json_type).each(function (index, element) {
      // assign json data
      $.each(element.data, function (i, v) {
        var tmp_date = new Date(v.date);
        var new_date = Date.UTC(
          tmp_date.getFullYear(),
          tmp_date.getMonth(),
          tmp_date.getDate(),
          tmp_date.getHours(),
          tmp_date.getMinutes(),
          tmp_date.getSeconds()
        );
        var arr = {
          x: new_date,
          y: v.score,
          handle: element.user.handle,
          submissions: element.data.length,
          img: element.user.avatar,
          country: element.user.country,
          rating: element.user.rating,
        };
        var include = true;

        // check if country is included
        if ($.inArray(element.user.country, selected_countries) < 0) {
          include = false;
        }

        // check if member is included
        if ($.inArray(element.user.handle, selected_members) < 0) {
          include = false;
        }

        // check if rating is included
        if (
          $.inArray(get_rating_color(element.user.rating), selected_rating) < 0
        ) {
          include = false;
        }

        // check date
        if (graph_startdate != "" && graph_enddate != "") {
          if (!moment(v.date).isBetween(graph_startdate, graph_enddate)) {
            include = false;
          }
        }

        if (include) {
          if (element.user.rating >= 2200) {
            // red
            json_data.red.data.push(arr);
          } else if (element.user.rating >= 1500) {
            // yellow
            json_data.yellow.data.push(arr);
          } else if (element.user.rating >= 1200) {
            // purple
            json_data.purple.data.push(arr);
          } else if (element.user.rating >= 900) {
            // green
            json_data.green.data.push(arr);
          } else {
            // gray
            json_data.gray.data.push(arr);
          }
        }
      });
    });

    // call load graph callback
    $.each(json_data, function (i, v) {
      if (v.data.length > 0) {
        chart.addSeries(v, true, false);
      }
    });

    // center horizontal labels
    var $container = $(chart.container);
    var $labels = $container.find(".highcharts-axis-labels .timeline_label");
    var $thisLabel, $nextLabel, thisXPos, nextXPos, delta, newXPos;

    $labels.each(function () {
      $thisLabel = $(this).parent("span");
      thisXPos = parseInt($thisLabel.css("left"));

      $nextLabel = $thisLabel.next();
      // next position is either a label or the end of the axis
      nextXPos = $nextLabel.length
        ? parseInt($nextLabel.css("left"))
        : chart.axes[0].left + chart.axes[0].width;
      delta = (nextXPos - thisXPos) / 2.0;
      newXPos = thisXPos + delta;

      // remove the last label if it won't fit
      if ($nextLabel.length || $(this).width() + newXPos < nextXPos) {
        $thisLabel.css("left", newXPos + "px");
      } else {
        $thisLabel.remove();
      }
    });

    // max data dash line
    var max_dash = {
      data: [],
      lineWidth: 1,
      dashStyle: "Dash",
      lineColor: "#666666",
      type: "scatter",
      marker: {
        enabled: false,
      },
      showInLegend: false,
      enableMouseTracking: false,
    };

    $(max_dash_json).each(function (i, v) {
      var include = true;
      var tmp_date = new Date(v.date);
      var new_date = Date.UTC(
        tmp_date.getFullYear(),
        tmp_date.getMonth(),
        tmp_date.getDate(),
        tmp_date.getHours(),
        tmp_date.getMinutes(),
        tmp_date.getSeconds()
      );
      var arr = {
        x: new_date,
        y: v.score,
      };

      // check date
      if (graph_startdate != "" && graph_enddate != "") {
        if (!moment(v.date).isBetween(graph_startdate, graph_enddate)) {
          include = false;
        }
      }

      if (include) {
        max_dash.data.push(arr);
      }
    });

    chart.addSeries(max_dash, true, false);

    // toggle success metrics
    var plotSuccess = chart.yAxis[0].plotLinesAndBands[0];
    var plotBaseline = chart.yAxis[0].plotLinesAndBands[1];

    if ($("#option-metrics a.success").hasClass("selected")) {
      plotSuccess.svgElem.show();
      plotSuccess.label.show();
    } else {
      plotSuccess.svgElem.hide();
      plotSuccess.label.hide();
    }

    if ($("#option-metrics a.baseline").hasClass("selected")) {
      plotBaseline.svgElem.show();
      plotBaseline.label.show();
    } else {
      plotBaseline.svgElem.hide();
      plotBaseline.label.hide();
    }
  }

  // Load Challenge Participants

  $.getJSON("./data/challenge-participants.json", function (data) {
    $("#challenge-participants-num").html(data.length);

    $.each(data, function (index, value) {
      var rating_color = get_rating_color(value.user.rating);
      var avatar =
        value.user.avatar === ""
          ? "./i/high_topcoder_notext.png"
          : value.user.avatar;

      var html = "<tr>";
      html +=
        '<td><a href="https://www.topcoder.com/members/' +
        value.user.handle +
        '"><img src="' +
        avatar +
        '" class="avatar" alt="" /></a><a href="https://www.topcoder.com/members/' +
        value.user.handle +
        '"><span class="handle handle-name ' +
        rating_color +
        '">' +
        value.user.handle +
        '</span></a><br /><span class="registration-date">' +
        value.registrationDate +
        "</span></td>";
      html +=
        '<td class="text-center"><span class="handle rating ' +
        rating_color +
        '">' +
        value.user.rating +
        "</span></td>";
      html +=
        '<td><img src="' +
        value.user.countryFlag +
        '" class="flag" alt="" /><span>' +
        value.user.country +
        "</span></td>";
      html +=
        '<td class="text-center"><span>' + value.submissions + "</span></td>";
      html +=
        '<td class="text-center"><span>' + value.language + "</span></td>";
      html +=
        '<td class="text-center"><span>' + value.scoreRank + "</span></td>";
      html += "</tr>";
      $("#challenge-participants-table tbody").append(html);
    });

    $("#challenge-participants-table").tablesorter({
      sortList: [[5, 1]],
      textExtraction: function (node) {
        if (node.childNodes[1]) {
          return node.childNodes[1].innerHTML;
        } else {
          return node.childNodes[0].innerHTML;
        }
      },
    });
  });
  // Load Challenge Posts
  $.getJSON("./data/challenge-posts.json", function (data) {
    $("#posts-num").html(data.length);

    $.each(data, function (index, value) {
      var rating_color = get_rating_color(value.user.rating);
      var avatar =
        value.user.avatar === ""
          ? "./i/high_topcoder_notext.png"
          : value.user.avatar;
      var html = "<tr>";
      html += '<td><img src="' + avatar + '" class="avatar" alt="" /></td>';
      html += "<td>";
      html +=
        '	<span class="handle rating ' +
        rating_color +
        '">' +
        value.user.handle +
        "</span>";
      html += "	<p>" + value.message + "</p>";
      html +=
        '	<span class="posts-date">' +
        moment(value.timestamp, "YYYYMMDD").fromNow() +
        "</span>";
      html += "</td>";
      html += "</tr>";
      $("#posts-table tbody").append(html);
    });
  });

  // Load Challenge Submissions
  $.getJSON("./data/challenge-submissions.json", function (data) {
    $("#submissions-num").html(data.length);

    $.each(data, function (index, value) {
      var rating_color = get_rating_color(value.user.rating);
      var avatar =
        value.user.avatar === ""
          ? "./i/high_topcoder_notext.png"
          : value.user.avatar;
      var html = "<tr>";
      html +=
        '<td><a href="https://www.topcoder.com/members/' +
        value.user.handle +
        '"><img src="' +
        avatar +
        '" class="avatar" alt="" /></a></td>';
      html += "<td>";
      html +=
        '	<a href="https://www.topcoder.com/members/' +
        value.user.handle +
        '"><span class="handle rating ' +
        rating_color +
        '">' +
        value.user.handle +
        "</span></a><br />";
      html +=
        '	<span class="text-muted">' +
        moment(value.timestamp, "MM/DD/YYYY").format("l") +
        "</span>";
      html += "</td>";
      html += '<td width="100"></td>';
      html += '<td class="text-center">';
      html +=
        "<span>" +
        value.submissions +
        ' </span><span class="text-muted">submission #<br/>';
      /*
			var links = value.submissionid.split(",");
      if(links.length > 0)
			{
				html += "(";
			}
			for(i=0; i<links.length;i++ )
			{
				var countDisplay = "" + (i + 1);
				if(i != 0)
				{
					countDisplay = ", " + (i + 1);
				}
				html += '<a href="' + links[i] + '">'+countDisplay+'</a>';
			}
			if(links.length > 0)
			{
				html += ")";
			}*/
      html += "</span>";
      html += "</td>";

      html += '<td class="text-center">';
      html +=
        "	<span>" +
        value.rank +
        '</span><br /><span class="text-muted">points</span>';
      html += "</td>";
      html += "</tr>";
      $("#submissions-table tbody").append(html);
    });
  });

  // Load Challenge Alerts
  $.getJSON("./data/challenge-alerts.json", function (data) {
    $("#alerts-num").html(data.length);

    $.each(data, function (index, value) {
      var html = "<tr>";
      html += '<td width="50"><img src="' + value.image + '" alt="" /></td>';
      html += "<td>";
      html += "	<p>" + value.message + "</p>";
      html += "</td>";
      html += '<td width="100"></td>';
      html += '<td width="100" >';
      html +=
        '	<span class="posts-date">' +
        moment(value.timestamp, "YYYYMMDD").fromNow() +
        "</span>";
      html += "</td>";
      html += "</tr>";
      $("#alerts-table tbody").append(html);
    });
  });

  // Load Challenge Status
  $.getJSON("./data/challenge-status.json", function (data) {
    var deadline = data["challenge-end"];
    var challengeStartDate = data["challenge-start"];

    updateClock(deadline);
    $("#status-challenge-enddate").html(moment(deadline).format("MM/DD/YYYY"));
    $("#status-challenge-enddate").data("date", deadline);
    $("#status-challenge-startdate").html(
      moment(challengeStartDate).format("MM/DD/YYYY")
    );
    $("#status-challenge-startdate").data("date", challengeStartDate);
    $("#pageTitle").html(data["page-title"]);
    $("#brwsrTitle").html(data["page-title"]);
    $("#status-challenge-improvement").html(data["delta-improvement"]);
    $("#status-challenge-registrants").html(data["registrants"]);
    $("#status-challenge-submitters").html(data["submitters"]);
    $("#status-challenge-submissions").html(data["total-submissions"]);
    $("#radial-delta-improvement").data(
      "value",
      parseFloat(data["delta-improvement"]) / 100
    );

    // Animate radial progress bar
    if ($(".radial-progress").length > 0) {
      $(".radial-progress").each(function (index, element) {
        $(this)
          .circleProgress({
            size: 84,
            startAngle: -1.6,
            thickness: 4,
            lineCap: "round",
            emptyFill: "#eceff4",
            fill: { gradient: ["#2dd663", "#b9d840"] },
          })
          .on(
            "circle-animation-progress",
            function (event, progress, stepValue) {
              stepValue = stepValue * 100;
              $(this)
                .find("span")
                .text(stepValue.toFixed(0) + "%");
            }
          );
      });
    }
  });

  function getTimeRemaining(endtime) {
    var t = Date.parse(endtime) - Date.parse(new Date());
    var seconds = Math.floor((t / 1000) % 60);
    var minutes = Math.floor((t / 1000 / 60) % 60);
    var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    var days = Math.floor(t / (1000 * 60 * 60 * 24));
    return {
      total: t,
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  }

  function updateClock(endtime) {
    var timeinterval = setInterval(function () {
      var t = getTimeRemaining(endtime);
      var h = t.hours;

      if (t.total > 0) {
        if (t.days > 0) {
          h = h + t.days * 24;
        }

        var timer = h + ":" + ("0" + t.minutes).slice(-2);
        if (h == 0) {
          timer = t.minutes + ":" + ("0" + t.seconds).slice(-2);
        }
      } else {
        if (t.total <= 0) {
          clearInterval(timeinterval);
          $(".challenge-status").addClass("completed");
        }
        timer = "<small>CLOSED</small>";
      }

      $("#status-challenge-end").html(timer);
    }, 1000);
  }

  // Geography Map
  if ($("#country-map").length > 0) {
    $.getJSON("./data/geo-data.json", function (data) {
      var table_data = new Array();
      var map_data = new Array();
      var total_subs = 0;

      $.each(data, function (index, value) {
        // store table data
        table_data.push({ name: value.country, val: value.submissions });
        total_subs += value.submissions;

        // store map data
        map_data.push({ "hc-key": value.code, value: value.submissions });
      });

      // set the table
      $("#country-table-num").html(data.length);

      table_data.sort(function (a, b) {
        return b.val - a.val;
      });
      $.each(table_data, function (index, value) {
        var percentage = (value.val / total_subs) * 100;
        var html = "<tr>";
        html += "<td>" + value.name + "</td>";
        html += '<td class="text-center">' + value.val + "</td>";
        html += '<td class="text-center">' + percentage.toFixed(2) + "%</td>";
        html += "</tr>";
        $("#country-table table tbody").append(html);
      });

      // set the map
      var map = new Highcharts.Map({
        chart: {
          renderTo: "country-map",
        },
        credits: {
          enabled: false,
        },
        legend: {
          enabled: false,
        },
        title: {
          text: "",
        },
        tooltip: {
          backgroundColor: "transparent",
          borderColor: "none",
          borderRadius: 0,
          shadow: false,
          useHTML: true,
          headerFormat: "",
          pointFormat:
            '<span class="tooltip-map-count">{point.value}</span><span class="tooltip-map-country">{point.name}</span>',
          footerFormat: "",
        },
        series: [
          {
            data: map_data,
            mapData: Highcharts.maps["custom/world"],
            joinBy: "hc-key",
            name: "",
            color: "#c7c8cc",
            states: {
              hover: {
                color: "#a6a7aa",
              },
            },
          },
        ],
      });
    });
  }

  // Function to return the color name based on rating
  function get_rating_color(rating) {
    var $return = false;

    if (rating >= 2200) {
      // red
      $return = "red";
    } else if (rating >= 1500) {
      // yellow
      $return = "yellow";
    } else if (rating >= 1200) {
      // purple
      $return = "purple";
    } else if (rating >= 900) {
      // green
      $return = "green";
    } else {
      // gray
      $return = "gray";
    }

    return $return;
  }
});
