$(function() {

  var irregularities_grouped_in_parties_data;

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
      onclick: function (d, i) { console.log(d, i); },
      onmouseover: function (d, i) { console.log(d, i); },
      onmouseout: function (d, i) { console.log(d, i); }
    }
  });

});