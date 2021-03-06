var filters = filters || {};

/**
 * Initiates all filter functions on the bottom (buttons on the bottom)
 *
 * @author Christian Reber
 */
filters.init = function() {

	$('.list').click(filters.clearActiveStates);
	$('a#someday').click(function() { wunderlist.getFilteredTasks('date', 'withdate') });
	$('a#withoutdate').click(function() { wunderlist.getFilteredTasks('date', 'nodate') });
	$('a#all').click(function() { wunderlist.getFilteredTasks('all') });
	$('a#starred').click(function() { wunderlist.getFilteredTasks('starred') });
	$('a#today').click(function() { wunderlist.getFilteredTasks('today') });
	$('a#tomorrow').click(function() { wunderlist.getFilteredTasks('tomorrow') });
	$('a#thisweek').click(function() { wunderlist.getFilteredTasks('thisweek') });
	$('a#done').click(function() { wunderlist.getFilteredTasks('done') });

	// Activates a filter
	$('#bottombar #left a').click(function() {
		filters.setActiveState(this);
		$("a.list").droppable({ disabled: false });
		make_timestamp_to_string();
		//makeFilterListSortable();
	});

	// Show overdue tasks if click on "overdue alert"
	$('div#sidebar div#notification div').click(function() {
		wunderlist.getFilteredTasks('overdue');
		make_timestamp_to_string();
		$("a.list").droppable({ disabled: false });
		//makeFilterListSortable();
		$('#bottombar #left a').removeClass('active');
	});

	setTimeout(filters.updateBadges, 10);
}

/**
 * Add class="active" on filters
 *
 * @author Dennis Schneider
 */
filters.setActiveState = function(object) {
	$('#bottombar #left a').removeClass('active');
	$('.list').removeClass('ui-state-disabled');
	$(object).addClass('active');
}

/**
 * Removes class="active" on filters
 *
 * @author Christian Reber
 */
filters.clearActiveStates = function(object) {
	$('#bottombar #left a').removeClass('active');
}

/**
 * Creates those tiny little red badges on the filters and on the Dock Icon (only on Mac OS X)
 * to remind the user of "overdue" and "today" tasks
 *
 * @author Dennis Schneider, Christian Reber
 */
filters.updateBadges = function() {
	// Generate Badges
	var todaycount	 = wunderlist.getBadgeCount('today');
	var overduecount = wunderlist.getBadgeCount('overdue');

	var today_has_no_badge	  = $('#bottombar #left a#today span').length == 0;
	var overdue_has_no_badge = $('#bottombar #left a#overdue span').length == 0;

	if(today_has_no_badge == true)
	{
		$('#left a#today').append('<span>' + todaycount + '</span>');
	}
	else
	{
		$('#left a#today span').text(todaycount);
		$('#left a#today span').fadeOut('fast').fadeIn('fast');
		$("#lists").css("bottom","74px");
		$("#note").css("bottom","74px");
	}

	if(overduecount > 1)
	{
		overdue_text = overduecount + ' ' + language.data.overdue_text_pl;
		$('div#sidebar div#notification').fadeIn('fast');
		$("#lists").css("bottom","74px");
		$("#note").css("bottom","74px");
	}
	else if(overduecount == 1)
	{
		overdue_text = overduecount + ' ' + language.data.overdue_text_sl;
		$('div#sidebar div#notification').fadeIn('fast');
		$("#lists").css("bottom","74px");
		$("#note").css("bottom","74px");
	}
	else
	{
		overdue_text = '';
		$('div#sidebar div#notification').fadeOut('fast');
		$("#lists").css("bottom","36px");
		$("#note").css("bottom","36px");
	}

	if(overdue_has_no_badge)
	{
		$('div#sidebar div#notification div').text(overdue_text);
	}
	else
	{
		$('div#sidebar div#notification div').text(overduecount);
		$('div#sidebar div#notification').fadeOut('fast').fadeIn('fast');
		$("#lists").css("bottom","74px");
	}

	var countAll = overduecount + todaycount;

	if(todaycount == 0)
	{
		$('#left a#today span').remove();
	}

	if(countAll == 0)
	{
		Titanium.UI.setBadge(null);
	}
	else
	{
		Titanium.UI.setBadge(countAll.toString());
	}
}

/**
 * Clears all little red badges
 *
 * @author Christian Reber
 */
filters.clearBadges = function() {
	Titanium.UI.setBadge('');
	$('#left a#today span').remove();
	$('div#sidebar div#notification').hide();
}
