$(function() {

  var irregularities_grouped_in_parties_data;
  var bb_div = $('div.col-xs-3').parent();

  // Gauge

  var tot_reg = parseInt(100.0 * (outputData.totals.count - outputData.totals.badboys)/outputData.totals.count + .5);
  var tot_irr = parseInt(100.0 * outputData.totals.badboys/outputData.totals.count + .5);
  $('div.regular').width(tot_reg + '%');
  $('div.irregular').width(tot_irr + '%');
  $('div.regular').text(tot_reg + '%');
  $('div.irregular').text(tot_irr + '%');
  $('div.regular').click(function() {
      irregularities_grouped_in_parties.load({
          columns: _.chain(outputData.parties)
              .map(function(party) { return [party['name'], party['count']] } )
              .value(),
      });
  });
  $('div.irregular').click(function() {
      irregularities_grouped_in_parties.load({
          columns: _.chain(outputData.parties)
              .map(function(party) { return [party['name'], party['count']] } )
              .value(),
      });
  });

  // Pie chart

  irregularities_grouped_in_parties_data = _.chain(outputData.parties)
      .map(function(party) { return [party['name'], party['count']] } )
      .value();

  var irregularities_grouped_in_parties = c3.generate({
    bindto: '#irregularities_grouped_in_parties_chart',
    data: {
      columns: irregularities_grouped_in_parties_data,
      type: 'donut'
    },
    donut: {
      onclick: function (d, i) {
        var bad_boys = _.chain(outputData.badboys)
            .where({'party' : d.name})
            .value();
        var html = '', i = 0;
        bad_boys.forEach(function(bb) {
            if(i++ < 8) {
                html += '<div class="col-xs-3"><div class="head-with-name-label"><div class="head"><img style="width: 100%;" src="images/head/'+bb.picture+'"></div><div class="name-label">'+bb.name+'</div></div></div>';
            }
        });
        bb_div.html(html);

      },
    }
  });

  var bad_boys = _.chain(outputData.badboys)
      .where({'party' : 'SPD'})
      .value();
  var html = '', i = 0;
  bad_boys.forEach(function(bb) {
      if(i++ < 8) {
          html += '<div class="col-xs-3"><div class="head-with-name-label"><div class="head"><img style="width: 100%;" src="images/head/'+bb.picture+'"></div><div class="name-label">'+bb.name+'</div></div></div>';
      }
});
  bb_div.html(html);


});
