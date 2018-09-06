
$('body').on('change', '[data-behavior~="inspections-filter"]', function(event) {

  var $self = $(this);
  var $target = $('#' + $self.attr('data-filter-target'))
  var newStatus = $self.val();

  $target
    .removeClass('fic-inspections--status-filter-is-all fic-inspections--status-filter-is-complete fic-inspections--status-filter-is-assigned fic-inspections--status-filter-is-not-started fic-inspections--status-filter-is-in-progress fic-inspections--status-filter-is-rejected ')
    .addClass('fic-inspections--status-filter-' + newStatus)
  ;

  if ($target.hasClass('fic-inspections--status-filter-is-all')) {
    $('#inspections-pagination').removeAttr('hidden');
  }
  else {
    $('#inspections-pagination').attr('hidden', 'true');
  }

})

$('body').on('change', '[data-behavior~="inspections-assignee-filter"]', function(event) {

  var $self = $(this);
  var $target = $('#' + $self.attr('data-filter-target'))
  var $targetRows = $target.find('[data-assignee]')
  var newAssignee = $self.val();
  var $newAssigneeRow = $('[data-assignee="' + newAssignee + '"]')

  $targetRows.removeAttr('data-filtered-by-assignee data-not-filtered-by-assignee');
  $newAssigneeRow.attr('data-filtered-by-assignee', true)

  var $notAssignedRows = $target.find('.fic-inspections__tbody tr:not([data-filtered-by-assignee])')

  $notAssignedRows.attr('data-not-filtered-by-assignee', true);

  if (newAssignee == 'assignedto-all') {
    $notAssignedRows.removeAttr('data-filtered-by-assignee data-not-filtered-by-assignee');
  }

})

$('body').on('change', '[data-behavior~="inspections-count-filter"]', function(event) {

  var $self = $(this);
  var $component = $('#' + $self.attr('data-filter-target'))

  var $inspectionRowsHidden = $component.find('.fic-inspections__row:not(:hidden)');
  var $inspectionNoResults = $component.find('.fic-inspections__tfoot');

  console.log('Number of viewable rows: ' + $inspectionRowsHidden.length);

  if ($inspectionRowsHidden.length == '0') {
    $inspectionNoResults.removeAttr('hidden')
  }
  else {
    $inspectionNoResults.attr('hidden', true)
  }

  if ($inspectionRowsHidden.length < 20) {
    $('#inspections-pagination').attr('hidden', true);
  }
  if ($inspectionRowsHidden.length >= 20) {
    $('#inspections-pagination').removeAttr('hidden');
  }

  if ($inspectionRowsHidden.length >= 20) {
    $('#inspections-amt').html('1-20');
  }
  if ($inspectionRowsHidden.length < 20) {
    $('#inspections-amt').html($inspectionRowsHidden.length);
  }

})

$('body').on('change', '[data-behavior~="inspections-select-row"]', function(event) {

  var $self = $(this);
  var $row = $self.closest('.fic-inspections__row');

  $row.toggleClass('fic-inspections__row--selected');

})

$('body').on('change', '[data-behavior~="inspections-toggle-header"]', function(event) {

  var $self = $(this);

  $('#fic-inspection-hd__list-header').attr('hidden', true);
  $('#fic-inspection-hd__triage').removeAttr('hidden');

})

$('body').on('change', '[data-behavior~="inspections-select-all"]', function(event) {

  var $self = $(this);
  var $row = $self.closest('.fic-inspections__row--thead');
  var $table = $self.closest('.fic-inspections');
  var $rowsAll = $table.find('.fic-inspections__row:not([data-status="is-complete"])');
  var $rowsAllChecks = $rowsAll.find('.fsa-checkbox:not([disabled])');
  var isChecked = $self.is(':checked');

  if(isChecked) {
    $rowsAll.addClass('fic-inspections__row--selected');
    $rowsAllChecks.prop('checked', true);
  }
  else {
    $rowsAll.removeClass('fic-inspections__row--selected');
    $rowsAllChecks.prop('checked', false);
  }

  return false;

})

$('body').on('change', '[data-behavior~="enable-field"]', function(event) {

  var $self = $(this);
  var $target = $($self.data('enable-target'));

  setTimeout(function () {
    $target.removeAttr('disabled');
  }, 4000);

})

$('body').on('change', '[data-behavior~="disable-field"]', function(event) {

  var $self = $(this);
  var $target = $($self.data('disable-target'));

  $target.attr('disabled', 'disabled');

})

$('body').on('change', '[data-behavior~="reset-field"]', function(event) {

  var $self = $(this);
  var $target = $($self.data('reset-target'));

  $target.prop("selected", false);

})

$('body').on('click', '[data-behavior~="reset-filter-fields"]', function(event) {

  var $self = $(this);
  var $component = $self.closest('table');
  var $componentRows = $component.find('tr');
  var $row = $self.closest('tr');
  var $target = $row.find('option:selected');
  var $targetDisabled = $($self.data('disable-targets'));

  $target.prop("selected", false);
  $targetDisabled.attr('disabled', true);
  $component.removeClass('fic-inspections--status-filter-is-rejected fic-inspections--status-filter-is-not-started fic-inspections--status-filter-is-assigned fic-inspections--status-filter-is-in-progress fic-inspections--status-filter-is-complete');
  $componentRows.removeAttr('data-filtered-by-assignee data-not-filtered-by-assignee')
  $component.find('.fic-inspections__tfoot').attr('hidden', true);
  $('#inspections-pagination').removeAttr('hidden');
  $('#inspections-amt').html('1-20');

})

$('body').on('change', '[data-behavior~="inspections-progressing"]', function(event) {

  var $self = $(this);
  var $targetProgress = $('#' + $self.attr('data-progress-target'));
  var $targetDisable = $($self.attr('data-disable-target'));
  var $progressBar = $targetProgress.find('.fic-progress-target__item');
  var classToToggle = 'fic-progress-bar--indeterminate-hidden';

  $targetDisable
    .css('opacity','.5')
    .css('pointer-events','none')
  ;

  $progressBar.removeClass(classToToggle);

  setTimeout(function () {
    $progressBar.addClass(classToToggle);
    $targetDisable.removeAttr('style');
  }, 5000);

})
