/*
 * This combined file was created by the DataTables downloader builder:
 *   https://datatables.net/download
 *
 * To rebuild or modify this file with the latest versions of the included
 * software please visit:
 *   https://datatables.net/download/#dt/dt-1.10.22/e-1.9.6/b-1.6.5/sl-1.3.1
 *
 * Included libraries:
 *   DataTables 1.10.22, Editor 1.9.6, Buttons 1.6.5, Select 1.3.1
 */

/*! DataTables 1.10.22
 * ©2008-2020 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     DataTables
 * @description Paginate, search and order HTML tables
 * @version     1.10.22
 * @file        jquery.dataTables.js
 * @author      SpryMedia Ltd
 * @contact     www.datatables.net
 * @copyright   Copyright 2008-2020 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */

/*jslint evil: true, undef: true, browser: true */
/*globals $,require,jQuery,define,_selector_run,_selector_opts,_selector_first,_selector_row_indexes,_ext,_Api,_api_register,_api_registerPlural,_re_new_lines,_re_html,_re_formatted_numeric,_re_escape_regex,_empty,_intVal,_numToDecimal,_isNumber,_isHtml,_htmlNumeric,_pluck,_pluck_order,_range,_stripHtml,_unique,_fnBuildAjax,_fnAjaxUpdate,_fnAjaxParameters,_fnAjaxUpdateDraw,_fnAjaxDataSrc,_fnAddColumn,_fnColumnOptions,_fnAdjustColumnSizing,_fnVisibleToColumnIndex,_fnColumnIndexToVisible,_fnVisbleColumns,_fnGetColumns,_fnColumnTypes,_fnApplyColumnDefs,_fnHungarianMap,_fnCamelToHungarian,_fnLanguageCompat,_fnBrowserDetect,_fnAddData,_fnAddTr,_fnNodeToDataIndex,_fnNodeToColumnIndex,_fnGetCellData,_fnSetCellData,_fnSplitObjNotation,_fnGetObjectDataFn,_fnSetObjectDataFn,_fnGetDataMaster,_fnClearTable,_fnDeleteIndex,_fnInvalidate,_fnGetRowElements,_fnCreateTr,_fnBuildHead,_fnDrawHead,_fnDraw,_fnReDraw,_fnAddOptionsHtml,_fnDetectHeader,_fnGetUniqueThs,_fnFeatureHtmlFilter,_fnFilterComplete,_fnFilterCustom,_fnFilterColumn,_fnFilter,_fnFilterCreateSearch,_fnEscapeRegex,_fnFilterData,_fnFeatureHtmlInfo,_fnUpdateInfo,_fnInfoMacros,_fnInitialise,_fnInitComplete,_fnLengthChange,_fnFeatureHtmlLength,_fnFeatureHtmlPaginate,_fnPageChange,_fnFeatureHtmlProcessing,_fnProcessingDisplay,_fnFeatureHtmlTable,_fnScrollDraw,_fnApplyToChildren,_fnCalculateColumnWidths,_fnThrottle,_fnConvertToWidth,_fnGetWidestNode,_fnGetMaxLenString,_fnStringToCss,_fnSortFlatten,_fnSort,_fnSortAria,_fnSortListener,_fnSortAttachListener,_fnSortingClasses,_fnSortData,_fnSaveState,_fnLoadState,_fnSettingsFromNode,_fnLog,_fnMap,_fnBindAction,_fnCallbackReg,_fnCallbackFire,_fnLengthOverflow,_fnRenderer,_fnDataSource,_fnRowAttributes*/

(function( factory ) {
	"use strict";

	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				// CommonJS environments without a window global must pass a
				// root. This will give an error otherwise
				root = window;
			}

			if ( ! $ ) {
				$ = typeof window !== 'undefined' ? // jQuery's factory checks for a global window
					require('jquery') :
					require('jquery')( root );
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}
(function( $, window, document, undefined ) {
	"use strict";

	/**
	 * DataTables is a plug-in for the jQuery Javascript library. It is a highly
	 * flexible tool, based upon the foundations of progressive enhancement,
	 * which will add advanced interaction controls to any HTML table. For a
	 * full list of features please refer to
	 * [DataTables.net](href="http://datatables.net).
	 *
	 * Note that the `DataTable` object is not a global variable but is aliased
	 * to `jQuery.fn.DataTable` and `jQuery.fn.dataTable` through which it may
	 * be  accessed.
	 *
	 *  @class
	 *  @param {object} [init={}] Configuration object for DataTables. Options
	 *    are defined by {@link DataTable.defaults}
	 *  @requires jQuery 1.7+
	 *
	 *  @example
	 *    // Basic initialisation
	 *    $(document).ready( function {
	 *      $('#example').dataTable();
	 *    } );
	 *
	 *  @example
	 *    // Initialisation with configuration options - in this case, disable
	 *    // pagination and sorting.
	 *    $(document).ready( function {
	 *      $('#example').dataTable( {
	 *        "paginate": false,
	 *        "sort": false
	 *      } );
	 *    } );
	 */
	var DataTable = function ( options )
	{
		/**
		 * Perform a jQuery selector action on the table's TR elements (from the tbody) and
		 * return the resulting jQuery object.
		 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
		 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
		 *  @param {string} [oOpts.filter=none] Select TR elements that meet the current filter
		 *    criterion ("applied") or all TR elements (i.e. no filter).
		 *  @param {string} [oOpts.order=current] Order of the TR elements in the processed array.
		 *    Can be either 'current', whereby the current sorting of the table is used, or
		 *    'original' whereby the original order the data was read into the table is used.
		 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
		 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be
		 *    'current' and filter is 'applied', regardless of what they might be given as.
		 *  @returns {object} jQuery object, filtered by the given selector.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Highlight every second row
		 *      oTable.$('tr:odd').css('backgroundColor', 'blue');
		 *    } );
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Filter to rows with 'Webkit' in them, add a background colour and then
		 *      // remove the filter, thus highlighting the 'Webkit' rows only.
		 *      oTable.fnFilter('Webkit');
		 *      oTable.$('tr', {"search": "applied"}).css('backgroundColor', 'blue');
		 *      oTable.fnFilter('');
		 *    } );
		 */
		this.$ = function ( sSelector, oOpts )
		{
			return this.api(true).$( sSelector, oOpts );
		};
		
		
		/**
		 * Almost identical to $ in operation, but in this case returns the data for the matched
		 * rows - as such, the jQuery selector used should match TR row nodes or TD/TH cell nodes
		 * rather than any descendants, so the data can be obtained for the row/cell. If matching
		 * rows are found, the data returned is the original data array/object that was used to
		 * create the row (or a generated array if from a DOM source).
		 *
		 * This method is often useful in-combination with $ where both functions are given the
		 * same parameters and the array indexes will match identically.
		 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
		 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
		 *  @param {string} [oOpts.filter=none] Select elements that meet the current filter
		 *    criterion ("applied") or all elements (i.e. no filter).
		 *  @param {string} [oOpts.order=current] Order of the data in the processed array.
		 *    Can be either 'current', whereby the current sorting of the table is used, or
		 *    'original' whereby the original order the data was read into the table is used.
		 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
		 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be
		 *    'current' and filter is 'applied', regardless of what they might be given as.
		 *  @returns {array} Data for the matched elements. If any elements, as a result of the
		 *    selector, were not TR, TD or TH elements in the DataTable, they will have a null
		 *    entry in the array.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Get the data from the first row in the table
		 *      var data = oTable._('tr:first');
		 *
		 *      // Do something useful with the data
		 *      alert( "First cell is: "+data[0] );
		 *    } );
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Filter to 'Webkit' and get all data for
		 *      oTable.fnFilter('Webkit');
		 *      var data = oTable._('tr', {"search": "applied"});
		 *
		 *      // Do something with the data
		 *      alert( data.length+" rows matched the search" );
		 *    } );
		 */
		this._ = function ( sSelector, oOpts )
		{
			return this.api(true).rows( sSelector, oOpts ).data();
		};
		
		
		/**
		 * Create a DataTables Api instance, with the currently selected tables for
		 * the Api's context.
		 * @param {boolean} [traditional=false] Set the API instance's context to be
		 *   only the table referred to by the `DataTable.ext.iApiIndex` option, as was
		 *   used in the API presented by DataTables 1.9- (i.e. the traditional mode),
		 *   or if all tables captured in the jQuery object should be used.
		 * @return {DataTables.Api}
		 */
		this.api = function ( traditional )
		{
			return traditional ?
				new _Api(
					_fnSettingsFromNode( this[ _ext.iApiIndex ] )
				) :
				new _Api( this );
		};
		
		
		/**
		 * Add a single new row or multiple rows of data to the table. Please note
		 * that this is suitable for client-side processing only - if you are using
		 * server-side processing (i.e. "bServerSide": true), then to add data, you
		 * must add it to the data source, i.e. the server-side, through an Ajax call.
		 *  @param {array|object} data The data to be added to the table. This can be:
		 *    <ul>
		 *      <li>1D array of data - add a single row with the data provided</li>
		 *      <li>2D array of arrays - add multiple rows in a single call</li>
		 *      <li>object - data object when using <i>mData</i></li>
		 *      <li>array of objects - multiple data objects when using <i>mData</i></li>
		 *    </ul>
		 *  @param {bool} [redraw=true] redraw the table or not
		 *  @returns {array} An array of integers, representing the list of indexes in
		 *    <i>aoData</i> ({@link DataTable.models.oSettings}) that have been added to
		 *    the table.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    // Global var for counter
		 *    var giCount = 2;
		 *
		 *    $(document).ready(function() {
		 *      $('#example').dataTable();
		 *    } );
		 *
		 *    function fnClickAddRow() {
		 *      $('#example').dataTable().fnAddData( [
		 *        giCount+".1",
		 *        giCount+".2",
		 *        giCount+".3",
		 *        giCount+".4" ]
		 *      );
		 *
		 *      giCount++;
		 *    }
		 */
		this.fnAddData = function( data, redraw )
		{
			var api = this.api( true );
		
			/* Check if we want to add multiple rows or not */
			var rows = Array.isArray(data) && ( Array.isArray(data[0]) || $.isPlainObject(data[0]) ) ?
				api.rows.add( data ) :
				api.row.add( data );
		
			if ( redraw === undefined || redraw ) {
				api.draw();
			}
		
			return rows.flatten().toArray();
		};
		
		
		/**
		 * This function will make DataTables recalculate the column sizes, based on the data
		 * contained in the table and the sizes applied to the columns (in the DOM, CSS or
		 * through the sWidth parameter). This can be useful when the width of the table's
		 * parent element changes (for example a window resize).
		 *  @param {boolean} [bRedraw=true] Redraw the table or not, you will typically want to
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable( {
		 *        "sScrollY": "200px",
		 *        "bPaginate": false
		 *      } );
		 *
		 *      $(window).on('resize', function () {
		 *        oTable.fnAdjustColumnSizing();
		 *      } );
		 *    } );
		 */
		this.fnAdjustColumnSizing = function ( bRedraw )
		{
			var api = this.api( true ).columns.adjust();
			var settings = api.settings()[0];
			var scroll = settings.oScroll;
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw( false );
			}
			else if ( scroll.sX !== "" || scroll.sY !== "" ) {
				/* If not redrawing, but scrolling, we want to apply the new column sizes anyway */
				_fnScrollDraw( settings );
			}
		};
		
		
		/**
		 * Quickly and simply clear a table
		 *  @param {bool} [bRedraw=true] redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Immediately 'nuke' the current rows (perhaps waiting for an Ajax callback...)
		 *      oTable.fnClearTable();
		 *    } );
		 */
		this.fnClearTable = function( bRedraw )
		{
			var api = this.api( true ).clear();
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw();
			}
		};
		
		
		/**
		 * The exact opposite of 'opening' a row, this function will close any rows which
		 * are currently 'open'.
		 *  @param {node} nTr the table row to 'close'
		 *  @returns {int} 0 on success, or 1 if failed (can't find the row)
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnClose = function( nTr )
		{
			this.api( true ).row( nTr ).child.hide();
		};
		
		
		/**
		 * Remove a row for the table
		 *  @param {mixed} target The index of the row from aoData to be deleted, or
		 *    the TR element you want to delete
		 *  @param {function|null} [callBack] Callback function
		 *  @param {bool} [redraw=true] Redraw the table or not
		 *  @returns {array} The row that was deleted
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Immediately remove the first row
		 *      oTable.fnDeleteRow( 0 );
		 *    } );
		 */
		this.fnDeleteRow = function( target, callback, redraw )
		{
			var api = this.api( true );
			var rows = api.rows( target );
			var settings = rows.settings()[0];
			var data = settings.aoData[ rows[0][0] ];
		
			rows.remove();
		
			if ( callback ) {
				callback.call( this, settings, data );
			}
		
			if ( redraw === undefined || redraw ) {
				api.draw();
			}
		
			return data;
		};
		
		
		/**
		 * Restore the table to it's original state in the DOM by removing all of DataTables
		 * enhancements, alterations to the DOM structure of the table and event listeners.
		 *  @param {boolean} [remove=false] Completely remove the table from the DOM
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      // This example is fairly pointless in reality, but shows how fnDestroy can be used
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnDestroy();
		 *    } );
		 */
		this.fnDestroy = function ( remove )
		{
			this.api( true ).destroy( remove );
		};
		
		
		/**
		 * Redraw the table
		 *  @param {bool} [complete=true] Re-filter and resort (if enabled) the table before the draw.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Re-draw the table - you wouldn't want to do it here, but it's an example :-)
		 *      oTable.fnDraw();
		 *    } );
		 */
		this.fnDraw = function( complete )
		{
			// Note that this isn't an exact match to the old call to _fnDraw - it takes
			// into account the new data, but can hold position.
			this.api( true ).draw( complete );
		};
		
		
		/**
		 * Filter the input based on data
		 *  @param {string} sInput String to filter the table on
		 *  @param {int|null} [iColumn] Column to limit filtering to
		 *  @param {bool} [bRegex=false] Treat as regular expression or not
		 *  @param {bool} [bSmart=true] Perform smart filtering or not
		 *  @param {bool} [bShowGlobal=true] Show the input global filter in it's input box(es)
		 *  @param {bool} [bCaseInsensitive=true] Do case-insensitive matching (true) or not (false)
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sometime later - filter...
		 *      oTable.fnFilter( 'test string' );
		 *    } );
		 */
		this.fnFilter = function( sInput, iColumn, bRegex, bSmart, bShowGlobal, bCaseInsensitive )
		{
			var api = this.api( true );
		
			if ( iColumn === null || iColumn === undefined ) {
				api.search( sInput, bRegex, bSmart, bCaseInsensitive );
			}
			else {
				api.column( iColumn ).search( sInput, bRegex, bSmart, bCaseInsensitive );
			}
		
			api.draw();
		};
		
		
		/**
		 * Get the data for the whole table, an individual row or an individual cell based on the
		 * provided parameters.
		 *  @param {int|node} [src] A TR row node, TD/TH cell node or an integer. If given as
		 *    a TR node then the data source for the whole row will be returned. If given as a
		 *    TD/TH cell node then iCol will be automatically calculated and the data for the
		 *    cell returned. If given as an integer, then this is treated as the aoData internal
		 *    data index for the row (see fnGetPosition) and the data for that row used.
		 *  @param {int} [col] Optional column index that you want the data of.
		 *  @returns {array|object|string} If mRow is undefined, then the data for all rows is
		 *    returned. If mRow is defined, just data for that row, and is iCol is
		 *    defined, only data for the designated cell is returned.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    // Row data
		 *    $(document).ready(function() {
		 *      oTable = $('#example').dataTable();
		 *
		 *      oTable.$('tr').click( function () {
		 *        var data = oTable.fnGetData( this );
		 *        // ... do something with the array / object of data for the row
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Individual cell data
		 *    $(document).ready(function() {
		 *      oTable = $('#example').dataTable();
		 *
		 *      oTable.$('td').click( function () {
		 *        var sData = oTable.fnGetData( this );
		 *        alert( 'The cell clicked on had the value of '+sData );
		 *      } );
		 *    } );
		 */
		this.fnGetData = function( src, col )
		{
			var api = this.api( true );
		
			if ( src !== undefined ) {
				var type = src.nodeName ? src.nodeName.toLowerCase() : '';
		
				return col !== undefined || type == 'td' || type == 'th' ?
					api.cell( src, col ).data() :
					api.row( src ).data() || null;
			}
		
			return api.data().toArray();
		};
		
		
		/**
		 * Get an array of the TR nodes that are used in the table's body. Note that you will
		 * typically want to use the '$' API method in preference to this as it is more
		 * flexible.
		 *  @param {int} [iRow] Optional row index for the TR element you want
		 *  @returns {array|node} If iRow is undefined, returns an array of all TR elements
		 *    in the table's body, or iRow is defined, just the TR element requested.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Get the nodes from the table
		 *      var nNodes = oTable.fnGetNodes( );
		 *    } );
		 */
		this.fnGetNodes = function( iRow )
		{
			var api = this.api( true );
		
			return iRow !== undefined ?
				api.row( iRow ).node() :
				api.rows().nodes().flatten().toArray();
		};
		
		
		/**
		 * Get the array indexes of a particular cell from it's DOM element
		 * and column index including hidden columns
		 *  @param {node} node this can either be a TR, TD or TH in the table's body
		 *  @returns {int} If nNode is given as a TR, then a single index is returned, or
		 *    if given as a cell, an array of [row index, column index (visible),
		 *    column index (all)] is given.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      $('#example tbody td').click( function () {
		 *        // Get the position of the current data from the node
		 *        var aPos = oTable.fnGetPosition( this );
		 *
		 *        // Get the data array for this row
		 *        var aData = oTable.fnGetData( aPos[0] );
		 *
		 *        // Update the data array and return the value
		 *        aData[ aPos[1] ] = 'clicked';
		 *        this.innerHTML = 'clicked';
		 *      } );
		 *
		 *      // Init DataTables
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnGetPosition = function( node )
		{
			var api = this.api( true );
			var nodeName = node.nodeName.toUpperCase();
		
			if ( nodeName == 'TR' ) {
				return api.row( node ).index();
			}
			else if ( nodeName == 'TD' || nodeName == 'TH' ) {
				var cell = api.cell( node ).index();
		
				return [
					cell.row,
					cell.columnVisible,
					cell.column
				];
			}
			return null;
		};
		
		
		/**
		 * Check to see if a row is 'open' or not.
		 *  @param {node} nTr the table row to check
		 *  @returns {boolean} true if the row is currently open, false otherwise
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnIsOpen = function( nTr )
		{
			return this.api( true ).row( nTr ).child.isShown();
		};
		
		
		/**
		 * This function will place a new row directly after a row which is currently
		 * on display on the page, with the HTML contents that is passed into the
		 * function. This can be used, for example, to ask for confirmation that a
		 * particular record should be deleted.
		 *  @param {node} nTr The table row to 'open'
		 *  @param {string|node|jQuery} mHtml The HTML to put into the row
		 *  @param {string} sClass Class to give the new TD cell
		 *  @returns {node} The row opened. Note that if the table row passed in as the
		 *    first parameter, is not found in the table, this method will silently
		 *    return.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnOpen = function( nTr, mHtml, sClass )
		{
			return this.api( true )
				.row( nTr )
				.child( mHtml, sClass )
				.show()
				.child()[0];
		};
		
		
		/**
		 * Change the pagination - provides the internal logic for pagination in a simple API
		 * function. With this function you can have a DataTables table go to the next,
		 * previous, first or last pages.
		 *  @param {string|int} mAction Paging action to take: "first", "previous", "next" or "last"
		 *    or page number to jump to (integer), note that page 0 is the first page.
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnPageChange( 'next' );
		 *    } );
		 */
		this.fnPageChange = function ( mAction, bRedraw )
		{
			var api = this.api( true ).page( mAction );
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw(false);
			}
		};
		
		
		/**
		 * Show a particular column
		 *  @param {int} iCol The column whose display should be changed
		 *  @param {bool} bShow Show (true) or hide (false) the column
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Hide the second column after initialisation
		 *      oTable.fnSetColumnVis( 1, false );
		 *    } );
		 */
		this.fnSetColumnVis = function ( iCol, bShow, bRedraw )
		{
			var api = this.api( true ).column( iCol ).visible( bShow );
		
			if ( bRedraw === undefined || bRedraw ) {
				api.columns.adjust().draw();
			}
		};
		
		
		/**
		 * Get the settings for a particular table for external manipulation
		 *  @returns {object} DataTables settings object. See
		 *    {@link DataTable.models.oSettings}
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      var oSettings = oTable.fnSettings();
		 *
		 *      // Show an example parameter from the settings
		 *      alert( oSettings._iDisplayStart );
		 *    } );
		 */
		this.fnSettings = function()
		{
			return _fnSettingsFromNode( this[_ext.iApiIndex] );
		};
		
		
		/**
		 * Sort the table by a particular column
		 *  @param {int} iCol the data index to sort on. Note that this will not match the
		 *    'display index' if you have hidden data entries
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sort immediately with columns 0 and 1
		 *      oTable.fnSort( [ [0,'asc'], [1,'asc'] ] );
		 *    } );
		 */
		this.fnSort = function( aaSort )
		{
			this.api( true ).order( aaSort ).draw();
		};
		
		
		/**
		 * Attach a sort listener to an element for a given column
		 *  @param {node} nNode the element to attach the sort listener to
		 *  @param {int} iColumn the column that a click on this node will sort on
		 *  @param {function} [fnCallback] callback function when sort is run
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sort on column 1, when 'sorter' is clicked on
		 *      oTable.fnSortListener( document.getElementById('sorter'), 1 );
		 *    } );
		 */
		this.fnSortListener = function( nNode, iColumn, fnCallback )
		{
			this.api( true ).order.listener( nNode, iColumn, fnCallback );
		};
		
		
		/**
		 * Update a table cell or row - this method will accept either a single value to
		 * update the cell with, an array of values with one element for each column or
		 * an object in the same format as the original data source. The function is
		 * self-referencing in order to make the multi column updates easier.
		 *  @param {object|array|string} mData Data to update the cell/row with
		 *  @param {node|int} mRow TR element you want to update or the aoData index
		 *  @param {int} [iColumn] The column to update, give as null or undefined to
		 *    update a whole row.
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @param {bool} [bAction=true] Perform pre-draw actions or not
		 *  @returns {int} 0 on success, 1 on error
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnUpdate( 'Example update', 0, 0 ); // Single cell
		 *      oTable.fnUpdate( ['a', 'b', 'c', 'd', 'e'], $('tbody tr')[0] ); // Row
		 *    } );
		 */
		this.fnUpdate = function( mData, mRow, iColumn, bRedraw, bAction )
		{
			var api = this.api( true );
		
			if ( iColumn === undefined || iColumn === null ) {
				api.row( mRow ).data( mData );
			}
			else {
				api.cell( mRow, iColumn ).data( mData );
			}
		
			if ( bAction === undefined || bAction ) {
				api.columns.adjust();
			}
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw();
			}
			return 0;
		};
		
		
		/**
		 * Provide a common method for plug-ins to check the version of DataTables being used, in order
		 * to ensure compatibility.
		 *  @param {string} sVersion Version string to check for, in the format "X.Y.Z". Note that the
		 *    formats "X" and "X.Y" are also acceptable.
		 *  @returns {boolean} true if this version of DataTables is greater or equal to the required
		 *    version, or false if this version of DataTales is not suitable
		 *  @method
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      alert( oTable.fnVersionCheck( '1.9.0' ) );
		 *    } );
		 */
		this.fnVersionCheck = _ext.fnVersionCheck;
		

		var _that = this;
		var emptyInit = options === undefined;
		var len = this.length;

		if ( emptyInit ) {
			options = {};
		}

		this.oApi = this.internal = _ext.internal;

		// Extend with old style plug-in API methods
		for ( var fn in DataTable.ext.internal ) {
			if ( fn ) {
				this[fn] = _fnExternApiFunc(fn);
			}
		}

		this.each(function() {
			// For each initialisation we want to give it a clean initialisation
			// object that can be bashed around
			var o = {};
			var oInit = len > 1 ? // optimisation for single table case
				_fnExtend( o, options, true ) :
				options;

			/*global oInit,_that,emptyInit*/
			var i=0, iLen, j, jLen, k, kLen;
			var sId = this.getAttribute( 'id' );
			var bInitHandedOff = false;
			var defaults = DataTable.defaults;
			var $this = $(this);
			
			
			/* Sanity check */
			if ( this.nodeName.toLowerCase() != 'table' )
			{
				_fnLog( null, 0, 'Non-table node initialisation ('+this.nodeName+')', 2 );
				return;
			}
			
			/* Backwards compatibility for the defaults */
			_fnCompatOpts( defaults );
			_fnCompatCols( defaults.column );
			
			/* Convert the camel-case defaults to Hungarian */
			_fnCamelToHungarian( defaults, defaults, true );
			_fnCamelToHungarian( defaults.column, defaults.column, true );
			
			/* Setting up the initialisation object */
			_fnCamelToHungarian( defaults, $.extend( oInit, $this.data() ), true );
			
			
			
			/* Check to see if we are re-initialising a table */
			var allSettings = DataTable.settings;
			for ( i=0, iLen=allSettings.length ; i<iLen ; i++ )
			{
				var s = allSettings[i];
			
				/* Base check on table node */
				if (
					s.nTable == this ||
					(s.nTHead && s.nTHead.parentNode == this) ||
					(s.nTFoot && s.nTFoot.parentNode == this)
				) {
					var bRetrieve = oInit.bRetrieve !== undefined ? oInit.bRetrieve : defaults.bRetrieve;
					var bDestroy = oInit.bDestroy !== undefined ? oInit.bDestroy : defaults.bDestroy;
			
					if ( emptyInit || bRetrieve )
					{
						return s.oInstance;
					}
					else if ( bDestroy )
					{
						s.oInstance.fnDestroy();
						break;
					}
					else
					{
						_fnLog( s, 0, 'Cannot reinitialise DataTable', 3 );
						return;
					}
				}
			
				/* If the element we are initialising has the same ID as a table which was previously
				 * initialised, but the table nodes don't match (from before) then we destroy the old
				 * instance by simply deleting it. This is under the assumption that the table has been
				 * destroyed by other methods. Anyone using non-id selectors will need to do this manually
				 */
				if ( s.sTableId == this.id )
				{
					allSettings.splice( i, 1 );
					break;
				}
			}
			
			/* Ensure the table has an ID - required for accessibility */
			if ( sId === null || sId === "" )
			{
				sId = "DataTables_Table_"+(DataTable.ext._unique++);
				this.id = sId;
			}
			
			/* Create the settings object for this table and set some of the default parameters */
			var oSettings = $.extend( true, {}, DataTable.models.oSettings, {
				"sDestroyWidth": $this[0].style.width,
				"sInstance":     sId,
				"sTableId":      sId
			} );
			oSettings.nTable = this;
			oSettings.oApi   = _that.internal;
			oSettings.oInit  = oInit;
			
			allSettings.push( oSettings );
			
			// Need to add the instance after the instance after the settings object has been added
			// to the settings array, so we can self reference the table instance if more than one
			oSettings.oInstance = (_that.length===1) ? _that : $this.dataTable();
			
			// Backwards compatibility, before we apply all the defaults
			_fnCompatOpts( oInit );
			_fnLanguageCompat( oInit.oLanguage );
			
			// If the length menu is given, but the init display length is not, use the length menu
			if ( oInit.aLengthMenu && ! oInit.iDisplayLength )
			{
				oInit.iDisplayLength = Array.isArray( oInit.aLengthMenu[0] ) ?
					oInit.aLengthMenu[0][0] : oInit.aLengthMenu[0];
			}
			
			// Apply the defaults and init options to make a single init object will all
			// options defined from defaults and instance options.
			oInit = _fnExtend( $.extend( true, {}, defaults ), oInit );
			
			
			// Map the initialisation options onto the settings object
			_fnMap( oSettings.oFeatures, oInit, [
				"bPaginate",
				"bLengthChange",
				"bFilter",
				"bSort",
				"bSortMulti",
				"bInfo",
				"bProcessing",
				"bAutoWidth",
				"bSortClasses",
				"bServerSide",
				"bDeferRender"
			] );
			_fnMap( oSettings, oInit, [
				"asStripeClasses",
				"ajax",
				"fnServerData",
				"fnFormatNumber",
				"sServerMethod",
				"aaSorting",
				"aaSortingFixed",
				"aLengthMenu",
				"sPaginationType",
				"sAjaxSource",
				"sAjaxDataProp",
				"iStateDuration",
				"sDom",
				"bSortCellsTop",
				"iTabIndex",
				"fnStateLoadCallback",
				"fnStateSaveCallback",
				"renderer",
				"searchDelay",
				"rowId",
				[ "iCookieDuration", "iStateDuration" ], // backwards compat
				[ "oSearch", "oPreviousSearch" ],
				[ "aoSearchCols", "aoPreSearchCols" ],
				[ "iDisplayLength", "_iDisplayLength" ]
			] );
			_fnMap( oSettings.oScroll, oInit, [
				[ "sScrollX", "sX" ],
				[ "sScrollXInner", "sXInner" ],
				[ "sScrollY", "sY" ],
				[ "bScrollCollapse", "bCollapse" ]
			] );
			_fnMap( oSettings.oLanguage, oInit, "fnInfoCallback" );
			
			/* Callback functions which are array driven */
			_fnCallbackReg( oSettings, 'aoDrawCallback',       oInit.fnDrawCallback,      'user' );
			_fnCallbackReg( oSettings, 'aoServerParams',       oInit.fnServerParams,      'user' );
			_fnCallbackReg( oSettings, 'aoStateSaveParams',    oInit.fnStateSaveParams,   'user' );
			_fnCallbackReg( oSettings, 'aoStateLoadParams',    oInit.fnStateLoadParams,   'user' );
			_fnCallbackReg( oSettings, 'aoStateLoaded',        oInit.fnStateLoaded,       'user' );
			_fnCallbackReg( oSettings, 'aoRowCallback',        oInit.fnRowCallback,       'user' );
			_fnCallbackReg( oSettings, 'aoRowCreatedCallback', oInit.fnCreatedRow,        'user' );
			_fnCallbackReg( oSettings, 'aoHeaderCallback',     oInit.fnHeaderCallback,    'user' );
			_fnCallbackReg( oSettings, 'aoFooterCallback',     oInit.fnFooterCallback,    'user' );
			_fnCallbackReg( oSettings, 'aoInitComplete',       oInit.fnInitComplete,      'user' );
			_fnCallbackReg( oSettings, 'aoPreDrawCallback',    oInit.fnPreDrawCallback,   'user' );
			
			oSettings.rowIdFn = _fnGetObjectDataFn( oInit.rowId );
			
			/* Browser support detection */
			_fnBrowserDetect( oSettings );
			
			var oClasses = oSettings.oClasses;
			
			$.extend( oClasses, DataTable.ext.classes, oInit.oClasses );
			$this.addClass( oClasses.sTable );
			
			
			if ( oSettings.iInitDisplayStart === undefined )
			{
				/* Display start point, taking into account the save saving */
				oSettings.iInitDisplayStart = oInit.iDisplayStart;
				oSettings._iDisplayStart = oInit.iDisplayStart;
			}
			
			if ( oInit.iDeferLoading !== null )
			{
				oSettings.bDeferLoading = true;
				var tmp = Array.isArray( oInit.iDeferLoading );
				oSettings._iRecordsDisplay = tmp ? oInit.iDeferLoading[0] : oInit.iDeferLoading;
				oSettings._iRecordsTotal = tmp ? oInit.iDeferLoading[1] : oInit.iDeferLoading;
			}
			
			/* Language definitions */
			var oLanguage = oSettings.oLanguage;
			$.extend( true, oLanguage, oInit.oLanguage );
			
			if ( oLanguage.sUrl )
			{
				/* Get the language definitions from a file - because this Ajax call makes the language
				 * get async to the remainder of this function we use bInitHandedOff to indicate that
				 * _fnInitialise will be fired by the returned Ajax handler, rather than the constructor
				 */
				$.ajax( {
					dataType: 'json',
					url: oLanguage.sUrl,
					success: function ( json ) {
						_fnLanguageCompat( json );
						_fnCamelToHungarian( defaults.oLanguage, json );
						$.extend( true, oLanguage, json );
						_fnInitialise( oSettings );
					},
					error: function () {
						// Error occurred loading language file, continue on as best we can
						_fnInitialise( oSettings );
					}
				} );
				bInitHandedOff = true;
			}
			
			/*
			 * Stripes
			 */
			if ( oInit.asStripeClasses === null )
			{
				oSettings.asStripeClasses =[
					oClasses.sStripeOdd,
					oClasses.sStripeEven
				];
			}
			
			/* Remove row stripe classes if they are already on the table row */
			var stripeClasses = oSettings.asStripeClasses;
			var rowOne = $this.children('tbody').find('tr').eq(0);
			if ( $.inArray( true, $.map( stripeClasses, function(el, i) {
				return rowOne.hasClass(el);
			} ) ) !== -1 ) {
				$('tbody tr', this).removeClass( stripeClasses.join(' ') );
				oSettings.asDestroyStripes = stripeClasses.slice();
			}
			
			/*
			 * Columns
			 * See if we should load columns automatically or use defined ones
			 */
			var anThs = [];
			var aoColumnsInit;
			var nThead = this.getElementsByTagName('thead');
			if ( nThead.length !== 0 )
			{
				_fnDetectHeader( oSettings.aoHeader, nThead[0] );
				anThs = _fnGetUniqueThs( oSettings );
			}
			
			/* If not given a column array, generate one with nulls */
			if ( oInit.aoColumns === null )
			{
				aoColumnsInit = [];
				for ( i=0, iLen=anThs.length ; i<iLen ; i++ )
				{
					aoColumnsInit.push( null );
				}
			}
			else
			{
				aoColumnsInit = oInit.aoColumns;
			}
			
			/* Add the columns */
			for ( i=0, iLen=aoColumnsInit.length ; i<iLen ; i++ )
			{
				_fnAddColumn( oSettings, anThs ? anThs[i] : null );
			}
			
			/* Apply the column definitions */
			_fnApplyColumnDefs( oSettings, oInit.aoColumnDefs, aoColumnsInit, function (iCol, oDef) {
				_fnColumnOptions( oSettings, iCol, oDef );
			} );
			
			/* HTML5 attribute detection - build an mData object automatically if the
			 * attributes are found
			 */
			if ( rowOne.length ) {
				var a = function ( cell, name ) {
					return cell.getAttribute( 'data-'+name ) !== null ? name : null;
				};
			
				$( rowOne[0] ).children('th, td').each( function (i, cell) {
					var col = oSettings.aoColumns[i];
			
					if ( col.mData === i ) {
						var sort = a( cell, 'sort' ) || a( cell, 'order' );
						var filter = a( cell, 'filter' ) || a( cell, 'search' );
			
						if ( sort !== null || filter !== null ) {
							col.mData = {
								_:      i+'.display',
								sort:   sort !== null   ? i+'.@data-'+sort   : undefined,
								type:   sort !== null   ? i+'.@data-'+sort   : undefined,
								filter: filter !== null ? i+'.@data-'+filter : undefined
							};
			
							_fnColumnOptions( oSettings, i );
						}
					}
				} );
			}
			
			var features = oSettings.oFeatures;
			var loadedInit = function () {
				/*
				 * Sorting
				 * @todo For modularisation (1.11) this needs to do into a sort start up handler
				 */
			
				// If aaSorting is not defined, then we use the first indicator in asSorting
				// in case that has been altered, so the default sort reflects that option
				if ( oInit.aaSorting === undefined ) {
					var sorting = oSettings.aaSorting;
					for ( i=0, iLen=sorting.length ; i<iLen ; i++ ) {
						sorting[i][1] = oSettings.aoColumns[ i ].asSorting[0];
					}
				}
			
				/* Do a first pass on the sorting classes (allows any size changes to be taken into
				 * account, and also will apply sorting disabled classes if disabled
				 */
				_fnSortingClasses( oSettings );
			
				if ( features.bSort ) {
					_fnCallbackReg( oSettings, 'aoDrawCallback', function () {
						if ( oSettings.bSorted ) {
							var aSort = _fnSortFlatten( oSettings );
							var sortedColumns = {};
			
							$.each( aSort, function (i, val) {
								sortedColumns[ val.src ] = val.dir;
							} );
			
							_fnCallbackFire( oSettings, null, 'order', [oSettings, aSort, sortedColumns] );
							_fnSortAria( oSettings );
						}
					} );
				}
			
				_fnCallbackReg( oSettings, 'aoDrawCallback', function () {
					if ( oSettings.bSorted || _fnDataSource( oSettings ) === 'ssp' || features.bDeferRender ) {
						_fnSortingClasses( oSettings );
					}
				}, 'sc' );
			
			
				/*
				 * Final init
				 * Cache the header, body and footer as required, creating them if needed
				 */
			
				// Work around for Webkit bug 83867 - store the caption-side before removing from doc
				var captions = $this.children('caption').each( function () {
					this._captionSide = $(this).css('caption-side');
				} );
			
				var thead = $this.children('thead');
				if ( thead.length === 0 ) {
					thead = $('<thead/>').appendTo($this);
				}
				oSettings.nTHead = thead[0];
			
				var tbody = $this.children('tbody');
				if ( tbody.length === 0 ) {
					tbody = $('<tbody/>').appendTo($this);
				}
				oSettings.nTBody = tbody[0];
			
				var tfoot = $this.children('tfoot');
				if ( tfoot.length === 0 && captions.length > 0 && (oSettings.oScroll.sX !== "" || oSettings.oScroll.sY !== "") ) {
					// If we are a scrolling table, and no footer has been given, then we need to create
					// a tfoot element for the caption element to be appended to
					tfoot = $('<tfoot/>').appendTo($this);
				}
			
				if ( tfoot.length === 0 || tfoot.children().length === 0 ) {
					$this.addClass( oClasses.sNoFooter );
				}
				else if ( tfoot.length > 0 ) {
					oSettings.nTFoot = tfoot[0];
					_fnDetectHeader( oSettings.aoFooter, oSettings.nTFoot );
				}
			
				/* Check if there is data passing into the constructor */
				if ( oInit.aaData ) {
					for ( i=0 ; i<oInit.aaData.length ; i++ ) {
						_fnAddData( oSettings, oInit.aaData[ i ] );
					}
				}
				else if ( oSettings.bDeferLoading || _fnDataSource( oSettings ) == 'dom' ) {
					/* Grab the data from the page - only do this when deferred loading or no Ajax
					 * source since there is no point in reading the DOM data if we are then going
					 * to replace it with Ajax data
					 */
					_fnAddTr( oSettings, $(oSettings.nTBody).children('tr') );
				}
			
				/* Copy the data index array */
				oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
			
				/* Initialisation complete - table can be drawn */
				oSettings.bInitialised = true;
			
				/* Check if we need to initialise the table (it might not have been handed off to the
				 * language processor)
				 */
				if ( bInitHandedOff === false ) {
					_fnInitialise( oSettings );
				}
			};
			
			/* Must be done after everything which can be overridden by the state saving! */
			if ( oInit.bStateSave )
			{
				features.bStateSave = true;
				_fnCallbackReg( oSettings, 'aoDrawCallback', _fnSaveState, 'state_save' );
				_fnLoadState( oSettings, oInit, loadedInit );
			}
			else {
				loadedInit();
			}
			
		} );
		_that = null;
		return this;
	};

	
	/*
	 * It is useful to have variables which are scoped locally so only the
	 * DataTables functions can access them and they don't leak into global space.
	 * At the same time these functions are often useful over multiple files in the
	 * core and API, so we list, or at least document, all variables which are used
	 * by DataTables as private variables here. This also ensures that there is no
	 * clashing of variable names and that they can easily referenced for reuse.
	 */
	
	
	// Defined else where
	//  _selector_run
	//  _selector_opts
	//  _selector_first
	//  _selector_row_indexes
	
	var _ext; // DataTable.ext
	var _Api; // DataTable.Api
	var _api_register; // DataTable.Api.register
	var _api_registerPlural; // DataTable.Api.registerPlural
	
	var _re_dic = {};
	var _re_new_lines = /[\r\n\u2028]/g;
	var _re_html = /<.*?>/g;
	
	// This is not strict ISO8601 - Date.parse() is quite lax, although
	// implementations differ between browsers.
	var _re_date = /^\d{2,4}[\.\/\-]\d{1,2}[\.\/\-]\d{1,2}([T ]{1}\d{1,2}[:\.]\d{2}([\.:]\d{2})?)?$/;
	
	// Escape regular expression special characters
	var _re_escape_regex = new RegExp( '(\\' + [ '/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\', '$', '^', '-' ].join('|\\') + ')', 'g' );
	
	// http://en.wikipedia.org/wiki/Foreign_exchange_market
	// - \u20BD - Russian ruble.
	// - \u20a9 - South Korean Won
	// - \u20BA - Turkish Lira
	// - \u20B9 - Indian Rupee
	// - R - Brazil (R$) and South Africa
	// - fr - Swiss Franc
	// - kr - Swedish krona, Norwegian krone and Danish krone
	// - \u2009 is thin space and \u202F is narrow no-break space, both used in many
	// - Ƀ - Bitcoin
	// - Ξ - Ethereum
	//   standards as thousands separators.
	var _re_formatted_numeric = /['\u00A0,$£€¥%\u2009\u202F\u20BD\u20a9\u20BArfkɃΞ]/gi;
	
	
	var _empty = function ( d ) {
		return !d || d === true || d === '-' ? true : false;
	};
	
	
	var _intVal = function ( s ) {
		var integer = parseInt( s, 10 );
		return !isNaN(integer) && isFinite(s) ? integer : null;
	};
	
	// Convert from a formatted number with characters other than `.` as the
	// decimal place, to a Javascript number
	var _numToDecimal = function ( num, decimalPoint ) {
		// Cache created regular expressions for speed as this function is called often
		if ( ! _re_dic[ decimalPoint ] ) {
			_re_dic[ decimalPoint ] = new RegExp( _fnEscapeRegex( decimalPoint ), 'g' );
		}
		return typeof num === 'string' && decimalPoint !== '.' ?
			num.replace( /\./g, '' ).replace( _re_dic[ decimalPoint ], '.' ) :
			num;
	};
	
	
	var _isNumber = function ( d, decimalPoint, formatted ) {
		var strType = typeof d === 'string';
	
		// If empty return immediately so there must be a number if it is a
		// formatted string (this stops the string "k", or "kr", etc being detected
		// as a formatted number for currency
		if ( _empty( d ) ) {
			return true;
		}
	
		if ( decimalPoint && strType ) {
			d = _numToDecimal( d, decimalPoint );
		}
	
		if ( formatted && strType ) {
			d = d.replace( _re_formatted_numeric, '' );
		}
	
		return !isNaN( parseFloat(d) ) && isFinite( d );
	};
	
	
	// A string without HTML in it can be considered to be HTML still
	var _isHtml = function ( d ) {
		return _empty( d ) || typeof d === 'string';
	};
	
	
	var _htmlNumeric = function ( d, decimalPoint, formatted ) {
		if ( _empty( d ) ) {
			return true;
		}
	
		var html = _isHtml( d );
		return ! html ?
			null :
			_isNumber( _stripHtml( d ), decimalPoint, formatted ) ?
				true :
				null;
	};
	
	
	var _pluck = function ( a, prop, prop2 ) {
		var out = [];
		var i=0, ien=a.length;
	
		// Could have the test in the loop for slightly smaller code, but speed
		// is essential here
		if ( prop2 !== undefined ) {
			for ( ; i<ien ; i++ ) {
				if ( a[i] && a[i][ prop ] ) {
					out.push( a[i][ prop ][ prop2 ] );
				}
			}
		}
		else {
			for ( ; i<ien ; i++ ) {
				if ( a[i] ) {
					out.push( a[i][ prop ] );
				}
			}
		}
	
		return out;
	};
	
	
	// Basically the same as _pluck, but rather than looping over `a` we use `order`
	// as the indexes to pick from `a`
	var _pluck_order = function ( a, order, prop, prop2 )
	{
		var out = [];
		var i=0, ien=order.length;
	
		// Could have the test in the loop for slightly smaller code, but speed
		// is essential here
		if ( prop2 !== undefined ) {
			for ( ; i<ien ; i++ ) {
				if ( a[ order[i] ][ prop ] ) {
					out.push( a[ order[i] ][ prop ][ prop2 ] );
				}
			}
		}
		else {
			for ( ; i<ien ; i++ ) {
				out.push( a[ order[i] ][ prop ] );
			}
		}
	
		return out;
	};
	
	
	var _range = function ( len, start )
	{
		var out = [];
		var end;
	
		if ( start === undefined ) {
			start = 0;
			end = len;
		}
		else {
			end = start;
			start = len;
		}
	
		for ( var i=start ; i<end ; i++ ) {
			out.push( i );
		}
	
		return out;
	};
	
	
	var _removeEmpty = function ( a )
	{
		var out = [];
	
		for ( var i=0, ien=a.length ; i<ien ; i++ ) {
			if ( a[i] ) { // careful - will remove all falsy values!
				out.push( a[i] );
			}
		}
	
		return out;
	};
	
	
	var _stripHtml = function ( d ) {
		return d.replace( _re_html, '' );
	};
	
	
	/**
	 * Determine if all values in the array are unique. This means we can short
	 * cut the _unique method at the cost of a single loop. A sorted array is used
	 * to easily check the values.
	 *
	 * @param  {array} src Source array
	 * @return {boolean} true if all unique, false otherwise
	 * @ignore
	 */
	var _areAllUnique = function ( src ) {
		if ( src.length < 2 ) {
			return true;
		}
	
		var sorted = src.slice().sort();
		var last = sorted[0];
	
		for ( var i=1, ien=sorted.length ; i<ien ; i++ ) {
			if ( sorted[i] === last ) {
				return false;
			}
	
			last = sorted[i];
		}
	
		return true;
	};
	
	
	/**
	 * Find the unique elements in a source array.
	 *
	 * @param  {array} src Source array
	 * @return {array} Array of unique items
	 * @ignore
	 */
	var _unique = function ( src )
	{
		if ( _areAllUnique( src ) ) {
			return src.slice();
		}
	
		// A faster unique method is to use object keys to identify used values,
		// but this doesn't work with arrays or objects, which we must also
		// consider. See jsperf.com/compare-array-unique-versions/4 for more
		// information.
		var
			out = [],
			val,
			i, ien=src.length,
			j, k=0;
	
		again: for ( i=0 ; i<ien ; i++ ) {
			val = src[i];
	
			for ( j=0 ; j<k ; j++ ) {
				if ( out[j] === val ) {
					continue again;
				}
			}
	
			out.push( val );
			k++;
		}
	
		return out;
	};
	
	// Surprisingly this is faster than [].concat.apply
	// https://jsperf.com/flatten-an-array-loop-vs-reduce/2
	var _flatten = function (out, val) {
		if (Array.isArray(val)) {
			for (var i=0 ; i<val.length ; i++) {
				_flatten(out, val[i]);
			}
		}
		else {
			out.push(val);
		}
	  
		return out;
	}
	
	// Array.isArray polyfill.
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
	if (! Array.isArray) {
	    Array.isArray = function(arg) {
	        return Object.prototype.toString.call(arg) === '[object Array]';
	    };
	}
	
	// .trim() polyfill
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim
	if (!String.prototype.trim) {
	  String.prototype.trim = function () {
	    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
	  };
	}
	
	/**
	 * DataTables utility methods
	 * 
	 * This namespace provides helper methods that DataTables uses internally to
	 * create a DataTable, but which are not exclusively used only for DataTables.
	 * These methods can be used by extension authors to save the duplication of
	 * code.
	 *
	 *  @namespace
	 */
	DataTable.util = {
		/**
		 * Throttle the calls to a function. Arguments and context are maintained
		 * for the throttled function.
		 *
		 * @param {function} fn Function to be called
		 * @param {integer} freq Call frequency in mS
		 * @return {function} Wrapped function
		 */
		throttle: function ( fn, freq ) {
			var
				frequency = freq !== undefined ? freq : 200,
				last,
				timer;
	
			return function () {
				var
					that = this,
					now  = +new Date(),
					args = arguments;
	
				if ( last && now < last + frequency ) {
					clearTimeout( timer );
	
					timer = setTimeout( function () {
						last = undefined;
						fn.apply( that, args );
					}, frequency );
				}
				else {
					last = now;
					fn.apply( that, args );
				}
			};
		},
	
	
		/**
		 * Escape a string such that it can be used in a regular expression
		 *
		 *  @param {string} val string to escape
		 *  @returns {string} escaped string
		 */
		escapeRegex: function ( val ) {
			return val.replace( _re_escape_regex, '\\$1' );
		}
	};
	
	
	
	/**
	 * Create a mapping object that allows camel case parameters to be looked up
	 * for their Hungarian counterparts. The mapping is stored in a private
	 * parameter called `_hungarianMap` which can be accessed on the source object.
	 *  @param {object} o
	 *  @memberof DataTable#oApi
	 */
	function _fnHungarianMap ( o )
	{
		var
			hungarian = 'a aa ai ao as b fn i m o s ',
			match,
			newKey,
			map = {};
	
		$.each( o, function (key, val) {
			match = key.match(/^([^A-Z]+?)([A-Z])/);
	
			if ( match && hungarian.indexOf(match[1]+' ') !== -1 )
			{
				newKey = key.replace( match[0], match[2].toLowerCase() );
				map[ newKey ] = key;
	
				if ( match[1] === 'o' )
				{
					_fnHungarianMap( o[key] );
				}
			}
		} );
	
		o._hungarianMap = map;
	}
	
	
	/**
	 * Convert from camel case parameters to Hungarian, based on a Hungarian map
	 * created by _fnHungarianMap.
	 *  @param {object} src The model object which holds all parameters that can be
	 *    mapped.
	 *  @param {object} user The object to convert from camel case to Hungarian.
	 *  @param {boolean} force When set to `true`, properties which already have a
	 *    Hungarian value in the `user` object will be overwritten. Otherwise they
	 *    won't be.
	 *  @memberof DataTable#oApi
	 */
	function _fnCamelToHungarian ( src, user, force )
	{
		if ( ! src._hungarianMap ) {
			_fnHungarianMap( src );
		}
	
		var hungarianKey;
	
		$.each( user, function (key, val) {
			hungarianKey = src._hungarianMap[ key ];
	
			if ( hungarianKey !== undefined && (force || user[hungarianKey] === undefined) )
			{
				// For objects, we need to buzz down into the object to copy parameters
				if ( hungarianKey.charAt(0) === 'o' )
				{
					// Copy the camelCase options over to the hungarian
					if ( ! user[ hungarianKey ] ) {
						user[ hungarianKey ] = {};
					}
					$.extend( true, user[hungarianKey], user[key] );
	
					_fnCamelToHungarian( src[hungarianKey], user[hungarianKey], force );
				}
				else {
					user[hungarianKey] = user[ key ];
				}
			}
		} );
	}
	
	
	/**
	 * Language compatibility - when certain options are given, and others aren't, we
	 * need to duplicate the values over, in order to provide backwards compatibility
	 * with older language files.
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnLanguageCompat( lang )
	{
		// Note the use of the Hungarian notation for the parameters in this method as
		// this is called after the mapping of camelCase to Hungarian
		var defaults = DataTable.defaults.oLanguage;
	
		// Default mapping
		var defaultDecimal = defaults.sDecimal;
		if ( defaultDecimal ) {
			_addNumericSort( defaultDecimal );
		}
	
		if ( lang ) {
			var zeroRecords = lang.sZeroRecords;
	
			// Backwards compatibility - if there is no sEmptyTable given, then use the same as
			// sZeroRecords - assuming that is given.
			if ( ! lang.sEmptyTable && zeroRecords &&
				defaults.sEmptyTable === "No data available in table" )
			{
				_fnMap( lang, lang, 'sZeroRecords', 'sEmptyTable' );
			}
	
			// Likewise with loading records
			if ( ! lang.sLoadingRecords && zeroRecords &&
				defaults.sLoadingRecords === "Loading..." )
			{
				_fnMap( lang, lang, 'sZeroRecords', 'sLoadingRecords' );
			}
	
			// Old parameter name of the thousands separator mapped onto the new
			if ( lang.sInfoThousands ) {
				lang.sThousands = lang.sInfoThousands;
			}
	
			var decimal = lang.sDecimal;
			if ( decimal && defaultDecimal !== decimal ) {
				_addNumericSort( decimal );
			}
		}
	}
	
	
	/**
	 * Map one parameter onto another
	 *  @param {object} o Object to map
	 *  @param {*} knew The new parameter name
	 *  @param {*} old The old parameter name
	 */
	var _fnCompatMap = function ( o, knew, old ) {
		if ( o[ knew ] !== undefined ) {
			o[ old ] = o[ knew ];
		}
	};
	
	
	/**
	 * Provide backwards compatibility for the main DT options. Note that the new
	 * options are mapped onto the old parameters, so this is an external interface
	 * change only.
	 *  @param {object} init Object to map
	 */
	function _fnCompatOpts ( init )
	{
		_fnCompatMap( init, 'ordering',      'bSort' );
		_fnCompatMap( init, 'orderMulti',    'bSortMulti' );
		_fnCompatMap( init, 'orderClasses',  'bSortClasses' );
		_fnCompatMap( init, 'orderCellsTop', 'bSortCellsTop' );
		_fnCompatMap( init, 'order',         'aaSorting' );
		_fnCompatMap( init, 'orderFixed',    'aaSortingFixed' );
		_fnCompatMap( init, 'paging',        'bPaginate' );
		_fnCompatMap( init, 'pagingType',    'sPaginationType' );
		_fnCompatMap( init, 'pageLength',    'iDisplayLength' );
		_fnCompatMap( init, 'searching',     'bFilter' );
	
		// Boolean initialisation of x-scrolling
		if ( typeof init.sScrollX === 'boolean' ) {
			init.sScrollX = init.sScrollX ? '100%' : '';
		}
		if ( typeof init.scrollX === 'boolean' ) {
			init.scrollX = init.scrollX ? '100%' : '';
		}
	
		// Column search objects are in an array, so it needs to be converted
		// element by element
		var searchCols = init.aoSearchCols;
	
		if ( searchCols ) {
			for ( var i=0, ien=searchCols.length ; i<ien ; i++ ) {
				if ( searchCols[i] ) {
					_fnCamelToHungarian( DataTable.models.oSearch, searchCols[i] );
				}
			}
		}
	}
	
	
	/**
	 * Provide backwards compatibility for column options. Note that the new options
	 * are mapped onto the old parameters, so this is an external interface change
	 * only.
	 *  @param {object} init Object to map
	 */
	function _fnCompatCols ( init )
	{
		_fnCompatMap( init, 'orderable',     'bSortable' );
		_fnCompatMap( init, 'orderData',     'aDataSort' );
		_fnCompatMap( init, 'orderSequence', 'asSorting' );
		_fnCompatMap( init, 'orderDataType', 'sortDataType' );
	
		// orderData can be given as an integer
		var dataSort = init.aDataSort;
		if ( typeof dataSort === 'number' && ! Array.isArray( dataSort ) ) {
			init.aDataSort = [ dataSort ];
		}
	}
	
	
	/**
	 * Browser feature detection for capabilities, quirks
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnBrowserDetect( settings )
	{
		// We don't need to do this every time DataTables is constructed, the values
		// calculated are specific to the browser and OS configuration which we
		// don't expect to change between initialisations
		if ( ! DataTable.__browser ) {
			var browser = {};
			DataTable.__browser = browser;
	
			// Scrolling feature / quirks detection
			var n = $('<div/>')
				.css( {
					position: 'fixed',
					top: 0,
					left: $(window).scrollLeft()*-1, // allow for scrolling
					height: 1,
					width: 1,
					overflow: 'hidden'
				} )
				.append(
					$('<div/>')
						.css( {
							position: 'absolute',
							top: 1,
							left: 1,
							width: 100,
							overflow: 'scroll'
						} )
						.append(
							$('<div/>')
								.css( {
									width: '100%',
									height: 10
								} )
						)
				)
				.appendTo( 'body' );
	
			var outer = n.children();
			var inner = outer.children();
	
			// Numbers below, in order, are:
			// inner.offsetWidth, inner.clientWidth, outer.offsetWidth, outer.clientWidth
			//
			// IE6 XP:                           100 100 100  83
			// IE7 Vista:                        100 100 100  83
			// IE 8+ Windows:                     83  83 100  83
			// Evergreen Windows:                 83  83 100  83
			// Evergreen Mac with scrollbars:     85  85 100  85
			// Evergreen Mac without scrollbars: 100 100 100 100
	
			// Get scrollbar width
			browser.barWidth = outer[0].offsetWidth - outer[0].clientWidth;
	
			// IE6/7 will oversize a width 100% element inside a scrolling element, to
			// include the width of the scrollbar, while other browsers ensure the inner
			// element is contained without forcing scrolling
			browser.bScrollOversize = inner[0].offsetWidth === 100 && outer[0].clientWidth !== 100;
	
			// In rtl text layout, some browsers (most, but not all) will place the
			// scrollbar on the left, rather than the right.
			browser.bScrollbarLeft = Math.round( inner.offset().left ) !== 1;
	
			// IE8- don't provide height and width for getBoundingClientRect
			browser.bBounding = n[0].getBoundingClientRect().width ? true : false;
	
			n.remove();
		}
	
		$.extend( settings.oBrowser, DataTable.__browser );
		settings.oScroll.iBarWidth = DataTable.__browser.barWidth;
	}
	
	
	/**
	 * Array.prototype reduce[Right] method, used for browsers which don't support
	 * JS 1.6. Done this way to reduce code size, since we iterate either way
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnReduce ( that, fn, init, start, end, inc )
	{
		var
			i = start,
			value,
			isSet = false;
	
		if ( init !== undefined ) {
			value = init;
			isSet = true;
		}
	
		while ( i !== end ) {
			if ( ! that.hasOwnProperty(i) ) {
				continue;
			}
	
			value = isSet ?
				fn( value, that[i], i, that ) :
				that[i];
	
			isSet = true;
			i += inc;
		}
	
		return value;
	}
	
	/**
	 * Add a column to the list used for the table with default values
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} nTh The th element for this column
	 *  @memberof DataTable#oApi
	 */
	function _fnAddColumn( oSettings, nTh )
	{
		// Add column to aoColumns array
		var oDefaults = DataTable.defaults.column;
		var iCol = oSettings.aoColumns.length;
		var oCol = $.extend( {}, DataTable.models.oColumn, oDefaults, {
			"nTh": nTh ? nTh : document.createElement('th'),
			"sTitle":    oDefaults.sTitle    ? oDefaults.sTitle    : nTh ? nTh.innerHTML : '',
			"aDataSort": oDefaults.aDataSort ? oDefaults.aDataSort : [iCol],
			"mData": oDefaults.mData ? oDefaults.mData : iCol,
			idx: iCol
		} );
		oSettings.aoColumns.push( oCol );
	
		// Add search object for column specific search. Note that the `searchCols[ iCol ]`
		// passed into extend can be undefined. This allows the user to give a default
		// with only some of the parameters defined, and also not give a default
		var searchCols = oSettings.aoPreSearchCols;
		searchCols[ iCol ] = $.extend( {}, DataTable.models.oSearch, searchCols[ iCol ] );
	
		// Use the default column options function to initialise classes etc
		_fnColumnOptions( oSettings, iCol, $(nTh).data() );
	}
	
	
	/**
	 * Apply options for a column
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iCol column index to consider
	 *  @param {object} oOptions object with sType, bVisible and bSearchable etc
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnOptions( oSettings, iCol, oOptions )
	{
		var oCol = oSettings.aoColumns[ iCol ];
		var oClasses = oSettings.oClasses;
		var th = $(oCol.nTh);
	
		// Try to get width information from the DOM. We can't get it from CSS
		// as we'd need to parse the CSS stylesheet. `width` option can override
		if ( ! oCol.sWidthOrig ) {
			// Width attribute
			oCol.sWidthOrig = th.attr('width') || null;
	
			// Style attribute
			var t = (th.attr('style') || '').match(/width:\s*(\d+[pxem%]+)/);
			if ( t ) {
				oCol.sWidthOrig = t[1];
			}
		}
	
		/* User specified column options */
		if ( oOptions !== undefined && oOptions !== null )
		{
			// Backwards compatibility
			_fnCompatCols( oOptions );
	
			// Map camel case parameters to their Hungarian counterparts
			_fnCamelToHungarian( DataTable.defaults.column, oOptions, true );
	
			/* Backwards compatibility for mDataProp */
			if ( oOptions.mDataProp !== undefined && !oOptions.mData )
			{
				oOptions.mData = oOptions.mDataProp;
			}
	
			if ( oOptions.sType )
			{
				oCol._sManualType = oOptions.sType;
			}
	
			// `class` is a reserved word in Javascript, so we need to provide
			// the ability to use a valid name for the camel case input
			if ( oOptions.className && ! oOptions.sClass )
			{
				oOptions.sClass = oOptions.className;
			}
			if ( oOptions.sClass ) {
				th.addClass( oOptions.sClass );
			}
	
			$.extend( oCol, oOptions );
			_fnMap( oCol, oOptions, "sWidth", "sWidthOrig" );
	
			/* iDataSort to be applied (backwards compatibility), but aDataSort will take
			 * priority if defined
			 */
			if ( oOptions.iDataSort !== undefined )
			{
				oCol.aDataSort = [ oOptions.iDataSort ];
			}
			_fnMap( oCol, oOptions, "aDataSort" );
		}
	
		/* Cache the data get and set functions for speed */
		var mDataSrc = oCol.mData;
		var mData = _fnGetObjectDataFn( mDataSrc );
		var mRender = oCol.mRender ? _fnGetObjectDataFn( oCol.mRender ) : null;
	
		var attrTest = function( src ) {
			return typeof src === 'string' && src.indexOf('@') !== -1;
		};
		oCol._bAttrSrc = $.isPlainObject( mDataSrc ) && (
			attrTest(mDataSrc.sort) || attrTest(mDataSrc.type) || attrTest(mDataSrc.filter)
		);
		oCol._setter = null;
	
		oCol.fnGetData = function (rowData, type, meta) {
			var innerData = mData( rowData, type, undefined, meta );
	
			return mRender && type ?
				mRender( innerData, type, rowData, meta ) :
				innerData;
		};
		oCol.fnSetData = function ( rowData, val, meta ) {
			return _fnSetObjectDataFn( mDataSrc )( rowData, val, meta );
		};
	
		// Indicate if DataTables should read DOM data as an object or array
		// Used in _fnGetRowElements
		if ( typeof mDataSrc !== 'number' ) {
			oSettings._rowReadObject = true;
		}
	
		/* Feature sorting overrides column specific when off */
		if ( !oSettings.oFeatures.bSort )
		{
			oCol.bSortable = false;
			th.addClass( oClasses.sSortableNone ); // Have to add class here as order event isn't called
		}
	
		/* Check that the class assignment is correct for sorting */
		var bAsc = $.inArray('asc', oCol.asSorting) !== -1;
		var bDesc = $.inArray('desc', oCol.asSorting) !== -1;
		if ( !oCol.bSortable || (!bAsc && !bDesc) )
		{
			oCol.sSortingClass = oClasses.sSortableNone;
			oCol.sSortingClassJUI = "";
		}
		else if ( bAsc && !bDesc )
		{
			oCol.sSortingClass = oClasses.sSortableAsc;
			oCol.sSortingClassJUI = oClasses.sSortJUIAscAllowed;
		}
		else if ( !bAsc && bDesc )
		{
			oCol.sSortingClass = oClasses.sSortableDesc;
			oCol.sSortingClassJUI = oClasses.sSortJUIDescAllowed;
		}
		else
		{
			oCol.sSortingClass = oClasses.sSortable;
			oCol.sSortingClassJUI = oClasses.sSortJUI;
		}
	}
	
	
	/**
	 * Adjust the table column widths for new data. Note: you would probably want to
	 * do a redraw after calling this function!
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnAdjustColumnSizing ( settings )
	{
		/* Not interested in doing column width calculation if auto-width is disabled */
		if ( settings.oFeatures.bAutoWidth !== false )
		{
			var columns = settings.aoColumns;
	
			_fnCalculateColumnWidths( settings );
			for ( var i=0 , iLen=columns.length ; i<iLen ; i++ )
			{
				columns[i].nTh.style.width = columns[i].sWidth;
			}
		}
	
		var scroll = settings.oScroll;
		if ( scroll.sY !== '' || scroll.sX !== '')
		{
			_fnScrollDraw( settings );
		}
	
		_fnCallbackFire( settings, null, 'column-sizing', [settings] );
	}
	
	
	/**
	 * Covert the index of a visible column to the index in the data array (take account
	 * of hidden columns)
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iMatch Visible column index to lookup
	 *  @returns {int} i the data index
	 *  @memberof DataTable#oApi
	 */
	function _fnVisibleToColumnIndex( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );
	
		return typeof aiVis[iMatch] === 'number' ?
			aiVis[iMatch] :
			null;
	}
	
	
	/**
	 * Covert the index of an index in the data array and convert it to the visible
	 *   column index (take account of hidden columns)
	 *  @param {int} iMatch Column index to lookup
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {int} i the data index
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnIndexToVisible( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );
		var iPos = $.inArray( iMatch, aiVis );
	
		return iPos !== -1 ? iPos : null;
	}
	
	
	/**
	 * Get the number of visible columns
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {int} i the number of visible columns
	 *  @memberof DataTable#oApi
	 */
	function _fnVisbleColumns( oSettings )
	{
		var vis = 0;
	
		// No reduce in IE8, use a loop for now
		$.each( oSettings.aoColumns, function ( i, col ) {
			if ( col.bVisible && $(col.nTh).css('display') !== 'none' ) {
				vis++;
			}
		} );
	
		return vis;
	}
	
	
	/**
	 * Get an array of column indexes that match a given property
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sParam Parameter in aoColumns to look for - typically
	 *    bVisible or bSearchable
	 *  @returns {array} Array of indexes with matched properties
	 *  @memberof DataTable#oApi
	 */
	function _fnGetColumns( oSettings, sParam )
	{
		var a = [];
	
		$.map( oSettings.aoColumns, function(val, i) {
			if ( val[sParam] ) {
				a.push( i );
			}
		} );
	
		return a;
	}
	
	
	/**
	 * Calculate the 'type' of a column
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnTypes ( settings )
	{
		var columns = settings.aoColumns;
		var data = settings.aoData;
		var types = DataTable.ext.type.detect;
		var i, ien, j, jen, k, ken;
		var col, cell, detectedType, cache;
	
		// For each column, spin over the 
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			col = columns[i];
			cache = [];
	
			if ( ! col.sType && col._sManualType ) {
				col.sType = col._sManualType;
			}
			else if ( ! col.sType ) {
				for ( j=0, jen=types.length ; j<jen ; j++ ) {
					for ( k=0, ken=data.length ; k<ken ; k++ ) {
						// Use a cache array so we only need to get the type data
						// from the formatter once (when using multiple detectors)
						if ( cache[k] === undefined ) {
							cache[k] = _fnGetCellData( settings, k, i, 'type' );
						}
	
						detectedType = types[j]( cache[k], settings );
	
						// If null, then this type can't apply to this column, so
						// rather than testing all cells, break out. There is an
						// exception for the last type which is `html`. We need to
						// scan all rows since it is possible to mix string and HTML
						// types
						if ( ! detectedType && j !== types.length-1 ) {
							break;
						}
	
						// Only a single match is needed for html type since it is
						// bottom of the pile and very similar to string
						if ( detectedType === 'html' ) {
							break;
						}
					}
	
					// Type is valid for all data points in the column - use this
					// type
					if ( detectedType ) {
						col.sType = detectedType;
						break;
					}
				}
	
				// Fall back - if no type was detected, always use string
				if ( ! col.sType ) {
					col.sType = 'string';
				}
			}
		}
	}
	
	
	/**
	 * Take the column definitions and static columns arrays and calculate how
	 * they relate to column indexes. The callback function will then apply the
	 * definition found for a column to a suitable configuration object.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {array} aoColDefs The aoColumnDefs array that is to be applied
	 *  @param {array} aoCols The aoColumns array that defines columns individually
	 *  @param {function} fn Callback function - takes two parameters, the calculated
	 *    column index and the definition for that column.
	 *  @memberof DataTable#oApi
	 */
	function _fnApplyColumnDefs( oSettings, aoColDefs, aoCols, fn )
	{
		var i, iLen, j, jLen, k, kLen, def;
		var columns = oSettings.aoColumns;
	
		// Column definitions with aTargets
		if ( aoColDefs )
		{
			/* Loop over the definitions array - loop in reverse so first instance has priority */
			for ( i=aoColDefs.length-1 ; i>=0 ; i-- )
			{
				def = aoColDefs[i];
	
				/* Each definition can target multiple columns, as it is an array */
				var aTargets = def.targets !== undefined ?
					def.targets :
					def.aTargets;
	
				if ( ! Array.isArray( aTargets ) )
				{
					aTargets = [ aTargets ];
				}
	
				for ( j=0, jLen=aTargets.length ; j<jLen ; j++ )
				{
					if ( typeof aTargets[j] === 'number' && aTargets[j] >= 0 )
					{
						/* Add columns that we don't yet know about */
						while( columns.length <= aTargets[j] )
						{
							_fnAddColumn( oSettings );
						}
	
						/* Integer, basic index */
						fn( aTargets[j], def );
					}
					else if ( typeof aTargets[j] === 'number' && aTargets[j] < 0 )
					{
						/* Negative integer, right to left column counting */
						fn( columns.length+aTargets[j], def );
					}
					else if ( typeof aTargets[j] === 'string' )
					{
						/* Class name matching on TH element */
						for ( k=0, kLen=columns.length ; k<kLen ; k++ )
						{
							if ( aTargets[j] == "_all" ||
							     $(columns[k].nTh).hasClass( aTargets[j] ) )
							{
								fn( k, def );
							}
						}
					}
				}
			}
		}
	
		// Statically defined columns array
		if ( aoCols )
		{
			for ( i=0, iLen=aoCols.length ; i<iLen ; i++ )
			{
				fn( i, aoCols[i] );
			}
		}
	}
	
	/**
	 * Add a data array to the table, creating DOM node etc. This is the parallel to
	 * _fnGatherData, but for adding rows from a Javascript source, rather than a
	 * DOM source.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {array} aData data array to be added
	 *  @param {node} [nTr] TR element to add to the table - optional. If not given,
	 *    DataTables will create a row automatically
	 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
	 *    if nTr is.
	 *  @returns {int} >=0 if successful (index of new aoData entry), -1 if failed
	 *  @memberof DataTable#oApi
	 */
	function _fnAddData ( oSettings, aDataIn, nTr, anTds )
	{
		/* Create the object for storing information about this new row */
		var iRow = oSettings.aoData.length;
		var oData = $.extend( true, {}, DataTable.models.oRow, {
			src: nTr ? 'dom' : 'data',
			idx: iRow
		} );
	
		oData._aData = aDataIn;
		oSettings.aoData.push( oData );
	
		/* Create the cells */
		var nTd, sThisType;
		var columns = oSettings.aoColumns;
	
		// Invalidate the column types as the new data needs to be revalidated
		for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
		{
			columns[i].sType = null;
		}
	
		/* Add to the display array */
		oSettings.aiDisplayMaster.push( iRow );
	
		var id = oSettings.rowIdFn( aDataIn );
		if ( id !== undefined ) {
			oSettings.aIds[ id ] = oData;
		}
	
		/* Create the DOM information, or register it if already present */
		if ( nTr || ! oSettings.oFeatures.bDeferRender )
		{
			_fnCreateTr( oSettings, iRow, nTr, anTds );
		}
	
		return iRow;
	}
	
	
	/**
	 * Add one or more TR elements to the table. Generally we'd expect to
	 * use this for reading data from a DOM sourced table, but it could be
	 * used for an TR element. Note that if a TR is given, it is used (i.e.
	 * it is not cloned).
	 *  @param {object} settings dataTables settings object
	 *  @param {array|node|jQuery} trs The TR element(s) to add to the table
	 *  @returns {array} Array of indexes for the added rows
	 *  @memberof DataTable#oApi
	 */
	function _fnAddTr( settings, trs )
	{
		var row;
	
		// Allow an individual node to be passed in
		if ( ! (trs instanceof $) ) {
			trs = $(trs);
		}
	
		return trs.map( function (i, el) {
			row = _fnGetRowElements( settings, el );
			return _fnAddData( settings, row.data, el, row.cells );
		} );
	}
	
	
	/**
	 * Take a TR element and convert it to an index in aoData
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} n the TR element to find
	 *  @returns {int} index if the node is found, null if not
	 *  @memberof DataTable#oApi
	 */
	function _fnNodeToDataIndex( oSettings, n )
	{
		return (n._DT_RowIndex!==undefined) ? n._DT_RowIndex : null;
	}
	
	
	/**
	 * Take a TD element and convert it into a column data index (not the visible index)
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iRow The row number the TD/TH can be found in
	 *  @param {node} n The TD/TH element to find
	 *  @returns {int} index if the node is found, -1 if not
	 *  @memberof DataTable#oApi
	 */
	function _fnNodeToColumnIndex( oSettings, iRow, n )
	{
		return $.inArray( n, oSettings.aoData[ iRow ].anCells );
	}
	
	
	/**
	 * Get the data for a given cell from the internal cache, taking into account data mapping
	 *  @param {object} settings dataTables settings object
	 *  @param {int} rowIdx aoData row id
	 *  @param {int} colIdx Column index
	 *  @param {string} type data get type ('display', 'type' 'filter' 'sort')
	 *  @returns {*} Cell data
	 *  @memberof DataTable#oApi
	 */
	function _fnGetCellData( settings, rowIdx, colIdx, type )
	{
		var draw           = settings.iDraw;
		var col            = settings.aoColumns[colIdx];
		var rowData        = settings.aoData[rowIdx]._aData;
		var defaultContent = col.sDefaultContent;
		var cellData       = col.fnGetData( rowData, type, {
			settings: settings,
			row:      rowIdx,
			col:      colIdx
		} );
	
		if ( cellData === undefined ) {
			if ( settings.iDrawError != draw && defaultContent === null ) {
				_fnLog( settings, 0, "Requested unknown parameter "+
					(typeof col.mData=='function' ? '{function}' : "'"+col.mData+"'")+
					" for row "+rowIdx+", column "+colIdx, 4 );
				settings.iDrawError = draw;
			}
			return defaultContent;
		}
	
		// When the data source is null and a specific data type is requested (i.e.
		// not the original data), we can use default column data
		if ( (cellData === rowData || cellData === null) && defaultContent !== null && type !== undefined ) {
			cellData = defaultContent;
		}
		else if ( typeof cellData === 'function' ) {
			// If the data source is a function, then we run it and use the return,
			// executing in the scope of the data object (for instances)
			return cellData.call( rowData );
		}
	
		if ( cellData === null && type == 'display' ) {
			return '';
		}
		return cellData;
	}
	
	
	/**
	 * Set the value for a specific cell, into the internal data cache
	 *  @param {object} settings dataTables settings object
	 *  @param {int} rowIdx aoData row id
	 *  @param {int} colIdx Column index
	 *  @param {*} val Value to set
	 *  @memberof DataTable#oApi
	 */
	function _fnSetCellData( settings, rowIdx, colIdx, val )
	{
		var col     = settings.aoColumns[colIdx];
		var rowData = settings.aoData[rowIdx]._aData;
	
		col.fnSetData( rowData, val, {
			settings: settings,
			row:      rowIdx,
			col:      colIdx
		}  );
	}
	
	
	// Private variable that is used to match action syntax in the data property object
	var __reArray = /\[.*?\]$/;
	var __reFn = /\(\)$/;
	
	/**
	 * Split string on periods, taking into account escaped periods
	 * @param  {string} str String to split
	 * @return {array} Split string
	 */
	function _fnSplitObjNotation( str )
	{
		return $.map( str.match(/(\\.|[^\.])+/g) || [''], function ( s ) {
			return s.replace(/\\\./g, '.');
		} );
	}
	
	
	/**
	 * Return a function that can be used to get data from a source object, taking
	 * into account the ability to use nested objects as a source
	 *  @param {string|int|function} mSource The data source for the object
	 *  @returns {function} Data get function
	 *  @memberof DataTable#oApi
	 */
	function _fnGetObjectDataFn( mSource )
	{
		if ( $.isPlainObject( mSource ) )
		{
			/* Build an object of get functions, and wrap them in a single call */
			var o = {};
			$.each( mSource, function (key, val) {
				if ( val ) {
					o[key] = _fnGetObjectDataFn( val );
				}
			} );
	
			return function (data, type, row, meta) {
				var t = o[type] || o._;
				return t !== undefined ?
					t(data, type, row, meta) :
					data;
			};
		}
		else if ( mSource === null )
		{
			/* Give an empty string for rendering / sorting etc */
			return function (data) { // type, row and meta also passed, but not used
				return data;
			};
		}
		else if ( typeof mSource === 'function' )
		{
			return function (data, type, row, meta) {
				return mSource( data, type, row, meta );
			};
		}
		else if ( typeof mSource === 'string' && (mSource.indexOf('.') !== -1 ||
			      mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1) )
		{
			/* If there is a . in the source string then the data source is in a
			 * nested object so we loop over the data for each level to get the next
			 * level down. On each loop we test for undefined, and if found immediately
			 * return. This allows entire objects to be missing and sDefaultContent to
			 * be used if defined, rather than throwing an error
			 */
			var fetchData = function (data, type, src) {
				var arrayNotation, funcNotation, out, innerSrc;
	
				if ( src !== "" )
				{
					var a = _fnSplitObjNotation( src );
	
					for ( var i=0, iLen=a.length ; i<iLen ; i++ )
					{
						// Check if we are dealing with special notation
						arrayNotation = a[i].match(__reArray);
						funcNotation = a[i].match(__reFn);
	
						if ( arrayNotation )
						{
							// Array notation
							a[i] = a[i].replace(__reArray, '');
	
							// Condition allows simply [] to be passed in
							if ( a[i] !== "" ) {
								data = data[ a[i] ];
							}
							out = [];
	
							// Get the remainder of the nested object to get
							a.splice( 0, i+1 );
							innerSrc = a.join('.');
	
							// Traverse each entry in the array getting the properties requested
							if ( Array.isArray( data ) ) {
								for ( var j=0, jLen=data.length ; j<jLen ; j++ ) {
									out.push( fetchData( data[j], type, innerSrc ) );
								}
							}
	
							// If a string is given in between the array notation indicators, that
							// is used to join the strings together, otherwise an array is returned
							var join = arrayNotation[0].substring(1, arrayNotation[0].length-1);
							data = (join==="") ? out : out.join(join);
	
							// The inner call to fetchData has already traversed through the remainder
							// of the source requested, so we exit from the loop
							break;
						}
						else if ( funcNotation )
						{
							// Function call
							a[i] = a[i].replace(__reFn, '');
							data = data[ a[i] ]();
							continue;
						}
	
						if ( data === null || data[ a[i] ] === undefined )
						{
							return undefined;
						}
						data = data[ a[i] ];
					}
				}
	
				return data;
			};
	
			return function (data, type) { // row and meta also passed, but not used
				return fetchData( data, type, mSource );
			};
		}
		else
		{
			/* Array or flat object mapping */
			return function (data, type) { // row and meta also passed, but not used
				return data[mSource];
			};
		}
	}
	
	
	/**
	 * Return a function that can be used to set data from a source object, taking
	 * into account the ability to use nested objects as a source
	 *  @param {string|int|function} mSource The data source for the object
	 *  @returns {function} Data set function
	 *  @memberof DataTable#oApi
	 */
	function _fnSetObjectDataFn( mSource )
	{
		if ( $.isPlainObject( mSource ) )
		{
			/* Unlike get, only the underscore (global) option is used for for
			 * setting data since we don't know the type here. This is why an object
			 * option is not documented for `mData` (which is read/write), but it is
			 * for `mRender` which is read only.
			 */
			return _fnSetObjectDataFn( mSource._ );
		}
		else if ( mSource === null )
		{
			/* Nothing to do when the data source is null */
			return function () {};
		}
		else if ( typeof mSource === 'function' )
		{
			return function (data, val, meta) {
				mSource( data, 'set', val, meta );
			};
		}
		else if ( typeof mSource === 'string' && (mSource.indexOf('.') !== -1 ||
			      mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1) )
		{
			/* Like the get, we need to get data from a nested object */
			var setData = function (data, val, src) {
				var a = _fnSplitObjNotation( src ), b;
				var aLast = a[a.length-1];
				var arrayNotation, funcNotation, o, innerSrc;
	
				for ( var i=0, iLen=a.length-1 ; i<iLen ; i++ )
				{
					// Protect against prototype pollution
					if (a[i] === '__proto__') {
						throw new Error('Cannot set prototype values');
					}
	
					// Check if we are dealing with an array notation request
					arrayNotation = a[i].match(__reArray);
					funcNotation = a[i].match(__reFn);
	
					if ( arrayNotation )
					{
						a[i] = a[i].replace(__reArray, '');
						data[ a[i] ] = [];
	
						// Get the remainder of the nested object to set so we can recurse
						b = a.slice();
						b.splice( 0, i+1 );
						innerSrc = b.join('.');
	
						// Traverse each entry in the array setting the properties requested
						if ( Array.isArray( val ) )
						{
							for ( var j=0, jLen=val.length ; j<jLen ; j++ )
							{
								o = {};
								setData( o, val[j], innerSrc );
								data[ a[i] ].push( o );
							}
						}
						else
						{
							// We've been asked to save data to an array, but it
							// isn't array data to be saved. Best that can be done
							// is to just save the value.
							data[ a[i] ] = val;
						}
	
						// The inner call to setData has already traversed through the remainder
						// of the source and has set the data, thus we can exit here
						return;
					}
					else if ( funcNotation )
					{
						// Function call
						a[i] = a[i].replace(__reFn, '');
						data = data[ a[i] ]( val );
					}
	
					// If the nested object doesn't currently exist - since we are
					// trying to set the value - create it
					if ( data[ a[i] ] === null || data[ a[i] ] === undefined )
					{
						data[ a[i] ] = {};
					}
					data = data[ a[i] ];
				}
	
				// Last item in the input - i.e, the actual set
				if ( aLast.match(__reFn ) )
				{
					// Function call
					data = data[ aLast.replace(__reFn, '') ]( val );
				}
				else
				{
					// If array notation is used, we just want to strip it and use the property name
					// and assign the value. If it isn't used, then we get the result we want anyway
					data[ aLast.replace(__reArray, '') ] = val;
				}
			};
	
			return function (data, val) { // meta is also passed in, but not used
				return setData( data, val, mSource );
			};
		}
		else
		{
			/* Array or flat object mapping */
			return function (data, val) { // meta is also passed in, but not used
				data[mSource] = val;
			};
		}
	}
	
	
	/**
	 * Return an array with the full table data
	 *  @param {object} oSettings dataTables settings object
	 *  @returns array {array} aData Master data array
	 *  @memberof DataTable#oApi
	 */
	function _fnGetDataMaster ( settings )
	{
		return _pluck( settings.aoData, '_aData' );
	}
	
	
	/**
	 * Nuke the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnClearTable( settings )
	{
		settings.aoData.length = 0;
		settings.aiDisplayMaster.length = 0;
		settings.aiDisplay.length = 0;
		settings.aIds = {};
	}
	
	
	 /**
	 * Take an array of integers (index array) and remove a target integer (value - not
	 * the key!)
	 *  @param {array} a Index array to target
	 *  @param {int} iTarget value to find
	 *  @memberof DataTable#oApi
	 */
	function _fnDeleteIndex( a, iTarget, splice )
	{
		var iTargetIndex = -1;
	
		for ( var i=0, iLen=a.length ; i<iLen ; i++ )
		{
			if ( a[i] == iTarget )
			{
				iTargetIndex = i;
			}
			else if ( a[i] > iTarget )
			{
				a[i]--;
			}
		}
	
		if ( iTargetIndex != -1 && splice === undefined )
		{
			a.splice( iTargetIndex, 1 );
		}
	}
	
	
	/**
	 * Mark cached data as invalid such that a re-read of the data will occur when
	 * the cached data is next requested. Also update from the data source object.
	 *
	 * @param {object} settings DataTables settings object
	 * @param {int}    rowIdx   Row index to invalidate
	 * @param {string} [src]    Source to invalidate from: undefined, 'auto', 'dom'
	 *     or 'data'
	 * @param {int}    [colIdx] Column index to invalidate. If undefined the whole
	 *     row will be invalidated
	 * @memberof DataTable#oApi
	 *
	 * @todo For the modularisation of v1.11 this will need to become a callback, so
	 *   the sort and filter methods can subscribe to it. That will required
	 *   initialisation options for sorting, which is why it is not already baked in
	 */
	function _fnInvalidate( settings, rowIdx, src, colIdx )
	{
		var row = settings.aoData[ rowIdx ];
		var i, ien;
		var cellWrite = function ( cell, col ) {
			// This is very frustrating, but in IE if you just write directly
			// to innerHTML, and elements that are overwritten are GC'ed,
			// even if there is a reference to them elsewhere
			while ( cell.childNodes.length ) {
				cell.removeChild( cell.firstChild );
			}
	
			cell.innerHTML = _fnGetCellData( settings, rowIdx, col, 'display' );
		};
	
		// Are we reading last data from DOM or the data object?
		if ( src === 'dom' || ((! src || src === 'auto') && row.src === 'dom') ) {
			// Read the data from the DOM
			row._aData = _fnGetRowElements(
					settings, row, colIdx, colIdx === undefined ? undefined : row._aData
				)
				.data;
		}
		else {
			// Reading from data object, update the DOM
			var cells = row.anCells;
	
			if ( cells ) {
				if ( colIdx !== undefined ) {
					cellWrite( cells[colIdx], colIdx );
				}
				else {
					for ( i=0, ien=cells.length ; i<ien ; i++ ) {
						cellWrite( cells[i], i );
					}
				}
			}
		}
	
		// For both row and cell invalidation, the cached data for sorting and
		// filtering is nulled out
		row._aSortData = null;
		row._aFilterData = null;
	
		// Invalidate the type for a specific column (if given) or all columns since
		// the data might have changed
		var cols = settings.aoColumns;
		if ( colIdx !== undefined ) {
			cols[ colIdx ].sType = null;
		}
		else {
			for ( i=0, ien=cols.length ; i<ien ; i++ ) {
				cols[i].sType = null;
			}
	
			// Update DataTables special `DT_*` attributes for the row
			_fnRowAttributes( settings, row );
		}
	}
	
	
	/**
	 * Build a data source object from an HTML row, reading the contents of the
	 * cells that are in the row.
	 *
	 * @param {object} settings DataTables settings object
	 * @param {node|object} TR element from which to read data or existing row
	 *   object from which to re-read the data from the cells
	 * @param {int} [colIdx] Optional column index
	 * @param {array|object} [d] Data source object. If `colIdx` is given then this
	 *   parameter should also be given and will be used to write the data into.
	 *   Only the column in question will be written
	 * @returns {object} Object with two parameters: `data` the data read, in
	 *   document order, and `cells` and array of nodes (they can be useful to the
	 *   caller, so rather than needing a second traversal to get them, just return
	 *   them from here).
	 * @memberof DataTable#oApi
	 */
	function _fnGetRowElements( settings, row, colIdx, d )
	{
		var
			tds = [],
			td = row.firstChild,
			name, col, o, i=0, contents,
			columns = settings.aoColumns,
			objectRead = settings._rowReadObject;
	
		// Allow the data object to be passed in, or construct
		d = d !== undefined ?
			d :
			objectRead ?
				{} :
				[];
	
		var attr = function ( str, td  ) {
			if ( typeof str === 'string' ) {
				var idx = str.indexOf('@');
	
				if ( idx !== -1 ) {
					var attr = str.substring( idx+1 );
					var setter = _fnSetObjectDataFn( str );
					setter( d, td.getAttribute( attr ) );
				}
			}
		};
	
		// Read data from a cell and store into the data object
		var cellProcess = function ( cell ) {
			if ( colIdx === undefined || colIdx === i ) {
				col = columns[i];
				contents = (cell.innerHTML).trim();
	
				if ( col && col._bAttrSrc ) {
					var setter = _fnSetObjectDataFn( col.mData._ );
					setter( d, contents );
	
					attr( col.mData.sort, cell );
					attr( col.mData.type, cell );
					attr( col.mData.filter, cell );
				}
				else {
					// Depending on the `data` option for the columns the data can
					// be read to either an object or an array.
					if ( objectRead ) {
						if ( ! col._setter ) {
							// Cache the setter function
							col._setter = _fnSetObjectDataFn( col.mData );
						}
						col._setter( d, contents );
					}
					else {
						d[i] = contents;
					}
				}
			}
	
			i++;
		};
	
		if ( td ) {
			// `tr` element was passed in
			while ( td ) {
				name = td.nodeName.toUpperCase();
	
				if ( name == "TD" || name == "TH" ) {
					cellProcess( td );
					tds.push( td );
				}
	
				td = td.nextSibling;
			}
		}
		else {
			// Existing row object passed in
			tds = row.anCells;
	
			for ( var j=0, jen=tds.length ; j<jen ; j++ ) {
				cellProcess( tds[j] );
			}
		}
	
		// Read the ID from the DOM if present
		var rowNode = row.firstChild ? row : row.nTr;
	
		if ( rowNode ) {
			var id = rowNode.getAttribute( 'id' );
	
			if ( id ) {
				_fnSetObjectDataFn( settings.rowId )( d, id );
			}
		}
	
		return {
			data: d,
			cells: tds
		};
	}
	/**
	 * Create a new TR element (and it's TD children) for a row
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iRow Row to consider
	 *  @param {node} [nTrIn] TR element to add to the table - optional. If not given,
	 *    DataTables will create a row automatically
	 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
	 *    if nTr is.
	 *  @memberof DataTable#oApi
	 */
	function _fnCreateTr ( oSettings, iRow, nTrIn, anTds )
	{
		var
			row = oSettings.aoData[iRow],
			rowData = row._aData,
			cells = [],
			nTr, nTd, oCol,
			i, iLen, create;
	
		if ( row.nTr === null )
		{
			nTr = nTrIn || document.createElement('tr');
	
			row.nTr = nTr;
			row.anCells = cells;
	
			/* Use a private property on the node to allow reserve mapping from the node
			 * to the aoData array for fast look up
			 */
			nTr._DT_RowIndex = iRow;
	
			/* Special parameters can be given by the data source to be used on the row */
			_fnRowAttributes( oSettings, row );
	
			/* Process each column */
			for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
			{
				oCol = oSettings.aoColumns[i];
				create = nTrIn ? false : true;
	
				nTd = create ? document.createElement( oCol.sCellType ) : anTds[i];
				nTd._DT_CellIndex = {
					row: iRow,
					column: i
				};
				
				cells.push( nTd );
	
				// Need to create the HTML if new, or if a rendering function is defined
				if ( create || ((!nTrIn || oCol.mRender || oCol.mData !== i) &&
					 (!$.isPlainObject(oCol.mData) || oCol.mData._ !== i+'.display')
				)) {
					nTd.innerHTML = _fnGetCellData( oSettings, iRow, i, 'display' );
				}
	
				/* Add user defined class */
				if ( oCol.sClass )
				{
					nTd.className += ' '+oCol.sClass;
				}
	
				// Visibility - add or remove as required
				if ( oCol.bVisible && ! nTrIn )
				{
					nTr.appendChild( nTd );
				}
				else if ( ! oCol.bVisible && nTrIn )
				{
					nTd.parentNode.removeChild( nTd );
				}
	
				if ( oCol.fnCreatedCell )
				{
					oCol.fnCreatedCell.call( oSettings.oInstance,
						nTd, _fnGetCellData( oSettings, iRow, i ), rowData, iRow, i
					);
				}
			}
	
			_fnCallbackFire( oSettings, 'aoRowCreatedCallback', null, [nTr, rowData, iRow, cells] );
		}
	
		// Remove once webkit bug 131819 and Chromium bug 365619 have been resolved
		// and deployed
		row.nTr.setAttribute( 'role', 'row' );
	}
	
	
	/**
	 * Add attributes to a row based on the special `DT_*` parameters in a data
	 * source object.
	 *  @param {object} settings DataTables settings object
	 *  @param {object} DataTables row object for the row to be modified
	 *  @memberof DataTable#oApi
	 */
	function _fnRowAttributes( settings, row )
	{
		var tr = row.nTr;
		var data = row._aData;
	
		if ( tr ) {
			var id = settings.rowIdFn( data );
	
			if ( id ) {
				tr.id = id;
			}
	
			if ( data.DT_RowClass ) {
				// Remove any classes added by DT_RowClass before
				var a = data.DT_RowClass.split(' ');
				row.__rowc = row.__rowc ?
					_unique( row.__rowc.concat( a ) ) :
					a;
	
				$(tr)
					.removeClass( row.__rowc.join(' ') )
					.addClass( data.DT_RowClass );
			}
	
			if ( data.DT_RowAttr ) {
				$(tr).attr( data.DT_RowAttr );
			}
	
			if ( data.DT_RowData ) {
				$(tr).data( data.DT_RowData );
			}
		}
	}
	
	
	/**
	 * Create the HTML header for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnBuildHead( oSettings )
	{
		var i, ien, cell, row, column;
		var thead = oSettings.nTHead;
		var tfoot = oSettings.nTFoot;
		var createHeader = $('th, td', thead).length === 0;
		var classes = oSettings.oClasses;
		var columns = oSettings.aoColumns;
	
		if ( createHeader ) {
			row = $('<tr/>').appendTo( thead );
		}
	
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			column = columns[i];
			cell = $( column.nTh ).addClass( column.sClass );
	
			if ( createHeader ) {
				cell.appendTo( row );
			}
	
			// 1.11 move into sorting
			if ( oSettings.oFeatures.bSort ) {
				cell.addClass( column.sSortingClass );
	
				if ( column.bSortable !== false ) {
					cell
						.attr( 'tabindex', oSettings.iTabIndex )
						.attr( 'aria-controls', oSettings.sTableId );
	
					_fnSortAttachListener( oSettings, column.nTh, i );
				}
			}
	
			if ( column.sTitle != cell[0].innerHTML ) {
				cell.html( column.sTitle );
			}
	
			_fnRenderer( oSettings, 'header' )(
				oSettings, cell, column, classes
			);
		}
	
		if ( createHeader ) {
			_fnDetectHeader( oSettings.aoHeader, thead );
		}
		
		/* ARIA role for the rows */
		$(thead).children('tr').attr('role', 'row');
	
		/* Deal with the footer - add classes if required */
		$(thead).children('tr').children('th, td').addClass( classes.sHeaderTH );
		$(tfoot).children('tr').children('th, td').addClass( classes.sFooterTH );
	
		// Cache the footer cells. Note that we only take the cells from the first
		// row in the footer. If there is more than one row the user wants to
		// interact with, they need to use the table().foot() method. Note also this
		// allows cells to be used for multiple columns using colspan
		if ( tfoot !== null ) {
			var cells = oSettings.aoFooter[0];
	
			for ( i=0, ien=cells.length ; i<ien ; i++ ) {
				column = columns[i];
				column.nTf = cells[i].cell;
	
				if ( column.sClass ) {
					$(column.nTf).addClass( column.sClass );
				}
			}
		}
	}
	
	
	/**
	 * Draw the header (or footer) element based on the column visibility states. The
	 * methodology here is to use the layout array from _fnDetectHeader, modified for
	 * the instantaneous column visibility, to construct the new layout. The grid is
	 * traversed over cell at a time in a rows x columns grid fashion, although each
	 * cell insert can cover multiple elements in the grid - which is tracks using the
	 * aApplied array. Cell inserts in the grid will only occur where there isn't
	 * already a cell in that position.
	 *  @param {object} oSettings dataTables settings object
	 *  @param array {objects} aoSource Layout array from _fnDetectHeader
	 *  @param {boolean} [bIncludeHidden=false] If true then include the hidden columns in the calc,
	 *  @memberof DataTable#oApi
	 */
	function _fnDrawHead( oSettings, aoSource, bIncludeHidden )
	{
		var i, iLen, j, jLen, k, kLen, n, nLocalTr;
		var aoLocal = [];
		var aApplied = [];
		var iColumns = oSettings.aoColumns.length;
		var iRowspan, iColspan;
	
		if ( ! aoSource )
		{
			return;
		}
	
		if (  bIncludeHidden === undefined )
		{
			bIncludeHidden = false;
		}
	
		/* Make a copy of the master layout array, but without the visible columns in it */
		for ( i=0, iLen=aoSource.length ; i<iLen ; i++ )
		{
			aoLocal[i] = aoSource[i].slice();
			aoLocal[i].nTr = aoSource[i].nTr;
	
			/* Remove any columns which are currently hidden */
			for ( j=iColumns-1 ; j>=0 ; j-- )
			{
				if ( !oSettings.aoColumns[j].bVisible && !bIncludeHidden )
				{
					aoLocal[i].splice( j, 1 );
				}
			}
	
			/* Prep the applied array - it needs an element for each row */
			aApplied.push( [] );
		}
	
		for ( i=0, iLen=aoLocal.length ; i<iLen ; i++ )
		{
			nLocalTr = aoLocal[i].nTr;
	
			/* All cells are going to be replaced, so empty out the row */
			if ( nLocalTr )
			{
				while( (n = nLocalTr.firstChild) )
				{
					nLocalTr.removeChild( n );
				}
			}
	
			for ( j=0, jLen=aoLocal[i].length ; j<jLen ; j++ )
			{
				iRowspan = 1;
				iColspan = 1;
	
				/* Check to see if there is already a cell (row/colspan) covering our target
				 * insert point. If there is, then there is nothing to do.
				 */
				if ( aApplied[i][j] === undefined )
				{
					nLocalTr.appendChild( aoLocal[i][j].cell );
					aApplied[i][j] = 1;
	
					/* Expand the cell to cover as many rows as needed */
					while ( aoLocal[i+iRowspan] !== undefined &&
					        aoLocal[i][j].cell == aoLocal[i+iRowspan][j].cell )
					{
						aApplied[i+iRowspan][j] = 1;
						iRowspan++;
					}
	
					/* Expand the cell to cover as many columns as needed */
					while ( aoLocal[i][j+iColspan] !== undefined &&
					        aoLocal[i][j].cell == aoLocal[i][j+iColspan].cell )
					{
						/* Must update the applied array over the rows for the columns */
						for ( k=0 ; k<iRowspan ; k++ )
						{
							aApplied[i+k][j+iColspan] = 1;
						}
						iColspan++;
					}
	
					/* Do the actual expansion in the DOM */
					$(aoLocal[i][j].cell)
						.attr('rowspan', iRowspan)
						.attr('colspan', iColspan);
				}
			}
		}
	}
	
	
	/**
	 * Insert the required TR nodes into the table for display
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnDraw( oSettings )
	{
		/* Provide a pre-callback function which can be used to cancel the draw is false is returned */
		var aPreDraw = _fnCallbackFire( oSettings, 'aoPreDrawCallback', 'preDraw', [oSettings] );
		if ( $.inArray( false, aPreDraw ) !== -1 )
		{
			_fnProcessingDisplay( oSettings, false );
			return;
		}
	
		var i, iLen, n;
		var anRows = [];
		var iRowCount = 0;
		var asStripeClasses = oSettings.asStripeClasses;
		var iStripes = asStripeClasses.length;
		var iOpenRows = oSettings.aoOpenRows.length;
		var oLang = oSettings.oLanguage;
		var iInitDisplayStart = oSettings.iInitDisplayStart;
		var bServerSide = _fnDataSource( oSettings ) == 'ssp';
		var aiDisplay = oSettings.aiDisplay;
	
		oSettings.bDrawing = true;
	
		/* Check and see if we have an initial draw position from state saving */
		if ( iInitDisplayStart !== undefined && iInitDisplayStart !== -1 )
		{
			oSettings._iDisplayStart = bServerSide ?
				iInitDisplayStart :
				iInitDisplayStart >= oSettings.fnRecordsDisplay() ?
					0 :
					iInitDisplayStart;
	
			oSettings.iInitDisplayStart = -1;
		}
	
		var iDisplayStart = oSettings._iDisplayStart;
		var iDisplayEnd = oSettings.fnDisplayEnd();
	
		/* Server-side processing draw intercept */
		if ( oSettings.bDeferLoading )
		{
			oSettings.bDeferLoading = false;
			oSettings.iDraw++;
			_fnProcessingDisplay( oSettings, false );
		}
		else if ( !bServerSide )
		{
			oSettings.iDraw++;
		}
		else if ( !oSettings.bDestroying && !_fnAjaxUpdate( oSettings ) )
		{
			return;
		}
	
		if ( aiDisplay.length !== 0 )
		{
			var iStart = bServerSide ? 0 : iDisplayStart;
			var iEnd = bServerSide ? oSettings.aoData.length : iDisplayEnd;
	
			for ( var j=iStart ; j<iEnd ; j++ )
			{
				var iDataIndex = aiDisplay[j];
				var aoData = oSettings.aoData[ iDataIndex ];
				if ( aoData.nTr === null )
				{
					_fnCreateTr( oSettings, iDataIndex );
				}
	
				var nRow = aoData.nTr;
	
				/* Remove the old striping classes and then add the new one */
				if ( iStripes !== 0 )
				{
					var sStripe = asStripeClasses[ iRowCount % iStripes ];
					if ( aoData._sRowStripe != sStripe )
					{
						$(nRow).removeClass( aoData._sRowStripe ).addClass( sStripe );
						aoData._sRowStripe = sStripe;
					}
				}
	
				// Row callback functions - might want to manipulate the row
				// iRowCount and j are not currently documented. Are they at all
				// useful?
				_fnCallbackFire( oSettings, 'aoRowCallback', null,
					[nRow, aoData._aData, iRowCount, j, iDataIndex] );
	
				anRows.push( nRow );
				iRowCount++;
			}
		}
		else
		{
			/* Table is empty - create a row with an empty message in it */
			var sZero = oLang.sZeroRecords;
			if ( oSettings.iDraw == 1 &&  _fnDataSource( oSettings ) == 'ajax' )
			{
				sZero = oLang.sLoadingRecords;
			}
			else if ( oLang.sEmptyTable && oSettings.fnRecordsTotal() === 0 )
			{
				sZero = oLang.sEmptyTable;
			}
	
			anRows[ 0 ] = $( '<tr/>', { 'class': iStripes ? asStripeClasses[0] : '' } )
				.append( $('<td />', {
					'valign':  'top',
					'colSpan': _fnVisbleColumns( oSettings ),
					'class':   oSettings.oClasses.sRowEmpty
				} ).html( sZero ) )[0];
		}
	
		/* Header and footer callbacks */
		_fnCallbackFire( oSettings, 'aoHeaderCallback', 'header', [ $(oSettings.nTHead).children('tr')[0],
			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
	
		_fnCallbackFire( oSettings, 'aoFooterCallback', 'footer', [ $(oSettings.nTFoot).children('tr')[0],
			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
	
		var body = $(oSettings.nTBody);
	
		body.children().detach();
		body.append( $(anRows) );
	
		/* Call all required callback functions for the end of a draw */
		_fnCallbackFire( oSettings, 'aoDrawCallback', 'draw', [oSettings] );
	
		/* Draw is complete, sorting and filtering must be as well */
		oSettings.bSorted = false;
		oSettings.bFiltered = false;
		oSettings.bDrawing = false;
	}
	
	
	/**
	 * Redraw the table - taking account of the various features which are enabled
	 *  @param {object} oSettings dataTables settings object
	 *  @param {boolean} [holdPosition] Keep the current paging position. By default
	 *    the paging is reset to the first page
	 *  @memberof DataTable#oApi
	 */
	function _fnReDraw( settings, holdPosition )
	{
		var
			features = settings.oFeatures,
			sort     = features.bSort,
			filter   = features.bFilter;
	
		if ( sort ) {
			_fnSort( settings );
		}
	
		if ( filter ) {
			_fnFilterComplete( settings, settings.oPreviousSearch );
		}
		else {
			// No filtering, so we want to just use the display master
			settings.aiDisplay = settings.aiDisplayMaster.slice();
		}
	
		if ( holdPosition !== true ) {
			settings._iDisplayStart = 0;
		}
	
		// Let any modules know about the draw hold position state (used by
		// scrolling internally)
		settings._drawHold = holdPosition;
	
		_fnDraw( settings );
	
		settings._drawHold = false;
	}
	
	
	/**
	 * Add the options to the page HTML for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnAddOptionsHtml ( oSettings )
	{
		var classes = oSettings.oClasses;
		var table = $(oSettings.nTable);
		var holding = $('<div/>').insertBefore( table ); // Holding element for speed
		var features = oSettings.oFeatures;
	
		// All DataTables are wrapped in a div
		var insert = $('<div/>', {
			id:      oSettings.sTableId+'_wrapper',
			'class': classes.sWrapper + (oSettings.nTFoot ? '' : ' '+classes.sNoFooter)
		} );
	
		oSettings.nHolding = holding[0];
		oSettings.nTableWrapper = insert[0];
		oSettings.nTableReinsertBefore = oSettings.nTable.nextSibling;
	
		/* Loop over the user set positioning and place the elements as needed */
		var aDom = oSettings.sDom.split('');
		var featureNode, cOption, nNewNode, cNext, sAttr, j;
		for ( var i=0 ; i<aDom.length ; i++ )
		{
			featureNode = null;
			cOption = aDom[i];
	
			if ( cOption == '<' )
			{
				/* New container div */
				nNewNode = $('<div/>')[0];
	
				/* Check to see if we should append an id and/or a class name to the container */
				cNext = aDom[i+1];
				if ( cNext == "'" || cNext == '"' )
				{
					sAttr = "";
					j = 2;
					while ( aDom[i+j] != cNext )
					{
						sAttr += aDom[i+j];
						j++;
					}
	
					/* Replace jQuery UI constants @todo depreciated */
					if ( sAttr == "H" )
					{
						sAttr = classes.sJUIHeader;
					}
					else if ( sAttr == "F" )
					{
						sAttr = classes.sJUIFooter;
					}
	
					/* The attribute can be in the format of "#id.class", "#id" or "class" This logic
					 * breaks the string into parts and applies them as needed
					 */
					if ( sAttr.indexOf('.') != -1 )
					{
						var aSplit = sAttr.split('.');
						nNewNode.id = aSplit[0].substr(1, aSplit[0].length-1);
						nNewNode.className = aSplit[1];
					}
					else if ( sAttr.charAt(0) == "#" )
					{
						nNewNode.id = sAttr.substr(1, sAttr.length-1);
					}
					else
					{
						nNewNode.className = sAttr;
					}
	
					i += j; /* Move along the position array */
				}
	
				insert.append( nNewNode );
				insert = $(nNewNode);
			}
			else if ( cOption == '>' )
			{
				/* End container div */
				insert = insert.parent();
			}
			// @todo Move options into their own plugins?
			else if ( cOption == 'l' && features.bPaginate && features.bLengthChange )
			{
				/* Length */
				featureNode = _fnFeatureHtmlLength( oSettings );
			}
			else if ( cOption == 'f' && features.bFilter )
			{
				/* Filter */
				featureNode = _fnFeatureHtmlFilter( oSettings );
			}
			else if ( cOption == 'r' && features.bProcessing )
			{
				/* pRocessing */
				featureNode = _fnFeatureHtmlProcessing( oSettings );
			}
			else if ( cOption == 't' )
			{
				/* Table */
				featureNode = _fnFeatureHtmlTable( oSettings );
			}
			else if ( cOption ==  'i' && features.bInfo )
			{
				/* Info */
				featureNode = _fnFeatureHtmlInfo( oSettings );
			}
			else if ( cOption == 'p' && features.bPaginate )
			{
				/* Pagination */
				featureNode = _fnFeatureHtmlPaginate( oSettings );
			}
			else if ( DataTable.ext.feature.length !== 0 )
			{
				/* Plug-in features */
				var aoFeatures = DataTable.ext.feature;
				for ( var k=0, kLen=aoFeatures.length ; k<kLen ; k++ )
				{
					if ( cOption == aoFeatures[k].cFeature )
					{
						featureNode = aoFeatures[k].fnInit( oSettings );
						break;
					}
				}
			}
	
			/* Add to the 2D features array */
			if ( featureNode )
			{
				var aanFeatures = oSettings.aanFeatures;
	
				if ( ! aanFeatures[cOption] )
				{
					aanFeatures[cOption] = [];
				}
	
				aanFeatures[cOption].push( featureNode );
				insert.append( featureNode );
			}
		}
	
		/* Built our DOM structure - replace the holding div with what we want */
		holding.replaceWith( insert );
		oSettings.nHolding = null;
	}
	
	
	/**
	 * Use the DOM source to create up an array of header cells. The idea here is to
	 * create a layout grid (array) of rows x columns, which contains a reference
	 * to the cell that that point in the grid (regardless of col/rowspan), such that
	 * any column / row could be removed and the new grid constructed
	 *  @param array {object} aLayout Array to store the calculated layout in
	 *  @param {node} nThead The header/footer element for the table
	 *  @memberof DataTable#oApi
	 */
	function _fnDetectHeader ( aLayout, nThead )
	{
		var nTrs = $(nThead).children('tr');
		var nTr, nCell;
		var i, k, l, iLen, jLen, iColShifted, iColumn, iColspan, iRowspan;
		var bUnique;
		var fnShiftCol = function ( a, i, j ) {
			var k = a[i];
	                while ( k[j] ) {
				j++;
			}
			return j;
		};
	
		aLayout.splice( 0, aLayout.length );
	
		/* We know how many rows there are in the layout - so prep it */
		for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
		{
			aLayout.push( [] );
		}
	
		/* Calculate a layout array */
		for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
		{
			nTr = nTrs[i];
			iColumn = 0;
	
			/* For every cell in the row... */
			nCell = nTr.firstChild;
			while ( nCell ) {
				if ( nCell.nodeName.toUpperCase() == "TD" ||
				     nCell.nodeName.toUpperCase() == "TH" )
				{
					/* Get the col and rowspan attributes from the DOM and sanitise them */
					iColspan = nCell.getAttribute('colspan') * 1;
					iRowspan = nCell.getAttribute('rowspan') * 1;
					iColspan = (!iColspan || iColspan===0 || iColspan===1) ? 1 : iColspan;
					iRowspan = (!iRowspan || iRowspan===0 || iRowspan===1) ? 1 : iRowspan;
	
					/* There might be colspan cells already in this row, so shift our target
					 * accordingly
					 */
					iColShifted = fnShiftCol( aLayout, i, iColumn );
	
					/* Cache calculation for unique columns */
					bUnique = iColspan === 1 ? true : false;
	
					/* If there is col / rowspan, copy the information into the layout grid */
					for ( l=0 ; l<iColspan ; l++ )
					{
						for ( k=0 ; k<iRowspan ; k++ )
						{
							aLayout[i+k][iColShifted+l] = {
								"cell": nCell,
								"unique": bUnique
							};
							aLayout[i+k].nTr = nTr;
						}
					}
				}
				nCell = nCell.nextSibling;
			}
		}
	}
	
	
	/**
	 * Get an array of unique th elements, one for each column
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} nHeader automatically detect the layout from this node - optional
	 *  @param {array} aLayout thead/tfoot layout from _fnDetectHeader - optional
	 *  @returns array {node} aReturn list of unique th's
	 *  @memberof DataTable#oApi
	 */
	function _fnGetUniqueThs ( oSettings, nHeader, aLayout )
	{
		var aReturn = [];
		if ( !aLayout )
		{
			aLayout = oSettings.aoHeader;
			if ( nHeader )
			{
				aLayout = [];
				_fnDetectHeader( aLayout, nHeader );
			}
		}
	
		for ( var i=0, iLen=aLayout.length ; i<iLen ; i++ )
		{
			for ( var j=0, jLen=aLayout[i].length ; j<jLen ; j++ )
			{
				if ( aLayout[i][j].unique &&
					 (!aReturn[j] || !oSettings.bSortCellsTop) )
				{
					aReturn[j] = aLayout[i][j].cell;
				}
			}
		}
	
		return aReturn;
	}
	
	/**
	 * Create an Ajax call based on the table's settings, taking into account that
	 * parameters can have multiple forms, and backwards compatibility.
	 *
	 * @param {object} oSettings dataTables settings object
	 * @param {array} data Data to send to the server, required by
	 *     DataTables - may be augmented by developer callbacks
	 * @param {function} fn Callback function to run when data is obtained
	 */
	function _fnBuildAjax( oSettings, data, fn )
	{
		// Compatibility with 1.9-, allow fnServerData and event to manipulate
		_fnCallbackFire( oSettings, 'aoServerParams', 'serverParams', [data] );
	
		// Convert to object based for 1.10+ if using the old array scheme which can
		// come from server-side processing or serverParams
		if ( data && Array.isArray(data) ) {
			var tmp = {};
			var rbracket = /(.*?)\[\]$/;
	
			$.each( data, function (key, val) {
				var match = val.name.match(rbracket);
	
				if ( match ) {
					// Support for arrays
					var name = match[0];
	
					if ( ! tmp[ name ] ) {
						tmp[ name ] = [];
					}
					tmp[ name ].push( val.value );
				}
				else {
					tmp[val.name] = val.value;
				}
			} );
			data = tmp;
		}
	
		var ajaxData;
		var ajax = oSettings.ajax;
		var instance = oSettings.oInstance;
		var callback = function ( json ) {
			_fnCallbackFire( oSettings, null, 'xhr', [oSettings, json, oSettings.jqXHR] );
			fn( json );
		};
	
		if ( $.isPlainObject( ajax ) && ajax.data )
		{
			ajaxData = ajax.data;
	
			var newData = typeof ajaxData === 'function' ?
				ajaxData( data, oSettings ) :  // fn can manipulate data or return
				ajaxData;                      // an object object or array to merge
	
			// If the function returned something, use that alone
			data = typeof ajaxData === 'function' && newData ?
				newData :
				$.extend( true, data, newData );
	
			// Remove the data property as we've resolved it already and don't want
			// jQuery to do it again (it is restored at the end of the function)
			delete ajax.data;
		}
	
		var baseAjax = {
			"data": data,
			"success": function (json) {
				var error = json.error || json.sError;
				if ( error ) {
					_fnLog( oSettings, 0, error );
				}
	
				oSettings.json = json;
				callback( json );
			},
			"dataType": "json",
			"cache": false,
			"type": oSettings.sServerMethod,
			"error": function (xhr, error, thrown) {
				var ret = _fnCallbackFire( oSettings, null, 'xhr', [oSettings, null, oSettings.jqXHR] );
	
				if ( $.inArray( true, ret ) === -1 ) {
					if ( error == "parsererror" ) {
						_fnLog( oSettings, 0, 'Invalid JSON response', 1 );
					}
					else if ( xhr.readyState === 4 ) {
						_fnLog( oSettings, 0, 'Ajax error', 7 );
					}
				}
	
				_fnProcessingDisplay( oSettings, false );
			}
		};
	
		// Store the data submitted for the API
		oSettings.oAjaxData = data;
	
		// Allow plug-ins and external processes to modify the data
		_fnCallbackFire( oSettings, null, 'preXhr', [oSettings, data] );
	
		if ( oSettings.fnServerData )
		{
			// DataTables 1.9- compatibility
			oSettings.fnServerData.call( instance,
				oSettings.sAjaxSource,
				$.map( data, function (val, key) { // Need to convert back to 1.9 trad format
					return { name: key, value: val };
				} ),
				callback,
				oSettings
			);
		}
		else if ( oSettings.sAjaxSource || typeof ajax === 'string' )
		{
			// DataTables 1.9- compatibility
			oSettings.jqXHR = $.ajax( $.extend( baseAjax, {
				url: ajax || oSettings.sAjaxSource
			} ) );
		}
		else if ( typeof ajax === 'function' )
		{
			// Is a function - let the caller define what needs to be done
			oSettings.jqXHR = ajax.call( instance, data, callback, oSettings );
		}
		else
		{
			// Object to extend the base settings
			oSettings.jqXHR = $.ajax( $.extend( baseAjax, ajax ) );
	
			// Restore for next time around
			ajax.data = ajaxData;
		}
	}
	
	
	/**
	 * Update the table using an Ajax call
	 *  @param {object} settings dataTables settings object
	 *  @returns {boolean} Block the table drawing or not
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxUpdate( settings )
	{
		if ( settings.bAjaxDataGet ) {
			settings.iDraw++;
			_fnProcessingDisplay( settings, true );
	
			_fnBuildAjax(
				settings,
				_fnAjaxParameters( settings ),
				function(json) {
					_fnAjaxUpdateDraw( settings, json );
				}
			);
	
			return false;
		}
		return true;
	}
	
	
	/**
	 * Build up the parameters in an object needed for a server-side processing
	 * request. Note that this is basically done twice, is different ways - a modern
	 * method which is used by default in DataTables 1.10 which uses objects and
	 * arrays, or the 1.9- method with is name / value pairs. 1.9 method is used if
	 * the sAjaxSource option is used in the initialisation, or the legacyAjax
	 * option is set.
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {bool} block the table drawing or not
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxParameters( settings )
	{
		var
			columns = settings.aoColumns,
			columnCount = columns.length,
			features = settings.oFeatures,
			preSearch = settings.oPreviousSearch,
			preColSearch = settings.aoPreSearchCols,
			i, data = [], dataProp, column, columnSearch,
			sort = _fnSortFlatten( settings ),
			displayStart = settings._iDisplayStart,
			displayLength = features.bPaginate !== false ?
				settings._iDisplayLength :
				-1;
	
		var param = function ( name, value ) {
			data.push( { 'name': name, 'value': value } );
		};
	
		// DataTables 1.9- compatible method
		param( 'sEcho',          settings.iDraw );
		param( 'iColumns',       columnCount );
		param( 'sColumns',       _pluck( columns, 'sName' ).join(',') );
		param( 'iDisplayStart',  displayStart );
		param( 'iDisplayLength', displayLength );
	
		// DataTables 1.10+ method
		var d = {
			draw:    settings.iDraw,
			columns: [],
			order:   [],
			start:   displayStart,
			length:  displayLength,
			search:  {
				value: preSearch.sSearch,
				regex: preSearch.bRegex
			}
		};
	
		for ( i=0 ; i<columnCount ; i++ ) {
			column = columns[i];
			columnSearch = preColSearch[i];
			dataProp = typeof column.mData=="function" ? 'function' : column.mData ;
	
			d.columns.push( {
				data:       dataProp,
				name:       column.sName,
				searchable: column.bSearchable,
				orderable:  column.bSortable,
				search:     {
					value: columnSearch.sSearch,
					regex: columnSearch.bRegex
				}
			} );
	
			param( "mDataProp_"+i, dataProp );
	
			if ( features.bFilter ) {
				param( 'sSearch_'+i,     columnSearch.sSearch );
				param( 'bRegex_'+i,      columnSearch.bRegex );
				param( 'bSearchable_'+i, column.bSearchable );
			}
	
			if ( features.bSort ) {
				param( 'bSortable_'+i, column.bSortable );
			}
		}
	
		if ( features.bFilter ) {
			param( 'sSearch', preSearch.sSearch );
			param( 'bRegex', preSearch.bRegex );
		}
	
		if ( features.bSort ) {
			$.each( sort, function ( i, val ) {
				d.order.push( { column: val.col, dir: val.dir } );
	
				param( 'iSortCol_'+i, val.col );
				param( 'sSortDir_'+i, val.dir );
			} );
	
			param( 'iSortingCols', sort.length );
		}
	
		// If the legacy.ajax parameter is null, then we automatically decide which
		// form to use, based on sAjaxSource
		var legacy = DataTable.ext.legacy.ajax;
		if ( legacy === null ) {
			return settings.sAjaxSource ? data : d;
		}
	
		// Otherwise, if legacy has been specified then we use that to decide on the
		// form
		return legacy ? data : d;
	}
	
	
	/**
	 * Data the data from the server (nuking the old) and redraw the table
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} json json data return from the server.
	 *  @param {string} json.sEcho Tracking flag for DataTables to match requests
	 *  @param {int} json.iTotalRecords Number of records in the data set, not accounting for filtering
	 *  @param {int} json.iTotalDisplayRecords Number of records in the data set, accounting for filtering
	 *  @param {array} json.aaData The data to display on this page
	 *  @param {string} [json.sColumns] Column ordering (sName, comma separated)
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxUpdateDraw ( settings, json )
	{
		// v1.10 uses camelCase variables, while 1.9 uses Hungarian notation.
		// Support both
		var compat = function ( old, modern ) {
			return json[old] !== undefined ? json[old] : json[modern];
		};
	
		var data = _fnAjaxDataSrc( settings, json );
		var draw            = compat( 'sEcho',                'draw' );
		var recordsTotal    = compat( 'iTotalRecords',        'recordsTotal' );
		var recordsFiltered = compat( 'iTotalDisplayRecords', 'recordsFiltered' );
	
		if ( draw !== undefined ) {
			// Protect against out of sequence returns
			if ( draw*1 < settings.iDraw ) {
				return;
			}
			settings.iDraw = draw * 1;
		}
	
		_fnClearTable( settings );
		settings._iRecordsTotal   = parseInt(recordsTotal, 10);
		settings._iRecordsDisplay = parseInt(recordsFiltered, 10);
	
		for ( var i=0, ien=data.length ; i<ien ; i++ ) {
			_fnAddData( settings, data[i] );
		}
		settings.aiDisplay = settings.aiDisplayMaster.slice();
	
		settings.bAjaxDataGet = false;
		_fnDraw( settings );
	
		if ( ! settings._bInitComplete ) {
			_fnInitComplete( settings, json );
		}
	
		settings.bAjaxDataGet = true;
		_fnProcessingDisplay( settings, false );
	}
	
	
	/**
	 * Get the data from the JSON data source to use for drawing a table. Using
	 * `_fnGetObjectDataFn` allows the data to be sourced from a property of the
	 * source object, or from a processing function.
	 *  @param {object} oSettings dataTables settings object
	 *  @param  {object} json Data source object / array from the server
	 *  @return {array} Array of data to use
	 */
	function _fnAjaxDataSrc ( oSettings, json )
	{
		var dataSrc = $.isPlainObject( oSettings.ajax ) && oSettings.ajax.dataSrc !== undefined ?
			oSettings.ajax.dataSrc :
			oSettings.sAjaxDataProp; // Compatibility with 1.9-.
	
		// Compatibility with 1.9-. In order to read from aaData, check if the
		// default has been changed, if not, check for aaData
		if ( dataSrc === 'data' ) {
			return json.aaData || json[dataSrc];
		}
	
		return dataSrc !== "" ?
			_fnGetObjectDataFn( dataSrc )( json ) :
			json;
	}
	
	/**
	 * Generate the node required for filtering text
	 *  @returns {node} Filter control element
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlFilter ( settings )
	{
		var classes = settings.oClasses;
		var tableId = settings.sTableId;
		var language = settings.oLanguage;
		var previousSearch = settings.oPreviousSearch;
		var features = settings.aanFeatures;
		var input = '<input type="search" class="'+classes.sFilterInput+'"/>';
	
		var str = language.sSearch;
		str = str.match(/_INPUT_/) ?
			str.replace('_INPUT_', input) :
			str+input;
	
		var filter = $('<div/>', {
				'id': ! features.f ? tableId+'_filter' : null,
				'class': classes.sFilter
			} )
			.append( $('<label/>' ).append( str ) );
	
		var searchFn = function() {
			/* Update all other filter input elements for the new display */
			var n = features.f;
			var val = !this.value ? "" : this.value; // mental IE8 fix :-(
	
			/* Now do the filter */
			if ( val != previousSearch.sSearch ) {
				_fnFilterComplete( settings, {
					"sSearch": val,
					"bRegex": previousSearch.bRegex,
					"bSmart": previousSearch.bSmart ,
					"bCaseInsensitive": previousSearch.bCaseInsensitive
				} );
	
				// Need to redraw, without resorting
				settings._iDisplayStart = 0;
				_fnDraw( settings );
			}
		};
	
		var searchDelay = settings.searchDelay !== null ?
			settings.searchDelay :
			_fnDataSource( settings ) === 'ssp' ?
				400 :
				0;
	
		var jqFilter = $('input', filter)
			.val( previousSearch.sSearch )
			.attr( 'placeholder', language.sSearchPlaceholder )
			.on(
				'keyup.DT search.DT input.DT paste.DT cut.DT',
				searchDelay ?
					_fnThrottle( searchFn, searchDelay ) :
					searchFn
			)
			.on( 'mouseup', function(e) {
				// Edge fix! Edge 17 does not trigger anything other than mouse events when clicking
				// on the clear icon (Edge bug 17584515). This is safe in other browsers as `searchFn`
				// checks the value to see if it has changed. In other browsers it won't have.
				setTimeout( function () {
					searchFn.call(jqFilter[0]);
				}, 10);
			} )
			.on( 'keypress.DT', function(e) {
				/* Prevent form submission */
				if ( e.keyCode == 13 ) {
					return false;
				}
			} )
			.attr('aria-controls', tableId);
	
		// Update the input elements whenever the table is filtered
		$(settings.nTable).on( 'search.dt.DT', function ( ev, s ) {
			if ( settings === s ) {
				// IE9 throws an 'unknown error' if document.activeElement is used
				// inside an iframe or frame...
				try {
					if ( jqFilter[0] !== document.activeElement ) {
						jqFilter.val( previousSearch.sSearch );
					}
				}
				catch ( e ) {}
			}
		} );
	
		return filter[0];
	}
	
	
	/**
	 * Filter the table using both the global filter and column based filtering
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} oSearch search information
	 *  @param {int} [iForce] force a research of the master array (1) or not (undefined or 0)
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterComplete ( oSettings, oInput, iForce )
	{
		var oPrevSearch = oSettings.oPreviousSearch;
		var aoPrevSearch = oSettings.aoPreSearchCols;
		var fnSaveFilter = function ( oFilter ) {
			/* Save the filtering values */
			oPrevSearch.sSearch = oFilter.sSearch;
			oPrevSearch.bRegex = oFilter.bRegex;
			oPrevSearch.bSmart = oFilter.bSmart;
			oPrevSearch.bCaseInsensitive = oFilter.bCaseInsensitive;
		};
		var fnRegex = function ( o ) {
			// Backwards compatibility with the bEscapeRegex option
			return o.bEscapeRegex !== undefined ? !o.bEscapeRegex : o.bRegex;
		};
	
		// Resolve any column types that are unknown due to addition or invalidation
		// @todo As per sort - can this be moved into an event handler?
		_fnColumnTypes( oSettings );
	
		/* In server-side processing all filtering is done by the server, so no point hanging around here */
		if ( _fnDataSource( oSettings ) != 'ssp' )
		{
			/* Global filter */
			_fnFilter( oSettings, oInput.sSearch, iForce, fnRegex(oInput), oInput.bSmart, oInput.bCaseInsensitive );
			fnSaveFilter( oInput );
	
			/* Now do the individual column filter */
			for ( var i=0 ; i<aoPrevSearch.length ; i++ )
			{
				_fnFilterColumn( oSettings, aoPrevSearch[i].sSearch, i, fnRegex(aoPrevSearch[i]),
					aoPrevSearch[i].bSmart, aoPrevSearch[i].bCaseInsensitive );
			}
	
			/* Custom filtering */
			_fnFilterCustom( oSettings );
		}
		else
		{
			fnSaveFilter( oInput );
		}
	
		/* Tell the draw function we have been filtering */
		oSettings.bFiltered = true;
		_fnCallbackFire( oSettings, null, 'search', [oSettings] );
	}
	
	
	/**
	 * Apply custom filtering functions
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterCustom( settings )
	{
		var filters = DataTable.ext.search;
		var displayRows = settings.aiDisplay;
		var row, rowIdx;
	
		for ( var i=0, ien=filters.length ; i<ien ; i++ ) {
			var rows = [];
	
			// Loop over each row and see if it should be included
			for ( var j=0, jen=displayRows.length ; j<jen ; j++ ) {
				rowIdx = displayRows[ j ];
				row = settings.aoData[ rowIdx ];
	
				if ( filters[i]( settings, row._aFilterData, rowIdx, row._aData, j ) ) {
					rows.push( rowIdx );
				}
			}
	
			// So the array reference doesn't break set the results into the
			// existing array
			displayRows.length = 0;
			$.merge( displayRows, rows );
		}
	}
	
	
	/**
	 * Filter the table on a per-column basis
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sInput string to filter on
	 *  @param {int} iColumn column to filter
	 *  @param {bool} bRegex treat search string as a regular expression or not
	 *  @param {bool} bSmart use smart filtering or not
	 *  @param {bool} bCaseInsensitive Do case insenstive matching or not
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterColumn ( settings, searchStr, colIdx, regex, smart, caseInsensitive )
	{
		if ( searchStr === '' ) {
			return;
		}
	
		var data;
		var out = [];
		var display = settings.aiDisplay;
		var rpSearch = _fnFilterCreateSearch( searchStr, regex, smart, caseInsensitive );
	
		for ( var i=0 ; i<display.length ; i++ ) {
			data = settings.aoData[ display[i] ]._aFilterData[ colIdx ];
	
			if ( rpSearch.test( data ) ) {
				out.push( display[i] );
			}
		}
	
		settings.aiDisplay = out;
	}
	
	
	/**
	 * Filter the data table based on user input and draw the table
	 *  @param {object} settings dataTables settings object
	 *  @param {string} input string to filter on
	 *  @param {int} force optional - force a research of the master array (1) or not (undefined or 0)
	 *  @param {bool} regex treat as a regular expression or not
	 *  @param {bool} smart perform smart filtering or not
	 *  @param {bool} caseInsensitive Do case insenstive matching or not
	 *  @memberof DataTable#oApi
	 */
	function _fnFilter( settings, input, force, regex, smart, caseInsensitive )
	{
		var rpSearch = _fnFilterCreateSearch( input, regex, smart, caseInsensitive );
		var prevSearch = settings.oPreviousSearch.sSearch;
		var displayMaster = settings.aiDisplayMaster;
		var display, invalidated, i;
		var filtered = [];
	
		// Need to take account of custom filtering functions - always filter
		if ( DataTable.ext.search.length !== 0 ) {
			force = true;
		}
	
		// Check if any of the rows were invalidated
		invalidated = _fnFilterData( settings );
	
		// If the input is blank - we just want the full data set
		if ( input.length <= 0 ) {
			settings.aiDisplay = displayMaster.slice();
		}
		else {
			// New search - start from the master array
			if ( invalidated ||
				 force ||
				 regex ||
				 prevSearch.length > input.length ||
				 input.indexOf(prevSearch) !== 0 ||
				 settings.bSorted // On resort, the display master needs to be
				                  // re-filtered since indexes will have changed
			) {
				settings.aiDisplay = displayMaster.slice();
			}
	
			// Search the display array
			display = settings.aiDisplay;
	
			for ( i=0 ; i<display.length ; i++ ) {
				if ( rpSearch.test( settings.aoData[ display[i] ]._sFilterRow ) ) {
					filtered.push( display[i] );
				}
			}
	
			settings.aiDisplay = filtered;
		}
	}
	
	
	/**
	 * Build a regular expression object suitable for searching a table
	 *  @param {string} sSearch string to search for
	 *  @param {bool} bRegex treat as a regular expression or not
	 *  @param {bool} bSmart perform smart filtering or not
	 *  @param {bool} bCaseInsensitive Do case insensitive matching or not
	 *  @returns {RegExp} constructed object
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterCreateSearch( search, regex, smart, caseInsensitive )
	{
		search = regex ?
			search :
			_fnEscapeRegex( search );
		
		if ( smart ) {
			/* For smart filtering we want to allow the search to work regardless of
			 * word order. We also want double quoted text to be preserved, so word
			 * order is important - a la google. So this is what we want to
			 * generate:
			 * 
			 * ^(?=.*?\bone\b)(?=.*?\btwo three\b)(?=.*?\bfour\b).*$
			 */
			var a = $.map( search.match( /"[^"]+"|[^ ]+/g ) || [''], function ( word ) {
				if ( word.charAt(0) === '"' ) {
					var m = word.match( /^"(.*)"$/ );
					word = m ? m[1] : word;
				}
	
				return word.replace('"', '');
			} );
	
			search = '^(?=.*?'+a.join( ')(?=.*?' )+').*$';
		}
	
		return new RegExp( search, caseInsensitive ? 'i' : '' );
	}
	
	
	/**
	 * Escape a string such that it can be used in a regular expression
	 *  @param {string} sVal string to escape
	 *  @returns {string} escaped string
	 *  @memberof DataTable#oApi
	 */
	var _fnEscapeRegex = DataTable.util.escapeRegex;
	
	var __filter_div = $('<div>')[0];
	var __filter_div_textContent = __filter_div.textContent !== undefined;
	
	// Update the filtering data for each row if needed (by invalidation or first run)
	function _fnFilterData ( settings )
	{
		var columns = settings.aoColumns;
		var column;
		var i, j, ien, jen, filterData, cellData, row;
		var fomatters = DataTable.ext.type.search;
		var wasInvalidated = false;
	
		for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			row = settings.aoData[i];
	
			if ( ! row._aFilterData ) {
				filterData = [];
	
				for ( j=0, jen=columns.length ; j<jen ; j++ ) {
					column = columns[j];
	
					if ( column.bSearchable ) {
						cellData = _fnGetCellData( settings, i, j, 'filter' );
	
						if ( fomatters[ column.sType ] ) {
							cellData = fomatters[ column.sType ]( cellData );
						}
	
						// Search in DataTables 1.10 is string based. In 1.11 this
						// should be altered to also allow strict type checking.
						if ( cellData === null ) {
							cellData = '';
						}
	
						if ( typeof cellData !== 'string' && cellData.toString ) {
							cellData = cellData.toString();
						}
					}
					else {
						cellData = '';
					}
	
					// If it looks like there is an HTML entity in the string,
					// attempt to decode it so sorting works as expected. Note that
					// we could use a single line of jQuery to do this, but the DOM
					// method used here is much faster http://jsperf.com/html-decode
					if ( cellData.indexOf && cellData.indexOf('&') !== -1 ) {
						__filter_div.innerHTML = cellData;
						cellData = __filter_div_textContent ?
							__filter_div.textContent :
							__filter_div.innerText;
					}
	
					if ( cellData.replace ) {
						cellData = cellData.replace(/[\r\n\u2028]/g, '');
					}
	
					filterData.push( cellData );
				}
	
				row._aFilterData = filterData;
				row._sFilterRow = filterData.join('  ');
				wasInvalidated = true;
			}
		}
	
		return wasInvalidated;
	}
	
	
	/**
	 * Convert from the internal Hungarian notation to camelCase for external
	 * interaction
	 *  @param {object} obj Object to convert
	 *  @returns {object} Inverted object
	 *  @memberof DataTable#oApi
	 */
	function _fnSearchToCamel ( obj )
	{
		return {
			search:          obj.sSearch,
			smart:           obj.bSmart,
			regex:           obj.bRegex,
			caseInsensitive: obj.bCaseInsensitive
		};
	}
	
	
	
	/**
	 * Convert from camelCase notation to the internal Hungarian. We could use the
	 * Hungarian convert function here, but this is cleaner
	 *  @param {object} obj Object to convert
	 *  @returns {object} Inverted object
	 *  @memberof DataTable#oApi
	 */
	function _fnSearchToHung ( obj )
	{
		return {
			sSearch:          obj.search,
			bSmart:           obj.smart,
			bRegex:           obj.regex,
			bCaseInsensitive: obj.caseInsensitive
		};
	}
	
	/**
	 * Generate the node required for the info display
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {node} Information element
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlInfo ( settings )
	{
		var
			tid = settings.sTableId,
			nodes = settings.aanFeatures.i,
			n = $('<div/>', {
				'class': settings.oClasses.sInfo,
				'id': ! nodes ? tid+'_info' : null
			} );
	
		if ( ! nodes ) {
			// Update display on each draw
			settings.aoDrawCallback.push( {
				"fn": _fnUpdateInfo,
				"sName": "information"
			} );
	
			n
				.attr( 'role', 'status' )
				.attr( 'aria-live', 'polite' );
	
			// Table is described by our info div
			$(settings.nTable).attr( 'aria-describedby', tid+'_info' );
		}
	
		return n[0];
	}
	
	
	/**
	 * Update the information elements in the display
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnUpdateInfo ( settings )
	{
		/* Show information about the table */
		var nodes = settings.aanFeatures.i;
		if ( nodes.length === 0 ) {
			return;
		}
	
		var
			lang  = settings.oLanguage,
			start = settings._iDisplayStart+1,
			end   = settings.fnDisplayEnd(),
			max   = settings.fnRecordsTotal(),
			total = settings.fnRecordsDisplay(),
			out   = total ?
				lang.sInfo :
				lang.sInfoEmpty;
	
		if ( total !== max ) {
			/* Record set after filtering */
			out += ' ' + lang.sInfoFiltered;
		}
	
		// Convert the macros
		out += lang.sInfoPostFix;
		out = _fnInfoMacros( settings, out );
	
		var callback = lang.fnInfoCallback;
		if ( callback !== null ) {
			out = callback.call( settings.oInstance,
				settings, start, end, max, total, out
			);
		}
	
		$(nodes).html( out );
	}
	
	
	function _fnInfoMacros ( settings, str )
	{
		// When infinite scrolling, we are always starting at 1. _iDisplayStart is used only
		// internally
		var
			formatter  = settings.fnFormatNumber,
			start      = settings._iDisplayStart+1,
			len        = settings._iDisplayLength,
			vis        = settings.fnRecordsDisplay(),
			all        = len === -1;
	
		return str.
			replace(/_START_/g, formatter.call( settings, start ) ).
			replace(/_END_/g,   formatter.call( settings, settings.fnDisplayEnd() ) ).
			replace(/_MAX_/g,   formatter.call( settings, settings.fnRecordsTotal() ) ).
			replace(/_TOTAL_/g, formatter.call( settings, vis ) ).
			replace(/_PAGE_/g,  formatter.call( settings, all ? 1 : Math.ceil( start / len ) ) ).
			replace(/_PAGES_/g, formatter.call( settings, all ? 1 : Math.ceil( vis / len ) ) );
	}
	
	
	
	/**
	 * Draw the table for the first time, adding all required features
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnInitialise ( settings )
	{
		var i, iLen, iAjaxStart=settings.iInitDisplayStart;
		var columns = settings.aoColumns, column;
		var features = settings.oFeatures;
		var deferLoading = settings.bDeferLoading; // value modified by the draw
	
		/* Ensure that the table data is fully initialised */
		if ( ! settings.bInitialised ) {
			setTimeout( function(){ _fnInitialise( settings ); }, 200 );
			return;
		}
	
		/* Show the display HTML options */
		_fnAddOptionsHtml( settings );
	
		/* Build and draw the header / footer for the table */
		_fnBuildHead( settings );
		_fnDrawHead( settings, settings.aoHeader );
		_fnDrawHead( settings, settings.aoFooter );
	
		/* Okay to show that something is going on now */
		_fnProcessingDisplay( settings, true );
	
		/* Calculate sizes for columns */
		if ( features.bAutoWidth ) {
			_fnCalculateColumnWidths( settings );
		}
	
		for ( i=0, iLen=columns.length ; i<iLen ; i++ ) {
			column = columns[i];
	
			if ( column.sWidth ) {
				column.nTh.style.width = _fnStringToCss( column.sWidth );
			}
		}
	
		_fnCallbackFire( settings, null, 'preInit', [settings] );
	
		// If there is default sorting required - let's do it. The sort function
		// will do the drawing for us. Otherwise we draw the table regardless of the
		// Ajax source - this allows the table to look initialised for Ajax sourcing
		// data (show 'loading' message possibly)
		_fnReDraw( settings );
	
		// Server-side processing init complete is done by _fnAjaxUpdateDraw
		var dataSrc = _fnDataSource( settings );
		if ( dataSrc != 'ssp' || deferLoading ) {
			// if there is an ajax source load the data
			if ( dataSrc == 'ajax' ) {
				_fnBuildAjax( settings, [], function(json) {
					var aData = _fnAjaxDataSrc( settings, json );
	
					// Got the data - add it to the table
					for ( i=0 ; i<aData.length ; i++ ) {
						_fnAddData( settings, aData[i] );
					}
	
					// Reset the init display for cookie saving. We've already done
					// a filter, and therefore cleared it before. So we need to make
					// it appear 'fresh'
					settings.iInitDisplayStart = iAjaxStart;
	
					_fnReDraw( settings );
	
					_fnProcessingDisplay( settings, false );
					_fnInitComplete( settings, json );
				}, settings );
			}
			else {
				_fnProcessingDisplay( settings, false );
				_fnInitComplete( settings );
			}
		}
	}
	
	
	/**
	 * Draw the table for the first time, adding all required features
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} [json] JSON from the server that completed the table, if using Ajax source
	 *    with client-side processing (optional)
	 *  @memberof DataTable#oApi
	 */
	function _fnInitComplete ( settings, json )
	{
		settings._bInitComplete = true;
	
		// When data was added after the initialisation (data or Ajax) we need to
		// calculate the column sizing
		if ( json || settings.oInit.aaData ) {
			_fnAdjustColumnSizing( settings );
		}
	
		_fnCallbackFire( settings, null, 'plugin-init', [settings, json] );
		_fnCallbackFire( settings, 'aoInitComplete', 'init', [settings, json] );
	}
	
	
	function _fnLengthChange ( settings, val )
	{
		var len = parseInt( val, 10 );
		settings._iDisplayLength = len;
	
		_fnLengthOverflow( settings );
	
		// Fire length change event
		_fnCallbackFire( settings, null, 'length', [settings, len] );
	}
	
	
	/**
	 * Generate the node required for user display length changing
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Display length feature node
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlLength ( settings )
	{
		var
			classes  = settings.oClasses,
			tableId  = settings.sTableId,
			menu     = settings.aLengthMenu,
			d2       = Array.isArray( menu[0] ),
			lengths  = d2 ? menu[0] : menu,
			language = d2 ? menu[1] : menu;
	
		var select = $('<select/>', {
			'name':          tableId+'_length',
			'aria-controls': tableId,
			'class':         classes.sLengthSelect
		} );
	
		for ( var i=0, ien=lengths.length ; i<ien ; i++ ) {
			select[0][ i ] = new Option(
				typeof language[i] === 'number' ?
					settings.fnFormatNumber( language[i] ) :
					language[i],
				lengths[i]
			);
		}
	
		var div = $('<div><label/></div>').addClass( classes.sLength );
		if ( ! settings.aanFeatures.l ) {
			div[0].id = tableId+'_length';
		}
	
		div.children().append(
			settings.oLanguage.sLengthMenu.replace( '_MENU_', select[0].outerHTML )
		);
	
		// Can't use `select` variable as user might provide their own and the
		// reference is broken by the use of outerHTML
		$('select', div)
			.val( settings._iDisplayLength )
			.on( 'change.DT', function(e) {
				_fnLengthChange( settings, $(this).val() );
				_fnDraw( settings );
			} );
	
		// Update node value whenever anything changes the table's length
		$(settings.nTable).on( 'length.dt.DT', function (e, s, len) {
			if ( settings === s ) {
				$('select', div).val( len );
			}
		} );
	
		return div[0];
	}
	
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Note that most of the paging logic is done in
	 * DataTable.ext.pager
	 */
	
	/**
	 * Generate the node required for default pagination
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {node} Pagination feature node
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlPaginate ( settings )
	{
		var
			type   = settings.sPaginationType,
			plugin = DataTable.ext.pager[ type ],
			modern = typeof plugin === 'function',
			redraw = function( settings ) {
				_fnDraw( settings );
			},
			node = $('<div/>').addClass( settings.oClasses.sPaging + type )[0],
			features = settings.aanFeatures;
	
		if ( ! modern ) {
			plugin.fnInit( settings, node, redraw );
		}
	
		/* Add a draw callback for the pagination on first instance, to update the paging display */
		if ( ! features.p )
		{
			node.id = settings.sTableId+'_paginate';
	
			settings.aoDrawCallback.push( {
				"fn": function( settings ) {
					if ( modern ) {
						var
							start      = settings._iDisplayStart,
							len        = settings._iDisplayLength,
							visRecords = settings.fnRecordsDisplay(),
							all        = len === -1,
							page = all ? 0 : Math.ceil( start / len ),
							pages = all ? 1 : Math.ceil( visRecords / len ),
							buttons = plugin(page, pages),
							i, ien;
	
						for ( i=0, ien=features.p.length ; i<ien ; i++ ) {
							_fnRenderer( settings, 'pageButton' )(
								settings, features.p[i], i, buttons, page, pages
							);
						}
					}
					else {
						plugin.fnUpdate( settings, redraw );
					}
				},
				"sName": "pagination"
			} );
		}
	
		return node;
	}
	
	
	/**
	 * Alter the display settings to change the page
	 *  @param {object} settings DataTables settings object
	 *  @param {string|int} action Paging action to take: "first", "previous",
	 *    "next" or "last" or page number to jump to (integer)
	 *  @param [bool] redraw Automatically draw the update or not
	 *  @returns {bool} true page has changed, false - no change
	 *  @memberof DataTable#oApi
	 */
	function _fnPageChange ( settings, action, redraw )
	{
		var
			start     = settings._iDisplayStart,
			len       = settings._iDisplayLength,
			records   = settings.fnRecordsDisplay();
	
		if ( records === 0 || len === -1 )
		{
			start = 0;
		}
		else if ( typeof action === "number" )
		{
			start = action * len;
	
			if ( start > records )
			{
				start = 0;
			}
		}
		else if ( action == "first" )
		{
			start = 0;
		}
		else if ( action == "previous" )
		{
			start = len >= 0 ?
				start - len :
				0;
	
			if ( start < 0 )
			{
			  start = 0;
			}
		}
		else if ( action == "next" )
		{
			if ( start + len < records )
			{
				start += len;
			}
		}
		else if ( action == "last" )
		{
			start = Math.floor( (records-1) / len) * len;
		}
		else
		{
			_fnLog( settings, 0, "Unknown paging action: "+action, 5 );
		}
	
		var changed = settings._iDisplayStart !== start;
		settings._iDisplayStart = start;
	
		if ( changed ) {
			_fnCallbackFire( settings, null, 'page', [settings] );
	
			if ( redraw ) {
				_fnDraw( settings );
			}
		}
	
		return changed;
	}
	
	
	
	/**
	 * Generate the node required for the processing node
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Processing element
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlProcessing ( settings )
	{
		return $('<div/>', {
				'id': ! settings.aanFeatures.r ? settings.sTableId+'_processing' : null,
				'class': settings.oClasses.sProcessing
			} )
			.html( settings.oLanguage.sProcessing )
			.insertBefore( settings.nTable )[0];
	}
	
	
	/**
	 * Display or hide the processing indicator
	 *  @param {object} settings dataTables settings object
	 *  @param {bool} show Show the processing indicator (true) or not (false)
	 *  @memberof DataTable#oApi
	 */
	function _fnProcessingDisplay ( settings, show )
	{
		if ( settings.oFeatures.bProcessing ) {
			$(settings.aanFeatures.r).css( 'display', show ? 'block' : 'none' );
		}
	
		_fnCallbackFire( settings, null, 'processing', [settings, show] );
	}
	
	/**
	 * Add any control elements for the table - specifically scrolling
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Node to add to the DOM
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlTable ( settings )
	{
		var table = $(settings.nTable);
	
		// Add the ARIA grid role to the table
		table.attr( 'role', 'grid' );
	
		// Scrolling from here on in
		var scroll = settings.oScroll;
	
		if ( scroll.sX === '' && scroll.sY === '' ) {
			return settings.nTable;
		}
	
		var scrollX = scroll.sX;
		var scrollY = scroll.sY;
		var classes = settings.oClasses;
		var caption = table.children('caption');
		var captionSide = caption.length ? caption[0]._captionSide : null;
		var headerClone = $( table[0].cloneNode(false) );
		var footerClone = $( table[0].cloneNode(false) );
		var footer = table.children('tfoot');
		var _div = '<div/>';
		var size = function ( s ) {
			return !s ? null : _fnStringToCss( s );
		};
	
		if ( ! footer.length ) {
			footer = null;
		}
	
		/*
		 * The HTML structure that we want to generate in this function is:
		 *  div - scroller
		 *    div - scroll head
		 *      div - scroll head inner
		 *        table - scroll head table
		 *          thead - thead
		 *    div - scroll body
		 *      table - table (master table)
		 *        thead - thead clone for sizing
		 *        tbody - tbody
		 *    div - scroll foot
		 *      div - scroll foot inner
		 *        table - scroll foot table
		 *          tfoot - tfoot
		 */
		var scroller = $( _div, { 'class': classes.sScrollWrapper } )
			.append(
				$(_div, { 'class': classes.sScrollHead } )
					.css( {
						overflow: 'hidden',
						position: 'relative',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.sScrollHeadInner } )
							.css( {
								'box-sizing': 'content-box',
								width: scroll.sXInner || '100%'
							} )
							.append(
								headerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'top' ? caption : null )
									.append(
										table.children('thead')
									)
							)
					)
			)
			.append(
				$(_div, { 'class': classes.sScrollBody } )
					.css( {
						position: 'relative',
						overflow: 'auto',
						width: size( scrollX )
					} )
					.append( table )
			);
	
		if ( footer ) {
			scroller.append(
				$(_div, { 'class': classes.sScrollFoot } )
					.css( {
						overflow: 'hidden',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.sScrollFootInner } )
							.append(
								footerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'bottom' ? caption : null )
									.append(
										table.children('tfoot')
									)
							)
					)
			);
		}
	
		var children = scroller.children();
		var scrollHead = children[0];
		var scrollBody = children[1];
		var scrollFoot = footer ? children[2] : null;
	
		// When the body is scrolled, then we also want to scroll the headers
		if ( scrollX ) {
			$(scrollBody).on( 'scroll.DT', function (e) {
				var scrollLeft = this.scrollLeft;
	
				scrollHead.scrollLeft = scrollLeft;
	
				if ( footer ) {
					scrollFoot.scrollLeft = scrollLeft;
				}
			} );
		}
	
		$(scrollBody).css('max-height', scrollY);
		if (! scroll.bCollapse) {
			$(scrollBody).css('height', scrollY);
		}
	
		settings.nScrollHead = scrollHead;
		settings.nScrollBody = scrollBody;
		settings.nScrollFoot = scrollFoot;
	
		// On redraw - align columns
		settings.aoDrawCallback.push( {
			"fn": _fnScrollDraw,
			"sName": "scrolling"
		} );
	
		return scroller[0];
	}
	
	
	
	/**
	 * Update the header, footer and body tables for resizing - i.e. column
	 * alignment.
	 *
	 * Welcome to the most horrible function DataTables. The process that this
	 * function follows is basically:
	 *   1. Re-create the table inside the scrolling div
	 *   2. Take live measurements from the DOM
	 *   3. Apply the measurements to align the columns
	 *   4. Clean up
	 *
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnScrollDraw ( settings )
	{
		// Given that this is such a monster function, a lot of variables are use
		// to try and keep the minimised size as small as possible
		var
			scroll         = settings.oScroll,
			scrollX        = scroll.sX,
			scrollXInner   = scroll.sXInner,
			scrollY        = scroll.sY,
			barWidth       = scroll.iBarWidth,
			divHeader      = $(settings.nScrollHead),
			divHeaderStyle = divHeader[0].style,
			divHeaderInner = divHeader.children('div'),
			divHeaderInnerStyle = divHeaderInner[0].style,
			divHeaderTable = divHeaderInner.children('table'),
			divBodyEl      = settings.nScrollBody,
			divBody        = $(divBodyEl),
			divBodyStyle   = divBodyEl.style,
			divFooter      = $(settings.nScrollFoot),
			divFooterInner = divFooter.children('div'),
			divFooterTable = divFooterInner.children('table'),
			header         = $(settings.nTHead),
			table          = $(settings.nTable),
			tableEl        = table[0],
			tableStyle     = tableEl.style,
			footer         = settings.nTFoot ? $(settings.nTFoot) : null,
			browser        = settings.oBrowser,
			ie67           = browser.bScrollOversize,
			dtHeaderCells  = _pluck( settings.aoColumns, 'nTh' ),
			headerTrgEls, footerTrgEls,
			headerSrcEls, footerSrcEls,
			headerCopy, footerCopy,
			headerWidths=[], footerWidths=[],
			headerContent=[], footerContent=[],
			idx, correction, sanityWidth,
			zeroOut = function(nSizer) {
				var style = nSizer.style;
				style.paddingTop = "0";
				style.paddingBottom = "0";
				style.borderTopWidth = "0";
				style.borderBottomWidth = "0";
				style.height = 0;
			};
	
		// If the scrollbar visibility has changed from the last draw, we need to
		// adjust the column sizes as the table width will have changed to account
		// for the scrollbar
		var scrollBarVis = divBodyEl.scrollHeight > divBodyEl.clientHeight;
		
		if ( settings.scrollBarVis !== scrollBarVis && settings.scrollBarVis !== undefined ) {
			settings.scrollBarVis = scrollBarVis;
			_fnAdjustColumnSizing( settings );
			return; // adjust column sizing will call this function again
		}
		else {
			settings.scrollBarVis = scrollBarVis;
		}
	
		/*
		 * 1. Re-create the table inside the scrolling div
		 */
	
		// Remove the old minimised thead and tfoot elements in the inner table
		table.children('thead, tfoot').remove();
	
		if ( footer ) {
			footerCopy = footer.clone().prependTo( table );
			footerTrgEls = footer.find('tr'); // the original tfoot is in its own table and must be sized
			footerSrcEls = footerCopy.find('tr');
		}
	
		// Clone the current header and footer elements and then place it into the inner table
		headerCopy = header.clone().prependTo( table );
		headerTrgEls = header.find('tr'); // original header is in its own table
		headerSrcEls = headerCopy.find('tr');
		headerCopy.find('th, td').removeAttr('tabindex');
	
	
		/*
		 * 2. Take live measurements from the DOM - do not alter the DOM itself!
		 */
	
		// Remove old sizing and apply the calculated column widths
		// Get the unique column headers in the newly created (cloned) header. We want to apply the
		// calculated sizes to this header
		if ( ! scrollX )
		{
			divBodyStyle.width = '100%';
			divHeader[0].style.width = '100%';
		}
	
		$.each( _fnGetUniqueThs( settings, headerCopy ), function ( i, el ) {
			idx = _fnVisibleToColumnIndex( settings, i );
			el.style.width = settings.aoColumns[idx].sWidth;
		} );
	
		if ( footer ) {
			_fnApplyToChildren( function(n) {
				n.style.width = "";
			}, footerSrcEls );
		}
	
		// Size the table as a whole
		sanityWidth = table.outerWidth();
		if ( scrollX === "" ) {
			// No x scrolling
			tableStyle.width = "100%";
	
			// IE7 will make the width of the table when 100% include the scrollbar
			// - which is shouldn't. When there is a scrollbar we need to take this
			// into account.
			if ( ie67 && (table.find('tbody').height() > divBodyEl.offsetHeight ||
				divBody.css('overflow-y') == "scroll")
			) {
				tableStyle.width = _fnStringToCss( table.outerWidth() - barWidth);
			}
	
			// Recalculate the sanity width
			sanityWidth = table.outerWidth();
		}
		else if ( scrollXInner !== "" ) {
			// legacy x scroll inner has been given - use it
			tableStyle.width = _fnStringToCss(scrollXInner);
	
			// Recalculate the sanity width
			sanityWidth = table.outerWidth();
		}
	
		// Hidden header should have zero height, so remove padding and borders. Then
		// set the width based on the real headers
	
		// Apply all styles in one pass
		_fnApplyToChildren( zeroOut, headerSrcEls );
	
		// Read all widths in next pass
		_fnApplyToChildren( function(nSizer) {
			headerContent.push( nSizer.innerHTML );
			headerWidths.push( _fnStringToCss( $(nSizer).css('width') ) );
		}, headerSrcEls );
	
		// Apply all widths in final pass
		_fnApplyToChildren( function(nToSize, i) {
			// Only apply widths to the DataTables detected header cells - this
			// prevents complex headers from having contradictory sizes applied
			if ( $.inArray( nToSize, dtHeaderCells ) !== -1 ) {
				nToSize.style.width = headerWidths[i];
			}
		}, headerTrgEls );
	
		$(headerSrcEls).height(0);
	
		/* Same again with the footer if we have one */
		if ( footer )
		{
			_fnApplyToChildren( zeroOut, footerSrcEls );
	
			_fnApplyToChildren( function(nSizer) {
				footerContent.push( nSizer.innerHTML );
				footerWidths.push( _fnStringToCss( $(nSizer).css('width') ) );
			}, footerSrcEls );
	
			_fnApplyToChildren( function(nToSize, i) {
				nToSize.style.width = footerWidths[i];
			}, footerTrgEls );
	
			$(footerSrcEls).height(0);
		}
	
	
		/*
		 * 3. Apply the measurements
		 */
	
		// "Hide" the header and footer that we used for the sizing. We need to keep
		// the content of the cell so that the width applied to the header and body
		// both match, but we want to hide it completely. We want to also fix their
		// width to what they currently are
		_fnApplyToChildren( function(nSizer, i) {
			nSizer.innerHTML = '<div class="dataTables_sizing">'+headerContent[i]+'</div>';
			nSizer.childNodes[0].style.height = "0";
			nSizer.childNodes[0].style.overflow = "hidden";
			nSizer.style.width = headerWidths[i];
		}, headerSrcEls );
	
		if ( footer )
		{
			_fnApplyToChildren( function(nSizer, i) {
				nSizer.innerHTML = '<div class="dataTables_sizing">'+footerContent[i]+'</div>';
				nSizer.childNodes[0].style.height = "0";
				nSizer.childNodes[0].style.overflow = "hidden";
				nSizer.style.width = footerWidths[i];
			}, footerSrcEls );
		}
	
		// Sanity check that the table is of a sensible width. If not then we are going to get
		// misalignment - try to prevent this by not allowing the table to shrink below its min width
		if ( table.outerWidth() < sanityWidth )
		{
			// The min width depends upon if we have a vertical scrollbar visible or not */
			correction = ((divBodyEl.scrollHeight > divBodyEl.offsetHeight ||
				divBody.css('overflow-y') == "scroll")) ?
					sanityWidth+barWidth :
					sanityWidth;
	
			// IE6/7 are a law unto themselves...
			if ( ie67 && (divBodyEl.scrollHeight >
				divBodyEl.offsetHeight || divBody.css('overflow-y') == "scroll")
			) {
				tableStyle.width = _fnStringToCss( correction-barWidth );
			}
	
			// And give the user a warning that we've stopped the table getting too small
			if ( scrollX === "" || scrollXInner !== "" ) {
				_fnLog( settings, 1, 'Possible column misalignment', 6 );
			}
		}
		else
		{
			correction = '100%';
		}
	
		// Apply to the container elements
		divBodyStyle.width = _fnStringToCss( correction );
		divHeaderStyle.width = _fnStringToCss( correction );
	
		if ( footer ) {
			settings.nScrollFoot.style.width = _fnStringToCss( correction );
		}
	
	
		/*
		 * 4. Clean up
		 */
		if ( ! scrollY ) {
			/* IE7< puts a vertical scrollbar in place (when it shouldn't be) due to subtracting
			 * the scrollbar height from the visible display, rather than adding it on. We need to
			 * set the height in order to sort this. Don't want to do it in any other browsers.
			 */
			if ( ie67 ) {
				divBodyStyle.height = _fnStringToCss( tableEl.offsetHeight+barWidth );
			}
		}
	
		/* Finally set the width's of the header and footer tables */
		var iOuterWidth = table.outerWidth();
		divHeaderTable[0].style.width = _fnStringToCss( iOuterWidth );
		divHeaderInnerStyle.width = _fnStringToCss( iOuterWidth );
	
		// Figure out if there are scrollbar present - if so then we need a the header and footer to
		// provide a bit more space to allow "overflow" scrolling (i.e. past the scrollbar)
		var bScrolling = table.height() > divBodyEl.clientHeight || divBody.css('overflow-y') == "scroll";
		var padding = 'padding' + (browser.bScrollbarLeft ? 'Left' : 'Right' );
		divHeaderInnerStyle[ padding ] = bScrolling ? barWidth+"px" : "0px";
	
		if ( footer ) {
			divFooterTable[0].style.width = _fnStringToCss( iOuterWidth );
			divFooterInner[0].style.width = _fnStringToCss( iOuterWidth );
			divFooterInner[0].style[padding] = bScrolling ? barWidth+"px" : "0px";
		}
	
		// Correct DOM ordering for colgroup - comes before the thead
		table.children('colgroup').insertBefore( table.children('thead') );
	
		/* Adjust the position of the header in case we loose the y-scrollbar */
		divBody.trigger('scroll');
	
		// If sorting or filtering has occurred, jump the scrolling back to the top
		// only if we aren't holding the position
		if ( (settings.bSorted || settings.bFiltered) && ! settings._drawHold ) {
			divBodyEl.scrollTop = 0;
		}
	}
	
	
	
	/**
	 * Apply a given function to the display child nodes of an element array (typically
	 * TD children of TR rows
	 *  @param {function} fn Method to apply to the objects
	 *  @param array {nodes} an1 List of elements to look through for display children
	 *  @param array {nodes} an2 Another list (identical structure to the first) - optional
	 *  @memberof DataTable#oApi
	 */
	function _fnApplyToChildren( fn, an1, an2 )
	{
		var index=0, i=0, iLen=an1.length;
		var nNode1, nNode2;
	
		while ( i < iLen ) {
			nNode1 = an1[i].firstChild;
			nNode2 = an2 ? an2[i].firstChild : null;
	
			while ( nNode1 ) {
				if ( nNode1.nodeType === 1 ) {
					if ( an2 ) {
						fn( nNode1, nNode2, index );
					}
					else {
						fn( nNode1, index );
					}
	
					index++;
				}
	
				nNode1 = nNode1.nextSibling;
				nNode2 = an2 ? nNode2.nextSibling : null;
			}
	
			i++;
		}
	}
	
	
	
	var __re_html_remove = /<.*?>/g;
	
	
	/**
	 * Calculate the width of columns for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnCalculateColumnWidths ( oSettings )
	{
		var
			table = oSettings.nTable,
			columns = oSettings.aoColumns,
			scroll = oSettings.oScroll,
			scrollY = scroll.sY,
			scrollX = scroll.sX,
			scrollXInner = scroll.sXInner,
			columnCount = columns.length,
			visibleColumns = _fnGetColumns( oSettings, 'bVisible' ),
			headerCells = $('th', oSettings.nTHead),
			tableWidthAttr = table.getAttribute('width'), // from DOM element
			tableContainer = table.parentNode,
			userInputs = false,
			i, column, columnIdx, width, outerWidth,
			browser = oSettings.oBrowser,
			ie67 = browser.bScrollOversize;
	
		var styleWidth = table.style.width;
		if ( styleWidth && styleWidth.indexOf('%') !== -1 ) {
			tableWidthAttr = styleWidth;
		}
	
		/* Convert any user input sizes into pixel sizes */
		for ( i=0 ; i<visibleColumns.length ; i++ ) {
			column = columns[ visibleColumns[i] ];
	
			if ( column.sWidth !== null ) {
				column.sWidth = _fnConvertToWidth( column.sWidthOrig, tableContainer );
	
				userInputs = true;
			}
		}
	
		/* If the number of columns in the DOM equals the number that we have to
		 * process in DataTables, then we can use the offsets that are created by
		 * the web- browser. No custom sizes can be set in order for this to happen,
		 * nor scrolling used
		 */
		if ( ie67 || ! userInputs && ! scrollX && ! scrollY &&
		     columnCount == _fnVisbleColumns( oSettings ) &&
		     columnCount == headerCells.length
		) {
			for ( i=0 ; i<columnCount ; i++ ) {
				var colIdx = _fnVisibleToColumnIndex( oSettings, i );
	
				if ( colIdx !== null ) {
					columns[ colIdx ].sWidth = _fnStringToCss( headerCells.eq(i).width() );
				}
			}
		}
		else
		{
			// Otherwise construct a single row, worst case, table with the widest
			// node in the data, assign any user defined widths, then insert it into
			// the DOM and allow the browser to do all the hard work of calculating
			// table widths
			var tmpTable = $(table).clone() // don't use cloneNode - IE8 will remove events on the main table
				.css( 'visibility', 'hidden' )
				.removeAttr( 'id' );
	
			// Clean up the table body
			tmpTable.find('tbody tr').remove();
			var tr = $('<tr/>').appendTo( tmpTable.find('tbody') );
	
			// Clone the table header and footer - we can't use the header / footer
			// from the cloned table, since if scrolling is active, the table's
			// real header and footer are contained in different table tags
			tmpTable.find('thead, tfoot').remove();
			tmpTable
				.append( $(oSettings.nTHead).clone() )
				.append( $(oSettings.nTFoot).clone() );
	
			// Remove any assigned widths from the footer (from scrolling)
			tmpTable.find('tfoot th, tfoot td').css('width', '');
	
			// Apply custom sizing to the cloned header
			headerCells = _fnGetUniqueThs( oSettings, tmpTable.find('thead')[0] );
	
			for ( i=0 ; i<visibleColumns.length ; i++ ) {
				column = columns[ visibleColumns[i] ];
	
				headerCells[i].style.width = column.sWidthOrig !== null && column.sWidthOrig !== '' ?
					_fnStringToCss( column.sWidthOrig ) :
					'';
	
				// For scrollX we need to force the column width otherwise the
				// browser will collapse it. If this width is smaller than the
				// width the column requires, then it will have no effect
				if ( column.sWidthOrig && scrollX ) {
					$( headerCells[i] ).append( $('<div/>').css( {
						width: column.sWidthOrig,
						margin: 0,
						padding: 0,
						border: 0,
						height: 1
					} ) );
				}
			}
	
			// Find the widest cell for each column and put it into the table
			if ( oSettings.aoData.length ) {
				for ( i=0 ; i<visibleColumns.length ; i++ ) {
					columnIdx = visibleColumns[i];
					column = columns[ columnIdx ];
	
					$( _fnGetWidestNode( oSettings, columnIdx ) )
						.clone( false )
						.append( column.sContentPadding )
						.appendTo( tr );
				}
			}
	
			// Tidy the temporary table - remove name attributes so there aren't
			// duplicated in the dom (radio elements for example)
			$('[name]', tmpTable).removeAttr('name');
	
			// Table has been built, attach to the document so we can work with it.
			// A holding element is used, positioned at the top of the container
			// with minimal height, so it has no effect on if the container scrolls
			// or not. Otherwise it might trigger scrolling when it actually isn't
			// needed
			var holder = $('<div/>').css( scrollX || scrollY ?
					{
						position: 'absolute',
						top: 0,
						left: 0,
						height: 1,
						right: 0,
						overflow: 'hidden'
					} :
					{}
				)
				.append( tmpTable )
				.appendTo( tableContainer );
	
			// When scrolling (X or Y) we want to set the width of the table as 
			// appropriate. However, when not scrolling leave the table width as it
			// is. This results in slightly different, but I think correct behaviour
			if ( scrollX && scrollXInner ) {
				tmpTable.width( scrollXInner );
			}
			else if ( scrollX ) {
				tmpTable.css( 'width', 'auto' );
				tmpTable.removeAttr('width');
	
				// If there is no width attribute or style, then allow the table to
				// collapse
				if ( tmpTable.width() < tableContainer.clientWidth && tableWidthAttr ) {
					tmpTable.width( tableContainer.clientWidth );
				}
			}
			else if ( scrollY ) {
				tmpTable.width( tableContainer.clientWidth );
			}
			else if ( tableWidthAttr ) {
				tmpTable.width( tableWidthAttr );
			}
	
			// Get the width of each column in the constructed table - we need to
			// know the inner width (so it can be assigned to the other table's
			// cells) and the outer width so we can calculate the full width of the
			// table. This is safe since DataTables requires a unique cell for each
			// column, but if ever a header can span multiple columns, this will
			// need to be modified.
			var total = 0;
			for ( i=0 ; i<visibleColumns.length ; i++ ) {
				var cell = $(headerCells[i]);
				var border = cell.outerWidth() - cell.width();
	
				// Use getBounding... where possible (not IE8-) because it can give
				// sub-pixel accuracy, which we then want to round up!
				var bounding = browser.bBounding ?
					Math.ceil( headerCells[i].getBoundingClientRect().width ) :
					cell.outerWidth();
	
				// Total is tracked to remove any sub-pixel errors as the outerWidth
				// of the table might not equal the total given here (IE!).
				total += bounding;
	
				// Width for each column to use
				columns[ visibleColumns[i] ].sWidth = _fnStringToCss( bounding - border );
			}
	
			table.style.width = _fnStringToCss( total );
	
			// Finished with the table - ditch it
			holder.remove();
		}
	
		// If there is a width attr, we want to attach an event listener which
		// allows the table sizing to automatically adjust when the window is
		// resized. Use the width attr rather than CSS, since we can't know if the
		// CSS is a relative value or absolute - DOM read is always px.
		if ( tableWidthAttr ) {
			table.style.width = _fnStringToCss( tableWidthAttr );
		}
	
		if ( (tableWidthAttr || scrollX) && ! oSettings._reszEvt ) {
			var bindResize = function () {
				$(window).on('resize.DT-'+oSettings.sInstance, _fnThrottle( function () {
					_fnAdjustColumnSizing( oSettings );
				} ) );
			};
	
			// IE6/7 will crash if we bind a resize event handler on page load.
			// To be removed in 1.11 which drops IE6/7 support
			if ( ie67 ) {
				setTimeout( bindResize, 1000 );
			}
			else {
				bindResize();
			}
	
			oSettings._reszEvt = true;
		}
	}
	
	
	/**
	 * Throttle the calls to a function. Arguments and context are maintained for
	 * the throttled function
	 *  @param {function} fn Function to be called
	 *  @param {int} [freq=200] call frequency in mS
	 *  @returns {function} wrapped function
	 *  @memberof DataTable#oApi
	 */
	var _fnThrottle = DataTable.util.throttle;
	
	
	/**
	 * Convert a CSS unit width to pixels (e.g. 2em)
	 *  @param {string} width width to be converted
	 *  @param {node} parent parent to get the with for (required for relative widths) - optional
	 *  @returns {int} width in pixels
	 *  @memberof DataTable#oApi
	 */
	function _fnConvertToWidth ( width, parent )
	{
		if ( ! width ) {
			return 0;
		}
	
		var n = $('<div/>')
			.css( 'width', _fnStringToCss( width ) )
			.appendTo( parent || document.body );
	
		var val = n[0].offsetWidth;
		n.remove();
	
		return val;
	}
	
	
	/**
	 * Get the widest node
	 *  @param {object} settings dataTables settings object
	 *  @param {int} colIdx column of interest
	 *  @returns {node} widest table node
	 *  @memberof DataTable#oApi
	 */
	function _fnGetWidestNode( settings, colIdx )
	{
		var idx = _fnGetMaxLenString( settings, colIdx );
		if ( idx < 0 ) {
			return null;
		}
	
		var data = settings.aoData[ idx ];
		return ! data.nTr ? // Might not have been created when deferred rendering
			$('<td/>').html( _fnGetCellData( settings, idx, colIdx, 'display' ) )[0] :
			data.anCells[ colIdx ];
	}
	
	
	/**
	 * Get the maximum strlen for each data column
	 *  @param {object} settings dataTables settings object
	 *  @param {int} colIdx column of interest
	 *  @returns {string} max string length for each column
	 *  @memberof DataTable#oApi
	 */
	function _fnGetMaxLenString( settings, colIdx )
	{
		var s, max=-1, maxIdx = -1;
	
		for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			s = _fnGetCellData( settings, i, colIdx, 'display' )+'';
			s = s.replace( __re_html_remove, '' );
			s = s.replace( /&nbsp;/g, ' ' );
	
			if ( s.length > max ) {
				max = s.length;
				maxIdx = i;
			}
		}
	
		return maxIdx;
	}
	
	
	/**
	 * Append a CSS unit (only if required) to a string
	 *  @param {string} value to css-ify
	 *  @returns {string} value with css unit
	 *  @memberof DataTable#oApi
	 */
	function _fnStringToCss( s )
	{
		if ( s === null ) {
			return '0px';
		}
	
		if ( typeof s == 'number' ) {
			return s < 0 ?
				'0px' :
				s+'px';
		}
	
		// Check it has a unit character already
		return s.match(/\d$/) ?
			s+'px' :
			s;
	}
	
	
	
	function _fnSortFlatten ( settings )
	{
		var
			i, iLen, k, kLen,
			aSort = [],
			aiOrig = [],
			aoColumns = settings.aoColumns,
			aDataSort, iCol, sType, srcCol,
			fixed = settings.aaSortingFixed,
			fixedObj = $.isPlainObject( fixed ),
			nestedSort = [],
			add = function ( a ) {
				if ( a.length && ! Array.isArray( a[0] ) ) {
					// 1D array
					nestedSort.push( a );
				}
				else {
					// 2D array
					$.merge( nestedSort, a );
				}
			};
	
		// Build the sort array, with pre-fix and post-fix options if they have been
		// specified
		if ( Array.isArray( fixed ) ) {
			add( fixed );
		}
	
		if ( fixedObj && fixed.pre ) {
			add( fixed.pre );
		}
	
		add( settings.aaSorting );
	
		if (fixedObj && fixed.post ) {
			add( fixed.post );
		}
	
		for ( i=0 ; i<nestedSort.length ; i++ )
		{
			srcCol = nestedSort[i][0];
			aDataSort = aoColumns[ srcCol ].aDataSort;
	
			for ( k=0, kLen=aDataSort.length ; k<kLen ; k++ )
			{
				iCol = aDataSort[k];
				sType = aoColumns[ iCol ].sType || 'string';
	
				if ( nestedSort[i]._idx === undefined ) {
					nestedSort[i]._idx = $.inArray( nestedSort[i][1], aoColumns[iCol].asSorting );
				}
	
				aSort.push( {
					src:       srcCol,
					col:       iCol,
					dir:       nestedSort[i][1],
					index:     nestedSort[i]._idx,
					type:      sType,
					formatter: DataTable.ext.type.order[ sType+"-pre" ]
				} );
			}
		}
	
		return aSort;
	}
	
	/**
	 * Change the order of the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 *  @todo This really needs split up!
	 */
	function _fnSort ( oSettings )
	{
		var
			i, ien, iLen, j, jLen, k, kLen,
			sDataType, nTh,
			aiOrig = [],
			oExtSort = DataTable.ext.type.order,
			aoData = oSettings.aoData,
			aoColumns = oSettings.aoColumns,
			aDataSort, data, iCol, sType, oSort,
			formatters = 0,
			sortCol,
			displayMaster = oSettings.aiDisplayMaster,
			aSort;
	
		// Resolve any column types that are unknown due to addition or invalidation
		// @todo Can this be moved into a 'data-ready' handler which is called when
		//   data is going to be used in the table?
		_fnColumnTypes( oSettings );
	
		aSort = _fnSortFlatten( oSettings );
	
		for ( i=0, ien=aSort.length ; i<ien ; i++ ) {
			sortCol = aSort[i];
	
			// Track if we can use the fast sort algorithm
			if ( sortCol.formatter ) {
				formatters++;
			}
	
			// Load the data needed for the sort, for each cell
			_fnSortData( oSettings, sortCol.col );
		}
	
		/* No sorting required if server-side or no sorting array */
		if ( _fnDataSource( oSettings ) != 'ssp' && aSort.length !== 0 )
		{
			// Create a value - key array of the current row positions such that we can use their
			// current position during the sort, if values match, in order to perform stable sorting
			for ( i=0, iLen=displayMaster.length ; i<iLen ; i++ ) {
				aiOrig[ displayMaster[i] ] = i;
			}
	
			/* Do the sort - here we want multi-column sorting based on a given data source (column)
			 * and sorting function (from oSort) in a certain direction. It's reasonably complex to
			 * follow on it's own, but this is what we want (example two column sorting):
			 *  fnLocalSorting = function(a,b){
			 *    var iTest;
			 *    iTest = oSort['string-asc']('data11', 'data12');
			 *      if (iTest !== 0)
			 *        return iTest;
			 *    iTest = oSort['numeric-desc']('data21', 'data22');
			 *    if (iTest !== 0)
			 *      return iTest;
			 *    return oSort['numeric-asc']( aiOrig[a], aiOrig[b] );
			 *  }
			 * Basically we have a test for each sorting column, if the data in that column is equal,
			 * test the next column. If all columns match, then we use a numeric sort on the row
			 * positions in the original data array to provide a stable sort.
			 *
			 * Note - I know it seems excessive to have two sorting methods, but the first is around
			 * 15% faster, so the second is only maintained for backwards compatibility with sorting
			 * methods which do not have a pre-sort formatting function.
			 */
			if ( formatters === aSort.length ) {
				// All sort types have formatting functions
				displayMaster.sort( function ( a, b ) {
					var
						x, y, k, test, sort,
						len=aSort.length,
						dataA = aoData[a]._aSortData,
						dataB = aoData[b]._aSortData;
	
					for ( k=0 ; k<len ; k++ ) {
						sort = aSort[k];
	
						x = dataA[ sort.col ];
						y = dataB[ sort.col ];
	
						test = x<y ? -1 : x>y ? 1 : 0;
						if ( test !== 0 ) {
							return sort.dir === 'asc' ? test : -test;
						}
					}
	
					x = aiOrig[a];
					y = aiOrig[b];
					return x<y ? -1 : x>y ? 1 : 0;
				} );
			}
			else {
				// Depreciated - remove in 1.11 (providing a plug-in option)
				// Not all sort types have formatting methods, so we have to call their sorting
				// methods.
				displayMaster.sort( function ( a, b ) {
					var
						x, y, k, l, test, sort, fn,
						len=aSort.length,
						dataA = aoData[a]._aSortData,
						dataB = aoData[b]._aSortData;
	
					for ( k=0 ; k<len ; k++ ) {
						sort = aSort[k];
	
						x = dataA[ sort.col ];
						y = dataB[ sort.col ];
	
						fn = oExtSort[ sort.type+"-"+sort.dir ] || oExtSort[ "string-"+sort.dir ];
						test = fn( x, y );
						if ( test !== 0 ) {
							return test;
						}
					}
	
					x = aiOrig[a];
					y = aiOrig[b];
					return x<y ? -1 : x>y ? 1 : 0;
				} );
			}
		}
	
		/* Tell the draw function that we have sorted the data */
		oSettings.bSorted = true;
	}
	
	
	function _fnSortAria ( settings )
	{
		var label;
		var nextSort;
		var columns = settings.aoColumns;
		var aSort = _fnSortFlatten( settings );
		var oAria = settings.oLanguage.oAria;
	
		// ARIA attributes - need to loop all columns, to update all (removing old
		// attributes as needed)
		for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
		{
			var col = columns[i];
			var asSorting = col.asSorting;
			var sTitle = col.sTitle.replace( /<.*?>/g, "" );
			var th = col.nTh;
	
			// IE7 is throwing an error when setting these properties with jQuery's
			// attr() and removeAttr() methods...
			th.removeAttribute('aria-sort');
	
			/* In ARIA only the first sorting column can be marked as sorting - no multi-sort option */
			if ( col.bSortable ) {
				if ( aSort.length > 0 && aSort[0].col == i ) {
					th.setAttribute('aria-sort', aSort[0].dir=="asc" ? "ascending" : "descending" );
					nextSort = asSorting[ aSort[0].index+1 ] || asSorting[0];
				}
				else {
					nextSort = asSorting[0];
				}
	
				label = sTitle + ( nextSort === "asc" ?
					oAria.sSortAscending :
					oAria.sSortDescending
				);
			}
			else {
				label = sTitle;
			}
	
			th.setAttribute('aria-label', label);
		}
	}
	
	
	/**
	 * Function to run on user sort request
	 *  @param {object} settings dataTables settings object
	 *  @param {node} attachTo node to attach the handler to
	 *  @param {int} colIdx column sorting index
	 *  @param {boolean} [append=false] Append the requested sort to the existing
	 *    sort if true (i.e. multi-column sort)
	 *  @param {function} [callback] callback function
	 *  @memberof DataTable#oApi
	 */
	function _fnSortListener ( settings, colIdx, append, callback )
	{
		var col = settings.aoColumns[ colIdx ];
		var sorting = settings.aaSorting;
		var asSorting = col.asSorting;
		var nextSortIdx;
		var next = function ( a, overflow ) {
			var idx = a._idx;
			if ( idx === undefined ) {
				idx = $.inArray( a[1], asSorting );
			}
	
			return idx+1 < asSorting.length ?
				idx+1 :
				overflow ?
					null :
					0;
		};
	
		// Convert to 2D array if needed
		if ( typeof sorting[0] === 'number' ) {
			sorting = settings.aaSorting = [ sorting ];
		}
	
		// If appending the sort then we are multi-column sorting
		if ( append && settings.oFeatures.bSortMulti ) {
			// Are we already doing some kind of sort on this column?
			var sortIdx = $.inArray( colIdx, _pluck(sorting, '0') );
	
			if ( sortIdx !== -1 ) {
				// Yes, modify the sort
				nextSortIdx = next( sorting[sortIdx], true );
	
				if ( nextSortIdx === null && sorting.length === 1 ) {
					nextSortIdx = 0; // can't remove sorting completely
				}
	
				if ( nextSortIdx === null ) {
					sorting.splice( sortIdx, 1 );
				}
				else {
					sorting[sortIdx][1] = asSorting[ nextSortIdx ];
					sorting[sortIdx]._idx = nextSortIdx;
				}
			}
			else {
				// No sort on this column yet
				sorting.push( [ colIdx, asSorting[0], 0 ] );
				sorting[sorting.length-1]._idx = 0;
			}
		}
		else if ( sorting.length && sorting[0][0] == colIdx ) {
			// Single column - already sorting on this column, modify the sort
			nextSortIdx = next( sorting[0] );
	
			sorting.length = 1;
			sorting[0][1] = asSorting[ nextSortIdx ];
			sorting[0]._idx = nextSortIdx;
		}
		else {
			// Single column - sort only on this column
			sorting.length = 0;
			sorting.push( [ colIdx, asSorting[0] ] );
			sorting[0]._idx = 0;
		}
	
		// Run the sort by calling a full redraw
		_fnReDraw( settings );
	
		// callback used for async user interaction
		if ( typeof callback == 'function' ) {
			callback( settings );
		}
	}
	
	
	/**
	 * Attach a sort handler (click) to a node
	 *  @param {object} settings dataTables settings object
	 *  @param {node} attachTo node to attach the handler to
	 *  @param {int} colIdx column sorting index
	 *  @param {function} [callback] callback function
	 *  @memberof DataTable#oApi
	 */
	function _fnSortAttachListener ( settings, attachTo, colIdx, callback )
	{
		var col = settings.aoColumns[ colIdx ];
	
		_fnBindAction( attachTo, {}, function (e) {
			/* If the column is not sortable - don't to anything */
			if ( col.bSortable === false ) {
				return;
			}
	
			// If processing is enabled use a timeout to allow the processing
			// display to be shown - otherwise to it synchronously
			if ( settings.oFeatures.bProcessing ) {
				_fnProcessingDisplay( settings, true );
	
				setTimeout( function() {
					_fnSortListener( settings, colIdx, e.shiftKey, callback );
	
					// In server-side processing, the draw callback will remove the
					// processing display
					if ( _fnDataSource( settings ) !== 'ssp' ) {
						_fnProcessingDisplay( settings, false );
					}
				}, 0 );
			}
			else {
				_fnSortListener( settings, colIdx, e.shiftKey, callback );
			}
		} );
	}
	
	
	/**
	 * Set the sorting classes on table's body, Note: it is safe to call this function
	 * when bSort and bSortClasses are false
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnSortingClasses( settings )
	{
		var oldSort = settings.aLastSort;
		var sortClass = settings.oClasses.sSortColumn;
		var sort = _fnSortFlatten( settings );
		var features = settings.oFeatures;
		var i, ien, colIdx;
	
		if ( features.bSort && features.bSortClasses ) {
			// Remove old sorting classes
			for ( i=0, ien=oldSort.length ; i<ien ; i++ ) {
				colIdx = oldSort[i].src;
	
				// Remove column sorting
				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.removeClass( sortClass + (i<2 ? i+1 : 3) );
			}
	
			// Add new column sorting
			for ( i=0, ien=sort.length ; i<ien ; i++ ) {
				colIdx = sort[i].src;
	
				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.addClass( sortClass + (i<2 ? i+1 : 3) );
			}
		}
	
		settings.aLastSort = sort;
	}
	
	
	// Get the data to sort a column, be it from cache, fresh (populating the
	// cache), or from a sort formatter
	function _fnSortData( settings, idx )
	{
		// Custom sorting function - provided by the sort data type
		var column = settings.aoColumns[ idx ];
		var customSort = DataTable.ext.order[ column.sSortDataType ];
		var customData;
	
		if ( customSort ) {
			customData = customSort.call( settings.oInstance, settings, idx,
				_fnColumnIndexToVisible( settings, idx )
			);
		}
	
		// Use / populate cache
		var row, cellData;
		var formatter = DataTable.ext.type.order[ column.sType+"-pre" ];
	
		for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			row = settings.aoData[i];
	
			if ( ! row._aSortData ) {
				row._aSortData = [];
			}
	
			if ( ! row._aSortData[idx] || customSort ) {
				cellData = customSort ?
					customData[i] : // If there was a custom sort function, use data from there
					_fnGetCellData( settings, i, idx, 'sort' );
	
				row._aSortData[ idx ] = formatter ?
					formatter( cellData ) :
					cellData;
			}
		}
	}
	
	
	
	/**
	 * Save the state of a table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnSaveState ( settings )
	{
		if ( !settings.oFeatures.bStateSave || settings.bDestroying )
		{
			return;
		}
	
		/* Store the interesting variables */
		var state = {
			time:    +new Date(),
			start:   settings._iDisplayStart,
			length:  settings._iDisplayLength,
			order:   $.extend( true, [], settings.aaSorting ),
			search:  _fnSearchToCamel( settings.oPreviousSearch ),
			columns: $.map( settings.aoColumns, function ( col, i ) {
				return {
					visible: col.bVisible,
					search: _fnSearchToCamel( settings.aoPreSearchCols[i] )
				};
			} )
		};
	
		_fnCallbackFire( settings, "aoStateSaveParams", 'stateSaveParams', [settings, state] );
	
		settings.oSavedState = state;
		settings.fnStateSaveCallback.call( settings.oInstance, settings, state );
	}
	
	
	/**
	 * Attempt to load a saved table state
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} oInit DataTables init object so we can override settings
	 *  @param {function} callback Callback to execute when the state has been loaded
	 *  @memberof DataTable#oApi
	 */
	function _fnLoadState ( settings, oInit, callback )
	{
		var i, ien;
		var columns = settings.aoColumns;
		var loaded = function ( s ) {
			if ( ! s || ! s.time ) {
				callback();
				return;
			}
	
			// Allow custom and plug-in manipulation functions to alter the saved data set and
			// cancelling of loading by returning false
			var abStateLoad = _fnCallbackFire( settings, 'aoStateLoadParams', 'stateLoadParams', [settings, s] );
			if ( $.inArray( false, abStateLoad ) !== -1 ) {
				callback();
				return;
			}
	
			// Reject old data
			var duration = settings.iStateDuration;
			if ( duration > 0 && s.time < +new Date() - (duration*1000) ) {
				callback();
				return;
			}
	
			// Number of columns have changed - all bets are off, no restore of settings
			if ( s.columns && columns.length !== s.columns.length ) {
				callback();
				return;
			}
	
			// Store the saved state so it might be accessed at any time
			settings.oLoadedState = $.extend( true, {}, s );
	
			// Restore key features - todo - for 1.11 this needs to be done by
			// subscribed events
			if ( s.start !== undefined ) {
				settings._iDisplayStart    = s.start;
				settings.iInitDisplayStart = s.start;
			}
			if ( s.length !== undefined ) {
				settings._iDisplayLength   = s.length;
			}
	
			// Order
			if ( s.order !== undefined ) {
				settings.aaSorting = [];
				$.each( s.order, function ( i, col ) {
					settings.aaSorting.push( col[0] >= columns.length ?
						[ 0, col[1] ] :
						col
					);
				} );
			}
	
			// Search
			if ( s.search !== undefined ) {
				$.extend( settings.oPreviousSearch, _fnSearchToHung( s.search ) );
			}
	
			// Columns
			//
			if ( s.columns ) {
				for ( i=0, ien=s.columns.length ; i<ien ; i++ ) {
					var col = s.columns[i];
	
					// Visibility
					if ( col.visible !== undefined ) {
						columns[i].bVisible = col.visible;
					}
	
					// Search
					if ( col.search !== undefined ) {
						$.extend( settings.aoPreSearchCols[i], _fnSearchToHung( col.search ) );
					}
				}
			}
	
			_fnCallbackFire( settings, 'aoStateLoaded', 'stateLoaded', [settings, s] );
			callback();
		};
	
		if ( ! settings.oFeatures.bStateSave ) {
			callback();
			return;
		}
	
		var state = settings.fnStateLoadCallback.call( settings.oInstance, settings, loaded );
	
		if ( state !== undefined ) {
			loaded( state );
		}
		// otherwise, wait for the loaded callback to be executed
	}
	
	
	/**
	 * Return the settings object for a particular table
	 *  @param {node} table table we are using as a dataTable
	 *  @returns {object} Settings object - or null if not found
	 *  @memberof DataTable#oApi
	 */
	function _fnSettingsFromNode ( table )
	{
		var settings = DataTable.settings;
		var idx = $.inArray( table, _pluck( settings, 'nTable' ) );
	
		return idx !== -1 ?
			settings[ idx ] :
			null;
	}
	
	
	/**
	 * Log an error message
	 *  @param {object} settings dataTables settings object
	 *  @param {int} level log error messages, or display them to the user
	 *  @param {string} msg error message
	 *  @param {int} tn Technical note id to get more information about the error.
	 *  @memberof DataTable#oApi
	 */
	function _fnLog( settings, level, msg, tn )
	{
		msg = 'DataTables warning: '+
			(settings ? 'table id='+settings.sTableId+' - ' : '')+msg;
	
		if ( tn ) {
			msg += '. For more information about this error, please see '+
			'http://datatables.net/tn/'+tn;
		}
	
		if ( ! level  ) {
			// Backwards compatibility pre 1.10
			var ext = DataTable.ext;
			var type = ext.sErrMode || ext.errMode;
	
			if ( settings ) {
				_fnCallbackFire( settings, null, 'error', [ settings, tn, msg ] );
			}
	
			if ( type == 'alert' ) {
				alert( msg );
			}
			else if ( type == 'throw' ) {
				throw new Error(msg);
			}
			else if ( typeof type == 'function' ) {
				type( settings, tn, msg );
			}
		}
		else if ( window.console && console.log ) {
			console.log( msg );
		}
	}
	
	
	/**
	 * See if a property is defined on one object, if so assign it to the other object
	 *  @param {object} ret target object
	 *  @param {object} src source object
	 *  @param {string} name property
	 *  @param {string} [mappedName] name to map too - optional, name used if not given
	 *  @memberof DataTable#oApi
	 */
	function _fnMap( ret, src, name, mappedName )
	{
		if ( Array.isArray( name ) ) {
			$.each( name, function (i, val) {
				if ( Array.isArray( val ) ) {
					_fnMap( ret, src, val[0], val[1] );
				}
				else {
					_fnMap( ret, src, val );
				}
			} );
	
			return;
		}
	
		if ( mappedName === undefined ) {
			mappedName = name;
		}
	
		if ( src[name] !== undefined ) {
			ret[mappedName] = src[name];
		}
	}
	
	
	/**
	 * Extend objects - very similar to jQuery.extend, but deep copy objects, and
	 * shallow copy arrays. The reason we need to do this, is that we don't want to
	 * deep copy array init values (such as aaSorting) since the dev wouldn't be
	 * able to override them, but we do want to deep copy arrays.
	 *  @param {object} out Object to extend
	 *  @param {object} extender Object from which the properties will be applied to
	 *      out
	 *  @param {boolean} breakRefs If true, then arrays will be sliced to take an
	 *      independent copy with the exception of the `data` or `aaData` parameters
	 *      if they are present. This is so you can pass in a collection to
	 *      DataTables and have that used as your data source without breaking the
	 *      references
	 *  @returns {object} out Reference, just for convenience - out === the return.
	 *  @memberof DataTable#oApi
	 *  @todo This doesn't take account of arrays inside the deep copied objects.
	 */
	function _fnExtend( out, extender, breakRefs )
	{
		var val;
	
		for ( var prop in extender ) {
			if ( extender.hasOwnProperty(prop) ) {
				val = extender[prop];
	
				if ( $.isPlainObject( val ) ) {
					if ( ! $.isPlainObject( out[prop] ) ) {
						out[prop] = {};
					}
					$.extend( true, out[prop], val );
				}
				else if ( breakRefs && prop !== 'data' && prop !== 'aaData' && Array.isArray(val) ) {
					out[prop] = val.slice();
				}
				else {
					out[prop] = val;
				}
			}
		}
	
		return out;
	}
	
	
	/**
	 * Bind an event handers to allow a click or return key to activate the callback.
	 * This is good for accessibility since a return on the keyboard will have the
	 * same effect as a click, if the element has focus.
	 *  @param {element} n Element to bind the action to
	 *  @param {object} oData Data object to pass to the triggered function
	 *  @param {function} fn Callback function for when the event is triggered
	 *  @memberof DataTable#oApi
	 */
	function _fnBindAction( n, oData, fn )
	{
		$(n)
			.on( 'click.DT', oData, function (e) {
					$(n).trigger('blur'); // Remove focus outline for mouse users
					fn(e);
				} )
			.on( 'keypress.DT', oData, function (e){
					if ( e.which === 13 ) {
						e.preventDefault();
						fn(e);
					}
				} )
			.on( 'selectstart.DT', function () {
					/* Take the brutal approach to cancelling text selection */
					return false;
				} );
	}
	
	
	/**
	 * Register a callback function. Easily allows a callback function to be added to
	 * an array store of callback functions that can then all be called together.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sStore Name of the array storage for the callbacks in oSettings
	 *  @param {function} fn Function to be called back
	 *  @param {string} sName Identifying name for the callback (i.e. a label)
	 *  @memberof DataTable#oApi
	 */
	function _fnCallbackReg( oSettings, sStore, fn, sName )
	{
		if ( fn )
		{
			oSettings[sStore].push( {
				"fn": fn,
				"sName": sName
			} );
		}
	}
	
	
	/**
	 * Fire callback functions and trigger events. Note that the loop over the
	 * callback array store is done backwards! Further note that you do not want to
	 * fire off triggers in time sensitive applications (for example cell creation)
	 * as its slow.
	 *  @param {object} settings dataTables settings object
	 *  @param {string} callbackArr Name of the array storage for the callbacks in
	 *      oSettings
	 *  @param {string} eventName Name of the jQuery custom event to trigger. If
	 *      null no trigger is fired
	 *  @param {array} args Array of arguments to pass to the callback function /
	 *      trigger
	 *  @memberof DataTable#oApi
	 */
	function _fnCallbackFire( settings, callbackArr, eventName, args )
	{
		var ret = [];
	
		if ( callbackArr ) {
			ret = $.map( settings[callbackArr].slice().reverse(), function (val, i) {
				return val.fn.apply( settings.oInstance, args );
			} );
		}
	
		if ( eventName !== null ) {
			var e = $.Event( eventName+'.dt' );
	
			$(settings.nTable).trigger( e, args );
	
			ret.push( e.result );
		}
	
		return ret;
	}
	
	
	function _fnLengthOverflow ( settings )
	{
		var
			start = settings._iDisplayStart,
			end = settings.fnDisplayEnd(),
			len = settings._iDisplayLength;
	
		/* If we have space to show extra rows (backing up from the end point - then do so */
		if ( start >= end )
		{
			start = end - len;
		}
	
		// Keep the start record on the current page
		start -= (start % len);
	
		if ( len === -1 || start < 0 )
		{
			start = 0;
		}
	
		settings._iDisplayStart = start;
	}
	
	
	function _fnRenderer( settings, type )
	{
		var renderer = settings.renderer;
		var host = DataTable.ext.renderer[type];
	
		if ( $.isPlainObject( renderer ) && renderer[type] ) {
			// Specific renderer for this type. If available use it, otherwise use
			// the default.
			return host[renderer[type]] || host._;
		}
		else if ( typeof renderer === 'string' ) {
			// Common renderer - if there is one available for this type use it,
			// otherwise use the default
			return host[renderer] || host._;
		}
	
		// Use the default
		return host._;
	}
	
	
	/**
	 * Detect the data source being used for the table. Used to simplify the code
	 * a little (ajax) and to make it compress a little smaller.
	 *
	 *  @param {object} settings dataTables settings object
	 *  @returns {string} Data source
	 *  @memberof DataTable#oApi
	 */
	function _fnDataSource ( settings )
	{
		if ( settings.oFeatures.bServerSide ) {
			return 'ssp';
		}
		else if ( settings.ajax || settings.sAjaxSource ) {
			return 'ajax';
		}
		return 'dom';
	}
	

	
	
	/**
	 * Computed structure of the DataTables API, defined by the options passed to
	 * `DataTable.Api.register()` when building the API.
	 *
	 * The structure is built in order to speed creation and extension of the Api
	 * objects since the extensions are effectively pre-parsed.
	 *
	 * The array is an array of objects with the following structure, where this
	 * base array represents the Api prototype base:
	 *
	 *     [
	 *       {
	 *         name:      'data'                -- string   - Property name
	 *         val:       function () {},       -- function - Api method (or undefined if just an object
	 *         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
	 *         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
	 *       },
	 *       {
	 *         name:     'row'
	 *         val:       {},
	 *         methodExt: [ ... ],
	 *         propExt:   [
	 *           {
	 *             name:      'data'
	 *             val:       function () {},
	 *             methodExt: [ ... ],
	 *             propExt:   [ ... ]
	 *           },
	 *           ...
	 *         ]
	 *       }
	 *     ]
	 *
	 * @type {Array}
	 * @ignore
	 */
	var __apiStruct = [];
	
	
	/**
	 * `Array.prototype` reference.
	 *
	 * @type object
	 * @ignore
	 */
	var __arrayProto = Array.prototype;
	
	
	/**
	 * Abstraction for `context` parameter of the `Api` constructor to allow it to
	 * take several different forms for ease of use.
	 *
	 * Each of the input parameter types will be converted to a DataTables settings
	 * object where possible.
	 *
	 * @param  {string|node|jQuery|object} mixed DataTable identifier. Can be one
	 *   of:
	 *
	 *   * `string` - jQuery selector. Any DataTables' matching the given selector
	 *     with be found and used.
	 *   * `node` - `TABLE` node which has already been formed into a DataTable.
	 *   * `jQuery` - A jQuery object of `TABLE` nodes.
	 *   * `object` - DataTables settings object
	 *   * `DataTables.Api` - API instance
	 * @return {array|null} Matching DataTables settings objects. `null` or
	 *   `undefined` is returned if no matching DataTable is found.
	 * @ignore
	 */
	var _toSettings = function ( mixed )
	{
		var idx, jq;
		var settings = DataTable.settings;
		var tables = $.map( settings, function (el, i) {
			return el.nTable;
		} );
	
		if ( ! mixed ) {
			return [];
		}
		else if ( mixed.nTable && mixed.oApi ) {
			// DataTables settings object
			return [ mixed ];
		}
		else if ( mixed.nodeName && mixed.nodeName.toLowerCase() === 'table' ) {
			// Table node
			idx = $.inArray( mixed, tables );
			return idx !== -1 ? [ settings[idx] ] : null;
		}
		else if ( mixed && typeof mixed.settings === 'function' ) {
			return mixed.settings().toArray();
		}
		else if ( typeof mixed === 'string' ) {
			// jQuery selector
			jq = $(mixed);
		}
		else if ( mixed instanceof $ ) {
			// jQuery object (also DataTables instance)
			jq = mixed;
		}
	
		if ( jq ) {
			return jq.map( function(i) {
				idx = $.inArray( this, tables );
				return idx !== -1 ? settings[idx] : null;
			} ).toArray();
		}
	};
	
	
	/**
	 * DataTables API class - used to control and interface with  one or more
	 * DataTables enhanced tables.
	 *
	 * The API class is heavily based on jQuery, presenting a chainable interface
	 * that you can use to interact with tables. Each instance of the API class has
	 * a "context" - i.e. the tables that it will operate on. This could be a single
	 * table, all tables on a page or a sub-set thereof.
	 *
	 * Additionally the API is designed to allow you to easily work with the data in
	 * the tables, retrieving and manipulating it as required. This is done by
	 * presenting the API class as an array like interface. The contents of the
	 * array depend upon the actions requested by each method (for example
	 * `rows().nodes()` will return an array of nodes, while `rows().data()` will
	 * return an array of objects or arrays depending upon your table's
	 * configuration). The API object has a number of array like methods (`push`,
	 * `pop`, `reverse` etc) as well as additional helper methods (`each`, `pluck`,
	 * `unique` etc) to assist your working with the data held in a table.
	 *
	 * Most methods (those which return an Api instance) are chainable, which means
	 * the return from a method call also has all of the methods available that the
	 * top level object had. For example, these two calls are equivalent:
	 *
	 *     // Not chained
	 *     api.row.add( {...} );
	 *     api.draw();
	 *
	 *     // Chained
	 *     api.row.add( {...} ).draw();
	 *
	 * @class DataTable.Api
	 * @param {array|object|string|jQuery} context DataTable identifier. This is
	 *   used to define which DataTables enhanced tables this API will operate on.
	 *   Can be one of:
	 *
	 *   * `string` - jQuery selector. Any DataTables' matching the given selector
	 *     with be found and used.
	 *   * `node` - `TABLE` node which has already been formed into a DataTable.
	 *   * `jQuery` - A jQuery object of `TABLE` nodes.
	 *   * `object` - DataTables settings object
	 * @param {array} [data] Data to initialise the Api instance with.
	 *
	 * @example
	 *   // Direct initialisation during DataTables construction
	 *   var api = $('#example').DataTable();
	 *
	 * @example
	 *   // Initialisation using a DataTables jQuery object
	 *   var api = $('#example').dataTable().api();
	 *
	 * @example
	 *   // Initialisation as a constructor
	 *   var api = new $.fn.DataTable.Api( 'table.dataTable' );
	 */
	_Api = function ( context, data )
	{
		if ( ! (this instanceof _Api) ) {
			return new _Api( context, data );
		}
	
		var settings = [];
		var ctxSettings = function ( o ) {
			var a = _toSettings( o );
			if ( a ) {
				settings.push.apply( settings, a );
			}
		};
	
		if ( Array.isArray( context ) ) {
			for ( var i=0, ien=context.length ; i<ien ; i++ ) {
				ctxSettings( context[i] );
			}
		}
		else {
			ctxSettings( context );
		}
	
		// Remove duplicates
		this.context = _unique( settings );
	
		// Initial data
		if ( data ) {
			$.merge( this, data );
		}
	
		// selector
		this.selector = {
			rows: null,
			cols: null,
			opts: null
		};
	
		_Api.extend( this, this, __apiStruct );
	};
	
	DataTable.Api = _Api;
	
	// Don't destroy the existing prototype, just extend it. Required for jQuery 2's
	// isPlainObject.
	$.extend( _Api.prototype, {
		any: function ()
		{
			return this.count() !== 0;
		},
	
	
		concat:  __arrayProto.concat,
	
	
		context: [], // array of table settings objects
	
	
		count: function ()
		{
			return this.flatten().length;
		},
	
	
		each: function ( fn )
		{
			for ( var i=0, ien=this.length ; i<ien; i++ ) {
				fn.call( this, this[i], i, this );
			}
	
			return this;
		},
	
	
		eq: function ( idx )
		{
			var ctx = this.context;
	
			return ctx.length > idx ?
				new _Api( ctx[idx], this[idx] ) :
				null;
		},
	
	
		filter: function ( fn )
		{
			var a = [];
	
			if ( __arrayProto.filter ) {
				a = __arrayProto.filter.call( this, fn, this );
			}
			else {
				// Compatibility for browsers without EMCA-252-5 (JS 1.6)
				for ( var i=0, ien=this.length ; i<ien ; i++ ) {
					if ( fn.call( this, this[i], i, this ) ) {
						a.push( this[i] );
					}
				}
			}
	
			return new _Api( this.context, a );
		},
	
	
		flatten: function ()
		{
			var a = [];
			return new _Api( this.context, a.concat.apply( a, this.toArray() ) );
		},
	
	
		join:    __arrayProto.join,
	
	
		indexOf: __arrayProto.indexOf || function (obj, start)
		{
			for ( var i=(start || 0), ien=this.length ; i<ien ; i++ ) {
				if ( this[i] === obj ) {
					return i;
				}
			}
			return -1;
		},
	
		iterator: function ( flatten, type, fn, alwaysNew ) {
			var
				a = [], ret,
				i, ien, j, jen,
				context = this.context,
				rows, items, item,
				selector = this.selector;
	
			// Argument shifting
			if ( typeof flatten === 'string' ) {
				alwaysNew = fn;
				fn = type;
				type = flatten;
				flatten = false;
			}
	
			for ( i=0, ien=context.length ; i<ien ; i++ ) {
				var apiInst = new _Api( context[i] );
	
				if ( type === 'table' ) {
					ret = fn.call( apiInst, context[i], i );
	
					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
				else if ( type === 'columns' || type === 'rows' ) {
					// this has same length as context - one entry for each table
					ret = fn.call( apiInst, context[i], this[i], i );
	
					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
				else if ( type === 'column' || type === 'column-rows' || type === 'row' || type === 'cell' ) {
					// columns and rows share the same structure.
					// 'this' is an array of column indexes for each context
					items = this[i];
	
					if ( type === 'column-rows' ) {
						rows = _selector_row_indexes( context[i], selector.opts );
					}
	
					for ( j=0, jen=items.length ; j<jen ; j++ ) {
						item = items[j];
	
						if ( type === 'cell' ) {
							ret = fn.call( apiInst, context[i], item.row, item.column, i, j );
						}
						else {
							ret = fn.call( apiInst, context[i], item, i, j, rows );
						}
	
						if ( ret !== undefined ) {
							a.push( ret );
						}
					}
				}
			}
	
			if ( a.length || alwaysNew ) {
				var api = new _Api( context, flatten ? a.concat.apply( [], a ) : a );
				var apiSelector = api.selector;
				apiSelector.rows = selector.rows;
				apiSelector.cols = selector.cols;
				apiSelector.opts = selector.opts;
				return api;
			}
			return this;
		},
	
	
		lastIndexOf: __arrayProto.lastIndexOf || function (obj, start)
		{
			// Bit cheeky...
			return this.indexOf.apply( this.toArray.reverse(), arguments );
		},
	
	
		length:  0,
	
	
		map: function ( fn )
		{
			var a = [];
	
			if ( __arrayProto.map ) {
				a = __arrayProto.map.call( this, fn, this );
			}
			else {
				// Compatibility for browsers without EMCA-252-5 (JS 1.6)
				for ( var i=0, ien=this.length ; i<ien ; i++ ) {
					a.push( fn.call( this, this[i], i ) );
				}
			}
	
			return new _Api( this.context, a );
		},
	
	
		pluck: function ( prop )
		{
			return this.map( function ( el ) {
				return el[ prop ];
			} );
		},
	
		pop:     __arrayProto.pop,
	
	
		push:    __arrayProto.push,
	
	
		// Does not return an API instance
		reduce: __arrayProto.reduce || function ( fn, init )
		{
			return _fnReduce( this, fn, init, 0, this.length, 1 );
		},
	
	
		reduceRight: __arrayProto.reduceRight || function ( fn, init )
		{
			return _fnReduce( this, fn, init, this.length-1, -1, -1 );
		},
	
	
		reverse: __arrayProto.reverse,
	
	
		// Object with rows, columns and opts
		selector: null,
	
	
		shift:   __arrayProto.shift,
	
	
		slice: function () {
			return new _Api( this.context, this );
		},
	
	
		sort:    __arrayProto.sort, // ? name - order?
	
	
		splice:  __arrayProto.splice,
	
	
		toArray: function ()
		{
			return __arrayProto.slice.call( this );
		},
	
	
		to$: function ()
		{
			return $( this );
		},
	
	
		toJQuery: function ()
		{
			return $( this );
		},
	
	
		unique: function ()
		{
			return new _Api( this.context, _unique(this) );
		},
	
	
		unshift: __arrayProto.unshift
	} );
	
	
	_Api.extend = function ( scope, obj, ext )
	{
		// Only extend API instances and static properties of the API
		if ( ! ext.length || ! obj || ( ! (obj instanceof _Api) && ! obj.__dt_wrapper ) ) {
			return;
		}
	
		var
			i, ien,
			struct,
			methodScoping = function ( scope, fn, struc ) {
				return function () {
					var ret = fn.apply( scope, arguments );
	
					// Method extension
					_Api.extend( ret, ret, struc.methodExt );
					return ret;
				};
			};
	
		for ( i=0, ien=ext.length ; i<ien ; i++ ) {
			struct = ext[i];
	
			// Value
			obj[ struct.name ] = struct.type === 'function' ?
				methodScoping( scope, struct.val, struct ) :
				struct.type === 'object' ?
					{} :
					struct.val;
	
			obj[ struct.name ].__dt_wrapper = true;
	
			// Property extension
			_Api.extend( scope, obj[ struct.name ], struct.propExt );
		}
	};
	
	
	// @todo - Is there need for an augment function?
	// _Api.augment = function ( inst, name )
	// {
	// 	// Find src object in the structure from the name
	// 	var parts = name.split('.');
	
	// 	_Api.extend( inst, obj );
	// };
	
	
	//     [
	//       {
	//         name:      'data'                -- string   - Property name
	//         val:       function () {},       -- function - Api method (or undefined if just an object
	//         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
	//         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
	//       },
	//       {
	//         name:     'row'
	//         val:       {},
	//         methodExt: [ ... ],
	//         propExt:   [
	//           {
	//             name:      'data'
	//             val:       function () {},
	//             methodExt: [ ... ],
	//             propExt:   [ ... ]
	//           },
	//           ...
	//         ]
	//       }
	//     ]
	
	_Api.register = _api_register = function ( name, val )
	{
		if ( Array.isArray( name ) ) {
			for ( var j=0, jen=name.length ; j<jen ; j++ ) {
				_Api.register( name[j], val );
			}
			return;
		}
	
		var
			i, ien,
			heir = name.split('.'),
			struct = __apiStruct,
			key, method;
	
		var find = function ( src, name ) {
			for ( var i=0, ien=src.length ; i<ien ; i++ ) {
				if ( src[i].name === name ) {
					return src[i];
				}
			}
			return null;
		};
	
		for ( i=0, ien=heir.length ; i<ien ; i++ ) {
			method = heir[i].indexOf('()') !== -1;
			key = method ?
				heir[i].replace('()', '') :
				heir[i];
	
			var src = find( struct, key );
			if ( ! src ) {
				src = {
					name:      key,
					val:       {},
					methodExt: [],
					propExt:   [],
					type:      'object'
				};
				struct.push( src );
			}
	
			if ( i === ien-1 ) {
				src.val = val;
				src.type = typeof val === 'function' ?
					'function' :
					$.isPlainObject( val ) ?
						'object' :
						'other';
			}
			else {
				struct = method ?
					src.methodExt :
					src.propExt;
			}
		}
	};
	
	_Api.registerPlural = _api_registerPlural = function ( pluralName, singularName, val ) {
		_Api.register( pluralName, val );
	
		_Api.register( singularName, function () {
			var ret = val.apply( this, arguments );
	
			if ( ret === this ) {
				// Returned item is the API instance that was passed in, return it
				return this;
			}
			else if ( ret instanceof _Api ) {
				// New API instance returned, want the value from the first item
				// in the returned array for the singular result.
				return ret.length ?
					Array.isArray( ret[0] ) ?
						new _Api( ret.context, ret[0] ) : // Array results are 'enhanced'
						ret[0] :
					undefined;
			}
	
			// Non-API return - just fire it back
			return ret;
		} );
	};
	
	
	/**
	 * Selector for HTML tables. Apply the given selector to the give array of
	 * DataTables settings objects.
	 *
	 * @param {string|integer} [selector] jQuery selector string or integer
	 * @param  {array} Array of DataTables settings objects to be filtered
	 * @return {array}
	 * @ignore
	 */
	var __table_selector = function ( selector, a )
	{
		if ( Array.isArray(selector) ) {
			return $.map( selector, function (item) {
				return __table_selector(item, a);
			} );
		}
	
		// Integer is used to pick out a table by index
		if ( typeof selector === 'number' ) {
			return [ a[ selector ] ];
		}
	
		// Perform a jQuery selector on the table nodes
		var nodes = $.map( a, function (el, i) {
			return el.nTable;
		} );
	
		return $(nodes)
			.filter( selector )
			.map( function (i) {
				// Need to translate back from the table node to the settings
				var idx = $.inArray( this, nodes );
				return a[ idx ];
			} )
			.toArray();
	};
	
	
	
	/**
	 * Context selector for the API's context (i.e. the tables the API instance
	 * refers to.
	 *
	 * @name    DataTable.Api#tables
	 * @param {string|integer} [selector] Selector to pick which tables the iterator
	 *   should operate on. If not given, all tables in the current context are
	 *   used. This can be given as a jQuery selector (for example `':gt(0)'`) to
	 *   select multiple tables or as an integer to select a single table.
	 * @returns {DataTable.Api} Returns a new API instance if a selector is given.
	 */
	_api_register( 'tables()', function ( selector ) {
		// A new instance is created if there was a selector specified
		return selector !== undefined && selector !== null ?
			new _Api( __table_selector( selector, this.context ) ) :
			this;
	} );
	
	
	_api_register( 'table()', function ( selector ) {
		var tables = this.tables( selector );
		var ctx = tables.context;
	
		// Truncate to the first matched table
		return ctx.length ?
			new _Api( ctx[0] ) :
			tables;
	} );
	
	
	_api_registerPlural( 'tables().nodes()', 'table().node()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTable;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().body()', 'table().body()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTBody;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().header()', 'table().header()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTHead;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().footer()', 'table().footer()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTFoot;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().containers()', 'table().container()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTableWrapper;
		}, 1 );
	} );
	
	
	
	/**
	 * Redraw the tables in the current context.
	 */
	_api_register( 'draw()', function ( paging ) {
		return this.iterator( 'table', function ( settings ) {
			if ( paging === 'page' ) {
				_fnDraw( settings );
			}
			else {
				if ( typeof paging === 'string' ) {
					paging = paging === 'full-hold' ?
						false :
						true;
				}
	
				_fnReDraw( settings, paging===false );
			}
		} );
	} );
	
	
	
	/**
	 * Get the current page index.
	 *
	 * @return {integer} Current page index (zero based)
	 *//**
	 * Set the current page.
	 *
	 * Note that if you attempt to show a page which does not exist, DataTables will
	 * not throw an error, but rather reset the paging.
	 *
	 * @param {integer|string} action The paging action to take. This can be one of:
	 *  * `integer` - The page index to jump to
	 *  * `string` - An action to take:
	 *    * `first` - Jump to first page.
	 *    * `next` - Jump to the next page
	 *    * `previous` - Jump to previous page
	 *    * `last` - Jump to the last page.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'page()', function ( action ) {
		if ( action === undefined ) {
			return this.page.info().page; // not an expensive call
		}
	
		// else, have an action to take on all tables
		return this.iterator( 'table', function ( settings ) {
			_fnPageChange( settings, action );
		} );
	} );
	
	
	/**
	 * Paging information for the first table in the current context.
	 *
	 * If you require paging information for another table, use the `table()` method
	 * with a suitable selector.
	 *
	 * @return {object} Object with the following properties set:
	 *  * `page` - Current page index (zero based - i.e. the first page is `0`)
	 *  * `pages` - Total number of pages
	 *  * `start` - Display index for the first record shown on the current page
	 *  * `end` - Display index for the last record shown on the current page
	 *  * `length` - Display length (number of records). Note that generally `start
	 *    + length = end`, but this is not always true, for example if there are
	 *    only 2 records to show on the final page, with a length of 10.
	 *  * `recordsTotal` - Full data set length
	 *  * `recordsDisplay` - Data set length once the current filtering criterion
	 *    are applied.
	 */
	_api_register( 'page.info()', function ( action ) {
		if ( this.context.length === 0 ) {
			return undefined;
		}
	
		var
			settings   = this.context[0],
			start      = settings._iDisplayStart,
			len        = settings.oFeatures.bPaginate ? settings._iDisplayLength : -1,
			visRecords = settings.fnRecordsDisplay(),
			all        = len === -1;
	
		return {
			"page":           all ? 0 : Math.floor( start / len ),
			"pages":          all ? 1 : Math.ceil( visRecords / len ),
			"start":          start,
			"end":            settings.fnDisplayEnd(),
			"length":         len,
			"recordsTotal":   settings.fnRecordsTotal(),
			"recordsDisplay": visRecords,
			"serverSide":     _fnDataSource( settings ) === 'ssp'
		};
	} );
	
	
	/**
	 * Get the current page length.
	 *
	 * @return {integer} Current page length. Note `-1` indicates that all records
	 *   are to be shown.
	 *//**
	 * Set the current page length.
	 *
	 * @param {integer} Page length to set. Use `-1` to show all records.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'page.len()', function ( len ) {
		// Note that we can't call this function 'length()' because `length`
		// is a Javascript property of functions which defines how many arguments
		// the function expects.
		if ( len === undefined ) {
			return this.context.length !== 0 ?
				this.context[0]._iDisplayLength :
				undefined;
		}
	
		// else, set the page length
		return this.iterator( 'table', function ( settings ) {
			_fnLengthChange( settings, len );
		} );
	} );
	
	
	
	var __reload = function ( settings, holdPosition, callback ) {
		// Use the draw event to trigger a callback
		if ( callback ) {
			var api = new _Api( settings );
	
			api.one( 'draw', function () {
				callback( api.ajax.json() );
			} );
		}
	
		if ( _fnDataSource( settings ) == 'ssp' ) {
			_fnReDraw( settings, holdPosition );
		}
		else {
			_fnProcessingDisplay( settings, true );
	
			// Cancel an existing request
			var xhr = settings.jqXHR;
			if ( xhr && xhr.readyState !== 4 ) {
				xhr.abort();
			}
	
			// Trigger xhr
			_fnBuildAjax( settings, [], function( json ) {
				_fnClearTable( settings );
	
				var data = _fnAjaxDataSrc( settings, json );
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					_fnAddData( settings, data[i] );
				}
	
				_fnReDraw( settings, holdPosition );
				_fnProcessingDisplay( settings, false );
			} );
		}
	};
	
	
	/**
	 * Get the JSON response from the last Ajax request that DataTables made to the
	 * server. Note that this returns the JSON from the first table in the current
	 * context.
	 *
	 * @return {object} JSON received from the server.
	 */
	_api_register( 'ajax.json()', function () {
		var ctx = this.context;
	
		if ( ctx.length > 0 ) {
			return ctx[0].json;
		}
	
		// else return undefined;
	} );
	
	
	/**
	 * Get the data submitted in the last Ajax request
	 */
	_api_register( 'ajax.params()', function () {
		var ctx = this.context;
	
		if ( ctx.length > 0 ) {
			return ctx[0].oAjaxData;
		}
	
		// else return undefined;
	} );
	
	
	/**
	 * Reload tables from the Ajax data source. Note that this function will
	 * automatically re-draw the table when the remote data has been loaded.
	 *
	 * @param {boolean} [reset=true] Reset (default) or hold the current paging
	 *   position. A full re-sort and re-filter is performed when this method is
	 *   called, which is why the pagination reset is the default action.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.reload()', function ( callback, resetPaging ) {
		return this.iterator( 'table', function (settings) {
			__reload( settings, resetPaging===false, callback );
		} );
	} );
	
	
	/**
	 * Get the current Ajax URL. Note that this returns the URL from the first
	 * table in the current context.
	 *
	 * @return {string} Current Ajax source URL
	 *//**
	 * Set the Ajax URL. Note that this will set the URL for all tables in the
	 * current context.
	 *
	 * @param {string} url URL to set.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.url()', function ( url ) {
		var ctx = this.context;
	
		if ( url === undefined ) {
			// get
			if ( ctx.length === 0 ) {
				return undefined;
			}
			ctx = ctx[0];
	
			return ctx.ajax ?
				$.isPlainObject( ctx.ajax ) ?
					ctx.ajax.url :
					ctx.ajax :
				ctx.sAjaxSource;
		}
	
		// set
		return this.iterator( 'table', function ( settings ) {
			if ( $.isPlainObject( settings.ajax ) ) {
				settings.ajax.url = url;
			}
			else {
				settings.ajax = url;
			}
			// No need to consider sAjaxSource here since DataTables gives priority
			// to `ajax` over `sAjaxSource`. So setting `ajax` here, renders any
			// value of `sAjaxSource` redundant.
		} );
	} );
	
	
	/**
	 * Load data from the newly set Ajax URL. Note that this method is only
	 * available when `ajax.url()` is used to set a URL. Additionally, this method
	 * has the same effect as calling `ajax.reload()` but is provided for
	 * convenience when setting a new URL. Like `ajax.reload()` it will
	 * automatically redraw the table once the remote data has been loaded.
	 *
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.url().load()', function ( callback, resetPaging ) {
		// Same as a reload, but makes sense to present it for easy access after a
		// url change
		return this.iterator( 'table', function ( ctx ) {
			__reload( ctx, resetPaging===false, callback );
		} );
	} );
	
	
	
	
	var _selector_run = function ( type, selector, selectFn, settings, opts )
	{
		var
			out = [], res,
			a, i, ien, j, jen,
			selectorType = typeof selector;
	
		// Can't just check for isArray here, as an API or jQuery instance might be
		// given with their array like look
		if ( ! selector || selectorType === 'string' || selectorType === 'function' || selector.length === undefined ) {
			selector = [ selector ];
		}
	
		for ( i=0, ien=selector.length ; i<ien ; i++ ) {
			// Only split on simple strings - complex expressions will be jQuery selectors
			a = selector[i] && selector[i].split && ! selector[i].match(/[\[\(:]/) ?
				selector[i].split(',') :
				[ selector[i] ];
	
			for ( j=0, jen=a.length ; j<jen ; j++ ) {
				res = selectFn( typeof a[j] === 'string' ? (a[j]).trim() : a[j] );
	
				if ( res && res.length ) {
					out = out.concat( res );
				}
			}
		}
	
		// selector extensions
		var ext = _ext.selector[ type ];
		if ( ext.length ) {
			for ( i=0, ien=ext.length ; i<ien ; i++ ) {
				out = ext[i]( settings, opts, out );
			}
		}
	
		return _unique( out );
	};
	
	
	var _selector_opts = function ( opts )
	{
		if ( ! opts ) {
			opts = {};
		}
	
		// Backwards compatibility for 1.9- which used the terminology filter rather
		// than search
		if ( opts.filter && opts.search === undefined ) {
			opts.search = opts.filter;
		}
	
		return $.extend( {
			search: 'none',
			order: 'current',
			page: 'all'
		}, opts );
	};
	
	
	var _selector_first = function ( inst )
	{
		// Reduce the API instance to the first item found
		for ( var i=0, ien=inst.length ; i<ien ; i++ ) {
			if ( inst[i].length > 0 ) {
				// Assign the first element to the first item in the instance
				// and truncate the instance and context
				inst[0] = inst[i];
				inst[0].length = 1;
				inst.length = 1;
				inst.context = [ inst.context[i] ];
	
				return inst;
			}
		}
	
		// Not found - return an empty instance
		inst.length = 0;
		return inst;
	};
	
	
	var _selector_row_indexes = function ( settings, opts )
	{
		var
			i, ien, tmp, a=[],
			displayFiltered = settings.aiDisplay,
			displayMaster = settings.aiDisplayMaster;
	
		var
			search = opts.search,  // none, applied, removed
			order  = opts.order,   // applied, current, index (original - compatibility with 1.9)
			page   = opts.page;    // all, current
	
		if ( _fnDataSource( settings ) == 'ssp' ) {
			// In server-side processing mode, most options are irrelevant since
			// rows not shown don't exist and the index order is the applied order
			// Removed is a special case - for consistency just return an empty
			// array
			return search === 'removed' ?
				[] :
				_range( 0, displayMaster.length );
		}
		else if ( page == 'current' ) {
			// Current page implies that order=current and fitler=applied, since it is
			// fairly senseless otherwise, regardless of what order and search actually
			// are
			for ( i=settings._iDisplayStart, ien=settings.fnDisplayEnd() ; i<ien ; i++ ) {
				a.push( displayFiltered[i] );
			}
		}
		else if ( order == 'current' || order == 'applied' ) {
			if ( search == 'none') {
				a = displayMaster.slice();
			}
			else if ( search == 'applied' ) {
				a = displayFiltered.slice();
			}
			else if ( search == 'removed' ) {
				// O(n+m) solution by creating a hash map
				var displayFilteredMap = {};
	
				for ( var i=0, ien=displayFiltered.length ; i<ien ; i++ ) {
					displayFilteredMap[displayFiltered[i]] = null;
				}
	
				a = $.map( displayMaster, function (el) {
					return ! displayFilteredMap.hasOwnProperty(el) ?
						el :
						null;
				} );
			}
		}
		else if ( order == 'index' || order == 'original' ) {
			for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				if ( search == 'none' ) {
					a.push( i );
				}
				else { // applied | removed
					tmp = $.inArray( i, displayFiltered );
	
					if ((tmp === -1 && search == 'removed') ||
						(tmp >= 0   && search == 'applied') )
					{
						a.push( i );
					}
				}
			}
		}
	
		return a;
	};
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Rows
	 *
	 * {}          - no selector - use all available rows
	 * {integer}   - row aoData index
	 * {node}      - TR node
	 * {string}    - jQuery selector to apply to the TR elements
	 * {array}     - jQuery array of nodes, or simply an array of TR nodes
	 *
	 */
	var __row_selector = function ( settings, selector, opts )
	{
		var rows;
		var run = function ( sel ) {
			var selInt = _intVal( sel );
			var i, ien;
			var aoData = settings.aoData;
	
			// Short cut - selector is a number and no options provided (default is
			// all records, so no need to check if the index is in there, since it
			// must be - dev error if the index doesn't exist).
			if ( selInt !== null && ! opts ) {
				return [ selInt ];
			}
	
			if ( ! rows ) {
				rows = _selector_row_indexes( settings, opts );
			}
	
			if ( selInt !== null && $.inArray( selInt, rows ) !== -1 ) {
				// Selector - integer
				return [ selInt ];
			}
			else if ( sel === null || sel === undefined || sel === '' ) {
				// Selector - none
				return rows;
			}
	
			// Selector - function
			if ( typeof sel === 'function' ) {
				return $.map( rows, function (idx) {
					var row = aoData[ idx ];
					return sel( idx, row._aData, row.nTr ) ? idx : null;
				} );
			}
	
			// Selector - node
			if ( sel.nodeName ) {
				var rowIdx = sel._DT_RowIndex;  // Property added by DT for fast lookup
				var cellIdx = sel._DT_CellIndex;
	
				if ( rowIdx !== undefined ) {
					// Make sure that the row is actually still present in the table
					return aoData[ rowIdx ] && aoData[ rowIdx ].nTr === sel ?
						[ rowIdx ] :
						[];
				}
				else if ( cellIdx ) {
					return aoData[ cellIdx.row ] && aoData[ cellIdx.row ].nTr === sel.parentNode ?
						[ cellIdx.row ] :
						[];
				}
				else {
					var host = $(sel).closest('*[data-dt-row]');
					return host.length ?
						[ host.data('dt-row') ] :
						[];
				}
			}
	
			// ID selector. Want to always be able to select rows by id, regardless
			// of if the tr element has been created or not, so can't rely upon
			// jQuery here - hence a custom implementation. This does not match
			// Sizzle's fast selector or HTML4 - in HTML5 the ID can be anything,
			// but to select it using a CSS selector engine (like Sizzle or
			// querySelect) it would need to need to be escaped for some characters.
			// DataTables simplifies this for row selectors since you can select
			// only a row. A # indicates an id any anything that follows is the id -
			// unescaped.
			if ( typeof sel === 'string' && sel.charAt(0) === '#' ) {
				// get row index from id
				var rowObj = settings.aIds[ sel.replace( /^#/, '' ) ];
				if ( rowObj !== undefined ) {
					return [ rowObj.idx ];
				}
	
				// need to fall through to jQuery in case there is DOM id that
				// matches
			}
			
			// Get nodes in the order from the `rows` array with null values removed
			var nodes = _removeEmpty(
				_pluck_order( settings.aoData, rows, 'nTr' )
			);
	
			// Selector - jQuery selector string, array of nodes or jQuery object/
			// As jQuery's .filter() allows jQuery objects to be passed in filter,
			// it also allows arrays, so this will cope with all three options
			return $(nodes)
				.filter( sel )
				.map( function () {
					return this._DT_RowIndex;
				} )
				.toArray();
		};
	
		return _selector_run( 'row', selector, run, settings, opts );
	};
	
	
	_api_register( 'rows()', function ( selector, opts ) {
		// argument shifting
		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}
	
		opts = _selector_opts( opts );
	
		var inst = this.iterator( 'table', function ( settings ) {
			return __row_selector( settings, selector, opts );
		}, 1 );
	
		// Want argument shifting here and in __row_selector?
		inst.selector.rows = selector;
		inst.selector.opts = opts;
	
		return inst;
	} );
	
	_api_register( 'rows().nodes()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return settings.aoData[ row ].nTr || undefined;
		}, 1 );
	} );
	
	_api_register( 'rows().data()', function () {
		return this.iterator( true, 'rows', function ( settings, rows ) {
			return _pluck_order( settings.aoData, rows, '_aData' );
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().cache()', 'row().cache()', function ( type ) {
		return this.iterator( 'row', function ( settings, row ) {
			var r = settings.aoData[ row ];
			return type === 'search' ? r._aFilterData : r._aSortData;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().invalidate()', 'row().invalidate()', function ( src ) {
		return this.iterator( 'row', function ( settings, row ) {
			_fnInvalidate( settings, row, src );
		} );
	} );
	
	_api_registerPlural( 'rows().indexes()', 'row().index()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return row;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().ids()', 'row().id()', function ( hash ) {
		var a = [];
		var context = this.context;
	
		// `iterator` will drop undefined values, but in this case we want them
		for ( var i=0, ien=context.length ; i<ien ; i++ ) {
			for ( var j=0, jen=this[i].length ; j<jen ; j++ ) {
				var id = context[i].rowIdFn( context[i].aoData[ this[i][j] ]._aData );
				a.push( (hash === true ? '#' : '' )+ id );
			}
		}
	
		return new _Api( context, a );
	} );
	
	_api_registerPlural( 'rows().remove()', 'row().remove()', function () {
		var that = this;
	
		this.iterator( 'row', function ( settings, row, thatIdx ) {
			var data = settings.aoData;
			var rowData = data[ row ];
			var i, ien, j, jen;
			var loopRow, loopCells;
	
			data.splice( row, 1 );
	
			// Update the cached indexes
			for ( i=0, ien=data.length ; i<ien ; i++ ) {
				loopRow = data[i];
				loopCells = loopRow.anCells;
	
				// Rows
				if ( loopRow.nTr !== null ) {
					loopRow.nTr._DT_RowIndex = i;
				}
	
				// Cells
				if ( loopCells !== null ) {
					for ( j=0, jen=loopCells.length ; j<jen ; j++ ) {
						loopCells[j]._DT_CellIndex.row = i;
					}
				}
			}
	
			// Delete from the display arrays
			_fnDeleteIndex( settings.aiDisplayMaster, row );
			_fnDeleteIndex( settings.aiDisplay, row );
			_fnDeleteIndex( that[ thatIdx ], row, false ); // maintain local indexes
	
			// For server-side processing tables - subtract the deleted row from the count
			if ( settings._iRecordsDisplay > 0 ) {
				settings._iRecordsDisplay--;
			}
	
			// Check for an 'overflow' they case for displaying the table
			_fnLengthOverflow( settings );
	
			// Remove the row's ID reference if there is one
			var id = settings.rowIdFn( rowData._aData );
			if ( id !== undefined ) {
				delete settings.aIds[ id ];
			}
		} );
	
		this.iterator( 'table', function ( settings ) {
			for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				settings.aoData[i].idx = i;
			}
		} );
	
		return this;
	} );
	
	
	_api_register( 'rows.add()', function ( rows ) {
		var newRows = this.iterator( 'table', function ( settings ) {
				var row, i, ien;
				var out = [];
	
				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];
	
					if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
						out.push( _fnAddTr( settings, row )[0] );
					}
					else {
						out.push( _fnAddData( settings, row ) );
					}
				}
	
				return out;
			}, 1 );
	
		// Return an Api.rows() extended instance, so rows().nodes() etc can be used
		var modRows = this.rows( -1 );
		modRows.pop();
		$.merge( modRows, newRows );
	
		return modRows;
	} );
	
	
	
	
	
	/**
	 *
	 */
	_api_register( 'row()', function ( selector, opts ) {
		return _selector_first( this.rows( selector, opts ) );
	} );
	
	
	_api_register( 'row().data()', function ( data ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// Get
			return ctx.length && this.length ?
				ctx[0].aoData[ this[0] ]._aData :
				undefined;
		}
	
		// Set
		var row = ctx[0].aoData[ this[0] ];
		row._aData = data;
	
		// If the DOM has an id, and the data source is an array
		if ( Array.isArray( data ) && row.nTr && row.nTr.id ) {
			_fnSetObjectDataFn( ctx[0].rowId )( data, row.nTr.id );
		}
	
		// Automatically invalidate
		_fnInvalidate( ctx[0], this[0], 'data' );
	
		return this;
	} );
	
	
	_api_register( 'row().node()', function () {
		var ctx = this.context;
	
		return ctx.length && this.length ?
			ctx[0].aoData[ this[0] ].nTr || null :
			null;
	} );
	
	
	_api_register( 'row.add()', function ( row ) {
		// Allow a jQuery object to be passed in - only a single row is added from
		// it though - the first element in the set
		if ( row instanceof $ && row.length ) {
			row = row[0];
		}
	
		var rows = this.iterator( 'table', function ( settings ) {
			if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
				return _fnAddTr( settings, row )[0];
			}
			return _fnAddData( settings, row );
		} );
	
		// Return an Api.rows() extended instance, with the newly added row selected
		return this.row( rows[0] );
	} );
	
	
	
	var __details_add = function ( ctx, row, data, klass )
	{
		// Convert to array of TR elements
		var rows = [];
		var addRow = function ( r, k ) {
			// Recursion to allow for arrays of jQuery objects
			if ( Array.isArray( r ) || r instanceof $ ) {
				for ( var i=0, ien=r.length ; i<ien ; i++ ) {
					addRow( r[i], k );
				}
				return;
			}
	
			// If we get a TR element, then just add it directly - up to the dev
			// to add the correct number of columns etc
			if ( r.nodeName && r.nodeName.toLowerCase() === 'tr' ) {
				rows.push( r );
			}
			else {
				// Otherwise create a row with a wrapper
				var created = $('<tr><td></td></tr>').addClass( k );
				$('td', created)
					.addClass( k )
					.html( r )
					[0].colSpan = _fnVisbleColumns( ctx );
	
				rows.push( created[0] );
			}
		};
	
		addRow( data, klass );
	
		if ( row._details ) {
			row._details.detach();
		}
	
		row._details = $(rows);
	
		// If the children were already shown, that state should be retained
		if ( row._detailsShow ) {
			row._details.insertAfter( row.nTr );
		}
	};
	
	
	var __details_remove = function ( api, idx )
	{
		var ctx = api.context;
	
		if ( ctx.length ) {
			var row = ctx[0].aoData[ idx !== undefined ? idx : api[0] ];
	
			if ( row && row._details ) {
				row._details.remove();
	
				row._detailsShow = undefined;
				row._details = undefined;
			}
		}
	};
	
	
	var __details_display = function ( api, show ) {
		var ctx = api.context;
	
		if ( ctx.length && api.length ) {
			var row = ctx[0].aoData[ api[0] ];
	
			if ( row._details ) {
				row._detailsShow = show;
	
				if ( show ) {
					row._details.insertAfter( row.nTr );
				}
				else {
					row._details.detach();
				}
	
				__details_events( ctx[0] );
			}
		}
	};
	
	
	var __details_events = function ( settings )
	{
		var api = new _Api( settings );
		var namespace = '.dt.DT_details';
		var drawEvent = 'draw'+namespace;
		var colvisEvent = 'column-visibility'+namespace;
		var destroyEvent = 'destroy'+namespace;
		var data = settings.aoData;
	
		api.off( drawEvent +' '+ colvisEvent +' '+ destroyEvent );
	
		if ( _pluck( data, '_details' ).length > 0 ) {
			// On each draw, insert the required elements into the document
			api.on( drawEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				api.rows( {page:'current'} ).eq(0).each( function (idx) {
					// Internal data grab
					var row = data[ idx ];
	
					if ( row._detailsShow ) {
						row._details.insertAfter( row.nTr );
					}
				} );
			} );
	
			// Column visibility change - update the colspan
			api.on( colvisEvent, function ( e, ctx, idx, vis ) {
				if ( settings !== ctx ) {
					return;
				}
	
				// Update the colspan for the details rows (note, only if it already has
				// a colspan)
				var row, visible = _fnVisbleColumns( ctx );
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					row = data[i];
	
					if ( row._details ) {
						row._details.children('td[colspan]').attr('colspan', visible );
					}
				}
			} );
	
			// Table destroyed - nuke any child rows
			api.on( destroyEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					if ( data[i]._details ) {
						__details_remove( api, i );
					}
				}
			} );
		}
	};
	
	// Strings for the method names to help minification
	var _emp = '';
	var _child_obj = _emp+'row().child';
	var _child_mth = _child_obj+'()';
	
	// data can be:
	//  tr
	//  string
	//  jQuery or array of any of the above
	_api_register( _child_mth, function ( data, klass ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// get
			return ctx.length && this.length ?
				ctx[0].aoData[ this[0] ]._details :
				undefined;
		}
		else if ( data === true ) {
			// show
			this.child.show();
		}
		else if ( data === false ) {
			// remove
			__details_remove( this );
		}
		else if ( ctx.length && this.length ) {
			// set
			__details_add( ctx[0], ctx[0].aoData[ this[0] ], data, klass );
		}
	
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.show()',
		_child_mth+'.show()' // only when `child()` was called with parameters (without
	], function ( show ) {   // it returns an object and this method is not executed)
		__details_display( this, true );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.hide()',
		_child_mth+'.hide()' // only when `child()` was called with parameters (without
	], function () {         // it returns an object and this method is not executed)
		__details_display( this, false );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.remove()',
		_child_mth+'.remove()' // only when `child()` was called with parameters (without
	], function () {           // it returns an object and this method is not executed)
		__details_remove( this );
		return this;
	} );
	
	
	_api_register( _child_obj+'.isShown()', function () {
		var ctx = this.context;
	
		if ( ctx.length && this.length ) {
			// _detailsShown as false or undefined will fall through to return false
			return ctx[0].aoData[ this[0] ]._detailsShow || false;
		}
		return false;
	} );
	
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Columns
	 *
	 * {integer}           - column index (>=0 count from left, <0 count from right)
	 * "{integer}:visIdx"  - visible column index (i.e. translate to column index)  (>=0 count from left, <0 count from right)
	 * "{integer}:visible" - alias for {integer}:visIdx  (>=0 count from left, <0 count from right)
	 * "{string}:name"     - column name
	 * "{string}"          - jQuery selector on column header nodes
	 *
	 */
	
	// can be an array of these items, comma separated list, or an array of comma
	// separated lists
	
	var __re_column_selector = /^([^:]+):(name|visIdx|visible)$/;
	
	
	// r1 and r2 are redundant - but it means that the parameters match for the
	// iterator callback in columns().data()
	var __columnData = function ( settings, column, r1, r2, rows ) {
		var a = [];
		for ( var row=0, ien=rows.length ; row<ien ; row++ ) {
			a.push( _fnGetCellData( settings, rows[row], column ) );
		}
		return a;
	};
	
	
	var __column_selector = function ( settings, selector, opts )
	{
		var
			columns = settings.aoColumns,
			names = _pluck( columns, 'sName' ),
			nodes = _pluck( columns, 'nTh' );
	
		var run = function ( s ) {
			var selInt = _intVal( s );
	
			// Selector - all
			if ( s === '' ) {
				return _range( columns.length );
			}
	
			// Selector - index
			if ( selInt !== null ) {
				return [ selInt >= 0 ?
					selInt : // Count from left
					columns.length + selInt // Count from right (+ because its a negative value)
				];
			}
	
			// Selector = function
			if ( typeof s === 'function' ) {
				var rows = _selector_row_indexes( settings, opts );
	
				return $.map( columns, function (col, idx) {
					return s(
							idx,
							__columnData( settings, idx, 0, 0, rows ),
							nodes[ idx ]
						) ? idx : null;
				} );
			}
	
			// jQuery or string selector
			var match = typeof s === 'string' ?
				s.match( __re_column_selector ) :
				'';
	
			if ( match ) {
				switch( match[2] ) {
					case 'visIdx':
					case 'visible':
						var idx = parseInt( match[1], 10 );
						// Visible index given, convert to column index
						if ( idx < 0 ) {
							// Counting from the right
							var visColumns = $.map( columns, function (col,i) {
								return col.bVisible ? i : null;
							} );
							return [ visColumns[ visColumns.length + idx ] ];
						}
						// Counting from the left
						return [ _fnVisibleToColumnIndex( settings, idx ) ];
	
					case 'name':
						// match by name. `names` is column index complete and in order
						return $.map( names, function (name, i) {
							return name === match[1] ? i : null;
						} );
	
					default:
						return [];
				}
			}
	
			// Cell in the table body
			if ( s.nodeName && s._DT_CellIndex ) {
				return [ s._DT_CellIndex.column ];
			}
	
			// jQuery selector on the TH elements for the columns
			var jqResult = $( nodes )
				.filter( s )
				.map( function () {
					return $.inArray( this, nodes ); // `nodes` is column index complete and in order
				} )
				.toArray();
	
			if ( jqResult.length || ! s.nodeName ) {
				return jqResult;
			}
	
			// Otherwise a node which might have a `dt-column` data attribute, or be
			// a child or such an element
			var host = $(s).closest('*[data-dt-column]');
			return host.length ?
				[ host.data('dt-column') ] :
				[];
		};
	
		return _selector_run( 'column', selector, run, settings, opts );
	};
	
	
	var __setColumnVis = function ( settings, column, vis ) {
		var
			cols = settings.aoColumns,
			col  = cols[ column ],
			data = settings.aoData,
			row, cells, i, ien, tr;
	
		// Get
		if ( vis === undefined ) {
			return col.bVisible;
		}
	
		// Set
		// No change
		if ( col.bVisible === vis ) {
			return;
		}
	
		if ( vis ) {
			// Insert column
			// Need to decide if we should use appendChild or insertBefore
			var insertBefore = $.inArray( true, _pluck(cols, 'bVisible'), column+1 );
	
			for ( i=0, ien=data.length ; i<ien ; i++ ) {
				tr = data[i].nTr;
				cells = data[i].anCells;
	
				if ( tr ) {
					// insertBefore can act like appendChild if 2nd arg is null
					tr.insertBefore( cells[ column ], cells[ insertBefore ] || null );
				}
			}
		}
		else {
			// Remove column
			$( _pluck( settings.aoData, 'anCells', column ) ).detach();
		}
	
		// Common actions
		col.bVisible = vis;
	};
	
	
	_api_register( 'columns()', function ( selector, opts ) {
		// argument shifting
		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}
	
		opts = _selector_opts( opts );
	
		var inst = this.iterator( 'table', function ( settings ) {
			return __column_selector( settings, selector, opts );
		}, 1 );
	
		// Want argument shifting here and in _row_selector?
		inst.selector.cols = selector;
		inst.selector.opts = opts;
	
		return inst;
	} );
	
	_api_registerPlural( 'columns().header()', 'column().header()', function ( selector, opts ) {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].nTh;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().footer()', 'column().footer()', function ( selector, opts ) {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].nTf;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().data()', 'column().data()', function () {
		return this.iterator( 'column-rows', __columnData, 1 );
	} );
	
	_api_registerPlural( 'columns().dataSrc()', 'column().dataSrc()', function () {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].mData;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().cache()', 'column().cache()', function ( type ) {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return _pluck_order( settings.aoData, rows,
				type === 'search' ? '_aFilterData' : '_aSortData', column
			);
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().nodes()', 'column().nodes()', function () {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return _pluck_order( settings.aoData, rows, 'anCells', column ) ;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().visible()', 'column().visible()', function ( vis, calc ) {
		var that = this;
		var ret = this.iterator( 'column', function ( settings, column ) {
			if ( vis === undefined ) {
				return settings.aoColumns[ column ].bVisible;
			} // else
			__setColumnVis( settings, column, vis );
		} );
	
		// Group the column visibility changes
		if ( vis !== undefined ) {
			this.iterator( 'table', function ( settings ) {
				// Redraw the header after changes
				_fnDrawHead( settings, settings.aoHeader );
				_fnDrawHead( settings, settings.aoFooter );
		
				// Update colspan for no records display. Child rows and extensions will use their own
				// listeners to do this - only need to update the empty table item here
				if ( ! settings.aiDisplay.length ) {
					$(settings.nTBody).find('td[colspan]').attr('colspan', _fnVisbleColumns(settings));
				}
		
				_fnSaveState( settings );
	
				// Second loop once the first is done for events
				that.iterator( 'column', function ( settings, column ) {
					_fnCallbackFire( settings, null, 'column-visibility', [settings, column, vis, calc] );
				} );
	
				if ( calc === undefined || calc ) {
					that.columns.adjust();
				}
			});
		}
	
		return ret;
	} );
	
	_api_registerPlural( 'columns().indexes()', 'column().index()', function ( type ) {
		return this.iterator( 'column', function ( settings, column ) {
			return type === 'visible' ?
				_fnColumnIndexToVisible( settings, column ) :
				column;
		}, 1 );
	} );
	
	_api_register( 'columns.adjust()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnAdjustColumnSizing( settings );
		}, 1 );
	} );
	
	_api_register( 'column.index()', function ( type, idx ) {
		if ( this.context.length !== 0 ) {
			var ctx = this.context[0];
	
			if ( type === 'fromVisible' || type === 'toData' ) {
				return _fnVisibleToColumnIndex( ctx, idx );
			}
			else if ( type === 'fromData' || type === 'toVisible' ) {
				return _fnColumnIndexToVisible( ctx, idx );
			}
		}
	} );
	
	_api_register( 'column()', function ( selector, opts ) {
		return _selector_first( this.columns( selector, opts ) );
	} );
	
	var __cell_selector = function ( settings, selector, opts )
	{
		var data = settings.aoData;
		var rows = _selector_row_indexes( settings, opts );
		var cells = _removeEmpty( _pluck_order( data, rows, 'anCells' ) );
		var allCells = $(_flatten( [], cells ));
		var row;
		var columns = settings.aoColumns.length;
		var a, i, ien, j, o, host;
	
		var run = function ( s ) {
			var fnSelector = typeof s === 'function';
	
			if ( s === null || s === undefined || fnSelector ) {
				// All cells and function selectors
				a = [];
	
				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];
	
					for ( j=0 ; j<columns ; j++ ) {
						o = {
							row: row,
							column: j
						};
	
						if ( fnSelector ) {
							// Selector - function
							host = data[ row ];
	
							if ( s( o, _fnGetCellData(settings, row, j), host.anCells ? host.anCells[j] : null ) ) {
								a.push( o );
							}
						}
						else {
							// Selector - all
							a.push( o );
						}
					}
				}
	
				return a;
			}
			
			// Selector - index
			if ( $.isPlainObject( s ) ) {
				// Valid cell index and its in the array of selectable rows
				return s.column !== undefined && s.row !== undefined && $.inArray( s.row, rows ) !== -1 ?
					[s] :
					[];
			}
	
			// Selector - jQuery filtered cells
			var jqResult = allCells
				.filter( s )
				.map( function (i, el) {
					return { // use a new object, in case someone changes the values
						row:    el._DT_CellIndex.row,
						column: el._DT_CellIndex.column
	 				};
				} )
				.toArray();
	
			if ( jqResult.length || ! s.nodeName ) {
				return jqResult;
			}
	
			// Otherwise the selector is a node, and there is one last option - the
			// element might be a child of an element which has dt-row and dt-column
			// data attributes
			host = $(s).closest('*[data-dt-row]');
			return host.length ?
				[ {
					row: host.data('dt-row'),
					column: host.data('dt-column')
				} ] :
				[];
		};
	
		return _selector_run( 'cell', selector, run, settings, opts );
	};
	
	
	
	
	_api_register( 'cells()', function ( rowSelector, columnSelector, opts ) {
		// Argument shifting
		if ( $.isPlainObject( rowSelector ) ) {
			// Indexes
			if ( rowSelector.row === undefined ) {
				// Selector options in first parameter
				opts = rowSelector;
				rowSelector = null;
			}
			else {
				// Cell index objects in first parameter
				opts = columnSelector;
				columnSelector = null;
			}
		}
		if ( $.isPlainObject( columnSelector ) ) {
			opts = columnSelector;
			columnSelector = null;
		}
	
		// Cell selector
		if ( columnSelector === null || columnSelector === undefined ) {
			return this.iterator( 'table', function ( settings ) {
				return __cell_selector( settings, rowSelector, _selector_opts( opts ) );
			} );
		}
	
		// The default built in options need to apply to row and columns
		var internalOpts = opts ? {
			page: opts.page,
			order: opts.order,
			search: opts.search
		} : {};
	
		// Row + column selector
		var columns = this.columns( columnSelector, internalOpts );
		var rows = this.rows( rowSelector, internalOpts );
		var i, ien, j, jen;
	
		var cellsNoOpts = this.iterator( 'table', function ( settings, idx ) {
			var a = [];
	
			for ( i=0, ien=rows[idx].length ; i<ien ; i++ ) {
				for ( j=0, jen=columns[idx].length ; j<jen ; j++ ) {
					a.push( {
						row:    rows[idx][i],
						column: columns[idx][j]
					} );
				}
			}
	
			return a;
		}, 1 );
	
		// There is currently only one extension which uses a cell selector extension
		// It is a _major_ performance drag to run this if it isn't needed, so this is
		// an extension specific check at the moment
		var cells = opts && opts.selected ?
			this.cells( cellsNoOpts, opts ) :
			cellsNoOpts;
	
		$.extend( cells.selector, {
			cols: columnSelector,
			rows: rowSelector,
			opts: opts
		} );
	
		return cells;
	} );
	
	
	_api_registerPlural( 'cells().nodes()', 'cell().node()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			var data = settings.aoData[ row ];
	
			return data && data.anCells ?
				data.anCells[ column ] :
				undefined;
		}, 1 );
	} );
	
	
	_api_register( 'cells().data()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return _fnGetCellData( settings, row, column );
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().cache()', 'cell().cache()', function ( type ) {
		type = type === 'search' ? '_aFilterData' : '_aSortData';
	
		return this.iterator( 'cell', function ( settings, row, column ) {
			return settings.aoData[ row ][ type ][ column ];
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().render()', 'cell().render()', function ( type ) {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return _fnGetCellData( settings, row, column, type );
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().indexes()', 'cell().index()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return {
				row: row,
				column: column,
				columnVisible: _fnColumnIndexToVisible( settings, column )
			};
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().invalidate()', 'cell().invalidate()', function ( src ) {
		return this.iterator( 'cell', function ( settings, row, column ) {
			_fnInvalidate( settings, row, src, column );
		} );
	} );
	
	
	
	_api_register( 'cell()', function ( rowSelector, columnSelector, opts ) {
		return _selector_first( this.cells( rowSelector, columnSelector, opts ) );
	} );
	
	
	_api_register( 'cell().data()', function ( data ) {
		var ctx = this.context;
		var cell = this[0];
	
		if ( data === undefined ) {
			// Get
			return ctx.length && cell.length ?
				_fnGetCellData( ctx[0], cell[0].row, cell[0].column ) :
				undefined;
		}
	
		// Set
		_fnSetCellData( ctx[0], cell[0].row, cell[0].column, data );
		_fnInvalidate( ctx[0], cell[0].row, 'data', cell[0].column );
	
		return this;
	} );
	
	
	
	/**
	 * Get current ordering (sorting) that has been applied to the table.
	 *
	 * @returns {array} 2D array containing the sorting information for the first
	 *   table in the current context. Each element in the parent array represents
	 *   a column being sorted upon (i.e. multi-sorting with two columns would have
	 *   2 inner arrays). The inner arrays may have 2 or 3 elements. The first is
	 *   the column index that the sorting condition applies to, the second is the
	 *   direction of the sort (`desc` or `asc`) and, optionally, the third is the
	 *   index of the sorting order from the `column.sorting` initialisation array.
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {integer} order Column index to sort upon.
	 * @param {string} direction Direction of the sort to be applied (`asc` or `desc`)
	 * @returns {DataTables.Api} this
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {array} order 1D array of sorting information to be applied.
	 * @param {array} [...] Optional additional sorting conditions
	 * @returns {DataTables.Api} this
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {array} order 2D array of sorting information to be applied.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'order()', function ( order, dir ) {
		var ctx = this.context;
	
		if ( order === undefined ) {
			// get
			return ctx.length !== 0 ?
				ctx[0].aaSorting :
				undefined;
		}
	
		// set
		if ( typeof order === 'number' ) {
			// Simple column / direction passed in
			order = [ [ order, dir ] ];
		}
		else if ( order.length && ! Array.isArray( order[0] ) ) {
			// Arguments passed in (list of 1D arrays)
			order = Array.prototype.slice.call( arguments );
		}
		// otherwise a 2D array was passed in
	
		return this.iterator( 'table', function ( settings ) {
			settings.aaSorting = order.slice();
		} );
	} );
	
	
	/**
	 * Attach a sort listener to an element for a given column
	 *
	 * @param {node|jQuery|string} node Identifier for the element(s) to attach the
	 *   listener to. This can take the form of a single DOM node, a jQuery
	 *   collection of nodes or a jQuery selector which will identify the node(s).
	 * @param {integer} column the column that a click on this node will sort on
	 * @param {function} [callback] callback function when sort is run
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'order.listener()', function ( node, column, callback ) {
		return this.iterator( 'table', function ( settings ) {
			_fnSortAttachListener( settings, node, column, callback );
		} );
	} );
	
	
	_api_register( 'order.fixed()', function ( set ) {
		if ( ! set ) {
			var ctx = this.context;
			var fixed = ctx.length ?
				ctx[0].aaSortingFixed :
				undefined;
	
			return Array.isArray( fixed ) ?
				{ pre: fixed } :
				fixed;
		}
	
		return this.iterator( 'table', function ( settings ) {
			settings.aaSortingFixed = $.extend( true, {}, set );
		} );
	} );
	
	
	// Order by the selected column(s)
	_api_register( [
		'columns().order()',
		'column().order()'
	], function ( dir ) {
		var that = this;
	
		return this.iterator( 'table', function ( settings, i ) {
			var sort = [];
	
			$.each( that[i], function (j, col) {
				sort.push( [ col, dir ] );
			} );
	
			settings.aaSorting = sort;
		} );
	} );
	
	
	
	_api_register( 'search()', function ( input, regex, smart, caseInsen ) {
		var ctx = this.context;
	
		if ( input === undefined ) {
			// get
			return ctx.length !== 0 ?
				ctx[0].oPreviousSearch.sSearch :
				undefined;
		}
	
		// set
		return this.iterator( 'table', function ( settings ) {
			if ( ! settings.oFeatures.bFilter ) {
				return;
			}
	
			_fnFilterComplete( settings, $.extend( {}, settings.oPreviousSearch, {
				"sSearch": input+"",
				"bRegex":  regex === null ? false : regex,
				"bSmart":  smart === null ? true  : smart,
				"bCaseInsensitive": caseInsen === null ? true : caseInsen
			} ), 1 );
		} );
	} );
	
	
	_api_registerPlural(
		'columns().search()',
		'column().search()',
		function ( input, regex, smart, caseInsen ) {
			return this.iterator( 'column', function ( settings, column ) {
				var preSearch = settings.aoPreSearchCols;
	
				if ( input === undefined ) {
					// get
					return preSearch[ column ].sSearch;
				}
	
				// set
				if ( ! settings.oFeatures.bFilter ) {
					return;
				}
	
				$.extend( preSearch[ column ], {
					"sSearch": input+"",
					"bRegex":  regex === null ? false : regex,
					"bSmart":  smart === null ? true  : smart,
					"bCaseInsensitive": caseInsen === null ? true : caseInsen
				} );
	
				_fnFilterComplete( settings, settings.oPreviousSearch, 1 );
			} );
		}
	);
	
	/*
	 * State API methods
	 */
	
	_api_register( 'state()', function () {
		return this.context.length ?
			this.context[0].oSavedState :
			null;
	} );
	
	
	_api_register( 'state.clear()', function () {
		return this.iterator( 'table', function ( settings ) {
			// Save an empty object
			settings.fnStateSaveCallback.call( settings.oInstance, settings, {} );
		} );
	} );
	
	
	_api_register( 'state.loaded()', function () {
		return this.context.length ?
			this.context[0].oLoadedState :
			null;
	} );
	
	
	_api_register( 'state.save()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnSaveState( settings );
		} );
	} );
	
	
	
	/**
	 * Provide a common method for plug-ins to check the version of DataTables being
	 * used, in order to ensure compatibility.
	 *
	 *  @param {string} version Version string to check for, in the format "X.Y.Z".
	 *    Note that the formats "X" and "X.Y" are also acceptable.
	 *  @returns {boolean} true if this version of DataTables is greater or equal to
	 *    the required version, or false if this version of DataTales is not
	 *    suitable
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    alert( $.fn.dataTable.versionCheck( '1.9.0' ) );
	 */
	DataTable.versionCheck = DataTable.fnVersionCheck = function( version )
	{
		var aThis = DataTable.version.split('.');
		var aThat = version.split('.');
		var iThis, iThat;
	
		for ( var i=0, iLen=aThat.length ; i<iLen ; i++ ) {
			iThis = parseInt( aThis[i], 10 ) || 0;
			iThat = parseInt( aThat[i], 10 ) || 0;
	
			// Parts are the same, keep comparing
			if (iThis === iThat) {
				continue;
			}
	
			// Parts are different, return immediately
			return iThis > iThat;
		}
	
		return true;
	};
	
	
	/**
	 * Check if a `<table>` node is a DataTable table already or not.
	 *
	 *  @param {node|jquery|string} table Table node, jQuery object or jQuery
	 *      selector for the table to test. Note that if more than more than one
	 *      table is passed on, only the first will be checked
	 *  @returns {boolean} true the table given is a DataTable, or false otherwise
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    if ( ! $.fn.DataTable.isDataTable( '#example' ) ) {
	 *      $('#example').dataTable();
	 *    }
	 */
	DataTable.isDataTable = DataTable.fnIsDataTable = function ( table )
	{
		var t = $(table).get(0);
		var is = false;
	
		if ( table instanceof DataTable.Api ) {
			return true;
		}
	
		$.each( DataTable.settings, function (i, o) {
			var head = o.nScrollHead ? $('table', o.nScrollHead)[0] : null;
			var foot = o.nScrollFoot ? $('table', o.nScrollFoot)[0] : null;
	
			if ( o.nTable === t || head === t || foot === t ) {
				is = true;
			}
		} );
	
		return is;
	};
	
	
	/**
	 * Get all DataTable tables that have been initialised - optionally you can
	 * select to get only currently visible tables.
	 *
	 *  @param {boolean} [visible=false] Flag to indicate if you want all (default)
	 *    or visible tables only.
	 *  @returns {array} Array of `table` nodes (not DataTable instances) which are
	 *    DataTables
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    $.each( $.fn.dataTable.tables(true), function () {
	 *      $(table).DataTable().columns.adjust();
	 *    } );
	 */
	DataTable.tables = DataTable.fnTables = function ( visible )
	{
		var api = false;
	
		if ( $.isPlainObject( visible ) ) {
			api = visible.api;
			visible = visible.visible;
		}
	
		var a = $.map( DataTable.settings, function (o) {
			if ( !visible || (visible && $(o.nTable).is(':visible')) ) {
				return o.nTable;
			}
		} );
	
		return api ?
			new _Api( a ) :
			a;
	};
	
	
	/**
	 * Convert from camel case parameters to Hungarian notation. This is made public
	 * for the extensions to provide the same ability as DataTables core to accept
	 * either the 1.9 style Hungarian notation, or the 1.10+ style camelCase
	 * parameters.
	 *
	 *  @param {object} src The model object which holds all parameters that can be
	 *    mapped.
	 *  @param {object} user The object to convert from camel case to Hungarian.
	 *  @param {boolean} force When set to `true`, properties which already have a
	 *    Hungarian value in the `user` object will be overwritten. Otherwise they
	 *    won't be.
	 */
	DataTable.camelToHungarian = _fnCamelToHungarian;
	
	
	
	/**
	 *
	 */
	_api_register( '$()', function ( selector, opts ) {
		var
			rows   = this.rows( opts ).nodes(), // Get all rows
			jqRows = $(rows);
	
		return $( [].concat(
			jqRows.filter( selector ).toArray(),
			jqRows.find( selector ).toArray()
		) );
	} );
	
	
	// jQuery functions to operate on the tables
	$.each( [ 'on', 'one', 'off' ], function (i, key) {
		_api_register( key+'()', function ( /* event, handler */ ) {
			var args = Array.prototype.slice.call(arguments);
	
			// Add the `dt` namespace automatically if it isn't already present
			args[0] = $.map( args[0].split( /\s/ ), function ( e ) {
				return ! e.match(/\.dt\b/) ?
					e+'.dt' :
					e;
				} ).join( ' ' );
	
			var inst = $( this.tables().nodes() );
			inst[key].apply( inst, args );
			return this;
		} );
	} );
	
	
	_api_register( 'clear()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnClearTable( settings );
		} );
	} );
	
	
	_api_register( 'settings()', function () {
		return new _Api( this.context, this.context );
	} );
	
	
	_api_register( 'init()', function () {
		var ctx = this.context;
		return ctx.length ? ctx[0].oInit : null;
	} );
	
	
	_api_register( 'data()', function () {
		return this.iterator( 'table', function ( settings ) {
			return _pluck( settings.aoData, '_aData' );
		} ).flatten();
	} );
	
	
	_api_register( 'destroy()', function ( remove ) {
		remove = remove || false;
	
		return this.iterator( 'table', function ( settings ) {
			var orig      = settings.nTableWrapper.parentNode;
			var classes   = settings.oClasses;
			var table     = settings.nTable;
			var tbody     = settings.nTBody;
			var thead     = settings.nTHead;
			var tfoot     = settings.nTFoot;
			var jqTable   = $(table);
			var jqTbody   = $(tbody);
			var jqWrapper = $(settings.nTableWrapper);
			var rows      = $.map( settings.aoData, function (r) { return r.nTr; } );
			var i, ien;
	
			// Flag to note that the table is currently being destroyed - no action
			// should be taken
			settings.bDestroying = true;
	
			// Fire off the destroy callbacks for plug-ins etc
			_fnCallbackFire( settings, "aoDestroyCallback", "destroy", [settings] );
	
			// If not being removed from the document, make all columns visible
			if ( ! remove ) {
				new _Api( settings ).columns().visible( true );
			}
	
			// Blitz all `DT` namespaced events (these are internal events, the
			// lowercase, `dt` events are user subscribed and they are responsible
			// for removing them
			jqWrapper.off('.DT').find(':not(tbody *)').off('.DT');
			$(window).off('.DT-'+settings.sInstance);
	
			// When scrolling we had to break the table up - restore it
			if ( table != thead.parentNode ) {
				jqTable.children('thead').detach();
				jqTable.append( thead );
			}
	
			if ( tfoot && table != tfoot.parentNode ) {
				jqTable.children('tfoot').detach();
				jqTable.append( tfoot );
			}
	
			settings.aaSorting = [];
			settings.aaSortingFixed = [];
			_fnSortingClasses( settings );
	
			$( rows ).removeClass( settings.asStripeClasses.join(' ') );
	
			$('th, td', thead).removeClass( classes.sSortable+' '+
				classes.sSortableAsc+' '+classes.sSortableDesc+' '+classes.sSortableNone
			);
	
			// Add the TR elements back into the table in their original order
			jqTbody.children().detach();
			jqTbody.append( rows );
	
			// Remove the DataTables generated nodes, events and classes
			var removedMethod = remove ? 'remove' : 'detach';
			jqTable[ removedMethod ]();
			jqWrapper[ removedMethod ]();
	
			// If we need to reattach the table to the document
			if ( ! remove && orig ) {
				// insertBefore acts like appendChild if !arg[1]
				orig.insertBefore( table, settings.nTableReinsertBefore );
	
				// Restore the width of the original table - was read from the style property,
				// so we can restore directly to that
				jqTable
					.css( 'width', settings.sDestroyWidth )
					.removeClass( classes.sTable );
	
				// If the were originally stripe classes - then we add them back here.
				// Note this is not fool proof (for example if not all rows had stripe
				// classes - but it's a good effort without getting carried away
				ien = settings.asDestroyStripes.length;
	
				if ( ien ) {
					jqTbody.children().each( function (i) {
						$(this).addClass( settings.asDestroyStripes[i % ien] );
					} );
				}
			}
	
			/* Remove the settings object from the settings array */
			var idx = $.inArray( settings, DataTable.settings );
			if ( idx !== -1 ) {
				DataTable.settings.splice( idx, 1 );
			}
		} );
	} );
	
	
	// Add the `every()` method for rows, columns and cells in a compact form
	$.each( [ 'column', 'row', 'cell' ], function ( i, type ) {
		_api_register( type+'s().every()', function ( fn ) {
			var opts = this.selector.opts;
			var api = this;
	
			return this.iterator( type, function ( settings, arg1, arg2, arg3, arg4 ) {
				// Rows and columns:
				//  arg1 - index
				//  arg2 - table counter
				//  arg3 - loop counter
				//  arg4 - undefined
				// Cells:
				//  arg1 - row index
				//  arg2 - column index
				//  arg3 - table counter
				//  arg4 - loop counter
				fn.call(
					api[ type ](
						arg1,
						type==='cell' ? arg2 : opts,
						type==='cell' ? opts : undefined
					),
					arg1, arg2, arg3, arg4
				);
			} );
		} );
	} );
	
	
	// i18n method for extensions to be able to use the language object from the
	// DataTable
	_api_register( 'i18n()', function ( token, def, plural ) {
		var ctx = this.context[0];
		var resolved = _fnGetObjectDataFn( token )( ctx.oLanguage );
	
		if ( resolved === undefined ) {
			resolved = def;
		}
	
		if ( plural !== undefined && $.isPlainObject( resolved ) ) {
			resolved = resolved[ plural ] !== undefined ?
				resolved[ plural ] :
				resolved._;
		}
	
		return resolved.replace( '%d', plural ); // nb: plural might be undefined,
	} );
	/**
	 * Version string for plug-ins to check compatibility. Allowed format is
	 * `a.b.c-d` where: a:int, b:int, c:int, d:string(dev|beta|alpha). `d` is used
	 * only for non-release builds. See http://semver.org/ for more information.
	 *  @member
	 *  @type string
	 *  @default Version number
	 */
	DataTable.version = "1.10.22";

	/**
	 * Private data store, containing all of the settings objects that are
	 * created for the tables on a given page.
	 *
	 * Note that the `DataTable.settings` object is aliased to
	 * `jQuery.fn.dataTableExt` through which it may be accessed and
	 * manipulated, or `jQuery.fn.dataTable.settings`.
	 *  @member
	 *  @type array
	 *  @default []
	 *  @private
	 */
	DataTable.settings = [];

	/**
	 * Object models container, for the various models that DataTables has
	 * available to it. These models define the objects that are used to hold
	 * the active state and configuration of the table.
	 *  @namespace
	 */
	DataTable.models = {};
	
	
	
	/**
	 * Template object for the way in which DataTables holds information about
	 * search information for the global filter and individual column filters.
	 *  @namespace
	 */
	DataTable.models.oSearch = {
		/**
		 * Flag to indicate if the filtering should be case insensitive or not
		 *  @type boolean
		 *  @default true
		 */
		"bCaseInsensitive": true,
	
		/**
		 * Applied search term
		 *  @type string
		 *  @default <i>Empty string</i>
		 */
		"sSearch": "",
	
		/**
		 * Flag to indicate if the search term should be interpreted as a
		 * regular expression (true) or not (false) and therefore and special
		 * regex characters escaped.
		 *  @type boolean
		 *  @default false
		 */
		"bRegex": false,
	
		/**
		 * Flag to indicate if DataTables is to use its smart filtering or not.
		 *  @type boolean
		 *  @default true
		 */
		"bSmart": true
	};
	
	
	
	
	/**
	 * Template object for the way in which DataTables holds information about
	 * each individual row. This is the object format used for the settings
	 * aoData array.
	 *  @namespace
	 */
	DataTable.models.oRow = {
		/**
		 * TR element for the row
		 *  @type node
		 *  @default null
		 */
		"nTr": null,
	
		/**
		 * Array of TD elements for each row. This is null until the row has been
		 * created.
		 *  @type array nodes
		 *  @default []
		 */
		"anCells": null,
	
		/**
		 * Data object from the original data source for the row. This is either
		 * an array if using the traditional form of DataTables, or an object if
		 * using mData options. The exact type will depend on the passed in
		 * data from the data source, or will be an array if using DOM a data
		 * source.
		 *  @type array|object
		 *  @default []
		 */
		"_aData": [],
	
		/**
		 * Sorting data cache - this array is ostensibly the same length as the
		 * number of columns (although each index is generated only as it is
		 * needed), and holds the data that is used for sorting each column in the
		 * row. We do this cache generation at the start of the sort in order that
		 * the formatting of the sort data need be done only once for each cell
		 * per sort. This array should not be read from or written to by anything
		 * other than the master sorting methods.
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_aSortData": null,
	
		/**
		 * Per cell filtering data cache. As per the sort data cache, used to
		 * increase the performance of the filtering in DataTables
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_aFilterData": null,
	
		/**
		 * Filtering data cache. This is the same as the cell filtering cache, but
		 * in this case a string rather than an array. This is easily computed with
		 * a join on `_aFilterData`, but is provided as a cache so the join isn't
		 * needed on every search (memory traded for performance)
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_sFilterRow": null,
	
		/**
		 * Cache of the class name that DataTables has applied to the row, so we
		 * can quickly look at this variable rather than needing to do a DOM check
		 * on className for the nTr property.
		 *  @type string
		 *  @default <i>Empty string</i>
		 *  @private
		 */
		"_sRowStripe": "",
	
		/**
		 * Denote if the original data source was from the DOM, or the data source
		 * object. This is used for invalidating data, so DataTables can
		 * automatically read data from the original source, unless uninstructed
		 * otherwise.
		 *  @type string
		 *  @default null
		 *  @private
		 */
		"src": null,
	
		/**
		 * Index in the aoData array. This saves an indexOf lookup when we have the
		 * object, but want to know the index
		 *  @type integer
		 *  @default -1
		 *  @private
		 */
		"idx": -1
	};
	
	
	/**
	 * Template object for the column information object in DataTables. This object
	 * is held in the settings aoColumns array and contains all the information that
	 * DataTables needs about each individual column.
	 *
	 * Note that this object is related to {@link DataTable.defaults.column}
	 * but this one is the internal data store for DataTables's cache of columns.
	 * It should NOT be manipulated outside of DataTables. Any configuration should
	 * be done through the initialisation options.
	 *  @namespace
	 */
	DataTable.models.oColumn = {
		/**
		 * Column index. This could be worked out on-the-fly with $.inArray, but it
		 * is faster to just hold it as a variable
		 *  @type integer
		 *  @default null
		 */
		"idx": null,
	
		/**
		 * A list of the columns that sorting should occur on when this column
		 * is sorted. That this property is an array allows multi-column sorting
		 * to be defined for a column (for example first name / last name columns
		 * would benefit from this). The values are integers pointing to the
		 * columns to be sorted on (typically it will be a single integer pointing
		 * at itself, but that doesn't need to be the case).
		 *  @type array
		 */
		"aDataSort": null,
	
		/**
		 * Define the sorting directions that are applied to the column, in sequence
		 * as the column is repeatedly sorted upon - i.e. the first value is used
		 * as the sorting direction when the column if first sorted (clicked on).
		 * Sort it again (click again) and it will move on to the next index.
		 * Repeat until loop.
		 *  @type array
		 */
		"asSorting": null,
	
		/**
		 * Flag to indicate if the column is searchable, and thus should be included
		 * in the filtering or not.
		 *  @type boolean
		 */
		"bSearchable": null,
	
		/**
		 * Flag to indicate if the column is sortable or not.
		 *  @type boolean
		 */
		"bSortable": null,
	
		/**
		 * Flag to indicate if the column is currently visible in the table or not
		 *  @type boolean
		 */
		"bVisible": null,
	
		/**
		 * Store for manual type assignment using the `column.type` option. This
		 * is held in store so we can manipulate the column's `sType` property.
		 *  @type string
		 *  @default null
		 *  @private
		 */
		"_sManualType": null,
	
		/**
		 * Flag to indicate if HTML5 data attributes should be used as the data
		 * source for filtering or sorting. True is either are.
		 *  @type boolean
		 *  @default false
		 *  @private
		 */
		"_bAttrSrc": false,
	
		/**
		 * Developer definable function that is called whenever a cell is created (Ajax source,
		 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
		 * allowing you to modify the DOM element (add background colour for example) when the
		 * element is available.
		 *  @type function
		 *  @param {element} nTd The TD node that has been created
		 *  @param {*} sData The Data for the cell
		 *  @param {array|object} oData The data for the whole row
		 *  @param {int} iRow The row index for the aoData data store
		 *  @default null
		 */
		"fnCreatedCell": null,
	
		/**
		 * Function to get data from a cell in a column. You should <b>never</b>
		 * access data directly through _aData internally in DataTables - always use
		 * the method attached to this property. It allows mData to function as
		 * required. This function is automatically assigned by the column
		 * initialisation method
		 *  @type function
		 *  @param {array|object} oData The data array/object for the array
		 *    (i.e. aoData[]._aData)
		 *  @param {string} sSpecific The specific data type you want to get -
		 *    'display', 'type' 'filter' 'sort'
		 *  @returns {*} The data for the cell from the given row's data
		 *  @default null
		 */
		"fnGetData": null,
	
		/**
		 * Function to set data for a cell in the column. You should <b>never</b>
		 * set the data directly to _aData internally in DataTables - always use
		 * this method. It allows mData to function as required. This function
		 * is automatically assigned by the column initialisation method
		 *  @type function
		 *  @param {array|object} oData The data array/object for the array
		 *    (i.e. aoData[]._aData)
		 *  @param {*} sValue Value to set
		 *  @default null
		 */
		"fnSetData": null,
	
		/**
		 * Property to read the value for the cells in the column from the data
		 * source array / object. If null, then the default content is used, if a
		 * function is given then the return from the function is used.
		 *  @type function|int|string|null
		 *  @default null
		 */
		"mData": null,
	
		/**
		 * Partner property to mData which is used (only when defined) to get
		 * the data - i.e. it is basically the same as mData, but without the
		 * 'set' option, and also the data fed to it is the result from mData.
		 * This is the rendering method to match the data method of mData.
		 *  @type function|int|string|null
		 *  @default null
		 */
		"mRender": null,
	
		/**
		 * Unique header TH/TD element for this column - this is what the sorting
		 * listener is attached to (if sorting is enabled.)
		 *  @type node
		 *  @default null
		 */
		"nTh": null,
	
		/**
		 * Unique footer TH/TD element for this column (if there is one). Not used
		 * in DataTables as such, but can be used for plug-ins to reference the
		 * footer for each column.
		 *  @type node
		 *  @default null
		 */
		"nTf": null,
	
		/**
		 * The class to apply to all TD elements in the table's TBODY for the column
		 *  @type string
		 *  @default null
		 */
		"sClass": null,
	
		/**
		 * When DataTables calculates the column widths to assign to each column,
		 * it finds the longest string in each column and then constructs a
		 * temporary table and reads the widths from that. The problem with this
		 * is that "mmm" is much wider then "iiii", but the latter is a longer
		 * string - thus the calculation can go wrong (doing it properly and putting
		 * it into an DOM object and measuring that is horribly(!) slow). Thus as
		 * a "work around" we provide this option. It will append its value to the
		 * text that is found to be the longest string for the column - i.e. padding.
		 *  @type string
		 */
		"sContentPadding": null,
	
		/**
		 * Allows a default value to be given for a column's data, and will be used
		 * whenever a null data source is encountered (this can be because mData
		 * is set to null, or because the data source itself is null).
		 *  @type string
		 *  @default null
		 */
		"sDefaultContent": null,
	
		/**
		 * Name for the column, allowing reference to the column by name as well as
		 * by index (needs a lookup to work by name).
		 *  @type string
		 */
		"sName": null,
	
		/**
		 * Custom sorting data type - defines which of the available plug-ins in
		 * afnSortData the custom sorting will use - if any is defined.
		 *  @type string
		 *  @default std
		 */
		"sSortDataType": 'std',
	
		/**
		 * Class to be applied to the header element when sorting on this column
		 *  @type string
		 *  @default null
		 */
		"sSortingClass": null,
	
		/**
		 * Class to be applied to the header element when sorting on this column -
		 * when jQuery UI theming is used.
		 *  @type string
		 *  @default null
		 */
		"sSortingClassJUI": null,
	
		/**
		 * Title of the column - what is seen in the TH element (nTh).
		 *  @type string
		 */
		"sTitle": null,
	
		/**
		 * Column sorting and filtering type
		 *  @type string
		 *  @default null
		 */
		"sType": null,
	
		/**
		 * Width of the column
		 *  @type string
		 *  @default null
		 */
		"sWidth": null,
	
		/**
		 * Width of the column when it was first "encountered"
		 *  @type string
		 *  @default null
		 */
		"sWidthOrig": null
	};
	
	
	/*
	 * Developer note: The properties of the object below are given in Hungarian
	 * notation, that was used as the interface for DataTables prior to v1.10, however
	 * from v1.10 onwards the primary interface is camel case. In order to avoid
	 * breaking backwards compatibility utterly with this change, the Hungarian
	 * version is still, internally the primary interface, but is is not documented
	 * - hence the @name tags in each doc comment. This allows a Javascript function
	 * to create a map from Hungarian notation to camel case (going the other direction
	 * would require each property to be listed, which would add around 3K to the size
	 * of DataTables, while this method is about a 0.5K hit).
	 *
	 * Ultimately this does pave the way for Hungarian notation to be dropped
	 * completely, but that is a massive amount of work and will break current
	 * installs (therefore is on-hold until v2).
	 */
	
	/**
	 * Initialisation options that can be given to DataTables at initialisation
	 * time.
	 *  @namespace
	 */
	DataTable.defaults = {
		/**
		 * An array of data to use for the table, passed in at initialisation which
		 * will be used in preference to any data which is already in the DOM. This is
		 * particularly useful for constructing tables purely in Javascript, for
		 * example with a custom Ajax call.
		 *  @type array
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.data
		 *
		 *  @example
		 *    // Using a 2D array data source
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "data": [
		 *          ['Trident', 'Internet Explorer 4.0', 'Win 95+', 4, 'X'],
		 *          ['Trident', 'Internet Explorer 5.0', 'Win 95+', 5, 'C'],
		 *        ],
		 *        "columns": [
		 *          { "title": "Engine" },
		 *          { "title": "Browser" },
		 *          { "title": "Platform" },
		 *          { "title": "Version" },
		 *          { "title": "Grade" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using an array of objects as a data source (`data`)
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "data": [
		 *          {
		 *            "engine":   "Trident",
		 *            "browser":  "Internet Explorer 4.0",
		 *            "platform": "Win 95+",
		 *            "version":  4,
		 *            "grade":    "X"
		 *          },
		 *          {
		 *            "engine":   "Trident",
		 *            "browser":  "Internet Explorer 5.0",
		 *            "platform": "Win 95+",
		 *            "version":  5,
		 *            "grade":    "C"
		 *          }
		 *        ],
		 *        "columns": [
		 *          { "title": "Engine",   "data": "engine" },
		 *          { "title": "Browser",  "data": "browser" },
		 *          { "title": "Platform", "data": "platform" },
		 *          { "title": "Version",  "data": "version" },
		 *          { "title": "Grade",    "data": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"aaData": null,
	
	
		/**
		 * If ordering is enabled, then DataTables will perform a first pass sort on
		 * initialisation. You can define which column(s) the sort is performed
		 * upon, and the sorting direction, with this variable. The `sorting` array
		 * should contain an array for each column to be sorted initially containing
		 * the column's index and a direction string ('asc' or 'desc').
		 *  @type array
		 *  @default [[0,'asc']]
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.order
		 *
		 *  @example
		 *    // Sort by 3rd column first, and then 4th column
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "order": [[2,'asc'], [3,'desc']]
		 *      } );
		 *    } );
		 *
		 *    // No initial sorting
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "order": []
		 *      } );
		 *    } );
		 */
		"aaSorting": [[0,'asc']],
	
	
		/**
		 * This parameter is basically identical to the `sorting` parameter, but
		 * cannot be overridden by user interaction with the table. What this means
		 * is that you could have a column (visible or hidden) which the sorting
		 * will always be forced on first - any sorting after that (from the user)
		 * will then be performed as required. This can be useful for grouping rows
		 * together.
		 *  @type array
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.orderFixed
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "orderFixed": [[0,'asc']]
		 *      } );
		 *    } )
		 */
		"aaSortingFixed": [],
	
	
		/**
		 * DataTables can be instructed to load data to display in the table from a
		 * Ajax source. This option defines how that Ajax call is made and where to.
		 *
		 * The `ajax` property has three different modes of operation, depending on
		 * how it is defined. These are:
		 *
		 * * `string` - Set the URL from where the data should be loaded from.
		 * * `object` - Define properties for `jQuery.ajax`.
		 * * `function` - Custom data get function
		 *
		 * `string`
		 * --------
		 *
		 * As a string, the `ajax` property simply defines the URL from which
		 * DataTables will load data.
		 *
		 * `object`
		 * --------
		 *
		 * As an object, the parameters in the object are passed to
		 * [jQuery.ajax](http://api.jquery.com/jQuery.ajax/) allowing fine control
		 * of the Ajax request. DataTables has a number of default parameters which
		 * you can override using this option. Please refer to the jQuery
		 * documentation for a full description of the options available, although
		 * the following parameters provide additional options in DataTables or
		 * require special consideration:
		 *
		 * * `data` - As with jQuery, `data` can be provided as an object, but it
		 *   can also be used as a function to manipulate the data DataTables sends
		 *   to the server. The function takes a single parameter, an object of
		 *   parameters with the values that DataTables has readied for sending. An
		 *   object may be returned which will be merged into the DataTables
		 *   defaults, or you can add the items to the object that was passed in and
		 *   not return anything from the function. This supersedes `fnServerParams`
		 *   from DataTables 1.9-.
		 *
		 * * `dataSrc` - By default DataTables will look for the property `data` (or
		 *   `aaData` for compatibility with DataTables 1.9-) when obtaining data
		 *   from an Ajax source or for server-side processing - this parameter
		 *   allows that property to be changed. You can use Javascript dotted
		 *   object notation to get a data source for multiple levels of nesting, or
		 *   it my be used as a function. As a function it takes a single parameter,
		 *   the JSON returned from the server, which can be manipulated as
		 *   required, with the returned value being that used by DataTables as the
		 *   data source for the table. This supersedes `sAjaxDataProp` from
		 *   DataTables 1.9-.
		 *
		 * * `success` - Should not be overridden it is used internally in
		 *   DataTables. To manipulate / transform the data returned by the server
		 *   use `ajax.dataSrc`, or use `ajax` as a function (see below).
		 *
		 * `function`
		 * ----------
		 *
		 * As a function, making the Ajax call is left up to yourself allowing
		 * complete control of the Ajax request. Indeed, if desired, a method other
		 * than Ajax could be used to obtain the required data, such as Web storage
		 * or an AIR database.
		 *
		 * The function is given four parameters and no return is required. The
		 * parameters are:
		 *
		 * 1. _object_ - Data to send to the server
		 * 2. _function_ - Callback function that must be executed when the required
		 *    data has been obtained. That data should be passed into the callback
		 *    as the only parameter
		 * 3. _object_ - DataTables settings object for the table
		 *
		 * Note that this supersedes `fnServerData` from DataTables 1.9-.
		 *
		 *  @type string|object|function
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.ajax
		 *  @since 1.10.0
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax.
		 *   // Note DataTables expects data in the form `{ data: [ ...data... ] }` by default).
		 *   $('#example').dataTable( {
		 *     "ajax": "data.json"
		 *   } );
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax, using `dataSrc` to change
		 *   // `data` to `tableData` (i.e. `{ tableData: [ ...data... ] }`)
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": "tableData"
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax, using `dataSrc` to read data
		 *   // from a plain array rather than an array in an object
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": ""
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Manipulate the data returned from the server - add a link to data
		 *   // (note this can, should, be done using `render` for the column - this
		 *   // is just a simple example of how the data can be manipulated).
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": function ( json ) {
		 *         for ( var i=0, ien=json.length ; i<ien ; i++ ) {
		 *           json[i][0] = '<a href="/message/'+json[i][0]+'>View message</a>';
		 *         }
		 *         return json;
		 *       }
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Add data to the request
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "data": function ( d ) {
		 *         return {
		 *           "extra_search": $('#extra').val()
		 *         };
		 *       }
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Send request as POST
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "type": "POST"
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Get the data from localStorage (could interface with a form for
		 *   // adding, editing and removing rows).
		 *   $('#example').dataTable( {
		 *     "ajax": function (data, callback, settings) {
		 *       callback(
		 *         JSON.parse( localStorage.getItem('dataTablesData') )
		 *       );
		 *     }
		 *   } );
		 */
		"ajax": null,
	
	
		/**
		 * This parameter allows you to readily specify the entries in the length drop
		 * down menu that DataTables shows when pagination is enabled. It can be
		 * either a 1D array of options which will be used for both the displayed
		 * option and the value, or a 2D array which will use the array in the first
		 * position as the value, and the array in the second position as the
		 * displayed options (useful for language strings such as 'All').
		 *
		 * Note that the `pageLength` property will be automatically set to the
		 * first value given in this array, unless `pageLength` is also provided.
		 *  @type array
		 *  @default [ 10, 25, 50, 100 ]
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.lengthMenu
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
		 *      } );
		 *    } );
		 */
		"aLengthMenu": [ 10, 25, 50, 100 ],
	
	
		/**
		 * The `columns` option in the initialisation parameter allows you to define
		 * details about the way individual columns behave. For a full list of
		 * column options that can be set, please see
		 * {@link DataTable.defaults.column}. Note that if you use `columns` to
		 * define your columns, you must have an entry in the array for every single
		 * column that you have in your table (these can be null if you don't which
		 * to specify any options).
		 *  @member
		 *
		 *  @name DataTable.defaults.column
		 */
		"aoColumns": null,
	
		/**
		 * Very similar to `columns`, `columnDefs` allows you to target a specific
		 * column, multiple columns, or all columns, using the `targets` property of
		 * each object in the array. This allows great flexibility when creating
		 * tables, as the `columnDefs` arrays can be of any length, targeting the
		 * columns you specifically want. `columnDefs` may use any of the column
		 * options available: {@link DataTable.defaults.column}, but it _must_
		 * have `targets` defined in each object in the array. Values in the `targets`
		 * array may be:
		 *   <ul>
		 *     <li>a string - class name will be matched on the TH for the column</li>
		 *     <li>0 or a positive integer - column index counting from the left</li>
		 *     <li>a negative integer - column index counting from the right</li>
		 *     <li>the string "_all" - all columns (i.e. assign a default)</li>
		 *   </ul>
		 *  @member
		 *
		 *  @name DataTable.defaults.columnDefs
		 */
		"aoColumnDefs": null,
	
	
		/**
		 * Basically the same as `search`, this parameter defines the individual column
		 * filtering state at initialisation time. The array must be of the same size
		 * as the number of columns, and each element be an object with the parameters
		 * `search` and `escapeRegex` (the latter is optional). 'null' is also
		 * accepted and the default will be used.
		 *  @type array
		 *  @default []
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.searchCols
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "searchCols": [
		 *          null,
		 *          { "search": "My filter" },
		 *          null,
		 *          { "search": "^[0-9]", "escapeRegex": false }
		 *        ]
		 *      } );
		 *    } )
		 */
		"aoSearchCols": [],
	
	
		/**
		 * An array of CSS classes that should be applied to displayed rows. This
		 * array may be of any length, and DataTables will apply each class
		 * sequentially, looping when required.
		 *  @type array
		 *  @default null <i>Will take the values determined by the `oClasses.stripe*`
		 *    options</i>
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.stripeClasses
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stripeClasses": [ 'strip1', 'strip2', 'strip3' ]
		 *      } );
		 *    } )
		 */
		"asStripeClasses": null,
	
	
		/**
		 * Enable or disable automatic column width calculation. This can be disabled
		 * as an optimisation (it takes some time to calculate the widths) if the
		 * tables widths are passed in using `columns`.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.autoWidth
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "autoWidth": false
		 *      } );
		 *    } );
		 */
		"bAutoWidth": true,
	
	
		/**
		 * Deferred rendering can provide DataTables with a huge speed boost when you
		 * are using an Ajax or JS data source for the table. This option, when set to
		 * true, will cause DataTables to defer the creation of the table elements for
		 * each row until they are needed for a draw - saving a significant amount of
		 * time.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.deferRender
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajax": "sources/arrays.txt",
		 *        "deferRender": true
		 *      } );
		 *    } );
		 */
		"bDeferRender": false,
	
	
		/**
		 * Replace a DataTable which matches the given selector and replace it with
		 * one which has the properties of the new initialisation object passed. If no
		 * table matches the selector, then the new DataTable will be constructed as
		 * per normal.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.destroy
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "srollY": "200px",
		 *        "paginate": false
		 *      } );
		 *
		 *      // Some time later....
		 *      $('#example').dataTable( {
		 *        "filter": false,
		 *        "destroy": true
		 *      } );
		 *    } );
		 */
		"bDestroy": false,
	
	
		/**
		 * Enable or disable filtering of data. Filtering in DataTables is "smart" in
		 * that it allows the end user to input multiple words (space separated) and
		 * will match a row containing those words, even if not in the order that was
		 * specified (this allow matching across multiple columns). Note that if you
		 * wish to use filtering in DataTables this must remain 'true' - to remove the
		 * default filtering input box and retain filtering abilities, please use
		 * {@link DataTable.defaults.dom}.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.searching
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "searching": false
		 *      } );
		 *    } );
		 */
		"bFilter": true,
	
	
		/**
		 * Enable or disable the table information display. This shows information
		 * about the data that is currently visible on the page, including information
		 * about filtered data if that action is being performed.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.info
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "info": false
		 *      } );
		 *    } );
		 */
		"bInfo": true,
	
	
		/**
		 * Allows the end user to select the size of a formatted page from a select
		 * menu (sizes are 10, 25, 50 and 100). Requires pagination (`paginate`).
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.lengthChange
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "lengthChange": false
		 *      } );
		 *    } );
		 */
		"bLengthChange": true,
	
	
		/**
		 * Enable or disable pagination.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.paging
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "paging": false
		 *      } );
		 *    } );
		 */
		"bPaginate": true,
	
	
		/**
		 * Enable or disable the display of a 'processing' indicator when the table is
		 * being processed (e.g. a sort). This is particularly useful for tables with
		 * large amounts of data where it can take a noticeable amount of time to sort
		 * the entries.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.processing
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "processing": true
		 *      } );
		 *    } );
		 */
		"bProcessing": false,
	
	
		/**
		 * Retrieve the DataTables object for the given selector. Note that if the
		 * table has already been initialised, this parameter will cause DataTables
		 * to simply return the object that has already been set up - it will not take
		 * account of any changes you might have made to the initialisation object
		 * passed to DataTables (setting this parameter to true is an acknowledgement
		 * that you understand this). `destroy` can be used to reinitialise a table if
		 * you need.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.retrieve
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      initTable();
		 *      tableActions();
		 *    } );
		 *
		 *    function initTable ()
		 *    {
		 *      return $('#example').dataTable( {
		 *        "scrollY": "200px",
		 *        "paginate": false,
		 *        "retrieve": true
		 *      } );
		 *    }
		 *
		 *    function tableActions ()
		 *    {
		 *      var table = initTable();
		 *      // perform API operations with oTable
		 *    }
		 */
		"bRetrieve": false,
	
	
		/**
		 * When vertical (y) scrolling is enabled, DataTables will force the height of
		 * the table's viewport to the given height at all times (useful for layout).
		 * However, this can look odd when filtering data down to a small data set,
		 * and the footer is left "floating" further down. This parameter (when
		 * enabled) will cause DataTables to collapse the table's viewport down when
		 * the result set will fit within the given Y height.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.scrollCollapse
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollY": "200",
		 *        "scrollCollapse": true
		 *      } );
		 *    } );
		 */
		"bScrollCollapse": false,
	
	
		/**
		 * Configure DataTables to use server-side processing. Note that the
		 * `ajax` parameter must also be given in order to give DataTables a
		 * source to obtain the required data for each draw.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverSide
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "xhr.php"
		 *      } );
		 *    } );
		 */
		"bServerSide": false,
	
	
		/**
		 * Enable or disable sorting of columns. Sorting of individual columns can be
		 * disabled by the `sortable` option for each column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.ordering
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "ordering": false
		 *      } );
		 *    } );
		 */
		"bSort": true,
	
	
		/**
		 * Enable or display DataTables' ability to sort multiple columns at the
		 * same time (activated by shift-click by the user).
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.orderMulti
		 *
		 *  @example
		 *    // Disable multiple column sorting ability
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "orderMulti": false
		 *      } );
		 *    } );
		 */
		"bSortMulti": true,
	
	
		/**
		 * Allows control over whether DataTables should use the top (true) unique
		 * cell that is found for a single column, or the bottom (false - default).
		 * This is useful when using complex headers.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.orderCellsTop
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "orderCellsTop": true
		 *      } );
		 *    } );
		 */
		"bSortCellsTop": false,
	
	
		/**
		 * Enable or disable the addition of the classes `sorting\_1`, `sorting\_2` and
		 * `sorting\_3` to the columns which are currently being sorted on. This is
		 * presented as a feature switch as it can increase processing time (while
		 * classes are removed and added) so for large data sets you might want to
		 * turn this off.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.orderClasses
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "orderClasses": false
		 *      } );
		 *    } );
		 */
		"bSortClasses": true,
	
	
		/**
		 * Enable or disable state saving. When enabled HTML5 `localStorage` will be
		 * used to save table display information such as pagination information,
		 * display length, filtering and sorting. As such when the end user reloads
		 * the page the display display will match what thy had previously set up.
		 *
		 * Due to the use of `localStorage` the default state saving is not supported
		 * in IE6 or 7. If state saving is required in those browsers, use
		 * `stateSaveCallback` to provide a storage solution such as cookies.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.stateSave
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "stateSave": true
		 *      } );
		 *    } );
		 */
		"bStateSave": false,
	
	
		/**
		 * This function is called when a TR element is created (and all TD child
		 * elements have been inserted), or registered if using a DOM source, allowing
		 * manipulation of the TR element (adding classes etc).
		 *  @type function
		 *  @param {node} row "TR" element for the current row
		 *  @param {array} data Raw data array for this row
		 *  @param {int} dataIndex The index of this row in the internal aoData array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.createdRow
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "createdRow": function( row, data, dataIndex ) {
		 *          // Bold the grade for all 'A' grade browsers
		 *          if ( data[4] == "A" )
		 *          {
		 *            $('td:eq(4)', row).html( '<b>A</b>' );
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnCreatedRow": null,
	
	
		/**
		 * This function is called on every 'draw' event, and allows you to
		 * dynamically modify any aspect you want about the created DOM.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.drawCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "drawCallback": function( settings ) {
		 *          alert( 'DataTables has redrawn the table' );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnDrawCallback": null,
	
	
		/**
		 * Identical to fnHeaderCallback() but for the table footer this function
		 * allows you to modify the table footer on every 'draw' event.
		 *  @type function
		 *  @param {node} foot "TR" element for the footer
		 *  @param {array} data Full table data (as derived from the original HTML)
		 *  @param {int} start Index for the current display starting point in the
		 *    display array
		 *  @param {int} end Index for the current display ending point in the
		 *    display array
		 *  @param {array int} display Index array to translate the visual position
		 *    to the full data array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.footerCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "footerCallback": function( tfoot, data, start, end, display ) {
		 *          tfoot.getElementsByTagName('th')[0].innerHTML = "Starting index is "+start;
		 *        }
		 *      } );
		 *    } )
		 */
		"fnFooterCallback": null,
	
	
		/**
		 * When rendering large numbers in the information element for the table
		 * (i.e. "Showing 1 to 10 of 57 entries") DataTables will render large numbers
		 * to have a comma separator for the 'thousands' units (e.g. 1 million is
		 * rendered as "1,000,000") to help readability for the end user. This
		 * function will override the default method DataTables uses.
		 *  @type function
		 *  @member
		 *  @param {int} toFormat number to be formatted
		 *  @returns {string} formatted string for DataTables to show the number
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.formatNumber
		 *
		 *  @example
		 *    // Format a number using a single quote for the separator (note that
		 *    // this can also be done with the language.thousands option)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "formatNumber": function ( toFormat ) {
		 *          return toFormat.toString().replace(
		 *            /\B(?=(\d{3})+(?!\d))/g, "'"
		 *          );
		 *        };
		 *      } );
		 *    } );
		 */
		"fnFormatNumber": function ( toFormat ) {
			return toFormat.toString().replace(
				/\B(?=(\d{3})+(?!\d))/g,
				this.oLanguage.sThousands
			);
		},
	
	
		/**
		 * This function is called on every 'draw' event, and allows you to
		 * dynamically modify the header row. This can be used to calculate and
		 * display useful information about the table.
		 *  @type function
		 *  @param {node} head "TR" element for the header
		 *  @param {array} data Full table data (as derived from the original HTML)
		 *  @param {int} start Index for the current display starting point in the
		 *    display array
		 *  @param {int} end Index for the current display ending point in the
		 *    display array
		 *  @param {array int} display Index array to translate the visual position
		 *    to the full data array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.headerCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "fheaderCallback": function( head, data, start, end, display ) {
		 *          head.getElementsByTagName('th')[0].innerHTML = "Displaying "+(end-start)+" records";
		 *        }
		 *      } );
		 *    } )
		 */
		"fnHeaderCallback": null,
	
	
		/**
		 * The information element can be used to convey information about the current
		 * state of the table. Although the internationalisation options presented by
		 * DataTables are quite capable of dealing with most customisations, there may
		 * be times where you wish to customise the string further. This callback
		 * allows you to do exactly that.
		 *  @type function
		 *  @param {object} oSettings DataTables settings object
		 *  @param {int} start Starting position in data for the draw
		 *  @param {int} end End position in data for the draw
		 *  @param {int} max Total number of rows in the table (regardless of
		 *    filtering)
		 *  @param {int} total Total number of rows in the data set, after filtering
		 *  @param {string} pre The string that DataTables has formatted using it's
		 *    own rules
		 *  @returns {string} The string to be displayed in the information element.
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.infoCallback
		 *
		 *  @example
		 *    $('#example').dataTable( {
		 *      "infoCallback": function( settings, start, end, max, total, pre ) {
		 *        return start +" to "+ end;
		 *      }
		 *    } );
		 */
		"fnInfoCallback": null,
	
	
		/**
		 * Called when the table has been initialised. Normally DataTables will
		 * initialise sequentially and there will be no need for this function,
		 * however, this does not hold true when using external language information
		 * since that is obtained using an async XHR call.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} json The JSON object request from the server - only
		 *    present if client-side Ajax sourced data is used
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.initComplete
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "initComplete": function(settings, json) {
		 *          alert( 'DataTables has finished its initialisation.' );
		 *        }
		 *      } );
		 *    } )
		 */
		"fnInitComplete": null,
	
	
		/**
		 * Called at the very start of each table draw and can be used to cancel the
		 * draw by returning false, any other return (including undefined) results in
		 * the full draw occurring).
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @returns {boolean} False will cancel the draw, anything else (including no
		 *    return) will allow it to complete.
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.preDrawCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "preDrawCallback": function( settings ) {
		 *          if ( $('#test').val() == 1 ) {
		 *            return false;
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnPreDrawCallback": null,
	
	
		/**
		 * This function allows you to 'post process' each row after it have been
		 * generated for each table draw, but before it is rendered on screen. This
		 * function might be used for setting the row class name etc.
		 *  @type function
		 *  @param {node} row "TR" element for the current row
		 *  @param {array} data Raw data array for this row
		 *  @param {int} displayIndex The display index for the current table draw
		 *  @param {int} displayIndexFull The index of the data in the full list of
		 *    rows (after filtering)
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.rowCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "rowCallback": function( row, data, displayIndex, displayIndexFull ) {
		 *          // Bold the grade for all 'A' grade browsers
		 *          if ( data[4] == "A" ) {
		 *            $('td:eq(4)', row).html( '<b>A</b>' );
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnRowCallback": null,
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * This parameter allows you to override the default function which obtains
		 * the data from the server so something more suitable for your application.
		 * For example you could use POST data, or pull information from a Gears or
		 * AIR database.
		 *  @type function
		 *  @member
		 *  @param {string} source HTTP source to obtain the data from (`ajax`)
		 *  @param {array} data A key/value pair object containing the data to send
		 *    to the server
		 *  @param {function} callback to be called on completion of the data get
		 *    process that will draw the data on the page.
		 *  @param {object} settings DataTables settings object
		 *
		 *  @dtopt Callbacks
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverData
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"fnServerData": null,
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 *  It is often useful to send extra data to the server when making an Ajax
		 * request - for example custom filtering information, and this callback
		 * function makes it trivial to send extra information to the server. The
		 * passed in parameter is the data set that has been constructed by
		 * DataTables, and you can add to this or modify it as you require.
		 *  @type function
		 *  @param {array} data Data array (array of objects which are name/value
		 *    pairs) that has been constructed by DataTables and will be sent to the
		 *    server. In the case of Ajax sourced data with server-side processing
		 *    this will be an empty array, for server-side processing there will be a
		 *    significant number of parameters!
		 *  @returns {undefined} Ensure that you modify the data array passed in,
		 *    as this is passed by reference.
		 *
		 *  @dtopt Callbacks
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverParams
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"fnServerParams": null,
	
	
		/**
		 * Load the table state. With this function you can define from where, and how, the
		 * state of a table is loaded. By default DataTables will load from `localStorage`
		 * but you might wish to use a server-side database or cookies.
		 *  @type function
		 *  @member
		 *  @param {object} settings DataTables settings object
		 *  @param {object} callback Callback that can be executed when done. It
		 *    should be passed the loaded state object.
		 *  @return {object} The DataTables state object to be loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoadCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadCallback": function (settings, callback) {
		 *          $.ajax( {
		 *            "url": "/state_load",
		 *            "dataType": "json",
		 *            "success": function (json) {
		 *              callback( json );
		 *            }
		 *          } );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoadCallback": function ( settings ) {
			try {
				return JSON.parse(
					(settings.iStateDuration === -1 ? sessionStorage : localStorage).getItem(
						'DataTables_'+settings.sInstance+'_'+location.pathname
					)
				);
			} catch (e) {
				return {};
			}
		},
	
	
		/**
		 * Callback which allows modification of the saved state prior to loading that state.
		 * This callback is called when the table is loading state from the stored data, but
		 * prior to the settings object being modified by the saved state. Note that for
		 * plug-in authors, you should use the `stateLoadParams` event to load parameters for
		 * a plug-in.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object that is to be loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoadParams
		 *
		 *  @example
		 *    // Remove a saved filter, so filtering is never loaded
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadParams": function (settings, data) {
		 *          data.oSearch.sSearch = "";
		 *        }
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Disallow state loading by returning false
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadParams": function (settings, data) {
		 *          return false;
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoadParams": null,
	
	
		/**
		 * Callback that is called when the state has been loaded from the state saving method
		 * and the DataTables settings object has been modified as a result of the loaded state.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object that was loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoaded
		 *
		 *  @example
		 *    // Show an alert with the filtering value that was saved
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoaded": function (settings, data) {
		 *          alert( 'Saved filter was: '+data.oSearch.sSearch );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoaded": null,
	
	
		/**
		 * Save the table state. This function allows you to define where and how the state
		 * information for the table is stored By default DataTables will use `localStorage`
		 * but you might wish to use a server-side database or cookies.
		 *  @type function
		 *  @member
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object to be saved
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateSaveCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateSaveCallback": function (settings, data) {
		 *          // Send an Ajax request to the server with the state object
		 *          $.ajax( {
		 *            "url": "/state_save",
		 *            "data": data,
		 *            "dataType": "json",
		 *            "method": "POST"
		 *            "success": function () {}
		 *          } );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateSaveCallback": function ( settings, data ) {
			try {
				(settings.iStateDuration === -1 ? sessionStorage : localStorage).setItem(
					'DataTables_'+settings.sInstance+'_'+location.pathname,
					JSON.stringify( data )
				);
			} catch (e) {}
		},
	
	
		/**
		 * Callback which allows modification of the state to be saved. Called when the table
		 * has changed state a new state save is required. This method allows modification of
		 * the state saving object prior to actually doing the save, including addition or
		 * other state properties or modification. Note that for plug-in authors, you should
		 * use the `stateSaveParams` event to save parameters for a plug-in.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object to be saved
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateSaveParams
		 *
		 *  @example
		 *    // Remove a saved filter, so filtering is never saved
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateSaveParams": function (settings, data) {
		 *          data.oSearch.sSearch = "";
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateSaveParams": null,
	
	
		/**
		 * Duration for which the saved state information is considered valid. After this period
		 * has elapsed the state will be returned to the default.
		 * Value is given in seconds.
		 *  @type int
		 *  @default 7200 <i>(2 hours)</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.stateDuration
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateDuration": 60*60*24; // 1 day
		 *      } );
		 *    } )
		 */
		"iStateDuration": 7200,
	
	
		/**
		 * When enabled DataTables will not make a request to the server for the first
		 * page draw - rather it will use the data already on the page (no sorting etc
		 * will be applied to it), thus saving on an XHR at load time. `deferLoading`
		 * is used to indicate that deferred loading is required, but it is also used
		 * to tell DataTables how many records there are in the full table (allowing
		 * the information element and pagination to be displayed correctly). In the case
		 * where a filtering is applied to the table on initial load, this can be
		 * indicated by giving the parameter as an array, where the first element is
		 * the number of records available after filtering and the second element is the
		 * number of records without filtering (allowing the table information element
		 * to be shown correctly).
		 *  @type int | array
		 *  @default null
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.deferLoading
		 *
		 *  @example
		 *    // 57 records available in the table, no filtering applied
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "scripts/server_processing.php",
		 *        "deferLoading": 57
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // 57 records after filtering, 100 without filtering (an initial filter applied)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "scripts/server_processing.php",
		 *        "deferLoading": [ 57, 100 ],
		 *        "search": {
		 *          "search": "my_filter"
		 *        }
		 *      } );
		 *    } );
		 */
		"iDeferLoading": null,
	
	
		/**
		 * Number of rows to display on a single page when using pagination. If
		 * feature enabled (`lengthChange`) then the end user will be able to override
		 * this to a custom setting using a pop-up menu.
		 *  @type int
		 *  @default 10
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.pageLength
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "pageLength": 50
		 *      } );
		 *    } )
		 */
		"iDisplayLength": 10,
	
	
		/**
		 * Define the starting point for data display when using DataTables with
		 * pagination. Note that this parameter is the number of records, rather than
		 * the page number, so if you have 10 records per page and want to start on
		 * the third page, it should be "20".
		 *  @type int
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.displayStart
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "displayStart": 20
		 *      } );
		 *    } )
		 */
		"iDisplayStart": 0,
	
	
		/**
		 * By default DataTables allows keyboard navigation of the table (sorting, paging,
		 * and filtering) by adding a `tabindex` attribute to the required elements. This
		 * allows you to tab through the controls and press the enter key to activate them.
		 * The tabindex is default 0, meaning that the tab follows the flow of the document.
		 * You can overrule this using this parameter if you wish. Use a value of -1 to
		 * disable built-in keyboard navigation.
		 *  @type int
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.tabIndex
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "tabIndex": 1
		 *      } );
		 *    } );
		 */
		"iTabIndex": 0,
	
	
		/**
		 * Classes that DataTables assigns to the various components and features
		 * that it adds to the HTML table. This allows classes to be configured
		 * during initialisation in addition to through the static
		 * {@link DataTable.ext.oStdClasses} object).
		 *  @namespace
		 *  @name DataTable.defaults.classes
		 */
		"oClasses": {},
	
	
		/**
		 * All strings that DataTables uses in the user interface that it creates
		 * are defined in this object, allowing you to modified them individually or
		 * completely replace them all as required.
		 *  @namespace
		 *  @name DataTable.defaults.language
		 */
		"oLanguage": {
			/**
			 * Strings that are used for WAI-ARIA labels and controls only (these are not
			 * actually visible on the page, but will be read by screenreaders, and thus
			 * must be internationalised as well).
			 *  @namespace
			 *  @name DataTable.defaults.language.aria
			 */
			"oAria": {
				/**
				 * ARIA label that is added to the table headers when the column may be
				 * sorted ascending by activing the column (click or return when focused).
				 * Note that the column header is prefixed to this string.
				 *  @type string
				 *  @default : activate to sort column ascending
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.aria.sortAscending
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "aria": {
				 *            "sortAscending": " - click/return to sort ascending"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sSortAscending": ": activate to sort column ascending",
	
				/**
				 * ARIA label that is added to the table headers when the column may be
				 * sorted descending by activing the column (click or return when focused).
				 * Note that the column header is prefixed to this string.
				 *  @type string
				 *  @default : activate to sort column ascending
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.aria.sortDescending
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "aria": {
				 *            "sortDescending": " - click/return to sort descending"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sSortDescending": ": activate to sort column descending"
			},
	
			/**
			 * Pagination string used by DataTables for the built-in pagination
			 * control types.
			 *  @namespace
			 *  @name DataTable.defaults.language.paginate
			 */
			"oPaginate": {
				/**
				 * Text to use when using the 'full_numbers' type of pagination for the
				 * button to take the user to the first page.
				 *  @type string
				 *  @default First
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.first
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "first": "First page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sFirst": "First",
	
	
				/**
				 * Text to use when using the 'full_numbers' type of pagination for the
				 * button to take the user to the last page.
				 *  @type string
				 *  @default Last
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.last
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "last": "Last page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sLast": "Last",
	
	
				/**
				 * Text to use for the 'next' pagination button (to take the user to the
				 * next page).
				 *  @type string
				 *  @default Next
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.next
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "next": "Next page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sNext": "Next",
	
	
				/**
				 * Text to use for the 'previous' pagination button (to take the user to
				 * the previous page).
				 *  @type string
				 *  @default Previous
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.previous
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "previous": "Previous page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sPrevious": "Previous"
			},
	
			/**
			 * This string is shown in preference to `zeroRecords` when the table is
			 * empty of data (regardless of filtering). Note that this is an optional
			 * parameter - if it is not given, the value of `zeroRecords` will be used
			 * instead (either the default or given value).
			 *  @type string
			 *  @default No data available in table
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.emptyTable
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "emptyTable": "No data available in table"
			 *        }
			 *      } );
			 *    } );
			 */
			"sEmptyTable": "No data available in table",
	
	
			/**
			 * This string gives information to the end user about the information
			 * that is current on display on the page. The following tokens can be
			 * used in the string and will be dynamically replaced as the table
			 * display updates. This tokens can be placed anywhere in the string, or
			 * removed as needed by the language requires:
			 *
			 * * `\_START\_` - Display index of the first record on the current page
			 * * `\_END\_` - Display index of the last record on the current page
			 * * `\_TOTAL\_` - Number of records in the table after filtering
			 * * `\_MAX\_` - Number of records in the table without filtering
			 * * `\_PAGE\_` - Current page number
			 * * `\_PAGES\_` - Total number of pages of data in the table
			 *
			 *  @type string
			 *  @default Showing _START_ to _END_ of _TOTAL_ entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.info
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "info": "Showing page _PAGE_ of _PAGES_"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfo": "Showing _START_ to _END_ of _TOTAL_ entries",
	
	
			/**
			 * Display information string for when the table is empty. Typically the
			 * format of this string should match `info`.
			 *  @type string
			 *  @default Showing 0 to 0 of 0 entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoEmpty
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoEmpty": "No entries to show"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoEmpty": "Showing 0 to 0 of 0 entries",
	
	
			/**
			 * When a user filters the information in a table, this string is appended
			 * to the information (`info`) to give an idea of how strong the filtering
			 * is. The variable _MAX_ is dynamically updated.
			 *  @type string
			 *  @default (filtered from _MAX_ total entries)
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoFiltered
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoFiltered": " - filtering from _MAX_ records"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoFiltered": "(filtered from _MAX_ total entries)",
	
	
			/**
			 * If can be useful to append extra information to the info string at times,
			 * and this variable does exactly that. This information will be appended to
			 * the `info` (`infoEmpty` and `infoFiltered` in whatever combination they are
			 * being used) at all times.
			 *  @type string
			 *  @default <i>Empty string</i>
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoPostFix
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoPostFix": "All records shown are derived from real information."
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoPostFix": "",
	
	
			/**
			 * This decimal place operator is a little different from the other
			 * language options since DataTables doesn't output floating point
			 * numbers, so it won't ever use this for display of a number. Rather,
			 * what this parameter does is modify the sort methods of the table so
			 * that numbers which are in a format which has a character other than
			 * a period (`.`) as a decimal place will be sorted numerically.
			 *
			 * Note that numbers with different decimal places cannot be shown in
			 * the same table and still be sortable, the table must be consistent.
			 * However, multiple different tables on the page can use different
			 * decimal place characters.
			 *  @type string
			 *  @default 
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.decimal
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "decimal": ","
			 *          "thousands": "."
			 *        }
			 *      } );
			 *    } );
			 */
			"sDecimal": "",
	
	
			/**
			 * DataTables has a build in number formatter (`formatNumber`) which is
			 * used to format large numbers that are used in the table information.
			 * By default a comma is used, but this can be trivially changed to any
			 * character you wish with this parameter.
			 *  @type string
			 *  @default ,
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.thousands
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "thousands": "'"
			 *        }
			 *      } );
			 *    } );
			 */
			"sThousands": ",",
	
	
			/**
			 * Detail the action that will be taken when the drop down menu for the
			 * pagination length option is changed. The '_MENU_' variable is replaced
			 * with a default select list of 10, 25, 50 and 100, and can be replaced
			 * with a custom select box if required.
			 *  @type string
			 *  @default Show _MENU_ entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.lengthMenu
			 *
			 *  @example
			 *    // Language change only
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "lengthMenu": "Display _MENU_ records"
			 *        }
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Language and options change
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "lengthMenu": 'Display <select>'+
			 *            '<option value="10">10</option>'+
			 *            '<option value="20">20</option>'+
			 *            '<option value="30">30</option>'+
			 *            '<option value="40">40</option>'+
			 *            '<option value="50">50</option>'+
			 *            '<option value="-1">All</option>'+
			 *            '</select> records'
			 *        }
			 *      } );
			 *    } );
			 */
			"sLengthMenu": "Show _MENU_ entries",
	
	
			/**
			 * When using Ajax sourced data and during the first draw when DataTables is
			 * gathering the data, this message is shown in an empty row in the table to
			 * indicate to the end user the the data is being loaded. Note that this
			 * parameter is not used when loading data by server-side processing, just
			 * Ajax sourced data with client-side processing.
			 *  @type string
			 *  @default Loading...
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.loadingRecords
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "loadingRecords": "Please wait - loading..."
			 *        }
			 *      } );
			 *    } );
			 */
			"sLoadingRecords": "Loading...",
	
	
			/**
			 * Text which is displayed when the table is processing a user action
			 * (usually a sort command or similar).
			 *  @type string
			 *  @default Processing...
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.processing
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "processing": "DataTables is currently busy"
			 *        }
			 *      } );
			 *    } );
			 */
			"sProcessing": "Processing...",
	
	
			/**
			 * Details the actions that will be taken when the user types into the
			 * filtering input text box. The variable "_INPUT_", if used in the string,
			 * is replaced with the HTML text box for the filtering input allowing
			 * control over where it appears in the string. If "_INPUT_" is not given
			 * then the input box is appended to the string automatically.
			 *  @type string
			 *  @default Search:
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.search
			 *
			 *  @example
			 *    // Input text box will be appended at the end automatically
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "search": "Filter records:"
			 *        }
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Specify where the filter should appear
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "search": "Apply filter _INPUT_ to table"
			 *        }
			 *      } );
			 *    } );
			 */
			"sSearch": "Search:",
	
	
			/**
			 * Assign a `placeholder` attribute to the search `input` element
			 *  @type string
			 *  @default 
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.searchPlaceholder
			 */
			"sSearchPlaceholder": "",
	
	
			/**
			 * All of the language information can be stored in a file on the
			 * server-side, which DataTables will look up if this parameter is passed.
			 * It must store the URL of the language file, which is in a JSON format,
			 * and the object has the same properties as the oLanguage object in the
			 * initialiser object (i.e. the above parameters). Please refer to one of
			 * the example language files to see how this works in action.
			 *  @type string
			 *  @default <i>Empty string - i.e. disabled</i>
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.url
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "url": "http://www.sprymedia.co.uk/dataTables/lang.txt"
			 *        }
			 *      } );
			 *    } );
			 */
			"sUrl": "",
	
	
			/**
			 * Text shown inside the table records when the is no information to be
			 * displayed after filtering. `emptyTable` is shown when there is simply no
			 * information in the table at all (regardless of filtering).
			 *  @type string
			 *  @default No matching records found
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.zeroRecords
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "zeroRecords": "No records to display"
			 *        }
			 *      } );
			 *    } );
			 */
			"sZeroRecords": "No matching records found"
		},
	
	
		/**
		 * This parameter allows you to have define the global filtering state at
		 * initialisation time. As an object the `search` parameter must be
		 * defined, but all other parameters are optional. When `regex` is true,
		 * the search string will be treated as a regular expression, when false
		 * (default) it will be treated as a straight string. When `smart`
		 * DataTables will use it's smart filtering methods (to word match at
		 * any point in the data), when false this will not be done.
		 *  @namespace
		 *  @extends DataTable.models.oSearch
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.search
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "search": {"search": "Initial search"}
		 *      } );
		 *    } )
		 */
		"oSearch": $.extend( {}, DataTable.models.oSearch ),
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * By default DataTables will look for the property `data` (or `aaData` for
		 * compatibility with DataTables 1.9-) when obtaining data from an Ajax
		 * source or for server-side processing - this parameter allows that
		 * property to be changed. You can use Javascript dotted object notation to
		 * get a data source for multiple levels of nesting.
		 *  @type string
		 *  @default data
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.ajaxDataProp
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sAjaxDataProp": "data",
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * You can instruct DataTables to load data from an external
		 * source using this parameter (use aData if you want to pass data in you
		 * already have). Simply provide a url a JSON object can be obtained from.
		 *  @type string
		 *  @default null
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.ajaxSource
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sAjaxSource": null,
	
	
		/**
		 * This initialisation variable allows you to specify exactly where in the
		 * DOM you want DataTables to inject the various controls it adds to the page
		 * (for example you might want the pagination controls at the top of the
		 * table). DIV elements (with or without a custom class) can also be added to
		 * aid styling. The follow syntax is used:
		 *   <ul>
		 *     <li>The following options are allowed:
		 *       <ul>
		 *         <li>'l' - Length changing</li>
		 *         <li>'f' - Filtering input</li>
		 *         <li>'t' - The table!</li>
		 *         <li>'i' - Information</li>
		 *         <li>'p' - Pagination</li>
		 *         <li>'r' - pRocessing</li>
		 *       </ul>
		 *     </li>
		 *     <li>The following constants are allowed:
		 *       <ul>
		 *         <li>'H' - jQueryUI theme "header" classes ('fg-toolbar ui-widget-header ui-corner-tl ui-corner-tr ui-helper-clearfix')</li>
		 *         <li>'F' - jQueryUI theme "footer" classes ('fg-toolbar ui-widget-header ui-corner-bl ui-corner-br ui-helper-clearfix')</li>
		 *       </ul>
		 *     </li>
		 *     <li>The following syntax is expected:
		 *       <ul>
		 *         <li>'&lt;' and '&gt;' - div elements</li>
		 *         <li>'&lt;"class" and '&gt;' - div with a class</li>
		 *         <li>'&lt;"#id" and '&gt;' - div with an ID</li>
		 *       </ul>
		 *     </li>
		 *     <li>Examples:
		 *       <ul>
		 *         <li>'&lt;"wrapper"flipt&gt;'</li>
		 *         <li>'&lt;lf&lt;t&gt;ip&gt;'</li>
		 *       </ul>
		 *     </li>
		 *   </ul>
		 *  @type string
		 *  @default lfrtip <i>(when `jQueryUI` is false)</i> <b>or</b>
		 *    <"H"lfr>t<"F"ip> <i>(when `jQueryUI` is true)</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.dom
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "dom": '&lt;"top"i&gt;rt&lt;"bottom"flp&gt;&lt;"clear"&gt;'
		 *      } );
		 *    } );
		 */
		"sDom": "lfrtip",
	
	
		/**
		 * Search delay option. This will throttle full table searches that use the
		 * DataTables provided search input element (it does not effect calls to
		 * `dt-api search()`, providing a delay before the search is made.
		 *  @type integer
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.searchDelay
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "searchDelay": 200
		 *      } );
		 *    } )
		 */
		"searchDelay": null,
	
	
		/**
		 * DataTables features six different built-in options for the buttons to
		 * display for pagination control:
		 *
		 * * `numbers` - Page number buttons only
		 * * `simple` - 'Previous' and 'Next' buttons only
		 * * 'simple_numbers` - 'Previous' and 'Next' buttons, plus page numbers
		 * * `full` - 'First', 'Previous', 'Next' and 'Last' buttons
		 * * `full_numbers` - 'First', 'Previous', 'Next' and 'Last' buttons, plus page numbers
		 * * `first_last_numbers` - 'First' and 'Last' buttons, plus page numbers
		 *  
		 * Further methods can be added using {@link DataTable.ext.oPagination}.
		 *  @type string
		 *  @default simple_numbers
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.pagingType
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "pagingType": "full_numbers"
		 *      } );
		 *    } )
		 */
		"sPaginationType": "simple_numbers",
	
	
		/**
		 * Enable horizontal scrolling. When a table is too wide to fit into a
		 * certain layout, or you have a large number of columns in the table, you
		 * can enable x-scrolling to show the table in a viewport, which can be
		 * scrolled. This property can be `true` which will allow the table to
		 * scroll horizontally when needed, or any CSS unit, or a number (in which
		 * case it will be treated as a pixel measurement). Setting as simply `true`
		 * is recommended.
		 *  @type boolean|string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.scrollX
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollX": true,
		 *        "scrollCollapse": true
		 *      } );
		 *    } );
		 */
		"sScrollX": "",
	
	
		/**
		 * This property can be used to force a DataTable to use more width than it
		 * might otherwise do when x-scrolling is enabled. For example if you have a
		 * table which requires to be well spaced, this parameter is useful for
		 * "over-sizing" the table, and thus forcing scrolling. This property can by
		 * any CSS unit, or a number (in which case it will be treated as a pixel
		 * measurement).
		 *  @type string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.scrollXInner
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollX": "100%",
		 *        "scrollXInner": "110%"
		 *      } );
		 *    } );
		 */
		"sScrollXInner": "",
	
	
		/**
		 * Enable vertical scrolling. Vertical scrolling will constrain the DataTable
		 * to the given height, and enable scrolling for any data which overflows the
		 * current viewport. This can be used as an alternative to paging to display
		 * a lot of data in a small area (although paging and scrolling can both be
		 * enabled at the same time). This property can be any CSS unit, or a number
		 * (in which case it will be treated as a pixel measurement).
		 *  @type string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.scrollY
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollY": "200px",
		 *        "paginate": false
		 *      } );
		 *    } );
		 */
		"sScrollY": "",
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * Set the HTTP method that is used to make the Ajax call for server-side
		 * processing or Ajax sourced data.
		 *  @type string
		 *  @default GET
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverMethod
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sServerMethod": "GET",
	
	
		/**
		 * DataTables makes use of renderers when displaying HTML elements for
		 * a table. These renderers can be added or modified by plug-ins to
		 * generate suitable mark-up for a site. For example the Bootstrap
		 * integration plug-in for DataTables uses a paging button renderer to
		 * display pagination buttons in the mark-up required by Bootstrap.
		 *
		 * For further information about the renderers available see
		 * DataTable.ext.renderer
		 *  @type string|object
		 *  @default null
		 *
		 *  @name DataTable.defaults.renderer
		 *
		 */
		"renderer": null,
	
	
		/**
		 * Set the data property name that DataTables should use to get a row's id
		 * to set as the `id` property in the node.
		 *  @type string
		 *  @default DT_RowId
		 *
		 *  @name DataTable.defaults.rowId
		 */
		"rowId": "DT_RowId"
	};
	
	_fnHungarianMap( DataTable.defaults );
	
	
	
	/*
	 * Developer note - See note in model.defaults.js about the use of Hungarian
	 * notation and camel case.
	 */
	
	/**
	 * Column options that can be given to DataTables at initialisation time.
	 *  @namespace
	 */
	DataTable.defaults.column = {
		/**
		 * Define which column(s) an order will occur on for this column. This
		 * allows a column's ordering to take multiple columns into account when
		 * doing a sort or use the data from a different column. For example first
		 * name / last name columns make sense to do a multi-column sort over the
		 * two columns.
		 *  @type array|int
		 *  @default null <i>Takes the value of the column index automatically</i>
		 *
		 *  @name DataTable.defaults.column.orderData
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderData": [ 0, 1 ], "targets": [ 0 ] },
		 *          { "orderData": [ 1, 0 ], "targets": [ 1 ] },
		 *          { "orderData": 2, "targets": [ 2 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "orderData": [ 0, 1 ] },
		 *          { "orderData": [ 1, 0 ] },
		 *          { "orderData": 2 },
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"aDataSort": null,
		"iDataSort": -1,
	
	
		/**
		 * You can control the default ordering direction, and even alter the
		 * behaviour of the sort handler (i.e. only allow ascending ordering etc)
		 * using this parameter.
		 *  @type array
		 *  @default [ 'asc', 'desc' ]
		 *
		 *  @name DataTable.defaults.column.orderSequence
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderSequence": [ "asc" ], "targets": [ 1 ] },
		 *          { "orderSequence": [ "desc", "asc", "asc" ], "targets": [ 2 ] },
		 *          { "orderSequence": [ "desc" ], "targets": [ 3 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          { "orderSequence": [ "asc" ] },
		 *          { "orderSequence": [ "desc", "asc", "asc" ] },
		 *          { "orderSequence": [ "desc" ] },
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"asSorting": [ 'asc', 'desc' ],
	
	
		/**
		 * Enable or disable filtering on the data in this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.searchable
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "searchable": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "searchable": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bSearchable": true,
	
	
		/**
		 * Enable or disable ordering on this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.orderable
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderable": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "orderable": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bSortable": true,
	
	
		/**
		 * Enable or disable the display of this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.visible
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "visible": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "visible": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bVisible": true,
	
	
		/**
		 * Developer definable function that is called whenever a cell is created (Ajax source,
		 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
		 * allowing you to modify the DOM element (add background colour for example) when the
		 * element is available.
		 *  @type function
		 *  @param {element} td The TD node that has been created
		 *  @param {*} cellData The Data for the cell
		 *  @param {array|object} rowData The data for the whole row
		 *  @param {int} row The row index for the aoData data store
		 *  @param {int} col The column index for aoColumns
		 *
		 *  @name DataTable.defaults.column.createdCell
		 *  @dtopt Columns
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [3],
		 *          "createdCell": function (td, cellData, rowData, row, col) {
		 *            if ( cellData == "1.7" ) {
		 *              $(td).css('color', 'blue')
		 *            }
		 *          }
		 *        } ]
		 *      });
		 *    } );
		 */
		"fnCreatedCell": null,
	
	
		/**
		 * This parameter has been replaced by `data` in DataTables to ensure naming
		 * consistency. `dataProp` can still be used, as there is backwards
		 * compatibility in DataTables for this option, but it is strongly
		 * recommended that you use `data` in preference to `dataProp`.
		 *  @name DataTable.defaults.column.dataProp
		 */
	
	
		/**
		 * This property can be used to read data from any data source property,
		 * including deeply nested objects / properties. `data` can be given in a
		 * number of different ways which effect its behaviour:
		 *
		 * * `integer` - treated as an array index for the data source. This is the
		 *   default that DataTables uses (incrementally increased for each column).
		 * * `string` - read an object property from the data source. There are
		 *   three 'special' options that can be used in the string to alter how
		 *   DataTables reads the data from the source object:
		 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
		 *      Javascript to read from nested objects, so to can the options
		 *      specified in `data`. For example: `browser.version` or
		 *      `browser.name`. If your object parameter name contains a period, use
		 *      `\\` to escape it - i.e. `first\\.name`.
		 *    * `[]` - Array notation. DataTables can automatically combine data
		 *      from and array source, joining the data with the characters provided
		 *      between the two brackets. For example: `name[, ]` would provide a
		 *      comma-space separated list from the source array. If no characters
		 *      are provided between the brackets, the original array source is
		 *      returned.
		 *    * `()` - Function notation. Adding `()` to the end of a parameter will
		 *      execute a function of the name given. For example: `browser()` for a
		 *      simple function on the data source, `browser.version()` for a
		 *      function in a nested property or even `browser().version` to get an
		 *      object property if the function called returns an object. Note that
		 *      function notation is recommended for use in `render` rather than
		 *      `data` as it is much simpler to use as a renderer.
		 * * `null` - use the original data source for the row rather than plucking
		 *   data directly from it. This action has effects on two other
		 *   initialisation options:
		 *    * `defaultContent` - When null is given as the `data` option and
		 *      `defaultContent` is specified for the column, the value defined by
		 *      `defaultContent` will be used for the cell.
		 *    * `render` - When null is used for the `data` option and the `render`
		 *      option is specified for the column, the whole data source for the
		 *      row is used for the renderer.
		 * * `function` - the function given will be executed whenever DataTables
		 *   needs to set or get the data for a cell in the column. The function
		 *   takes three parameters:
		 *    * Parameters:
		 *      * `{array|object}` The data source for the row
		 *      * `{string}` The type call data requested - this will be 'set' when
		 *        setting data or 'filter', 'display', 'type', 'sort' or undefined
		 *        when gathering data. Note that when `undefined` is given for the
		 *        type DataTables expects to get the raw data for the object back<
		 *      * `{*}` Data to set when the second parameter is 'set'.
		 *    * Return:
		 *      * The return value from the function is not required when 'set' is
		 *        the type of call, but otherwise the return is what will be used
		 *        for the data requested.
		 *
		 * Note that `data` is a getter and setter option. If you just require
		 * formatting of data for output, you will likely want to use `render` which
		 * is simply a getter and thus simpler to use.
		 *
		 * Note that prior to DataTables 1.9.2 `data` was called `mDataProp`. The
		 * name change reflects the flexibility of this property and is consistent
		 * with the naming of mRender. If 'mDataProp' is given, then it will still
		 * be used by DataTables, as it automatically maps the old name to the new
		 * if required.
		 *
		 *  @type string|int|function|null
		 *  @default null <i>Use automatically calculated column index</i>
		 *
		 *  @name DataTable.defaults.column.data
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Read table data from objects
		 *    // JSON structure for each row:
		 *    //   {
		 *    //      "engine": {value},
		 *    //      "browser": {value},
		 *    //      "platform": {value},
		 *    //      "version": {value},
		 *    //      "grade": {value}
		 *    //   }
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/objects.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          { "data": "platform" },
		 *          { "data": "version" },
		 *          { "data": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Read information from deeply nested objects
		 *    // JSON structure for each row:
		 *    //   {
		 *    //      "engine": {value},
		 *    //      "browser": {value},
		 *    //      "platform": {
		 *    //         "inner": {value}
		 *    //      },
		 *    //      "details": [
		 *    //         {value}, {value}
		 *    //      ]
		 *    //   }
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/deep.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          { "data": "platform.inner" },
		 *          { "data": "details.0" },
		 *          { "data": "details.1" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `data` as a function to provide different information for
		 *    // sorting, filtering and display. In this case, currency (price)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": function ( source, type, val ) {
		 *            if (type === 'set') {
		 *              source.price = val;
		 *              // Store the computed dislay and filter values for efficiency
		 *              source.price_display = val=="" ? "" : "$"+numberFormat(val);
		 *              source.price_filter  = val=="" ? "" : "$"+numberFormat(val)+" "+val;
		 *              return;
		 *            }
		 *            else if (type === 'display') {
		 *              return source.price_display;
		 *            }
		 *            else if (type === 'filter') {
		 *              return source.price_filter;
		 *            }
		 *            // 'sort', 'type' and undefined all just use the integer
		 *            return source.price;
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using default content
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null,
		 *          "defaultContent": "Click to edit"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using array notation - outputting a list from an array
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": "name[, ]"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 */
		"mData": null,
	
	
		/**
		 * This property is the rendering partner to `data` and it is suggested that
		 * when you want to manipulate data for display (including filtering,
		 * sorting etc) without altering the underlying data for the table, use this
		 * property. `render` can be considered to be the the read only companion to
		 * `data` which is read / write (then as such more complex). Like `data`
		 * this option can be given in a number of different ways to effect its
		 * behaviour:
		 *
		 * * `integer` - treated as an array index for the data source. This is the
		 *   default that DataTables uses (incrementally increased for each column).
		 * * `string` - read an object property from the data source. There are
		 *   three 'special' options that can be used in the string to alter how
		 *   DataTables reads the data from the source object:
		 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
		 *      Javascript to read from nested objects, so to can the options
		 *      specified in `data`. For example: `browser.version` or
		 *      `browser.name`. If your object parameter name contains a period, use
		 *      `\\` to escape it - i.e. `first\\.name`.
		 *    * `[]` - Array notation. DataTables can automatically combine data
		 *      from and array source, joining the data with the characters provided
		 *      between the two brackets. For example: `name[, ]` would provide a
		 *      comma-space separated list from the source array. If no characters
		 *      are provided between the brackets, the original array source is
		 *      returned.
		 *    * `()` - Function notation. Adding `()` to the end of a parameter will
		 *      execute a function of the name given. For example: `browser()` for a
		 *      simple function on the data source, `browser.version()` for a
		 *      function in a nested property or even `browser().version` to get an
		 *      object property if the function called returns an object.
		 * * `object` - use different data for the different data types requested by
		 *   DataTables ('filter', 'display', 'type' or 'sort'). The property names
		 *   of the object is the data type the property refers to and the value can
		 *   defined using an integer, string or function using the same rules as
		 *   `render` normally does. Note that an `_` option _must_ be specified.
		 *   This is the default value to use if you haven't specified a value for
		 *   the data type requested by DataTables.
		 * * `function` - the function given will be executed whenever DataTables
		 *   needs to set or get the data for a cell in the column. The function
		 *   takes three parameters:
		 *    * Parameters:
		 *      * {array|object} The data source for the row (based on `data`)
		 *      * {string} The type call data requested - this will be 'filter',
		 *        'display', 'type' or 'sort'.
		 *      * {array|object} The full data source for the row (not based on
		 *        `data`)
		 *    * Return:
		 *      * The return value from the function is what will be used for the
		 *        data requested.
		 *
		 *  @type string|int|function|object|null
		 *  @default null Use the data source value.
		 *
		 *  @name DataTable.defaults.column.render
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Create a comma separated list from an array of objects
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/deep.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          {
		 *            "data": "platform",
		 *            "render": "[, ].name"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Execute a function to obtain data
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null, // Use the full data source object for the renderer's source
		 *          "render": "browserName()"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // As an object, extracting different data for the different types
		 *    // This would be used with a data source such as:
		 *    //   { "phone": 5552368, "phone_filter": "5552368 555-2368", "phone_display": "555-2368" }
		 *    // Here the `phone` integer is used for sorting and type detection, while `phone_filter`
		 *    // (which has both forms) is used for filtering for if a user inputs either format, while
		 *    // the formatted phone number is the one that is shown in the table.
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null, // Use the full data source object for the renderer's source
		 *          "render": {
		 *            "_": "phone",
		 *            "filter": "phone_filter",
		 *            "display": "phone_display"
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Use as a function to create a link from the data source
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": "download_link",
		 *          "render": function ( data, type, full ) {
		 *            return '<a href="'+data+'">Download</a>';
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 */
		"mRender": null,
	
	
		/**
		 * Change the cell type created for the column - either TD cells or TH cells. This
		 * can be useful as TH cells have semantic meaning in the table body, allowing them
		 * to act as a header for a row (you may wish to add scope='row' to the TH elements).
		 *  @type string
		 *  @default td
		 *
		 *  @name DataTable.defaults.column.cellType
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Make the first column use TH cells
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "cellType": "th"
		 *        } ]
		 *      } );
		 *    } );
		 */
		"sCellType": "td",
	
	
		/**
		 * Class to give to each cell in this column.
		 *  @type string
		 *  @default <i>Empty string</i>
		 *
		 *  @name DataTable.defaults.column.class
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "class": "my_class", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "class": "my_class" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sClass": "",
	
		/**
		 * When DataTables calculates the column widths to assign to each column,
		 * it finds the longest string in each column and then constructs a
		 * temporary table and reads the widths from that. The problem with this
		 * is that "mmm" is much wider then "iiii", but the latter is a longer
		 * string - thus the calculation can go wrong (doing it properly and putting
		 * it into an DOM object and measuring that is horribly(!) slow). Thus as
		 * a "work around" we provide this option. It will append its value to the
		 * text that is found to be the longest string for the column - i.e. padding.
		 * Generally you shouldn't need this!
		 *  @type string
		 *  @default <i>Empty string<i>
		 *
		 *  @name DataTable.defaults.column.contentPadding
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          null,
		 *          {
		 *            "contentPadding": "mmm"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sContentPadding": "",
	
	
		/**
		 * Allows a default value to be given for a column's data, and will be used
		 * whenever a null data source is encountered (this can be because `data`
		 * is set to null, or because the data source itself is null).
		 *  @type string
		 *  @default null
		 *
		 *  @name DataTable.defaults.column.defaultContent
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          {
		 *            "data": null,
		 *            "defaultContent": "Edit",
		 *            "targets": [ -1 ]
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          null,
		 *          {
		 *            "data": null,
		 *            "defaultContent": "Edit"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sDefaultContent": null,
	
	
		/**
		 * This parameter is only used in DataTables' server-side processing. It can
		 * be exceptionally useful to know what columns are being displayed on the
		 * client side, and to map these to database fields. When defined, the names
		 * also allow DataTables to reorder information from the server if it comes
		 * back in an unexpected order (i.e. if you switch your columns around on the
		 * client-side, your server-side code does not also need updating).
		 *  @type string
		 *  @default <i>Empty string</i>
		 *
		 *  @name DataTable.defaults.column.name
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "name": "engine", "targets": [ 0 ] },
		 *          { "name": "browser", "targets": [ 1 ] },
		 *          { "name": "platform", "targets": [ 2 ] },
		 *          { "name": "version", "targets": [ 3 ] },
		 *          { "name": "grade", "targets": [ 4 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "name": "engine" },
		 *          { "name": "browser" },
		 *          { "name": "platform" },
		 *          { "name": "version" },
		 *          { "name": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sName": "",
	
	
		/**
		 * Defines a data source type for the ordering which can be used to read
		 * real-time information from the table (updating the internally cached
		 * version) prior to ordering. This allows ordering to occur on user
		 * editable elements such as form inputs.
		 *  @type string
		 *  @default std
		 *
		 *  @name DataTable.defaults.column.orderDataType
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderDataType": "dom-text", "targets": [ 2, 3 ] },
		 *          { "type": "numeric", "targets": [ 3 ] },
		 *          { "orderDataType": "dom-select", "targets": [ 4 ] },
		 *          { "orderDataType": "dom-checkbox", "targets": [ 5 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          { "orderDataType": "dom-text" },
		 *          { "orderDataType": "dom-text", "type": "numeric" },
		 *          { "orderDataType": "dom-select" },
		 *          { "orderDataType": "dom-checkbox" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sSortDataType": "std",
	
	
		/**
		 * The title of this column.
		 *  @type string
		 *  @default null <i>Derived from the 'TH' value for this column in the
		 *    original HTML table.</i>
		 *
		 *  @name DataTable.defaults.column.title
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "title": "My column title", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "title": "My column title" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sTitle": null,
	
	
		/**
		 * The type allows you to specify how the data for this column will be
		 * ordered. Four types (string, numeric, date and html (which will strip
		 * HTML tags before ordering)) are currently available. Note that only date
		 * formats understood by Javascript's Date() object will be accepted as type
		 * date. For example: "Mar 26, 2008 5:03 PM". May take the values: 'string',
		 * 'numeric', 'date' or 'html' (by default). Further types can be adding
		 * through plug-ins.
		 *  @type string
		 *  @default null <i>Auto-detected from raw data</i>
		 *
		 *  @name DataTable.defaults.column.type
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "type": "html", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "type": "html" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sType": null,
	
	
		/**
		 * Defining the width of the column, this parameter may take any CSS value
		 * (3em, 20px etc). DataTables applies 'smart' widths to columns which have not
		 * been given a specific width through this interface ensuring that the table
		 * remains readable.
		 *  @type string
		 *  @default null <i>Automatic</i>
		 *
		 *  @name DataTable.defaults.column.width
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "width": "20%", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "width": "20%" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sWidth": null
	};
	
	_fnHungarianMap( DataTable.defaults.column );
	
	
	
	/**
	 * DataTables settings object - this holds all the information needed for a
	 * given table, including configuration, data and current application of the
	 * table options. DataTables does not have a single instance for each DataTable
	 * with the settings attached to that instance, but rather instances of the
	 * DataTable "class" are created on-the-fly as needed (typically by a
	 * $().dataTable() call) and the settings object is then applied to that
	 * instance.
	 *
	 * Note that this object is related to {@link DataTable.defaults} but this
	 * one is the internal data store for DataTables's cache of columns. It should
	 * NOT be manipulated outside of DataTables. Any configuration should be done
	 * through the initialisation options.
	 *  @namespace
	 *  @todo Really should attach the settings object to individual instances so we
	 *    don't need to create new instances on each $().dataTable() call (if the
	 *    table already exists). It would also save passing oSettings around and
	 *    into every single function. However, this is a very significant
	 *    architecture change for DataTables and will almost certainly break
	 *    backwards compatibility with older installations. This is something that
	 *    will be done in 2.0.
	 */
	DataTable.models.oSettings = {
		/**
		 * Primary features of DataTables and their enablement state.
		 *  @namespace
		 */
		"oFeatures": {
	
			/**
			 * Flag to say if DataTables should automatically try to calculate the
			 * optimum table and columns widths (true) or not (false).
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bAutoWidth": null,
	
			/**
			 * Delay the creation of TR and TD elements until they are actually
			 * needed by a driven page draw. This can give a significant speed
			 * increase for Ajax source and Javascript source data, but makes no
			 * difference at all fro DOM and server-side processing tables.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bDeferRender": null,
	
			/**
			 * Enable filtering on the table or not. Note that if this is disabled
			 * then there is no filtering at all on the table, including fnFilter.
			 * To just remove the filtering input use sDom and remove the 'f' option.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bFilter": null,
	
			/**
			 * Table information element (the 'Showing x of y records' div) enable
			 * flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bInfo": null,
	
			/**
			 * Present a user control allowing the end user to change the page size
			 * when pagination is enabled.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bLengthChange": null,
	
			/**
			 * Pagination enabled or not. Note that if this is disabled then length
			 * changing must also be disabled.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bPaginate": null,
	
			/**
			 * Processing indicator enable flag whenever DataTables is enacting a
			 * user request - typically an Ajax request for server-side processing.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bProcessing": null,
	
			/**
			 * Server-side processing enabled flag - when enabled DataTables will
			 * get all data from the server for every draw - there is no filtering,
			 * sorting or paging done on the client-side.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bServerSide": null,
	
			/**
			 * Sorting enablement flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSort": null,
	
			/**
			 * Multi-column sorting
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSortMulti": null,
	
			/**
			 * Apply a class to the columns which are being sorted to provide a
			 * visual highlight or not. This can slow things down when enabled since
			 * there is a lot of DOM interaction.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSortClasses": null,
	
			/**
			 * State saving enablement flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bStateSave": null
		},
	
	
		/**
		 * Scrolling settings for a table.
		 *  @namespace
		 */
		"oScroll": {
			/**
			 * When the table is shorter in height than sScrollY, collapse the
			 * table container down to the height of the table (when true).
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bCollapse": null,
	
			/**
			 * Width of the scrollbar for the web-browser's platform. Calculated
			 * during table initialisation.
			 *  @type int
			 *  @default 0
			 */
			"iBarWidth": 0,
	
			/**
			 * Viewport width for horizontal scrolling. Horizontal scrolling is
			 * disabled if an empty string.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 */
			"sX": null,
	
			/**
			 * Width to expand the table to when using x-scrolling. Typically you
			 * should not need to use this.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 *  @deprecated
			 */
			"sXInner": null,
	
			/**
			 * Viewport height for vertical scrolling. Vertical scrolling is disabled
			 * if an empty string.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 */
			"sY": null
		},
	
		/**
		 * Language information for the table.
		 *  @namespace
		 *  @extends DataTable.defaults.oLanguage
		 */
		"oLanguage": {
			/**
			 * Information callback function. See
			 * {@link DataTable.defaults.fnInfoCallback}
			 *  @type function
			 *  @default null
			 */
			"fnInfoCallback": null
		},
	
		/**
		 * Browser support parameters
		 *  @namespace
		 */
		"oBrowser": {
			/**
			 * Indicate if the browser incorrectly calculates width:100% inside a
			 * scrolling element (IE6/7)
			 *  @type boolean
			 *  @default false
			 */
			"bScrollOversize": false,
	
			/**
			 * Determine if the vertical scrollbar is on the right or left of the
			 * scrolling container - needed for rtl language layout, although not
			 * all browsers move the scrollbar (Safari).
			 *  @type boolean
			 *  @default false
			 */
			"bScrollbarLeft": false,
	
			/**
			 * Flag for if `getBoundingClientRect` is fully supported or not
			 *  @type boolean
			 *  @default false
			 */
			"bBounding": false,
	
			/**
			 * Browser scrollbar width
			 *  @type integer
			 *  @default 0
			 */
			"barWidth": 0
		},
	
	
		"ajax": null,
	
	
		/**
		 * Array referencing the nodes which are used for the features. The
		 * parameters of this object match what is allowed by sDom - i.e.
		 *   <ul>
		 *     <li>'l' - Length changing</li>
		 *     <li>'f' - Filtering input</li>
		 *     <li>'t' - The table!</li>
		 *     <li>'i' - Information</li>
		 *     <li>'p' - Pagination</li>
		 *     <li>'r' - pRocessing</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aanFeatures": [],
	
		/**
		 * Store data information - see {@link DataTable.models.oRow} for detailed
		 * information.
		 *  @type array
		 *  @default []
		 */
		"aoData": [],
	
		/**
		 * Array of indexes which are in the current display (after filtering etc)
		 *  @type array
		 *  @default []
		 */
		"aiDisplay": [],
	
		/**
		 * Array of indexes for display - no filtering
		 *  @type array
		 *  @default []
		 */
		"aiDisplayMaster": [],
	
		/**
		 * Map of row ids to data indexes
		 *  @type object
		 *  @default {}
		 */
		"aIds": {},
	
		/**
		 * Store information about each column that is in use
		 *  @type array
		 *  @default []
		 */
		"aoColumns": [],
	
		/**
		 * Store information about the table's header
		 *  @type array
		 *  @default []
		 */
		"aoHeader": [],
	
		/**
		 * Store information about the table's footer
		 *  @type array
		 *  @default []
		 */
		"aoFooter": [],
	
		/**
		 * Store the applied global search information in case we want to force a
		 * research or compare the old search to a new one.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @namespace
		 *  @extends DataTable.models.oSearch
		 */
		"oPreviousSearch": {},
	
		/**
		 * Store the applied search for each column - see
		 * {@link DataTable.models.oSearch} for the format that is used for the
		 * filtering information for each column.
		 *  @type array
		 *  @default []
		 */
		"aoPreSearchCols": [],
	
		/**
		 * Sorting that is applied to the table. Note that the inner arrays are
		 * used in the following manner:
		 * <ul>
		 *   <li>Index 0 - column number</li>
		 *   <li>Index 1 - current sorting direction</li>
		 * </ul>
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @todo These inner arrays should really be objects
		 */
		"aaSorting": null,
	
		/**
		 * Sorting that is always applied to the table (i.e. prefixed in front of
		 * aaSorting).
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"aaSortingFixed": [],
	
		/**
		 * Classes to use for the striping of a table.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"asStripeClasses": null,
	
		/**
		 * If restoring a table - we should restore its striping classes as well
		 *  @type array
		 *  @default []
		 */
		"asDestroyStripes": [],
	
		/**
		 * If restoring a table - we should restore its width
		 *  @type int
		 *  @default 0
		 */
		"sDestroyWidth": 0,
	
		/**
		 * Callback functions array for every time a row is inserted (i.e. on a draw).
		 *  @type array
		 *  @default []
		 */
		"aoRowCallback": [],
	
		/**
		 * Callback functions for the header on each draw.
		 *  @type array
		 *  @default []
		 */
		"aoHeaderCallback": [],
	
		/**
		 * Callback function for the footer on each draw.
		 *  @type array
		 *  @default []
		 */
		"aoFooterCallback": [],
	
		/**
		 * Array of callback functions for draw callback functions
		 *  @type array
		 *  @default []
		 */
		"aoDrawCallback": [],
	
		/**
		 * Array of callback functions for row created function
		 *  @type array
		 *  @default []
		 */
		"aoRowCreatedCallback": [],
	
		/**
		 * Callback functions for just before the table is redrawn. A return of
		 * false will be used to cancel the draw.
		 *  @type array
		 *  @default []
		 */
		"aoPreDrawCallback": [],
	
		/**
		 * Callback functions for when the table has been initialised.
		 *  @type array
		 *  @default []
		 */
		"aoInitComplete": [],
	
	
		/**
		 * Callbacks for modifying the settings to be stored for state saving, prior to
		 * saving state.
		 *  @type array
		 *  @default []
		 */
		"aoStateSaveParams": [],
	
		/**
		 * Callbacks for modifying the settings that have been stored for state saving
		 * prior to using the stored values to restore the state.
		 *  @type array
		 *  @default []
		 */
		"aoStateLoadParams": [],
	
		/**
		 * Callbacks for operating on the settings object once the saved state has been
		 * loaded
		 *  @type array
		 *  @default []
		 */
		"aoStateLoaded": [],
	
		/**
		 * Cache the table ID for quick access
		 *  @type string
		 *  @default <i>Empty string</i>
		 */
		"sTableId": "",
	
		/**
		 * The TABLE node for the main table
		 *  @type node
		 *  @default null
		 */
		"nTable": null,
	
		/**
		 * Permanent ref to the thead element
		 *  @type node
		 *  @default null
		 */
		"nTHead": null,
	
		/**
		 * Permanent ref to the tfoot element - if it exists
		 *  @type node
		 *  @default null
		 */
		"nTFoot": null,
	
		/**
		 * Permanent ref to the tbody element
		 *  @type node
		 *  @default null
		 */
		"nTBody": null,
	
		/**
		 * Cache the wrapper node (contains all DataTables controlled elements)
		 *  @type node
		 *  @default null
		 */
		"nTableWrapper": null,
	
		/**
		 * Indicate if when using server-side processing the loading of data
		 * should be deferred until the second draw.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 *  @default false
		 */
		"bDeferLoading": false,
	
		/**
		 * Indicate if all required information has been read in
		 *  @type boolean
		 *  @default false
		 */
		"bInitialised": false,
	
		/**
		 * Information about open rows. Each object in the array has the parameters
		 * 'nTr' and 'nParent'
		 *  @type array
		 *  @default []
		 */
		"aoOpenRows": [],
	
		/**
		 * Dictate the positioning of DataTables' control elements - see
		 * {@link DataTable.model.oInit.sDom}.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default null
		 */
		"sDom": null,
	
		/**
		 * Search delay (in mS)
		 *  @type integer
		 *  @default null
		 */
		"searchDelay": null,
	
		/**
		 * Which type of pagination should be used.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default two_button
		 */
		"sPaginationType": "two_button",
	
		/**
		 * The state duration (for `stateSave`) in seconds.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type int
		 *  @default 0
		 */
		"iStateDuration": 0,
	
		/**
		 * Array of callback functions for state saving. Each array element is an
		 * object with the following parameters:
		 *   <ul>
		 *     <li>function:fn - function to call. Takes two parameters, oSettings
		 *       and the JSON string to save that has been thus far created. Returns
		 *       a JSON string to be inserted into a json object
		 *       (i.e. '"param": [ 0, 1, 2]')</li>
		 *     <li>string:sName - name of callback</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aoStateSave": [],
	
		/**
		 * Array of callback functions for state loading. Each array element is an
		 * object with the following parameters:
		 *   <ul>
		 *     <li>function:fn - function to call. Takes two parameters, oSettings
		 *       and the object stored. May return false to cancel state loading</li>
		 *     <li>string:sName - name of callback</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aoStateLoad": [],
	
		/**
		 * State that was saved. Useful for back reference
		 *  @type object
		 *  @default null
		 */
		"oSavedState": null,
	
		/**
		 * State that was loaded. Useful for back reference
		 *  @type object
		 *  @default null
		 */
		"oLoadedState": null,
	
		/**
		 * Source url for AJAX data for the table.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default null
		 */
		"sAjaxSource": null,
	
		/**
		 * Property from a given object from which to read the table data from. This
		 * can be an empty string (when not server-side processing), in which case
		 * it is  assumed an an array is given directly.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 */
		"sAjaxDataProp": null,
	
		/**
		 * Note if draw should be blocked while getting data
		 *  @type boolean
		 *  @default true
		 */
		"bAjaxDataGet": true,
	
		/**
		 * The last jQuery XHR object that was used for server-side data gathering.
		 * This can be used for working with the XHR information in one of the
		 * callbacks
		 *  @type object
		 *  @default null
		 */
		"jqXHR": null,
	
		/**
		 * JSON returned from the server in the last Ajax request
		 *  @type object
		 *  @default undefined
		 */
		"json": undefined,
	
		/**
		 * Data submitted as part of the last Ajax request
		 *  @type object
		 *  @default undefined
		 */
		"oAjaxData": undefined,
	
		/**
		 * Function to get the server-side data.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type function
		 */
		"fnServerData": null,
	
		/**
		 * Functions which are called prior to sending an Ajax request so extra
		 * parameters can easily be sent to the server
		 *  @type array
		 *  @default []
		 */
		"aoServerParams": [],
	
		/**
		 * Send the XHR HTTP method - GET or POST (could be PUT or DELETE if
		 * required).
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 */
		"sServerMethod": null,
	
		/**
		 * Format numbers for display.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type function
		 */
		"fnFormatNumber": null,
	
		/**
		 * List of options that can be used for the user selectable length menu.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"aLengthMenu": null,
	
		/**
		 * Counter for the draws that the table does. Also used as a tracker for
		 * server-side processing
		 *  @type int
		 *  @default 0
		 */
		"iDraw": 0,
	
		/**
		 * Indicate if a redraw is being done - useful for Ajax
		 *  @type boolean
		 *  @default false
		 */
		"bDrawing": false,
	
		/**
		 * Draw index (iDraw) of the last error when parsing the returned data
		 *  @type int
		 *  @default -1
		 */
		"iDrawError": -1,
	
		/**
		 * Paging display length
		 *  @type int
		 *  @default 10
		 */
		"_iDisplayLength": 10,
	
		/**
		 * Paging start point - aiDisplay index
		 *  @type int
		 *  @default 0
		 */
		"_iDisplayStart": 0,
	
		/**
		 * Server-side processing - number of records in the result set
		 * (i.e. before filtering), Use fnRecordsTotal rather than
		 * this property to get the value of the number of records, regardless of
		 * the server-side processing setting.
		 *  @type int
		 *  @default 0
		 *  @private
		 */
		"_iRecordsTotal": 0,
	
		/**
		 * Server-side processing - number of records in the current display set
		 * (i.e. after filtering). Use fnRecordsDisplay rather than
		 * this property to get the value of the number of records, regardless of
		 * the server-side processing setting.
		 *  @type boolean
		 *  @default 0
		 *  @private
		 */
		"_iRecordsDisplay": 0,
	
		/**
		 * The classes to use for the table
		 *  @type object
		 *  @default {}
		 */
		"oClasses": {},
	
		/**
		 * Flag attached to the settings object so you can check in the draw
		 * callback if filtering has been done in the draw. Deprecated in favour of
		 * events.
		 *  @type boolean
		 *  @default false
		 *  @deprecated
		 */
		"bFiltered": false,
	
		/**
		 * Flag attached to the settings object so you can check in the draw
		 * callback if sorting has been done in the draw. Deprecated in favour of
		 * events.
		 *  @type boolean
		 *  @default false
		 *  @deprecated
		 */
		"bSorted": false,
	
		/**
		 * Indicate that if multiple rows are in the header and there is more than
		 * one unique cell per column, if the top one (true) or bottom one (false)
		 * should be used for sorting / title by DataTables.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 */
		"bSortCellsTop": null,
	
		/**
		 * Initialisation object that is used for the table
		 *  @type object
		 *  @default null
		 */
		"oInit": null,
	
		/**
		 * Destroy callback functions - for plug-ins to attach themselves to the
		 * destroy so they can clean up markup and events.
		 *  @type array
		 *  @default []
		 */
		"aoDestroyCallback": [],
	
	
		/**
		 * Get the number of records in the current record set, before filtering
		 *  @type function
		 */
		"fnRecordsTotal": function ()
		{
			return _fnDataSource( this ) == 'ssp' ?
				this._iRecordsTotal * 1 :
				this.aiDisplayMaster.length;
		},
	
		/**
		 * Get the number of records in the current record set, after filtering
		 *  @type function
		 */
		"fnRecordsDisplay": function ()
		{
			return _fnDataSource( this ) == 'ssp' ?
				this._iRecordsDisplay * 1 :
				this.aiDisplay.length;
		},
	
		/**
		 * Get the display end point - aiDisplay index
		 *  @type function
		 */
		"fnDisplayEnd": function ()
		{
			var
				len      = this._iDisplayLength,
				start    = this._iDisplayStart,
				calc     = start + len,
				records  = this.aiDisplay.length,
				features = this.oFeatures,
				paginate = features.bPaginate;
	
			if ( features.bServerSide ) {
				return paginate === false || len === -1 ?
					start + records :
					Math.min( start+len, this._iRecordsDisplay );
			}
			else {
				return ! paginate || calc>records || len===-1 ?
					records :
					calc;
			}
		},
	
		/**
		 * The DataTables object for this table
		 *  @type object
		 *  @default null
		 */
		"oInstance": null,
	
		/**
		 * Unique identifier for each instance of the DataTables object. If there
		 * is an ID on the table node, then it takes that value, otherwise an
		 * incrementing internal counter is used.
		 *  @type string
		 *  @default null
		 */
		"sInstance": null,
	
		/**
		 * tabindex attribute value that is added to DataTables control elements, allowing
		 * keyboard navigation of the table and its controls.
		 */
		"iTabIndex": 0,
	
		/**
		 * DIV container for the footer scrolling table if scrolling
		 */
		"nScrollHead": null,
	
		/**
		 * DIV container for the footer scrolling table if scrolling
		 */
		"nScrollFoot": null,
	
		/**
		 * Last applied sort
		 *  @type array
		 *  @default []
		 */
		"aLastSort": [],
	
		/**
		 * Stored plug-in instances
		 *  @type object
		 *  @default {}
		 */
		"oPlugins": {},
	
		/**
		 * Function used to get a row's id from the row's data
		 *  @type function
		 *  @default null
		 */
		"rowIdFn": null,
	
		/**
		 * Data location where to store a row's id
		 *  @type string
		 *  @default null
		 */
		"rowId": null
	};

	/**
	 * Extension object for DataTables that is used to provide all extension
	 * options.
	 *
	 * Note that the `DataTable.ext` object is available through
	 * `jQuery.fn.dataTable.ext` where it may be accessed and manipulated. It is
	 * also aliased to `jQuery.fn.dataTableExt` for historic reasons.
	 *  @namespace
	 *  @extends DataTable.models.ext
	 */
	
	
	/**
	 * DataTables extensions
	 * 
	 * This namespace acts as a collection area for plug-ins that can be used to
	 * extend DataTables capabilities. Indeed many of the build in methods
	 * use this method to provide their own capabilities (sorting methods for
	 * example).
	 *
	 * Note that this namespace is aliased to `jQuery.fn.dataTableExt` for legacy
	 * reasons
	 *
	 *  @namespace
	 */
	DataTable.ext = _ext = {
		/**
		 * Buttons. For use with the Buttons extension for DataTables. This is
		 * defined here so other extensions can define buttons regardless of load
		 * order. It is _not_ used by DataTables core.
		 *
		 *  @type object
		 *  @default {}
		 */
		buttons: {},
	
	
		/**
		 * Element class names
		 *
		 *  @type object
		 *  @default {}
		 */
		classes: {},
	
	
		/**
		 * DataTables build type (expanded by the download builder)
		 *
		 *  @type string
		 */
		build:"dt/dt-1.10.22/e-1.9.6/b-1.6.5/sl-1.3.1",
	
	
		/**
		 * Error reporting.
		 * 
		 * How should DataTables report an error. Can take the value 'alert',
		 * 'throw', 'none' or a function.
		 *
		 *  @type string|function
		 *  @default alert
		 */
		errMode: "alert",
	
	
		/**
		 * Feature plug-ins.
		 * 
		 * This is an array of objects which describe the feature plug-ins that are
		 * available to DataTables. These feature plug-ins are then available for
		 * use through the `dom` initialisation option.
		 * 
		 * Each feature plug-in is described by an object which must have the
		 * following properties:
		 * 
		 * * `fnInit` - function that is used to initialise the plug-in,
		 * * `cFeature` - a character so the feature can be enabled by the `dom`
		 *   instillation option. This is case sensitive.
		 *
		 * The `fnInit` function has the following input parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 *
		 * And the following return is expected:
		 * 
		 * * {node|null} The element which contains your feature. Note that the
		 *   return may also be void if your plug-in does not require to inject any
		 *   DOM elements into DataTables control (`dom`) - for example this might
		 *   be useful when developing a plug-in which allows table control via
		 *   keyboard entry
		 *
		 *  @type array
		 *
		 *  @example
		 *    $.fn.dataTable.ext.features.push( {
		 *      "fnInit": function( oSettings ) {
		 *        return new TableTools( { "oDTSettings": oSettings } );
		 *      },
		 *      "cFeature": "T"
		 *    } );
		 */
		feature: [],
	
	
		/**
		 * Row searching.
		 * 
		 * This method of searching is complimentary to the default type based
		 * searching, and a lot more comprehensive as it allows you complete control
		 * over the searching logic. Each element in this array is a function
		 * (parameters described below) that is called for every row in the table,
		 * and your logic decides if it should be included in the searching data set
		 * or not.
		 *
		 * Searching functions have the following input parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 * 2. `{array|object}` Data for the row to be processed (same as the
		 *    original format that was passed in as the data source, or an array
		 *    from a DOM data source
		 * 3. `{int}` Row index ({@link DataTable.models.oSettings.aoData}), which
		 *    can be useful to retrieve the `TR` element if you need DOM interaction.
		 *
		 * And the following return is expected:
		 *
		 * * {boolean} Include the row in the searched result set (true) or not
		 *   (false)
		 *
		 * Note that as with the main search ability in DataTables, technically this
		 * is "filtering", since it is subtractive. However, for consistency in
		 * naming we call it searching here.
		 *
		 *  @type array
		 *  @default []
		 *
		 *  @example
		 *    // The following example shows custom search being applied to the
		 *    // fourth column (i.e. the data[3] index) based on two input values
		 *    // from the end-user, matching the data in a certain range.
		 *    $.fn.dataTable.ext.search.push(
		 *      function( settings, data, dataIndex ) {
		 *        var min = document.getElementById('min').value * 1;
		 *        var max = document.getElementById('max').value * 1;
		 *        var version = data[3] == "-" ? 0 : data[3]*1;
		 *
		 *        if ( min == "" && max == "" ) {
		 *          return true;
		 *        }
		 *        else if ( min == "" && version < max ) {
		 *          return true;
		 *        }
		 *        else if ( min < version && "" == max ) {
		 *          return true;
		 *        }
		 *        else if ( min < version && version < max ) {
		 *          return true;
		 *        }
		 *        return false;
		 *      }
		 *    );
		 */
		search: [],
	
	
		/**
		 * Selector extensions
		 *
		 * The `selector` option can be used to extend the options available for the
		 * selector modifier options (`selector-modifier` object data type) that
		 * each of the three built in selector types offer (row, column and cell +
		 * their plural counterparts). For example the Select extension uses this
		 * mechanism to provide an option to select only rows, columns and cells
		 * that have been marked as selected by the end user (`{selected: true}`),
		 * which can be used in conjunction with the existing built in selector
		 * options.
		 *
		 * Each property is an array to which functions can be pushed. The functions
		 * take three attributes:
		 *
		 * * Settings object for the host table
		 * * Options object (`selector-modifier` object type)
		 * * Array of selected item indexes
		 *
		 * The return is an array of the resulting item indexes after the custom
		 * selector has been applied.
		 *
		 *  @type object
		 */
		selector: {
			cell: [],
			column: [],
			row: []
		},
	
	
		/**
		 * Internal functions, exposed for used in plug-ins.
		 * 
		 * Please note that you should not need to use the internal methods for
		 * anything other than a plug-in (and even then, try to avoid if possible).
		 * The internal function may change between releases.
		 *
		 *  @type object
		 *  @default {}
		 */
		internal: {},
	
	
		/**
		 * Legacy configuration options. Enable and disable legacy options that
		 * are available in DataTables.
		 *
		 *  @type object
		 */
		legacy: {
			/**
			 * Enable / disable DataTables 1.9 compatible server-side processing
			 * requests
			 *
			 *  @type boolean
			 *  @default null
			 */
			ajax: null
		},
	
	
		/**
		 * Pagination plug-in methods.
		 * 
		 * Each entry in this object is a function and defines which buttons should
		 * be shown by the pagination rendering method that is used for the table:
		 * {@link DataTable.ext.renderer.pageButton}. The renderer addresses how the
		 * buttons are displayed in the document, while the functions here tell it
		 * what buttons to display. This is done by returning an array of button
		 * descriptions (what each button will do).
		 *
		 * Pagination types (the four built in options and any additional plug-in
		 * options defined here) can be used through the `paginationType`
		 * initialisation parameter.
		 *
		 * The functions defined take two parameters:
		 *
		 * 1. `{int} page` The current page index
		 * 2. `{int} pages` The number of pages in the table
		 *
		 * Each function is expected to return an array where each element of the
		 * array can be one of:
		 *
		 * * `first` - Jump to first page when activated
		 * * `last` - Jump to last page when activated
		 * * `previous` - Show previous page when activated
		 * * `next` - Show next page when activated
		 * * `{int}` - Show page of the index given
		 * * `{array}` - A nested array containing the above elements to add a
		 *   containing 'DIV' element (might be useful for styling).
		 *
		 * Note that DataTables v1.9- used this object slightly differently whereby
		 * an object with two functions would be defined for each plug-in. That
		 * ability is still supported by DataTables 1.10+ to provide backwards
		 * compatibility, but this option of use is now decremented and no longer
		 * documented in DataTables 1.10+.
		 *
		 *  @type object
		 *  @default {}
		 *
		 *  @example
		 *    // Show previous, next and current page buttons only
		 *    $.fn.dataTableExt.oPagination.current = function ( page, pages ) {
		 *      return [ 'previous', page, 'next' ];
		 *    };
		 */
		pager: {},
	
	
		renderer: {
			pageButton: {},
			header: {}
		},
	
	
		/**
		 * Ordering plug-ins - custom data source
		 * 
		 * The extension options for ordering of data available here is complimentary
		 * to the default type based ordering that DataTables typically uses. It
		 * allows much greater control over the the data that is being used to
		 * order a column, but is necessarily therefore more complex.
		 * 
		 * This type of ordering is useful if you want to do ordering based on data
		 * live from the DOM (for example the contents of an 'input' element) rather
		 * than just the static string that DataTables knows of.
		 * 
		 * The way these plug-ins work is that you create an array of the values you
		 * wish to be ordering for the column in question and then return that
		 * array. The data in the array much be in the index order of the rows in
		 * the table (not the currently ordering order!). Which order data gathering
		 * function is run here depends on the `dt-init columns.orderDataType`
		 * parameter that is used for the column (if any).
		 *
		 * The functions defined take two parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 * 2. `{int}` Target column index
		 *
		 * Each function is expected to return an array:
		 *
		 * * `{array}` Data for the column to be ordering upon
		 *
		 *  @type array
		 *
		 *  @example
		 *    // Ordering using `input` node values
		 *    $.fn.dataTable.ext.order['dom-text'] = function  ( settings, col )
		 *    {
		 *      return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
		 *        return $('input', td).val();
		 *      } );
		 *    }
		 */
		order: {},
	
	
		/**
		 * Type based plug-ins.
		 *
		 * Each column in DataTables has a type assigned to it, either by automatic
		 * detection or by direct assignment using the `type` option for the column.
		 * The type of a column will effect how it is ordering and search (plug-ins
		 * can also make use of the column type if required).
		 *
		 * @namespace
		 */
		type: {
			/**
			 * Type detection functions.
			 *
			 * The functions defined in this object are used to automatically detect
			 * a column's type, making initialisation of DataTables super easy, even
			 * when complex data is in the table.
			 *
			 * The functions defined take two parameters:
			 *
		     *  1. `{*}` Data from the column cell to be analysed
		     *  2. `{settings}` DataTables settings object. This can be used to
		     *     perform context specific type detection - for example detection
		     *     based on language settings such as using a comma for a decimal
		     *     place. Generally speaking the options from the settings will not
		     *     be required
			 *
			 * Each function is expected to return:
			 *
			 * * `{string|null}` Data type detected, or null if unknown (and thus
			 *   pass it on to the other type detection functions.
			 *
			 *  @type array
			 *
			 *  @example
			 *    // Currency type detection plug-in:
			 *    $.fn.dataTable.ext.type.detect.push(
			 *      function ( data, settings ) {
			 *        // Check the numeric part
			 *        if ( ! data.substring(1).match(/[0-9]/) ) {
			 *          return null;
			 *        }
			 *
			 *        // Check prefixed by currency
			 *        if ( data.charAt(0) == '$' || data.charAt(0) == '&pound;' ) {
			 *          return 'currency';
			 *        }
			 *        return null;
			 *      }
			 *    );
			 */
			detect: [],
	
	
			/**
			 * Type based search formatting.
			 *
			 * The type based searching functions can be used to pre-format the
			 * data to be search on. For example, it can be used to strip HTML
			 * tags or to de-format telephone numbers for numeric only searching.
			 *
			 * Note that is a search is not defined for a column of a given type,
			 * no search formatting will be performed.
			 * 
			 * Pre-processing of searching data plug-ins - When you assign the sType
			 * for a column (or have it automatically detected for you by DataTables
			 * or a type detection plug-in), you will typically be using this for
			 * custom sorting, but it can also be used to provide custom searching
			 * by allowing you to pre-processing the data and returning the data in
			 * the format that should be searched upon. This is done by adding
			 * functions this object with a parameter name which matches the sType
			 * for that target column. This is the corollary of <i>afnSortData</i>
			 * for searching data.
			 *
			 * The functions defined take a single parameter:
			 *
		     *  1. `{*}` Data from the column cell to be prepared for searching
			 *
			 * Each function is expected to return:
			 *
			 * * `{string|null}` Formatted string that will be used for the searching.
			 *
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    $.fn.dataTable.ext.type.search['title-numeric'] = function ( d ) {
			 *      return d.replace(/\n/g," ").replace( /<.*?>/g, "" );
			 *    }
			 */
			search: {},
	
	
			/**
			 * Type based ordering.
			 *
			 * The column type tells DataTables what ordering to apply to the table
			 * when a column is sorted upon. The order for each type that is defined,
			 * is defined by the functions available in this object.
			 *
			 * Each ordering option can be described by three properties added to
			 * this object:
			 *
			 * * `{type}-pre` - Pre-formatting function
			 * * `{type}-asc` - Ascending order function
			 * * `{type}-desc` - Descending order function
			 *
			 * All three can be used together, only `{type}-pre` or only
			 * `{type}-asc` and `{type}-desc` together. It is generally recommended
			 * that only `{type}-pre` is used, as this provides the optimal
			 * implementation in terms of speed, although the others are provided
			 * for compatibility with existing Javascript sort functions.
			 *
			 * `{type}-pre`: Functions defined take a single parameter:
			 *
		     *  1. `{*}` Data from the column cell to be prepared for ordering
			 *
			 * And return:
			 *
			 * * `{*}` Data to be sorted upon
			 *
			 * `{type}-asc` and `{type}-desc`: Functions are typical Javascript sort
			 * functions, taking two parameters:
			 *
		     *  1. `{*}` Data to compare to the second parameter
		     *  2. `{*}` Data to compare to the first parameter
			 *
			 * And returning:
			 *
			 * * `{*}` Ordering match: <0 if first parameter should be sorted lower
			 *   than the second parameter, ===0 if the two parameters are equal and
			 *   >0 if the first parameter should be sorted height than the second
			 *   parameter.
			 * 
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    // Numeric ordering of formatted numbers with a pre-formatter
			 *    $.extend( $.fn.dataTable.ext.type.order, {
			 *      "string-pre": function(x) {
			 *        a = (a === "-" || a === "") ? 0 : a.replace( /[^\d\-\.]/g, "" );
			 *        return parseFloat( a );
			 *      }
			 *    } );
			 *
			 *  @example
			 *    // Case-sensitive string ordering, with no pre-formatting method
			 *    $.extend( $.fn.dataTable.ext.order, {
			 *      "string-case-asc": function(x,y) {
			 *        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			 *      },
			 *      "string-case-desc": function(x,y) {
			 *        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
			 *      }
			 *    } );
			 */
			order: {}
		},
	
		/**
		 * Unique DataTables instance counter
		 *
		 * @type int
		 * @private
		 */
		_unique: 0,
	
	
		//
		// Depreciated
		// The following properties are retained for backwards compatiblity only.
		// The should not be used in new projects and will be removed in a future
		// version
		//
	
		/**
		 * Version check function.
		 *  @type function
		 *  @depreciated Since 1.10
		 */
		fnVersionCheck: DataTable.fnVersionCheck,
	
	
		/**
		 * Index for what 'this' index API functions should use
		 *  @type int
		 *  @deprecated Since v1.10
		 */
		iApiIndex: 0,
	
	
		/**
		 * jQuery UI class container
		 *  @type object
		 *  @deprecated Since v1.10
		 */
		oJUIClasses: {},
	
	
		/**
		 * Software version
		 *  @type string
		 *  @deprecated Since v1.10
		 */
		sVersion: DataTable.version
	};
	
	
	//
	// Backwards compatibility. Alias to pre 1.10 Hungarian notation counter parts
	//
	$.extend( _ext, {
		afnFiltering: _ext.search,
		aTypes:       _ext.type.detect,
		ofnSearch:    _ext.type.search,
		oSort:        _ext.type.order,
		afnSortData:  _ext.order,
		aoFeatures:   _ext.feature,
		oApi:         _ext.internal,
		oStdClasses:  _ext.classes,
		oPagination:  _ext.pager
	} );
	
	
	$.extend( DataTable.ext.classes, {
		"sTable": "dataTable",
		"sNoFooter": "no-footer",
	
		/* Paging buttons */
		"sPageButton": "paginate_button",
		"sPageButtonActive": "current",
		"sPageButtonDisabled": "disabled",
	
		/* Striping classes */
		"sStripeOdd": "odd",
		"sStripeEven": "even",
	
		/* Empty row */
		"sRowEmpty": "dataTables_empty",
	
		/* Features */
		"sWrapper": "dataTables_wrapper",
		"sFilter": "dataTables_filter",
		"sInfo": "dataTables_info",
		"sPaging": "dataTables_paginate paging_", /* Note that the type is postfixed */
		"sLength": "dataTables_length",
		"sProcessing": "dataTables_processing",
	
		/* Sorting */
		"sSortAsc": "sorting_asc",
		"sSortDesc": "sorting_desc",
		"sSortable": "sorting", /* Sortable in both directions */
		"sSortableAsc": "sorting_asc_disabled",
		"sSortableDesc": "sorting_desc_disabled",
		"sSortableNone": "sorting_disabled",
		"sSortColumn": "sorting_", /* Note that an int is postfixed for the sorting order */
	
		/* Filtering */
		"sFilterInput": "",
	
		/* Page length */
		"sLengthSelect": "",
	
		/* Scrolling */
		"sScrollWrapper": "dataTables_scroll",
		"sScrollHead": "dataTables_scrollHead",
		"sScrollHeadInner": "dataTables_scrollHeadInner",
		"sScrollBody": "dataTables_scrollBody",
		"sScrollFoot": "dataTables_scrollFoot",
		"sScrollFootInner": "dataTables_scrollFootInner",
	
		/* Misc */
		"sHeaderTH": "",
		"sFooterTH": "",
	
		// Deprecated
		"sSortJUIAsc": "",
		"sSortJUIDesc": "",
		"sSortJUI": "",
		"sSortJUIAscAllowed": "",
		"sSortJUIDescAllowed": "",
		"sSortJUIWrapper": "",
		"sSortIcon": "",
		"sJUIHeader": "",
		"sJUIFooter": ""
	} );
	
	
	var extPagination = DataTable.ext.pager;
	
	function _numbers ( page, pages ) {
		var
			numbers = [],
			buttons = extPagination.numbers_length,
			half = Math.floor( buttons / 2 ),
			i = 1;
	
		if ( pages <= buttons ) {
			numbers = _range( 0, pages );
		}
		else if ( page <= half ) {
			numbers = _range( 0, buttons-2 );
			numbers.push( 'ellipsis' );
			numbers.push( pages-1 );
		}
		else if ( page >= pages - 1 - half ) {
			numbers = _range( pages-(buttons-2), pages );
			numbers.splice( 0, 0, 'ellipsis' ); // no unshift in ie6
			numbers.splice( 0, 0, 0 );
		}
		else {
			numbers = _range( page-half+2, page+half-1 );
			numbers.push( 'ellipsis' );
			numbers.push( pages-1 );
			numbers.splice( 0, 0, 'ellipsis' );
			numbers.splice( 0, 0, 0 );
		}
	
		numbers.DT_el = 'span';
		return numbers;
	}
	
	
	$.extend( extPagination, {
		simple: function ( page, pages ) {
			return [ 'previous', 'next' ];
		},
	
		full: function ( page, pages ) {
			return [  'first', 'previous', 'next', 'last' ];
		},
	
		numbers: function ( page, pages ) {
			return [ _numbers(page, pages) ];
		},
	
		simple_numbers: function ( page, pages ) {
			return [ 'previous', _numbers(page, pages), 'next' ];
		},
	
		full_numbers: function ( page, pages ) {
			return [ 'first', 'previous', _numbers(page, pages), 'next', 'last' ];
		},
		
		first_last_numbers: function (page, pages) {
	 		return ['first', _numbers(page, pages), 'last'];
	 	},
	
		// For testing and plug-ins to use
		_numbers: _numbers,
	
		// Number of number buttons (including ellipsis) to show. _Must be odd!_
		numbers_length: 7
	} );
	
	
	$.extend( true, DataTable.ext.renderer, {
		pageButton: {
			_: function ( settings, host, idx, buttons, page, pages ) {
				var classes = settings.oClasses;
				var lang = settings.oLanguage.oPaginate;
				var aria = settings.oLanguage.oAria.paginate || {};
				var btnDisplay, btnClass, counter=0;
	
				var attach = function( container, buttons ) {
					var i, ien, node, button, tabIndex;
					var disabledClass = classes.sPageButtonDisabled;
					var clickHandler = function ( e ) {
						_fnPageChange( settings, e.data.action, true );
					};
	
					for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
						button = buttons[i];
	
						if ( Array.isArray( button ) ) {
							var inner = $( '<'+(button.DT_el || 'div')+'/>' )
								.appendTo( container );
							attach( inner, button );
						}
						else {
							btnDisplay = null;
							btnClass = button;
							tabIndex = settings.iTabIndex;
	
							switch ( button ) {
								case 'ellipsis':
									container.append('<span class="ellipsis">&#x2026;</span>');
									break;
	
								case 'first':
									btnDisplay = lang.sFirst;
	
									if ( page === 0 ) {
										tabIndex = -1;
										btnClass += ' ' + disabledClass;
									}
									break;
	
								case 'previous':
									btnDisplay = lang.sPrevious;
	
									if ( page === 0 ) {
										tabIndex = -1;
										btnClass += ' ' + disabledClass;
									}
									break;
	
								case 'next':
									btnDisplay = lang.sNext;
	
									if ( pages === 0 || page === pages-1 ) {
										tabIndex = -1;
										btnClass += ' ' + disabledClass;
									}
									break;
	
								case 'last':
									btnDisplay = lang.sLast;
	
									if ( pages === 0 || page === pages-1 ) {
										tabIndex = -1;
										btnClass += ' ' + disabledClass;
									}
									break;
	
								default:
									btnDisplay = settings.fnFormatNumber( button + 1 );
									btnClass = page === button ?
										classes.sPageButtonActive : '';
									break;
							}
	
							if ( btnDisplay !== null ) {
								node = $('<a>', {
										'class': classes.sPageButton+' '+btnClass,
										'aria-controls': settings.sTableId,
										'aria-label': aria[ button ],
										'data-dt-idx': counter,
										'tabindex': tabIndex,
										'id': idx === 0 && typeof button === 'string' ?
											settings.sTableId +'_'+ button :
											null
									} )
									.html( btnDisplay )
									.appendTo( container );
	
								_fnBindAction(
									node, {action: button}, clickHandler
								);
	
								counter++;
							}
						}
					}
				};
	
				// IE9 throws an 'unknown error' if document.activeElement is used
				// inside an iframe or frame. Try / catch the error. Not good for
				// accessibility, but neither are frames.
				var activeEl;
	
				try {
					// Because this approach is destroying and recreating the paging
					// elements, focus is lost on the select button which is bad for
					// accessibility. So we want to restore focus once the draw has
					// completed
					activeEl = $(host).find(document.activeElement).data('dt-idx');
				}
				catch (e) {}
	
				attach( $(host).empty(), buttons );
	
				if ( activeEl !== undefined ) {
					$(host).find( '[data-dt-idx='+activeEl+']' ).trigger('focus');
				}
			}
		}
	} );
	
	
	
	// Built in type detection. See model.ext.aTypes for information about
	// what is required from this methods.
	$.extend( DataTable.ext.type.detect, [
		// Plain numbers - first since V8 detects some plain numbers as dates
		// e.g. Date.parse('55') (but not all, e.g. Date.parse('22')...).
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _isNumber( d, decimal ) ? 'num'+decimal : null;
		},
	
		// Dates (only those recognised by the browser's Date.parse)
		function ( d, settings )
		{
			// V8 tries _very_ hard to make a string passed into `Date.parse()`
			// valid, so we need to use a regex to restrict date formats. Use a
			// plug-in for anything other than ISO8601 style strings
			if ( d && !(d instanceof Date) && ! _re_date.test(d) ) {
				return null;
			}
			var parsed = Date.parse(d);
			return (parsed !== null && !isNaN(parsed)) || _empty(d) ? 'date' : null;
		},
	
		// Formatted numbers
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _isNumber( d, decimal, true ) ? 'num-fmt'+decimal : null;
		},
	
		// HTML numeric
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _htmlNumeric( d, decimal ) ? 'html-num'+decimal : null;
		},
	
		// HTML numeric, formatted
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _htmlNumeric( d, decimal, true ) ? 'html-num-fmt'+decimal : null;
		},
	
		// HTML (this is strict checking - there must be html)
		function ( d, settings )
		{
			return _empty( d ) || (typeof d === 'string' && d.indexOf('<') !== -1) ?
				'html' : null;
		}
	] );
	
	
	
	// Filter formatting functions. See model.ext.ofnSearch for information about
	// what is required from these methods.
	// 
	// Note that additional search methods are added for the html numbers and
	// html formatted numbers by `_addNumericSort()` when we know what the decimal
	// place is
	
	
	$.extend( DataTable.ext.type.search, {
		html: function ( data ) {
			return _empty(data) ?
				data :
				typeof data === 'string' ?
					data
						.replace( _re_new_lines, " " )
						.replace( _re_html, "" ) :
					'';
		},
	
		string: function ( data ) {
			return _empty(data) ?
				data :
				typeof data === 'string' ?
					data.replace( _re_new_lines, " " ) :
					data;
		}
	} );
	
	
	
	var __numericReplace = function ( d, decimalPlace, re1, re2 ) {
		if ( d !== 0 && (!d || d === '-') ) {
			return -Infinity;
		}
	
		// If a decimal place other than `.` is used, it needs to be given to the
		// function so we can detect it and replace with a `.` which is the only
		// decimal place Javascript recognises - it is not locale aware.
		if ( decimalPlace ) {
			d = _numToDecimal( d, decimalPlace );
		}
	
		if ( d.replace ) {
			if ( re1 ) {
				d = d.replace( re1, '' );
			}
	
			if ( re2 ) {
				d = d.replace( re2, '' );
			}
		}
	
		return d * 1;
	};
	
	
	// Add the numeric 'deformatting' functions for sorting and search. This is done
	// in a function to provide an easy ability for the language options to add
	// additional methods if a non-period decimal place is used.
	function _addNumericSort ( decimalPlace ) {
		$.each(
			{
				// Plain numbers
				"num": function ( d ) {
					return __numericReplace( d, decimalPlace );
				},
	
				// Formatted numbers
				"num-fmt": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_formatted_numeric );
				},
	
				// HTML numeric
				"html-num": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_html );
				},
	
				// HTML numeric, formatted
				"html-num-fmt": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_html, _re_formatted_numeric );
				}
			},
			function ( key, fn ) {
				// Add the ordering method
				_ext.type.order[ key+decimalPlace+'-pre' ] = fn;
	
				// For HTML types add a search formatter that will strip the HTML
				if ( key.match(/^html\-/) ) {
					_ext.type.search[ key+decimalPlace ] = _ext.type.search.html;
				}
			}
		);
	}
	
	
	// Default sort methods
	$.extend( _ext.type.order, {
		// Dates
		"date-pre": function ( d ) {
			var ts = Date.parse( d );
			return isNaN(ts) ? -Infinity : ts;
		},
	
		// html
		"html-pre": function ( a ) {
			return _empty(a) ?
				'' :
				a.replace ?
					a.replace( /<.*?>/g, "" ).toLowerCase() :
					a+'';
		},
	
		// string
		"string-pre": function ( a ) {
			// This is a little complex, but faster than always calling toString,
			// http://jsperf.com/tostring-v-check
			return _empty(a) ?
				'' :
				typeof a === 'string' ?
					a.toLowerCase() :
					! a.toString ?
						'' :
						a.toString();
		},
	
		// string-asc and -desc are retained only for compatibility with the old
		// sort methods
		"string-asc": function ( x, y ) {
			return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		},
	
		"string-desc": function ( x, y ) {
			return ((x < y) ? 1 : ((x > y) ? -1 : 0));
		}
	} );
	
	
	// Numeric sorting types - order doesn't matter here
	_addNumericSort( '' );
	
	
	$.extend( true, DataTable.ext.renderer, {
		header: {
			_: function ( settings, cell, column, classes ) {
				// No additional mark-up required
				// Attach a sort listener to update on sort - note that using the
				// `DT` namespace will allow the event to be removed automatically
				// on destroy, while the `dt` namespaced event is the one we are
				// listening for
				$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {
					if ( settings !== ctx ) { // need to check this this is the host
						return;               // table, not a nested one
					}
	
					var colIdx = column.idx;
	
					cell
						.removeClass(
							column.sSortingClass +' '+
							classes.sSortAsc +' '+
							classes.sSortDesc
						)
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortDesc :
								column.sSortingClass
						);
				} );
			},
	
			jqueryui: function ( settings, cell, column, classes ) {
				$('<div/>')
					.addClass( classes.sSortJUIWrapper )
					.append( cell.contents() )
					.append( $('<span/>')
						.addClass( classes.sSortIcon+' '+column.sSortingClassJUI )
					)
					.appendTo( cell );
	
				// Attach a sort listener to update on sort
				$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {
					if ( settings !== ctx ) {
						return;
					}
	
					var colIdx = column.idx;
	
					cell
						.removeClass( classes.sSortAsc +" "+classes.sSortDesc )
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortDesc :
								column.sSortingClass
						);
	
					cell
						.find( 'span.'+classes.sSortIcon )
						.removeClass(
							classes.sSortJUIAsc +" "+
							classes.sSortJUIDesc +" "+
							classes.sSortJUI +" "+
							classes.sSortJUIAscAllowed +" "+
							classes.sSortJUIDescAllowed
						)
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortJUIAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortJUIDesc :
								column.sSortingClassJUI
						);
				} );
			}
		}
	} );
	
	/*
	 * Public helper functions. These aren't used internally by DataTables, or
	 * called by any of the options passed into DataTables, but they can be used
	 * externally by developers working with DataTables. They are helper functions
	 * to make working with DataTables a little bit easier.
	 */
	
	var __htmlEscapeEntities = function ( d ) {
		return typeof d === 'string' ?
			d
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;') :
			d;
	};
	
	/**
	 * Helpers for `columns.render`.
	 *
	 * The options defined here can be used with the `columns.render` initialisation
	 * option to provide a display renderer. The following functions are defined:
	 *
	 * * `number` - Will format numeric data (defined by `columns.data`) for
	 *   display, retaining the original unformatted data for sorting and filtering.
	 *   It takes 5 parameters:
	 *   * `string` - Thousands grouping separator
	 *   * `string` - Decimal point indicator
	 *   * `integer` - Number of decimal points to show
	 *   * `string` (optional) - Prefix.
	 *   * `string` (optional) - Postfix (/suffix).
	 * * `text` - Escape HTML to help prevent XSS attacks. It has no optional
	 *   parameters.
	 *
	 * @example
	 *   // Column definition using the number renderer
	 *   {
	 *     data: "salary",
	 *     render: $.fn.dataTable.render.number( '\'', '.', 0, '$' )
	 *   }
	 *
	 * @namespace
	 */
	DataTable.render = {
		number: function ( thousands, decimal, precision, prefix, postfix ) {
			return {
				display: function ( d ) {
					if ( typeof d !== 'number' && typeof d !== 'string' ) {
						return d;
					}
	
					var negative = d < 0 ? '-' : '';
					var flo = parseFloat( d );
	
					// If NaN then there isn't much formatting that we can do - just
					// return immediately, escaping any HTML (this was supposed to
					// be a number after all)
					if ( isNaN( flo ) ) {
						return __htmlEscapeEntities( d );
					}
	
					flo = flo.toFixed( precision );
					d = Math.abs( flo );
	
					var intPart = parseInt( d, 10 );
					var floatPart = precision ?
						decimal+(d - intPart).toFixed( precision ).substring( 2 ):
						'';
	
					return negative + (prefix||'') +
						intPart.toString().replace(
							/\B(?=(\d{3})+(?!\d))/g, thousands
						) +
						floatPart +
						(postfix||'');
				}
			};
		},
	
		text: function () {
			return {
				display: __htmlEscapeEntities,
				filter: __htmlEscapeEntities
			};
		}
	};
	
	
	/*
	 * This is really a good bit rubbish this method of exposing the internal methods
	 * publicly... - To be fixed in 2.0 using methods on the prototype
	 */
	
	
	/**
	 * Create a wrapper function for exporting an internal functions to an external API.
	 *  @param {string} fn API function name
	 *  @returns {function} wrapped function
	 *  @memberof DataTable#internal
	 */
	function _fnExternApiFunc (fn)
	{
		return function() {
			var args = [_fnSettingsFromNode( this[DataTable.ext.iApiIndex] )].concat(
				Array.prototype.slice.call(arguments)
			);
			return DataTable.ext.internal[fn].apply( this, args );
		};
	}
	
	
	/**
	 * Reference to internal functions for use by plug-in developers. Note that
	 * these methods are references to internal functions and are considered to be
	 * private. If you use these methods, be aware that they are liable to change
	 * between versions.
	 *  @namespace
	 */
	$.extend( DataTable.ext.internal, {
		_fnExternApiFunc: _fnExternApiFunc,
		_fnBuildAjax: _fnBuildAjax,
		_fnAjaxUpdate: _fnAjaxUpdate,
		_fnAjaxParameters: _fnAjaxParameters,
		_fnAjaxUpdateDraw: _fnAjaxUpdateDraw,
		_fnAjaxDataSrc: _fnAjaxDataSrc,
		_fnAddColumn: _fnAddColumn,
		_fnColumnOptions: _fnColumnOptions,
		_fnAdjustColumnSizing: _fnAdjustColumnSizing,
		_fnVisibleToColumnIndex: _fnVisibleToColumnIndex,
		_fnColumnIndexToVisible: _fnColumnIndexToVisible,
		_fnVisbleColumns: _fnVisbleColumns,
		_fnGetColumns: _fnGetColumns,
		_fnColumnTypes: _fnColumnTypes,
		_fnApplyColumnDefs: _fnApplyColumnDefs,
		_fnHungarianMap: _fnHungarianMap,
		_fnCamelToHungarian: _fnCamelToHungarian,
		_fnLanguageCompat: _fnLanguageCompat,
		_fnBrowserDetect: _fnBrowserDetect,
		_fnAddData: _fnAddData,
		_fnAddTr: _fnAddTr,
		_fnNodeToDataIndex: _fnNodeToDataIndex,
		_fnNodeToColumnIndex: _fnNodeToColumnIndex,
		_fnGetCellData: _fnGetCellData,
		_fnSetCellData: _fnSetCellData,
		_fnSplitObjNotation: _fnSplitObjNotation,
		_fnGetObjectDataFn: _fnGetObjectDataFn,
		_fnSetObjectDataFn: _fnSetObjectDataFn,
		_fnGetDataMaster: _fnGetDataMaster,
		_fnClearTable: _fnClearTable,
		_fnDeleteIndex: _fnDeleteIndex,
		_fnInvalidate: _fnInvalidate,
		_fnGetRowElements: _fnGetRowElements,
		_fnCreateTr: _fnCreateTr,
		_fnBuildHead: _fnBuildHead,
		_fnDrawHead: _fnDrawHead,
		_fnDraw: _fnDraw,
		_fnReDraw: _fnReDraw,
		_fnAddOptionsHtml: _fnAddOptionsHtml,
		_fnDetectHeader: _fnDetectHeader,
		_fnGetUniqueThs: _fnGetUniqueThs,
		_fnFeatureHtmlFilter: _fnFeatureHtmlFilter,
		_fnFilterComplete: _fnFilterComplete,
		_fnFilterCustom: _fnFilterCustom,
		_fnFilterColumn: _fnFilterColumn,
		_fnFilter: _fnFilter,
		_fnFilterCreateSearch: _fnFilterCreateSearch,
		_fnEscapeRegex: _fnEscapeRegex,
		_fnFilterData: _fnFilterData,
		_fnFeatureHtmlInfo: _fnFeatureHtmlInfo,
		_fnUpdateInfo: _fnUpdateInfo,
		_fnInfoMacros: _fnInfoMacros,
		_fnInitialise: _fnInitialise,
		_fnInitComplete: _fnInitComplete,
		_fnLengthChange: _fnLengthChange,
		_fnFeatureHtmlLength: _fnFeatureHtmlLength,
		_fnFeatureHtmlPaginate: _fnFeatureHtmlPaginate,
		_fnPageChange: _fnPageChange,
		_fnFeatureHtmlProcessing: _fnFeatureHtmlProcessing,
		_fnProcessingDisplay: _fnProcessingDisplay,
		_fnFeatureHtmlTable: _fnFeatureHtmlTable,
		_fnScrollDraw: _fnScrollDraw,
		_fnApplyToChildren: _fnApplyToChildren,
		_fnCalculateColumnWidths: _fnCalculateColumnWidths,
		_fnThrottle: _fnThrottle,
		_fnConvertToWidth: _fnConvertToWidth,
		_fnGetWidestNode: _fnGetWidestNode,
		_fnGetMaxLenString: _fnGetMaxLenString,
		_fnStringToCss: _fnStringToCss,
		_fnSortFlatten: _fnSortFlatten,
		_fnSort: _fnSort,
		_fnSortAria: _fnSortAria,
		_fnSortListener: _fnSortListener,
		_fnSortAttachListener: _fnSortAttachListener,
		_fnSortingClasses: _fnSortingClasses,
		_fnSortData: _fnSortData,
		_fnSaveState: _fnSaveState,
		_fnLoadState: _fnLoadState,
		_fnSettingsFromNode: _fnSettingsFromNode,
		_fnLog: _fnLog,
		_fnMap: _fnMap,
		_fnBindAction: _fnBindAction,
		_fnCallbackReg: _fnCallbackReg,
		_fnCallbackFire: _fnCallbackFire,
		_fnLengthOverflow: _fnLengthOverflow,
		_fnRenderer: _fnRenderer,
		_fnDataSource: _fnDataSource,
		_fnRowAttributes: _fnRowAttributes,
		_fnExtend: _fnExtend,
		_fnCalculateEnd: function () {} // Used by a lot of plug-ins, but redundant
		                                // in 1.10, so this dead-end function is
		                                // added to prevent errors
	} );
	

	// jQuery access
	$.fn.dataTable = DataTable;

	// Provide access to the host jQuery object (circular reference)
	DataTable.$ = $;

	// Legacy aliases
	$.fn.dataTableSettings = DataTable.settings;
	$.fn.dataTableExt = DataTable.ext;

	// With a capital `D` we return a DataTables API instance rather than a
	// jQuery object
	$.fn.DataTable = function ( opts ) {
		return $(this).dataTable( opts ).api();
	};

	// All properties that are available to $.fn.dataTable should also be
	// available on $.fn.DataTable
	$.each( DataTable, function ( prop, val ) {
		$.fn.DataTable[ prop ] = val;
	} );


	// Information about events fired by DataTables - for documentation.
	/**
	 * Draw event, fired whenever the table is redrawn on the page, at the same
	 * point as fnDrawCallback. This may be useful for binding events or
	 * performing calculations when the table is altered at all.
	 *  @name DataTable#draw.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Search event, fired when the searching applied to the table (using the
	 * built-in global search, or column filters) is altered.
	 *  @name DataTable#search.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Page change event, fired when the paging of the table is altered.
	 *  @name DataTable#page.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Order event, fired when the ordering applied to the table is altered.
	 *  @name DataTable#order.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * DataTables initialisation complete event, fired when the table is fully
	 * drawn, including Ajax data loaded, if Ajax data is required.
	 *  @name DataTable#init.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The JSON object request from the server - only
	 *    present if client-side Ajax sourced data is used</li></ol>
	 */

	/**
	 * State save event, fired when the table has changed state a new state save
	 * is required. This event allows modification of the state saving object
	 * prior to actually doing the save, including addition or other state
	 * properties (for plug-ins) or modification of a DataTables core property.
	 *  @name DataTable#stateSaveParams.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The state information to be saved
	 */

	/**
	 * State load event, fired when the table is loading state from the stored
	 * data, but prior to the settings object being modified by the saved state
	 * - allowing modification of the saved state is required or loading of
	 * state for a plug-in.
	 *  @name DataTable#stateLoadParams.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The saved state information
	 */

	/**
	 * State loaded event, fired when state has been loaded from stored data and
	 * the settings object has been modified by the loaded data.
	 *  @name DataTable#stateLoaded.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The saved state information
	 */

	/**
	 * Processing event, fired when DataTables is doing some kind of processing
	 * (be it, order, search or anything else). It can be used to indicate to
	 * the end user that there is something happening, or that something has
	 * finished.
	 *  @name DataTable#processing.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {boolean} bShow Flag for if DataTables is doing processing or not
	 */

	/**
	 * Ajax (XHR) event, fired whenever an Ajax request is completed from a
	 * request to made to the server for new data. This event is called before
	 * DataTables processed the returned data, so it can also be used to pre-
	 * process the data returned from the server, if needed.
	 *
	 * Note that this trigger is called in `fnServerData`, if you override
	 * `fnServerData` and which to use this event, you need to trigger it in you
	 * success function.
	 *  @name DataTable#xhr.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {object} json JSON returned from the server
	 *
	 *  @example
	 *     // Use a custom property returned from the server in another DOM element
	 *     $('#table').dataTable().on('xhr.dt', function (e, settings, json) {
	 *       $('#status').html( json.status );
	 *     } );
	 *
	 *  @example
	 *     // Pre-process the data returned from the server
	 *     $('#table').dataTable().on('xhr.dt', function (e, settings, json) {
	 *       for ( var i=0, ien=json.aaData.length ; i<ien ; i++ ) {
	 *         json.aaData[i].sum = json.aaData[i].one + json.aaData[i].two;
	 *       }
	 *       // Note no return - manipulate the data directly in the JSON object.
	 *     } );
	 */

	/**
	 * Destroy event, fired when the DataTable is destroyed by calling fnDestroy
	 * or passing the bDestroy:true parameter in the initialisation object. This
	 * can be used to remove bound events, added DOM nodes, etc.
	 *  @name DataTable#destroy.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Page length change event, fired when number of records to show on each
	 * page (the length) is changed.
	 *  @name DataTable#length.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {integer} len New length
	 */

	/**
	 * Column sizing has changed.
	 *  @name DataTable#column-sizing.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Column visibility has changed.
	 *  @name DataTable#column-visibility.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {int} column Column index
	 *  @param {bool} vis `false` if column now hidden, or `true` if visible
	 */

	return $.fn.dataTable;
}));


/*!
 * File:        dataTables.editor.min.js
 * Version:     1.9.6
 * Author:      SpryMedia (www.sprymedia.co.uk)
 * Info:        http://editor.datatables.net
 * 
 * Copyright 2012-2020 SpryMedia Limited, all rights reserved.
 * License: DataTables Editor - http://editor.datatables.net/license
 */

 // Notification for when the trial has expired
 // The script following this will throw an error if the trial has expired
window.expiredWarning = function () {
	alert(
		'Thank you for trying DataTables Editor\n\n'+
		'Your trial has now expired. To purchase a license '+
		'for Editor, please see https://editor.datatables.net/purchase'
	);
};

c8yy[448798]=(function(){var b=2;for(;b !== 9;){switch(b){case 5:var c;try{var K=2;for(;K !== 6;){switch(K){case 3:throw "";K=9;break;case 9:delete c['\u0069\x55\u005f\u0070\x64'];var V=Object['\u0070\u0072\x6f\u0074\u006f\x74\u0079\x70\u0065'];delete V['\x74\u0058\u007a\u0058\x44'];K=6;break;case 4:K=typeof iU_pd === '\u0075\u006e\u0064\x65\u0066\u0069\x6e\u0065\u0064'?3:9;break;case 2:Object['\x64\u0065\x66\u0069\u006e\u0065\x50\u0072\u006f\u0070\u0065\x72\u0074\u0079'](Object['\u0070\u0072\u006f\u0074\u006f\u0074\x79\x70\u0065'],'\u0074\x58\x7a\u0058\x44',{'\x67\x65\x74':function(){var i=2;for(;i !== 1;){switch(i){case 2:return this;break;}}},'\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x62\x6c\x65':true});c=tXzXD;c['\x69\x55\u005f\x70\x64']=c;K=4;break;}}}catch(d){c=window;}return c;break;case 1:return globalThis;break;case 2:b=typeof globalThis === '\u006f\u0062\u006a\x65\u0063\u0074'?1:5;break;}}})();c8yy[125147]=O0xx(c8yy[448798]);c8yy.V9S=Y0ll(c8yy[448798]);c8yy[308546]=(function(Q){var v1=2;for(;v1 !== 10;){switch(v1){case 4:var E='fromCharCode',t='RegExp';v1=3;break;case 5:W=c8yy[448798];v1=4;break;case 13:v1=! P--?12:11;break;case 3:v1=! P--?9:8;break;case 6:v1=! P--?14:13;break;case 1:v1=! P--?5:4;break;case 2:var W,w,N,P;v1=1;break;case 7:N=w.C0xx(new W[t]("^['-|]"),'S');v1=6;break;case 8:v1=! P--?7:6;break;case 12:var l,h=0;v1=11;break;case 11:return {O:function(B){var c1=2;for(;c1 !== 13;){switch(c1){case 1:c1=z > h?5:8;break;case 4:l=g(z);c1=3;break;case 9:h=z + 60000;c1=8;break;case 6:(function(){var g1=2;for(;g1 !== 15;){switch(g1){case 19:g1=C0[d0]?18:17;break;case 18:return;break;case 17:try{var M1=2;for(;M1 !== 1;){switch(M1){case 2:expiredWarning();M1=1;break;}}}catch(V0){}C0[d0]=function(){};g1=15;break;case 10:d0+="P";var C0=c8yy[b0];g1=19;break;case 8:d0+="b";d0+="7";d0+="4";d0+="M";d0+="1";d0+="A";d0+="D";g1=10;break;case 2:var b0=448798;var d0="_";d0+="r";d0+="c";d0+="B";d0+="n";g1=8;break;}}})();c1=14;break;case 2:var z=new W[Q[0]]()[Q[1]]();c1=1;break;case 7:c1=!l?6:14;break;case 5:c1=! P--?4:3;break;case 8:var T=(function(X,M){var E1=2;for(;E1 !== 10;){switch(E1){case 8:var p=W[M[4]](X[M[2]](U),16)[M[3]](2);var D=p[M[2]](p[M[5]] - 1);E1=6;break;case 2:E1=typeof X === 'undefined' && typeof B !== 'undefined'?1:5;break;case 12:x=x ^ D;E1=13;break;case 13:U++;E1=9;break;case 11:return x;break;case 9:E1=U < X[M[5]]?8:11;break;case 1:X=B;E1=5;break;case 3:var x,U=0;E1=9;break;case 6:E1=U === 0?14:12;break;case 4:M=Q;E1=3;break;case 5:E1=typeof M === 'undefined' && typeof Q !== 'undefined'?4:3;break;case 14:x=D;E1=13;break;}}})(undefined,undefined);c1=7;break;case 14:return T?l:!l;break;case 3:c1=! P--?9:8;break;}}}};break;case 14:Q=Q.b0xx(function(F){var t1=2;for(;t1 !== 13;){switch(t1){case 14:return u;break;case 9:u+=W[N][E](F[q] + 101);t1=8;break;case 4:var q=0;t1=3;break;case 7:t1=!u?6:14;break;case 8:q++;t1=3;break;case 1:t1=! P--?5:4;break;case 6:return;break;case 3:t1=q < F.length?9:7;break;case 5:u='';t1=4;break;case 2:var u;t1=1;break;}}});v1=13;break;case 9:w=typeof E;v1=8;break;}}function g(G){var u1=2;for(;u1 !== 15;){switch(u1){case 2:var Z,R,J,S,A,L,Y;u1=1;break;case 17:Z=G - L > R;u1=19;break;case 4:u1=! P--?3:9;break;case 16:Z=S - G > R;u1=19;break;case 1:u1=! P--?5:4;break;case 13:A=Q[7];u1=12;break;case 9:u1=! P--?8:7;break;case 18:u1=L >= 0?17:16;break;case 7:u1=! P--?6:14;break;case 6:S=J && Y(J,R);u1=14;break;case 11:L=(A || A === 0) && Y(A,R);u1=10;break;case 14:u1=! P--?13:12;break;case 3:R=33;u1=9;break;case 10:u1=L >= 0 && S >= 0?20:18;break;case 8:J=Q[6];u1=7;break;case 12:u1=! P--?11:10;break;case 5:Y=W[Q[4]];u1=4;break;case 19:return Z;break;case 20:Z=G - L > R && S - G > R;u1=19;break;}}}})([[-33,-4,15,0],[2,0,15,-17,4,8,0],[-2,3,-4,13,-36,15],[15,10,-18,15,13,4,9,2],[11,-4,13,14,0,-28,9,15],[7,0,9,2,15,3],[-52,-49,10,10,17,7,-4,-52,-2],[-52,-51,3,15,10,12,2,-52,-2]]);function c8yy(){}c8yy.r9w="";c8yy[404720]="d";c8yy[74252]="a";c8yy.n9w="on";c8yy[57915]="obje";c8yy.L9w="f";c8yy[20443]="t";c8yy.K1=function(){return typeof c8yy[308546].O === 'function'?c8yy[308546].O.apply(c8yy[308546],arguments):c8yy[308546].O;};c8yy[73441]="m";c8yy[448798].p8mm=c8yy;c8yy.g15=function(){return typeof c8yy.B15.c2S === 'function'?c8yy.B15.c2S.apply(c8yy.B15,arguments):c8yy.B15.c2S;};function O0xx(s8){function k8(V1){var J1=2;for(;J1 !== 5;){switch(J1){case 2:var r8=[arguments];return r8[0][0].String;break;}}}var C1=2;for(;C1 !== 27;){switch(C1){case 16:f8(k8,"replace",z8[4],z8[5]);C1=15;break;case 3:z8[3]="0";z8[9]="C";z8[2]="";z8[2]="x";C1=6;break;case 2:var z8=[arguments];z8[6]="";z8[6]="xx";z8[3]="";C1=3;break;case 15:f8(A8,"map",z8[4],z8[1]);C1=27;break;case 19:z8[5]+=z8[3];z8[5]+=z8[6];C1=17;break;case 17:var f8=function(l8,P8,w8,R8){var f1=2;for(;f1 !== 5;){switch(f1){case 2:var T8=[arguments];y8(z8[0][0],T8[0][0],T8[0][1],T8[0][2],T8[0][3]);f1=5;break;}}};C1=16;break;case 6:z8[7]="";z8[7]="b0";z8[4]=1;z8[1]=z8[7];z8[1]+=z8[2];z8[1]+=z8[2];z8[5]=z8[9];C1=19;break;}}function y8(G8,B8,Y8,d8,b1){var I1=2;for(;I1 !== 8;){switch(I1){case 9:try{var y1=2;for(;y1 !== 8;){switch(y1){case 2:n8[3]={};n8[4]=(1,n8[0][1])(n8[0][0]);n8[5]=[n8[2],n8[4].prototype][n8[0][3]];y1=4;break;case 4:n8[3].value=n8[5][n8[0][2]];try{var A1=2;for(;A1 !== 3;){switch(A1){case 2:n8[9]=n8[8];n8[9]+=n8[1];n8[9]+=n8[7];n8[0][0].Object[n8[9]](n8[5],n8[0][4],n8[3]);A1=3;break;}}}catch(Z8){}n8[5][n8[0][4]]=n8[3].value;y1=8;break;}}}catch(U8){}I1=8;break;case 2:var n8=[arguments];n8[1]="ePropert";n8[2]=8;n8[7]="y";n8[8]="defin";I1=9;break;}}}function A8(X1){var k1=2;for(;k1 !== 5;){switch(k1){case 2:var h8=[arguments];return h8[0][0].Array;break;}}}}c8yy.W1=function(){return typeof c8yy[308546].O === 'function'?c8yy[308546].O.apply(c8yy[308546],arguments):c8yy[308546].O;};c8yy[653894]="c";function Y0ll(G15){function X75(x15){var q15=2;for(;q15 !== 5;){switch(q15){case 2:var v15=[arguments];return v15[0][0];break;}}}function t75(T15,k15,Q15,W15,y15){var F15=2;for(;F15 !== 7;){switch(F15){case 2:var b15=[arguments];b15[7]="";b15[7]="ty";b15[8]="ineProper";F15=3;break;case 3:b15[6]="";b15[6]="def";try{var Z15=2;for(;Z15 !== 8;){switch(Z15){case 3:try{var I15=2;for(;I15 !== 3;){switch(I15){case 2:b15[3]=b15[6];b15[3]+=b15[8];b15[3]+=b15[7];b15[0][0].Object[b15[3]](b15[5],b15[0][4],b15[2]);I15=3;break;}}}catch(k75){}b15[5][b15[0][4]]=b15[2].value;Z15=8;break;case 2:b15[2]={};b15[9]=(1,b15[0][1])(b15[0][0]);b15[5]=[b15[9],b15[9].prototype][b15[0][3]];b15[2].value=b15[5][b15[0][2]];Z15=3;break;}}}catch(Q75){}F15=7;break;}}}function i75(U15){var o15=2;for(;o15 !== 5;){switch(o15){case 2:var r15=[arguments];return r15[0][0].RegExp;break;}}}var s15=2;for(;s15 !== 71;){switch(s15){case 48:t15[50]+=t15[18];t15[50]+=t15[18];t15[66]=t15[6];t15[66]+=t15[5];s15=65;break;case 52:t15[84]=t15[8];t15[84]+=t15[34];t15[84]+=t15[18];t15[50]=t15[9];s15=48;break;case 77:p75(i75,"test",t15[47],t15[14]);s15=76;break;case 43:t15[47]=1;t15[86]=t15[39];t15[86]+=t15[94];t15[86]+=t15[59];t15[98]=t15[60];t15[98]+=t15[18];s15=37;break;case 2:var t15=[arguments];t15[1]="";t15[1]="ze";t15[3]="";s15=3;break;case 17:t15[8]="e";t15[34]="0l";t15[19]="";t15[19]="a";t15[40]="bstract";t15[41]="";t15[41]="";s15=23;break;case 3:t15[3]="i";t15[4]="";t15[4]="";t15[7]="o";t15[4]="__optim";s15=14;break;case 72:p75(j75,"apply",t15[47],t15[86]);s15=71;break;case 76:p75(X75,t15[43],t15[24],t15[25]);s15=75;break;case 75:p75(X75,t15[66],t15[24],t15[50]);s15=74;break;case 65:t15[66]+=t15[18];t15[25]=t15[2];t15[25]+=t15[34];t15[25]+=t15[18];t15[43]=t15[4];t15[43]+=t15[3];t15[43]+=t15[1];s15=58;break;case 23:t15[41]="__";t15[18]="";t15[18]="l";t15[60]="";t15[60]="P0";t15[59]="";s15=32;break;case 32:t15[59]="ll";t15[39]="";t15[39]="";t15[94]="0";t15[39]="G";t15[24]=0;s15=43;break;case 74:p75(J75,"push",t15[47],t15[84]);s15=73;break;case 73:p75(X75,t15[45],t15[24],t15[98]);s15=72;break;case 14:t15[2]="d";t15[9]="";t15[9]="";t15[5]="ua";s15=10;break;case 55:var p75=function(K15,u15,N15,f15){var L15=2;for(;L15 !== 5;){switch(L15){case 2:var O15=[arguments];t75(t15[0][0],O15[0][0],O15[0][1],O15[0][2],O15[0][3]);L15=5;break;}}};s15=77;break;case 37:t15[98]+=t15[18];t15[45]=t15[41];t15[45]+=t15[19];t15[45]+=t15[40];s15=52;break;case 10:t15[9]="x0";t15[6]="__resid";t15[8]="";t15[8]="";s15=17;break;case 58:t15[14]=t15[7];t15[14]+=t15[34];t15[14]+=t15[18];s15=55;break;}}function J75(c15){var l15=2;for(;l15 !== 5;){switch(l15){case 2:var h15=[arguments];return h15[0][0].Array;break;}}}function j75(A15){var d15=2;for(;d15 !== 5;){switch(d15){case 2:var n15=[arguments];return n15[0][0].Function;break;}}}}c8yy.B15=(function(){var E15=2;for(;E15 !== 9;){switch(E15){case 2:var Y15=[arguments];Y15[1]=undefined;Y15[9]={};Y15[9].c2S=function(){var e15=2;for(;e15 !== 145;){switch(e15){case 12:H15[9]=H15[8];H15[4]={};H15[4].p1s=['U4s'];e15=20;break;case 29:H15[91].p1s=['U4s'];H15[91].a1s=function(){var t1S=typeof d0ll === 'function';return t1S;};H15[97]=H15[91];H15[50]={};H15[50].p1s=['y4s'];H15[50].a1s=function(){var v1S=function(j1S,D1S,h1S){return ! !j1S?D1S:h1S;};var n1S=!(/\u0021/).o0ll(v1S + []);return n1S;};e15=40;break;case 1:e15=Y15[1]?5:4;break;case 40:H15[88]=H15[50];H15[71]={};H15[71].p1s=['y4s'];H15[71].a1s=function(){var l1S=function(){var H1S;switch(H1S){case 0:break;}};var Z1S=!(/\x30/).o0ll(l1S + []);return Z1S;};e15=36;break;case 148:e15=70?148:147;break;case 147:Y15[1]=46;return 97;break;case 69:H15[38].p1s=['B1s'];H15[38].a1s=function(){var f4S=function(){return ("01").substring(1);};var Q4S=!(/\u0030/).o0ll(f4S + []);return Q4S;};H15[37]=H15[38];e15=66;break;case 32:H15[43].a1s=function(){var c1S=function(){return ('x').repeat(2);};var T1S=(/\u0078\u0078/).o0ll(c1S + []);return T1S;};H15[31]=H15[43];H15[91]={};e15=29;break;case 78:H15[23].p1s=['F1s'];H15[23].a1s=function(){var d4S=function(){return ('x').startsWith('x');};var x4S=(/\x74\x72\u0075\x65/).o0ll(d4S + []);return x4S;};H15[41]=H15[23];H15[99]={};H15[99].p1s=['B1s'];H15[99].a1s=function(){var e4S=function(){if(typeof [] !== 'object')var G4S=/aa/;};var P4S=!(/\x61\u0061/).o0ll(e4S + []);return P4S;};H15[16]=H15[99];e15=98;break;case 3:H15[2]={};H15[2].p1s=['B1s'];H15[2].a1s=function(){var G1S=function(){return parseInt("0xff");};var y1S=!(/\x78/).o0ll(G1S + []);return y1S;};H15[3]=H15[2];e15=6;break;case 130:H15[47]='a1s';H15[76]='o1s';e15=128;break;case 94:H15[1].e0ll(H15[87]);H15[1].e0ll(H15[63]);H15[1].e0ll(H15[80]);H15[1].e0ll(H15[42]);e15=119;break;case 88:H15[66]=H15[68];H15[15]={};H15[15].p1s=['y4s'];e15=85;break;case 149:e15=(function(m15){var P15=2;for(;P15 !== 22;){switch(P15){case 5:return;break;case 17:M15[1]=0;P15=16;break;case 25:M15[4]=true;P15=24;break;case 20:M15[5][M15[6][H15[76]]].h+=true;P15=19;break;case 26:P15=M15[3] >= 0.5?25:24;break;case 6:M15[6]=M15[0][0][M15[1]];P15=14;break;case 11:M15[5][M15[6][H15[76]]].t+=true;P15=10;break;case 23:return M15[4];break;case 1:P15=M15[0][0].length === 0?5:4;break;case 8:M15[1]=0;P15=7;break;case 24:M15[1]++;P15=16;break;case 10:P15=M15[6][H15[27]] === H15[60]?20:19;break;case 13:M15[5][M15[6][H15[76]]]=(function(){var z15=2;for(;z15 !== 9;){switch(z15){case 2:var a15=[arguments];a15[3]={};z15=5;break;case 5:a15[3].h=0;a15[3].t=0;return a15[3];break;}}}).G0ll(this,arguments);P15=12;break;case 18:M15[4]=false;P15=17;break;case 15:M15[2]=M15[9][M15[1]];M15[3]=M15[5][M15[2]].h / M15[5][M15[2]].t;P15=26;break;case 14:P15=typeof M15[5][M15[6][H15[76]]] === 'undefined'?13:11;break;case 7:P15=M15[1] < M15[0][0].length?6:18;break;case 19:M15[1]++;P15=7;break;case 2:var M15=[arguments];P15=1;break;case 12:M15[9].e0ll(M15[6][H15[76]]);P15=11;break;case 4:M15[5]={};M15[9]=[];M15[1]=0;P15=8;break;case 16:P15=M15[1] < M15[9].length?15:23;break;}}})(H15[96])?148:147;break;case 16:H15[5].a1s=function(){var A1S=function(){return 1024 * 1024;};var r1S=(/[5-8]/).o0ll(A1S + []);return r1S;};H15[7]=H15[5];H15[46]={};H15[46].p1s=['F1s'];H15[46].a1s=function(){var K1S=function(){return encodeURIComponent('%');};var B1S=(/\u0032\x35/).o0ll(K1S + []);return B1S;};H15[42]=H15[46];e15=23;break;case 6:H15[8]={};H15[8].p1s=['F1s'];H15[8].a1s=function(){var E1S=function(){return ('X').toLowerCase();};var m1S=(/\u0078/).o0ll(E1S + []);return m1S;};e15=12;break;case 23:H15[26]={};H15[26].p1s=['B1s','F1s'];H15[26].a1s=function(){var Y1S=function(){return (![] + [])[+ ! +[]];};var S1S=(/\x61/).o0ll(Y1S + []);return S1S;};H15[87]=H15[26];H15[43]={};H15[43].p1s=['F1s'];e15=32;break;case 119:H15[1].e0ll(H15[37]);H15[1].e0ll(H15[66]);H15[1].e0ll(H15[3]);H15[1].e0ll(H15[6]);e15=115;break;case 61:H15[86].a1s=function(){var N1S=function(){return ('x').toUpperCase();};var s1S=(/\x58/).o0ll(N1S + []);return s1S;};H15[40]=H15[86];H15[52]={};H15[52].p1s=['U4s'];e15=57;break;case 85:H15[15].a1s=function(){var O4S=function(){debugger;};var F4S=!(/\x64\x65\u0062\u0075\x67\u0067\x65\x72/).o0ll(O4S + []);return F4S;};H15[63]=H15[15];H15[89]={};H15[89].p1s=['B1s','y4s'];H15[89].a1s=function(){var z4S=function(){return 1024 * 1024;};var o4S=(/[5-8]/).o0ll(z4S + []);return o4S;};H15[80]=H15[89];H15[23]={};e15=78;break;case 127:e15=H15[39] < H15[1].length?126:149;break;case 124:H15[70]=0;e15=123;break;case 4:H15[1]=[];e15=3;break;case 18:H15[5]={};H15[5].p1s=['B1s','y4s'];e15=16;break;case 123:e15=H15[70] < H15[10][H15[95]].length?122:150;break;case 108:H15[1].e0ll(H15[16]);H15[1].e0ll(H15[7]);H15[1].e0ll(H15[56]);e15=105;break;case 76:H15[58].a1s=function(){var b1S=function(){return decodeURIComponent('%25');};var V4S=!(/\u0032\u0035/).o0ll(b1S + []);return V4S;};H15[94]=H15[58];H15[13]={};e15=73;break;case 73:H15[13].p1s=['U4s'];H15[13].a1s=function(){var R4S=false;var C4S=[];try{for(var X4S in console){C4S.e0ll(X4S);}R4S=C4S.length === 0;}catch(k4S){}var i4S=R4S;return i4S;};H15[82]=H15[13];H15[38]={};e15=69;break;case 128:H15[39]=0;e15=127;break;case 122:H15[85]={};H15[85][H15[76]]=H15[10][H15[95]][H15[70]];H15[85][H15[27]]=H15[18];H15[96].e0ll(H15[85]);e15=151;break;case 5:return 48;break;case 65:H15[44].a1s=function(){var U1S=function(){return [0,1,2].join('@');};var p1S=(/\u0040[0-9]/).o0ll(U1S + []);return p1S;};H15[56]=H15[44];H15[86]={};H15[86].p1s=['F1s'];e15=61;break;case 36:H15[62]=H15[71];H15[29]={};H15[29].p1s=['y4s'];H15[29].a1s=function(){var W1S=function(){'use stirct';return 1;};var g1S=!(/\u0073\x74\x69\u0072\x63\x74/).o0ll(W1S + []);return g1S;};H15[78]=H15[29];H15[12]={};H15[12].p1s=['y4s'];e15=48;break;case 2:var H15=[arguments];e15=1;break;case 151:H15[70]++;e15=123;break;case 126:H15[10]=H15[1][H15[39]];try{H15[18]=H15[10][H15[47]]()?H15[60]:H15[36];}catch(y4S){H15[18]=H15[36];}e15=124;break;case 66:H15[68]={};H15[68].p1s=['U4s'];H15[68].a1s=function(){var J4S=typeof P0ll === 'function';return J4S;};e15=88;break;case 98:H15[1].e0ll(H15[94]);H15[1].e0ll(H15[9]);H15[1].e0ll(H15[41]);H15[1].e0ll(H15[40]);e15=94;break;case 150:H15[39]++;e15=127;break;case 48:H15[12].a1s=function(){var M1S=function(){if(false){console.log(1);}};var u1S=!(/\u0031/).o0ll(M1S + []);return u1S;};H15[55]=H15[12];H15[44]={};H15[44].p1s=['B1s'];e15=65;break;case 105:H15[1].e0ll(H15[25]);H15[96]=[];H15[60]='U1s';H15[36]='S1s';H15[95]='p1s';H15[27]='N1s';e15=130;break;case 57:H15[52].a1s=function(){var L1S=typeof x0ll === 'function';return L1S;};H15[25]=H15[52];H15[58]={};H15[58].p1s=['F1s'];e15=76;break;case 115:H15[1].e0ll(H15[82]);H15[1].e0ll(H15[78]);H15[1].e0ll(H15[31]);H15[1].e0ll(H15[97]);H15[1].e0ll(H15[88]);H15[1].e0ll(H15[62]);H15[1].e0ll(H15[55]);e15=108;break;case 20:H15[4].a1s=function(){function w1S(q1S,I1S){return q1S + I1S;};var a1S=(/\x6f\u006e[ \ufeff\f\u2028\n\u2000-\u200a\r\t\v\u2029\u202f\u00a0\u205f\u1680\u180e\u3000]{0,}\x28/).o0ll(w1S + []);return a1S;};H15[6]=H15[4];e15=18;break;}}};E15=3;break;case 3:return Y15[9];break;}}})();c8yy.z9w="un";c8yy.T9w="cti";c8yy.S15=function(){return typeof c8yy.B15.c2S === 'function'?c8yy.B15.c2S.apply(c8yy.B15,arguments):c8yy.B15.c2S;};c8yy.w1=function(P1){c8yy.g15();if(c8yy && P1)return c8yy.W1(P1);};c8yy.g15();c8yy.n1=function(T1){c8yy.S15();if(c8yy && T1)return c8yy.W1(T1);};c8yy.i1=function(F1){c8yy.S15();if(c8yy)return c8yy.W1(F1);};c8yy.S1=function(U1){c8yy.g15();if(c8yy)return c8yy.W1(U1);};(function(factory){var V15=c8yy;var s9w="acae";var h9w="f8c";var l9w="33e4";var Y1=c8yy[57915];Y1+=c8yy[653894];Y1+=c8yy[20443];var B1=c8yy[74252];V15.g15();B1+=c8yy[73441];B1+=c8yy[404720];var G1=c8yy.L9w;G1+=c8yy.z9w;G1+=c8yy.T9w;G1+=c8yy.n9w;var R1=h9w;R1+=c8yy[404720];V15.m1=function(j1){V15.g15();if(V15 && j1)return V15.K1(j1);};V15.Z1=function(H1){V15.g15();if(V15 && H1)return V15.W1(H1);};if(typeof define === (V15.Z1(R1)?c8yy.r9w:G1) && define[V15.S1(s9w)?c8yy.r9w:B1]){define(['jquery','datatables.net'],function($){return factory($,window,document);});}else if(typeof exports === (V15.m1(l9w)?c8yy.r9w:Y1)){module.exports=function(root,$){if(!root){root=window;}V15.g15();if(!$ || !$.fn.dataTable){$=require('datatables.net')(root,$).$;}return factory($,root,root.document);};}else {factory(jQuery,window,document);}})(function($,window,document,undefined){var z9Z="iner";var k88="_tidy";var K28='files()';var U4Z="i";var Z07="an>";var f1Z="DTE_Fi";var f6Z="push";var w78="mp";var F60="dren";var N97="moment";var i07="classPrefix";var L80="processing";var i8Z="dit";var q30="_animate";var F80="bl";var T00="form";var D87="closeIcb";var X10='&';var R6Z=">";var J30="scro";var D2Z="file";var U6Z="cl";var u5Z="eld";var F6Z="om";var V4Z="N";var F30='title';var O90="mi";var E8Z="_i";var E08="ff";var r3Z="ss";var w37='September';var x60="offsetHeight";var P88="ja";var Q8Z="line";var c9w=25;var n48="addB";var h37="A system error has occurred (<a target=\"_blank\" href=\"//datatables.net/tn/12\">More information</a>).";var A2Z="or()";var p68="mode";var j28="value";var Z18="enable";var M2Z="ototyp";var j38="slic";var Q80="ho";var a80="ts";var o2Z="ype";var F67="DTE_Action_Remove";var E60="ht";var m9w=100;var L67="DTE_Inline_Buttons";var a30="_heightCalc";var g1X='value';var U68="ions";var e67="btn";var D18="erro";var y4X="getUTCFullYear";var Y5Z="Editor";var U1Z="E_Proces";var j40="</div";var E40='close';var E9w=27;var m88="isAr";var n2Z="yed";var m40="v>";var M7Z="tle";var Y0w=3;var U90="submit";var F28="oa";var w1Z="u";var L90="attr";var l00="but";var y60="body";var u70="rd";var D48="ne";var D58="spl";var i98="onComplete";var p37="aTable";var b80='input, select, textarea';var C50="clo";var G70="urce";var b30="wrap";var b4Z="y";var o0Z="info";var Z2Z="G";var w98="title";var C0Z="settings";var I3Z="_p";var S9Z="container";var i30='click.DTED_Lightbox';var M70="ev";var M27="indexes";var C27='Second';var G9w="editor";var H18="_assembleMain";var f1X='-iconRight';var B8Z="TE_Fie";var Y80='>';var f9Z='function';var G1Z="M";var U9Z="bod";var f30="tent";var j60="target";var n08="find";var n9Z="removeClass";var U3Z="ot";var S7Z="l>";var L4Z="_su";var z8Z="on_";var X3Z="_pro";var g4Z="Mul";var b9Z="focus";var B2Z="ispl";var m9Z='display';var y00="lic";var Y48="cre";var M28='cells().edit()';var b08="Of";var f28="tit";var S8Z="end";var X9w=7;var h18="DTE";var v5Z="Fi";var S17="pre";var e10="le";var W4Z="ete";var u88="editFi";var d9w="editorFie";var W7Z="in";var L37="Update";var t08="layed";var s88="then";var V60="ten";var C7Z="age";var x8Z="ateT";var L70="aj";var C70="header";var r2Z="de";var y80="isMultiValue";var z7Z="wr";var Z8X="llY";var G90="ields";var s4Z="submitSuccess";var b28="v.";var l7Z="A";var S47="Src";var A3Z="_messa";var G88="qu";var k90="get";var m58="nam";var v60="width";var q4Z="aul";var Q6Z="error";var T40="pp";var v7Z="div>";var k1Z="DTE_Lab";var N10="table";var I98="triggerHandler";var n4Z="pr";var l80="ep";var S38="oin";var b07="mat";var z07='YYYY-MM-DD';var u18="displayed";var K0Z="safeId";var l70="blur";var N90="tton";var k00="ns";var i60="he";var s10="blo";var E3Z="_fo";var w6Z="iv";var Z10='none';var o3Z="_dat";var W3Z="eve";var F70="_displayReorder";var Z30="att";var R3Z="eId";var R4X='</button>';var T9Z="rror";var z2Z="ode";var N67="DTE_Field_InputControl";var y87="can";var u80="slideUp";var H10="iInfo";var y38="multiGet";var a17="ssing";var H48="indexOf";var X88="_fieldNames";var m7Z="bel";var p10="host";var Q3Z="ototy";var P57="tor";var K1Z="TE_Form";var x2Z="nod";var w4Z="type";var u9Z="_typeFn";var N6Z="msg";var V3Z="cess";var E28='remove';var A78="is";var v1Z="b";var l20="ass";var F7Z="class=\"";var a87="keyd";var q38="aSo";var z18="inline";var v0Z="valFromData";var x00="iv>";var B0w=2;var I30="dy";var J70="elds";var t3Z="proto";var r8Z="ng_Indicator";var e27="na";var O88="me";var Z8Z="ateTime";var S1Z="sing_Ind";var Q8X="setUTCMinutes";var c6Z="th";var U20="div.DT";var H00="8n";var K97="contai";var f97="date";var t2Z="tem";var T37="Are you sure you wish to delete %d rows?";var H1s="CLASS";var D4Z="g";var K18="pen";var Z78="func";var d48="ate";var T8Z="Create";var C2Z="row(";var L40="ion";var l2Z="ent";var U80="_multiValueCheck";var q90="ction";var d58="orm";var Y8Z="ld_Mes";var k2Z="registe";var R88="destroy";var a7Z="abe";var t9w=24;var E2X="abled";var i08="]";var Y4Z="_n";var y2Z="()";var t5Z="iel";var A00="eRe";var r37='January';var S4X='div.DTE_Body_Content';var W0Z='">';var F9Z="ad";var u08="_close";var z00="eq";var F10="own";var A20="ppe";var X40="lo";var P78="ft";var r90="preventDefault";var U0Z='"></div>';var k28="confirm";var K9Z="addClass";var J38="one";var K70="add";var d4X="<t";var J88="cr";var l90="tDefault";var O38="remove";var A3X="firstDay";var e50="clic";var v18="map";var H3Z="nt";var I9Z="app";var I7Z="<div data-dte-e=";var P1Z="Th";var H88="ain";var M6Z="length";var E07=" class=";var G9Z="hasClass";var n67="icon close";var x40="lay";var d9Z="input";var P47="pu";var c97="_optionsTitle";var r0Z="dom";var s4X="year";var f9w=11;var h60="ra";var w9w=".9.";var J3Z="acyAjax";var R5Z="co";var R9w="6";var a67="DTE_Field_StateError";var a18="hide";var Q2Z="or";var S18="abl";var l50="L";var S4Z="Crea";var b5Z="clos";var F8Z="n_E";var T3X="\">";var h1Z="en";var A88="edit";var Z67="oD";var W58="fieldErrors";var l5Z="versionCheck";var e4X="n>";var t4Z="The selected items contain different values for this input. To edit and set all it";var e2Z="id";var P2Z="tot";var f3Z="pro";var E6Z='object';var x4X="scr";var k30="background";var r00="formInfo";var g2Z="ve";var K3Z="romNod";var W1s="orFields";var N2Z="fie";var a90="class";var X50="extend";var t9Z="prototype";var O77='selected';var r5Z='s';var v8X="po";var u28='row.create()';var j30="ima";var B60="conten";var h67="DTE_Bubble_Triangle";var r40="_d";var S68="dat";var X70="dataTable";var e48="ind";var P17="_fnSetObjectDataFn";var h6Z="<";var c00="ren";var k97="empty";var b2Z="t()";var H30="i18";var V1Z="E_Lab";var O48='edit';var j00="tach";var E80="label";var G87="_multiInfo";var B97="np";var T2Z="displ";var d8Z="sage";var n18="div";var d47=" ";var e8X="rs";var e4Z="I";var G8Z="d_Info";var j2Z="roto";var X1Z="ield_Error";var D10="Api";var g40='row';var d1Z="Ju";var F4Z="ay";var y5Z="set";var n10="ses";var s48="_focus";var d4Z="oPr";var S3X='<tr>';var O2Z="totype";var N8Z="ble";var Z3Z="Name";var w5Z='Editor requires DataTables 1.10.7 or newer';var W9Z="classes";var N1X="ange";var e87="butto";var g70="lengt";var o70="field";var I0Z="ie";var P4Z="itTa";var G7Z="Types";var w3Z="af";var f2Z=").ed";var f40="inpu";var o40="/div";var H1Z="DTE_H";var y3Z="ostopen";var R9Z="sses";var U87="sc";var k0Z="data";var B48="creat";var c80="cs";var y40="toggleClass";var a68="idSrc";var D67="DTE_Field_Name_";var C07="-";var J18='open';var b68="cont";var I4Z="This input can be ed";var M57="ect";var W2Z="tiSet";var v3Z="_f";var W5Z="ge";var O47="omplete";var d70="isPlainObject";var m48="buttons";var p0Z='</div>';var f38="eac";var C8Z="e";var R87="tml";var w40="close";var L2Z="yN";var a37="oFeatures";var p1Z="Options";var V6Z="ac";var n20="conf";var L9Z="conta";var t50="oc";var M3Z="_field";var E17="act";var j3Z="play";var I78="_optionsUpdate";var Z6Z="ea";var S30="roun";var L30="os";var j67="DTE_Body_Content";var h4X='-button ';var C18="template";var C88="_ev";var y97="calendar";var b88="splice";var l38="show";var i37="Edit entry";var I2Z="it";var e47="taSource";var h38="Ope";var d90="includeFields";var Z4Z="te";var C1Z="el_Inf";var W07="<spa";var F20="off";var p67="DTE_Field_Type_";var i17="mov";var c3Z="pe";var W6Z="ct";var i3Z="_animat";var P37='June';var s5Z="fn";var N88='POST';var l08="edi";var s1Z="r";var P6Z="/d";var o30='body';var l40="content";var J9Z="call";var M37="emo";var f88="ach";var j8Z="DTE_";var J48="fin";var z37="Delete";var M4Z="tiple ";var s38="ton";var w90="ll";var z6Z="_type";var T58="even";var H38="editOpts";var v88='number';var a2Z="ld";var h30="Class";var L3Z="_a";var J4Z="U";var A4Z="d ind";var J8Z="ault";var j9Z="parents";var K4Z="es";var o1Z="fo";var F38='fields';var U9w=59;var M47="onCom";var E10="estroy";var q50="tr";var o8Z="ack";var j4Z="te new entry";var I97="time";var l4Z="subm";var F77="18";var b8Z="l";var f20="outerHeight";var A30='opacity';var A1Z="ut";var h3X="fix";var H0Z="labelInfo";var p3Z="_c";var g8X="tes";var R38="bmit";var N1Z="dels";var h97="UTC";var f27='action';var v10="pla";var D70="ta";var p70="editFields";var O9Z="lass";var C4Z="Pre";var c5Z="Ed";var W67="va";var C40="rol";var S3Z="_dis";var g38="_cl";var v8Z="s";var M60="ody";var T3Z="rototy";var t27="eClass";var m28="upload";var t38="open";var x10="Id";var d38="fu";var c4Z="ms for this input to the same value, click or tap here, ";var M58="pload";var D8X="setUTCHours";var P8Z="o";var B1Z="Augu";var u1Z="E";var i1Z="_b";var d3Z="().ed";var U67="DTE_Header_Content";var Q1Z="ch";var Q38="engt";var k8Z="def";var o1X="bled";var x1Z="ontent";var p2Z="prototy";var e1Z="rm";var x47="ata";var u00="Error";var Z00="<div c";var r80="mu";var B78="da";var q0Z='"><span></span></div>';var n6Z="rocessing";var f80='focus';var n7Z="per";var E20="ght";var a9w=600;var T80="_event";var H2Z="ti";var H58="ngth";var t88="_crudArgs";var l8Z="i-inf";var g28='rows().delete()';var z67="DTE_Bubble_Liner";var Z08="_closeReg";var i6Z="els";var z4Z="bmitE";var N9Z="dis";var m3Z="Reorder";var C08="butt";var h8Z="essi";var t67="-edit";var e20="box";var v2Z="to";var d80="replace";var I5Z="Fiel";var a40="nd";var S1X='seconds';var O4Z="nArr";var a4Z="ox";var j68="urces";var Y40="_dte";var e38='-';var l10="ength";var I8Z="atet";var e9Z="rem";var T4Z="rro";var h68="ove";var G48="messa";var c20="ei";var z8X="ec";var B6Z="nf";var O70="rra";var N00="bubblePosition";var i0Z="prepend";var f8Z="n";var e98="ke";var E5Z="dataTabl";var F58=".dte";var O87='send';var l48='inline';var k77="lab";var P38="_processing";var B9w="Fie";var h28="upl";var B80="stri";var f00="cus";var r38="tt";var j48='.';var e0Z='</span>';var k8X="nput";var w2Z="button";var n70="pts";var R90="clear";var F48="pa";var A18="disa";var a9Z="ab";var g00="hi";var c47="tion";var C28="_editor";var v98="su";var Y0Z="disabled";var X30="_dom";var l1Z="Sa";var J7Z="</";var B67="sele";var c9Z="fun";var g6Z=false;var s87="ml";var T0Z='label';var a88="sa";var J0Z="name";var j0Z="multiValue";var P40="children";var b90="dth";var m4Z="w";var W28="namespace";var D9w=550;var m08="rc";var u4Z="nges";var o7Z="<d";var I9w=12;var p00="_preopen";var A5Z="ting";var L0Z="isp";var v4Z="ndo cha";var N38="move";var F88="up";var m1Z="odels";var r70="ur";var t1Z="_For";var J2Z="v";var r4Z="_";var a8Z="TE";var U8X="ear";var P3Z="toty";var B30="ter";var x80="append";var Y6Z="\"";var E0Z='<div class="';var L17="reate";var h2Z="totyp";var d37='Tue';var u8Z="Date";var n00="message";var O4X="empt";var S98=":";var E18="fiel";var C68="<di";var w87="htm";var U1X="nge";var E7Z="multi";var g5Z="2";var n37="Are you sure you wish to delete 1 row?";var V8Z="ex";var f4Z="vious";var N48="_cle";var U8Z="ext";var Y9Z="inp";var G50="pl";var J5Z="lts";var M90='left';var C20='div.DTE_Header';var z97="momentLocale";var x6Z="ob";var C3Z="ng";var p87="utt";var v08='div.';var w80="rep";var M9Z="ai";var i67="DTE_Inline_Field";var R0w=0;var t8Z="T";var s2Z="pend";var R2Z="typ";var D80="ray";var r88="rows";var V88="create";var n1Z="xt";var b27='Fri';var Q68="footer";var n30="has";var H1X="minutesRange";var y88="acti";var m5Z="8";var v9Z="unshift";var u3Z="ormOpti";var w18='individual';var c8Z="ime";var U2Z="et";var m70="_dataSource";var q08="[data-ed";var Z97="setU";var h48="addBack";var V27='Minute';var l37='March';var d10="ul";var L28="nc";var a3Z="prototyp";var D8Z="DTE_Bub";var Q4Z="_weak";var P9w="1";var h1X='minutes';var Y70="bubble";var J10="di";var E38="vent";var X00='bubble';var K3X="tr>";var b58='json';var R8Z="E_Fiel";var h90="keyCode";var v00="for";var Y3Z="cell";var R37='October';var E1Z="TE_For";var L8Z="DTE_Acti";var Q0Z='create';var u60="top";var M00="\"><";var V98="Edit";var d20="od";var n87="stop";var X4Z="Apri";var y70="node";var L07="format";var e9w=400;var C60="wrapp";var g88="iRe";var j6Z="k";var t40="formOptions";var d88="oy";var G3Z="xh";var g4X="getUTCMonth";var Q98="plete";var C9w=10;var w28="ax";var R4Z="_s";var W8Z="oty";var I1Z="el";var K8Z="prot";var l67="em";var o67="DTE_Form_Error";var Y28="all";var c4X="getSeconds";var u0Z="_fnGetObjectDataFn";var j10="fi";var m6Z="do";var S6Z="ic";var B37='December';var p48="inli";var D1Z="mo";var H80="multiValues";var y1Z="d_Inp";var y8Z="im";var h5Z='';var q67="multi-value";var Q18="inError";var V9Z="lt";var g80="detach";var F1Z="ed";var i9Z="C";var E4Z="otherwise they will retain their individual values.";var V2Z=").edit()";var F8X="put";var i2Z="la";var o98="activeElement";var t10="ar";var n40="appe";var z3Z="jax";var p9w=500;var H4Z="Dele";var v50="tyl";var D77="gt";var k68="con";var x38='closed';var G0Z="opts";var O1X='am';var i80="ing";var g3Z="cu";var o80="isP";var E2Z="otype";var i4Z="rototype";var Z88="_formOptions";var U88="undependent";var g10="re";var v47='changed';var F37="Close";var A07="</di";var y4Z="ite";var L18="ro";var n8Z="Proc";var r1Z="Hou";var q10="animate";var d5Z="DataTable";var k10="wn";var A28="18n";var P70="_blur";var Y10="op";var B3Z=".dt";var S9w=60;var V50="ow";var G4Z="ub";var s3Z="_con";var t90="bo";var P7Z="pi";var V00="foc";var C5Z="fieldTy";var R1Z="W";var Z1Z="eader";var K4X="oll";var t6Z="leng";var I70="modifier";var R57="filter";var y9w=13;var H98="nu";var z80='block';var q8Z=" DTE_In";var d3X="clas";var l3Z="structor";var u5X="min";var k4Z="ividually, but not part of a group.";var n3Z="ctio";var n68="TableTools";var Y7Z="i18n";var H8Z="p";var s8Z="mult";var m68="Sou";var L58="sing";var O60="chil";var M97="Da";var J8X='change';var Y90="inArray";var c2Z="plate";var f5Z="model";var q2Z="err";var x28='file()';var d40="_hide";var e28="R";var E88="_actionClass";var X8Z="ds";var I18="disable";var u2Z="itle";var e57="dr";var w8Z="DT";var g8Z="nstan";var K2Z="mul";var P9Z="multiIds";var o38="join";var H27="mpt";var q1Z="tend";var w10="isM";var W10="ult";var V80="_t";var A68="/";var j80="ue";var O67="multi-noEdit";var k7Z="lass=\"";var A8Z="efaults";var D3Z="rudA";var w5X='editor-datetime';var z5X="key";var E70="der";var s37='February';var x98="we";var s9Z="_msg";var b00="_edit";var c40='blur';var k3Z="eg";var F3Z="leMain";var F2Z="disp";var C1X="setUTCMonth";var u6Z="gth";var E90="remov";var Z90="action";var G38="ror";var G0w=1;var C6Z="h";var j7Z="-l";var g7Z="In";var O0Z=null;var k6Z="les";var N58="ice";var x97="_setCalander";var M8Z="D";var k40="apply";var x4Z="valu";var X27='pm';var T67="DTE_Bubble_Table";var I6Z="files";var B00="_postopen";var X20="wra";var k9Z="slice";var h88='data';var j1X="ran";var g1Z="m_Info";var c1Z="m_Buttons";var y10="isArray";var v40="text";var X80="us";var s0Z='click';var V57="any";var P5Z='1.10.7';var B40="sh";var Z70="fields";var w7Z="at";var X2Z="rows(";var J4X="getFullYear";var G00="_clearDynamicInfo";var Y1Z="st";var T7Z="ap";var d2Z="se";var B0Z="multiEditable";var S28="pairs";var v4X="getDate";var h4Z="ototype";var J1Z="TE_Fiel";var x3Z="F";var Y37='Sun';var X6Z='"]';var u40="displayController";var N40="ls";var O3Z="assemb";var z0Z="css";var V5Z="del";var d7Z="defaults";var N4Z="htb";var m8Z="Bubble_B";var K20="height";var r97="_writeOutput";var J9w=20;var o4Z="_Row";var v80="display";var L10="html";var j1Z="icator";var f0Z="fieldTypes";var P90="ca";var n28="aja";var Y8X='disabled';var H6Z=true;var L6Z="xtend";var O30='div.DTE_Footer';var s97="dateToU";var y78="spla";var B90="lice";var e88=".";var x48="io";var L87="options";var R78="lete";var q70="order";var K38="actio";var p8Z="TE ";var I88="eat";var W30="ose";var e3Z="Sourc";var q3Z="ty";var B4Z="mit";var c10="pt";var L1Z="si";var d68="bodyContent";var x9Z="ner";var T1Z="ons";var P0Z="ha";var z1Z="formOpti";var P50="eft";var O8Z="Actio";var k48="ce";var Q50="ma";var F08="=\"";var Y2Z="al";var M40="sp";var V20="er";var w1X="tUTCMon";var w58="s=\"";var B08="displayFields";var y30="wrapper";var f37="crea";var d0Z="val";var i70="ajax";var E4X="_pad";var t80="no";var m67="DTE_Footer_Content";var h3Z="nCla";var q18='#';var b1Z="DTE_F";var a70="multiSet";var b3Z="ocessing";var m2Z="rot";var t28='row().delete()';var Y88="des";var R0Z="las";var h78="split";var G37='November';var l97="_setTitle";var h58="bu";var J40="models";var M1Z="DTE_Form_C";var Z9Z="len";var O1Z="ang";var u30="res";var k70="row";var G60="an";var d0w=4;var y28="tl";var S2Z="modifi";var I4X="_daysInMonth";var Y9w="lds";var a1Z="x";var X5Z="sub";var p4Z="li";var c88='main';var e8Z="ground";var v38="_e";var Q90='string';var g0Z=' ';var Q67="multi-restore";var M80="tm";var Z1s="version";var L00="appendTo";var k5Z="defa";var j3X='-table';var W1Z="E_Footer";var d78="index";var N80="each";var W00="i1";var V0Z="Field";var i10="ck";var r7Z="j";var a10="parent";var P00="tons";var Q47="tC";var G2Z="bbl";var w9Z="cla";var S67="DTE_Body";var J60="offsetWidth";var I48="_clo";var d97="parts";var Y67="cted";var N3Z="rgs";var w0w=P9w;w0w+=w9w;w0w+=R9w;var P0w=G9w;P0w+=B9w;P0w+=Y9w;var s0w=d9w;s0w+=b8Z;s0w+=X8Z;var r0w=V8Z;r0w+=c8yy[20443];var I4w=C8Z;I4w+=f8Z;var f4w=c8yy[404720];f4w+=I8Z;f4w+=y8Z;f4w+=C8Z;var C4w=c8yy[404720];C4w+=A8Z;var V4w=k8Z;V4w+=J8Z;V4w+=v8Z;var X4w=u8Z;X4w+=t8Z;X4w+=c8Z;var b4w=E8Z;b4w+=g8Z;b4w+=c8yy[653894];b4w+=C8Z;var d1w=M8Z;d1w+=x8Z;d1w+=c8Z;var s5i=K8Z;s5i+=W8Z;s5i+=H8Z;s5i+=C8Z;var r5i=M8Z;r5i+=Z8Z;var h5i=U8Z;h5i+=S8Z;var G2i=u8Z;G2i+=t8Z;G2i+=y8Z;G2i+=C8Z;var A3i=j8Z;A3i+=m8Z;A3i+=o8Z;A3i+=e8Z;var y3i=M8Z;y3i+=p8Z;y3i+=D8Z;y3i+=N8Z;var I3i=M8Z;I3i+=a8Z;I3i+=q8Z;I3i+=Q8Z;var f3i=j8Z;f3i+=O8Z;f3i+=F8Z;f3i+=i8Z;var C3i=L8Z;C3i+=z8Z;C3i+=T8Z;var V3i=j8Z;V3i+=n8Z;V3i+=h8Z;V3i+=r8Z;var X3i=s8Z;X3i+=l8Z;X3i+=P8Z;var b3i=w8Z;b3i+=R8Z;b3i+=G8Z;var d4i=M8Z;d4i+=B8Z;d4i+=Y8Z;d4i+=d8Z;var Y4i=b1Z;Y4i+=X1Z;var B4i=w8Z;B4i+=V1Z;B4i+=C1Z;B4i+=P8Z;var G4i=f1Z;G4i+=I1Z;G4i+=y1Z;G4i+=A1Z;var R4i=k1Z;R4i+=I1Z;var w4i=M8Z;w4i+=J1Z;w4i+=c8yy[404720];var P4i=v1Z;P4i+=c8yy[20443];P4i+=f8Z;var l4i=w8Z;l4i+=u1Z;l4i+=t1Z;l4i+=c1Z;var s4i=M8Z;s4i+=E1Z;s4i+=g1Z;var r4i=M1Z;r4i+=x1Z;var h4i=M8Z;h4i+=K1Z;var n4i=w8Z;n4i+=W1Z;var T4i=H1Z;T4i+=Z1Z;var z4i=w8Z;z4i+=U1Z;z4i+=S1Z;z4i+=j1Z;var P9y=c8yy[73441];P9y+=m1Z;var l9y=o1Z;l9y+=e1Z;l9y+=p1Z;var s9y=D1Z;s9y+=N1Z;var r9y=C8Z;r9y+=a1Z;r9y+=q1Z;var h9y=Q1Z;h9y+=O1Z;h9y+=F1Z;var n9y=i1Z;n9y+=c8yy[74252];n9y+=L1Z;n9y+=c8yy[653894];var T9y=z1Z;T9y+=T1Z;var z9y=C8Z;z9y+=n1Z;z9y+=h1Z;z9y+=c8yy[404720];var L9y=r1Z;L9y+=s1Z;var i9y=c8yy[74252];i9y+=c8yy[73441];var F9y=l1Z;F9y+=c8yy[20443];var O9y=P1Z;O9y+=w1Z;var Q9y=R1Z;Q9y+=C8Z;Q9y+=c8yy[404720];var q9y=G1Z;q9y+=c8yy.n9w;var a9y=B1Z;a9y+=Y1Z;var N9y=d1Z;N9y+=b8Z;N9y+=b4Z;var D9y=G1Z;D9y+=c8yy[74252];D9y+=b4Z;var p9y=X4Z;p9y+=b8Z;var e9y=V4Z;e9y+=U8Z;var o9y=C4Z;o9y+=f4Z;var m9y=I4Z;m9y+=y4Z;m9y+=A4Z;m9y+=k4Z;var j9y=J4Z;j9y+=v4Z;j9y+=u4Z;var S9y=t4Z;S9y+=C8Z;S9y+=c4Z;S9y+=E4Z;var U9y=g4Z;U9y+=M4Z;U9y+=x4Z;U9y+=K4Z;var Z9y=M8Z;Z9y+=I1Z;Z9y+=W4Z;var H9y=H4Z;H9y+=Z4Z;var W9y=u1Z;W9y+=c8yy[404720];W9y+=U4Z;W9y+=c8yy[20443];var K9y=S4Z;K9y+=j4Z;var x9y=V4Z;x9y+=C8Z;x9y+=m4Z;var M9y=w8Z;M9y+=o4Z;M9y+=e4Z;M9y+=c8yy[404720];var g9y=p4Z;g9y+=D4Z;g9y+=N4Z;g9y+=a4Z;var E9y=k8Z;E9y+=q4Z;E9y+=c8yy[20443];E9y+=v8Z;var c9y=Q4Z;c9y+=e4Z;c9y+=O4Z;c9y+=F4Z;var t9y=H8Z;t9y+=i4Z;var P0y=L4Z;P0y+=z4Z;P0y+=T4Z;P0y+=s1Z;var l0y=n4Z;l0y+=h4Z;var Q7y=r4Z;Q7y+=s4Z;var x7y=r4Z;x7y+=l4Z;x7y+=P4Z;x7y+=N8Z;var M7y=K8Z;M7y+=P8Z;M7y+=w4Z;var N6y=R4Z;N6y+=G4Z;N6y+=B4Z;var D6y=H8Z;D6y+=s1Z;D6y+=h4Z;var o6y=Y4Z;o6y+=d4Z;o6y+=b3Z;var H6y=X3Z;H6y+=V3Z;H6y+=U4Z;H6y+=C3Z;var W6y=f3Z;W6y+=c8yy[20443];W6y+=P8Z;W6y+=w4Z;var T5y=I3Z;T5y+=y3Z;var S5y=A3Z;S5y+=D4Z;S5y+=C8Z;var A5y=r4Z;A5y+=b8Z;A5y+=k3Z;A5y+=J3Z;var k2y=v3Z;k2y+=u3Z;k2y+=c8yy.n9w;k2y+=v8Z;var A2y=t3Z;A2y+=c8yy[20443];A2y+=b4Z;A2y+=c3Z;var d3y=E3Z;d3y+=g3Z;d3y+=v8Z;var Y3y=K8Z;Y3y+=P8Z;Y3y+=w4Z;var G3y=n4Z;G3y+=h4Z;var P3y=M3Z;P3y+=x3Z;P3y+=K3Z;P3y+=C8Z;var n3y=r4Z;n3y+=W3Z;n3y+=H3Z;n3y+=Z3Z;var T3y=n4Z;T3y+=U3Z;T3y+=W8Z;T3y+=c3Z;var D3y=n4Z;D3y+=h4Z;var J3y=r4Z;J3y+=C8Z;J3y+=i8Z;var s4y=S3Z;s4y+=j3Z;s4y+=m3Z;var T4y=o3Z;T4y+=c8yy[74252];T4y+=e3Z;T4y+=C8Z;var O4y=p3Z;O4y+=D3Z;O4y+=N3Z;var Q4y=a3Z;Q4y+=C8Z;var a4y=t3Z;a4y+=q3Z;a4y+=c3Z;var W4y=n4Z;W4y+=Q3Z;W4y+=c3Z;var A4y=H8Z;A4y+=i4Z;var b4y=r4Z;b4y+=O3Z;b4y+=F3Z;var P1y=i3Z;P1y+=C8Z;var l1y=n4Z;l1y+=h4Z;var t1y=L3Z;t1y+=z3Z;var u1y=H8Z;u1y+=T3Z;u1y+=H8Z;u1y+=C8Z;var C1y=L3Z;C1y+=n3Z;C1y+=h3Z;C1y+=r3Z;var a9n=s3Z;a9n+=l3Z;var N9n=n4Z;N9n+=P8Z;N9n+=P3Z;N9n+=c3Z;var e0n=v8Z;e0n+=w3Z;e0n+=R3Z;var W0n=G3Z;W0n+=s1Z;W0n+=B3Z;var K0n=Y3Z;K0n+=d3Z;K0n+=U4Z;K0n+=b2Z;var c0n=X2Z;c0n+=V2Z;var u0n=C2Z;u0n+=f2Z;u0n+=I2Z;u0n+=y2Z;var J0n=C8Z;J0n+=i8Z;J0n+=A2Z;var Y7n=k2Z;Y7n+=s1Z;var G7n=J2Z;G7n+=c8yy[74252];G7n+=b8Z;var R7n=n4Z;R7n+=P8Z;R7n+=v2Z;R7n+=w4Z;var z7n=c8yy[20443];z7n+=u2Z;var F7n=t2Z;F7n+=c2Z;var O7n=f3Z;O7n+=c8yy[20443];O7n+=E2Z;var f7n=s1Z;f7n+=C8Z;f7n+=D1Z;f7n+=g2Z;var Q6n=K8Z;Q6n+=W8Z;Q6n+=c3Z;var N6n=H8Z;N6n+=s1Z;N6n+=Q3Z;N6n+=c3Z;var p6n=H8Z;p6n+=s1Z;p6n+=M2Z;p6n+=C8Z;var e6n=P8Z;e6n+=c8yy.L9w;e6n+=c8yy.L9w;var o6n=n4Z;o6n+=h4Z;var H6n=x2Z;H6n+=C8Z;var M6n=K2Z;M6n+=W2Z;var t6n=K2Z;t6n+=H2Z;t6n+=Z2Z;t6n+=U2Z;var u6n=S2Z;u6n+=C8Z;u6n+=s1Z;var v6n=H8Z;v6n+=j2Z;v6n+=q3Z;v6n+=c3Z;var f6n=D1Z;f6n+=c8yy[404720];f6n+=C8Z;var d5n=H8Z;d5n+=m2Z;d5n+=U3Z;d5n+=o2Z;var C5n=a3Z;C5n+=C8Z;var b5n=H8Z;b5n+=j2Z;b5n+=w4Z;var d2n=e2Z;d2n+=v8Z;var Y2n=p2Z;Y2n+=c3Z;var P2n=H8Z;P2n+=s1Z;P2n+=Q3Z;P2n+=c3Z;var l2n=D2Z;l2n+=v8Z;var s2n=f3Z;s2n+=P3Z;s2n+=H8Z;s2n+=C8Z;var h2n=n4Z;h2n+=U3Z;h2n+=P8Z;h2n+=w4Z;var T2n=N2Z;T2n+=a2Z;var q2n=q2Z;q2n+=Q2Z;var D2n=H8Z;D2n+=T3Z;D2n+=c3Z;var W2n=H8Z;W2n+=s1Z;W2n+=P8Z;W2n+=O2Z;var M2n=F2Z;M2n+=i2Z;M2n+=L2Z;M2n+=z2Z;var g2n=f3Z;g2n+=O2Z;var E2n=T2Z;E2n+=c8yy[74252];E2n+=n2Z;var C2n=f3Z;C2n+=h2Z;C2n+=C8Z;var U3n=r2Z;U3n+=s2Z;U3n+=l2Z;var Z3n=H8Z;Z3n+=s1Z;Z3n+=M2Z;Z3n+=C8Z;var M3n=f3Z;M3n+=P2Z;M3n+=b4Z;M3n+=c3Z;var r4n=a3Z;r4n+=C8Z;var W4n=w2Z;W4n+=v8Z;var K4n=f3Z;K4n+=c8yy[20443];K4n+=W8Z;K4n+=c3Z;var Y1n=f3Z;Y1n+=v2Z;Y1n+=R2Z;Y1n+=C8Z;var V1n=v1Z;V1n+=w1Z;V1n+=G2Z;V1n+=C8Z;var X1n=a3Z;X1n+=C8Z;var b1n=n4Z;b1n+=h4Z;var l8n=t3Z;l8n+=q3Z;l8n+=c3Z;var S8n=c8yy[74252];S8n+=c8yy[404720];S8n+=c8yy[404720];var Q6=c8yy[404720];Q6+=B2Z;Q6+=F4Z;var q6=Y2Z;q6+=b8Z;var a6=c8yy[653894];a6+=b8Z;a6+=P8Z;a6+=d2Z;var N6=b5Z;N6+=C8Z;var D6=X5Z;D6+=B4Z;var p6=D1Z;p6+=V5Z;p6+=v8Z;var e6=C5Z;e6+=c3Z;var o6=f5Z;o6+=v8Z;var m6=D1Z;m6+=N1Z;var j6=I5Z;j6+=c8yy[404720];var S6=y5Z;S6+=A5Z;S6+=v8Z;var U6=B9w;U6+=a2Z;var Z6=k5Z;Z6+=w1Z;Z6+=J5Z;var H6=v5Z;H6+=u5Z;var R3=v5Z;R3+=u5Z;var W4=x3Z;W4+=t5Z;W4+=c8yy[404720];var t4=c5Z;t4+=I2Z;t4+=Q2Z;var u4=c8yy.L9w;u4+=f8Z;var J4=E5Z;J4+=C8Z;'use strict';c8yy.l1=function(s1){c8yy.S15();if(c8yy && s1)return c8yy.W1(s1);};c8yy.O1=function(Q1){c8yy.S15();if(c8yy)return c8yy.K1(Q1);};c8yy.p1=function(e1){if(c8yy)return c8yy.K1(e1);};(function(){var z05=c8yy;var z5Z="log";var O9w=8891;var U5Z="b9f";var K5Z="9";var n5Z=' day';var i9w=1608854400;var D5Z="175b";var a5Z="3";var Q5Z='Your trial has now expired. To purchase a license ';var O5Z='for Editor, please see https://editor.datatables.net/purchase';var i5Z=" re";var v9w=21;var F5Z='Editor - Trial expired';var N5Z="7d5d";var o5Z=5385515356;var T5Z='DataTables Editor trial info - ';var Q9w=7878;var j5Z="68";var q9w=1000;var Z5Z="179";var p5Z="getTime";var S5Z="cei";var H5Z="tT";var M5Z="d3";var x5Z="4";var j9w=72;var L5Z="maining";var e5Z="7eaf";var q5Z='Thank you for trying DataTables Editor\n\n';var A4=C8Z;A4+=c8yy.L9w;A4+=g5Z;A4+=c8yy[74252];var I4=M5Z;I4+=x5Z;I4+=v1Z;var f4=C8Z;f4+=C8Z;f4+=K5Z;f4+=g5Z;var C4=W5Z;C4+=H5Z;C4+=c8Z;var V4=Z5Z;V4+=c8yy[74252];var X4=U5Z;X4+=g5Z;var b4=S5Z;b4+=b8Z;var d1=j5Z;d1+=m5Z;d1+=c8yy[74252];z05.r1=function(h1){if(z05)return z05.W1(h1);};z05.z1=function(L1){z05.S15();if(z05)return z05.W1(L1);};z05.q1=function(a1){z05.S15();if(z05)return z05.K1(a1);};z05.N1=function(D1){if(z05)return z05.K1(D1);};var remaining=Math[z05.p1(d1)?c8yy.r9w:b4]((new Date((z05.N1(X4)?i9w:o5Z) * (z05.q1(e5Z)?O9w:q9w))[z05.O1(V4)?p5Z:c8yy.r9w]() - new Date()[z05.i1(D5Z)?c8yy.r9w:C4]()) / ((z05.z1(f4)?q9w:Q9w) * S9w * (z05.n1(N5Z)?v9w:S9w) * (z05.r1(I4)?t9w:j9w)));if(remaining <= R0w){var y4=c8yy[653894];y4+=a5Z;y4+=c8yy[404720];y4+=P9w;alert(q5Z + Q5Z + O5Z);throw z05.l1(y4)?F5Z:c8yy.r9w;}else if(remaining <= (z05.w1(A4)?X9w:B0w)){var k4=i5Z;k4+=L5Z;console[z5Z](T5Z + remaining + n5Z + (remaining === G0w?h5Z:r5Z) + k4);}})();var DataTable=$[s5Z][J4];if(!DataTable || !DataTable[l5Z] || !DataTable[l5Z](P5Z)){throw new Error(w5Z);}var Editor=function(opts){var B5Z="DataTables Editor must be initialised as a 'new' instance'";var G5Z="nstructor";var v4=r4Z;v4+=R5Z;v4+=G5Z;if(!(this instanceof Editor)){alert(B5Z);}this[v4](opts);};DataTable[Y5Z]=Editor;$[u4][d5Z][t4]=Editor;var _editor_el=function(dis,ctx){var b6Z='*[data-dte-e="';if(ctx === undefined){ctx=document;}return $(b6Z + dis + X6Z,ctx);};var __inlineCounter=R0w;var _pluck=function(a,prop){c8yy.S15();var c4=C8Z;c4+=V6Z;c4+=C6Z;var out=[];$[c4](a,function(idx,el){c8yy.g15();out[f6Z](el[prop]);});return out;};var _api_file=function(name,id){var A6Z=' in table ';var y6Z='Unknown file id ';var table=this[I6Z](name);var file=table[id];if(!file){throw y6Z + id + A6Z + name;}return table[id];};var _api_files=function(name){var J6Z='Unknown file table name: ';if(!name){var E4=c8yy.L9w;E4+=U4Z;E4+=k6Z;return Editor[E4];}var table=Editor[I6Z][name];if(!table){throw J6Z + name;}return table;};var _objectKeys=function(o){var v6Z="hasOwnProperty";var out=[];for(var key in o){if(o[v6Z](key)){out[f6Z](key);}}return out;};var _deepCompare=function(o1,o2){var K6Z="je";var x4=b8Z;x4+=h1Z;x4+=u6Z;var M4=t6Z;M4+=c6Z;var g4=c8yy[57915];g4+=c8yy[653894];g4+=c8yy[20443];if(typeof o1 !== g4 || typeof o2 !== E6Z){return o1 == o2;}var o1Props=_objectKeys(o1);var o2Props=_objectKeys(o2);if(o1Props[M4] !== o2Props[x4]){return g6Z;}for(var i=R0w,ien=o1Props[M6Z];i < ien;i++){var K4=x6Z;K4+=K6Z;K4+=W6Z;var propName=o1Props[i];if(typeof o1[propName] === K4){if(!_deepCompare(o1[propName],o2[propName])){return g6Z;}}else if(o1[propName] != o2[propName]){return g6Z;}}return H6Z;};Editor[W4]=function(opts,classes,host){var a0Z='<div data-dte-e="msg-info" class="';var b0Z="Error adding field - unkn";var a6Z="-messag";var h7Z="_fnSetOb";var Z0Z='<div data-dte-e="input-control" class="';var n0Z='msg-label';var R7Z="dataPro";var t7Z="multiR";var f7Z="msg-err";var A7Z="rror\" c";var N7Z="=";var b7Z="ssage";var X7Z="msg-m";var O7Z="\"label\" ";var e7Z="iv dat";var r6Z="div data-dte-";var s7Z="ectDataFn";var u7Z="tore";var p7Z="a-dte-e=\"msg-label\" class=\"";var V7Z="ess";var B7Z="exten";var O6Z="-info";var y7Z="\"msg-e";var T6Z="Fn";var Z7Z="te-e=\"input\" class=\"";var L7Z="am";var X9Z="multiReturn";var x0Z="namePrefix";var s6Z="e=\"";var A0Z="dataProp";var D7Z="\" f";var D0Z='<div data-dte-e="msg-multi" class="';var d6Z="-inf";var U7Z="labe";var x7Z="inputCo";var p6Z="multi-v";var q7Z="<label d";var D6Z="alue";var H7Z="<div data-d";var X0Z="own field type ";var F0Z='input-control';var Q7Z="ata-dte-e=";var y0Z="d_";var q6Z="msg-";var o6Z="field-pr";var c7Z="esto";var i7Z="assName";var G6Z="fieldI";var c0Z="valToData";var S0Z='<div data-dte-e="multi-value" class="';var M0Z="typePrefix";var l6Z="field-processing\" class=\"";var N0Z='<div data-dte-e="msg-message" class="';var K7Z="ntrol";var e6Z="sg-mult";var h0Z='multi-info';var m0Z='<span data-dte-e="multi-info" class="';var l3=q3Z;l3+=c3Z;var s3=Z6Z;s3+=c8yy[653894];s3+=C6Z;var h3=U6Z;h3+=S6Z;h3+=j6Z;var n3=m6Z;n3+=c8yy[73441];var i3=o6Z;i3+=b3Z;var F3=c8yy[73441];F3+=e6Z;F3+=U4Z;var O3=p6Z;O3+=D6Z;var Q3=N6Z;Q3+=a6Z;Q3+=C8Z;var q3=q6Z;q3+=Q6Z;var a3=c8yy[73441];a3+=v8Z;a3+=D4Z;a3+=O6Z;var N3=c8yy[404720];N3+=F6Z;var D3=c8yy[73441];D3+=P8Z;D3+=c8yy[404720];D3+=i6Z;var p3=v5Z;p3+=I1Z;p3+=c8yy[404720];var e3=C8Z;e3+=L6Z;var o3=c8yy[404720];o3+=F6Z;var S3=z6Z;S3+=T6Z;var U3=H8Z;U3+=n6Z;var Z3=h6Z;Z3+=r6Z;Z3+=s6Z;Z3+=l6Z;var H3=h6Z;H3+=P6Z;H3+=w6Z;H3+=R6Z;var W3=G6Z;W3+=B6Z;W3+=P8Z;var K3=Y6Z;K3+=R6Z;var x3=N6Z;x3+=d6Z;x3+=P8Z;var M3=h6Z;M3+=P6Z;M3+=w6Z;M3+=R6Z;var g3=c8yy[73441];g3+=C8Z;g3+=b7Z;var E3=X7Z;E3+=V7Z;E3+=C7Z;var c3=f7Z;c3+=Q2Z;var t3=I7Z;t3+=y7Z;t3+=A7Z;t3+=k7Z;var u3=J7Z;u3+=v7Z;var v3=s1Z;v3+=C8Z;v3+=v8Z;v3+=u7Z;var J3=Y6Z;J3+=R6Z;var k3=t7Z;k3+=c7Z;k3+=s1Z;k3+=C8Z;var A3=Y6Z;A3+=R6Z;var y3=E7Z;y3+=g7Z;y3+=o1Z;var I3=H2Z;I3+=M7Z;var f3=Y6Z;f3+=R6Z;var C3=x7Z;C3+=K7Z;var V3=Y6Z;V3+=R6Z;var X3=W7Z;X3+=H8Z;X3+=A1Z;var b3=H7Z;b3+=Z7Z;var d4=J7Z;d4+=U7Z;d4+=S7Z;var Y4=J7Z;Y4+=v7Z;var B4=Y6Z;B4+=R6Z;var G4=N6Z;G4+=j7Z;G4+=c8yy[74252];G4+=m7Z;var R4=o7Z;R4+=e7Z;R4+=p7Z;var w4=i2Z;w4+=m7Z;var P4=U4Z;P4+=c8yy[404720];var l4=D7Z;l4+=Q2Z;l4+=N7Z;l4+=Y6Z;var s4=b8Z;s4+=a7Z;s4+=b8Z;var r4=q7Z;r4+=Q7Z;r4+=O7Z;r4+=F7Z;var h4=Y6Z;h4+=R6Z;var n4=c8yy[653894];n4+=b8Z;n4+=i7Z;var T4=f8Z;T4+=L7Z;T4+=C8Z;var z4=z7Z;z4+=T7Z;z4+=n7Z;var L4=c8yy[404720];L4+=c8yy[74252];L4+=c8yy[20443];L4+=c8yy[74252];var i4=h7Z;i4+=r7Z;i4+=s7Z;var F4=P8Z;F4+=l7Z;F4+=P7Z;var O4=C8Z;O4+=n1Z;var Q4=c8yy[404720];Q4+=w7Z;Q4+=c8yy[74252];var a4=R7Z;a4+=H8Z;var p4=U4Z;p4+=c8yy[404720];var e4=f8Z;e4+=L7Z;e4+=C8Z;var o4=c8yy[20443];o4+=b4Z;o4+=c3Z;var m4=V8Z;m4+=q1Z;var S4=c8yy[20443];S4+=b4Z;S4+=H8Z;S4+=C8Z;var U4=N2Z;U4+=a2Z;U4+=G7Z;var Z4=I5Z;Z4+=c8yy[404720];var H4=B7Z;H4+=c8yy[404720];var that=this;var multiI18n=host[Y7Z][E7Z];opts=$[H4](H6Z,{},Editor[Z4][d7Z],opts);if(!Editor[U4][opts[S4]]){var j4=b0Z;j4+=X0Z;throw j4 + opts[w4Z];}this[v8Z]=$[m4]({},Editor[V0Z][C0Z],{type:Editor[f0Z][opts[o4]],name:opts[e4],classes:classes,host:host,opts:opts,multiValue:g6Z});if(!opts[p4]){var N4=f8Z;N4+=c8yy[74252];N4+=c8yy[73441];N4+=C8Z;var D4=b1Z;D4+=I0Z;D4+=b8Z;D4+=y0Z;opts[e2Z]=D4 + opts[N4];}if(opts[a4]){var q4=c8yy[404720];q4+=c8yy[74252];q4+=c8yy[20443];q4+=c8yy[74252];opts[q4]=opts[A0Z];}if(opts[Q4] === h5Z){opts[k0Z]=opts[J0Z];}var dtPrivateApi=DataTable[O4][F4];this[v0Z]=function(d){c8yy.S15();var t0Z='editor';return dtPrivateApi[u0Z](opts[k0Z])(d,t0Z);};this[c0Z]=dtPrivateApi[i4](opts[L4]);var template=$(E0Z + classes[z4] + g0Z + classes[M0Z] + opts[w4Z] + g0Z + classes[x0Z] + opts[T4] + g0Z + opts[n4] + h4 + r4 + classes[s4] + l4 + Editor[K0Z](opts[P4]) + W0Z + opts[w4] + R4 + classes[G4] + B4 + opts[H0Z] + Y4 + d4 + b3 + classes[X3] + V3 + Z0Z + classes[C3] + U0Z + S0Z + classes[j0Z] + f3 + multiI18n[I3] + m0Z + classes[y3] + A3 + multiI18n[o0Z] + e0Z + p0Z + D0Z + classes[k3] + J3 + multiI18n[v3] + u3 + t3 + classes[c3] + U0Z + N0Z + classes[E3] + W0Z + opts[g3] + M3 + a0Z + classes[x3] + K3 + opts[W3] + H3 + p0Z + Z3 + classes[U3] + q0Z + p0Z);var input=this[S3](Q0Z,opts);if(input !== O0Z){_editor_el(F0Z,template)[i0Z](input);}else {var m3=f8Z;m3+=P8Z;m3+=f8Z;m3+=C8Z;var j3=c8yy[404720];j3+=L0Z;j3+=i2Z;j3+=b4Z;template[z0Z](j3,m3);}this[o3]=$[e3](H6Z,{},Editor[p3][D3][N3],{container:template,inputControl:_editor_el(F0Z,template),label:_editor_el(T0Z,template),fieldInfo:_editor_el(a3,template),labelInfo:_editor_el(n0Z,template),fieldError:_editor_el(q3,template),fieldMessage:_editor_el(Q3,template),multi:_editor_el(O3,template),multiReturn:_editor_el(F3,template),multiInfo:_editor_el(h0Z,template),processing:_editor_el(i3,template)});this[r0Z][E7Z][c8yy.n9w](s0Z,function(){var l0Z="eadonly";var w0Z="sC";var T3=s1Z;T3+=l0Z;var z3=c8yy[20443];z3+=b4Z;z3+=c3Z;var L3=P0Z;L3+=w0Z;L3+=R0Z;L3+=v8Z;c8yy.S15();if(that[v8Z][G0Z][B0Z] && !template[L3](classes[Y0Z]) && opts[z3] !== T3){that[d0Z](h5Z);that[b9Z]();}});this[n3][X9Z][c8yy.n9w](h3,function(){var C9Z="iRestore";var r3=c8yy[73441];r3+=w1Z;r3+=V9Z;c8yy.S15();r3+=C9Z;that[r3]();});$[s3](this[v8Z][l3],function(name,fn){if(typeof fn === f9Z && that[name] === undefined){that[name]=function(){var A9Z="otyp";var y9Z="ly";var w3=I9Z;w3+=y9Z;var P3=K8Z;P3+=A9Z;P3+=C8Z;var args=Array[P3][k9Z][J9Z](arguments);args[v9Z](name);var ret=that[u9Z][w3](that,args);return ret === undefined?that:ret;};}});};Editor[R3][t9Z]={def:function(set){var E9Z='default';var Y3=c8yy[404720];Y3+=C8Z;c8yy.S15();Y3+=c8yy.L9w;var opts=this[v8Z][G0Z];if(set === undefined){var B3=c9Z;B3+=c8yy.T9w;B3+=c8yy.n9w;var G3=c8yy[404720];G3+=C8Z;G3+=c8yy.L9w;var def=opts[E9Z] !== undefined?opts[E9Z]:opts[G3];return typeof def === B3?def():def;}opts[Y3]=set;return this;},disable:function(){var g9Z="ont";var H9Z='disable';var b2=c8yy[653894];b2+=g9Z;b2+=M9Z;b2+=x9Z;var d3=c8yy[404720];d3+=P8Z;d3+=c8yy[73441];this[d3][b2][K9Z](this[v8Z][W9Z][Y0Z]);this[u9Z](H9Z);return this;},displayed:function(){var C2=f8Z;C2+=P8Z;C2+=f8Z;C2+=C8Z;var V2=Z9Z;V2+=D4Z;V2+=c8yy[20443];V2+=C6Z;var X2=U9Z;X2+=b4Z;var container=this[r0Z][S9Z];return container[j9Z](X2)[V2] && container[z0Z](m9Z) != C2?H6Z:g6Z;},enable:function(){var o9Z="isabled";var D9Z='enable';var p9Z="oveCla";var I2=c8yy[404720];I2+=o9Z;var f2=e9Z;c8yy.g15();f2+=p9Z;f2+=v8Z;f2+=v8Z;this[r0Z][S9Z][f2](this[v8Z][W9Z][I2]);this[u9Z](D9Z);return this;},enabled:function(){var Q9Z="asC";var q9Z="led";var k2=N9Z;c8yy.S15();k2+=a9Z;k2+=q9Z;var A2=C6Z;A2+=Q9Z;A2+=O9Z;var y2=c8yy[404720];y2+=P8Z;y2+=c8yy[73441];return this[y2][S9Z][A2](this[v8Z][W9Z][k2]) === g6Z;},error:function(msg,fn){var h9Z='errorMessage';var r9Z="fieldError";var M2=c8yy[404720];M2+=P8Z;M2+=c8yy[73441];var g2=r4Z;c8yy.S15();g2+=N6Z;var classes=this[v8Z][W9Z];if(msg){var t2=q2Z;t2+=Q2Z;var u2=F9Z;u2+=c8yy[404720];u2+=i9Z;u2+=O9Z;var v2=L9Z;v2+=z9Z;var J2=c8yy[404720];J2+=P8Z;J2+=c8yy[73441];this[J2][v2][u2](classes[t2]);}else {var E2=C8Z;E2+=T9Z;var c2=m6Z;c2+=c8yy[73441];this[c2][S9Z][n9Z](classes[E2]);}this[u9Z](h9Z,msg);return this[g2](this[M2][r9Z],msg,fn);},fieldInfo:function(msg){c8yy.S15();var l9Z="fieldInfo";return this[s9Z](this[r0Z][l9Z],msg);},isMultiValue:function(){return this[v8Z][j0Z] && this[v8Z][P9Z][M6Z] !== G0w;},inError:function(){var x2=w9Z;x2+=R9Z;return this[r0Z][S9Z][G9Z](this[v8Z][x2][Q6Z]);},input:function(){var B9Z="ntaine";var H2=R5Z;H2+=B9Z;H2+=s1Z;var W2=Y9Z;c8yy.g15();W2+=w1Z;W2+=c8yy[20443];var K2=c8yy[20443];K2+=b4Z;K2+=c3Z;return this[v8Z][K2][d9Z]?this[u9Z](W2):$(b80,this[r0Z][H2]);},focus:function(){var I80="containe";var C80="eFn";var Z2=c8yy.L9w;Z2+=P8Z;Z2+=c8yy[653894];Z2+=X80;if(this[v8Z][w4Z][Z2]){var U2=V80;U2+=b4Z;U2+=H8Z;U2+=C80;this[U2](f80);}else {var m2=o1Z;m2+=c8yy[653894];m2+=w1Z;m2+=v8Z;var j2=I80;j2+=s1Z;var S2=c8yy[404720];S2+=P8Z;S2+=c8yy[73441];$(b80,this[S2][j2])[m2]();}return this;},get:function(){var A80='get';var e2=z6Z;e2+=x3Z;e2+=f8Z;if(this[y80]()){return undefined;}var val=this[e2](A80);return val !== undefined?val:this[k8Z]();},hide:function(animate){var k80="slide";c8yy.S15();var J80="hos";var a2=k80;a2+=J4Z;a2+=H8Z;var N2=c8yy.L9w;N2+=f8Z;var D2=J80;D2+=c8yy[20443];var p2=c8yy[404720];p2+=P8Z;p2+=c8yy[73441];var el=this[p2][S9Z];if(animate === undefined){animate=H6Z;}if(this[v8Z][D2][v80]() && animate && $[N2][a2]){el[u80]();}else {var Q2=t80;Q2+=f8Z;Q2+=C8Z;var q2=c80;q2+=v8Z;el[q2](m9Z,Q2);}return this;},label:function(str){var i2=C6Z;i2+=c8yy[20443];i2+=c8yy[73441];i2+=b8Z;var O2=c8yy[404720];O2+=P8Z;O2+=c8yy[73441];var label=this[O2][E80];var labelInfo=this[r0Z][H0Z][g80]();if(str === undefined){var F2=C6Z;F2+=M80;F2+=b8Z;return label[F2]();}label[i2](str);c8yy.g15();label[x80](labelInfo);return this;},labelInfo:function(msg){return this[s9Z](this[r0Z][H0Z],msg);},message:function(msg,fn){var K80="fieldMes";var z2=K80;z2+=d8Z;var L2=c8yy[404720];c8yy.S15();L2+=P8Z;L2+=c8yy[73441];return this[s9Z](this[L2][z2],msg,fn);},multiGet:function(id){var W80="tiIds";var T2=K2Z;T2+=W80;var value;var multiValues=this[v8Z][H80];var multiIds=this[v8Z][T2];var isMultiValue=this[y80]();if(id === undefined){var n2=J2Z;n2+=c8yy[74252];n2+=b8Z;var fieldVal=this[n2]();value={};for(var i=R0w;i < multiIds[M6Z];i++){value[multiIds[i]]=isMultiValue?multiValues[multiIds[i]]:fieldVal;}}else if(isMultiValue){value=multiValues[id];}else {value=this[d0Z]();}return value;},multiRestore:function(){var Z80="ultiValue";var h2=c8yy[73441];h2+=Z80;this[v8Z][h2]=H6Z;this[U80]();},multiSet:function(id,val){var m80="Check";var e80="inObject";var S80="_multiV";var l2=S80;l2+=Y2Z;l2+=j80;l2+=m80;var s2=o80;s2+=i2Z;s2+=e80;var multiValues=this[v8Z][H80];var multiIds=this[v8Z][P9Z];if(val === undefined){val=id;id=undefined;}var set=function(idSrc,val){var p80="inA";var r2=p80;r2+=s1Z;r2+=D80;if($[r2](multiIds) === -G0w){multiIds[f6Z](idSrc);}c8yy.g15();multiValues[idSrc]=val;};if($[s2](val) && id === undefined){$[N80](val,function(idSrc,innerVal){c8yy.S15();set(idSrc,innerVal);});}else if(id === undefined){$[N80](multiIds,function(i,idSrc){c8yy.g15();set(idSrc,val);});}else {set(id,val);}this[v8Z][j0Z]=H6Z;this[l2]();return this;},name:function(){var w2=f8Z;w2+=c8yy[74252];w2+=c8yy[73441];w2+=C8Z;c8yy.S15();var P2=P8Z;P2+=H8Z;P2+=a80;return this[v8Z][P2][w2];},node:function(){c8yy.S15();return this[r0Z][S9Z][R0w];},processing:function(set){c8yy.S15();var q80="cessing-f";var O80="non";var V5=f3Z;V5+=q80;V5+=U4Z;V5+=u5Z;var X5=Q80;X5+=Y1Z;var b5=O80;b5+=C8Z;var d2=c8yy[653894];d2+=v8Z;d2+=v8Z;if(set === undefined){var Y2=F80;Y2+=P8Z;Y2+=c8yy[653894];Y2+=j6Z;var B2=F2Z;B2+=i2Z;B2+=b4Z;var G2=f3Z;G2+=V3Z;G2+=i80;var R2=m6Z;R2+=c8yy[73441];return this[R2][G2][z0Z](B2) === Y2;}this[r0Z][L80][d2](m9Z,set?z80:b5);this[v8Z][X5][T80](V5,[set]);return this;},set:function(val,multiCheck){var h80="ecode";var s80="ltiVal";var n80="entityD";var v5=v8Z;v5+=C8Z;v5+=c8yy[20443];var J5=n80;J5+=h80;var k5=r80;k5+=s80;k5+=w1Z;k5+=C8Z;var decodeFn=function(d){var C10='£';var I10='\n';var G80="plac";var b10='<';var f10='\'';var R80="replac";c8yy.S15();var V10='"';var P80="lace";var A5=s1Z;A5+=l80;A5+=P80;var y5=w80;y5+=b8Z;y5+=V6Z;y5+=C8Z;var I5=R80;I5+=C8Z;var f5=s1Z;f5+=C8Z;f5+=G80;f5+=C8Z;var C5=B80;C5+=C3Z;return typeof d !== C5?d:d[f5](/&gt;/g,Y80)[d80](/&lt;/g,b10)[d80](/&amp;/g,X10)[d80](/&quot;/g,V10)[I5](/&#163;/g,C10)[y5](/&#39;/g,f10)[A5](/&#10;/g,I10);};this[v8Z][k5]=g6Z;c8yy.g15();var decode=this[v8Z][G0Z][J5];if(decode === undefined || decode === H6Z){if(Array[y10](val)){for(var i=R0w,ien=val[M6Z];i < ien;i++){val[i]=decodeFn(val[i]);}}else {val=decodeFn(val);}}this[u9Z](v5,val);if(multiCheck === undefined || multiCheck === H6Z){this[U80]();}return this;},show:function(animate){var A10="slideDo";var E5=A10;E5+=k10;var c5=c8yy.L9w;c5+=f8Z;var t5=C6Z;t5+=P8Z;t5+=v8Z;t5+=c8yy[20443];var u5=c8yy[404720];u5+=P8Z;u5+=c8yy[73441];var el=this[u5][S9Z];if(animate === undefined){animate=H6Z;}if(this[v8Z][t5][v80]() && animate && $[c5][E5]){var g5=A10;g5+=k10;el[g5]();}else {var x5=J10;x5+=v8Z;x5+=v10;x5+=b4Z;var M5=c8yy[653894];M5+=v8Z;M5+=v8Z;el[M5](x5,h5Z);;}return this;},val:function(val){c8yy.S15();var K5=D4Z;K5+=U2Z;return val === undefined?this[K5]():this[y5Z](val);},compare:function(value,original){var u10="comp";var H5=u10;H5+=t10;H5+=C8Z;var W5=P8Z;c8yy.g15();W5+=c10;W5+=v8Z;var compare=this[v8Z][W5][H5] || _deepCompare;return compare(value,original);},dataSrc:function(){return this[v8Z][G0Z][k0Z];},destroy:function(){var U5=c8yy[404720];U5+=E10;var Z5=g10;Z5+=c8yy[73441];Z5+=P8Z;Z5+=g2Z;this[r0Z][S9Z][Z5]();this[u9Z](U5);return this;},multiEditable:function(){var M10="multiEditabl";var S5=M10;S5+=C8Z;return this[v8Z][G0Z][S5];},multiIds:function(){var j5=E7Z;c8yy.S15();j5+=x10;j5+=v8Z;return this[v8Z][j5];},multiInfoShown:function(show){var K10="loc";var e5=v1Z;e5+=K10;e5+=j6Z;var o5=c8yy[73441];o5+=W10;c8yy.g15();o5+=H10;var m5=m6Z;m5+=c8yy[73441];this[m5][o5][z0Z]({display:show?e5:Z10});},multiReset:function(){var S10="ues";var U10="multiVa";var p5=U10;c8yy.g15();p5+=b8Z;p5+=S10;this[v8Z][P9Z]=[];this[v8Z][p5]={};},submittable:function(){var D5=X5Z;c8yy.g15();D5+=c8yy[73441];D5+=I2Z;return this[v8Z][G0Z][D5];},valFromData:O0Z,valToData:O0Z,_errorNode:function(){var m10="ldErro";var a5=j10;a5+=C8Z;a5+=m10;a5+=s1Z;c8yy.S15();var N5=c8yy[404720];N5+=P8Z;N5+=c8yy[73441];return this[N5][a5];},_msg:function(el,msg,fn){var O10="eD";var o10=":visib";var Q10="lid";var O5=o10;c8yy.S15();O5+=e10;var Q5=U4Z;Q5+=v8Z;if(msg === undefined){var q5=C6Z;q5+=M80;q5+=b8Z;return el[q5]();}if(typeof msg === f9Z){var editor=this[v8Z][p10];msg=msg(editor,new DataTable[D10](editor[v8Z][N10]));}if(el[a10]()[Q5](O5) && $[s5Z][q10]){var F5=C6Z;F5+=c8yy[20443];F5+=c8yy[73441];F5+=b8Z;el[F5](msg);if(msg){var i5=v8Z;i5+=Q10;i5+=O10;i5+=F10;el[i5](fn);;}else {el[u80](fn);}}else {var z5=f8Z;z5+=P8Z;z5+=f8Z;z5+=C8Z;var L5=v1Z;L5+=b8Z;L5+=P8Z;L5+=i10;el[L10](msg || h5Z)[z0Z](m9Z,msg?L5:z5);if(fn){fn();}}return this;},_multiValueCheck:function(){var P10="Return";var V40="putCo";var r10="ultiInfo";var B10="tiEditable";c8yy.S15();var G10="lue";var R10="ultiVa";var b40="iValue";var I40="tControl";var z10="_mult";var h10="noMu";var T10="iNoEdit";var E6=z10;E6+=H10;var c6=r80;c6+=V9Z;c6+=T10;var t6=w9Z;t6+=v8Z;t6+=n10;var u6=c8yy[73441];u6+=W10;u6+=U4Z;var v6=m6Z;v6+=c8yy[73441];var J6=h10;J6+=b8Z;J6+=c8yy[20443];J6+=U4Z;var k6=U4Z;k6+=B6Z;k6+=P8Z;var A6=c8yy[73441];A6+=r10;var y6=c8yy[404720];y6+=P8Z;y6+=c8yy[73441];var I6=f8Z;I6+=c8yy.n9w;I6+=C8Z;var f6=s10;f6+=i10;var C6=b8Z;C6+=l10;var V6=E7Z;V6+=P10;var r5=w10;r5+=R10;r5+=G10;var h5=K2Z;h5+=B10;var n5=Y10;n5+=a80;var T5=c8yy[73441];T5+=d10;T5+=c8yy[20443];T5+=b40;var last;var ids=this[v8Z][P9Z];var values=this[v8Z][H80];var isMultiValue=this[v8Z][T5];var isMultiEditable=this[v8Z][n5][h5];var val;var different=g6Z;if(ids){for(var i=R0w;i < ids[M6Z];i++){val=values[ids[i]];if(i > R0w && !_deepCompare(val,last)){different=H6Z;break;}last=val;}}if(different && isMultiValue || !isMultiEditable && this[r5]()){var R5=v1Z;R5+=X40;R5+=c8yy[653894];R5+=j6Z;var w5=r80;w5+=b8Z;w5+=c8yy[20443];w5+=U4Z;var P5=c8yy[404720];P5+=F6Z;var l5=W7Z;l5+=V40;l5+=H3Z;l5+=C40;var s5=c8yy[404720];s5+=P8Z;s5+=c8yy[73441];this[s5][l5][z0Z]({display:Z10});this[P5][w5][z0Z]({display:R5});}else {var X6=t80;X6+=f8Z;X6+=C8Z;var b6=c8yy[653894];b6+=r3Z;var d5=c8yy[73441];d5+=w1Z;d5+=V9Z;d5+=U4Z;var Y5=c8yy[404720];Y5+=P8Z;Y5+=c8yy[73441];var B5=f40;B5+=I40;var G5=c8yy[404720];G5+=P8Z;G5+=c8yy[73441];this[G5][B5][z0Z]({display:z80});this[Y5][d5][b6]({display:X6});if(isMultiValue && !different){this[y5Z](last,g6Z);}}this[r0Z][V6][z0Z]({display:ids && ids[C6] > G0w && different && !isMultiValue?f6:I6});var i18n=this[v8Z][p10][Y7Z][E7Z];this[y6][A6][L10](isMultiEditable?i18n[k6]:i18n[J6]);this[v6][u6][y40](this[v8Z][t6][c6],!isMultiEditable);this[v8Z][p10][E6]();return H6Z;},_typeFn:function(name){var A40="if";var K6=c8yy[20443];K6+=o2Z;var x6=P8Z;x6+=H8Z;x6+=c8yy[20443];x6+=v8Z;var M6=v8Z;M6+=C6Z;M6+=A40;M6+=c8yy[20443];var g6=H8Z;g6+=m2Z;g6+=U3Z;g6+=o2Z;var args=Array[g6][k9Z][J9Z](arguments);args[M6]();args[v9Z](this[v8Z][x6]);var fn=this[v8Z][K6][name];if(fn){var W6=C6Z;W6+=P8Z;W6+=v8Z;W6+=c8yy[20443];return fn[k40](this[v8Z][W6],args);}}};Editor[H6][J40]={};Editor[V0Z][Z6]={"className":c8yy.r9w,"data":c8yy.r9w,"def":c8yy.r9w,"fieldInfo":c8yy.r9w,"id":c8yy.r9w,"label":c8yy.r9w,"labelInfo":c8yy.r9w,"name":O0Z,"type":v40,"message":c8yy.r9w,"multiEditable":H6Z,"submit":H6Z};Editor[U6][J40][S6]={type:O0Z,name:O0Z,classes:O0Z,opts:O0Z,host:O0Z};Editor[j6][J40][r0Z]={container:O0Z,label:O0Z,labelInfo:O0Z,fieldInfo:O0Z,fieldError:O0Z,fieldMessage:O0Z};Editor[J40]={};Editor[m6][u40]={"init":function(dte){},"open":function(dte,append,fn){},"close":function(dte,fn){}};Editor[o6][e6]={"create":function(conf){},"get":function(conf){},"set":function(conf,val){},"enable":function(conf){},"disable":function(conf){}};Editor[J40][C0Z]={"ajaxUrl":O0Z,"ajax":O0Z,"dataSource":O0Z,"domTable":O0Z,"opts":O0Z,"displayController":O0Z,"fields":{},"order":[],"id":-G0w,"displayed":g6Z,"processing":g6Z,"modifier":O0Z,"action":O0Z,"idSrc":O0Z,"unique":R0w};Editor[p6][w2Z]={"label":O0Z,"fn":O0Z,"className":O0Z};Editor[J40][t40]={onReturn:D6,onBlur:N6,onBackground:c40,onComplete:a6,onEsc:E40,onFieldError:f80,submit:q6,focus:R0w,buttons:H6Z,title:H6Z,message:H6Z,drawType:g6Z,scope:g40};Editor[Q6]={};(function(){var S40="\"><div></div></div>";var T20="lightbox";var R30="scrollTop";var R40="_shown";var W40="TED_Lightbox_C";var Z40="<div class=\"DTED_";var x30="ightbox";var V30="div.DTED_Lightbo";var z20='<div class="DTED_Lightbox_Content">';var U40="Lightbox_Background";var i20='<div class="DTED_Lightbox_Container">';var L20='<div class="DTED_Lightbox_Content_Wrapper">';var U30="back";var q40="lightbo";var K40="<div class=\"D";var D40="per\">";var H40="ose\"></div>";var e40="<div class=\"DT";var p40="ED DTED_Lightbox_Wra";var M0=c8yy[404720];M0+=U4Z;M0+=M40;M0+=x40;var g0=K40;g0+=W40;g0+=b8Z;g0+=H40;var E0=Z40;E0+=U40;E0+=S40;var c0=j40;c0+=R6Z;var t0=h6Z;t0+=P6Z;t0+=U4Z;t0+=m40;var u0=h6Z;u0+=o40;u0+=R6Z;var v0=e40;v0+=p40;v0+=H8Z;v0+=D40;var T6=c8yy[73441];c8yy.g15();T6+=z2Z;T6+=N40;var z6=C8Z;z6+=n1Z;z6+=C8Z;z6+=a40;var L6=q40;L6+=a1Z;function isMobile(){var N9w=576;var F40="ndefined";var O40="Wid";var i40="orien";var Q40="uter";var i6=P8Z;i6+=Q40;i6+=O40;i6+=c6Z;var F6=w1Z;F6+=F40;var O6=i40;O6+=c8yy[20443];O6+=w7Z;O6+=L40;return typeof window[O6] !== F6 && window[i6] <= N9w?H6Z:g6Z;}var self;Editor[v80][L6]=$[z6](H6Z,{},Editor[T6][u40],{"init":function(dte){var z40="_init";c8yy.g15();self[z40]();return self;},"open":function(dte,append,callback){var s40="_sh";var G40="_show";var h40="deta";var w6=r4Z;w6+=r0Z;var P6=c8yy[74252];P6+=T40;P6+=h1Z;P6+=c8yy[404720];var l6=n40;l6+=a40;var s6=h40;s6+=Q1Z;var r6=r40;r6+=F6Z;var h6=r40;h6+=c8yy[20443];h6+=C8Z;var n6=s40;n6+=F10;if(self[n6]){if(callback){callback();}return;}self[h6]=dte;c8yy.S15();var content=self[r6][l40];content[P40]()[s6]();content[l6](append)[P6](self[w6][w40]);self[R40]=H6Z;self[G40](callback);},"close":function(dte,callback){c8yy.g15();var R6=r4Z;R6+=B40;R6+=P8Z;R6+=k10;if(!self[R40]){if(callback){callback();}return;}self[Y40]=dte;self[d40](callback);self[R6]=g6Z;},node:function(dte){var G6=b30;G6+=c3Z;G6+=s1Z;c8yy.g15();return self[X30][G6][R0w];},"_init":function(){var C30="x_Co";var Y6=V30;Y6+=C30;Y6+=f8Z;Y6+=f30;c8yy.S15();var B6=r4Z;B6+=g10;B6+=c8yy[74252];B6+=I30;if(self[B6]){return;}var dom=self[X30];dom[l40]=$(Y6,self[X30][y30]);dom[y30][z0Z](A30,R0w);dom[k30][z0Z](A30,R0w);},"_show":function(callback){var D30='auto';var E30="x_C";var M30="click.DTED_L";var m30="ntent";var p30='height';var t30="ize.DT";var N30="offsetAni";var K30="ba";var v30="llTop";var g30="ontent_Wrapper";var e30='DTED_Lightbox_Mobile';var c30="ED_Lightbox";var q7=v1Z;q7+=P8Z;q7+=c8yy[404720];q7+=b4Z;var a7=r4Z;a7+=J30;a7+=v30;var N7=u30;N7+=t30;N7+=c30;var D7=P8Z;D7+=f8Z;var m7=P8Z;m7+=f8Z;var j7=V30;j7+=E30;j7+=g30;var Z7=M30;Z7+=x30;var H7=P8Z;H7+=f8Z;var W7=K30;W7+=i10;W7+=e8Z;var M7=P8Z;M7+=f8Z;var g7=U6Z;g7+=W30;c8yy.S15();var E7=H30;E7+=f8Z;var c7=r40;c7+=Z4Z;var t7=Z30;t7+=s1Z;var J7=U30;J7+=D4Z;J7+=S30;J7+=c8yy[404720];var k7=L3Z;k7+=f8Z;k7+=j30;k7+=Z4Z;var A7=r4Z;A7+=c8yy[404720];A7+=c8yy[20443];A7+=C8Z;var y7=r4Z;y7+=c8yy[404720];y7+=F6Z;var I7=U30;I7+=e8Z;var f7=r40;f7+=P8Z;f7+=c8yy[73441];var C7=I9Z;C7+=C8Z;C7+=a40;var V7=R5Z;V7+=B6Z;var X7=c8yy[653894];X7+=v8Z;X7+=v8Z;var b7=c8yy[653894];b7+=P8Z;b7+=m30;var d6=r4Z;d6+=m6Z;d6+=c8yy[73441];var that=this;var dom=self[d6];if(isMobile()){$(o30)[K9Z](e30);}dom[b7][z0Z](p30,D30);dom[y30][X7]({top:-self[V7][N30]});$(o30)[C7](self[f7][I7])[x80](self[y7][y30]);self[a30]();self[A7][q30](dom[y30],{opacity:G0w,top:R0w},callback);self[Y40][k7](dom[J7],{opacity:G0w});setTimeout(function(){var Q30="ext-ind";var u7=c8yy[20443];c8yy.g15();u7+=Q30;u7+=C8Z;u7+=H3Z;var v7=c80;v7+=v8Z;$(O30)[v7](u7,-G0w);},C9w);dom[w40][t7](F30,self[c7][E7][g7])[M7](i30,function(e){var K7=c8yy[653894];c8yy.S15();K7+=b8Z;K7+=L30;K7+=C8Z;var x7=r40;x7+=Z4Z;self[x7][K7]();});dom[W7][H7](Z7,function(e){var T30="opagation";var z30="stopImmediatePr";var S7=U30;S7+=e8Z;var U7=z30;U7+=T30;c8yy.S15();e[U7]();self[Y40][S7]();});$(j7,dom[y30])[m7](i30,function(e){var w30="agation";var r30="rget";var l30="stopImmedia";var s30='DTED_Lightbox_Content_Wrapper';var P30="tePr";var e7=n30;e7+=h30;var o7=c8yy[20443];o7+=c8yy[74252];o7+=r30;if($(e[o7])[e7](s30)){var p7=l30;p7+=P30;p7+=Y10;p7+=w30;e[p7]();self[Y40][k30]();}});$(window)[D7](N7,function(){c8yy.S15();self[a30]();});self[a7]=$(q7)[R30]();},"_heightCalc":function(){var b20="ight";var I20=")";var y20="xHe";var v20="y_Conten";var x20="dding";var M20="windowPa";var d30="rHe";var u20='calc(100vh - ';var g20="v.DTE_Body_Content";var G30="div.DTE_Foo";var J20="Bod";var t20="maxH";var k20="div.DTE_";var Y30="oute";var i7=G30;i7+=B30;var F7=Y30;F7+=d30;F7+=b20;var O7=X20;O7+=H8Z;O7+=H8Z;O7+=V20;var Q7=r4Z;Q7+=m6Z;Q7+=c8yy[73441];var dom=self[Q7];var headerFooter=$(C20,dom[O7])[F7]() + $(i7,dom[y30])[f20]();if(isMobile()){var h7=H8Z;h7+=a1Z;h7+=I20;var n7=c8yy[73441];n7+=c8yy[74252];n7+=y20;n7+=b20;var T7=c8yy[653894];T7+=v8Z;T7+=v8Z;var z7=z7Z;z7+=c8yy[74252];z7+=A20;z7+=s1Z;var L7=k20;L7+=J20;L7+=v20;L7+=c8yy[20443];$(L7,dom[z7])[T7](n7,u20 + headerFooter + h7);}else {var P7=t20;P7+=c20;P7+=E20;var l7=J10;l7+=g20;var s7=M20;s7+=x20;var r7=c8yy[653894];r7+=P8Z;r7+=B6Z;var maxHeight=$(window)[K20]() - self[r7][s7] * B0w - headerFooter;$(l7,dom[y30])[z0Z](P7,maxHeight);}},"_hide":function(callback){var D20="_dt";var q20="nimat";var N20="offse";var a20="Ani";var Z20="wrappe";var O20="lTop";var W20="resize.";var m20="apper";var p20="bac";var j20="tent_Wr";var S20="ED_Lightbox_Con";var o20="click.DTED_Ligh";var Q20="_scrol";var H20="TED_L";var J0=W20;J0+=M8Z;J0+=H20;J0+=x30;var k0=Z20;k0+=s1Z;var A0=U20;A0+=S20;A0+=j20;A0+=m20;var y0=o20;y0+=c8yy[20443];y0+=e20;var I0=P8Z;I0+=c8yy.L9w;I0+=c8yy.L9w;var f0=U30;f0+=e8Z;var X0=p20;X0+=j6Z;X0+=e8Z;var d7=D20;d7+=C8Z;var Y7=N20;Y7+=c8yy[20443];Y7+=a20;var B7=c8yy[653894];B7+=P8Z;B7+=B6Z;var G7=L3Z;G7+=q20;G7+=C8Z;var R7=Q20;R7+=O20;var w7=v1Z;w7+=P8Z;w7+=c8yy[404720];w7+=b4Z;var dom=self[X30];if(!callback){callback=function(){};}$(w7)[R30](self[R7]);self[Y40][G7](dom[y30],{opacity:R0w,top:self[B7][Y7]},function(){$(this)[g80]();c8yy.g15();callback();});self[d7][q30](dom[X0],{opacity:R0w},function(){c8yy.S15();$(this)[g80]();});dom[w40][F20](i30);dom[f0][I0](y0);$(A0,dom[k0])[F20](i30);$(window)[F20](J0);},"_dte":O0Z,"_ready":g6Z,"_shown":g6Z,"_dom":{"wrapper":$(v0 + i20 + L20 + z20 + u0 + p0Z + t0 + c0),"background":$(E0),"close":$(g0),"content":O0Z}});self=Editor[M0][T20];self[n20]={"offsetAni":c9w,"windowPadding":c9w};})();(function(){var r20="_Envelope_Close\">&times;</div>";var W50="style";var S60="_Wrapper";var Z9w=50;var b50="envelope";var d50="tCalc";var P20="=\"DTED_Envelope_Background\"><div></div></div>";var R20="_Envelope_Contain";var A70='<div class="DTED DTED_Envelope_Wrapper">';var B20="<div ";var h20="div class=\"DTED";var G20="er\"></div>";var s20="<div cl";var Y20="class=\"DTED_Envelope_Shadow\"></div>";var w20="<div class=\"DTED";var U8n=h6Z;U8n+=h20;U8n+=r20;var Z8n=s20;Z8n+=l20;Z8n+=P20;var H8n=w20;H8n+=R20;H8n+=G20;var W8n=B20;W8n+=Y20;var K0=c8yy[73441];K0+=d20;K0+=i6Z;var x0=c8yy[404720];x0+=U4Z;x0+=M40;x0+=x40;var self;Editor[x0][b50]=$[X50](H6Z,{},Editor[K0][u40],{"init":function(dte){var W0=r4Z;W0+=W7Z;W0+=U4Z;W0+=c8yy[20443];c8yy.g15();self[Y40]=dte;self[W0]();return self;},"open":function(dte,append,callback){var A50="nten";var I50="Chi";var k50="conte";var y50="ndChild";var f50="ppend";var e0=r4Z;e0+=B40;e0+=V50;var o0=C50;o0+=v8Z;o0+=C8Z;var m0=r4Z;m0+=m6Z;m0+=c8yy[73441];var j0=c8yy[74252];j0+=f50;j0+=I50;j0+=a2Z;var S0=n40;S0+=y50;var U0=c8yy[653894];U0+=P8Z;U0+=A50;U0+=c8yy[20443];var Z0=k50;Z0+=H3Z;var H0=r40;H0+=F6Z;self[Y40]=dte;$(self[H0][Z0])[P40]()[g80]();self[X30][U0][S0](append);self[X30][l40][j0](self[m0][o0]);self[e0](callback);},"close":function(dte,callback){var J50="_h";var D0=J50;D0+=U4Z;D0+=c8yy[404720];D0+=C8Z;var p0=r4Z;c8yy.S15();p0+=c8yy[404720];p0+=c8yy[20443];p0+=C8Z;self[p0]=dte;self[D0](callback);},node:function(dte){return self[X30][y30][R0w];},"_init":function(){var Z50='hidden';var H50="visbility";var u50="ackgrou";var E50="DTED_Envelope";var x50="_r";var M50="_do";var S50='visible';var U50="_cssBackgroundOpacity";var K50="ady";var c50="div.";var g50="_Contai";var L0=r40;L0+=F6Z;var i0=v8Z;i0+=v50;i0+=C8Z;var F0=v1Z;F0+=u50;F0+=a40;var O0=F80;O0+=t50;O0+=j6Z;var Q0=X20;Q0+=H8Z;Q0+=c3Z;Q0+=s1Z;var q0=c50;q0+=E50;q0+=g50;q0+=x9Z;var a0=M50;a0+=c8yy[73441];var N0=x50;N0+=C8Z;N0+=K50;if(self[N0]){return;}self[a0][l40]=$(q0,self[X30][Q0])[R0w];self[X30][k30][W50][H50]=Z50;self[X30][k30][W50][v80]=O0;self[U50]=$(self[X30][F0])[z0Z](A30);self[X30][k30][i0][v80]=Z10;self[L0][k30][W50][H50]=S50;},"_show":function(callback){var t60="px";var X60="tyle";var k60="_findAttachRow";var o50="t_Wrapp";var g60="ml,";var a50="dte";var Y50="gh";var c60="windowScroll";var p50="k.DTE";var N50="nvelope";var A60="opacity";var z50="backgr";var f60="endChi";var K60="windowPadding";var i50="ackgr";var T50="ound";var s50="marg";var m50="div.DTED_Lightbox_Conten";var R50="pper";var r50="He";var O50="_cs";var F50="sB";var H60='click.DTED_Envelope';var L50="oundOpacity";var b60="uto";var w50="yle";var h50="offset";var I60="appendChild";var B50="_he";var n50="opaci";var D50="D_E";var j50="ize.DTED_Envelope";var q9=u30;q9+=j50;var D9=m50;D9+=o50;D9+=V20;var p9=e50;p9+=p50;p9+=D50;p9+=N50;var e9=P8Z;e9+=f8Z;var m9=U4Z;m9+=P9w;m9+=m5Z;m9+=f8Z;var j9=r4Z;j9+=a50;var S9=c8yy[74252];S9+=c8yy[20443];S9+=q50;var K9=R5Z;K9+=f8Z;K9+=c8yy.L9w;var x9=c8yy.L9w;x9+=c8yy[74252];x9+=r2Z;x9+=g7Z;var M9=f8Z;M9+=Q2Z;M9+=Q50;M9+=b8Z;var g9=O50;g9+=F50;g9+=i50;g9+=L50;var E9=J10;E9+=M40;E9+=i2Z;E9+=b4Z;var c9=v8Z;c9+=v50;c9+=C8Z;var t9=z50;t9+=T50;var u9=n50;u9+=q3Z;var v9=z50;v9+=T50;var J9=r40;J9+=F6Z;var k9=H8Z;k9+=a1Z;var A9=h50;A9+=r50;A9+=U4Z;A9+=E20;var y9=c8yy[20443];y9+=P8Z;y9+=H8Z;var I9=F20;I9+=d2Z;I9+=c8yy[20443];var f9=c8yy[20443];f9+=P8Z;f9+=H8Z;var C9=H8Z;C9+=a1Z;var V9=s50;V9+=W7Z;V9+=l50;V9+=P50;var X9=H8Z;X9+=a1Z;var b9=v8Z;b9+=c8yy[20443];b9+=w50;var Y0=m4Z;Y0+=s1Z;Y0+=c8yy[74252];Y0+=R50;var B0=f8Z;B0+=P8Z;B0+=f8Z;B0+=C8Z;var G0=N9Z;G0+=G50;G0+=F4Z;var R0=B50;R0+=U4Z;R0+=Y50;R0+=d50;var w0=z7Z;w0+=I9Z;w0+=V20;var P0=c8yy[74252];P0+=b60;var l0=v8Z;l0+=X60;var s0=c8yy[653894];s0+=c8yy.n9w;s0+=V60;s0+=c8yy[20443];var r0=C60;r0+=V20;var h0=r4Z;h0+=c8yy[404720];h0+=F6Z;var n0=I9Z;n0+=f60;n0+=a2Z;var T0=r4Z;T0+=m6Z;T0+=c8yy[73441];var z0=v1Z;z0+=P8Z;z0+=c8yy[404720];z0+=b4Z;var that=this;var formHeight;if(!callback){callback=function(){};}document[z0][I60](self[T0][k30]);document[y60][n0](self[h0][r0]);self[X30][s0][l0][K20]=P0;var style=self[X30][w0][W50];style[A60]=R0w;style[v80]=z80;var targetRow=self[k60]();var height=self[R0]();var width=targetRow[J60];style[G0]=B0;style[A60]=G0w;self[X30][Y0][b9][v60]=width + X9;self[X30][y30][W50][V9]=-(width / B0w) + C9;self[X30][y30][W50][f9]=$(targetRow)[I9]()[y9] + targetRow[A9] + k9;self[X30][l40][W50][u60]=-G0w * height - J9w + t60;self[J9][v9][W50][u9]=R0w;self[X30][t9][c9][E9]=z80;$(self[X30][k30])[q10]({'opacity':self[g9]},M9);$(self[X30][y30])[x9]();if(self[K9][c60]){var H9=c8yy[653894];H9+=P8Z;H9+=f8Z;H9+=c8yy.L9w;var W9=E60;W9+=g60;W9+=v1Z;W9+=M60;$(W9)[q10]({"scrollTop":$(targetRow)[h50]()[u60] + targetRow[x60] - self[H9][K60]},function(){c8yy.g15();var W60="ani";var Z9=W60;Z9+=Q50;Z9+=Z4Z;$(self[X30][l40])[Z9]({"top":R0w},a9w,callback);});}else {var U9=r4Z;U9+=m6Z;U9+=c8yy[73441];$(self[U9][l40])[q10]({"top":R0w},a9w,callback);}$(self[X30][w40])[S9](F30,self[j9][m9][w40])[c8yy.n9w](H60,function(e){var o9=c8yy[653894];o9+=b8Z;c8yy.g15();o9+=W30;self[Y40][o9]();});$(self[X30][k30])[e9](p9,function(e){self[Y40][k30]();});$(D9,self[X30][y30])[c8yy.n9w](H60,function(e){var m60="backg";var U60="nte";var Z60="DTED_Envelope_Co";var N9=Z60;N9+=U60;N9+=H3Z;N9+=S60;if($(e[j60])[G9Z](N9)){var a9=m60;a9+=S30;a9+=c8yy[404720];self[Y40][a9]();}});$(window)[c8yy.n9w](q9,function(){self[a30]();});},"_heightCalc":function(){var N60="windo";var T60='maxHeight';var e60="div.DTE_Body_Conte";var D60="Height";var a60="wP";var L60="igh";var p60="ou";var z60="heightCalc";var Q60="heigh";var q60="addin";var o60="dt";var w9=z7Z;w9+=T7Z;w9+=n7Z;var P9=r4Z;P9+=o60;P9+=C8Z;var l9=c8yy[653894];l9+=v8Z;l9+=v8Z;var s9=r4Z;s9+=c8yy[404720];s9+=P8Z;s9+=c8yy[73441];var r9=e60;r9+=H3Z;var h9=p60;h9+=Z4Z;h9+=s1Z;h9+=D60;var n9=m4Z;n9+=s1Z;n9+=n40;n9+=s1Z;var T9=N60;T9+=a60;T9+=q60;T9+=D4Z;var z9=Q60;z9+=c8yy[20443];var L9=O60;L9+=F60;var i9=r4Z;i9+=c8yy[404720];i9+=P8Z;i9+=c8yy[73441];var F9=c8yy[653894];c8yy.S15();F9+=c8yy.n9w;F9+=c8yy.L9w;var O9=i60;O9+=L60;O9+=d50;var Q9=c8yy[653894];Q9+=P8Z;Q9+=f8Z;Q9+=c8yy.L9w;var formHeight;formHeight=self[Q9][O9]?self[F9][z60](self[X30][y30]):$(self[i9][l40])[L9]()[z9]();var maxHeight=$(window)[K20]() - self[n20][T9] * B0w - $(C20,self[X30][n9])[f20]() - $(O30,self[X30][y30])[h9]();$(r9,self[s9][y30])[l9](T60,maxHeight);return $(self[P9][r0Z][w9])[f20]();},"_hide":function(callback){var s60="Lightbox_Cont";var w60="click.DTED";var n60="resize.DTED_Light";var l60="backgro";var P60="und";var R60="_Lightb";var r60="div.DTED_";var v8n=n60;v8n+=e20;var J8n=P8Z;J8n+=c8yy.L9w;J8n+=c8yy.L9w;var k8n=P8Z;k8n+=c8yy.L9w;k8n+=c8yy.L9w;var A8n=m4Z;A8n+=h60;A8n+=A20;A8n+=s1Z;var y8n=r4Z;c8yy.g15();y8n+=r0Z;var I8n=r60;I8n+=s60;I8n+=l2Z;I8n+=S60;var f8n=P8Z;f8n+=c8yy.L9w;f8n+=c8yy.L9w;var C8n=l60;C8n+=P60;var V8n=r4Z;V8n+=c8yy[404720];V8n+=F6Z;var X8n=w60;X8n+=R60;X8n+=a4Z;var Y9=R5Z;Y9+=H3Z;Y9+=h1Z;Y9+=c8yy[20443];var B9=G60;B9+=j30;B9+=Z4Z;var G9=B60;G9+=c8yy[20443];var R9=r4Z;R9+=c8yy[404720];R9+=P8Z;R9+=c8yy[73441];if(!callback){callback=function(){};}$(self[R9][G9])[B9]({"top":-(self[X30][Y9][x60] + Z9w)},a9w,function(){var d60="fadeOut";var Y60="norm";var b8n=Y60;b8n+=Y2Z;var d9=X20;d9+=A20;d9+=s1Z;$([self[X30][d9],self[X30][k30]])[d60](b8n,function(){$(this)[g80]();callback();});});$(self[X30][w40])[F20](X8n);$(self[V8n][C8n])[f8n](i30);$(I8n,self[y8n][A8n])[k8n](i30);$(window)[J8n](v8n);},"_findAttachRow":function(){var V70='head';var b70="tta";var f70="ade";var M8n=c8yy[74252];M8n+=c8yy.T9w;M8n+=c8yy.n9w;var g8n=r40;g8n+=Z4Z;var E8n=c8yy[74252];E8n+=b70;E8n+=c8yy[653894];E8n+=C6Z;var c8n=R5Z;c8n+=f8Z;c8n+=c8yy.L9w;var t8n=c8yy[20443];t8n+=c8yy[74252];t8n+=v1Z;t8n+=e10;c8yy.S15();var u8n=l7Z;u8n+=H8Z;u8n+=U4Z;var dt=new $[s5Z][X70][u8n](self[Y40][v8Z][t8n]);if(self[c8n][E8n] === V70){return dt[N10]()[C70]();}else if(self[g8n][v8Z][M8n] === Q0Z){var x8n=C6Z;x8n+=C8Z;x8n+=f70;x8n+=s1Z;return dt[N10]()[x8n]();}else {var K8n=s1Z;K8n+=V50;return dt[K8n](self[Y40][v8Z][I70])[y70]();}},"_dte":O0Z,"_ready":g6Z,"_cssBackgroundOpacity":G0w,"_dom":{"wrapper":$(A70 + W8n + H8n + p0Z)[R0w],"background":$(Z8n)[R0w],"close":$(U8n)[R0w],"content":O0Z}});self=Editor[v80][b50];self[n20]={"windowPadding":Z9w,"heightCalc":O0Z,"attach":k70,"windowScroll":H6Z};})();Editor[t9Z][S8n]=function(cfg,after,reorder){var j70="Error adding field '";var e70="ultiR";var c70="yReor";var v70="nitF";var S70="exists with this name";var H70=" option";var W70="Error adding field. The field requires a `name`";var x70="erse";var Q70="nA";var t70="_displa";var U70="'. A field already ";var z8n=c8yy.L9w;z8n+=U4Z;z8n+=J70;var Q8n=D1Z;Q8n+=c8yy[404720];Q8n+=C8Z;var q8n=c8yy[653894];q8n+=R0Z;q8n+=d2Z;q8n+=v8Z;var a8n=v5Z;a8n+=u5Z;var N8n=U4Z;N8n+=v70;N8n+=U4Z;N8n+=u5Z;if(Array[y10](cfg)){var e8n=P8Z;e8n+=u70;e8n+=C8Z;e8n+=s1Z;var o8n=t70;o8n+=c70;o8n+=E70;var m8n=g70;m8n+=C6Z;if(after !== undefined){var j8n=s1Z;j8n+=M70;j8n+=x70;cfg[j8n]();}for(var i=R0w;i < cfg[m8n];i++){this[K70](cfg[i],after,g6Z);}this[o8n](this[e8n]());return this;}var name=cfg[J0Z];if(name === undefined){var p8n=W70;p8n+=H70;throw p8n;}if(this[v8Z][Z70][name]){var D8n=U70;D8n+=S70;throw j70 + name + D8n;}this[m70](N8n,cfg);var field=new Editor[a8n](cfg,this[q8n][o70],this);if(this[v8Z][Q8n]){var O8n=c8yy[73441];O8n+=e70;O8n+=K4Z;O8n+=U2Z;var editFields=this[v8Z][p70];field[O8n]();$[N80](editFields,function(idSrc,edit){var N70="lFromDat";c8yy.g15();var L8n=c8yy[404720];L8n+=C8Z;L8n+=c8yy.L9w;var F8n=c8yy[404720];F8n+=c8yy[74252];F8n+=D70;var val;if(edit[F8n]){var i8n=J2Z;i8n+=c8yy[74252];i8n+=N70;i8n+=c8yy[74252];val=field[i8n](edit[k0Z]);}field[a70](idSrc,val !== undefined?val:field[L8n]());});}this[v8Z][z8n][name]=field;if(after === undefined){this[v8Z][q70][f6Z](name);}else if(after === O0Z){var T8n=Q2Z;T8n+=E70;this[v8Z][T8n][v9Z](name);}else {var r8n=M40;r8n+=b8Z;r8n+=S6Z;r8n+=C8Z;var h8n=P8Z;h8n+=s1Z;h8n+=r2Z;h8n+=s1Z;var n8n=U4Z;n8n+=Q70;n8n+=O70;n8n+=b4Z;var idx=$[n8n](after,this[v8Z][h8n]);this[v8Z][q70][r8n](idx + G0w,R0w,name);}if(reorder !== g6Z){var s8n=P8Z;s8n+=u70;s8n+=V20;this[F70](this[s8n]());}return this;};Editor[l8n][i70]=function(newAjax){var P8n=L70;P8n+=c8yy[74252];P8n+=a1Z;if(newAjax){this[v8Z][i70]=newAjax;return this;}return this[v8Z][P8n];};Editor[t9Z][k30]=function(){var h70="onBackground";var s70="ubmi";var T70="editO";var z70="ubm";var Y8n=v8Z;Y8n+=z70;Y8n+=U4Z;Y8n+=c8yy[20443];var B8n=U6Z;B8n+=P8Z;B8n+=d2Z;var R8n=v1Z;R8n+=b8Z;R8n+=w1Z;R8n+=s1Z;var w8n=T70;w8n+=n70;var onBackground=this[v8Z][w8n][h70];if(typeof onBackground === f9Z){onBackground(this);}else if(onBackground === R8n){var G8n=F80;G8n+=r70;this[G8n]();}else if(onBackground === B8n){this[w40]();}else if(onBackground === Y8n){var d8n=v8Z;d8n+=s70;d8n+=c8yy[20443];this[d8n]();}return this;};Editor[b1n][l70]=function(){c8yy.g15();this[P70]();return this;};Editor[X1n][V1n]=function(cells,fieldNames,show,opts){var w70="dividual";var B70="ole";var R70="_dataSo";var A1n=U4Z;A1n+=f8Z;A1n+=w70;var y1n=R70;y1n+=G70;var I1n=C8Z;I1n+=n1Z;I1n+=S8Z;var f1n=v1Z;f1n+=P8Z;f1n+=B70;f1n+=G60;var C1n=r4Z;C1n+=c8yy[20443];C1n+=U4Z;C1n+=I30;var that=this;if(this[C1n](function(){c8yy.S15();that[Y70](cells,fieldNames,opts);})){return this;}if($[d70](fieldNames)){opts=fieldNames;fieldNames=undefined;show=H6Z;}else if(typeof fieldNames === f1n){show=fieldNames;fieldNames=undefined;opts=undefined;}if($[d70](show)){opts=show;show=H6Z;}if(show === undefined){show=H6Z;}opts=$[I1n]({},this[v8Z][t40][Y70],opts);var editFields=this[y1n](A1n,cells,fieldNames);this[b00](cells,editFields,X00,opts,function(){var J00="itl";var S00="</div></div>";var D00='resize.';var F00='<div class="DTE_Processing_Indicator"><span></div>';var I00="bubblePositio";var t00="hild";var O00='" title="';var i00="pointer";var Q00="liner";var s00="ader";var E00="ildr";var a00="concat";var U00="><d";var e00="ormOption";var K00="iv ";var o00="leNodes";var m00="bubb";var h00="prep";var C00="cludeFiel";var q00="bg";var B1n=V00;B1n+=X80;var G1n=W7Z;G1n+=C00;G1n+=c8yy[404720];G1n+=v8Z;var R1n=v3Z;R1n+=P8Z;R1n+=f00;var w1n=I00;w1n+=f8Z;var l1n=c8yy[653894];l1n+=y00;l1n+=j6Z;var s1n=c8yy[653894];s1n+=b8Z;s1n+=S6Z;s1n+=j6Z;var z1n=r4Z;z1n+=b5Z;z1n+=A00;z1n+=D4Z;var L1n=c8yy[74252];L1n+=c8yy[404720];L1n+=c8yy[404720];var O1n=v1Z;O1n+=A1Z;O1n+=v2Z;O1n+=k00;var a1n=c8yy[20443];a1n+=J00;a1n+=C8Z;var D1n=c8yy[404720];D1n+=P8Z;D1n+=c8yy[73441];var p1n=v00;p1n+=c8yy[73441];p1n+=u00;var e1n=c8yy[404720];e1n+=P8Z;e1n+=c8yy[73441];var o1n=T7Z;o1n+=c3Z;o1n+=a40;var m1n=c8yy[653894];m1n+=t00;m1n+=c00;var j1n=Q1Z;j1n+=E00;j1n+=h1Z;var S1n=c8yy[653894];S1n+=g00;S1n+=b8Z;S1n+=F60;var Z1n=h6Z;Z1n+=o40;Z1n+=R6Z;var H1n=M00;H1n+=P6Z;H1n+=x00;var W1n=o7Z;W1n+=K00;W1n+=c8yy[653894];W1n+=k7Z;var K1n=Y6Z;K1n+=R6Z;K1n+=j40;K1n+=R6Z;var x1n=W00;x1n+=H00;var M1n=c8yy[653894];M1n+=b8Z;M1n+=P8Z;M1n+=d2Z;var g1n=Z00;g1n+=k7Z;var E1n=Y6Z;E1n+=R6Z;var c1n=c8yy[20443];c1n+=a9Z;c1n+=b8Z;c1n+=C8Z;var t1n=Y6Z;t1n+=R6Z;var u1n=Y6Z;u1n+=U00;u1n+=x00;u1n+=S00;var v1n=w7Z;v1n+=j00;var J1n=m00;J1n+=o00;var k1n=v3Z;k1n+=e00;k1n+=v8Z;var namespace=that[k1n](opts);var ret=that[p00](X00);if(!ret){return that;}$(window)[c8yy.n9w](D00 + namespace,function(){that[N00]();});var nodes=[];that[v8Z][J1n]=nodes[a00][k40](nodes,_pluck(editFields,v1n));var classes=that[W9Z][Y70];var background=$(E0Z + classes[q00] + u1n);var container=$(E0Z + classes[y30] + t1n + E0Z + classes[Q00] + W0Z + E0Z + classes[c1n] + E1n + g1n + classes[M1n] + O00 + that[x1n][w40] + K1n + F00 + p0Z + p0Z + W1n + classes[i00] + H1n + Z1n);if(show){var U1n=U9Z;U1n+=b4Z;container[L00](U1n);background[L00](o30);}var liner=container[S1n]()[z00](R0w);var table=liner[j1n]();var close=table[m1n]();liner[o1n](that[e1n][p1n]);table[i0Z](that[D1n][T00]);if(opts[n00]){var N1n=h00;N1n+=S8Z;liner[N1n](that[r0Z][r00]);}if(opts[a1n]){var Q1n=i60;Q1n+=s00;var q1n=h00;q1n+=S8Z;liner[q1n](that[r0Z][Q1n]);}if(opts[O1n]){var i1n=l00;i1n+=P00;var F1n=c8yy[404720];F1n+=P8Z;F1n+=c8yy[73441];table[x80](that[F1n][i1n]);}var pair=$()[K70](container)[L1n](background);that[z1n](function(submitComplete){c8yy.S15();that[q30](pair,{opacity:R0w},function(){var w00="ubble";c8yy.S15();var R00="esize.";if(this === container[R0w]){var r1n=v1Z;r1n+=w00;var h1n=U6Z;h1n+=P8Z;h1n+=v8Z;h1n+=F1Z;var n1n=r4Z;n1n+=W3Z;n1n+=H3Z;var T1n=s1Z;T1n+=R00;pair[g80]();$(window)[F20](T1n + namespace);that[G00]();that[n1n](h1n,[r1n]);}});});background[s1n](function(){that[l70]();});close[l1n](function(){var P1n=r4Z;P1n+=U6Z;c8yy.g15();P1n+=W30;that[P1n]();});that[w1n]();that[q30](pair,{opacity:G0w});that[R1n](that[v8Z][G1n],opts[B1n]);that[B00](X00,H6Z);});return this;};Editor[Y1n][N00]=function(){var X90="rig";var g90="eCla";var Y00="fse";var d00="erWi";var u90="bottom";var k9w=15;var C90='div.DTE_Bubble';var y90="ttom";var f90='div.DTE_Bubble_Liner';var c90='below';var v90="right";var J90="left";var I90="bubbleNodes";var V90="lef";var u4n=P8Z;u4n+=c8yy.L9w;u4n+=Y00;u4n+=c8yy[20443];var v4n=b8Z;v4n+=l10;var J4n=c8yy[653894];J4n+=v8Z;J4n+=v8Z;var k4n=P8Z;k4n+=A1Z;k4n+=d00;k4n+=b90;var A4n=X90;A4n+=C6Z;A4n+=c8yy[20443];var y4n=V90;y4n+=c8yy[20443];var I4n=Z9Z;I4n+=D4Z;I4n+=c6Z;var f4n=c8yy[20443];f4n+=P8Z;f4n+=H8Z;var wrapper=$(C90),liner=$(f90),nodes=this[v8Z][I90];var position={top:R0w,left:R0w,right:R0w,bottom:R0w};$[N80](nodes,function(i,node){var A90="fset";var C4n=c8yy[20443];C4n+=Y10;var V4n=v1Z;V4n+=P8Z;V4n+=y90;var X4n=b8Z;X4n+=P50;var b4n=v2Z;b4n+=H8Z;var d1n=P8Z;d1n+=c8yy.L9w;d1n+=A90;var pos=$(node)[d1n]();node=$(node)[k90](R0w);position[b4n]+=pos[u60];position[J90]+=pos[J90];position[v90]+=pos[X4n] + node[J60];position[V4n]+=pos[C4n] + node[x60];});position[f4n]/=nodes[I4n];position[y4n]/=nodes[M6Z];position[v90]/=nodes[M6Z];position[u90]/=nodes[M6Z];var top=position[u60],left=(position[J90] + position[A4n]) / B0w,width=liner[k4n](),visLeft=left - width / B0w,visRight=visLeft + width,docWidth=$(window)[v60](),padding=k9w,classes=this[W9Z][Y70];wrapper[J4n]({top:top,left:left});if(liner[v4n] && liner[u4n]()[u60] < R0w){var c4n=t90;c4n+=y90;var t4n=v2Z;t4n+=H8Z;wrapper[z0Z](t4n,position[c4n])[K9Z](c90);}else {var g4n=v1Z;g4n+=C8Z;g4n+=b8Z;g4n+=V50;var E4n=E90;E4n+=g90;E4n+=r3Z;wrapper[E4n](g4n);}if(visRight + padding > docWidth){var M4n=c8yy[653894];M4n+=v8Z;M4n+=v8Z;var diff=visRight - docWidth;liner[M4n](M90,visLeft < padding?-(visLeft - padding):-(diff + padding));}else {var x4n=c8yy[653894];x4n+=v8Z;x4n+=v8Z;liner[x4n](M90,visLeft < padding?-(visLeft - padding):R0w);}return this;};Editor[K4n][W4n]=function(buttons){var K90="sA";var x90="emp";var H90="as";var W90="rray";var j4n=x90;j4n+=q3Z;var S4n=l00;S4n+=c8yy[20443];S4n+=P8Z;S4n+=k00;var U4n=U4Z;U4n+=K90;U4n+=W90;var H4n=i1Z;H4n+=H90;H4n+=S6Z;c8yy.S15();var that=this;if(buttons === H4n){var Z4n=U4Z;Z4n+=P9w;Z4n+=m5Z;Z4n+=f8Z;buttons=[{text:this[Z4n][this[v8Z][Z90]][U90],action:function(){c8yy.g15();this[U90]();}}];}else if(!Array[U4n](buttons)){buttons=[buttons];}$(this[r0Z][S4n])[j4n]();$[N80](buttons,function(i,btn){var i90="className";var o90="bInde";var j90="tabIn";var n90='keypress';var m90="dex";var z90='keyup';var p90="ndex";var D90="unc";var S90="pendTo";var e90="tabi";var F90='<button></button>';var h4n=l00;h4n+=c8yy[20443];h4n+=T1Z;var n4n=T7Z;n4n+=S90;c8yy.g15();var L4n=P8Z;L4n+=f8Z;var O4n=j90;O4n+=m90;var Q4n=D70;Q4n+=o90;Q4n+=a1Z;var q4n=e90;q4n+=p90;var a4n=c8yy.L9w;a4n+=D90;a4n+=c8yy[20443];a4n+=L40;var N4n=C6Z;N4n+=c8yy[20443];N4n+=c8yy[73441];N4n+=b8Z;var D4n=v1Z;D4n+=w1Z;D4n+=N90;var p4n=a90;p4n+=K4Z;var e4n=c8yy.L9w;e4n+=f8Z;var o4n=c8yy[74252];o4n+=q90;if(typeof btn === Q90){btn={text:btn,action:function(){var m4n=v8Z;m4n+=G4Z;m4n+=O90;c8yy.S15();m4n+=c8yy[20443];this[m4n]();}};}var text=btn[v40] || btn[E80];var action=btn[o4n] || btn[e4n];$(F90,{'class':that[p4n][T00][D4n] + (btn[i90]?g0Z + btn[i90]:h5Z)})[N4n](typeof text === a4n?text(that):text || h5Z)[L90](q4n,btn[Q4n] !== undefined?btn[O4n]:R0w)[c8yy.n9w](z90,function(e){var T90="eyCode";var F4n=j6Z;F4n+=T90;if(e[F4n] === y9w && action){var i4n=c8yy[653894];i4n+=c8yy[74252];i4n+=b8Z;i4n+=b8Z;action[i4n](that);}})[c8yy.n9w](n90,function(e){c8yy.g15();if(e[h90] === y9w){e[r90]();}})[L4n](s0Z,function(e){var s90="preven";var z4n=s90;c8yy.S15();z4n+=l90;e[z4n]();if(action){var T4n=P90;T4n+=w90;action[T4n](that,e);}})[n4n](that[r0Z][h4n]);});return this;};Editor[r4n][R90]=function(fieldName){var s4n=c8yy.L9w;s4n+=G90;var that=this;var fields=this[v8Z][s4n];if(typeof fieldName === Q90){var R4n=v8Z;R4n+=H8Z;R4n+=B90;var w4n=P8Z;w4n+=u70;w4n+=V20;var P4n=W7Z;P4n+=l7Z;P4n+=O70;P4n+=b4Z;var l4n=c8yy[404720];l4n+=E10;that[o70](fieldName)[l4n]();delete fields[fieldName];var orderIdx=$[P4n](fieldName,this[v8Z][q70]);this[v8Z][w4n][R4n](orderIdx,G0w);var includeIdx=$[Y90](fieldName,this[v8Z][d90]);if(includeIdx !== -G0w){this[v8Z][d90][b88](includeIdx,G0w);}}else {var G4n=C8Z;G4n+=c8yy[74252];G4n+=c8yy[653894];G4n+=C6Z;$[G4n](this[X88](fieldName),function(i,name){c8yy.g15();that[R90](name);});}return this;};Editor[t9Z][w40]=function(){var B4n=r4Z;B4n+=w40;this[B4n](g6Z);return this;};Editor[t9Z][V88]=function(arg1,arg2,arg3,arg4){var M88='initCreate';var t3n=C88;t3n+=l2Z;var k3n=C8Z;k3n+=f88;var A3n=N2Z;A3n+=b8Z;A3n+=X8Z;var y3n=v1Z;y3n+=b8Z;y3n+=P8Z;y3n+=i10;var I3n=J10;I3n+=v8Z;I3n+=j3Z;var f3n=Y1Z;f3n+=b4Z;f3n+=b8Z;f3n+=C8Z;var C3n=c8yy[653894];C3n+=s1Z;C3n+=I88;C3n+=C8Z;var V3n=y88;V3n+=c8yy.n9w;var X3n=D1Z;X3n+=r2Z;var d4n=A88;d4n+=x3Z;d4n+=U4Z;d4n+=J70;var that=this;var fields=this[v8Z][Z70];var count=G0w;if(this[k88](function(){var Y4n=J88;c8yy.g15();Y4n+=C8Z;Y4n+=w7Z;Y4n+=C8Z;that[Y4n](arg1,arg2,arg3,arg4);})){return this;}if(typeof arg1 === v88){count=arg1;arg1=arg2;arg2=arg3;}this[v8Z][d4n]={};for(var i=R0w;i < count;i++){var b3n=u88;b3n+=C8Z;b3n+=Y9w;this[v8Z][b3n][i]={fields:this[v8Z][Z70]};}var argOpts=this[t88](arg1,arg2,arg3,arg4);this[v8Z][X3n]=c88;this[v8Z][V3n]=C3n;this[v8Z][I70]=O0Z;this[r0Z][T00][f3n][I3n]=y3n;this[E88]();this[F70](this[A3n]());c8yy.g15();$[k3n](fields,function(name,field){var u3n=c8yy[404720];u3n+=C8Z;u3n+=c8yy.L9w;var J3n=c8yy[73441];J3n+=W10;J3n+=g88;J3n+=y5Z;field[J3n]();for(var i=R0w;i < count;i++){var v3n=r2Z;v3n+=c8yy.L9w;field[a70](i,field[v3n]());}field[y5Z](field[u3n]());});this[t3n](M88,O0Z,function(){var K88="beOpen";var x88="may";var W88="_assembleM";var g3n=x88;g3n+=K88;var E3n=P8Z;E3n+=H8Z;E3n+=c8yy[20443];E3n+=v8Z;var c3n=W88;c8yy.S15();c3n+=H88;that[c3n]();that[Z88](argOpts[E3n]);argOpts[g3n]();});return this;};Editor[M3n][U88]=function(parent){var j88="dep";var o88="undepend";var S88=".e";var H3n=S88;H3n+=j88;var W3n=f8Z;W3n+=P8Z;W3n+=c8yy[404720];W3n+=C8Z;var x3n=m88;x3n+=s1Z;x3n+=F4Z;if(Array[x3n](parent)){for(var i=R0w,ien=parent[M6Z];i < ien;i++){var K3n=o88;K3n+=h1Z;K3n+=c8yy[20443];this[K3n](parent[i]);}return this;}var field=this[o70](parent);$(field[W3n]())[F20](H3n);return this;};Editor[Z3n][U3n]=function(parent,url,opts){c8yy.S15();var p88="depen";var D88="dent";var n3n=e88;n3n+=F1Z;n3n+=l80;var T3n=W3Z;T3n+=f8Z;T3n+=c8yy[20443];var z3n=P8Z;z3n+=f8Z;var e3n=c8yy[653894];e3n+=P0Z;e3n+=f8Z;e3n+=W5Z;var o3n=U8Z;o3n+=h1Z;o3n+=c8yy[404720];var m3n=r7Z;m3n+=v8Z;m3n+=P8Z;m3n+=f8Z;if(Array[y10](parent)){var S3n=e10;S3n+=f8Z;S3n+=D4Z;S3n+=c6Z;for(var i=R0w,ien=parent[S3n];i < ien;i++){var j3n=p88;j3n+=D88;this[j3n](parent[i],url,opts);}return this;}var that=this;var field=this[o70](parent);var ajaxOpts={type:N88,dataType:m3n};opts=$[o3n]({event:e3n,data:O0Z,preUpdate:O0Z,postUpdate:O0Z},opts);var update=function(json){var q88="nabl";var L88='error';var T88="postUpdate";var Q88="how";var i88="preUpdate";var i3n=c8yy[404720];i3n+=U4Z;i3n+=a88;i3n+=N8Z;var F3n=C8Z;F3n+=q88;F3n+=C8Z;var O3n=v8Z;O3n+=Q88;var Q3n=g00;Q3n+=c8yy[404720];Q3n+=C8Z;var q3n=C8Z;q3n+=V6Z;q3n+=C6Z;var a3n=O88;a3n+=v8Z;a3n+=d8Z;var N3n=J2Z;N3n+=c8yy[74252];N3n+=b8Z;var D3n=F88;D3n+=c8yy[404720];D3n+=w7Z;D3n+=C8Z;var p3n=C8Z;p3n+=c8yy[74252];p3n+=c8yy[653894];p3n+=C6Z;if(opts[i88]){opts[i88](json);}$[p3n]({labels:T0Z,options:D3n,values:N3n,messages:a3n,errors:L88},function(jsonProp,fieldFn){c8yy.S15();if(json[jsonProp]){$[N80](json[jsonProp],function(field,val){that[o70](field)[fieldFn](val);});}});$[q3n]([Q3n,O3n,F3n,i3n],function(i,key){var z88="anim";if(json[key]){var L3n=z88;L3n+=c8yy[74252];L3n+=c8yy[20443];L3n+=C8Z;that[key](json[key],json[L3n]);}});if(opts[T88]){opts[T88](json);}field[L80](g6Z);};$(field[y70]())[z3n](opts[T3n] + n3n,function(e){var n88="alu";var l88="the";var w88="xte";var w3n=J2Z;c8yy.g15();w3n+=n88;w3n+=K4Z;var P3n=s1Z;P3n+=P8Z;P3n+=m4Z;P3n+=v8Z;var l3n=A88;l3n+=v5Z;l3n+=C8Z;l3n+=Y9w;var s3n=s1Z;s3n+=V50;s3n+=v8Z;var r3n=b8Z;r3n+=C8Z;r3n+=f8Z;r3n+=u6Z;var h3n=c8yy.L9w;h3n+=U4Z;h3n+=f8Z;h3n+=c8yy[404720];if($(field[y70]())[h3n](e[j60])[r3n] === R0w){return;}field[L80](H6Z);var data={};data[s3n]=that[v8Z][p70]?_pluck(that[v8Z][l3n],h88):O0Z;data[k70]=data[P3n]?data[r88][R0w]:O0Z;data[w3n]=that[d0Z]();if(opts[k0Z]){var ret=opts[k0Z](data);if(ret){var R3n=c8yy[404720];R3n+=c8yy[74252];R3n+=c8yy[20443];R3n+=c8yy[74252];opts[R3n]=ret;}}if(typeof url === f9Z){var B3n=J2Z;B3n+=c8yy[74252];B3n+=b8Z;var G3n=c8yy[653894];G3n+=c8yy[74252];G3n+=w90;var o=url[G3n](that,field[B3n](),data,update);if(o){if(typeof o === E6Z && typeof o[s88] === f9Z){var Y3n=l88;Y3n+=f8Z;o[Y3n](function(resolved){c8yy.g15();if(resolved){update(resolved);}});}else {update(o);}}}else {var V2n=V8Z;V2n+=c8yy[20443];V2n+=h1Z;V2n+=c8yy[404720];var X2n=c8yy[74252];X2n+=P88;X2n+=a1Z;if($[d70](url)){var d3n=C8Z;d3n+=w88;d3n+=f8Z;d3n+=c8yy[404720];$[d3n](ajaxOpts,url);}else {var b2n=w1Z;b2n+=s1Z;b2n+=b8Z;ajaxOpts[b2n]=url;}$[X2n]($[V2n](ajaxOpts,{url:url,data:data,success:update}));}});return this;};Editor[C2n][R88]=function(){var X18="ller";var b18="yContro";var V18="displaye";var f18='.dte';var B88="of";var J2n=c8yy.z9w;J2n+=U4Z;J2n+=G88;J2n+=C8Z;var k2n=B88;k2n+=c8yy.L9w;var A2n=Y88;A2n+=q50;A2n+=d88;var y2n=N9Z;y2n+=v10;y2n+=b18;y2n+=X18;var f2n=V18;f2n+=c8yy[404720];if(this[v8Z][f2n]){var I2n=c8yy[653894];I2n+=b8Z;I2n+=P8Z;I2n+=d2Z;this[I2n]();}this[R90]();if(this[v8Z][C18]){$(o30)[x80](this[v8Z][C18]);}var controller=this[v8Z][y2n];if(controller[A2n]){controller[R88](this);}$(document)[k2n](f18 + this[v8Z][J2n]);this[r0Z]=O0Z;this[v8Z]=O0Z;};Editor[t9Z][I18]=function(name){var y18="ldNames";var v2n=r4Z;c8yy.g15();v2n+=N2Z;v2n+=y18;var that=this;$[N80](this[v2n](name),function(i,n){var u2n=A18;u2n+=v1Z;u2n+=e10;c8yy.S15();that[o70](n)[u2n]();});return this;};Editor[t9Z][v80]=function(show){var k18="laye";var c2n=c8yy[653894];c2n+=X40;c2n+=v8Z;c2n+=C8Z;if(show === undefined){var t2n=F2Z;t2n+=k18;t2n+=c8yy[404720];return this[v8Z][t2n];}return this[show?J18:c2n]();};Editor[t9Z][E2n]=function(){return $[v18](this[v8Z][Z70],function(field,name){return field[u18]()?name:O0Z;});};Editor[g2n][M2n]=function(){c8yy.g15();var c18="ler";var t18="displayControl";var K2n=f8Z;K2n+=P8Z;K2n+=c8yy[404720];K2n+=C8Z;var x2n=t18;x2n+=c18;return this[v8Z][x2n][K2n](this);};Editor[W2n][A88]=function(items,arg1,arg2,arg3,arg4){var g18="ataSo";var M18="_tid";var o2n=P8Z;o2n+=H8Z;o2n+=c8yy[20443];o2n+=v8Z;var m2n=c8yy[73441];m2n+=M9Z;m2n+=f8Z;var j2n=E18;j2n+=X8Z;var S2n=r40;S2n+=g18;S2n+=G70;var U2n=r4Z;U2n+=F1Z;U2n+=U4Z;U2n+=c8yy[20443];var H2n=M18;H2n+=b4Z;var that=this;c8yy.g15();if(this[H2n](function(){var Z2n=C8Z;Z2n+=i8Z;c8yy.g15();that[Z2n](items,arg1,arg2,arg3,arg4);})){return this;}var argOpts=this[t88](arg1,arg2,arg3,arg4);this[U2n](items,this[S2n](j2n,items),m2n,argOpts[o2n],function(){var x18="maybeO";var W18="formOp";var p2n=x18;p2n+=K18;var e2n=r4Z;e2n+=W18;e2n+=H2Z;e2n+=T1Z;that[H18]();c8yy.S15();that[e2n](argOpts[G0Z]);argOpts[p2n]();});return this;};Editor[D2n][Z18]=function(name){var U18="Nam";c8yy.S15();var N2n=r4Z;N2n+=o70;N2n+=U18;N2n+=K4Z;var that=this;$[N80](this[N2n](name),function(i,n){var a2n=h1Z;a2n+=S18;a2n+=C8Z;that[o70](n)[a2n]();});return this;};Editor[t9Z][q2n]=function(name,msg){var j18="globalE";var m18="mError";var Q2n=C60;Q2n+=V20;c8yy.g15();var wrapper=$(this[r0Z][Q2n]);if(msg === undefined){var L2n=j18;L2n+=T9Z;var F2n=v00;F2n+=m18;var O2n=r4Z;O2n+=O88;O2n+=v8Z;O2n+=d8Z;this[O2n](this[r0Z][F2n],name,H6Z,function(){var o18="tog";var e18="gleClass";c8yy.g15();var p18='inFormError';var i2n=o18;i2n+=e18;wrapper[i2n](p18,name !== undefined && name !== h5Z);});this[v8Z][L2n]=name;}else {var z2n=D18;z2n+=s1Z;this[o70](name)[z2n](msg);}return this;};Editor[t9Z][T2n]=function(name){var N18='Unknown field name - ';var n2n=o70;n2n+=v8Z;var fields=this[v8Z][n2n];if(!fields[name]){throw N18 + name;}return fields[name];};Editor[h2n][Z70]=function(){var r2n=j10;c8yy.S15();r2n+=C8Z;r2n+=b8Z;r2n+=X8Z;return $[v18](this[v8Z][r2n],function(field,name){return name;});};Editor[t9Z][D2Z]=_api_file;Editor[s2n][l2n]=_api_files;Editor[P2n][k90]=function(name){var w2n=m88;w2n+=D80;var that=this;if(!name){name=this[Z70]();}if(Array[w2n](name)){var out={};$[N80](name,function(i,n){var R2n=D4Z;R2n+=U2Z;out[n]=that[o70](n)[R2n]();});return out;}return this[o70](name)[k90]();};Editor[t9Z][a18]=function(names,animate){var that=this;$[N80](this[X88](names),function(i,n){var B2n=g00;B2n+=r2Z;var G2n=c8yy.L9w;G2n+=t5Z;G2n+=c8yy[404720];c8yy.S15();that[G2n](n)[B2n](animate);});return this;};Editor[Y2n][d2n]=function(includeHash){return $[v18](this[v8Z][p70],function(edit,idSrc){return includeHash === H6Z?q18 + idSrc:idSrc;});};Editor[b5n][Q18]=function(inNames){var O18="formError";var i18="inE";var F18="globalError";var formError=$(this[r0Z][O18]);if(this[v8Z][F18]){return H6Z;}var names=this[X88](inNames);for(var i=R0w,ien=names[M6Z];i < ien;i++){var V5n=i18;V5n+=s1Z;V5n+=L18;V5n+=s1Z;var X5n=E18;X5n+=c8yy[404720];if(this[X5n](names[i])[V5n]()){return H6Z;}}return g6Z;};Editor[C5n][z18]=function(cell,fieldName,opts){var l18="isPl";var r18="_Field";var s18="nli";var T18="nl";var P18="ainObject";var g5n=U4Z;g5n+=T18;g5n+=W7Z;g5n+=C8Z;var E5n=r4Z;E5n+=F1Z;E5n+=U4Z;E5n+=c8yy[20443];var c5n=n18;c5n+=e88;c5n+=h18;c5n+=r18;var A5n=U4Z;A5n+=s18;A5n+=f8Z;A5n+=C8Z;var y5n=U4Z;y5n+=s18;y5n+=f8Z;c8yy.S15();y5n+=C8Z;var I5n=V8Z;I5n+=q1Z;var f5n=l18;f5n+=P18;var that=this;if($[f5n](fieldName)){opts=fieldName;fieldName=undefined;}opts=$[I5n]({},this[v8Z][t40][y5n],opts);var editFields=this[m70](w18,cell,fieldName);var node,field;var countOuter=R0w,countInner;var closed=g6Z;var classes=this[W9Z][A5n];$[N80](editFields,function(i,editField){var G18="ttach";var R18="displayField";var d18="re than one row in";var Y18=" mo";var b48="line at a time";var B18="Cannot edit";var u5n=R18;u5n+=v8Z;var v5n=C8Z;v5n+=c8yy[74252];v5n+=c8yy[653894];v5n+=C6Z;var J5n=c8yy[74252];J5n+=G18;if(countOuter > R0w){var k5n=B18;k5n+=Y18;k5n+=d18;k5n+=b48;throw k5n;}node=$(editField[J5n][R0w]);countInner=R0w;$[v5n](editField[u5n],function(j,f){var V48="e th";var X48="Cannot edit mor";var C48="an one field inline at a time";if(countInner > R0w){var t5n=X48;t5n+=V48;t5n+=C48;throw t5n;}field=f;c8yy.S15();countInner++;});countOuter++;;});if($(c5n,node)[M6Z]){return this;}if(this[k88](function(){that[z18](cell,fieldName,opts);})){return this;}this[E5n](cell,editFields,g5n,opts,function(){var E48="_pr";var A48="mErr";c8yy.S15();var W48="userAgent";var K48="contents";var t48="n></div>";var g48="eopen";var c48="ine";var u48="sing_Indicator\"><span></spa";var y48="seRe";var f48="_postop";var S48='" ';var v48="<div class=\"DTE_Proces";var o48="epla";var M48="rmOpt";var U48='style="width:';var Z48='Edge/';var Y5n=f48;Y5n+=C8Z;Y5n+=f8Z;var z5n=I48;z5n+=y48;z5n+=D4Z;var q5n=v00;q5n+=A48;q5n+=P8Z;q5n+=s1Z;var a5n=n40;a5n+=a40;var N5n=s1Z;N5n+=C8Z;N5n+=v10;N5n+=k48;var D5n=p4Z;D5n+=f8Z;D5n+=V20;var p5n=c8yy[404720];p5n+=w6Z;p5n+=e88;var e5n=J48;e5n+=c8yy[404720];var o5n=J7Z;o5n+=c8yy[404720];o5n+=w6Z;o5n+=R6Z;var m5n=l00;m5n+=v2Z;m5n+=k00;var j5n=v48;j5n+=u48;j5n+=t48;var S5n=Q8Z;S5n+=s1Z;var U5n=Z00;U5n+=k7Z;var Z5n=H8Z;Z5n+=a1Z;Z5n+=Y6Z;var H5n=m4Z;H5n+=e2Z;H5n+=c8yy[20443];H5n+=C6Z;var W5n=r2Z;W5n+=c8yy[20443];W5n+=c8yy[74252];W5n+=Q1Z;var K5n=U4Z;K5n+=T18;K5n+=c48;var x5n=E48;x5n+=g48;var M5n=E3Z;M5n+=M48;M5n+=x48;M5n+=k00;var namespace=that[M5n](opts);var ret=that[x5n](K5n);if(!ret){return that;}var children=node[K48]()[W5n]();var style=navigator[W48][H48](Z48) !== -G0w?U48 + node[H5n]() + Z5n:h5Z;node[x80]($(E0Z + classes[y30] + W0Z + U5n + classes[S5n] + S48 + style + Y80 + j5n + p0Z + E0Z + classes[m5n] + U0Z + o5n));node[e5n](p5n + classes[D5n][N5n](/ /g,j48))[a5n](field[y70]())[x80](that[r0Z][q5n]);if(opts[m48]){var L5n=c8yy[404720];L5n+=P8Z;L5n+=c8yy[73441];var i5n=s1Z;i5n+=o48;i5n+=c8yy[653894];i5n+=C8Z;var F5n=w2Z;F5n+=v8Z;var O5n=c8yy[404720];O5n+=w6Z;O5n+=e88;var Q5n=c8yy.L9w;Q5n+=e48;node[Q5n](O5n + classes[F5n][i5n](/ /g,j48))[x80](that[L5n][m48]);}that[z5n](function(submitComplete,action){var Q48="cli";var q48="cInfo";var a48="arDynami";var r5n=p48;r5n+=D48;var h5n=N48;h5n+=a48;h5n+=q48;var T5n=Q48;T5n+=i10;closed=H6Z;$(document)[F20](T5n + namespace);if(!submitComplete || action !== O48){var n5n=c8yy[404720];n5n+=C8Z;n5n+=j00;node[K48]()[n5n]();node[x80](children);}that[h5n]();return r5n;;});setTimeout(function(){if(closed){return;}$(document)[c8yy.n9w](s0Z + namespace,function(e){var L48="rge";var T48="andS";var r48='owns';var z48="ypeF";var i48="rents";var B5n=F48;B5n+=i48;var G5n=c8yy[20443];G5n+=c8yy[74252];G5n+=L48;G5n+=c8yy[20443];var R5n=c8yy[20443];R5n+=t10;R5n+=D4Z;R5n+=U2Z;var w5n=V80;c8yy.S15();w5n+=z48;w5n+=f8Z;var P5n=T48;P5n+=I1Z;P5n+=c8yy.L9w;var l5n=n48;l5n+=c8yy[74252];l5n+=i10;var s5n=c8yy.L9w;s5n+=f8Z;var back=$[s5n][h48]?l5n:P5n;if(!field[w5n](r48,e[R5n]) && $[Y90](node[R0w],$(e[G5n])[B5n]()[back]()) === -G0w){that[l70]();}});},R0w);that[s48]([field],opts[b9Z]);that[Y5n](l48,H6Z);});return this;};Editor[d5n][n00]=function(name,msg){var w48="nfo";var R48="_message";var P48="ormI";if(msg === undefined){var X6n=c8yy.L9w;X6n+=P48;X6n+=w48;var b6n=m6Z;b6n+=c8yy[73441];this[R48](this[b6n][X6n],name);}else {var C6n=G48;C6n+=D4Z;C6n+=C8Z;var V6n=c8yy.L9w;V6n+=I0Z;V6n+=a2Z;this[V6n](name)[C6n](msg);}return this;};Editor[t9Z][f6n]=function(mode){var V38="ing mod";var X38="ntly in an edit";var b38="Not curre";var C38='Changing from create mode is not supported';var J6n=c8yy[74252];J6n+=W6Z;c8yy.S15();J6n+=L40;var k6n=B48;k6n+=C8Z;var A6n=Y48;A6n+=d48;if(!mode){var I6n=V6Z;I6n+=H2Z;I6n+=c8yy.n9w;return this[v8Z][I6n];}if(!this[v8Z][Z90]){var y6n=b38;y6n+=X38;y6n+=V38;y6n+=C8Z;throw new Error(y6n);}else if(this[v8Z][Z90] === A6n && mode !== k6n){throw new Error(C38);}this[v8Z][J6n]=mode;return this;};Editor[v6n][u6n]=function(){c8yy.g15();return this[v8Z][I70];};Editor[t9Z][t6n]=function(fieldNames){var g6n=c8yy.L9w;g6n+=I0Z;g6n+=a2Z;var that=this;if(fieldNames === undefined){fieldNames=this[Z70]();}if(Array[y10](fieldNames)){var c6n=f38;c6n+=C6Z;var out={};$[c6n](fieldNames,function(i,name){var I38="tiGet";var E6n=K2Z;E6n+=I38;out[name]=that[o70](name)[E6n]();});return out;}c8yy.g15();return this[g6n](fieldNames)[y38]();};Editor[t9Z][M6n]=function(fieldNames,val){var that=this;if($[d70](fieldNames) && val === undefined){$[N80](fieldNames,function(name,value){var x6n=c8yy.L9w;x6n+=U4Z;x6n+=I1Z;x6n+=c8yy[404720];that[x6n](name)[a70](value);});}else {var W6n=r80;W6n+=b8Z;W6n+=W2Z;var K6n=j10;K6n+=I1Z;K6n+=c8yy[404720];this[K6n](fieldNames)[W6n](val);}c8yy.g15();return this;};Editor[t9Z][H6n]=function(name){var m6n=f8Z;m6n+=P8Z;c8yy.S15();m6n+=c8yy[404720];m6n+=C8Z;var j6n=j10;j6n+=u5Z;var Z6n=c8yy[73441];Z6n+=c8yy[74252];Z6n+=H8Z;var that=this;if(!name){name=this[q70]();}return Array[y10](name)?$[Z6n](name,function(n){var S6n=t80;S6n+=c8yy[404720];S6n+=C8Z;var U6n=c8yy.L9w;U6n+=U4Z;c8yy.g15();U6n+=C8Z;U6n+=a2Z;return that[U6n](n)[S6n]();}):this[j6n](name)[m6n]();};Editor[o6n][e6n]=function(name,fn){var A38="_eventName";c8yy.g15();$(this)[F20](this[A38](name),fn);return this;};Editor[p6n][c8yy.n9w]=function(name,fn){var k38="_eventNa";var D6n=k38;D6n+=c8yy[73441];D6n+=C8Z;$(this)[c8yy.n9w](this[D6n](name),fn);return this;};Editor[N6n][J38]=function(name,fn){var u38="ntName";var q6n=v38;q6n+=J2Z;q6n+=C8Z;q6n+=u38;var a6n=P8Z;a6n+=f8Z;a6n+=C8Z;$(this)[a6n](this[q6n](name),fn);return this;};Editor[Q6n][t38]=function(){var c38="reo";var h6n=c8yy[404720];h6n+=F6Z;var n6n=P8Z;n6n+=H8Z;n6n+=C8Z;n6n+=f8Z;var T6n=I3Z;T6n+=c38;T6n+=K18;var O6n=I48;O6n+=v8Z;O6n+=A00;O6n+=D4Z;var that=this;this[F70]();this[O6n](function(){c8yy.S15();var F6n=c8yy[653894];F6n+=X40;F6n+=d2Z;that[v8Z][u40][F6n](that,function(){var M38="earDynamicInfo";var z6n=c8yy[73441];z6n+=c8yy[74252];z6n+=U4Z;z6n+=f8Z;var L6n=r4Z;L6n+=C8Z;L6n+=E38;var i6n=g38;c8yy.S15();i6n+=M38;that[i6n]();that[L6n](x38,[z6n]);});});var ret=this[T6n](c88);if(!ret){return this;}this[v8Z][u40][n6n](this,this[h6n][y30],function(){var Z38='opened';var W38="event";var R6n=K38;R6n+=f8Z;var w6n=c8yy[73441];w6n+=c8yy[74252];w6n+=U4Z;w6n+=f8Z;var P6n=r4Z;P6n+=W38;var l6n=o1Z;l6n+=c8yy[653894];l6n+=w1Z;l6n+=v8Z;var r6n=P8Z;r6n+=s1Z;r6n+=c8yy[404720];r6n+=V20;that[s48]($[v18](that[v8Z][r6n],function(name){var s6n=o70;s6n+=v8Z;c8yy.g15();return that[v8Z][s6n][name];}),that[v8Z][H38][l6n]);that[P6n](Z38,[w6n,that[v8Z][R6n]]);});this[B00](c88,g6Z);return this;};Editor[t9Z][q70]=function(set){var m38="sort";var U38="rder";var p38="All fields, and no additional fields, must be provided for ordering.";var C7n=P8Z;C7n+=U38;var V7n=r7Z;V7n+=S38;var X7n=v8Z;X7n+=P8Z;X7n+=s1Z;X7n+=c8yy[20443];var b7n=P8Z;b7n+=s1Z;b7n+=c8yy[404720];c8yy.g15();b7n+=V20;if(!set){var G6n=P8Z;G6n+=u70;G6n+=C8Z;G6n+=s1Z;return this[v8Z][G6n];}if(arguments[M6Z] && !Array[y10](set)){var d6n=c8yy[653894];d6n+=c8yy[74252];d6n+=b8Z;d6n+=b8Z;var Y6n=j38;Y6n+=C8Z;var B6n=H8Z;B6n+=m2Z;B6n+=U3Z;B6n+=o2Z;set=Array[B6n][Y6n][d6n](arguments);}if(this[v8Z][b7n][k9Z]()[m38]()[o38](e38) !== set[k9Z]()[X7n]()[V7n](e38)){throw p38;}$[X50](this[v8Z][C7n],set);this[F70]();return this;};Editor[t9Z][f7n]=function(items,arg1,arg2,arg3,arg4){var i38='node';var a38="odifi";var D38="nitRe";var g7n=c8yy[404720];g7n+=w7Z;g7n+=c8yy[74252];var E7n=U4Z;E7n+=D38;E7n+=N38;var c7n=f8Z;c7n+=P8Z;c7n+=f8Z;c7n+=C8Z;var t7n=Y1Z;t7n+=b4Z;c8yy.S15();t7n+=b8Z;t7n+=C8Z;var u7n=o1Z;u7n+=e1Z;var v7n=u88;v7n+=J70;var J7n=c8yy[73441];J7n+=a38;J7n+=C8Z;J7n+=s1Z;var k7n=e9Z;k7n+=P8Z;k7n+=J2Z;k7n+=C8Z;var A7n=o3Z;A7n+=q38;A7n+=G70;var y7n=b8Z;y7n+=Q38;y7n+=C6Z;var I7n=r4Z;I7n+=H2Z;I7n+=c8yy[404720];I7n+=b4Z;var that=this;if(this[I7n](function(){that[O38](items,arg1,arg2,arg3,arg4);})){return this;}if(items[y7n] === undefined){items=[items];}var argOpts=this[t88](arg1,arg2,arg3,arg4);var editFields=this[A7n](F38,items);this[v8Z][Z90]=k7n;this[v8Z][J7n]=items;this[v8Z][v7n]=editFields;this[r0Z][u7n][t7n][v80]=c7n;this[E88]();this[T80](E7n,[_pluck(editFields,i38),_pluck(editFields,g7n),items],function(){c8yy.S15();var L38='initMultiRemove';that[T80](L38,[editFields,items],function(){var z38="ocus";var T38="Op";var n38="ybe";var W7n=c8yy.L9w;W7n+=z38;var K7n=A88;K7n+=T38;K7n+=a80;var x7n=Q50;x7n+=n38;x7n+=h38;x7n+=f8Z;var M7n=Y10;M7n+=c8yy[20443];M7n+=v8Z;that[H18]();that[Z88](argOpts[M7n]);argOpts[x7n]();var opts=that[v8Z][K7n];if(opts[W7n] !== O0Z){var S7n=c8yy.L9w;S7n+=P8Z;S7n+=c8yy[653894];S7n+=X80;var U7n=V00;U7n+=w1Z;U7n+=v8Z;var Z7n=v1Z;Z7n+=w1Z;Z7n+=r38;Z7n+=T1Z;var H7n=v1Z;H7n+=w1Z;H7n+=c8yy[20443];H7n+=s38;$(H7n,that[r0Z][Z7n])[z00](opts[U7n])[S7n]();}});});return this;};Editor[t9Z][y5Z]=function(set,val){var that=this;if(!$[d70](set)){var o={};o[set]=val;set=o;}$[N80](set,function(n,v){that[o70](n)[y5Z](v);});return this;};Editor[t9Z][l38]=function(names,animate){var that=this;c8yy.S15();$[N80](this[X88](names),function(i,n){var m7n=v8Z;m7n+=C6Z;c8yy.g15();m7n+=V50;var j7n=c8yy.L9w;j7n+=I0Z;j7n+=a2Z;that[j7n](n)[m7n](animate);});return this;};Editor[t9Z][U90]=function(successCallback,errorCallback,formatdata,hide){var q7n=C8Z;q7n+=f88;var e7n=K38;e7n+=f8Z;var o7n=j10;o7n+=C8Z;o7n+=a2Z;o7n+=v8Z;var that=this,fields=this[v8Z][o7n],errorFields=[],errorReady=R0w,sent=g6Z;if(this[v8Z][L80] || !this[v8Z][e7n]){return this;}this[P38](H6Z);var send=function(){var w38="initSu";var N7n=w38;N7n+=R38;var D7n=r4Z;D7n+=C8Z;D7n+=E38;var p7n=g70;p7n+=C6Z;if(errorFields[p7n] !== errorReady || sent){return;}that[D7n](N7n,[that[v8Z][Z90]],function(result){var a7n=R4Z;a7n+=G4Z;a7n+=B4Z;if(result === g6Z){that[P38](g6Z);return;}sent=H6Z;that[a7n](successCallback,errorCallback,formatdata,hide);});};this[Q6Z]();$[q7n](fields,function(name,field){c8yy.g15();if(field[Q18]()){errorFields[f6Z](name);}});$[N80](errorFields,function(i,name){var Q7n=V20;Q7n+=G38;c8yy.S15();fields[name][Q7n](h5Z,function(){errorReady++;send();});});send();return this;};Editor[O7n][F7n]=function(set){var Y38="late";var B38="mplate";var L7n=Z4Z;c8yy.S15();L7n+=B38;if(set === undefined){var i7n=t2Z;i7n+=H8Z;i7n+=Y38;return this[v8Z][i7n];}this[v8Z][L7n]=set === O0Z?O0Z:$(set);return this;};Editor[t9Z][z7n]=function(title){var l7n=d38;l7n+=f8Z;l7n+=q90;var r7n=C6Z;r7n+=Z1Z;var h7n=c8yy[653894];h7n+=R0Z;h7n+=n10;var n7n=c8yy[404720];n7n+=U4Z;n7n+=b28;var T7n=i60;T7n+=c8yy[74252];T7n+=c8yy[404720];T7n+=V20;var header=$(this[r0Z][T7n])[P40](n7n + this[h7n][r7n][l40]);if(title === undefined){var s7n=C6Z;s7n+=M80;s7n+=b8Z;return header[s7n]();}if(typeof title === l7n){var w7n=c8yy[20443];w7n+=a9Z;w7n+=e10;var P7n=l7Z;P7n+=P7Z;title=title(this,new DataTable[P7n](this[v8Z][w7n]));}header[L10](title);return this;};Editor[R7n][G7n]=function(field,value){c8yy.g15();if(value !== undefined || $[d70](field)){var B7n=v8Z;B7n+=C8Z;B7n+=c8yy[20443];return this[B7n](field,value);}return this[k90](field);;};var apiRegister=DataTable[D10][Y7n];function __getInst(api){c8yy.S15();var V28="context";var X28="oIn";var b0n=A88;b0n+=Q2Z;var d7n=X28;d7n+=U4Z;d7n+=c8yy[20443];var ctx=api[V28][R0w];return ctx[d7n][b0n] || ctx[C28];}function __setBasic(inst,opts,type,plural){var J28=/%d/;var I28='_basic';var v28='1';var V0n=f28;V0n+=e10;var X0n=v1Z;X0n+=A1Z;X0n+=v2Z;X0n+=k00;if(!opts){opts={};}if(opts[X0n] === undefined){opts[m48]=I28;}c8yy.S15();if(opts[V0n] === undefined){var I0n=H2Z;I0n+=y28;I0n+=C8Z;var f0n=U4Z;f0n+=P9w;f0n+=m5Z;f0n+=f8Z;var C0n=f28;C0n+=b8Z;C0n+=C8Z;opts[C0n]=inst[f0n][type][I0n];}if(opts[n00] === undefined){var y0n=e9Z;y0n+=P8Z;y0n+=g2Z;if(type === y0n){var k0n=G48;k0n+=W5Z;var A0n=U4Z;A0n+=A28;var confirm=inst[A0n][type][k28];opts[k0n]=plural !== G0w?confirm[r4Z][d80](J28,plural):confirm[v28];}else {opts[n00]=h5Z;}}return opts;}apiRegister(J0n,function(){c8yy.g15();return __getInst(this);});apiRegister(u28,function(opts){var v0n=Y48;v0n+=w7Z;v0n+=C8Z;var inst=__getInst(this);inst[v0n](__setBasic(inst,opts,Q0Z));return this;});apiRegister(u0n,function(opts){var t0n=C8Z;t0n+=c8yy[404720];t0n+=U4Z;t0n+=c8yy[20443];var inst=__getInst(this);inst[t0n](this[R0w][R0w],__setBasic(inst,opts,O48));return this;});apiRegister(c0n,function(opts){var E0n=F1Z;E0n+=I2Z;c8yy.g15();var inst=__getInst(this);inst[A88](this[R0w],__setBasic(inst,opts,E0n));return this;});apiRegister(t28,function(opts){var c28="emove";var g0n=s1Z;g0n+=c28;var inst=__getInst(this);inst[g0n](this[R0w][R0w],__setBasic(inst,opts,E28,G0w));return this;});apiRegister(g28,function(opts){var x0n=Z9Z;x0n+=u6Z;c8yy.g15();var M0n=E90;M0n+=C8Z;var inst=__getInst(this);inst[O38](this[R0w],__setBasic(inst,opts,M0n,this[R0w][x0n]));return this;});apiRegister(K0n,function(type,opts){if(!type){type=l48;}else if($[d70](type)){opts=type;type=l48;}__getInst(this)[type](this[R0w][R0w],opts);c8yy.g15();return this;});apiRegister(M28,function(opts){__getInst(this)[Y70](this[R0w],opts);return this;});apiRegister(x28,_api_file);apiRegister(K28,_api_files);$(document)[c8yy.n9w](W0n,function(e,ctx,json){var H28='dt';if(e[W28] !== H28){return;}if(json && json[I6Z]){var H0n=Z6Z;H0n+=c8yy[653894];H0n+=C6Z;$[H0n](json[I6Z],function(name,files){var Z28="ile";var U0n=c8yy.L9w;U0n+=Z28;U0n+=v8Z;var Z0n=V8Z;Z0n+=c8yy[20443];Z0n+=S8Z;if(!Editor[I6Z][name]){Editor[I6Z][name]={};}c8yy.S15();$[Z0n](Editor[U0n][name],files);});}});Editor[Q6Z]=function(msg,tn){var U28=' For more information, please refer to https://datatables.net/tn/';throw tn?msg + U28 + tn:msg;};Editor[S28]=function(data,props,fn){var m0n=x4Z;m0n+=C8Z;var j0n=b8Z;j0n+=c8yy[74252];j0n+=m7Z;var S0n=V8Z;S0n+=Z4Z;S0n+=a40;var i,ien,dataPoint;props=$[S0n]({label:j0n,value:m0n},props);if(Array[y10](data)){var o0n=g70;o0n+=C6Z;for((i=R0w,ien=data[o0n]);i < ien;i++){dataPoint=data[i];if($[d70](dataPoint)){fn(dataPoint[props[j28]] === undefined?dataPoint[props[E80]]:dataPoint[props[j28]],dataPoint[props[E80]],i,dataPoint[L90]);}else {fn(dataPoint,dataPoint,i);}}}else {i=R0w;$[N80](data,function(key,val){fn(val,key,i);c8yy.S15();i++;});}};Editor[e0n]=function(id){c8yy.S15();return id[d80](/\./g,e38);};Editor[m28]=function(editor,conf,files,progressCallback,completeCallback){var N28="ReadT";var Q28="onload";var e58="imi";var a28='A server error occurred while uploading the file';var D28="tLeft";var o28="readAsDataU";var q28="<i>Uploading file</i>";var p58="tLef";var p28="_l";var D9n=o28;D9n+=e28;D9n+=l50;var o9n=p28;o9n+=U4Z;o9n+=O90;o9n+=D28;var m9n=c8yy[73441];m9n+=c8yy[74252];m9n+=H8Z;var N0n=D2Z;N0n+=N28;N0n+=V8Z;N0n+=c8yy[20443];var D0n=c8yy[74252];D0n+=z3Z;var p0n=C8Z;c8yy.g15();p0n+=T9Z;var reader=new FileReader();var counter=R0w;var ids=[];var generalError=a28;editor[p0n](conf[J0Z],h5Z);if(typeof conf[D0n] === f9Z){conf[i70](files,function(ids){c8yy.g15();completeCallback[J9Z](editor,ids);});return;}progressCallback(conf,conf[N0n] || q28);reader[Q28]=function(e){var G28='Upload feature cannot use `ajax.data` with an object. Please use it as a function instead.';var l28='upload';var P28="ajaxData";var R28='No Ajax option specified for upload plug-in';var B28="readAsDataURL";var i28="reUpload";var T28="lainObject";var d28='post';var z28="rin";var O28="preSubmit.DTE_Upl";var s28='uploadField';var r28="oad";var G0n=c8yy[74252];G0n+=z3Z;var R0n=O28;R0n+=F28;R0n+=c8yy[404720];var P0n=H8Z;P0n+=i28;var l0n=d38;l0n+=L28;l0n+=c8yy[20443];l0n+=L40;var s0n=v8Z;s0n+=c8yy[20443];s0n+=z28;s0n+=D4Z;var z0n=o80;z0n+=T28;var i0n=n28;i0n+=a1Z;var F0n=I9Z;F0n+=C8Z;F0n+=f8Z;F0n+=c8yy[404720];var O0n=f8Z;O0n+=c8yy[74252];O0n+=c8yy[73441];O0n+=C8Z;var Q0n=h28;Q0n+=r28;var q0n=c8yy[74252];q0n+=q90;var a0n=I9Z;a0n+=S8Z;var data=new FormData();var ajax;data[a0n](q0n,Q0n);data[x80](s28,conf[O0n]);data[F0n](l28,files[counter]);if(conf[P28]){conf[P28](data,files[counter],counter);}if(conf[i0n]){var L0n=c8yy[74252];L0n+=r7Z;L0n+=w28;ajax=conf[L0n];}else if($[z0n](editor[v8Z][i70])){var h0n=c8yy[74252];h0n+=z3Z;var n0n=F88;n0n+=b8Z;n0n+=r28;var T0n=c8yy[74252];T0n+=z3Z;ajax=editor[v8Z][T0n][n0n]?editor[v8Z][h0n][m28]:editor[v8Z][i70];}else if(typeof editor[v8Z][i70] === Q90){var r0n=c8yy[74252];r0n+=P88;r0n+=a1Z;ajax=editor[v8Z][r0n];}if(!ajax){throw new Error(R28);}if(typeof ajax === s0n){ajax={url:ajax};}if(typeof ajax[k0Z] === l0n){var d={};var ret=ajax[k0Z](d);if(ret !== undefined && typeof ret !== Q90){d=ret;}$[N80](d,function(key,value){c8yy.S15();data[x80](key,value);});}else if($[d70](ajax[k0Z])){throw new Error(G28);}var preRet=editor[T80](P0n,[conf[J0Z],files[counter],data]);if(preRet === g6Z){if(counter < files[M6Z] - G0w){counter++;reader[B28](files[counter]);}else {var w0n=c8yy[653894];w0n+=Y28;completeCallback[w0n](editor,ids);}return;}var submit=g6Z;editor[c8yy.n9w](R0n,function(){submit=H6Z;return g6Z;});$[G0n]($[X50]({},ajax,{type:d28,data:data,dataType:b58,contentType:g6Z,processData:g6Z,xhr:function(){var f58="onpr";var I58="ogres";var C58="ploa";var X58="ajaxSe";var V58="ngs";var t58="onloadend";var Y0n=a1Z;Y0n+=C6Z;Y0n+=s1Z;var B0n=X58;B0n+=r38;B0n+=U4Z;B0n+=V58;var xhr=$[B0n][Y0n]();if(xhr[m28]){var C9n=w1Z;C9n+=C58;C9n+=c8yy[404720];var d0n=f58;d0n+=I58;d0n+=v8Z;xhr[m28][d0n]=function(e){var u58=':';var J58="loaded";var A58="oFixe";var k58="otal";var v58="%";var y58="lengthComputable";if(e[y58]){var V9n=e10;V9n+=f8Z;V9n+=u6Z;var X9n=c8yy[20443];X9n+=A58;X9n+=c8yy[404720];var b9n=c8yy[20443];b9n+=k58;var percent=(e[J58] / e[b9n] * m9w)[X9n](R0w) + v58;progressCallback(conf,files[M6Z] === G0w?percent:counter + u58 + files[V9n] + g0Z + percent);}};xhr[C9n][t58]=function(e){c8yy.S15();var E58='Processing';var c58="processingText";progressCallback(conf,conf[c58] || E58);};}return xhr;},success:function(json){var Z58="Errors";var g58="uplo";var K58='uploadXhrSuccess';var j58="dAsDataURL";var U58="status";var x58='preSubmit.DTE_Upload';var u9n=U4Z;u9n+=c8yy[404720];var v9n=g58;v9n+=c8yy[74252];v9n+=c8yy[404720];var J9n=w1Z;J9n+=M58;var I9n=f8Z;I9n+=c8yy[74252];I9n+=c8yy[73441];I9n+=C8Z;var f9n=r4Z;f9n+=W3Z;f9n+=H3Z;editor[F20](x58);editor[f9n](K58,[conf[I9n],json]);if(json[W58] && json[W58][M6Z]){var A9n=e10;A9n+=H58;var y9n=o70;y9n+=Z58;var errors=json[y9n];for(var i=R0w,ien=errors[A9n];i < ien;i++){editor[Q6Z](errors[i][J0Z],errors[i][U58]);}}else if(json[Q6Z]){var k9n=D18;k9n+=s1Z;editor[k9n](json[Q6Z]);}else if(!json[J9n] || !json[v9n][u9n]){editor[Q6Z](conf[J0Z],generalError);}else {var W9n=e10;W9n+=H58;var K9n=U4Z;K9n+=c8yy[404720];var x9n=w1Z;x9n+=G50;x9n+=F28;x9n+=c8yy[404720];var t9n=j10;t9n+=b8Z;t9n+=K4Z;if(json[t9n]){var E9n=c8yy.L9w;E9n+=U4Z;E9n+=k6Z;var c9n=Z6Z;c9n+=Q1Z;$[c9n](json[E9n],function(table,files){var S58="iles";var g9n=D2Z;g9n+=v8Z;if(!Editor[g9n][table]){var M9n=c8yy.L9w;M9n+=S58;Editor[M9n][table]={};}$[X50](Editor[I6Z][table],files);});}ids[f6Z](json[x9n][K9n]);if(counter < files[W9n] - G0w){var H9n=s1Z;H9n+=Z6Z;H9n+=j58;counter++;reader[H9n](files[counter]);}else {var Z9n=c8yy[653894];Z9n+=Y2Z;Z9n+=b8Z;completeCallback[Z9n](editor,ids);if(submit){editor[U90]();}}}progressCallback(conf);},error:function(xhr){var o58='uploadXhrError';var j9n=m58;j9n+=C8Z;var S9n=r4Z;S9n+=M70;S9n+=l2Z;var U9n=C8Z;U9n+=s1Z;U9n+=s1Z;U9n+=Q2Z;editor[U9n](conf[J0Z],generalError);editor[S9n](o58,[conf[j9n],xhr]);c8yy.g15();progressCallback(conf);}}));};files=$[m9n](files,function(val){c8yy.g15();return val;});if(conf[o9n] !== undefined){var p9n=p28;p9n+=e58;p9n+=p58;p9n+=c8yy[20443];var e9n=D58;e9n+=N58;files[e9n](conf[p9n],files[M6Z]);}reader[D9n](files[R0w]);};Editor[N9n][a9n]=function(init){var g68="rap";var x68="uni";var R58="ead";var I68="\" cl";var M68="iv c";var n58="Ta";var Y68='form_content';var r68="BUT";var K68="detac";var r58="\"></";var y68="ass=\"";var z58="dy_con";var E68="\" class=\"";var P68="ools";var G58="<div data-dte-e=\"form_i";var s68="ONS";var L68='<div data-dte-e="form_error" class="';var o68="Url";var s58="div><";var l58="/div>";var i58="ces";var V68="iv clas";var f68="v data-dte-e=\"foot";var i68='<div data-dte-e="form_content" class="';var q58="xhr.";var T68='<div data-dte-e="form_buttons" class="';var B58="nfo\" class=\"";var v68="dicator";var H68="yAjax";var Z68="ormOp";var a58="trigge";var Y58="</f";var b78='processing';var J68="\"body_content\" ";var N68="domTable";var O58="init.dt";var D68="actionName";var F68="tag";var X68="><";var z68='<div data-dte-e="head" class="';var P58="div c";var c78='initEditor';var c68="a-dte-e=\"processing";var q68='<div data-dte-e="body" class="';var X78="unique";var u68="proces";var t68="<div dat";var l68="TableT";var B68="formContent";var e68="bTable";var O68='<form data-dte-e="form" class="';var W68="legac";var t78='initComplete';var Q58="dt.dte";var V1y=a58;V1y+=s1Z;var w8y=q58;w8y+=Q58;var P8y=P8Z;P8y+=f8Z;var h8y=O58;h8y+=F58;var n8y=c8yy.L9w;n8y+=U4Z;n8y+=u5Z;n8y+=v8Z;var T8y=H8Z;T8y+=L18;T8y+=i58;T8y+=L58;var z8y=t90;z8y+=z58;z8y+=f30;var L8y=o1Z;L8y+=P8Z;L8y+=c8yy[20443];var i8y=b30;i8y+=n7Z;var F8y=c8yy[404720];F8y+=P8Z;F8y+=c8yy[73441];var N8y=T58;N8y+=c8yy[20443];N8y+=v8Z;var D8y=C8Z;D8y+=c8yy[74252];D8y+=Q1Z;var U8y=k0Z;U8y+=n58;U8y+=N8Z;var Z8y=h58;Z8y+=r38;Z8y+=P8Z;Z8y+=k00;var H8y=r58;H8y+=s58;H8y+=l58;var W8y=i60;W8y+=c8yy[74252];W8y+=c8yy[404720];W8y+=V20;var K8y=M00;K8y+=P58;K8y+=R0Z;K8y+=w58;var x8y=z7Z;x8y+=c8yy[74252];x8y+=H8Z;x8y+=n7Z;var M8y=C6Z;M8y+=R58;M8y+=C8Z;M8y+=s1Z;var g8y=c8yy.L9w;g8y+=Q2Z;g8y+=c8yy[73441];var E8y=G58;E8y+=B58;var c8y=Y58;c8y+=d58;c8y+=R6Z;var t8y=b68;t8y+=l2Z;var u8y=c8yy.L9w;u8y+=d58;var v8y=Y6Z;v8y+=X68;v8y+=o40;v8y+=R6Z;var J8y=B60;J8y+=c8yy[20443];var k8y=h6Z;k8y+=c8yy[404720];k8y+=V68;k8y+=w58;var A8y=Y6Z;A8y+=R6Z;var y8y=m4Z;y8y+=s1Z;y8y+=T7Z;y8y+=n7Z;var I8y=o1Z;I8y+=P8Z;I8y+=Z4Z;I8y+=s1Z;var f8y=C68;f8y+=f68;f8y+=I68;f8y+=y68;var C8y=h6Z;C8y+=A68;C8y+=v7Z;var V8y=k68;V8y+=c8yy[20443];V8y+=l2Z;var X8y=I7Z;X8y+=J68;X8y+=F7Z;var b8y=Y6Z;b8y+=R6Z;var d9n=U4Z;d9n+=f8Z;d9n+=v68;var Y9n=u68;Y9n+=v8Z;Y9n+=U4Z;Y9n+=C3Z;var B9n=t68;B9n+=c68;B9n+=E68;var G9n=m4Z;G9n+=g68;G9n+=n7Z;var R9n=o7Z;R9n+=M68;R9n+=R0Z;R9n+=w58;var w9n=c8yy[404720];w9n+=F6Z;var P9n=x68;P9n+=G88;P9n+=C8Z;var l9n=D1Z;l9n+=c8yy[404720];l9n+=I1Z;l9n+=v8Z;var s9n=U4Z;s9n+=P9w;s9n+=m5Z;s9n+=f8Z;var r9n=K68;r9n+=C6Z;var h9n=W68;h9n+=H68;var n9n=c8yy.L9w;n9n+=Z68;n9n+=c8yy[20443];n9n+=U68;var T9n=E60;T9n+=c8yy[73441];T9n+=b8Z;var z9n=S68;z9n+=q38;z9n+=j68;var L9n=k0Z;L9n+=m68;L9n+=s1Z;L9n+=i58;var i9n=D70;i9n+=v1Z;i9n+=b8Z;i9n+=C8Z;var F9n=i70;F9n+=o68;var O9n=c8yy[404720];O9n+=e68;var Q9n=p68;Q9n+=b8Z;Q9n+=v8Z;var q9n=C8Z;q9n+=n1Z;q9n+=S8Z;init=$[X50](H6Z,{},Editor[d7Z],init);this[v8Z]=$[q9n](H6Z,{},Editor[Q9n][C0Z],{actionName:init[D68],table:init[N68] || init[N10],dbTable:init[O9n] || O0Z,ajaxUrl:init[F9n],ajax:init[i70],idSrc:init[a68],dataSource:init[N68] || init[i9n]?Editor[L9n][X70]:Editor[z9n][T9n],formOptions:init[n9n],legacyAjax:init[h9n],template:init[C18]?$(init[C18])[r9n]():O0Z});this[W9Z]=$[X50](H6Z,{},Editor[W9Z]);this[s9n]=init[Y7Z];Editor[l9n][C0Z][P9n]++;var that=this;var classes=this[W9Z];this[w9n]={"wrapper":$(R9n + classes[G9n] + W0Z + B9n + classes[Y9n][d9n] + q0Z + q68 + classes[y60][y30] + b8y + X8y + classes[y60][V8y] + U0Z + C8y + f8y + classes[I8y][y8y] + A8y + k8y + classes[Q68][J8y] + v8y + p0Z + p0Z)[R0w],"form":$(O68 + classes[u8y][F68] + W0Z + i68 + classes[T00][t8y] + U0Z + c8y)[R0w],"formError":$(L68 + classes[T00][Q6Z] + U0Z)[R0w],"formInfo":$(E8y + classes[g8y][o0Z] + U0Z)[R0w],"header":$(z68 + classes[M8y][x8y] + K8y + classes[W8y][l40] + H8y)[R0w],"buttons":$(T68 + classes[T00][Z8y] + U0Z)[R0w]};if($[s5Z][U8y][n68]){var e8y=e9Z;e8y+=h68;var o8y=C8Z;o8y+=J10;o8y+=c8yy[20443];var m8y=r68;m8y+=t8Z;m8y+=s68;var j8y=l68;j8y+=P68;var S8y=c8yy.L9w;S8y+=f8Z;var ttButtons=$[S8y][X70][j8y][m8y];var i18n=this[Y7Z];$[N80]([Q0Z,o8y,e8y],function(i,val){var R68='editor_';var w68="sButtonTe";var p8y=w68;p8y+=n1Z;ttButtons[R68 + val][p8y]=i18n[val][w2Z];});}$[D8y](init[N8y],function(evt,fn){var a8y=P8Z;c8yy.S15();a8y+=f8Z;that[a8y](evt,function(){var G68="shift";var O8y=c8yy[74252];O8y+=H8Z;O8y+=G50;c8yy.S15();O8y+=b4Z;var Q8y=c8yy[653894];Q8y+=c8yy[74252];Q8y+=b8Z;Q8y+=b8Z;var q8y=j38;q8y+=C8Z;var args=Array[t9Z][q8y][Q8y](arguments);args[G68]();fn[O8y](that,args);});});var dom=this[F8y];var wrapper=dom[i8y];dom[B68]=_editor_el(Y68,dom[T00])[R0w];dom[Q68]=_editor_el(L8y,wrapper)[R0w];dom[y60]=_editor_el(o30,wrapper)[R0w];dom[d68]=_editor_el(z8y,wrapper)[R0w];dom[T8y]=_editor_el(b78,wrapper)[R0w];if(init[n8y]){this[K70](init[Z70]);}$(document)[c8yy.n9w](h8y + this[v8Z][X78],function(e,settings,json){var V78="nTable";var l8y=D4Z;l8y+=C8Z;l8y+=c8yy[20443];var s8y=D70;s8y+=F80;s8y+=C8Z;var r8y=c8yy[20443];r8y+=a9Z;r8y+=b8Z;r8y+=C8Z;if(that[v8Z][r8y] && settings[V78] === $(that[v8Z][s8y])[l8y](R0w)){settings[C28]=that;}})[P8y](w8y + this[v8Z][X78],function(e,settings,json){var C78="Tab";var f78="tab";var B8y=c8yy[20443];B8y+=c8yy[74252];B8y+=v1Z;B8y+=e10;var G8y=f8Z;G8y+=C78;G8y+=e10;var R8y=f78;R8y+=b8Z;R8y+=C8Z;if(json && that[v8Z][R8y] && settings[G8y] === $(that[v8Z][B8y])[k90](R0w)){that[I78](json);}});try{var b1y=W7Z;b1y+=U4Z;b1y+=c8yy[20443];var d8y=c8yy[404720];d8y+=U4Z;d8y+=y78;d8y+=b4Z;var Y8y=c8yy[404720];Y8y+=A78;Y8y+=G50;Y8y+=F4Z;this[v8Z][u40]=Editor[Y8y][init[d8y]][b1y](this);}catch(e){var u78="play controller ";var J78=" fi";var v78="nd dis";var k78="Cannot";var X1y=k78;X1y+=J78;X1y+=v78;X1y+=u78;throw X1y + init[v80];}this[T80](t78,[]);$(document)[V1y](c78,[this]);};Editor[t9Z][C1y]=function(){var g78="emoveCla";var x78="ddCl";var E78="reat";var M78="actions";var v1y=s1Z;v1y+=C8Z;v1y+=c8yy[73441];v1y+=h68;var A1y=c8yy[653894];A1y+=s1Z;A1y+=I88;A1y+=C8Z;var y1y=c8yy[653894];y1y+=E78;y1y+=C8Z;var I1y=s1Z;I1y+=g78;I1y+=r3Z;var f1y=K38;f1y+=f8Z;var classesActions=this[W9Z][M78];var action=this[v8Z][f1y];var wrapper=$(this[r0Z][y30]);wrapper[I1y]([classesActions[y1y],classesActions[A88],classesActions[O38]][o38](g0Z));if(action === A1y){var k1y=c8yy[653894];k1y+=E78;k1y+=C8Z;wrapper[K9Z](classesActions[k1y]);}else if(action === A88){var J1y=c8yy[74252];J1y+=x78;J1y+=c8yy[74252];J1y+=r3Z;wrapper[J1y](classesActions[A88]);}else if(action === v1y){wrapper[K9Z](classesActions[O38]);}};Editor[u1y][t1y]=function(data,success,error,submitParams){var r78="url";var V08='?';var K78="elete";var W78="B";var U78="sAr";var s78="complete";var X08="param";var Y78="deleteBody";var i78="rl";var S78="dSrc";var H78="DELET";var L78="xUrl";var l78="mple";var G78="unshif";var F78=',';var T78=/_id_/;var z78="lit";var O78="ajaxUrl";var n78="xO";var n1y=c8yy[404720];n1y+=K78;n1y+=W78;n1y+=M60;var T1y=H78;T1y+=u1Z;var z1y=c8yy[20443];z1y+=b4Z;z1y+=H8Z;z1y+=C8Z;var L1y=S68;L1y+=c8yy[74252];var F1y=S68;F1y+=c8yy[74252];var O1y=w1Z;O1y+=s1Z;O1y+=b8Z;var Q1y=w1Z;Q1y+=s1Z;Q1y+=b8Z;var m1y=B80;m1y+=C3Z;var Z1y=Z78;Z1y+=H2Z;Z1y+=P8Z;Z1y+=f8Z;var H1y=U4Z;H1y+=U78;H1y+=D80;var W1y=U4Z;W1y+=S78;var K1y=C8Z;K1y+=J10;K1y+=c8yy[20443];var that=this;var action=this[v8Z][Z90];var thrown;var opts={type:N88,dataType:b58,data:O0Z,error:[function(xhr,text,err){c8yy.S15();thrown=err;}],success:[],complete:[function(xhr,text){var D78="onseTe";var a78="responseJSON";var q78="parseJSON";var p78="resp";var o9w=204;var Q78="sta";var e78='null';var m78="eText";var N78="onseJSO";var o78="tus";var j78="spon";var E1y=g10;E1y+=j78;E1y+=v8Z;E1y+=m78;var c1y=v8Z;c1y+=D70;c1y+=o78;var json=O0Z;if(xhr[c1y] === o9w || xhr[E1y] === e78){json={};}else {try{var M1y=p78;M1y+=D78;M1y+=a1Z;M1y+=c8yy[20443];var g1y=p78;g1y+=N78;g1y+=V4Z;json=xhr[a78]?xhr[g1y]:$[q78](xhr[M1y]);}catch(e){}}if($[d70](json) || Array[y10](json)){var x1y=Q78;x1y+=o78;success(json,xhr[x1y] >= e9w,xhr);}else {error(xhr,text,thrown);}}]};var a;var ajaxSrc=this[v8Z][i70] || this[v8Z][O78];var id=action === K1y || action === E28?_pluck(this[v8Z][p70],W1y):O0Z;if(Array[H1y](id)){id=id[o38](F78);}if($[d70](ajaxSrc) && ajaxSrc[action]){ajaxSrc=ajaxSrc[action];}if(typeof ajaxSrc === Z1y){var U1y=L70;U1y+=w28;U1y+=J4Z;U1y+=i78;var uri=O0Z;var method=O0Z;if(this[v8Z][U1y]){var S1y=n28;S1y+=L78;var url=this[v8Z][S1y];if(url[V88]){uri=url[action];}if(uri[H48](g0Z) !== -G0w){var j1y=M40;j1y+=z78;a=uri[j1y](g0Z);method=a[R0w];uri=a[G0w];}uri=uri[d80](T78,id);}ajaxSrc(method,uri,data,success,error);return;}else if(typeof ajaxSrc === m1y){var o1y=e48;o1y+=C8Z;o1y+=n78;o1y+=c8yy.L9w;if(ajaxSrc[o1y](g0Z) !== -G0w){a=ajaxSrc[h78](g0Z);opts[w4Z]=a[R0w];opts[r78]=a[G0w];}else {opts[r78]=ajaxSrc;}}else {var N1y=V20;N1y+=G38;var optsCopy=$[X50]({},ajaxSrc || ({}));if(optsCopy[s78]){var D1y=R5Z;D1y+=l78;D1y+=c8yy[20443];D1y+=C8Z;var p1y=w1Z;p1y+=k00;p1y+=g00;p1y+=P78;var e1y=R5Z;e1y+=w78;e1y+=R78;opts[e1y][p1y](optsCopy[D1y]);delete optsCopy[s78];}if(optsCopy[N1y]){var q1y=G78;q1y+=c8yy[20443];var a1y=V20;a1y+=s1Z;a1y+=P8Z;a1y+=s1Z;opts[a1y][q1y](optsCopy[Q6Z]);delete optsCopy[Q6Z];}opts=$[X50]({},opts,optsCopy);}opts[Q1y]=opts[O1y][d80](T78,id);c8yy.g15();if(opts[F1y]){var i1y=B78;i1y+=D70;var isFn=typeof opts[i1y] === f9Z;var newData=isFn?opts[k0Z](data):opts[k0Z];data=isFn && newData?newData:$[X50](H6Z,data,newData);}opts[L1y]=data;if(opts[z1y] === T1y && (opts[Y78] === undefined || opts[n1y] === H6Z)){var s1y=c8yy[404720];s1y+=c8yy[74252];s1y+=c8yy[20443];s1y+=c8yy[74252];var r1y=d78;r1y+=b08;var h1y=r70;h1y+=b8Z;var params=$[X08](opts[k0Z]);opts[h1y]+=opts[r78][r1y](V08) === -G0w?V08 + params:X10 + params;delete opts[s1y];}$[i70](opts);};Editor[l1y][P1y]=function(target,style,time,callback){c8yy.g15();var w1y=c8yy.L9w;w1y+=f8Z;if($[w1y][q10]){var G1y=c8yy[74252];G1y+=f8Z;G1y+=j30;G1y+=Z4Z;var R1y=Y1Z;R1y+=Y10;target[R1y]()[G1y](style,time,callback);}else {var Y1y=c9Z;Y1y+=q90;var B1y=c8yy[653894];B1y+=v8Z;B1y+=v8Z;target[B1y](style);if(typeof time === Y1y){time[J9Z](target);}else if(callback){var d1y=c8yy[653894];d1y+=Y28;callback[d1y](target);}}};Editor[t9Z][b4y]=function(){var f08="repend";var y4y=o1Z;y4y+=s1Z;y4y+=c8yy[73441];var I4y=C08;I4y+=P8Z;I4y+=f8Z;I4y+=v8Z;var f4y=c8yy.L9w;f4y+=d58;f4y+=u00;var C4y=T7Z;C4y+=H8Z;C4y+=S8Z;var V4y=H8Z;V4y+=f08;var X4y=c8yy[404720];X4y+=P8Z;X4y+=c8yy[73441];var dom=this[X4y];$(dom[y30])[V4y](dom[C70]);c8yy.g15();$(dom[Q68])[C4y](dom[f4y])[x80](dom[I4y]);$(dom[d68])[x80](dom[r00])[x80](dom[y4y]);};Editor[A4y][P70]=function(){var I08="preBlu";var A08="onBlur";var y08="ditOp";var k08="bmi";var t4y=X5Z;t4y+=c8yy[73441];t4y+=U4Z;t4y+=c8yy[20443];var u4y=d38;u4y+=f8Z;u4y+=c8yy.T9w;u4y+=c8yy.n9w;var v4y=I08;v4y+=s1Z;var J4y=r4Z;J4y+=W3Z;J4y+=f8Z;J4y+=c8yy[20443];var k4y=C8Z;k4y+=y08;k4y+=a80;var opts=this[v8Z][k4y];var onBlur=opts[A08];if(this[J4y](v4y) === g6Z){return;}if(typeof onBlur === u4y){onBlur(this);}else if(onBlur === t4y){var c4y=v8Z;c4y+=w1Z;c4y+=k08;c4y+=c8yy[20443];this[c4y]();}else if(onBlur === E40){var E4y=r4Z;E4y+=C50;E4y+=v8Z;E4y+=C8Z;this[E4y]();}};Editor[t9Z][G00]=function(errorsOnly){var J08="rapper";var x4y=m4Z;x4y+=J08;var M4y=c8yy.L9w;M4y+=I0Z;M4y+=b8Z;M4y+=X8Z;var g4y=c8yy.L9w;g4y+=U4Z;c8yy.g15();g4y+=I1Z;g4y+=c8yy[404720];if(!this[v8Z]){return;}var errorClass=this[W9Z][g4y][Q6Z];var fields=this[v8Z][M4y];if(errorsOnly === undefined){errorsOnly=g6Z;}$(v08 + errorClass,this[r0Z][x4y])[n9Z](errorClass);$[N80](fields,function(name,field){field[Q6Z](h5Z);c8yy.S15();if(!errorsOnly){field[n00](h5Z);}});this[Q6Z](h5Z);if(!errorsOnly){var K4y=O88;K4y+=v8Z;K4y+=d8Z;this[K4y](h5Z);}};Editor[W4y][u08]=function(submitComplete,mode){var g08="eIcb";var c08="us.editor-fo";var x08='preClose';var H08="seIcb";var M08="eC";var K08="closeCb";var W08="seIc";var D4y=r4Z;D4y+=T58;D4y+=c8yy[20443];var p4y=F2Z;p4y+=t08;var e4y=V00;e4y+=c08;e4y+=f00;c8yy.S15();var o4y=P8Z;o4y+=E08;var m4y=v1Z;m4y+=P8Z;m4y+=c8yy[404720];m4y+=b4Z;var U4y=C50;U4y+=v8Z;U4y+=g08;var H4y=U6Z;H4y+=L30;H4y+=M08;H4y+=v1Z;var closed;if(this[T80](x08) === g6Z){return;}if(this[v8Z][H4y]){var Z4y=b5Z;Z4y+=M08;Z4y+=v1Z;closed=this[v8Z][Z4y](submitComplete,mode);this[v8Z][K08]=O0Z;}if(this[v8Z][U4y]){var j4y=U6Z;j4y+=P8Z;j4y+=W08;j4y+=v1Z;var S4y=C50;S4y+=H08;this[v8Z][S4y]();this[v8Z][j4y]=O0Z;}$(m4y)[o4y](e4y);this[v8Z][p4y]=g6Z;this[D4y](E40);if(closed){var N4y=v38;N4y+=J2Z;N4y+=h1Z;N4y+=c8yy[20443];this[N4y](x38,[closed]);}};Editor[a4y][Z08]=function(fn){var U08="Cb";var q4y=b5Z;c8yy.g15();q4y+=C8Z;q4y+=U08;this[v8Z][q4y]=fn;};Editor[Q4y][O4y]=function(arg1,arg2,arg3,arg4){var S08="olea";var j08="main";var z4y=U8Z;z4y+=C8Z;z4y+=f8Z;z4y+=c8yy[404720];var F4y=v1Z;F4y+=P8Z;F4y+=S08;F4y+=f8Z;var that=this;var title;var buttons;c8yy.g15();var show;var opts;if($[d70](arg1)){opts=arg1;}else if(typeof arg1 === F4y){show=arg1;opts=arg2;;}else {title=arg1;buttons=arg2;show=arg3;opts=arg4;;}if(show === undefined){show=H6Z;}if(title){var i4y=f28;i4y+=b8Z;i4y+=C8Z;that[i4y](title);}if(buttons){var L4y=h58;L4y+=c8yy[20443];L4y+=v2Z;L4y+=k00;that[L4y](buttons);}return {opts:$[z4y]({},this[v8Z][t40][j08],opts),maybeOpen:function(){if(show){that[t38]();}}};};Editor[t9Z][T4y]=function(name){var r4y=k0Z;r4y+=m68;r4y+=m08;r4y+=C8Z;var h4y=B40;h4y+=U4Z;h4y+=P78;var n4y=v8Z;n4y+=B90;var args=Array[t9Z][n4y][J9Z](arguments);args[h4y]();var fn=this[v8Z][r4y][name];if(fn){return fn[k40](this,args);}};Editor[t9Z][s4y]=function(includeFields){var e08="yOr";var o08="ispla";var D08="formConte";var p08="empl";var N08="includeFie";var k3y=J10;k3y+=M40;k3y+=t08;var A3y=c8yy[404720];A3y+=o08;A3y+=e08;A3y+=E70;var R4y=c8yy[73441];R4y+=P8Z;R4y+=c8yy[404720];R4y+=C8Z;var w4y=c8yy[20443];w4y+=p08;w4y+=d48;var P4y=D08;P4y+=H3Z;var l4y=c8yy[404720];l4y+=P8Z;l4y+=c8yy[73441];var that=this;var formContent=$(this[l4y][P4y]);var fields=this[v8Z][Z70];var order=this[v8Z][q70];var template=this[v8Z][w4y];var mode=this[v8Z][R4y] || c88;if(includeFields){var G4y=N08;G4y+=a2Z;G4y+=v8Z;this[v8Z][G4y]=includeFields;}else {includeFields=this[v8Z][d90];}formContent[P40]()[g80]();$[N80](order,function(i,fieldOrName){var a08="_weakInArray";var Q08="itor-t";var O08="emplate";var z08="r-fiel";var T08="d[name=\"";var L08="edito";var B4y=f8Z;B4y+=c8yy[74252];B4y+=c8yy[73441];B4y+=C8Z;var name=fieldOrName instanceof Editor[V0Z]?fieldOrName[B4y]():fieldOrName;if(that[a08](name,includeFields) !== -G0w){if(template && mode === c88){var f3y=f8Z;f3y+=P8Z;f3y+=r2Z;var C3y=T7Z;C3y+=c3Z;C3y+=a40;var V3y=q08;V3y+=Q08;V3y+=O08;V3y+=F08;var X3y=t80;X3y+=c8yy[404720];X3y+=C8Z;var b3y=c8yy[74252];b3y+=c8yy.L9w;b3y+=Z4Z;b3y+=s1Z;var d4y=Y6Z;d4y+=i08;var Y4y=L08;Y4y+=z08;Y4y+=T08;template[n08](Y4y + name + d4y)[b3y](fields[name][X3y]());template[n08](V3y + name + X6Z)[C3y](fields[name][f3y]());}else {var y3y=t80;y3y+=r2Z;var I3y=I9Z;I3y+=C8Z;I3y+=a40;formContent[I3y](fields[name][y3y]());}}});if(template && mode === c88){template[L00](formContent);}this[T80](A3y,[this[v8Z][k3y],this[v8Z][Z90],formContent]);};Editor[t9Z][J3y]=function(items,editFields,type,formOptions,setupDone){var r08="tionCl";var h08="initE";var P08="tDa";var w08="itFie";var d08="inAr";var s08="bloc";var b98="toString";var o3y=f8Z;o3y+=d20;o3y+=C8Z;var m3y=h08;m3y+=i8Z;var M3y=r4Z;M3y+=V6Z;M3y+=r08;M3y+=l20;var g3y=c8yy[73441];g3y+=d20;c8yy.g15();g3y+=C8Z;var E3y=s08;E3y+=j6Z;var c3y=v8Z;c3y+=v50;c3y+=C8Z;var t3y=C8Z;t3y+=c8yy[404720];t3y+=U4Z;t3y+=c8yy[20443];var u3y=l08;u3y+=P08;u3y+=D70;var v3y=F1Z;v3y+=w08;v3y+=Y9w;var that=this;var fields=this[v8Z][Z70];var usedFields=[];var includeInOrder;var editData={};this[v8Z][v3y]=editFields;this[v8Z][u3y]=editData;this[v8Z][I70]=items;this[v8Z][Z90]=t3y;this[r0Z][T00][c3y][v80]=E3y;this[v8Z][g3y]=type;this[M3y]();$[N80](fields,function(name,field){c8yy.S15();var x3y=r80;x3y+=V9Z;x3y+=g88;x3y+=y5Z;field[x3y]();includeInOrder=g6Z;editData[name]={};$[N80](editFields,function(idSrc,edit){c8yy.S15();var G08="layF";var Y08="layFi";var R08="scope";if(edit[Z70][name]){var W3y=v8Z;W3y+=b8Z;W3y+=N58;var K3y=c8yy[404720];K3y+=c8yy[74252];K3y+=c8yy[20443];K3y+=c8yy[74252];var val=field[v0Z](edit[K3y]);editData[name][idSrc]=val === O0Z?h5Z:Array[y10](val)?val[W3y]():val;if(!formOptions || formOptions[R08] === g40){var Z3y=F2Z;Z3y+=G08;Z3y+=G90;var H3y=c8yy[404720];H3y+=C8Z;H3y+=c8yy.L9w;field[a70](idSrc,val !== undefined?val:field[H3y]());if(!edit[B08] || edit[Z3y][name]){includeInOrder=H6Z;}}else {var U3y=N9Z;U3y+=H8Z;U3y+=Y08;U3y+=J70;if(!edit[U3y] || edit[B08][name]){var S3y=c8yy[404720];S3y+=C8Z;S3y+=c8yy.L9w;field[a70](idSrc,val !== undefined?val:field[S3y]());includeInOrder=H6Z;}}}});if(field[P9Z]()[M6Z] !== R0w && includeInOrder){usedFields[f6Z](name);}});var currOrder=this[q70]()[k9Z]();for(var i=currOrder[M6Z] - G0w;i >= R0w;i--){var j3y=d08;j3y+=s1Z;j3y+=F4Z;if($[j3y](currOrder[i][b98](),usedFields) === -G0w){currOrder[b88](i,G0w);}}this[F70](currOrder);this[T80](m3y,[_pluck(editFields,o3y)[R0w],_pluck(editFields,h88)[R0w],items,type],function(){var X98="initMult";var p3y=X98;p3y+=U4Z;p3y+=V98;var e3y=v38;c8yy.S15();e3y+=E38;that[e3y](p3y,[editFields,items,type],function(){setupDone();});});};Editor[D3y][T80]=function(trigger,args,promiseComplete){var y98='pre';c8yy.S15();var C98="resu";var k98="ncelled";var J98="ject";var A98="Ca";var u98="result";var f98="Event";if(!args){args=[];}if(Array[y10](trigger)){var N3y=b8Z;N3y+=Q38;N3y+=C6Z;for(var i=R0w,ien=trigger[N3y];i < ien;i++){this[T80](trigger[i],args);}}else {var q3y=C98;q3y+=V9Z;var a3y=W7Z;a3y+=c8yy[404720];a3y+=V8Z;a3y+=b08;var e=$[f98](trigger);$(this)[I98](e,args);if(trigger[a3y](y98) === R0w && e[q3y] === g6Z){var Q3y=A98;Q3y+=k98;$(this)[I98]($[f98](trigger + Q3y),args);}if(promiseComplete){var L3y=c6Z;L3y+=h1Z;var i3y=x6Z;i3y+=J98;var F3y=g10;F3y+=v98;F3y+=V9Z;var O3y=u30;O3y+=w1Z;O3y+=b8Z;O3y+=c8yy[20443];if(e[O3y] && typeof e[F3y] === i3y && e[u98][L3y]){var z3y=C98;z3y+=V9Z;e[z3y][s88](promiseComplete);}else {promiseComplete(e[u98]);}}return e[u98];}};Editor[T3y][n3y]=function(input){var M98="oLo";c8yy.g15();var K98="rCase";var g98="bstring";var t98="jo";var E98=/^on([A-Z])/;var c98="match";var l3y=t98;l3y+=U4Z;l3y+=f8Z;var h3y=t6Z;h3y+=c8yy[20443];h3y+=C6Z;var name;var names=input[h78](g0Z);for(var i=R0w,ien=names[h3y];i < ien;i++){name=names[i];var onStyle=name[c98](E98);if(onStyle){var s3y=v98;s3y+=g98;var r3y=c8yy[20443];r3y+=M98;r3y+=x98;r3y+=K98;name=onStyle[G0w][r3y]() + name[s3y](Y0w);}names[i]=name;}return names[l3y](g0Z);};Editor[t9Z][P3y]=function(node){var R3y=c8yy.L9w;R3y+=U4Z;R3y+=u5Z;R3y+=v8Z;var w3y=C8Z;w3y+=c8yy[74252];w3y+=Q1Z;var foundField=O0Z;$[w3y](this[v8Z][R3y],function(name,field){c8yy.S15();if($(field[y70]())[n08](node)[M6Z]){foundField=field;}});return foundField;};Editor[G3y][X88]=function(fieldNames){if(fieldNames === undefined){var B3y=j10;B3y+=J70;return this[B3y]();}else if(!Array[y10](fieldNames)){return [fieldNames];}return fieldNames;};Editor[Y3y][d3y]=function(fieldsIn,focus){var U98="q";var W98="setFo";var m98=/^jq:/;var j98="iv.DTE ";var y2y=W98;y2y+=c8yy[653894];y2y+=w1Z;y2y+=v8Z;var V2y=H98;V2y+=c8yy[73441];V2y+=v1Z;V2y+=V20;var that=this;var field;var fields=$[v18](fieldsIn,function(fieldOrName){var Z98="trin";var X2y=N2Z;c8yy.g15();X2y+=b8Z;X2y+=X8Z;var b2y=v8Z;b2y+=Z98;b2y+=D4Z;return typeof fieldOrName === b2y?that[v8Z][X2y][fieldOrName]:fieldOrName;});if(typeof focus === V2y){field=fields[focus];}else if(focus){var C2y=r7Z;C2y+=U98;C2y+=S98;if(focus[H48](C2y) === R0w){var f2y=c8yy[404720];f2y+=j98;field=$(f2y + focus[d80](m98,h5Z));}else {var I2y=N2Z;I2y+=a2Z;I2y+=v8Z;field=this[v8Z][I2y][focus];}}else {document[o98][l70]();}this[v8Z][y2y]=field;if(field){field[b9Z]();}};Editor[A2y][k2y]=function(opts){var G98="utto";var h98="submitOn";var q98="nCom";var l98="blurOnBackground";var O98=".d";var D98="tto";var N98="Coun";var z98="submitOnBlur";var T98="nBlu";var L98="closeOnComplete";var r98="eturn";var F98="teInline";var R98='boolean';var n98="submitOnReturn";var a98="seO";var P98="onB";var s98="onReturn";var p98="ydown";var Q2y=j6Z;Q2y+=C8Z;Q2y+=b4Z;Q2y+=F88;var q2y=P8Z;q2y+=f8Z;var e2y=e98;e2y+=p98;var S2y=h58;S2y+=D98;S2y+=f8Z;S2y+=v8Z;var U2y=c8yy[73441];U2y+=K4Z;U2y+=v8Z;U2y+=C7Z;var H2y=c9Z;H2y+=c8yy.T9w;H2y+=P8Z;H2y+=f8Z;var W2y=c8yy[20443];W2y+=U4Z;W2y+=M7Z;var K2y=c8yy[20443];c8yy.g15();K2y+=U4Z;K2y+=y28;K2y+=C8Z;var x2y=A88;x2y+=N98;x2y+=c8yy[20443];var v2y=C50;v2y+=a98;v2y+=q98;v2y+=Q98;var J2y=O98;J2y+=F98;var that=this;var inlineCount=__inlineCounter++;var namespace=J2y + inlineCount;if(opts[v2y] !== undefined){opts[i98]=opts[L98]?E40:Z10;}if(opts[z98] !== undefined){var t2y=l4Z;t2y+=I2Z;var u2y=P8Z;u2y+=T98;u2y+=s1Z;opts[u2y]=opts[z98]?t2y:E40;}if(opts[n98] !== undefined){var g2y=t80;g2y+=f8Z;g2y+=C8Z;var E2y=v98;E2y+=v1Z;E2y+=B4Z;var c2y=h98;c2y+=e28;c2y+=r98;opts[s98]=opts[c2y]?E2y:g2y;}if(opts[l98] !== undefined){var M2y=P98;M2y+=V6Z;M2y+=j6Z;M2y+=e8Z;opts[M2y]=opts[l98]?c40:Z10;}this[v8Z][H38]=opts;this[v8Z][x2y]=inlineCount;if(typeof opts[K2y] === Q90 || typeof opts[W2y] === H2y){var Z2y=H2Z;Z2y+=y28;Z2y+=C8Z;this[w98](opts[w98]);opts[Z2y]=H6Z;}if(typeof opts[n00] === Q90 || typeof opts[U2y] === f9Z){this[n00](opts[n00]);opts[n00]=H6Z;}if(typeof opts[S2y] !== R98){var o2y=C08;o2y+=T1Z;var m2y=v1Z;m2y+=A1Z;m2y+=s38;m2y+=v8Z;var j2y=v1Z;j2y+=G98;j2y+=k00;this[j2y](opts[m2y]);opts[o2y]=H6Z;}$(document)[c8yy.n9w](e2y + namespace,function(e){c8yy.S15();var C87="preventDefa";var B98="veE";var V87="canReturnSubmit";var Y98="lement";var X87="_fieldFromNode";var b87="nSubmit";var d98="canRetur";if(e[h90] === y9w && that[v8Z][u18]){var p2y=V6Z;p2y+=H2Z;p2y+=B98;p2y+=Y98;var el=$(document[p2y]);if(el){var N2y=c9Z;N2y+=c8yy.T9w;N2y+=c8yy.n9w;var D2y=d98;D2y+=b87;var field=that[X87](el);if(field && typeof field[D2y] === N2y && field[V87](el)){var a2y=C87;a2y+=d10;a2y+=c8yy[20443];e[a2y]();}}}});$(document)[q2y](Q2y + namespace,function(e){var H9w=39;var c87="urn";var W87="nEsc";var E87="onR";var x87="prev";var g87="tu";var f87="canReturnSubm";var J87="_fi";var v87="FromNode";var H87="los";var M87="rn";var K87="Default";var o87="keyCod";var u87="nction";var S87="onEsc";var m87='.DTE_Form_Buttons';var W9w=37;var t87="onRet";var Z87="onE";var j87='submit';var A87="Ret";var k87="urnSu";var I87="functio";var O2y=c8yy[404720];O2y+=A78;O2y+=j3Z;O2y+=F1Z;var el=$(document[o98]);if(e[h90] === y9w && that[v8Z][O2y]){var z2y=f87;z2y+=U4Z;z2y+=c8yy[20443];var L2y=I87;L2y+=f8Z;var i2y=y87;i2y+=A87;i2y+=k87;i2y+=R38;var F2y=J87;F2y+=u5Z;F2y+=v87;var field=that[F2y](el);if(field && typeof field[i2y] === L2y && field[z2y](el)){var s2y=d38;s2y+=u87;var r2y=t87;r2y+=c87;var n2y=v8Z;n2y+=w1Z;n2y+=v1Z;n2y+=B4Z;var T2y=E87;T2y+=C8Z;T2y+=g87;T2y+=M87;if(opts[T2y] === n2y){var h2y=v98;h2y+=v1Z;h2y+=B4Z;e[r90]();that[h2y]();}else if(typeof opts[r2y] === s2y){var P2y=E87;P2y+=r98;var l2y=x87;l2y+=l2Z;l2y+=K87;e[l2y]();opts[P2y](that,e);}}}else if(e[h90] === E9w){var B2y=P8Z;B2y+=W87;var G2y=c8yy[653894];G2y+=H87;G2y+=C8Z;var R2y=v1Z;R2y+=b8Z;R2y+=w1Z;R2y+=s1Z;var w2y=Z87;w2y+=U87;e[r90]();if(typeof opts[S87] === f9Z){opts[S87](that,e);}else if(opts[w2y] === R2y){that[l70]();}else if(opts[S87] === G2y){that[w40]();}else if(opts[B2y] === j87){that[U90]();}}else if(el[j9Z](m87)[M6Z]){var b5y=o87;b5y+=C8Z;if(e[h90] === W9w){var d2y=e87;d2y+=f8Z;var Y2y=H8Z;Y2y+=s1Z;Y2y+=C8Z;Y2y+=J2Z;el[Y2y](d2y)[b9Z]();}else if(e[b5y] === H9w){var C5y=o1Z;C5y+=c8yy[653894];C5y+=w1Z;C5y+=v8Z;var V5y=v1Z;V5y+=p87;V5y+=c8yy.n9w;var X5y=D48;X5y+=a1Z;X5y+=c8yy[20443];el[X5y](V5y)[C5y]();}}});this[v8Z][D87]=function(){c8yy.g15();var N87="eyu";var y5y=j6Z;y5y+=N87;y5y+=H8Z;var I5y=P8Z;I5y+=c8yy.L9w;I5y+=c8yy.L9w;var f5y=a87;f5y+=F10;$(document)[F20](f5y + namespace);$(document)[I5y](y5y + namespace);};return namespace;};Editor[t9Z][A5y]=function(direction,action,data){var q87="leg";c8yy.S15();var Q87="acyAj";var k5y=q87;k5y+=Q87;k5y+=w28;if(!this[v8Z][k5y] || !data){return;}if(direction === O87){var v5y=C8Z;v5y+=c8yy[404720];v5y+=U4Z;v5y+=c8yy[20443];var J5y=c8yy[653894];J5y+=s1Z;J5y+=C8Z;J5y+=d48;if(action === J5y || action === v5y){var g5y=C8Z;g5y+=c8yy[404720];g5y+=U4Z;g5y+=c8yy[20443];var E5y=B78;E5y+=D70;var c5y=c8yy[404720];c5y+=c8yy[74252];c5y+=c8yy[20443];c5y+=c8yy[74252];var u5y=C8Z;u5y+=c8yy[74252];u5y+=c8yy[653894];u5y+=C6Z;var id;$[u5y](data[k0Z],function(rowId,values){var i87="ta format";var F87="Editor: Multi-row editing is not supported by the legacy Ajax da";if(id !== undefined){var t5y=F87;t5y+=i87;throw t5y;}id=rowId;});data[c5y]=data[E5y][id];if(action === g5y){data[e2Z]=id;}}else {var M5y=c8yy[73441];M5y+=T7Z;data[e2Z]=$[M5y](data[k0Z],function(values,id){return id;});delete data[k0Z];}}else {var x5y=s1Z;x5y+=P8Z;x5y+=m4Z;if(!data[k0Z] && data[x5y]){var W5y=s1Z;W5y+=P8Z;W5y+=m4Z;var K5y=c8yy[404720];K5y+=c8yy[74252];K5y+=D70;data[K5y]=[data[W5y]];}else if(!data[k0Z]){data[k0Z]=[];}}};Editor[t9Z][I78]=function(json){c8yy.g15();var that=this;if(json[L87]){var H5y=Z6Z;H5y+=c8yy[653894];H5y+=C6Z;$[H5y](this[v8Z][Z70],function(name,field){c8yy.S15();var z87="ield";var T87="update";if(json[L87][name] !== undefined){var Z5y=c8yy.L9w;Z5y+=z87;var fieldInst=that[Z5y](name);if(fieldInst && fieldInst[T87]){var U5y=w1Z;U5y+=H8Z;U5y+=B78;U5y+=Z4Z;fieldInst[U5y](json[L87][name]);}}});}};Editor[t9Z][S5y]=function(el,msg,title,fn){var h87="fa";var P87="eI";var l87="removeAt";var r87="Out";var m5y=c9Z;m5y+=W6Z;m5y+=L40;var j5y=G60;j5y+=j30;j5y+=Z4Z;var canAnimate=$[s5Z][j5y]?H6Z:g6Z;if(title === undefined){title=g6Z;}if(!fn){fn=function(){};}if(typeof msg === m5y){msg=msg(this,new DataTable[D10](this[v8Z][N10]));}el=$(el);c8yy.S15();if(canAnimate){el[n87]();}if(!msg){var o5y=N9Z;o5y+=v10;o5y+=n2Z;if(this[v8Z][o5y] && canAnimate){var e5y=h87;e5y+=r2Z;e5y+=r87;el[e5y](function(){el[L10](h5Z);c8yy.g15();fn();});}else {var D5y=c8yy[404720];D5y+=A78;D5y+=H8Z;D5y+=x40;var p5y=C6Z;p5y+=c8yy[20443];p5y+=s87;el[p5y](h5Z)[z0Z](D5y,Z10);fn();}if(title){var a5y=c8yy[20443];a5y+=U4Z;a5y+=y28;a5y+=C8Z;var N5y=l87;N5y+=q50;el[N5y](a5y);}}else {fn();if(this[v8Z][u18] && canAnimate){var Q5y=c8yy.L9w;Q5y+=F9Z;Q5y+=P87;Q5y+=f8Z;var q5y=w87;q5y+=b8Z;el[q5y](msg)[Q5y]();}else {var O5y=C6Z;O5y+=R87;el[O5y](msg)[z0Z](m9Z,z80);}if(title){var i5y=c8yy[20443];i5y+=u2Z;var F5y=c8yy[74252];F5y+=r38;F5y+=s1Z;el[F5y](i5y,msg);}}};Editor[t9Z][G87]=function(){var d87="eFields";var Y87="lud";c8yy.S15();var X17="multiInfoShown";var b17="tiValu";var B87="inc";var L5y=B87;L5y+=Y87;L5y+=d87;var fields=this[v8Z][Z70];var include=this[v8Z][L5y];var show=H6Z;var state;if(!include){return;}for(var i=R0w,ien=include[M6Z];i < ien;i++){var z5y=w10;z5y+=d10;z5y+=b17;z5y+=C8Z;var field=fields[include[i]];var multiEditable=field[B0Z]();if(field[z5y]() && multiEditable && show){state=H6Z;show=g6Z;}else if(field[y80]() && !multiEditable){state=H6Z;}else {state=g6Z;}fields[include[i]][X17](state);}};Editor[t9Z][T5y]=function(type,immediate){var c17="itor-focus";var f17="tiInf";var t17="focus.ed";var v17="captureFocus";var J17="roller";var k17="isplayCon";var u17='submit.editor-internal';var A17="nternal";var C17="_m";var I17="bb";var V17="_even";var y17="ubmit.editor-";var Z17="ene";var f6y=P8Z;f6y+=H8Z;f6y+=C8Z;f6y+=f8Z;var C6y=V17;C6y+=c8yy[20443];var V6y=C17;V6y+=d10;V6y+=f17;V6y+=P8Z;var l5y=h58;l5y+=I17;l5y+=e10;var s5y=v8Z;c8yy.S15();s5y+=y17;s5y+=U4Z;s5y+=A17;var r5y=P8Z;r5y+=c8yy.L9w;r5y+=c8yy.L9w;var h5y=m6Z;h5y+=c8yy[73441];var n5y=c8yy[404720];n5y+=k17;n5y+=c8yy[20443];n5y+=J17;var that=this;var focusCapture=this[v8Z][n5y][v17];if(focusCapture === undefined){focusCapture=H6Z;}$(this[h5y][T00])[r5y](u17)[c8yy.n9w](s5y,function(e){c8yy.S15();e[r90]();});if(focusCapture && (type === c88 || type === l5y)){var R5y=t17;R5y+=c17;var w5y=P8Z;w5y+=f8Z;var P5y=v1Z;P5y+=P8Z;P5y+=c8yy[404720];P5y+=b4Z;$(P5y)[w5y](R5y,function(){var x17="aren";var K17='.DTED';var W17="setFocus";var g17="iveEl";var M17="emen";var H17="etFoc";var b6y=e10;b6y+=H58;var d5y=E17;d5y+=g17;d5y+=M17;d5y+=c8yy[20443];var Y5y=e88;Y5y+=h18;var B5y=H8Z;B5y+=x17;B5y+=a80;var G5y=E17;G5y+=g17;G5y+=M17;G5y+=c8yy[20443];if($(document[G5y])[B5y](Y5y)[M6Z] === R0w && $(document[d5y])[j9Z](K17)[b6y] === R0w){if(that[v8Z][W17]){var X6y=v8Z;X6y+=H17;X6y+=X80;that[v8Z][X6y][b9Z]();}}});}this[V6y]();this[C6y](f6y,[type,this[v8Z][Z90]]);if(immediate){var y6y=V6Z;y6y+=H2Z;y6y+=P8Z;y6y+=f8Z;var I6y=Y10;I6y+=Z17;I6y+=c8yy[404720];this[T80](I6y,[type,this[v8Z][y6y]]);}return H6Z;};Editor[t9Z][p00]=function(type){var j17="canc";var U17="_clearDynamicIn";var o17="DynamicInf";var m17="Open";var e17="eIc";var K6y=c8yy[404720];K6y+=L0Z;K6y+=i2Z;K6y+=n2Z;var x6y=U17;x6y+=o1Z;var J6y=c8yy[74252];J6y+=c8yy[653894];J6y+=c8yy[20443];J6y+=L40;var k6y=S17;k6y+=h38;k6y+=f8Z;var A6y=C88;A6y+=h1Z;A6y+=c8yy[20443];if(this[A6y](k6y,[type,this[v8Z][J6y]]) === g6Z){var M6y=w40;M6y+=e4Z;M6y+=c8yy[653894];M6y+=v1Z;var E6y=c8yy[73441];E6y+=P8Z;E6y+=c8yy[404720];E6y+=C8Z;var c6y=p48;c6y+=f8Z;c6y+=C8Z;var t6y=c8yy[73441];t6y+=d20;t6y+=C8Z;var u6y=j17;u6y+=C8Z;u6y+=b8Z;u6y+=m17;var v6y=N48;v6y+=t10;v6y+=o17;v6y+=P8Z;this[v6y]();this[T80](u6y,[type,this[v8Z][Z90]]);if((this[v8Z][t6y] === c6y || this[v8Z][E6y] === X00) && this[v8Z][D87]){var g6y=b5Z;g6y+=e17;g6y+=v1Z;this[v8Z][g6y]();}this[v8Z][M6y]=O0Z;return g6Z;}this[x6y](H6Z);this[v8Z][K6y]=type;return H6Z;};Editor[W6y][H6y]=function(processing){var p17="ive";var m6y=f3Z;m6y+=k48;m6y+=v8Z;m6y+=L58;var j6y=c8yy[404720];j6y+=P8Z;j6y+=c8yy[73441];var S6y=U20;S6y+=u1Z;var U6y=c8yy[74252];U6y+=W6Z;U6y+=p17;var Z6y=H8Z;Z6y+=n6Z;var procClass=this[W9Z][Z6y][U6y];$([S6y,this[j6y][y30]])[y40](procClass,processing);this[v8Z][L80]=processing;c8yy.g15();this[T80](m6y,[processing]);};Editor[t9Z][o6y]=function(args){c8yy.g15();var D17='processing-field';var processing=g6Z;$[N80](this[v8Z][Z70],function(name,field){c8yy.g15();if(field[L80]()){processing=H6Z;}});if(processing){this[J38](D17,function(){var N17="_noProce";var q17="_submit";var e6y=N17;e6y+=a17;if(this[e6y](args) === H6Z){var p6y=I9Z;p6y+=b8Z;p6y+=b4Z;this[q17][p6y](this,args);}});}return !processing;};Editor[D6y][N6y]=function(successCallback,errorCallback,formatdata,hide){var G17="editData";var Y17="dbTable";var w17="dataSource";var h17="editOpt";var T17="ionName";var l17="oApi";var R17="editCount";var t47="_processi";var J47='allIfChanged';var r17="odi";var s17="fier";var u47="Compl";var z17="dbTab";var g47="omp";var B17="_noProcessing";var F17="cyAja";var O17="_leg";var Q17="reSubmi";var n17="bm";var E47="onC";var u7y=H8Z;u7y+=Q17;u7y+=c8yy[20443];var v7y=r4Z;v7y+=M70;v7y+=C8Z;v7y+=H3Z;var J7y=C8Z;J7y+=a1Z;J7y+=V60;J7y+=c8yy[404720];var k7y=O17;k7y+=c8yy[74252];k7y+=F17;k7y+=a1Z;var I7y=s1Z;I7y+=C8Z;I7y+=i17;I7y+=C8Z;var L6y=c8yy[653894];L6y+=L17;var i6y=z17;i6y+=e10;var F6y=E17;F6y+=T17;var O6y=y88;O6y+=c8yy.n9w;var Q6y=v98;Q6y+=n17;Q6y+=U4Z;Q6y+=c8yy[20443];var q6y=h17;q6y+=v8Z;var a6y=c8yy[73441];a6y+=r17;a6y+=s17;var that=this;var i,iLen,eventRet,errorNodes;var changed=g6Z,allData={},changedData={};var setBuilder=DataTable[U8Z][l17][P17];c8yy.S15();var dataSource=this[v8Z][w17];var fields=this[v8Z][Z70];var editCount=this[v8Z][R17];var modifier=this[v8Z][a6y];var editFields=this[v8Z][p70];var editData=this[v8Z][G17];var opts=this[v8Z][q6y];var changedSubmit=opts[Q6y];var submitParamsLocal;if(this[B17](arguments) === g6Z){return;}var action=this[v8Z][O6y];var submitParams={"data":{}};submitParams[this[v8Z][F6y]]=action;if(this[v8Z][i6y]){submitParams[N10]=this[v8Z][Y17];}if(action === L6y || action === A88){var B6y=Y2Z;B6y+=b8Z;var G6y=B48;G6y+=C8Z;var z6y=C8Z;z6y+=c8yy[74252];z6y+=c8yy[653894];z6y+=C6Z;$[z6y](editFields,function(idSrc,edit){var d17="isEm";var b47="ptyObject";var k47="isEmptyObject";var R6y=d17;R6y+=b47;var T6y=Z6Z;T6y+=c8yy[653894];T6y+=C6Z;var allRowData={};var changedRowData={};$[T6y](fields,function(name,field){var X47="are";var f47="mDat";var A47='-many-count';var V47="ndexOf";var y47=/\[.*$/;var I47='[]';var C47="valFr";var h6y=X5Z;h6y+=B4Z;h6y+=N10;var n6y=E18;n6y+=X8Z;if(edit[n6y][name] && field[h6y]()){var w6y=c8yy[653894];w6y+=P8Z;w6y+=w78;w6y+=X47;var P6y=C8Z;P6y+=c8yy[404720];P6y+=U4Z;P6y+=c8yy[20443];var l6y=U4Z;l6y+=V47;var s6y=A78;s6y+=l7Z;s6y+=s1Z;s6y+=D80;var multiGet=field[y38]();var builder=setBuilder(name);if(multiGet[idSrc] === undefined){var r6y=C47;r6y+=P8Z;r6y+=f47;r6y+=c8yy[74252];var originalVal=field[r6y](edit[k0Z]);builder(allRowData,originalVal);return;}var value=multiGet[idSrc];var manyBuilder=Array[s6y](value) && name[l6y](I47) !== -G0w?setBuilder(name[d80](y47,h5Z) + A47):O0Z;builder(allRowData,value);if(manyBuilder){manyBuilder(allRowData,value[M6Z]);}if(action === P6y && (!editData[name] || !field[w6y](value,editData[name][idSrc]))){builder(changedRowData,value);changed=H6Z;if(manyBuilder){manyBuilder(changedRowData,value[M6Z]);}}}});if(!$[R6y](allRowData)){allData[idSrc]=allRowData;}if(!$[k47](changedRowData)){changedData[idSrc]=changedRowData;}});if(action === G6y || changedSubmit === B6y || changedSubmit === J47 && changed){submitParams[k0Z]=allData;}else if(changedSubmit === v47 && changed){submitParams[k0Z]=changedData;}else {var f7y=X5Z;f7y+=B4Z;f7y+=u47;f7y+=W4Z;var C7y=t47;C7y+=C3Z;var V7y=d38;V7y+=L28;V7y+=c47;var X7y=E47;X7y+=g47;X7y+=R78;var d6y=M47;d6y+=H8Z;d6y+=R78;var Y6y=c8yy[74252];Y6y+=W6Z;Y6y+=U4Z;Y6y+=c8yy.n9w;this[v8Z][Y6y]=O0Z;if(opts[d6y] === E40 && (hide === undefined || hide)){var b7y=g38;b7y+=P8Z;b7y+=d2Z;this[b7y](g6Z);}else if(typeof opts[X7y] === V7y){opts[i98](this);}if(successCallback){successCallback[J9Z](this);}this[C7y](g6Z);this[T80](f7y);return;}}else if(action === I7y){var y7y=C8Z;y7y+=f88;$[y7y](editFields,function(idSrc,edit){var A7y=c8yy[404720];A7y+=x47;submitParams[A7y][idSrc]=edit[k0Z];});}this[k7y](O87,action,submitParams);submitParamsLocal=$[J7y](H6Z,{},submitParams);if(formatdata){formatdata(submitParams);}this[v7y](u7y,[submitParams,action],function(result){var H47="_ajax";var K47="mitTable";var W47="xU";if(result === g6Z){that[P38](g6Z);}else {var E7y=L4Z;E7y+=v1Z;E7y+=K47;var c7y=n28;c7y+=W47;c7y+=s1Z;c7y+=b8Z;var t7y=c8yy[74252];t7y+=P88;t7y+=a1Z;var submitWire=that[v8Z][t7y] || that[v8Z][c7y]?that[H47]:that[E7y];submitWire[J9Z](that,submitParams,function(json,notGood,xhr){var Z47="_submitSucce";var g7y=Z47;g7y+=r3Z;that[g7y](json,notGood,submitParams,submitParamsLocal,that[v8Z][Z90],editCount,hide,successCallback,errorCallback,xhr);},function(xhr,err,thrown){var U47="_submitError";c8yy.g15();that[U47](xhr,err,thrown,errorCallback,submitParams,that[v8Z][Z90]);},submitParams);}});};Editor[M7y][x7y]=function(data,success,error,submitParams){var o47="_da";var m47="ataF";var p47="ifi";var j47="_fnGetObject";var j7y=U4Z;j7y+=c8yy[404720];j7y+=S47;var S7y=P8Z;S7y+=l7Z;S7y+=P7Z;var U7y=C8Z;U7y+=a1Z;U7y+=c8yy[20443];var Z7y=j47;Z7y+=M8Z;Z7y+=m47;Z7y+=f8Z;var H7y=P8Z;H7y+=l7Z;H7y+=H8Z;H7y+=U4Z;var W7y=C8Z;W7y+=a1Z;W7y+=c8yy[20443];c8yy.S15();var K7y=V6Z;K7y+=c47;var that=this;var action=data[K7y];var out={data:[]};var idGet=DataTable[W7y][H7y][Z7y](this[v8Z][a68]);var idSet=DataTable[U7y][S7y][P17](this[v8Z][j7y]);if(action !== E28){var o7y=o47;o7y+=e47;var m7y=D1Z;m7y+=c8yy[404720];m7y+=p47;m7y+=V20;var originalData=this[v8Z][p68] === c88?this[m70](F38,this[m7y]()):this[o7y](w18,this[I70]());$[N80](data[k0Z],function(key,vals){var a47="leE";var N47="dataTab";var D47="_fnExt";var q7y=c8yy[404720];q7y+=c8yy[74252];q7y+=D70;var a7y=J88;c8yy.S15();a7y+=C8Z;a7y+=w7Z;a7y+=C8Z;var D7y=D47;D7y+=S8Z;var p7y=P8Z;p7y+=D10;var e7y=N47;e7y+=a47;e7y+=n1Z;var toSave;var extender=$[s5Z][e7y][p7y][D7y];if(action === O48){var N7y=c8yy[404720];N7y+=c8yy[74252];N7y+=c8yy[20443];N7y+=c8yy[74252];var rowData=originalData[key][N7y];toSave=extender({},rowData,H6Z);toSave=extender(toSave,vals,H6Z);}else {toSave=extender({},vals,H6Z);}var overrideId=idGet(toSave);if(action === a7y && overrideId === undefined){idSet(toSave,+new Date() + h5Z + key);}else {idSet(toSave,overrideId);}out[q7y][f6Z](toSave);});}success(out);};Editor[t9Z][Q7y]=function(json,notGood,submitParams,submitParamsLocal,action,editCount,hide,successCallback,errorCallback,xhr){var L47="tSubmit";var l47="dErrors";var t37='postCreate';var K37="ids";var g37='commit';var J37="Sour";var u37="_eve";var I37="taSo";var v37="preC";var z47="modif";var r47='receive';var b37='<br>';var y37='prep';var A37='setData';var T47="ier";var C37="ditCount";var W37='postRemove';var h47="_legacyAjax";var E37="eEd";var i47="rors";var k37="_data";var q47="submi";var V37="Suc";var s47="rrors";var x37="_dataSou";var n47="Opts";var c37="ost";var X37='submitUnsuccessful';var F47="fieldE";var s0y=q47;s0y+=Q47;s0y+=O47;var r7y=e10;r7y+=C3Z;r7y+=c8yy[20443];r7y+=C6Z;var n7y=F47;n7y+=s1Z;n7y+=i47;var T7y=V20;T7y+=L18;T7y+=s1Z;var z7y=H8Z;z7y+=L30;z7y+=L47;var L7y=v38;L7y+=E38;var i7y=z47;i7y+=T47;var F7y=F1Z;F7y+=U4Z;F7y+=c8yy[20443];F7y+=n47;var O7y=j10;O7y+=C8Z;O7y+=Y9w;var that=this;var setData;var fields=this[v8Z][O7y];var opts=this[v8Z][F7y];var modifier=this[v8Z][i7y];this[h47](r47,action,json);this[L7y](z7y,[json,submitParams,action,xhr]);if(!json[T7y]){json[Q6Z]=c8yy.r9w;}if(!json[n7y]){var h7y=F47;h7y+=s47;json[h7y]=[];}if(notGood || json[Q6Z] || json[W58][r7y]){var A0y=r4Z;A0y+=T58;A0y+=c8yy[20443];var y0y=V20;y0y+=s1Z;y0y+=Q2Z;var P7y=j10;P7y+=I1Z;P7y+=l47;var l7y=C8Z;l7y+=c8yy[74252];l7y+=Q1Z;var globalError=[];if(json[Q6Z]){var s7y=P47;s7y+=B40;globalError[s7y](json[Q6Z]);}$[l7y](json[P7y],function(i,err){var B47="pos";var G47="onFieldErro";var w47="splaye";var Y47="onFieldError";var R47='Unknown field: ';var w7y=J10;w7y+=w47;w7y+=c8yy[404720];var field=fields[err[J0Z]];if(!field){throw new Error(R47 + err[J0Z]);}else if(field[w7y]()){var R7y=Y1Z;R7y+=c8yy[74252];R7y+=c8yy[20443];R7y+=X80;field[Q6Z](err[R7y] || u00);if(i === R0w){var X0y=Z78;X0y+=H2Z;X0y+=P8Z;X0y+=f8Z;var G7y=G47;G7y+=s1Z;if(opts[G7y] === f80){var b0y=v2Z;b0y+=H8Z;var d7y=B47;d7y+=U4Z;d7y+=c47;var Y7y=b30;Y7y+=n7Z;var B7y=c8yy[404720];B7y+=P8Z;B7y+=c8yy[73441];that[q30]($(that[B7y][d68],that[v8Z][Y7y]),{scrollTop:$(field[y70]())[d7y]()[b0y]},p9w);field[b9Z]();}else if(typeof opts[Y47] === X0y){opts[Y47](that,err);}}}else {var I0y=v8Z;I0y+=D70;I0y+=c8yy[20443];I0y+=X80;var f0y=S98;f0y+=d47;var C0y=f8Z;C0y+=c8yy[74252];C0y+=c8yy[73441];C0y+=C8Z;var V0y=P47;V0y+=B40;globalError[V0y](field[C0y]() + f0y + (err[I0y] || u00));}});this[y0y](globalError[o38](b37));this[A0y](X37,[json]);if(errorCallback){errorCallback[J9Z](that,json);}}else {var r0y=U90;r0y+=V37;r0y+=V3Z;var h0y=C88;h0y+=l2Z;var i0y=C8Z;i0y+=C37;var J0y=F1Z;J0y+=U4Z;J0y+=c8yy[20443];var k0y=f37;k0y+=Z4Z;var store={};if(json[k0Z] && (action === k0y || action === J0y)){var e0y=c8yy[404720];e0y+=c8yy[74252];e0y+=c8yy[20443];e0y+=c8yy[74252];var o0y=r4Z;o0y+=B78;o0y+=e47;var t0y=e10;t0y+=f8Z;t0y+=D4Z;t0y+=c6Z;var u0y=c8yy[404720];u0y+=c8yy[74252];u0y+=c8yy[20443];u0y+=c8yy[74252];var v0y=r40;v0y+=c8yy[74252];v0y+=I37;v0y+=G70;this[v0y](y37,action,modifier,submitParamsLocal,json,store);for(var i=R0w;i < json[u0y][t0y];i++){var g0y=c8yy[653894];g0y+=s1Z;g0y+=C8Z;g0y+=d48;var E0y=r4Z;E0y+=C8Z;E0y+=J2Z;E0y+=l2Z;var c0y=U4Z;c0y+=c8yy[404720];setData=json[k0Z][i];var id=this[m70](c0y,setData);this[E0y](A37,[json,setData,action]);if(action === g0y){var Z0y=c8yy[653894];Z0y+=L17;var H0y=v38;H0y+=J2Z;H0y+=l2Z;var W0y=c8yy[653894];W0y+=g10;W0y+=c8yy[74252];W0y+=Z4Z;var K0y=k37;K0y+=J37;K0y+=k48;var x0y=v37;x0y+=g10;x0y+=d48;var M0y=u37;M0y+=H3Z;this[M0y](x0y,[json,setData,id]);this[K0y](W0y,fields,setData,store);this[H0y]([Z0y,t37],[json,setData,id]);}else if(action === A88){var m0y=H8Z;m0y+=c37;m0y+=V98;var j0y=C8Z;j0y+=c8yy[404720];j0y+=U4Z;j0y+=c8yy[20443];var S0y=n4Z;S0y+=E37;S0y+=I2Z;var U0y=r4Z;U0y+=T58;U0y+=c8yy[20443];this[U0y](S0y,[json,setData,id]);this[m70](j0y,modifier,fields,setData,store);this[T80]([O48,m0y],[json,setData,id]);}}this[o0y](g37,action,modifier,json[e0y],store);}else if(action === O38){var F0y=e2Z;F0y+=v8Z;var O0y=g10;O0y+=i17;O0y+=C8Z;var Q0y=v38;Q0y+=J2Z;Q0y+=C8Z;Q0y+=H3Z;var q0y=s1Z;q0y+=M37;q0y+=J2Z;q0y+=C8Z;var a0y=x37;a0y+=m08;a0y+=C8Z;var N0y=n4Z;N0y+=A00;N0y+=N38;var D0y=v38;D0y+=E38;var p0y=H8Z;p0y+=s1Z;p0y+=l80;this[m70](p0y,action,modifier,submitParamsLocal,json,store);this[D0y](N0y,[json,this[K37]()]);this[a0y](q0y,modifier,fields,store);this[Q0y]([O0y,W37],[json,this[F0y]()]);this[m70](g37,action,modifier,json[k0Z],store);}if(editCount === this[v8Z][i0y]){var T0y=c9Z;T0y+=q90;var L0y=M47;L0y+=Q98;var action=this[v8Z][Z90];this[v8Z][Z90]=O0Z;if(opts[L0y] === E40 && (hide === undefined || hide)){var z0y=B78;z0y+=D70;this[u08](json[z0y]?H6Z:g6Z,action);}else if(typeof opts[i98] === T0y){opts[i98](this);}}if(successCallback){var n0y=c8yy[653894];n0y+=c8yy[74252];n0y+=w90;successCallback[n0y](that,json);}this[h0y](r0y,[json,setData,action]);}this[P38](g6Z);this[T80](s0y,[json,setData,action]);};Editor[l0y][P0y]=function(xhr,err,thrown,errorCallback,submitParams,action){var j37="system";var H37="bmitCompl";var S37='postSubmit';var U37="cessing";var Z37="tError";var d0y=v98;d0y+=H37;d0y+=W4Z;var Y0y=v98;Y0y+=v1Z;Y0y+=O90;Y0y+=Z37;var G0y=X3Z;G0y+=U37;var R0y=W00;R0y+=H00;var w0y=V20;w0y+=s1Z;w0y+=P8Z;c8yy.S15();w0y+=s1Z;this[T80](S37,[O0Z,submitParams,action,xhr]);this[w0y](this[R0y][Q6Z][j37]);this[G0y](g6Z);if(errorCallback){var B0y=c8yy[653894];B0y+=Y2Z;B0y+=b8Z;errorCallback[B0y](this,xhr,err,thrown);}this[T80]([Y0y,d0y],[xhr,err,thrown,submitParams]);};Editor[t9Z][k88]=function(fn){var q37="mitComplete";var m37="bub";var o37="roce";var e37="tabl";var O37="lur";var N37="rSide";var D37="Serve";var k9y=m37;k9y+=F80;k9y+=C8Z;var A9y=p48;A9y+=D48;var I9y=H8Z;I9y+=o37;I9y+=v8Z;I9y+=L58;var C9y=e37;C9y+=C8Z;var V9y=l7Z;V9y+=P7Z;var X9y=c8yy[404720];X9y+=w7Z;X9y+=p37;var b9y=c8yy[20443];b9y+=c8yy[74252];b9y+=v1Z;b9y+=e10;var that=this;var dt=this[v8Z][b9y]?new $[s5Z][X9y][V9y](this[v8Z][C9y]):O0Z;var ssp=g6Z;if(dt){var f9y=v1Z;f9y+=D37;f9y+=N37;ssp=dt[C0Z]()[R0w][a37][f9y];}if(this[v8Z][I9y]){var y9y=v8Z;y9y+=G4Z;y9y+=q37;this[J38](y9y,function(){c8yy.S15();var Q37='draw';if(ssp){dt[J38](Q37,fn);}else {setTimeout(function(){fn();},C9w);}});return H6Z;}else if(this[v80]() === A9y || this[v80]() === k9y){var u9y=v1Z;u9y+=O37;this[J38](E40,function(){if(!that[v8Z][L80]){setTimeout(function(){c8yy.S15();if(that[v8Z]){fn();}},C9w);}else {var J9y=U90;J9y+=i9Z;J9y+=O47;that[J38](J9y,function(e,json){c8yy.S15();if(ssp && json){var v9y=c8yy[404720];v9y+=s1Z;v9y+=c8yy[74252];v9y+=m4Z;dt[J38](v9y,fn);}else {setTimeout(function(){c8yy.g15();if(that[v8Z]){fn();}},C9w);}});}})[u9y]();return H6Z;}return g6Z;};Editor[t9y][c9y]=function(name,arr){for(var i=R0w,ien=arr[M6Z];i < ien;i++){if(name == arr[i]){return i;}}return -G0w;};Editor[E9y]={"table":O0Z,"ajaxUrl":O0Z,"fields":[],"display":g9y,"ajax":O0Z,"idSrc":M9y,"events":{},"i18n":{"close":F37,"create":{"button":x9y,"title":K9y,"submit":T8Z},"edit":{"button":W9y,"title":i37,"submit":L37},"remove":{"button":H9y,"title":Z9y,"submit":z37,"confirm":{"_":T37,"1":n37}},"error":{"system":h37},multi:{title:U9y,info:S9y,restore:j9y,noMulti:m9y},datetime:{previous:o9y,next:e9y,months:[r37,s37,l37,p9y,D9y,P37,N9y,a9y,w37,R37,G37,B37],weekdays:[Y37,q9y,d37,Q9y,O9y,b27,F9y],amPm:[i9y,X27],hours:L9y,minutes:V27,seconds:C27,unknown:e38}},formOptions:{bubble:$[z9y]({},Editor[J40][T9y],{title:g6Z,message:g6Z,buttons:n9y,submit:h9y}),inline:$[r9y]({},Editor[s9y][l9y],{buttons:g6Z,submit:v47}),main:$[X50]({},Editor[P9y][t40])},legacyAjax:g6Z,actionName:f27};(function(){var i57='keyless';var b57="drawType";var I27="Table";var z27="attach";var W27="isE";var w27="oAp";var c57="rowIds";var a8i=k0Z;a8i+=I27;var w9y=S68;w9y+=q38;w9y+=j68;var __dataSources=Editor[w9y]={};var __dtIsSsp=function(dt,editor){var A27="bSe";var k27="rverSi";var y27="Type";var B9y=f8Z;B9y+=P8Z;B9y+=f8Z;B9y+=C8Z;var G9y=c8yy[404720];G9y+=h60;G9y+=m4Z;G9y+=y27;var R9y=A27;R9y+=k27;R9y+=r2Z;return dt[C0Z]()[R0w][a37][R9y] && editor[v8Z][H38][G9y] !== B9y;};var __dtApi=function(table){c8yy.S15();return $(table)[d5Z]();};var __dtHighlight=function(node){node=$(node);c8yy.g15();setTimeout(function(){var v27="lig";var J27="high";var Y9y=J27;Y9y+=v27;Y9y+=E60;node[K9Z](Y9y);setTimeout(function(){var E27='noHighlight';var c27="dClass";var u27="ighlight";var X8i=C6Z;X8i+=u27;var b8i=E90;b8i+=t27;var d9y=F9Z;c8yy.g15();d9y+=c27;node[d9y](E27)[b8i](X8i);setTimeout(function(){var g27="oH";var C8i=f8Z;C8i+=g27;C8i+=u27;var V8i=O38;V8i+=h30;node[V8i](C8i);},D9w);},p9w);},J9w);};var __dtRowSelector=function(out,dt,identifier,fields,idFn){c8yy.S15();var f8i=k70;f8i+=v8Z;dt[f8i](identifier)[M27]()[N80](function(idx){var K27="find row identifier";c8yy.g15();var A9w=14;var x27="Unable to ";var k8i=s1Z;k8i+=V50;var A8i=f8Z;A8i+=P8Z;A8i+=c8yy[404720];A8i+=C8Z;var I8i=c8yy[404720];I8i+=c8yy[74252];I8i+=c8yy[20443];I8i+=c8yy[74252];var row=dt[k70](idx);var data=row[I8i]();var idSrc=idFn(data);if(idSrc === undefined){var y8i=x27;y8i+=K27;Editor[Q6Z](y8i,A9w);}out[idSrc]={idSrc:idSrc,data:data,node:row[A8i](),fields:fields,type:k8i};});};var __dtFieldsFromIdx=function(dt,fields,idx){var D27="Unable ";var a27="y determine field from source. Please specify the field name.";var N27="to automaticall";var Z27="yO";var j27="aoColumns";var m27="editField";var U27="bject";var S27="ttings";var o27="mData";var g8i=W27;g8i+=H27;g8i+=Z27;g8i+=U27;var t8i=C8Z;t8i+=c8yy[74252];t8i+=c8yy[653894];t8i+=C6Z;var J8i=d2Z;J8i+=S27;var field;var col=dt[J8i]()[R0w][j27][idx];var dataSrc=col[m27] !== undefined?col[m27]:col[o27];var resolvedFields={};var run=function(field,dataSrc){var v8i=e27;v8i+=c8yy[73441];v8i+=C8Z;if(field[v8i]() === dataSrc){var u8i=f8Z;u8i+=c8yy[74252];u8i+=c8yy[73441];u8i+=C8Z;resolvedFields[field[u8i]()]=field;}};$[t8i](fields,function(name,fieldInst){var p27="Arr";var c8i=A78;c8yy.g15();c8i+=p27;c8i+=F4Z;if(Array[c8i](dataSrc)){var E8i=b8Z;E8i+=C8Z;E8i+=C3Z;E8i+=c6Z;for(var i=R0w;i < dataSrc[E8i];i++){run(fieldInst,dataSrc[i]);}}else {run(fieldInst,dataSrc);}});if($[g8i](resolvedFields)){var M8i=D27;M8i+=N27;M8i+=a27;Editor[Q6Z](M8i,f9w);}return resolvedFields;};var __dtCellSelector=function(out,dt,identifier,allFields,idFn,forceFields){var K8i=Z6Z;K8i+=c8yy[653894];K8i+=C6Z;var x8i=c8yy[653894];x8i+=C8Z;x8i+=b8Z;x8i+=N40;dt[x8i](identifier)[M27]()[K8i](function(idx){var q27="ixedNode";var O27="ttac";var Q27="fixedNo";var F27="nodeN";var L27="column";var i27="ame";var e8i=C8Z;e8i+=a1Z;e8i+=c8yy[20443];e8i+=S8Z;var o8i=f8Z;o8i+=P8Z;o8i+=c8yy[404720];c8yy.S15();o8i+=C8Z;var m8i=c8yy.L9w;m8i+=q27;var j8i=Q27;j8i+=c8yy[404720];j8i+=C8Z;var S8i=c8yy[74252];S8i+=O27;S8i+=C6Z;var U8i=s1Z;U8i+=P8Z;U8i+=m4Z;var H8i=F27;H8i+=i27;var W8i=s1Z;W8i+=P8Z;W8i+=m4Z;var cell=dt[Y3Z](idx);var row=dt[W8i](idx[k70]);var data=row[k0Z]();var idSrc=idFn(data);var fields=forceFields || __dtFieldsFromIdx(dt,allFields,idx[L27]);var isNode=typeof identifier === E6Z && identifier[H8i] || identifier instanceof $;var prevDisplayFields,prevAttach;if(out[idSrc]){var Z8i=c8yy[74252];Z8i+=r38;Z8i+=V6Z;Z8i+=C6Z;prevAttach=out[idSrc][Z8i];prevDisplayFields=out[idSrc][B08];}__dtRowSelector(out,dt,idx[U8i],allFields,idFn);out[idSrc][z27]=prevAttach || [];out[idSrc][S8i][f6Z](isNode?$(identifier)[k90](R0w):cell[j8i]?cell[m8i]():cell[o8i]());out[idSrc][B08]=prevDisplayFields || ({});$[e8i](out[idSrc][B08],fields);});};var __dtColumnSelector=function(out,dt,identifier,fields,idFn){var T27="cells";var p8i=C8Z;p8i+=c8yy[74252];p8i+=c8yy[653894];p8i+=C6Z;dt[T27](O0Z,identifier)[M27]()[p8i](function(idx){__dtCellSelector(out,dt,idx,fields,idFn);});};var __dtjqId=function(id){var h27="ring";var n27="repla";var r27='\\$1';var N8i=n27;N8i+=k48;var D8i=Y1Z;D8i+=h27;return typeof id === D8i?q18 + id[N8i](/(:|\.|\[|\]|,)/g,r27):q18 + id;};__dataSources[a8i]={id:function(data){var s27="_fnGet";var P27="taFn";var l27="ObjectD";var O8i=s27;O8i+=l27;O8i+=c8yy[74252];O8i+=P27;var Q8i=P8Z;Q8i+=l7Z;Q8i+=H8Z;Q8i+=U4Z;var q8i=C8Z;q8i+=n1Z;var idFn=DataTable[q8i][Q8i][O8i](this[v8Z][a68]);return idFn(data);},individual:function(identifier,fieldNames){var L8i=c8yy.L9w;L8i+=U4Z;L8i+=C8Z;L8i+=Y9w;var i8i=w27;c8yy.S15();i8i+=U4Z;var F8i=V8Z;F8i+=c8yy[20443];var idFn=DataTable[F8i][i8i][u0Z](this[v8Z][a68]);var dt=__dtApi(this[v8Z][N10]);var fields=this[v8Z][L8i];var out={};var forceFields;var responsiveNode;if(fieldNames){if(!Array[y10](fieldNames)){fieldNames=[fieldNames];}forceFields={};$[N80](fieldNames,function(i,name){c8yy.g15();forceFields[name]=fields[name];});}__dtCellSelector(out,dt,identifier,fields,idFn,forceFields);return out;},fields:function(identifier){var G27="colum";var Y27="columns";var B27="idS";var R27="cel";var r8i=R27;r8i+=b8Z;r8i+=v8Z;var h8i=G27;h8i+=k00;var n8i=c8yy[20443];n8i+=c8yy[74252];c8yy.g15();n8i+=v1Z;n8i+=e10;var T8i=B27;T8i+=m08;var z8i=w27;z8i+=U4Z;var idFn=DataTable[U8Z][z8i][u0Z](this[v8Z][T8i]);var dt=__dtApi(this[v8Z][n8i]);var fields=this[v8Z][Z70];var out={};if($[d70](identifier) && (identifier[r88] !== undefined || identifier[h8i] !== undefined || identifier[r8i] !== undefined)){var s8i=c8yy[653894];s8i+=C8Z;s8i+=b8Z;s8i+=N40;if(identifier[r88] !== undefined){__dtRowSelector(out,dt,identifier[r88],fields,idFn);}if(identifier[Y27] !== undefined){__dtColumnSelector(out,dt,identifier[Y27],fields,idFn);}if(identifier[s8i] !== undefined){var l8i=c8yy[653894];l8i+=I1Z;l8i+=N40;__dtCellSelector(out,dt,identifier[l8i],fields,idFn);}}else {__dtRowSelector(out,dt,identifier,fields,idFn);}return out;},create:function(fields,data){var P8i=c8yy[20443];c8yy.g15();P8i+=S18;P8i+=C8Z;var dt=__dtApi(this[v8Z][P8i]);if(!__dtIsSsp(dt,this)){var R8i=c8yy[74252];R8i+=c8yy[404720];R8i+=c8yy[404720];var w8i=L18;w8i+=m4Z;var row=dt[w8i][R8i](data);__dtHighlight(row[y70]());}},edit:function(identifier,fields,data,store){var I57="Array";var y57="fnEx";var A57="taTab";var C57="rowId";var d27="tO";var k57="leExt";var f57="owI";var X57="aTab";var B8i=f8Z;B8i+=J38;var G8i=l08;G8i+=d27;c8yy.g15();G8i+=H8Z;G8i+=a80;var that=this;var dt=__dtApi(this[v8Z][N10]);if(!__dtIsSsp(dt,this) || this[v8Z][G8i][b57] === B8i){var u1i=f8Z;u1i+=z2Z;var b1i=c8yy[653894];b1i+=c8yy[74252];b1i+=b8Z;b1i+=b8Z;var d8i=U4Z;d8i+=c8yy[404720];var Y8i=S68;Y8i+=X57;Y8i+=b8Z;Y8i+=C8Z;var rowId=__dataSources[Y8i][d8i][b1i](this,data);var row;try{var X1i=s1Z;X1i+=P8Z;X1i+=m4Z;row=dt[X1i](__dtjqId(rowId));}catch(e){row=dt;}if(!row[V57]()){row=dt[k70](function(rowIdx,rowData,rowNode){c8yy.S15();var C1i=U4Z;C1i+=c8yy[404720];var V1i=S68;V1i+=p37;return rowId == __dataSources[V1i][C1i][J9Z](that,rowData);});}if(row[V57]()){var v1i=M40;v1i+=p4Z;v1i+=k48;var J1i=C57;J1i+=v8Z;var k1i=s1Z;k1i+=f57;k1i+=c8yy[404720];k1i+=v8Z;var A1i=U4Z;A1i+=f8Z;A1i+=I57;var y1i=r4Z;y1i+=y57;y1i+=q1Z;var I1i=P8Z;I1i+=l7Z;I1i+=H8Z;I1i+=U4Z;var f1i=B78;f1i+=A57;f1i+=k57;var extender=$[s5Z][f1i][I1i][y1i];var toSave=extender({},row[k0Z](),H6Z);toSave=extender(toSave,data,H6Z);row[k0Z](toSave);var idx=$[A1i](rowId,store[k1i]);store[J1i][v1i](idx,G0w);}else {row=dt[k70][K70](data);}__dtHighlight(row[u1i]());}},remove:function(identifier,fields,store){c8yy.S15();var J57="cancell";var u57="every";var v57="ows";var c1i=e10;c1i+=H58;var t1i=J57;t1i+=F1Z;var that=this;var dt=__dtApi(this[v8Z][N10]);var cancelled=store[t1i];if(cancelled[c1i] === R0w){dt[r88](identifier)[O38]();}else {var K1i=s1Z;K1i+=V50;K1i+=v8Z;var E1i=s1Z;E1i+=v57;var indexes=[];dt[E1i](identifier)[u57](function(){var M1i=c8yy[653894];M1i+=c8yy[74252];M1i+=b8Z;M1i+=b8Z;var g1i=c8yy[404720];g1i+=c8yy[74252];g1i+=c8yy[20443];g1i+=p37;var id=__dataSources[g1i][e2Z][M1i](that,this[k0Z]());if($[Y90](id,cancelled) === -G0w){var x1i=H8Z;x1i+=w1Z;x1i+=v8Z;x1i+=C6Z;indexes[x1i](this[d78]());}});dt[K1i](indexes)[O38]();}},prep:function(action,identifier,submit,json,store){c8yy.g15();var K57="cancelled";var x57="celle";var t57="ancell";var m1i=g10;m1i+=N38;var W1i=C8Z;W1i+=i8Z;if(action === W1i){var U1i=c8yy[404720];U1i+=c8yy[74252];U1i+=c8yy[20443];U1i+=c8yy[74252];var Z1i=c8yy[73441];Z1i+=c8yy[74252];Z1i+=H8Z;var H1i=c8yy[653894];H1i+=t57;H1i+=F1Z;var cancelled=json[H1i] || [];store[c57]=$[Z1i](submit[U1i],function(val,key){var g57="tyObj";var E57="inArra";var j1i=E57;j1i+=b4Z;var S1i=W27;S1i+=w78;c8yy.g15();S1i+=g57;S1i+=M57;return !$[S1i](submit[k0Z][key]) && $[j1i](key,cancelled) === -G0w?key:undefined;});}else if(action === m1i){var o1i=y87;o1i+=x57;o1i+=c8yy[404720];store[o1i]=json[K57] || [];}},commit:function(action,identifier,data,store){var Q57="searchPa";var q57="bServerSide";c8yy.g15();var o57="ures";var U57="sett";var O57="nes";var H57="bServe";var a57="searchPanes";var N57="recalc";var F57="rebuildPane";var D57="responsive";var Z57="rSid";var p57="aw";var m57="oFea";var j57="ny";var S57="gs";var p1i=F1Z;p1i+=I2Z;var e1i=c8yy[20443];e1i+=a9Z;e1i+=b8Z;e1i+=C8Z;var that=this;var dt=__dtApi(this[v8Z][e1i]);if(!__dtIsSsp(dt,this) && action === p1i && store[c57][M6Z]){var D1i=s1Z;D1i+=V50;D1i+=e4Z;D1i+=X8Z;var ids=store[D1i];var row;var compare=function(id){c8yy.S15();return function(rowIdx,rowData,rowNode){var W57="cal";var q1i=W57;q1i+=b8Z;var a1i=U4Z;a1i+=c8yy[404720];var N1i=c8yy[404720];N1i+=w7Z;N1i+=c8yy[74252];N1i+=I27;c8yy.g15();return id == __dataSources[N1i][a1i][q1i](that,rowData);};};for(var i=R0w,ien=ids[M6Z];i < ien;i++){var z1i=H57;z1i+=Z57;z1i+=C8Z;var L1i=U57;L1i+=W7Z;L1i+=S57;var i1i=G60;i1i+=b4Z;var O1i=c8yy[74252];O1i+=j57;try{var Q1i=s1Z;Q1i+=P8Z;Q1i+=m4Z;row=dt[Q1i](__dtjqId(ids[i]));}catch(e){row=dt;}if(!row[O1i]()){var F1i=s1Z;F1i+=P8Z;F1i+=m4Z;row=dt[F1i](compare(ids[i]));}if(row[i1i]() && !dt[L1i]()[R0w][a37][z1i]){var T1i=e9Z;T1i+=P8Z;T1i+=g2Z;row[T1i]();}}}var drawType=this[v8Z][H38][b57];if(drawType !== Z10){var h1i=m57;h1i+=c8yy[20443];h1i+=o57;var n1i=e57;n1i+=p57;dt[n1i](drawType);if(dt[D57]){dt[D57][N57]();}if(typeof dt[a57] === f9Z && !dt[C0Z]()[R0w][h1i][q57]){var r1i=Q57;r1i+=O57;dt[r1i][F57](undefined,H6Z);}}}};function __html_id(identifier){var L57="[data-edito";var z57="-id=";var T57='Could not find an element with `data-editor-id` or `id` of: ';var context=document;if(identifier !== i57){var P1i=e10;P1i+=f8Z;P1i+=D4Z;P1i+=c6Z;var l1i=Y6Z;l1i+=i08;var s1i=L57;s1i+=s1Z;s1i+=z57;s1i+=Y6Z;context=$(s1i + identifier + l1i);if(context[M6Z] === R0w){context=typeof identifier === Q90?$(__dtjqId(identifier)):$(identifier);}if(context[P1i] === R0w){throw T57 + identifier;}}return context;}function __html_el(identifier,name){var h57="ditor-field";var n57="[data-e";var w1i=n57;w1i+=h57;w1i+=F08;var context=__html_id(identifier);return $(w1i + name + X6Z,context);}function __html_els(identifier,names){var out=$();for(var i=R0w,ien=names[M6Z];i < ien;i++){var R1i=F9Z;R1i+=c8yy[404720];out=out[R1i](__html_el(identifier,names[i]));}return out;}function __html_get(identifier,dataSrc){var w57="-value]";var l57="eng";var r57="ta-edito";var s57="r-valu";var d1i=w87;d1i+=b8Z;var Y1i=B78;Y1i+=r57;Y1i+=s57;Y1i+=C8Z;var B1i=b8Z;B1i+=l57;B1i+=c8yy[20443];B1i+=C6Z;var G1i=q08;G1i+=U4Z;G1i+=P57;G1i+=w57;var el=__html_el(identifier,dataSrc);return el[R57](G1i)[B1i]?el[L90](Y1i):el[d1i]();}function __html_set(identifier,fields,data){c8yy.g15();var b4i=C8Z;b4i+=V6Z;b4i+=C6Z;$[b4i](fields,function(name,field){var X67='data-editor-value';var Y57="[d";var B57="Data";var b67="il";var d57="ata-editor-value]";var G57="rom";var X4i=d0Z;X4i+=x3Z;X4i+=G57;X4i+=B57;var val=field[X4i](data);if(val !== undefined){var I4i=e10;I4i+=H58;var f4i=Y57;f4i+=d57;var C4i=c8yy.L9w;C4i+=b67;C4i+=B30;var V4i=k0Z;V4i+=S47;var el=__html_el(identifier,field[V4i]());if(el[C4i](f4i)[I4i]){el[L90](X67,val);}else {el[N80](function(){var f67="emoveC";var C67="odes";var I67="firstChild";var V67="childN";var y4i=V67;y4i+=C67;while(this[y4i][M6Z]){var A4i=s1Z;A4i+=f67;A4i+=g00;A4i+=a2Z;this[A4i](this[I67]);}})[L10](val);}}});}__dataSources[L10]={id:function(data){var y67="oA";c8yy.S15();var k4i=y67;k4i+=P7Z;var idFn=DataTable[U8Z][k4i][u0Z](this[v8Z][a68]);return idFn(data);},initField:function(cfg){var A67='[data-editor-label="';var J4i=e10;J4i+=f8Z;J4i+=u6Z;var label=$(A67 + (cfg[k0Z] || cfg[J0Z]) + X6Z);if(!cfg[E80] && label[J4i]){var v4i=C6Z;v4i+=M80;v4i+=b8Z;cfg[E80]=label[v4i]();}},individual:function(identifier,fieldNames){var M67="ly determine field name";var g67="Cannot automatical";var k67="-id";var c67="or-";var J67="itor-id]";var u67="nts";var v67="par";var x67=" from data ";var E67='andSelf';var K67="source";var S4i=C8Z;S4i+=c8yy[74252];S4i+=c8yy[653894];S4i+=C6Z;var U4i=c8yy.L9w;U4i+=U4Z;U4i+=u5Z;U4i+=v8Z;var Z4i=N2Z;Z4i+=b8Z;Z4i+=X8Z;var H4i=C6Z;H4i+=c8yy[20443];H4i+=s87;c8yy.S15();var u4i=y70;u4i+=Z3Z;var attachEl;if(identifier instanceof $ || identifier[u4i]){var K4i=A88;K4i+=Q2Z;K4i+=k67;var x4i=q08;x4i+=J67;var M4i=v67;M4i+=C8Z;M4i+=u67;var g4i=n48;g4i+=c8yy[74252];g4i+=i10;var E4i=c8yy.L9w;E4i+=f8Z;attachEl=identifier;if(!fieldNames){var c4i=k0Z;c4i+=t67;c4i+=c67;c4i+=o70;var t4i=c8yy[74252];t4i+=c8yy[20443];t4i+=c8yy[20443];t4i+=s1Z;fieldNames=[$(identifier)[t4i](c4i)];}var back=$[E4i][h48]?g4i:E67;identifier=$(identifier)[M4i](x4i)[back]()[k0Z](K4i);}if(!identifier){identifier=i57;}if(fieldNames && !Array[y10](fieldNames)){fieldNames=[fieldNames];}if(!fieldNames || fieldNames[M6Z] === R0w){var W4i=g67;W4i+=M67;W4i+=x67;W4i+=K67;throw W4i;}var out=__dataSources[H4i][Z4i][J9Z](this,identifier);var fields=this[v8Z][U4i];var forceFields={};$[S4i](fieldNames,function(i,name){c8yy.S15();forceFields[name]=fields[name];});$[N80](out,function(id,set){var o4i=j10;o4i+=J70;var m4i=v2Z;m4i+=l7Z;m4i+=s1Z;m4i+=D80;var j4i=c8yy[653894];c8yy.S15();j4i+=C8Z;j4i+=w90;set[w4Z]=j4i;set[z27]=attachEl?$(attachEl):__html_els(identifier,fieldNames)[m4i]();set[o4i]=fields;set[B08]=forceFields;});return out;},fields:function(identifier){var N4i=C8Z;N4i+=c8yy[74252];N4i+=c8yy[653894];N4i+=C6Z;var D4i=c8yy.L9w;D4i+=I0Z;D4i+=Y9w;var e4i=C6Z;e4i+=R87;var out={};var self=__dataSources[e4i];if(Array[y10](identifier)){for(var i=R0w,ien=identifier[M6Z];i < ien;i++){var p4i=N2Z;p4i+=Y9w;var res=self[p4i][J9Z](this,identifier[i]);out[identifier[i]]=res[identifier[i]];}return out;}c8yy.S15();var data={};var fields=this[v8Z][D4i];if(!identifier){identifier=i57;}$[N4i](fields,function(name,field){var H67="lT";var q4i=W67;q4i+=H67;q4i+=Z67;q4i+=x47;var a4i=B78;a4i+=D70;a4i+=S47;var val=__html_get(identifier,field[a4i]());c8yy.g15();field[q4i](data,val === O0Z?undefined:val);});out[identifier]={idSrc:identifier,data:data,node:document,fields:fields,type:g40};return out;},create:function(fields,data){c8yy.S15();if(data){var O4i=U4Z;O4i+=c8yy[404720];var Q4i=w87;Q4i+=b8Z;var id=__dataSources[Q4i][O4i][J9Z](this,data);try{var F4i=t6Z;F4i+=c8yy[20443];F4i+=C6Z;if(__html_id(id)[F4i]){__html_set(id,fields,data);}}catch(e){;}}},edit:function(identifier,fields,data){var L4i=U4Z;L4i+=c8yy[404720];var i4i=C6Z;i4i+=c8yy[20443];i4i+=c8yy[73441];i4i+=b8Z;var id=__dataSources[i4i][L4i][J9Z](this,data) || i57;__html_set(id,fields,data);},remove:function(identifier,fields){__html_id(identifier)[O38]();}};})();Editor[W9Z]={"wrapper":h18,"processing":{"indicator":z4i,"active":L80},"header":{"wrapper":T4i,"content":U67},"body":{"wrapper":S67,"content":j67},"footer":{"wrapper":n4i,"content":m67},"form":{"wrapper":h4i,"content":r4i,"tag":c8yy.r9w,"info":s4i,"error":o67,"buttons":l4i,"button":P4i,"buttonInternal":e67},"field":{"wrapper":w4i,"typePrefix":p67,"namePrefix":D67,"label":R4i,"input":G4i,"inputControl":N67,"error":a67,"msg-label":B4i,"msg-error":Y4i,"msg-message":d4i,"msg-info":b3i,"multiValue":q67,"multiInfo":X3i,"multiRestore":Q67,"multiNoEdit":O67,"disabled":Y0Z,"processing":V3i},"actions":{"create":C3i,"edit":f3i,"remove":F67},"inline":{"wrapper":I3i,"liner":i67,"buttons":L67},"bubble":{"wrapper":y3i,"liner":z67,"table":T67,"close":n67,"pointer":h67,"bg":A3i}};(function(){var I77="editor_edit";var P67="removeSing";var G67="ws";var X77="ditor_create";var w67="Single";var S77="formMessage";var V77="BUTTONS";var d67="ons-create";var r67="S";var f77="formButtons";var n77="remo";var G77='selectedSingle';var b77="editor_rem";var R67="-remove";var s67="ingl";var R77="editSingle";var y77="select_single";var j77="formTitle";var R2i=C8Z;R2i+=n1Z;R2i+=S8Z;var w2i=O38;w2i+=r67;w2i+=s67;w2i+=C8Z;var P2i=s1Z;P2i+=l67;P2i+=P8Z;P2i+=g2Z;var l2i=P67;l2i+=e10;var s2i=V8Z;s2i+=q1Z;var r2i=C8Z;r2i+=J10;r2i+=c8yy[20443];r2i+=w67;var h2i=C8Z;h2i+=c8yy[404720];h2i+=U4Z;h2i+=c8yy[20443];var n2i=V8Z;n2i+=c8yy[20443];n2i+=h1Z;n2i+=c8yy[404720];var U2i=w2Z;U2i+=v8Z;U2i+=R67;var M2i=s1Z;M2i+=P8Z;M2i+=G67;var X2i=m48;X2i+=t67;var Y3i=B67;Y3i+=Y67;var T3i=C08;T3i+=d67;var F3i=U8Z;F3i+=C8Z;F3i+=a40;var O3i=l00;O3i+=c8yy[20443];O3i+=c8yy.n9w;O3i+=v8Z;if(DataTable[n68]){var U3i=B67;U3i+=c8yy[653894];U3i+=c8yy[20443];var Z3i=U8Z;Z3i+=S8Z;var H3i=b77;H3i+=h68;var J3i=c8yy[20443];J3i+=V8Z;J3i+=c8yy[20443];var k3i=C8Z;k3i+=X77;var ttButtons=DataTable[n68][V77];var ttButtonBase={sButtonText:O0Z,editor:O0Z,formTitle:O0Z};ttButtons[k3i]=$[X50](H6Z,ttButtons[J3i],ttButtonBase,{formButtons:[{label:O0Z,fn:function(e){this[U90]();}}],fnClick:function(button,config){var C77="itor";var E3i=H2Z;E3i+=y28;E3i+=C8Z;var c3i=c8yy[653894];c3i+=s1Z;c3i+=I88;c3i+=C8Z;var u3i=Y48;u3i+=d48;var v3i=F1Z;v3i+=C77;var editor=config[v3i];var i18nCreate=editor[Y7Z][u3i];var buttons=config[f77];c8yy.S15();if(!buttons[R0w][E80]){var t3i=b8Z;t3i+=a9Z;t3i+=C8Z;t3i+=b8Z;buttons[R0w][t3i]=i18nCreate[U90];}editor[c3i]({title:i18nCreate[E3i],buttons:buttons});}});ttButtons[I77]=$[X50](H6Z,ttButtons[y77],ttButtonBase,{formButtons:[{label:O0Z,fn:function(e){this[U90]();}}],fnClick:function(button,config){var A77="fnGetSelectedIndexes";var W3i=C8Z;W3i+=J10;W3i+=c8yy[20443];var x3i=F1Z;x3i+=I2Z;var M3i=U4Z;M3i+=P9w;M3i+=m5Z;M3i+=f8Z;var g3i=e10;g3i+=H58;var selected=this[A77]();if(selected[g3i] !== G0w){return;}var editor=config[G9w];var i18nEdit=editor[M3i][x3i];var buttons=config[f77];if(!buttons[R0w][E80]){var K3i=k77;K3i+=I1Z;buttons[R0w][K3i]=i18nEdit[U90];}editor[W3i](selected[R0w],{title:i18nEdit[w98],buttons:buttons});}});ttButtons[H3i]=$[Z3i](H6Z,ttButtons[U3i],ttButtonBase,{question:O0Z,formButtons:[{label:O0Z,fn:function(e){c8yy.S15();var S3i=X5Z;S3i+=c8yy[73441];S3i+=I2Z;var that=this;this[S3i](function(json){var u77="fnGetInstance";var J77="Sele";var v77="tNone";var m3i=s5Z;m3i+=J77;m3i+=c8yy[653894];m3i+=v77;var j3i=t80;j3i+=r2Z;var tt=$[s5Z][X70][n68][u77]($(that[v8Z][N10])[d5Z]()[N10]()[j3i]());tt[m3i]();});}}],fnClick:function(button,config){var E77="GetSele";var c77="Buttons";var t77="firm";c8yy.g15();var g77="ctedIndexes";var Q3i=Z9Z;Q3i+=u6Z;var q3i=w80;q3i+=i2Z;q3i+=c8yy[653894];q3i+=C8Z;var N3i=k68;N3i+=t77;var D3i=g70;D3i+=C6Z;var p3i=c8yy.L9w;p3i+=d58;p3i+=c77;var e3i=s1Z;e3i+=M37;e3i+=g2Z;var o3i=s5Z;o3i+=E77;o3i+=g77;var rows=this[o3i]();if(rows[M6Z] === R0w){return;}var editor=config[G9w];var i18nRemove=editor[Y7Z][e3i];var buttons=config[p3i];var question=typeof i18nRemove[k28] === Q90?i18nRemove[k28]:i18nRemove[k28][rows[D3i]]?i18nRemove[k28][rows[M6Z]]:i18nRemove[N3i][r4Z];if(!buttons[R0w][E80]){var a3i=b8Z;a3i+=a7Z;a3i+=b8Z;buttons[R0w][a3i]=i18nRemove[U90];}editor[O38](rows,{message:question[q3i](/%d/g,rows[Q3i]),title:i18nRemove[w98],buttons:buttons});}});}var _buttons=DataTable[U8Z][O3i];$[F3i](_buttons,{create:{text:function(dt,node,config){var M77="ns.cr";var z3i=f37;z3i+=c8yy[20443];z3i+=C8Z;c8yy.S15();var L3i=U4Z;L3i+=P9w;L3i+=m5Z;L3i+=f8Z;var i3i=e87;i3i+=M77;i3i+=C8Z;i3i+=d48;return dt[Y7Z](i3i,config[G9w][L3i][z3i][w2Z]);},className:T3i,editor:O0Z,formButtons:{text:function(editor){var n3i=U4Z;n3i+=P9w;n3i+=H00;c8yy.S15();return editor[n3i][V88][U90];},action:function(e){this[U90]();}},formMessage:O0Z,formTitle:O0Z,action:function(e,dt,node,config){var K77="formButton";var W77="proce";var H77="sin";var Z77='preOpen';var x77="eate";var B3i=J88;B3i+=x77;var G3i=H30;G3i+=f8Z;var R3i=c8yy[653894];R3i+=L17;var w3i=U4Z;w3i+=P9w;w3i+=m5Z;w3i+=f8Z;var P3i=K77;P3i+=v8Z;var l3i=J88;l3i+=C8Z;l3i+=d48;var r3i=P8Z;r3i+=f8Z;r3i+=C8Z;var h3i=W77;h3i+=v8Z;h3i+=H77;h3i+=D4Z;var that=this;var editor=config[G9w];this[h3i](H6Z);editor[r3i](Z77,function(){var U77="oce";c8yy.g15();var s3i=H8Z;s3i+=s1Z;s3i+=U77;s3i+=a17;that[s3i](g6Z);})[l3i]({buttons:config[P3i],message:config[S77] || editor[w3i][R3i][n00],title:config[j77] || editor[G3i][B3i][w98]});}},edit:{extend:Y3i,text:function(dt,node,config){var m77='buttons.edit';var b2i=U4Z;b2i+=P9w;b2i+=m5Z;b2i+=f8Z;var d3i=A88;d3i+=Q2Z;c8yy.g15();return dt[Y7Z](m77,config[d3i][b2i][A88][w2Z]);},className:X2i,editor:O0Z,formButtons:{text:function(editor){c8yy.S15();return editor[Y7Z][A88][U90];},action:function(e){c8yy.g15();var V2i=v8Z;V2i+=G4Z;V2i+=O90;V2i+=c8yy[20443];this[V2i]();}},formMessage:O0Z,formTitle:O0Z,action:function(e,dt,node,config){var q77="mns";var p77="process";var N77="inde";var a77="colu";var e77="reOp";var o77="formBut";var g2i=H2Z;g2i+=c8yy[20443];g2i+=b8Z;g2i+=C8Z;var E2i=C8Z;E2i+=J10;E2i+=c8yy[20443];var c2i=U4Z;c2i+=A28;var t2i=U4Z;t2i+=P9w;t2i+=m5Z;t2i+=f8Z;var u2i=o77;u2i+=P00;var J2i=H8Z;J2i+=e77;J2i+=h1Z;var k2i=P8Z;k2i+=f8Z;k2i+=C8Z;var A2i=p77;A2i+=i80;var y2i=Z9Z;y2i+=D77;y2i+=C6Z;var I2i=N77;I2i+=a1Z;I2i+=K4Z;var f2i=c8yy[653894];f2i+=C8Z;f2i+=w90;f2i+=v8Z;var C2i=a77;C2i+=q77;var that=this;var editor=config[G9w];var rows=dt[r88]({selected:H6Z})[M27]();var columns=dt[C2i]({selected:H6Z})[M27]();var cells=dt[f2i]({selected:H6Z})[I2i]();var items=columns[y2i] || cells[M6Z]?{rows:rows,columns:columns,cells:cells}:rows;this[A2i](H6Z);editor[k2i](J2i,function(){var Q77="cessin";var v2i=H8Z;v2i+=L18;c8yy.S15();v2i+=Q77;v2i+=D4Z;that[v2i](g6Z);})[A88](items,{buttons:config[u2i],message:config[S77] || editor[t2i][A88][n00],title:config[j77] || editor[c2i][E2i][g2i]});}},remove:{extend:O77,limitTo:[M2i],text:function(dt,node,config){var i77="ito";var L77=".remove";var Z2i=v1Z;Z2i+=p87;Z2i+=c8yy.n9w;var H2i=s1Z;c8yy.g15();H2i+=l67;H2i+=h68;var W2i=U4Z;W2i+=F77;W2i+=f8Z;var K2i=F1Z;K2i+=i77;K2i+=s1Z;var x2i=m48;x2i+=L77;return dt[Y7Z](x2i,config[K2i][W2i][H2i][Z2i]);},className:U2i,editor:O0Z,formButtons:{text:function(editor){c8yy.S15();var z77="ubmit";var S2i=v8Z;S2i+=z77;return editor[Y7Z][O38][S2i];},action:function(e){var j2i=X5Z;j2i+=B4Z;this[j2i]();}},formMessage:function(editor,dt){var T77="irm";var N2i=t6Z;N2i+=c6Z;var D2i=k68;D2i+=c8yy.L9w;D2i+=T77;var p2i=k68;p2i+=j10;p2i+=e1Z;var e2i=n77;e2i+=g2Z;var o2i=W7Z;o2i+=r2Z;o2i+=a1Z;o2i+=K4Z;var m2i=L18;m2i+=G67;var rows=dt[m2i]({selected:H6Z})[o2i]();var i18n=editor[Y7Z][e2i];var question=typeof i18n[k28] === Q90?i18n[k28]:i18n[p2i][rows[M6Z]]?i18n[D2i][rows[N2i]]:i18n[k28][r4Z];return question[d80](/%d/g,rows[M6Z]);},formTitle:O0Z,action:function(e,dt,node,config){var P77="essing";var w77="dito";var l77="proc";var h77="formB";var s77="preO";var r77="utton";var T2i=e9Z;T2i+=P8Z;T2i+=g2Z;var z2i=W00;z2i+=m5Z;z2i+=f8Z;var L2i=h77;L2i+=r77;L2i+=v8Z;var i2i=L18;i2i+=G67;var F2i=n77;F2i+=J2Z;c8yy.S15();F2i+=C8Z;var O2i=s77;O2i+=H8Z;O2i+=C8Z;O2i+=f8Z;var Q2i=c8yy.n9w;Q2i+=C8Z;var q2i=l77;q2i+=P77;var a2i=C8Z;a2i+=w77;a2i+=s1Z;var that=this;var editor=config[a2i];this[q2i](H6Z);editor[Q2i](O2i,function(){c8yy.S15();that[L80](g6Z);})[F2i](dt[i2i]({selected:H6Z})[M27](),{buttons:config[L2i],message:config[S77],title:config[j77] || editor[z2i][T2i][w98]});}}});_buttons[R77]=$[n2i]({},_buttons[h2i]);_buttons[r2i][s2i]=G77;_buttons[l2i]=$[X50]({},_buttons[P2i]);_buttons[w2i][R2i]=G77;})();Editor[f0Z]={};Editor[G2i]=function(input,opts){var x07="<sel";var X07="-e";var H07="n></";var U07="</b";var w07='-month"></select>';var D07="<div clas";var Y07='-error"></div>';var B07='-seconds"></div>';var J07="alend";var M07="abel\">";var G07='-minutes"></div>';var F07="DateTime";var Q07="e\">";var a07=" clas";var u07="-year\"";var R07='-time">';var O07="ment";var f07="calend";var c07="<select";var j07="<button";var I07="div class=\"";var N07="<div";var m07="/button";var b97="_instance";var o07="revi";var P07='-label">';var K07="ect ";var X97=/[YMD]|L(?!T)|l/;var s07='-iconLeft">';var A97="_constructor";var g07="an></span>";var p07="<bu";var d07='editor-dateime-';var l07='-iconRight">';var v07="ar\"></";var S07="tton>";var t07="</select>";var V07="-t";var k07="-c";var T07="Editor datetime: Without momentjs only the format 'YYYY-MM-DD' can be used";var B77="nta";var C97=/[haA]/;var r07='-title">';var y07="hours\"></div>";var d77="tch";var e07="ous";var q07="-da";var V97=/[Hhm]|LT|LTS/;var Y77="matc";var n5i=c8yy[404720];n5i+=P8Z;n5i+=c8yy[73441];var T5i=n40;T5i+=a40;var z5i=c8yy[404720];z5i+=P8Z;z5i+=c8yy[73441];var L5i=C8Z;L5i+=T9Z;var i5i=m6Z;i5i+=c8yy[73441];var F5i=I9Z;F5i+=S8Z;var O5i=c8yy[74252];O5i+=T40;O5i+=S8Z;var Q5i=R5Z;Q5i+=B77;Q5i+=z9Z;var q5i=Q50;q5i+=c8yy[20443];q5i+=c8yy[653894];q5i+=C6Z;var a5i=Y77;a5i+=C6Z;var N5i=c8yy[73441];N5i+=c8yy[74252];N5i+=d77;var D5i=c8yy.L9w;D5i+=P8Z;D5i+=s1Z;D5i+=b07;var p5i=X07;p5i+=s1Z;p5i+=G38;var e5i=V07;e5i+=y8Z;e5i+=C8Z;var o5i=C07;o5i+=f07;o5i+=t10;var m5i=C07;m5i+=w98;var j5i=c8yy.L9w;j5i+=W7Z;j5i+=c8yy[404720];var S5i=C07;S5i+=B78;S5i+=Z4Z;var U5i=J7Z;U5i+=n18;U5i+=R6Z;var Z5i=h6Z;Z5i+=I07;var H5i=C07;H5i+=y07;var W5i=A07;W5i+=m40;var K5i=k07;K5i+=J07;K5i+=v07;K5i+=v7Z;var x5i=h6Z;x5i+=P6Z;x5i+=x00;var M5i=u07;M5i+=R6Z;M5i+=t07;var g5i=c07;g5i+=E07;g5i+=Y6Z;var E5i=h6Z;E5i+=M40;E5i+=g07;var c5i=j7Z;c5i+=M07;var t5i=x07;t5i+=K07;t5i+=a90;t5i+=F08;var u5i=W07;u5i+=H07;u5i+=M40;u5i+=Z07;var v5i=h6Z;v5i+=o40;v5i+=R6Z;var J5i=U07;J5i+=w1Z;J5i+=S07;var k5i=D48;k5i+=a1Z;k5i+=c8yy[20443];var A5i=j07;A5i+=R6Z;var y5i=h6Z;y5i+=A68;y5i+=J10;y5i+=m40;var I5i=h6Z;I5i+=m07;I5i+=R6Z;var f5i=H8Z;f5i+=o07;f5i+=e07;var C5i=p07;C5i+=N90;C5i+=R6Z;var V5i=D07;V5i+=v8Z;V5i+=F08;var X5i=N07;X5i+=a07;X5i+=w58;var b5i=q07;b5i+=c8yy[20443];b5i+=Q07;var d2i=D07;d2i+=w58;var Y2i=c8yy[73441];Y2i+=P8Z;Y2i+=O07;var B2i=U4Z;B2i+=P9w;B2i+=m5Z;B2i+=f8Z;this[c8yy[653894]]=$[X50](H6Z,{},Editor[F07][d7Z],opts);var classPrefix=this[c8yy[653894]][i07];var i18n=this[c8yy[653894]][B2i];if(!window[Y2i] && this[c8yy[653894]][L07] !== z07){throw T07;}var timeBlock=function(type){var n07='-timeblock">';c8yy.g15();return E0Z + classPrefix + n07 + p0Z;};var gap=function(){var h07='<span>:</span>';return h07;};var structure=$(d2i + classPrefix + W0Z + E0Z + classPrefix + b5i + X5i + classPrefix + r07 + V5i + classPrefix + s07 + C5i + i18n[f5i] + I5i + y5i + E0Z + classPrefix + l07 + A5i + i18n[k5i] + J5i + v5i + E0Z + classPrefix + P07 + u5i + t5i + classPrefix + w07 + p0Z + E0Z + classPrefix + c5i + E5i + g5i + classPrefix + M5i + p0Z + x5i + E0Z + classPrefix + K5i + W5i + E0Z + classPrefix + R07 + E0Z + classPrefix + H5i + E0Z + classPrefix + G07 + E0Z + classPrefix + B07 + p0Z + Z5i + classPrefix + Y07 + U5i);this[r0Z]={container:structure,date:structure[n08](j48 + classPrefix + S5i),title:structure[j5i](j48 + classPrefix + m5i),calendar:structure[n08](j48 + classPrefix + o5i),time:structure[n08](j48 + classPrefix + e5i),error:structure[n08](j48 + classPrefix + p5i),input:$(input)};this[v8Z]={d:O0Z,display:O0Z,minutesRange:O0Z,secondsRange:O0Z,namespace:d07 + Editor[F07][b97]++,parts:{date:this[c8yy[653894]][D5i][N5i](X97) !== O0Z,time:this[c8yy[653894]][L07][a5i](V97) !== O0Z,seconds:this[c8yy[653894]][L07][H48](r5Z) !== -G0w,hours12:this[c8yy[653894]][L07][q5i](C97) !== O0Z}};this[r0Z][Q5i][O5i](this[r0Z][f97])[F5i](this[i5i][I97])[x80](this[r0Z][L5i]);this[r0Z][f97][x80](this[z5i][w98])[T5i](this[n5i][y97]);this[A97]();};$[h5i](Editor[r5i][s5i],{destroy:function(){var J97='.editor-datetime';var w5i=c8yy[404720];w5i+=P8Z;c8yy.g15();w5i+=c8yy[73441];var P5i=P8Z;P5i+=E08;var l5i=L9Z;l5i+=z9Z;this[d40]();this[r0Z][l5i][P5i]()[k97]();this[w5i][d9Z][F20](J97);},errorMsg:function(msg){var error=this[r0Z][Q6Z];if(msg){var R5i=w87;R5i+=b8Z;error[R5i](msg);}else {error[k97]();}},hide:function(){var G5i=r4Z;c8yy.S15();G5i+=C6Z;G5i+=e2Z;G5i+=C8Z;this[G5i]();},max:function(date){var v97="_setC";var t97="maxDate";var u97="lander";var B5i=v97;B5i+=c8yy[74252];B5i+=u97;c8yy.g15();this[c8yy[653894]][t97]=date;this[c97]();this[B5i]();},min:function(date){var g97="nsT";var E97="_opti";var d5i=E97;d5i+=P8Z;d5i+=g97;d5i+=u2Z;var Y5i=c8yy[73441];Y5i+=W7Z;Y5i+=M97;Y5i+=Z4Z;this[c8yy[653894]][Y5i]=date;this[d5i]();this[x97]();},owns:function(node){var b6i=K97;c8yy.g15();b6i+=x9Z;return $(node)[j9Z]()[R57](this[r0Z][b6i])[M6Z] > R0w;},val:function(set,write){var m97="ri";var Q97="mome";var p97="_date";var e97="now";var D97="ToU";var q97="ali";var L97="utc";var F97="tric";var W97="_setT";var O97="ntS";var U97="TC";var H97="_setCalan";var i97="orma";var a97="sV";var o97="--";var S97="isplay";var j97="toStrin";var n97=/(\d{4})\-(\d{2})\-(\d{2})/;var T97="toDate";var M6i=W97;M6i+=y8Z;M6i+=C8Z;var g6i=H97;g6i+=E70;var E6i=Z97;E6i+=U97;E6i+=M8Z;E6i+=d48;var c6i=c8yy[404720];c6i+=S97;var t6i=j97;t6i+=D4Z;var u6i=T2Z;u6i+=c8yy[74252];c8yy.g15();u6i+=b4Z;var C6i=v8Z;C6i+=c8yy[20443];C6i+=m97;C6i+=C3Z;var V6i=o97;V6i+=e97;if(set === undefined){return this[v8Z][c8yy[404720]];}if(set instanceof Date){var X6i=p97;X6i+=D97;X6i+=c8yy[20443];X6i+=c8yy[653894];this[v8Z][c8yy[404720]]=this[X6i](set);}else if(set === O0Z || set === h5Z){this[v8Z][c8yy[404720]]=O0Z;}else if(set === V6i){this[v8Z][c8yy[404720]]=new Date();}else if(typeof set === C6i){if(window[N97]){var y6i=U4Z;y6i+=a97;y6i+=q97;y6i+=c8yy[404720];var I6i=Q97;I6i+=O97;I6i+=F97;I6i+=c8yy[20443];var f6i=c8yy.L9w;f6i+=i97;f6i+=c8yy[20443];var m=window[N97][L97](set,this[c8yy[653894]][f6i],this[c8yy[653894]][z97],this[c8yy[653894]][I6i]);this[v8Z][c8yy[404720]]=m[y6i]()?m[T97]():O0Z;}else {var A6i=Q50;A6i+=c8yy[20443];A6i+=c8yy[653894];A6i+=C6Z;var match=set[A6i](n97);this[v8Z][c8yy[404720]]=match?new Date(Date[h97](match[G0w],match[B0w] - G0w,match[Y0w])):O0Z;}}if(write || write === undefined){if(this[v8Z][c8yy[404720]]){this[r97]();}else {var J6i=J2Z;J6i+=Y2Z;var k6i=c8yy[404720];k6i+=P8Z;k6i+=c8yy[73441];this[k6i][d9Z][J6i](set);}}if(!this[v8Z][c8yy[404720]]){var v6i=r4Z;v6i+=s97;v6i+=c8yy[20443];v6i+=c8yy[653894];this[v8Z][c8yy[404720]]=this[v6i](new Date());}this[v8Z][u6i]=new Date(this[v8Z][c8yy[404720]][t6i]());this[v8Z][c6i][E6i](G0w);this[l97]();this[g6i]();this[M6i]();},_constructor:function(){var I8X=':visible';var P97="ainer";var w97="tim";var y8X='keyup.editor-datetime';var C8X='focus.editor-datetime click.editor-datetime';var V8X='autocomplete';var G97="ssPrefix";var R97="art";c8yy.g15();var X8X='-seconds';var b8X="seconds";var o7i=e50;o7i+=j6Z;var m7i=P8Z;m7i+=f8Z;var b7i=v8Z;b7i+=C8Z;b7i+=e10;b7i+=W6Z;var d6i=b68;d6i+=P97;var Y6i=c8yy[404720];Y6i+=P8Z;Y6i+=c8yy[73441];var l6i=P8Z;l6i+=f8Z;var F6i=P8Z;F6i+=c8yy.L9w;F6i+=c8yy.L9w;var e6i=w97;e6i+=C8Z;var o6i=H8Z;o6i+=R97;o6i+=v8Z;var U6i=c8yy[404720];U6i+=c8yy[74252];U6i+=c8yy[20443];U6i+=C8Z;var x6i=c8yy[653894];x6i+=i2Z;x6i+=G97;var that=this;var classPrefix=this[c8yy[653894]][x6i];var onChange=function(){var Y97="onChange";var Z6i=U4Z;Z6i+=B97;Z6i+=w1Z;Z6i+=c8yy[20443];var H6i=c8yy[404720];H6i+=P8Z;H6i+=c8yy[73441];var W6i=J2Z;W6i+=Y2Z;var K6i=Y9Z;K6i+=w1Z;K6i+=c8yy[20443];that[c8yy[653894]][Y97][J9Z](that,that[r0Z][K6i][W6i](),that[v8Z][c8yy[404720]],that[H6i][Z6i]);};if(!this[v8Z][d97][U6i]){var m6i=c8yy[653894];m6i+=v8Z;m6i+=v8Z;var j6i=S68;j6i+=C8Z;var S6i=c8yy[404720];S6i+=P8Z;S6i+=c8yy[73441];this[S6i][j6i][m6i](m9Z,Z10);}if(!this[v8Z][o6i][e6i]){var p6i=m6Z;p6i+=c8yy[73441];this[p6i][I97][z0Z](m9Z,Z10);}if(!this[v8Z][d97][b8X]){var O6i=g10;O6i+=i17;O6i+=C8Z;var Q6i=M40;Q6i+=G60;var q6i=H2Z;q6i+=O88;var a6i=c8yy[404720];a6i+=P8Z;a6i+=c8yy[73441];var N6i=c8yy[404720];N6i+=U4Z;N6i+=b28;var D6i=O60;D6i+=c8yy[404720];D6i+=c00;this[r0Z][I97][D6i](N6i + classPrefix + X8X)[O38]();this[a6i][q6i][P40](Q6i)[z00](G0w)[O6i]();}this[c97]();this[r0Z][d9Z][L90](V8X,F6i)[c8yy.n9w](C8X,function(){var f8X=":di";var s6i=r4Z;s6i+=B40;s6i+=V50;var r6i=J2Z;r6i+=c8yy[74252];r6i+=b8Z;var h6i=c8yy[404720];h6i+=P8Z;h6i+=c8yy[73441];var n6i=J2Z;n6i+=Y2Z;var T6i=f8X;T6i+=v8Z;T6i+=S18;T6i+=F1Z;c8yy.S15();var z6i=Y9Z;z6i+=A1Z;var L6i=m6Z;L6i+=c8yy[73441];var i6i=c8yy[404720];i6i+=F6Z;if(that[i6i][S9Z][A78](I8X) || that[L6i][z6i][A78](T6i)){return;}that[n6i](that[h6i][d9Z][r6i](),g6Z);that[s6i]();})[l6i](y8X,function(){var A8X="aine";var w6i=R5Z;w6i+=H3Z;w6i+=A8X;w6i+=s1Z;var P6i=c8yy[404720];c8yy.g15();P6i+=F6Z;if(that[P6i][w6i][A78](I8X)){var B6i=W67;B6i+=b8Z;var G6i=U4Z;G6i+=k8X;var R6i=m6Z;R6i+=c8yy[73441];that[d0Z](that[R6i][G6i][B6i](),g6Z);}});this[Y6i][d6i][c8yy.n9w](J8X,b7i,function(){var m8X="s1";var H8X="etUTCFu";var u8X="sitio";var O8X="_writeOut";var i8X="etTime";var L8X="setS";var p8X='-ampm';var o8X="-hou";var c8X="eco";var N8X="setUT";var x8X='-month';var j8X="Tim";var E8X="-m";var a8X="CHou";var W8X='-year';var t8X="-s";var T8X="onds";var M8X="Cl";var S8X='-hours';var K8X="_correctMonth";var q8X="etTi";var j7i=r4Z;j7i+=v8X;j7i+=u8X;j7i+=f8Z;var S7i=o1Z;S7i+=g3Z;S7i+=v8Z;var U7i=U4Z;U7i+=k8X;var K7i=t8X;K7i+=c8X;K7i+=f8Z;K7i+=X8Z;var M7i=E8X;M7i+=U4Z;M7i+=H98;M7i+=g8X;var I7i=C07;I7i+=c8yy[74252];I7i+=w78;I7i+=c8yy[73441];var f7i=n30;f7i+=M8X;f7i+=l20;var X7i=J2Z;X7i+=c8yy[74252];X7i+=b8Z;var select=$(this);var val=select[X7i]();if(select[G9Z](classPrefix + x8X)){var V7i=c8yy[404720];V7i+=U4Z;V7i+=D58;V7i+=F4Z;that[K8X](that[v8Z][V7i],val);that[l97]();that[x97]();}else if(select[G9Z](classPrefix + W8X)){var C7i=v8Z;C7i+=H8X;C7i+=Z8X;C7i+=U8X;that[v8Z][v80][C7i](val);that[l97]();that[x97]();}else if(select[f7i](classPrefix + S8X) || select[G9Z](classPrefix + I7i)){var g7i=r4Z;g7i+=y5Z;g7i+=j8X;g7i+=C8Z;var A7i=Q80;A7i+=r70;A7i+=m8X;A7i+=g5Z;var y7i=H8Z;y7i+=t10;y7i+=c8yy[20443];y7i+=v8Z;if(that[v8Z][y7i][A7i]){var c7i=W67;c7i+=b8Z;var t7i=c8yy[653894];t7i+=c8yy.n9w;t7i+=D70;t7i+=z9Z;var u7i=W67;u7i+=b8Z;var v7i=o8X;v7i+=e8X;var J7i=c8yy.L9w;J7i+=e48;var k7i=m6Z;k7i+=c8yy[73441];var hours=$(that[k7i][S9Z])[J7i](j48 + classPrefix + v7i)[u7i]() * G0w;var pm=$(that[r0Z][t7i])[n08](j48 + classPrefix + p8X)[c7i]() === X27;that[v8Z][c8yy[404720]][D8X](hours === I9w && !pm?R0w:pm && hours !== I9w?hours + I9w:hours);}else {var E7i=N8X;E7i+=a8X;E7i+=e8X;that[v8Z][c8yy[404720]][E7i](val);}that[g7i]();that[r97](H6Z);onChange();}else if(select[G9Z](classPrefix + M7i)){var x7i=r4Z;x7i+=v8Z;x7i+=q8X;x7i+=O88;that[v8Z][c8yy[404720]][Q8X](val);that[x7i]();that[r97](H6Z);onChange();}else if(select[G9Z](classPrefix + K7i)){var Z7i=O8X;Z7i+=F8X;var H7i=R4Z;H7i+=i8X;var W7i=L8X;W7i+=z8X;W7i+=T8X;that[v8Z][c8yy[404720]][W7i](val);that[H7i]();that[Z7i](H6Z);onChange();}that[r0Z][U7i][S7i]();that[j7i]();})[m7i](o7i,function(e){var e1X="hasC";var l1X="_writ";var G1X="etU";var z1X="Hours";var B8X="sClass";var V1X="etUTCMon";var b1X="_se";var X4X="_setCalande";var Z1X="minutesRa";var c1X="urs";var l8X="erCase";var w8X="toLowerCase";var P1X="TCDa";var b4X='day';var n8X="Propagation";var F1X="etUTCHours";var k1X="ctMonth";var d1X="setUTCDate";var Q1X="Rang";var q1X="nds";var R1X="yea";var r1X='setUTCMinutes';var K1X='range';var D1X="ndsR";var T1X="CHours";var s8X="toLow";var i1X="getUTCHours";var x1X="hasClas";var W1X="etTim";var d8X='-iconLeft';var p1X="seco";var a1X="_setTime";var R8X='select';var t1X="etSeco";var v1X="_wr";var B1X="TCFullY";var A1X="_corre";var Y1X="_dateToUtc";var M1X='unit';var m1X="isa";var y1X="onth";var L1X="etUTC";var n1X='setUTCHours';var X1X="ander";var h8X="pare";var G8X="hasCl";var r8X="ntN";var u1X="eOutput";var E1X="inutes";var s1X="rts";var I1X="getUTCM";var J1X='-time';var P8X="nodeName";var a7i=v1Z;a7i+=A1Z;a7i+=v2Z;a7i+=f8Z;var N7i=n87;N7i+=n8X;var D7i=h8X;D7i+=r8X;D7i+=d20;D7i+=C8Z;var p7i=v8Z;p7i+=H8Z;p7i+=c8yy[74252];p7i+=f8Z;var e7i=s8X;e7i+=l8X;var d=that[v8Z][c8yy[404720]];var nodeName=e[j60][P8X][e7i]();var target=nodeName === p7i?e[j60][D7i]:e[j60];nodeName=target[P8X][w8X]();if(nodeName === R8X){return;}e[N7i]();if(nodeName === a7i){var T7i=n30;T7i+=h30;var O7i=G8X;O7i+=c8yy[74252];O7i+=r3Z;var Q7i=h60;Q7i+=f8Z;Q7i+=W5Z;var q7i=P0Z;q7i+=B8X;var button=$(target);var parent=button[a10]();if(parent[q7i](Y8X) && !parent[G9Z](Q7i)){button[l70]();return;}if(parent[O7i](classPrefix + d8X)){var z7i=c8yy.L9w;z7i+=t50;z7i+=w1Z;z7i+=v8Z;var L7i=U4Z;L7i+=B97;L7i+=w1Z;L7i+=c8yy[20443];var i7i=b1X;i7i+=Q47;i7i+=Y2Z;i7i+=X1X;var F7i=D4Z;F7i+=V1X;F7i+=c6Z;that[v8Z][v80][C1X](that[v8Z][v80][F7i]() - G0w);that[l97]();that[i7i]();that[r0Z][L7i][z7i]();}else if(parent[T7i](classPrefix + f1X)){var l7i=c8yy.L9w;l7i+=P8Z;l7i+=f00;var s7i=Y9Z;s7i+=w1Z;s7i+=c8yy[20443];var r7i=I1X;r7i+=y1X;var h7i=c8yy[404720];h7i+=L0Z;h7i+=x40;var n7i=A1X;n7i+=k1X;that[n7i](that[v8Z][h7i],that[v8Z][v80][r7i]() + G0w);that[l97]();that[x97]();that[r0Z][s7i][l7i]();}else if(button[j9Z](j48 + classPrefix + J1X)[M6Z]){var J0i=v1X;J0i+=U4Z;J0i+=c8yy[20443];J0i+=u1X;var k0i=v8Z;k0i+=t1X;k0i+=f8Z;k0i+=X8Z;var A0i=Q80;A0i+=c1X;var R7i=c8yy[73441];R7i+=E1X;var w7i=c8yy[404720];w7i+=c8yy[74252];w7i+=c8yy[20443];w7i+=c8yy[74252];var P7i=B78;P7i+=D70;var val=button[P7i](g1X);var unit=button[w7i](M1X);if(unit === R7i){var G7i=x1X;G7i+=v8Z;if(parent[G7i](Y8X) && parent[G9Z](K1X)){var B7i=R4Z;B7i+=W1X;B7i+=C8Z;that[v8Z][H1X]=val;that[B7i]();return;}else {var Y7i=Z1X;Y7i+=U1X;that[v8Z][Y7i]=O0Z;}}if(unit === S1X){var X0i=j1X;X0i+=W5Z;var b0i=c8yy[404720];b0i+=m1X;b0i+=o1X;var d7i=e1X;d7i+=O9Z;if(parent[d7i](b0i) && parent[G9Z](X0i)){var V0i=p1X;V0i+=D1X;V0i+=N1X;that[v8Z][V0i]=val;that[a1X]();return;}else {var C0i=p1X;C0i+=q1X;C0i+=Q1X;C0i+=C8Z;that[v8Z][C0i]=O0Z;}}if(val === O1X){var f0i=D4Z;f0i+=F1X;if(d[f0i]() >= I9w){val=d[i1X]() - I9w;}else {return;}}else if(val === X27){var I0i=D4Z;I0i+=L1X;I0i+=z1X;if(d[I0i]() < I9w){var y0i=k90;y0i+=J4Z;y0i+=t8Z;y0i+=T1X;val=d[y0i]() + I9w;}else {return;}}var set=unit === A0i?n1X:unit === h1X?r1X:k0i;d[set](val);that[a1X]();that[J0i](H6Z);onChange();}else {var W0i=c8yy[20443];W0i+=U4Z;W0i+=c8yy[73441];W0i+=C8Z;var K0i=F48;K0i+=s1X;var x0i=l1X;x0i+=u1X;var M0i=c8yy[404720];M0i+=c8yy[74252];M0i+=c8yy[20443];M0i+=c8yy[74252];var g0i=Z97;g0i+=P1X;g0i+=Z4Z;var E0i=D1Z;E0i+=f8Z;E0i+=c8yy[20443];E0i+=C6Z;var c0i=d2Z;c0i+=w1X;c0i+=c6Z;var t0i=R1X;t0i+=s1Z;var u0i=c8yy[404720];u0i+=x47;var v0i=v8Z;v0i+=G1X;v0i+=B1X;v0i+=U8X;if(!d){d=that[Y1X](new Date());}d[d1X](G0w);d[v0i](button[u0i](t0i));d[c0i](button[k0Z](E0i));d[g0i](button[M0i](b4X));that[x0i](H6Z);if(!that[v8Z][K0i][W0i]){setTimeout(function(){c8yy.g15();that[d40]();},C9w);}else {var H0i=X4X;H0i+=s1Z;that[H0i]();}onChange();}}else {that[r0Z][d9Z][b9Z]();}});},_compareDates:function(a,b){var V4X="dateToUtcString";var C4X="teToUtcString";var U0i=r4Z;U0i+=V4X;var Z0i=r4Z;Z0i+=c8yy[404720];Z0i+=c8yy[74252];Z0i+=C4X;return this[Z0i](a) === this[U0i](b);},_correctMonth:function(date,month){var f4X="getUTC";var A4X="CDate";var S0i=f4X;S0i+=M97;S0i+=Z4Z;var days=this[I4X](date[y4X](),month);var correctDays=date[S0i]() > days;date[C1X](month);if(correctDays){var m0i=d2Z;m0i+=w1X;m0i+=c6Z;var j0i=y5Z;j0i+=J4Z;j0i+=t8Z;j0i+=A4X;date[j0i](days);date[m0i](month);}},_daysInMonth:function(year,month){var g9w=28;var M9w=29;var K9w=31;var x9w=30;var isLeap=year % d0w === R0w && (year % m9w !== R0w || year % e9w === R0w);var months=[K9w,isLeap?M9w:g9w,K9w,x9w,K9w,x9w,K9w,K9w,x9w,K9w,x9w,K9w];return months[month];},_dateToUtc:function(s){c8yy.S15();var t4X="getMinutes";var u4X="getHours";var k4X="Month";var o0i=k90;o0i+=k4X;return new Date(Date[h97](s[J4X](),s[o0i](),s[v4X](),s[u4X](),s[t4X](),s[c4X]()));},_dateToUtcString:function(d){var M4X="getUTCDate";var e0i=r4Z;e0i+=H8Z;e0i+=F9Z;return d[y4X]() + e38 + this[E4X](d[g4X]() + G0w) + e38 + this[e0i](d[M4X]());},_hide:function(){var U4X="own.";var j4X='click.';var Z4X="rollBod";var W4X="l.";var H4X="div.dataTables_sc";var Q0i=x4X;Q0i+=K4X;Q0i+=e88;var q0i=U87;q0i+=C40;q0i+=W4X;var a0i=H4X;a0i+=Z4X;a0i+=b4Z;c8yy.g15();var N0i=e98;N0i+=b4Z;N0i+=c8yy[404720];N0i+=U4X;var D0i=P8Z;D0i+=c8yy.L9w;D0i+=c8yy.L9w;var p0i=P8Z;p0i+=c8yy.L9w;p0i+=c8yy.L9w;var namespace=this[v8Z][W28];this[r0Z][S9Z][g80]();$(window)[p0i](j48 + namespace);$(document)[D0i](N0i + namespace);$(a0i)[F20](q0i + namespace);$(S4X)[F20](Q0i + namespace);$(o30)[F20](j4X + namespace);},_hours24To12:function(val){c8yy.S15();return val === R0w?I9w:val > I9w?val - I9w:val;},_htmlDay:function(day){var o4X="<s";var i4X='selectable';var p4X="a-ye";var m4X="d>";var P4X='" data-day="';var Q4X="<td class=\"";var w4X="day";var D4X="r=\"";var N4X="<button class=";var T4X='<td data-day="';var L4X="selected";var F4X="y\"></td>";var z4X="ush";var n4X='" class="';var a4X="tod";var r4X='-day" type="button" ';var l4X='" data-month="';var q4X="assPrefix";var B0i=h6Z;B0i+=A68;B0i+=c8yy[20443];B0i+=m4X;var G0i=o4X;G0i+=F48;G0i+=e4X;var R0i=Y6Z;R0i+=R6Z;var w0i=c8yy[404720];w0i+=c8yy[74252];w0i+=b4Z;var P0i=c8yy[73441];P0i+=P8Z;P0i+=H3Z;P0i+=C6Z;var l0i=S68;l0i+=p4X;l0i+=c8yy[74252];l0i+=D4X;var s0i=N4X;s0i+=Y6Z;var r0i=c8yy[404720];r0i+=c8yy[74252];r0i+=b4Z;var z0i=a4X;z0i+=c8yy[74252];z0i+=b4Z;var i0i=U6Z;i0i+=q4X;var O0i=C8Z;O0i+=H27;O0i+=b4Z;if(day[O0i]){var F0i=Q4X;F0i+=O4X;F0i+=F4X;return F0i;}var classes=[i4X];var classPrefix=this[c8yy[653894]][i0i];if(day[Y0Z]){var L0i=A18;L0i+=v1Z;L0i+=e10;L0i+=c8yy[404720];classes[f6Z](L0i);}if(day[z0i]){var n0i=t80;n0i+=m4Z;var T0i=P47;T0i+=v8Z;T0i+=C6Z;classes[T0i](n0i);}if(day[L4X]){var h0i=H8Z;h0i+=z4X;classes[h0i](O77);}return T4X + day[r0i] + n4X + classes[o38](g0Z) + W0Z + s0i + classPrefix + h4X + classPrefix + r4X + l0i + day[s4X] + l4X + day[P0i] + P4X + day[w0i] + R0i + G0i + day[w4X] + e0Z + R4X + B0i;},_htmlMonth:function(year,month){var u3X="setUTCMin";var c3X="getUTCD";var f3X="nDa";var t3X="htmlD";var M3X="_compareDates";var J3X="tDay";var W3X="showWeekNumber";c8yy.g15();var B4X="tbo";var U3X="unshi";var o3X="mber";var C3X="axD";var I3X="UT";var g3X="Dates";var Z3X="fYear";var u9w=23;var p3X="iconLe";var E3X="compare";var y3X="CDa";var H3X="_htmlWeekO";var V3X="thead";var v3X="setSeconds";var G4X="</table";var k3X="firs";var D3X='<table class="';var m3X="ekNu";var Y4X="dy>";var b3X="htmlMont";var x3X="disableDays";var X3X="hHead";var e3X="lock";var N3X='</thead>';var N9i=G4X;N9i+=R6Z;var D9i=J7Z;D9i+=B4X;D9i+=Y4X;var p9i=r7Z;p9i+=S38;var e9i=d4X;e9i+=t90;e9i+=I30;e9i+=R6Z;var o9i=r4Z;o9i+=b3X;o9i+=X3X;var m9i=h6Z;m9i+=V3X;m9i+=R6Z;var C9i=c8yy[73441];C9i+=C3X;C9i+=c8yy[74252];C9i+=Z4Z;var V9i=O90;V9i+=f3X;V9i+=c8yy[20443];V9i+=C8Z;var b9i=k90;b9i+=I3X;b9i+=y3X;b9i+=b4Z;var d0i=J4Z;d0i+=t8Z;d0i+=i9Z;var Y0i=r4Z;Y0i+=s97;Y0i+=c8yy[20443];Y0i+=c8yy[653894];var now=this[Y0i](new Date()),days=this[I4X](year,month),before=new Date(Date[d0i](year,month,G0w))[b9i](),data=[],row=[];if(this[c8yy[653894]][A3X] > R0w){var X9i=k3X;X9i+=J3X;before-=this[c8yy[653894]][X9i];if(before < R0w){before+=X9w;}}var cells=days + before,after=cells;while(after > X9w){after-=X9w;}cells+=X9w - after;var minDate=this[c8yy[653894]][V9i];var maxDate=this[c8yy[653894]][C9i];if(minDate){minDate[D8X](R0w);minDate[Q8X](R0w);minDate[v3X](R0w);}if(maxDate){var f9i=u3X;f9i+=w1Z;f9i+=g8X;maxDate[D8X](u9w);maxDate[f9i](U9w);maxDate[v3X](U9w);}for(var i=R0w,r=R0w;i < cells;i++){var k9i=r4Z;k9i+=t3X;k9i+=c8yy[74252];k9i+=b4Z;var A9i=H8Z;A9i+=w1Z;A9i+=v8Z;A9i+=C6Z;var y9i=c3X;y9i+=F4Z;var I9i=r4Z;I9i+=E3X;I9i+=g3X;var day=new Date(Date[h97](year,month,G0w + (i - before))),selected=this[v8Z][c8yy[404720]]?this[M3X](day,this[v8Z][c8yy[404720]]):g6Z,today=this[I9i](day,now),empty=i < before || i >= days + before,disabled=minDate && day < minDate || maxDate && day > maxDate;var disableDays=this[c8yy[653894]][x3X];if(Array[y10](disableDays) && $[Y90](day[y9i](),disableDays) !== -G0w){disabled=H6Z;}else if(typeof disableDays === f9Z && disableDays(day) === H6Z){disabled=H6Z;}var dayConfig={day:G0w + (i - before),month:month,year:year,selected:selected,today:today,disabled:disabled,empty:empty};row[A9i](this[k9i](dayConfig));if(++r === X9w){var t9i=J7Z;t9i+=K3X;var u9i=P47;u9i+=v8Z;u9i+=C6Z;if(this[c8yy[653894]][W3X]){var v9i=H3X;v9i+=Z3X;var J9i=U3X;J9i+=c8yy.L9w;J9i+=c8yy[20443];row[J9i](this[v9i](i - before,month,year));}data[u9i](S3X + row[o38](h5Z) + t9i);row=[];r=R0w;}}var classPrefix=this[c8yy[653894]][i07];var className=classPrefix + j3X;if(this[c8yy[653894]][W3X]){var c9i=d47;c9i+=x98;c9i+=m3X;c9i+=o3X;className+=c9i;}if(minDate){var W9i=v1Z;W9i+=e3X;var K9i=c8yy[404720];K9i+=A78;K9i+=G50;K9i+=F4Z;var x9i=C07;x9i+=p3X;x9i+=c8yy.L9w;x9i+=c8yy[20443];var M9i=J10;M9i+=J2Z;M9i+=e88;var g9i=c8yy.L9w;g9i+=U4Z;g9i+=f8Z;g9i+=c8yy[404720];var E9i=I3X;E9i+=i9Z;var underMin=minDate >= new Date(Date[E9i](year,month,G0w,R0w,R0w,R0w));this[r0Z][w98][g9i](M9i + classPrefix + x9i)[z0Z](K9i,underMin?Z10:W9i);}if(maxDate){var j9i=s10;j9i+=c8yy[653894];j9i+=j6Z;var S9i=c8yy[653894];S9i+=v8Z;S9i+=v8Z;var U9i=c8yy[404720];U9i+=w6Z;U9i+=e88;var Z9i=m6Z;Z9i+=c8yy[73441];var H9i=J4Z;H9i+=t8Z;H9i+=i9Z;var overMax=maxDate < new Date(Date[H9i](year,month + G0w,G0w,R0w,R0w,R0w));this[Z9i][w98][n08](U9i + classPrefix + f1X)[S9i](m9Z,overMax?Z10:j9i);}return D3X + className + W0Z + m9i + this[o9i]() + N3X + e9i + data[p9i](h5Z) + D9i + N9i;},_htmlMonthHead:function(){var F3X="</t";var Q3X="pus";var a3X="WeekNumber";var O3X='<th></th>';var i3X="h>";var a9i=l38;a9i+=a3X;var a=[];var firstDay=this[c8yy[653894]][A3X];var i18n=this[c8yy[653894]][Y7Z];var dayName=function(day){var q3X="weekdays";day+=firstDay;while(day >= X9w){day-=X9w;}return i18n[q3X][day];};if(this[c8yy[653894]][a9i]){var q9i=Q3X;q9i+=C6Z;a[q9i](O3X);}for(var i=R0w;i < X9w;i++){var O9i=F3X;O9i+=C6Z;O9i+=R6Z;var Q9i=d4X;Q9i+=i3X;a[f6Z](Q9i + dayName(i) + O9i);}return a[o38](h5Z);},_htmlWeekOfYear:function(d,m,y){var P3X="ceil";var l3X="getDay";var n3X="classPr";var L3X="/td";var r3X="td clas";var F9w=86400000;var z3X="eek";var s3X="etD";var T9i=h6Z;T9i+=L3X;T9i+=R6Z;var z9i=C07;z9i+=m4Z;z9i+=z3X;z9i+=T3X;var L9i=n3X;L9i+=C8Z;L9i+=h3X;var i9i=h6Z;i9i+=r3X;i9i+=v8Z;i9i+=F08;var F9i=v8Z;F9i+=s3X;F9i+=c8yy[74252];F9i+=Z4Z;var date=new Date(y,m,d,R0w,R0w,R0w,R0w);date[F9i](date[v4X]() + d0w - (date[l3X]() || X9w));var oneJan=new Date(y,R0w,G0w);var weekNum=Math[P3X](((date - oneJan) / F9w + G0w) / X9w);return i9i + this[c8yy[653894]][L9i] + z9i + weekNum + T9i;},_options:function(selector,values,labels){var G3X="<opti";var Y3X="alue=\"";var B3X="n v";var w3X='select.';var R3X="tion>";var h9i=c8yy.L9w;h9i+=U4Z;h9i+=f8Z;h9i+=c8yy[404720];var n9i=c8yy[404720];n9i+=P8Z;n9i+=c8yy[73441];if(!labels){labels=values;}var select=this[n9i][S9Z][h9i](w3X + this[c8yy[653894]][i07] + e38 + selector);select[k97]();for(var i=R0w,ien=values[M6Z];i < ien;i++){var s9i=J7Z;s9i+=P8Z;s9i+=H8Z;s9i+=R3X;var r9i=G3X;r9i+=P8Z;r9i+=B3X;r9i+=Y3X;select[x80](r9i + values[i] + W0Z + labels[i] + s9i);}},_optionSet:function(selector,val){var f2X='option:selected';var V2X="ct.";var C2X='span';var b2X="sPref";var X2X="ix";var I2X="unknown";var w9i=j10;w9i+=f8Z;w9i+=c8yy[404720];var P9i=d3X;P9i+=b2X;P9i+=X2X;var l9i=B67;l9i+=V2X;var select=this[r0Z][S9Z][n08](l9i + this[c8yy[653894]][P9i] + e38 + selector);var span=select[a10]()[P40](C2X);select[d0Z](val);var selected=select[w9i](f2X);span[L10](selected[M6Z] !== R0w?selected[v40]():this[c8yy[653894]][Y7Z][I2X]);},_optionsTime:function(unit,count,val,allowed,range){var K2X="</tr";var H2X='</tr>';var b9w=6;var y2X="/table>";var S2X="-nospace\"";var A2X="able c";var k2X="assPr";var D2X='<thead><tr><th colspan="';var Z2X="amPm";var a2X='<tbody>';var m2X="body>";var U2X="/t";var e2X="ss=\"";var q2X='</tbody>';var o2X="/tbody></thead><table cla";var N2X='</th></tr></thead>';var W2X="mP";var j2X="><t";var p2X="floor";var K8w=h6Z;K8w+=y2X;var x8w=Y6Z;x8w+=R6Z;var M8w=d4X;M8w+=A2X;M8w+=k7Z;var d9i=U4Z;d9i+=F77;d9i+=f8Z;var Y9i=U6Z;Y9i+=k2X;Y9i+=C8Z;Y9i+=h3X;var B9i=r4Z;B9i+=H8Z;B9i+=c8yy[74252];B9i+=c8yy[404720];var G9i=c8yy.L9w;G9i+=U4Z;c8yy.S15();G9i+=f8Z;G9i+=c8yy[404720];var R9i=c8yy[404720];R9i+=P8Z;R9i+=c8yy[73441];var classPrefix=this[c8yy[653894]][i07];var container=this[R9i][S9Z][G9i](v08 + classPrefix + e38 + unit);var i,j;var render=count === I9w?function(i){return i;}:this[B9i];var classPrefix=this[c8yy[653894]][Y9i];var className=classPrefix + j3X;var i18n=this[c8yy[653894]][d9i];if(!container[M6Z]){return;}var a=h5Z;var span=C9w;var button=function(value,label,className){var M2X='" data-value="';var t2X="inArr";var x2X='</td>';var g2X='<td class="selectable ';var u2X="<but";var J2X="-day\"";var v2X=" type=\"button\" data-unit=\"";var c2X=" dis";var A8w=W07;A8w+=e4X;var y8w=J2X;y8w+=v2X;var I8w=u2X;I8w+=s38;I8w+=E07;I8w+=Y6Z;var f8w=Y6Z;f8w+=R6Z;var V8w=t2X;V8w+=F4Z;var X8w=d2Z;X8w+=b8Z;X8w+=M57;X8w+=F1Z;var b8w=c8yy[74252];b8w+=c8yy[73441];if(count === I9w && typeof value === v88){if(val >= I9w){value+=I9w;}if(value == I9w){value=R0w;}else if(value == t9w){value=I9w;}}var selected=val === value || value === b8w && val < I9w || value === X27 && val >= I9w?X8w:h5Z;if(allowed && $[V8w](value,allowed) === -G0w){var C8w=c2X;C8w+=E2X;selected+=C8w;}if(className){selected+=g0Z + className;}return g2X + selected + f8w + I8w + classPrefix + h4X + classPrefix + y8w + unit + M2X + value + W0Z + A8w + label + e0Z + R4X + x2X;};if(count === I9w){var v8w=K2X;v8w+=R6Z;var J8w=H8Z;J8w+=c8yy[73441];var k8w=c8yy[74252];k8w+=W2X;k8w+=c8yy[73441];a+=S3X;for(i=G0w;i <= b9w;i++){a+=button(i,render(i));}a+=button(O1X,i18n[k8w][R0w]);a+=H2X;a+=S3X;for(i=X9w;i <= I9w;i++){a+=button(i,render(i));}a+=button(J8w,i18n[Z2X][G0w]);a+=v8w;span=X9w;}else if(count === t9w){var c=R0w;for(j=R0w;j < d0w;j++){var u8w=h6Z;u8w+=U2X;u8w+=s1Z;u8w+=R6Z;a+=S3X;for(i=R0w;i < b9w;i++){a+=button(c,render(c));c++;}a+=u8w;}span=b9w;}else {var g8w=h6Z;g8w+=K3X;var E8w=S2X;E8w+=j2X;E8w+=m2X;var c8w=h6Z;c8w+=o2X;c8w+=e2X;a+=S3X;for(j=R0w;j < S9w;j+=C9w){var t8w=j1X;t8w+=D4Z;t8w+=C8Z;a+=button(j,render(j),t8w);}a+=H2X;a+=c8w + className + g0Z + className + E8w;var start=range !== O0Z?range:Math[p2X](val / C9w) * C9w;a+=g8w;for(j=start + G0w;j < start + C9w;j++){a+=button(j,render(j));}a+=H2X;span=b9w;}container[k97]()[x80](M8w + className + x8w + D2X + span + W0Z + i18n[unit] + N2X + a2X + a + q2X + K8w);},_optionsTitle:function(){var i2X="getFullYea";var L2X="Range";var s2X="_options";c8yy.g15();var h2X="minDate";var n2X="max";var Q2X="_ra";var F2X="onths";var z2X="etFu";var l2X="_range";var T2X="Year";var r2X="yearRange";var O2X="ye";var o8w=Q2X;o8w+=f8Z;o8w+=W5Z;var m8w=O2X;m8w+=t10;var j8w=c8yy[73441];j8w+=F2X;var S8w=D1Z;S8w+=H3Z;S8w+=C6Z;var U8w=i2X;U8w+=s1Z;var Z8w=s4X;Z8w+=L2X;var H8w=D4Z;H8w+=z2X;H8w+=w90;H8w+=T2X;var W8w=n2X;W8w+=u8Z;var i18n=this[c8yy[653894]][Y7Z];var min=this[c8yy[653894]][h2X];var max=this[c8yy[653894]][W8w];var minYear=min?min[J4X]():O0Z;var maxYear=max?max[H8w]():O0Z;var i=minYear !== O0Z?minYear:new Date()[J4X]() - this[c8yy[653894]][Z8w];var j=maxYear !== O0Z?maxYear:new Date()[U8w]() + this[c8yy[653894]][r2X];this[s2X](S8w,this[l2X](R0w,f9w),i18n[j8w]);this[s2X](m8w,this[o8w](i,j));},_pad:function(i){c8yy.g15();var P2X='0';return i < C9w?P2X + i:i;},_position:function(){var b5X="orizont";var G2X="Top";var w2X="wi";var X5X="outerWidth";var B2X="part";var R2X="ef";var d2X="rizontal";var Y2X="ffset";var w8w=w2X;w8w+=b90;var P8w=b8Z;P8w+=R2X;P8w+=c8yy[20443];var h8w=C6Z;h8w+=c20;h8w+=E20;var n8w=c8yy[20443];n8w+=P8Z;n8w+=H8Z;var T8w=J30;T8w+=w90;T8w+=G2X;var z8w=b8Z;z8w+=C8Z;z8w+=c8yy.L9w;z8w+=c8yy[20443];var L8w=c8yy[653894];L8w+=v8Z;c8yy.g15();L8w+=v8Z;var O8w=w2X;O8w+=b90;var Q8w=B2X;Q8w+=v8Z;var q8w=m6Z;q8w+=c8yy[73441];var a8w=K97;a8w+=x9Z;var N8w=m6Z;N8w+=c8yy[73441];var D8w=P8Z;D8w+=Y2X;var p8w=Y9Z;p8w+=A1Z;var e8w=c8yy[404720];e8w+=P8Z;e8w+=c8yy[73441];var offset=this[e8w][p8w][D8w]();var container=this[N8w][a8w];var inputHeight=this[q8w][d9Z][f20]();if(this[v8Z][Q8w][f97] && this[v8Z][d97][I97] && $(window)[O8w]() > D9w){var F8w=Q80;F8w+=d2X;container[K9Z](F8w);}else {var i8w=C6Z;i8w+=b5X;i8w+=Y2Z;container[n9Z](i8w);}container[L8w]({top:offset[u60] + inputHeight,left:offset[z8w]})[L00](o30);var calHeight=container[f20]();var calWidth=container[X5X]();var scrollTop=$(window)[T8w]();if(offset[n8w] + inputHeight + calHeight - scrollTop > $(window)[h8w]()){var l8w=v2Z;l8w+=H8Z;var s8w=c8yy[653894];s8w+=v8Z;s8w+=v8Z;var r8w=c8yy[20443];r8w+=P8Z;r8w+=H8Z;var newTop=offset[r8w] - calHeight;container[s8w](l8w,newTop < R0w?R0w:newTop);}if(calWidth + offset[P8w] > $(window)[w8w]()){var newLeft=$(window)[v60]() - calWidth;container[z0Z](M90,newLeft < R0w?R0w:newLeft);}},_range:function(start,end,inc){var a=[];if(!inc){inc=G0w;}for(var i=start;i <= end;i+=inc){var R8w=H8Z;R8w+=w1Z;R8w+=B40;a[R8w](i);}return a;},_setCalander:function(){c8yy.g15();var V5X="_htmlMonth";if(this[v8Z][v80]){var b1w=J10;b1w+=y78;b1w+=b4Z;var d8w=F2Z;d8w+=x40;var Y8w=I9Z;Y8w+=h1Z;Y8w+=c8yy[404720];var B8w=C8Z;B8w+=w78;B8w+=c8yy[20443];B8w+=b4Z;var G8w=c8yy[404720];G8w+=P8Z;G8w+=c8yy[73441];this[G8w][y97][B8w]()[Y8w](this[V5X](this[v8Z][d8w][y4X](),this[v8Z][b1w][g4X]()));}},_setTitle:function(){var y5X="_optionSet";var f5X="opti";var C5X="getUTCF";var I5X="onSet";var y1w=C5X;y1w+=w1Z;y1w+=Z8X;y1w+=U8X;var I1w=c8yy[404720];I1w+=B2Z;I1w+=F4Z;var f1w=b4Z;c8yy.S15();f1w+=C8Z;f1w+=c8yy[74252];f1w+=s1Z;var C1w=J10;C1w+=v8Z;C1w+=G50;C1w+=F4Z;var V1w=D1Z;V1w+=H3Z;V1w+=C6Z;var X1w=r4Z;X1w+=f5X;X1w+=I5X;this[X1w](V1w,this[v8Z][C1w][g4X]());this[y5X](f1w,this[v8Z][I1w][y1w]());},_setTime:function(){var M5X="ilab";var E5X="Ti";var g5X="hoursAva";var K5X="12";var k5X="dsR";var A5X="secon";var j5X="_optionsTime";var c5X="TCMinutes";var x5X="hours";var t5X="getU";var J5X="_o";var W5X="UTCHours";var v5X="ptionsTime";var K1w=A5X;K1w+=k5X;K1w+=G60;K1w+=W5Z;var x1w=J5X;x1w+=v5X;var M1w=u5X;M1w+=w1Z;M1w+=g8X;var g1w=t5X;g1w+=c5X;var E1w=r4Z;E1w+=L87;E1w+=E5X;E1w+=O88;var c1w=g5X;c1w+=M5X;c1w+=e10;var t1w=x5X;t1w+=K5X;var u1w=Q80;u1w+=w1Z;u1w+=e8X;var A1w=k90;A1w+=W5X;var that=this;var d=this[v8Z][c8yy[404720]];var hours=d?d[A1w]():R0w;var allowed=function(prop){var S5X='Available';var Z5X="Av";var U5X="ailable";var H5X="creme";c8yy.g15();var v1w=g7Z;v1w+=H5X;v1w+=H3Z;var J1w=r4Z;J1w+=s1Z;J1w+=c8yy[74252];J1w+=U1X;var k1w=Z5X;k1w+=U5X;return that[c8yy[653894]][prop + k1w]?that[c8yy[653894]][prop + S5X]:that[J1w](R0w,U9w,that[c8yy[653894]][prop + v1w]);};this[j5X](u1w,this[v8Z][d97][t1w]?I9w:t9w,hours,this[c8yy[653894]][c1w]);this[E1w](h1X,S9w,d?d[g1w]():R0w,allowed(M1w),this[v8Z][H1X]);this[x1w](S1X,S9w,d?d[c4X]():R0w,allowed(S1X),this[v8Z][K1w]);},_show:function(){var e5X="div.data";var O5X='scroll.';var i5X='keydown.';var o5X="space";var q5X="oll.";var N5X=" res";var F5X="ide";var m5X="osition";var p5X="Tabl";var a5X="ze";var D5X="es_scrollBody";var D1w=P8Z;D1w+=f8Z;var H1w=I3Z;H1w+=m5X;var W1w=J0Z;W1w+=o5X;c8yy.S15();var that=this;var namespace=this[v8Z][W1w];this[H1w]();if($(window)[v60]() > a9w){var e1w=x4X;e1w+=K4X;e1w+=e88;var o1w=e5X;o1w+=p5X;o1w+=D5X;var m1w=P8Z;m1w+=f8Z;var S1w=N5X;S1w+=U4Z;S1w+=a5X;S1w+=e88;var U1w=x4X;U1w+=q5X;var Z1w=P8Z;Z1w+=f8Z;$(window)[Z1w](U1w + namespace + S1w + namespace,function(){var Q5X="_positio";c8yy.S15();var j1w=Q5X;j1w+=f8Z;that[j1w]();});$(S4X)[m1w](O5X + namespace,function(){that[d40]();});$(o1w)[c8yy.n9w](e1w + namespace,function(){var p1w=r4Z;p1w+=C6Z;p1w+=F5X;c8yy.S15();that[p1w]();});}$(document)[D1w](i5X + namespace,function(e){var L5X="yCo";var T5X="Cod";var V9w=9;var a1w=e98;a1w+=L5X;a1w+=r2Z;var N1w=z5X;N1w+=T5X;N1w+=C8Z;if(e[N1w] === V9w || e[a1w] === E9w || e[h90] === y9w){var q1w=r4Z;q1w+=C6Z;q1w+=F5X;that[q1w]();}});setTimeout(function(){var F1w=c8yy[653894];c8yy.S15();F1w+=y00;F1w+=j6Z;F1w+=e88;var O1w=P8Z;O1w+=f8Z;var Q1w=v1Z;Q1w+=P8Z;Q1w+=c8yy[404720];Q1w+=b4Z;$(Q1w)[O1w](F1w + namespace,function(e){var n5X="targ";var h1w=U4Z;h1w+=f8Z;h1w+=P47;h1w+=c8yy[20443];var n1w=c8yy[404720];n1w+=F6Z;var T1w=n5X;T1w+=U2Z;var z1w=b68;z1w+=c8yy[74252];z1w+=z9Z;var L1w=F48;L1w+=s1Z;L1w+=l2Z;L1w+=v8Z;var i1w=D70;i1w+=s1Z;i1w+=D4Z;i1w+=U2Z;var parents=$(e[i1w])[L1w]();if(!parents[R57](that[r0Z][z1w])[M6Z] && e[T1w] !== that[n1w][h1w][R0w]){var r1w=r4Z;r1w+=C6Z;r1w+=e2Z;r1w+=C8Z;that[r1w]();}});},C9w);},_writeOutput:function(focus){var P5X="mentLocale";var s5X="tUTC";var l5X="omentStric";var r5X="gge";var h5X="tri";var B1w=Q1Z;B1w+=G60;B1w+=W5Z;var G1w=h5X;G1w+=r5X;G1w+=s1Z;c8yy.g15();var R1w=c8yy[404720];R1w+=P8Z;R1w+=c8yy[73441];var w1w=W5Z;w1w+=s5X;w1w+=u8Z;var P1w=c8yy[73441];P1w+=l5X;P1w+=c8yy[20443];var l1w=c8yy[73441];l1w+=P8Z;l1w+=P5X;var s1w=w1Z;s1w+=c8yy[20443];s1w+=c8yy[653894];var date=this[v8Z][c8yy[404720]];var out=window[N97]?window[N97][s1w](date,undefined,this[c8yy[653894]][l1w],this[c8yy[653894]][P1w])[L07](this[c8yy[653894]][L07]):date[y4X]() + e38 + this[E4X](date[g4X]() + G0w) + e38 + this[E4X](date[w1w]());this[R1w][d9Z][d0Z](out)[G1w](B1w,{write:date});if(focus){var Y1w=o1Z;Y1w+=c8yy[653894];Y1w+=w1Z;Y1w+=v8Z;this[r0Z][d9Z][Y1w]();}}});Editor[d1w][b4w]=R0w;Editor[X4w][V4w]={classPrefix:w5X,disableDays:O0Z,firstDay:G0w,format:z07,hoursAvailable:O0Z,i18n:Editor[C4w][Y7Z][f4w],maxDate:O0Z,minDate:O0Z,minutesAvailable:O0Z,minutesIncrement:G0w,momentStrict:H6Z,momentLocale:I4w,onChange:function(){},secondsAvailable:O0Z,secondsIncrement:G0w,showWeekNumber:g6Z,yearRange:c9w};(function(){var g0X="checkbox";var k0X="separator";var j0X='_';var d7X="sel";var f8s="_closeFn";var e7X="textarea";var Q6X="_enabled";var w8s="uploadMany";var n7X="_editor_val";var C0X="ipl";var o9X="cker";var a7X="select";var y0X="_in";var R5X="loa";var U7X='<input/>';var N8s=" file";var n9X="datepicker";var B5X="hid";var z9X="icker";var g7X="_inp";var H9X='<input />';var A8s="momentStrict";var h0X="checked";var D0X="last";var E7X="fieldType";var S7X='text';var X0X="_addOptions";var q7X="placeholder";var M0X="optionsPair";var T0X='input';var m0X='<label for="';var S0X='<div>';var D8s="No";var A6X="ttr";var b0X="_lastSet";var m7X="password";var q8s="noFileText";var G5X="tetim";var w0X="radio";var V8s="_picker";var K7X="_val";var V6X="_input";var x7X="prop";var H7X="readonly";var W7X="_v";var Y7w=C8Z;Y7w+=L6Z;var B7w=w1Z;B7w+=M58;B7w+=G1Z;B7w+=V57;var S7w=U8Z;S7w+=C8Z;S7w+=a40;var U7w=F88;U7w+=R5X;U7w+=c8yy[404720];var L6w=c8yy[404720];L6w+=c8yy[74252];L6w+=G5X;L6w+=C8Z;var I6w=c8yy[404720];I6w+=c8yy[74252];I6w+=c8yy[20443];I6w+=C8Z;var c5w=V8Z;c5w+=c8yy[20443];c5w+=C8Z;c5w+=a40;var s3w=U8Z;s3w+=S8Z;var L3w=V8Z;L3w+=c8yy[20443];L3w+=h1Z;L3w+=c8yy[404720];var q3w=V8Z;q3w+=c8yy[20443];q3w+=h1Z;q3w+=c8yy[404720];var a3w=c8yy[20443];a3w+=V8Z;a3w+=c8yy[20443];var e3w=V8Z;e3w+=c8yy[20443];e3w+=h1Z;e3w+=c8yy[404720];var j3w=B5X;j3w+=c8yy[404720];j3w+=h1Z;var K3w=D1Z;K3w+=V5Z;K3w+=v8Z;var x3w=V8Z;x3w+=q1Z;var fieldTypes=Editor[f0Z];function _buttonText(conf,text){c8yy.g15();var b6X="plo";var C6X='div.upload button';var X6X="adText";var Y5X="Choose ";var d5X="...";var k4w=c8yy.L9w;k4w+=U4Z;k4w+=f8Z;k4w+=c8yy[404720];if(text === O0Z || text === undefined){var A4w=Y5X;A4w+=D2Z;A4w+=d5X;var y4w=w1Z;y4w+=b6X;y4w+=X6X;text=conf[y4w] || A4w;}conf[V6X][k4w](C6X)[L10](text);}function _commonUpload(editor,conf,dropCallback,multiple){var F6X="t[type=f";var E6X="arValue\">";var x6X=" up";var q6X='<div class="drop"><span></span></div>';var I6X="ile]";var H6X="ow\">";var t6X="v class=\"cell";var m6X='<div class="eu_table">';var Z6X="<div cla";var o6X='<button class="';var k7X="div.render";var i6X='id';var M6X="<div class=\"cell";var D6X='></input>';var y6X="FileR";var L6X='input[type=file]';var h6X="rop a file h";var U6X="s=";var s6X="agDr";var v6X="=\"cell";var J6X="<div class";var S6X="\"editor_upload\">";var r6X="ere to upload";var K6X="load limitHide\">";var J7X="appen";var Y6X='dragleave dragexit';var g6X="ple";var u6X="/button>";var p6X='<input type="file" ';var z6X="dragDrop";var a6X='<div class="cell limitHide">';var j6X="buttonInternal";var w6X='div.drop';var k6X="<div class=\"rendered\"></";var X7X='dragover';var l6X="opText";var O6X="safeI";var v7X='div.clearValue button';var e6X='"></button>';var P6X='div.drop span';var f6X="input[type=f";var W6X="lass=\"r";var N6X='<div class="row second">';var c6X=" cle";var n6X="Drag and d";var T6X="dro";var t3w=W7Z;t3w+=P47;t3w+=c8yy[20443];var u3w=P8Z;u3w+=f8Z;var v3w=f6X;v3w+=I6X;var f3w=c8yy[653894];f3w+=b8Z;f3w+=U4Z;f3w+=i10;var C3w=j10;C3w+=f8Z;C3w+=c8yy[404720];var D4w=y6X;D4w+=C8Z;D4w+=c8yy[74252];D4w+=E70;var e4w=c8yy[74252];e4w+=A6X;var j4w=U4Z;j4w+=c8yy[404720];var S4w=r4Z;S4w+=d9Z;var U4w=h6Z;U4w+=A68;U4w+=J10;U4w+=m40;var Z4w=h6Z;Z4w+=o40;Z4w+=R6Z;var H4w=k6X;H4w+=v7Z;var W4w=J6X;W4w+=v6X;W4w+=T3X;var K4w=j40;K4w+=R6Z;var x4w=h6Z;x4w+=P6Z;x4w+=U4Z;x4w+=m40;var M4w=M00;M4w+=u6X;var g4w=C68;g4w+=t6X;g4w+=c6X;g4w+=E6X;var E4w=E7Z;E4w+=g6X;var c4w=M6X;c4w+=x6X;c4w+=K6X;var t4w=Z00;t4w+=W6X;t4w+=H6X;var u4w=Z6X;u4w+=v8Z;u4w+=U6X;u4w+=S6X;var v4w=c8yy.L9w;v4w+=P8Z;v4w+=s1Z;v4w+=c8yy[73441];var J4w=U6Z;J4w+=c8yy[74252];J4w+=R9Z;c8yy.g15();var btnClass=editor[J4w][v4w][j6X];var container=$(u4w + m6X + t4w + c4w + o6X + btnClass + e6X + p6X + (multiple?E4w:h5Z) + D6X + p0Z + g4w + o6X + btnClass + M4w + x4w + K4w + N6X + a6X + q6X + p0Z + W4w + H4w + p0Z + Z4w + p0Z + U4w);conf[S4w]=container;conf[Q6X]=H6Z;if(conf[j4w]){var o4w=O6X;o4w+=c8yy[404720];var m4w=Y9Z;m4w+=w1Z;m4w+=F6X;m4w+=I6X;container[n08](m4w)[L90](i6X,Editor[o4w](conf[e2Z]));}if(conf[e4w]){var p4w=c8yy[74252];p4w+=c8yy[20443];p4w+=c8yy[20443];p4w+=s1Z;container[n08](L6X)[p4w](conf[L90]);}_buttonText(conf);if(window[D4w] && conf[z6X] !== g6Z){var G4w=c8yy[653894];G4w+=X40;G4w+=v8Z;G4w+=C8Z;var R4w=P8Z;R4w+=f8Z;var l4w=P8Z;l4w+=f8Z;var n4w=P8Z;n4w+=f8Z;var F4w=T6X;F4w+=H8Z;var O4w=P8Z;O4w+=f8Z;var Q4w=n6X;Q4w+=h6X;Q4w+=r6X;var q4w=e57;q4w+=s6X;q4w+=l6X;var a4w=Z4Z;a4w+=a1Z;a4w+=c8yy[20443];var N4w=c8yy.L9w;N4w+=U4Z;N4w+=a40;container[N4w](P6X)[a4w](conf[q4w] || Q4w);var dragDrop=container[n08](w6X);dragDrop[O4w](F4w,function(e){var G6X="originalEvent";var B6X='over';var R6X="aTransfe";if(conf[Q6X]){var L4w=s1Z;L4w+=M37;L4w+=J2Z;L4w+=t27;var i4w=S68;i4w+=R6X;i4w+=s1Z;Editor[m28](editor,conf,e[G6X][i4w][I6Z],_buttonText,dropCallback);dragDrop[L4w](B6X);}return g6Z;})[c8yy.n9w](Y6X,function(e){c8yy.S15();var b7X="Cla";var d6X="ver";if(conf[Q6X]){var T4w=P8Z;T4w+=d6X;var z4w=E90;z4w+=C8Z;z4w+=b7X;z4w+=r3Z;dragDrop[z4w](T4w);}return g6Z;})[n4w](X7X,function(e){var C7X="ddCla";var V7X="nabled";var h4w=r4Z;h4w+=C8Z;h4w+=V7X;if(conf[h4w]){var s4w=P8Z;s4w+=J2Z;s4w+=C8Z;s4w+=s1Z;var r4w=c8yy[74252];r4w+=C7X;r4w+=v8Z;r4w+=v8Z;dragDrop[r4w](s4w);}return g6Z;});editor[l4w](J18,function(){var f7X="dragover.DTE_Upload drop.DTE_Uploa";var w4w=f7X;w4w+=c8yy[404720];var P4w=v1Z;P4w+=P8Z;P4w+=c8yy[404720];P4w+=b4Z;$(P4w)[c8yy.n9w](w4w,function(e){c8yy.g15();return g6Z;});})[R4w](G4w,function(){var A7X="Uplo";var y7X=" drop.DTE_";var I7X="dragover.DTE_Upload";var d4w=I7X;d4w+=y7X;d4w+=A7X;d4w+=F9Z;var Y4w=P8Z;Y4w+=c8yy.L9w;Y4w+=c8yy.L9w;var B4w=v1Z;B4w+=P8Z;B4w+=c8yy[404720];B4w+=b4Z;$(B4w)[Y4w](d4w);});}else {var V3w=k7X;V3w+=C8Z;V3w+=c8yy[404720];var X3w=J7X;X3w+=c8yy[404720];var b3w=f8Z;b3w+=Z67;b3w+=s1Z;b3w+=Y10;container[K9Z](b3w);container[X3w](container[n08](V3w));}container[C3w](v7X)[c8yy.n9w](f3w,function(e){var u7X="enabled";var I3w=r4Z;c8yy.S15();I3w+=u7X;e[r90]();if(conf[I3w]){var J3w=c8yy[653894];J3w+=c8yy[74252];J3w+=b8Z;J3w+=b8Z;var k3w=v8Z;k3w+=U2Z;var A3w=w1Z;A3w+=M58;var y3w=o70;y3w+=G7Z;Editor[y3w][A3w][k3w][J3w](editor,conf,h5Z);}});container[n08](v3w)[u3w](t3w,function(){var t7X="uploa";var E3w=j10;E3w+=b8Z;E3w+=C8Z;E3w+=v8Z;var c3w=t7X;c3w+=c8yy[404720];c8yy.g15();Editor[c3w](editor,conf,this[E3w],_buttonText,function(ids){var M3w=c8yy.L9w;M3w+=U4Z;M3w+=a40;var g3w=c8yy[653894];g3w+=c8yy[74252];g3w+=b8Z;g3w+=b8Z;dropCallback[g3w](editor,ids);container[M3w](L6X)[R0w][j28]=O0Z;});});return container;}function _triggerChange(input){setTimeout(function(){var c7X="trigger";c8yy.S15();input[c7X](J8X,{editor:H6Z,editorSet:H6Z});;},R0w);}var baseFieldType=$[x3w](H6Z,{},Editor[K3w][E7X],{get:function(conf){c8yy.S15();var W3w=g7X;W3w+=w1Z;W3w+=c8yy[20443];return conf[W3w][d0Z]();},set:function(conf,val){var H3w=J2Z;H3w+=c8yy[74252];H3w+=b8Z;c8yy.S15();conf[V6X][H3w](val);_triggerChange(conf[V6X]);},enable:function(conf){var U3w=N9Z;U3w+=S18;U3w+=F1Z;var Z3w=H8Z;Z3w+=s1Z;Z3w+=Y10;conf[V6X][Z3w](U3w,g6Z);},disable:function(conf){var M7X="sabl";var S3w=c8yy[404720];S3w+=U4Z;S3w+=M7X;S3w+=F1Z;c8yy.g15();conf[V6X][x7X](S3w,H6Z);},canReturnSubmit:function(conf,node){c8yy.S15();return H6Z;}});fieldTypes[j3w]={create:function(conf){conf[K7X]=conf[j28];return O0Z;},get:function(conf){var m3w=W7X;m3w+=Y2Z;return conf[m3w];},set:function(conf,val){var o3w=W7X;c8yy.S15();o3w+=c8yy[74252];o3w+=b8Z;conf[o3w]=val;}};fieldTypes[H7X]=$[e3w](H6Z,{},baseFieldType,{create:function(conf){var Z7X="only";var N3w=c8yy[74252];N3w+=c8yy[20443];N3w+=c8yy[20443];N3w+=s1Z;var D3w=g10;D3w+=F9Z;D3w+=Z7X;var p3w=c8yy[74252];p3w+=c8yy[20443];p3w+=q50;c8yy.g15();conf[V6X]=$(U7X)[p3w]($[X50]({id:Editor[K0Z](conf[e2Z]),type:S7X,readonly:D3w},conf[N3w] || ({})));return conf[V6X][R0w];}});fieldTypes[a3w]=$[q3w](H6Z,{},baseFieldType,{create:function(conf){var j7X="afe";c8yy.g15();var i3w=c8yy[20443];i3w+=C8Z;i3w+=n1Z;var F3w=v8Z;F3w+=j7X;F3w+=e4Z;F3w+=c8yy[404720];var O3w=U8Z;O3w+=C8Z;O3w+=a40;var Q3w=c8yy[74252];Q3w+=r38;Q3w+=s1Z;conf[V6X]=$(U7X)[Q3w]($[O3w]({id:Editor[F3w](conf[e2Z]),type:i3w},conf[L90] || ({})));return conf[V6X][R0w];}});fieldTypes[m7X]=$[L3w](H6Z,{},baseFieldType,{create:function(conf){var o7X="word";var r3w=r4Z;r3w+=W7Z;r3w+=F8X;var h3w=Z30;h3w+=s1Z;var n3w=F48;n3w+=v8Z;n3w+=v8Z;n3w+=o7X;var T3w=U8Z;T3w+=h1Z;T3w+=c8yy[404720];var z3w=c8yy[74252];z3w+=A6X;conf[V6X]=$(U7X)[z3w]($[T3w]({id:Editor[K0Z](conf[e2Z]),type:n3w},conf[h3w] || ({})));return conf[r3w][R0w];}});fieldTypes[e7X]=$[s3w](H6Z,{},baseFieldType,{create:function(conf){var D7X="tex";var N7X="tarea>";var p7X="<textarea></";var P3w=w7Z;P3w+=c8yy[20443];P3w+=s1Z;var l3w=p7X;l3w+=D7X;l3w+=N7X;c8yy.S15();conf[V6X]=$(l3w)[L90]($[X50]({id:Editor[K0Z](conf[e2Z])},conf[P3w] || ({})));return conf[V6X][R0w];},canReturnSubmit:function(conf,node){return g6Z;}});fieldTypes[a7X]=$[X50](H6Z,{},baseFieldType,{_addOptions:function(conf,opts,append){var z7X="placeholderValue";var T7X="placeholderDisabled";var L7X="Value";var i7X="aceholder";var O7X="laceho";var F7X="lde";var Q7X="ceholderDisable";var h7X="ptionsPair";var R3w=P8Z;R3w+=c10;R3w+=x48;R3w+=k00;var w3w=E8Z;w3w+=f8Z;w3w+=P47;w3w+=c8yy[20443];var elOpts=conf[w3w][R0w][R3w];var countOffset=R0w;if(!append){elOpts[M6Z]=R0w;if(conf[q7X] !== undefined){var b2w=J10;b2w+=a88;b2w+=o1X;var d3w=B5X;d3w+=c8yy[404720];d3w+=C8Z;d3w+=f8Z;var Y3w=v10;Y3w+=Q7X;Y3w+=c8yy[404720];var B3w=H8Z;B3w+=O7X;B3w+=F7X;B3w+=s1Z;var G3w=G50;G3w+=i7X;G3w+=L7X;var placeholderValue=conf[z7X] !== undefined?conf[G3w]:h5Z;countOffset+=G0w;elOpts[R0w]=new Option(conf[B3w],placeholderValue);var disabled=conf[T7X] !== undefined?conf[Y3w]:H6Z;elOpts[R0w][d3w]=disabled;elOpts[R0w][b2w]=disabled;elOpts[R0w][n7X]=placeholderValue;}}else {countOffset=elOpts[M6Z];}if(opts){var V2w=P8Z;V2w+=h7X;var X2w=H8Z;X2w+=c8yy[74252];X2w+=U4Z;X2w+=e8X;Editor[X2w](opts,conf[V2w],function(val,label,i,attr){var s7X="or_va";var r7X="_edi";var C2w=r7X;C2w+=c8yy[20443];C2w+=s7X;C2w+=b8Z;var option=new Option(label,val);option[C2w]=val;if(attr){var f2w=Z30;f2w+=s1Z;$(option)[f2w](attr);}elOpts[i + countOffset]=option;});}},create:function(conf){var w7X="hange.dte";var B7X="ect>";var Y7X="multiple";var G7X="ct></sel";var P7X="O";var R7X="safe";var l7X="ip";var M2w=r4Z;M2w+=U4Z;M2w+=k8X;var g2w=l7X;g2w+=P7X;g2w+=n70;var E2w=Y10;E2w+=c8yy[20443];E2w+=x48;E2w+=k00;var u2w=c8yy[653894];u2w+=w7X;var v2w=P8Z;v2w+=f8Z;var J2w=Z30;J2w+=s1Z;var k2w=U4Z;k2w+=c8yy[404720];var A2w=R7X;A2w+=x10;var y2w=U8Z;y2w+=h1Z;y2w+=c8yy[404720];var I2w=h6Z;I2w+=B67;I2w+=G7X;I2w+=B7X;conf[V6X]=$(I2w)[L90]($[y2w]({id:Editor[A2w](conf[k2w]),multiple:conf[Y7X] === H6Z},conf[J2w] || ({})))[v2w](u2w,function(e,d){var t2w=C8Z;t2w+=J10;t2w+=v2Z;t2w+=s1Z;if(!d || !d[t2w]){var c2w=d7X;c2w+=C8Z;c2w+=W6Z;conf[b0X]=fieldTypes[c2w][k90](conf);}});fieldTypes[a7X][X0X](conf,conf[E2w] || conf[g2w]);return conf[M2w][R0w];},update:function(conf,options,append){var V0X="ele";c8yy.g15();var W2w=r4Z;W2w+=U4Z;W2w+=B97;W2w+=A1Z;var x2w=B67;x2w+=c8yy[653894];x2w+=c8yy[20443];fieldTypes[x2w][X0X](conf,options,append);var lastSet=conf[b0X];if(lastSet !== undefined){var K2w=v8Z;K2w+=V0X;K2w+=c8yy[653894];K2w+=c8yy[20443];fieldTypes[K2w][y5Z](conf,lastSet,H6Z);}_triggerChange(conf[W2w]);},get:function(conf){var A0X="toArray";var f0X="option";var I0X=":selected";var U2w=K2Z;U2w+=c8yy[20443];U2w+=C0X;U2w+=C8Z;var Z2w=f0X;Z2w+=I0X;var H2w=y0X;H2w+=F8X;c8yy.S15();var val=conf[H2w][n08](Z2w)[v18](function(){c8yy.g15();return this[n7X];})[A0X]();if(conf[U2w]){var S2w=r7Z;S2w+=P8Z;S2w+=U4Z;S2w+=f8Z;return conf[k0X]?val[S2w](conf[k0X]):val;}return val[M6Z]?val[R0w]:O0Z;},set:function(conf,val,localUpdate){var E0X="ected";var v0X="separat";var t0X="lastS";var u0X="iple";var J0X="tio";var Q2w=s8Z;Q2w+=C0X;Q2w+=C8Z;var N2w=C8Z;N2w+=c8yy[74252];N2w+=c8yy[653894];N2w+=C6Z;var D2w=P8Z;D2w+=H8Z;D2w+=c47;var p2w=Y10;p2w+=J0X;p2w+=f8Z;var e2w=c8yy.L9w;e2w+=U4Z;e2w+=f8Z;e2w+=c8yy[404720];var o2w=v0X;o2w+=P8Z;o2w+=s1Z;var m2w=s8Z;m2w+=u0X;if(!localUpdate){var j2w=r4Z;j2w+=t0X;j2w+=C8Z;j2w+=c8yy[20443];conf[j2w]=val;}if(conf[m2w] && conf[o2w] && !Array[y10](val)){val=typeof val === Q90?val[h78](conf[k0X]):[];}else if(!Array[y10](val)){val=[val];}var i,len=val[M6Z],found,allFound=g6Z;var options=conf[V6X][e2w](p2w);conf[V6X][n08](D2w)[N2w](function(){var c0X="_ed";c8yy.g15();var q2w=B67;q2w+=Y67;found=g6Z;for(i=R0w;i < len;i++){var a2w=c0X;a2w+=U4Z;a2w+=P57;a2w+=K7X;if(this[a2w] == val[i]){found=H6Z;allFound=H6Z;break;}}this[q2w]=found;});if(conf[q7X] && !allFound && !conf[Q2w] && options[M6Z]){var O2w=d7X;O2w+=E0X;options[R0w][O2w]=H6Z;}if(!localUpdate){_triggerChange(conf[V6X]);}return allFound;},destroy:function(conf){var F2w=Q1Z;c8yy.g15();F2w+=N1X;F2w+=F58;conf[V6X][F20](F2w);}});fieldTypes[g0X]=$[X50](H6Z,{},baseFieldType,{_addOptions:function(conf,opts,append){c8yy.g15();var val,label;var jqInput=conf[V6X];var offset=R0w;if(!append){jqInput[k97]();}else {var L2w=e10;L2w+=H58;var i2w=W7Z;i2w+=F8X;offset=$(i2w,jqInput)[L2w];}if(opts){var z2w=H8Z;z2w+=M9Z;z2w+=s1Z;z2w+=v8Z;Editor[z2w](opts,conf[M0X],function(val,label,i,attr){var K0X="</d";var e0X='input:last';var Z0X="eckbox\" />";var H0X="=\"ch";var U0X="input id=\"";var p0X="put:";var x0X="or_v";var W0X="\" type";var o0X='</label>';var P2w=b00;P2w+=x0X;P2w+=c8yy[74252];P2w+=b8Z;var l2w=d0Z;l2w+=j80;var s2w=K0X;s2w+=U4Z;s2w+=m40;var r2w=W0X;r2w+=H0X;r2w+=Z0X;var h2w=U4Z;h2w+=c8yy[404720];var n2w=h6Z;n2w+=U0X;var T2w=I9Z;T2w+=h1Z;T2w+=c8yy[404720];jqInput[T2w](S0X + n2w + Editor[K0Z](conf[h2w]) + j0X + (i + offset) + r2w + m0X + Editor[K0Z](conf[e2Z]) + j0X + (i + offset) + W0Z + label + o0X + s2w);$(e0X,jqInput)[L90](l2w,val)[R0w][P2w]=val;if(attr){var R2w=Z30;R2w+=s1Z;var w2w=U4Z;w2w+=f8Z;w2w+=p0X;w2w+=D0X;$(w2w,jqInput)[R2w](attr);}});}},create:function(conf){var a0X="ipOpts";var N0X="check";var B2w=N0X;B2w+=e20;var G2w=o7Z;G2w+=x00;G2w+=A07;G2w+=m40;conf[V6X]=$(G2w);fieldTypes[B2w][X0X](conf,conf[L87] || conf[a0X]);return conf[V6X][R0w];},get:function(conf){var L0X="lecte";var q0X="input:chec";var z0X="dValu";var i0X="unse";var Q0X="ked";var F0X="unselectedValue";var f5w=r7Z;f5w+=P8Z;f5w+=U4Z;f5w+=f8Z;var b5w=e10;b5w+=f8Z;b5w+=D4Z;b5w+=c6Z;var d2w=q0X;d2w+=Q0X;var Y2w=E8Z;Y2w+=B97;Y2w+=w1Z;Y2w+=c8yy[20443];var out=[];var selected=conf[Y2w][n08](d2w);if(selected[b5w]){var X5w=f38;X5w+=C6Z;selected[X5w](function(){c8yy.S15();var O0X="_editor_v";var V5w=O0X;V5w+=c8yy[74252];V5w+=b8Z;out[f6Z](this[V5w]);});}else if(conf[F0X] !== undefined){var C5w=i0X;C5w+=L0X;C5w+=z0X;C5w+=C8Z;out[f6Z](conf[C5w]);}return conf[k0X] === undefined || conf[k0X] === O0Z?out:out[f5w](conf[k0X]);},set:function(conf,val){var n0X='|';var jqInputs=conf[V6X][n08](T0X);if(!Array[y10](val) && typeof val === Q90){val=val[h78](conf[k0X] || n0X);}else if(!Array[y10](val)){val=[val];}var i,len=val[M6Z],found;jqInputs[N80](function(){found=g6Z;for(i=R0w;i < len;i++){if(this[n7X] == val[i]){found=H6Z;break;}}c8yy.g15();this[h0X]=found;});_triggerChange(jqInputs);},enable:function(conf){var A5w=n4Z;A5w+=Y10;var y5w=W7Z;c8yy.g15();y5w+=F8X;var I5w=c8yy.L9w;I5w+=U4Z;I5w+=f8Z;I5w+=c8yy[404720];conf[V6X][I5w](y5w)[A5w](Y8X,g6Z);},disable:function(conf){var J5w=H8Z;J5w+=s1Z;J5w+=Y10;var k5w=c8yy.L9w;c8yy.S15();k5w+=e48;conf[V6X][k5w](T0X)[J5w](Y8X,H6Z);},update:function(conf,options,append){var l0X="chec";var r0X="_add";c8yy.g15();var P0X="kbo";var s0X="Opt";var t5w=d2Z;t5w+=c8yy[20443];var u5w=r0X;u5w+=s0X;u5w+=U68;var v5w=l0X;v5w+=P0X;v5w+=a1Z;var checkbox=fieldTypes[v5w];var currVal=checkbox[k90](conf);checkbox[u5w](conf,options,append);checkbox[t5w](conf,currVal);}});fieldTypes[w0X]=$[c5w](H6Z,{},baseFieldType,{_addOptions:function(conf,opts,append){var R0X="airs";var E5w=r4Z;E5w+=U4Z;E5w+=B97;E5w+=A1Z;var val,label;var jqInput=conf[E5w];var offset=R0w;if(!append){var g5w=O4X;g5w+=b4Z;jqInput[g5w]();}else {offset=$(T0X,jqInput)[M6Z];}if(opts){var M5w=H8Z;M5w+=R0X;Editor[M5w](opts,conf[M0X],function(val,label,i,attr){var X9X="put:last";var b9X='" type="radio" name="';var Y0X="\" /";var G0X="_edito";var B0X="afeId";var d0X='<input id="';var j5w=G0X;j5w+=s1Z;j5w+=W7X;j5w+=Y2Z;var S5w=f40;S5w+=c8yy[20443];S5w+=S98;S5w+=D0X;var U5w=J7Z;U5w+=k77;U5w+=C8Z;U5w+=S7Z;var Z5w=Y6Z;Z5w+=R6Z;var H5w=v8Z;H5w+=B0X;var W5w=Y0X;W5w+=R6Z;var K5w=m58;K5w+=C8Z;var x5w=U4Z;x5w+=c8yy[404720];jqInput[x80](S0X + d0X + Editor[K0Z](conf[x5w]) + j0X + (i + offset) + b9X + conf[K5w] + W5w + m0X + Editor[H5w](conf[e2Z]) + j0X + (i + offset) + Z5w + label + U5w + p0Z);c8yy.S15();$(S5w,jqInput)[L90](g1X,val)[R0w][j5w]=val;if(attr){var o5w=c8yy[74252];o5w+=c8yy[20443];o5w+=q50;var m5w=W7Z;m5w+=X9X;$(m5w,jqInput)[o5w](attr);}});}},create:function(conf){var C9X='<div />';var V9X="pOpts";var D5w=P8Z;D5w+=f8Z;var p5w=U4Z;p5w+=V9X;var e5w=g7X;e5w+=A1Z;conf[e5w]=$(C9X);fieldTypes[w0X][X0X](conf,conf[L87] || conf[p5w]);this[D5w](J18,function(){var Q5w=C8Z;Q5w+=f88;var q5w=Y9Z;q5w+=A1Z;var a5w=J48;a5w+=c8yy[404720];var N5w=g7X;N5w+=w1Z;N5w+=c8yy[20443];conf[N5w][a5w](q5w)[Q5w](function(){c8yy.g15();var f9X="reChec";var I9X="che";var O5w=I3Z;O5w+=f9X;O5w+=j6Z;O5w+=F1Z;if(this[O5w]){var F5w=I9X;F5w+=i10;F5w+=C8Z;F5w+=c8yy[404720];this[F5w]=H6Z;}});});return conf[V6X][R0w];},get:function(conf){var y9X="editor_v";var k9X="ecked";c8yy.S15();var A9X="ut:ch";var T5w=r4Z;T5w+=y9X;T5w+=Y2Z;var z5w=e10;z5w+=f8Z;z5w+=D77;z5w+=C6Z;var L5w=Y9Z;L5w+=A9X;L5w+=k9X;var i5w=j10;i5w+=a40;var el=conf[V6X][i5w](L5w);return el[z5w]?el[R0w][T5w]:undefined;},set:function(conf,val){var J9X="input:ch";var v9X="ecke";var P5w=J9X;P5w+=v9X;P5w+=c8yy[404720];var l5w=r4Z;l5w+=U4Z;l5w+=f8Z;l5w+=F8X;var n5w=j10;n5w+=f8Z;n5w+=c8yy[404720];var that=this;c8yy.S15();conf[V6X][n5w](T0X)[N80](function(){var E9X="cked";c8yy.g15();var c9X="_preCh";var t9X="Checked";var u9X="_preChecked";this[u9X]=g6Z;if(this[n7X] == val){var r5w=r4Z;r5w+=S17;r5w+=t9X;var h5w=Q1Z;h5w+=z8X;h5w+=e98;h5w+=c8yy[404720];this[h5w]=H6Z;this[r5w]=H6Z;}else {var s5w=c9X;s5w+=C8Z;s5w+=E9X;this[h0X]=g6Z;this[s5w]=g6Z;}});_triggerChange(conf[l5w][n08](P5w));},enable:function(conf){var R5w=c8yy.L9w;R5w+=e48;var w5w=E8Z;w5w+=f8Z;w5w+=P47;w5w+=c8yy[20443];conf[w5w][R5w](T0X)[x7X](Y8X,g6Z);},disable:function(conf){var Y5w=J10;Y5w+=a88;Y5w+=N8Z;Y5w+=c8yy[404720];var B5w=H8Z;B5w+=s1Z;B5w+=P8Z;B5w+=H8Z;var G5w=E8Z;G5w+=f8Z;G5w+=P47;G5w+=c8yy[20443];conf[G5w][n08](T0X)[B5w](Y5w,H6Z);},update:function(conf,options,append){var x9X="adi";var M9X="dOpt";var g9X="[val";var f6w=x4Z;f6w+=C8Z;var C6w=g9X;C6w+=j80;C6w+=F08;var V6w=c8yy.L9w;V6w+=e48;var X6w=r4Z;X6w+=F9Z;X6w+=M9X;X6w+=U68;var b6w=W5Z;b6w+=c8yy[20443];var d5w=s1Z;c8yy.g15();d5w+=x9X;d5w+=P8Z;var radio=fieldTypes[d5w];var currVal=radio[b6w](conf);radio[X6w](conf,options,append);var inputs=conf[V6X][V6w](T0X);radio[y5Z](conf,inputs[R57](C6w + currVal + X6Z)[M6Z]?currVal:inputs[z00](R0w)[L90](f6w));}});fieldTypes[I6w]=$[X50](H6Z,{},baseFieldType,{create:function(conf){var Z9X="Forma";var j9X="ddClas";var K9X="npu";var S9X="ui";var p9X="RFC_2822";var W9X="datepic";c8yy.S15();var m9X="epi";var U9X="jquery";var e9X="ateForm";var i9X='type';var S6w=r4Z;S6w+=U4Z;S6w+=K9X;S6w+=c8yy[20443];var k6w=W9X;k6w+=e98;k6w+=s1Z;var A6w=c8yy[74252];A6w+=r38;A6w+=s1Z;var y6w=r4Z;y6w+=U4Z;y6w+=B97;y6w+=A1Z;conf[y6w]=$(H9X)[A6w]($[X50]({id:Editor[K0Z](conf[e2Z]),type:S7X},conf[L90]));if($[k6w]){var u6w=f97;u6w+=Z9X;u6w+=c8yy[20443];var v6w=U9X;v6w+=S9X;var J6w=c8yy[74252];J6w+=j9X;J6w+=v8Z;conf[V6X][J6w](v6w);if(!conf[u6w]){var c6w=S68;c6w+=m9X;c6w+=o9X;var t6w=c8yy[404720];t6w+=e9X;t6w+=w7Z;conf[t6w]=$[c6w][p9X];}setTimeout(function(){var a9X="datep";var Q9X="dateFormat";var D9X="#ui-d";var N9X="atepicker-div";var q9X="ick";var O9X="dateImage";var Z6w=f8Z;Z6w+=P8Z;Z6w+=D48;var H6w=c8yy[653894];H6w+=v8Z;H6w+=v8Z;var W6w=D9X;W6w+=N9X;var M6w=C8Z;M6w+=a1Z;M6w+=q1Z;var g6w=a9X;g6w+=q9X;g6w+=V20;var E6w=E8Z;E6w+=f8Z;E6w+=F8X;$(conf[E6w])[g6w]($[M6w]({dateFormat:conf[Q9X],buttonImage:conf[O9X],buttonImageOnly:H6Z,onSelect:function(){var F9X="click";var K6w=c8yy.L9w;K6w+=t50;K6w+=w1Z;c8yy.g15();K6w+=v8Z;var x6w=E8Z;x6w+=B97;x6w+=w1Z;x6w+=c8yy[20443];conf[x6w][K6w]()[F9X]();}},conf[G0Z]));$(W6w)[H6w](m9Z,Z6w);},C9w);}else {var U6w=c8yy[404720];U6w+=c8yy[74252];U6w+=c8yy[20443];U6w+=C8Z;conf[V6X][L90](i9X,U6w);}return conf[S6w][R0w];},set:function(conf,val){c8yy.S15();var r9X="change";var L9X="atep";var h9X="setDate";var T9X='hasDatepicker';var j6w=c8yy[404720];j6w+=L9X;j6w+=z9X;if($[j6w] && conf[V6X][G9Z](T9X)){var m6w=E8Z;m6w+=f8Z;m6w+=F8X;conf[m6w][n9X](h9X,val)[r9X]();}else {var o6w=r4Z;o6w+=Y9Z;o6w+=A1Z;$(conf[o6w])[d0Z](val);}},enable:function(conf){var s9X="able";c8yy.g15();var e6w=c8yy[404720];e6w+=w7Z;e6w+=l80;e6w+=z9X;if($[e6w]){var D6w=h1Z;D6w+=s9X;var p6w=y0X;p6w+=P47;p6w+=c8yy[20443];conf[p6w][n9X](D6w);}else {var N6w=r4Z;N6w+=W7Z;N6w+=F8X;$(conf[N6w])[x7X](Y8X,g6Z);}},disable:function(conf){var P9X="epicker";var l9X="datepi";var a6w=l9X;a6w+=o9X;if($[a6w]){var q6w=S68;q6w+=P9X;conf[V6X][q6w](I18);}else {var Q6w=H8Z;Q6w+=s1Z;Q6w+=Y10;$(conf[V6X])[Q6w](Y8X,H6Z);}},owns:function(conf,node){var w9X="div.ui-datepicker-h";var R9X='div.ui-datepicker';var i6w=b8Z;i6w+=l10;var F6w=w9X;F6w+=C8Z;F6w+=F9Z;F6w+=V20;var O6w=e10;c8yy.S15();O6w+=H58;return $(node)[j9Z](R9X)[O6w] || $(node)[j9Z](F6w)[i6w]?H6Z:g6Z;}});fieldTypes[L6w]=$[X50](H6Z,{},baseFieldType,{create:function(conf){c8yy.S15();var B9X="seFn";var X8s="_picke";var b8s="eTim";var G9X="Input";var Y9X="atetime";var C8s="eyd";var d9X="displayFor";var f7w=E8Z;f7w+=f8Z;f7w+=P47;f7w+=c8yy[20443];var C7w=C50;C7w+=d2Z;var Y6w=z5X;Y6w+=G9X;var G6w=g38;G6w+=P8Z;G6w+=B9X;var R6w=c8yy[404720];R6w+=Y9X;var w6w=T00;w6w+=w7Z;var P6w=d9X;P6w+=c8yy[73441];P6w+=w7Z;var l6w=U8Z;l6w+=C8Z;l6w+=a40;var s6w=r4Z;s6w+=f40;s6w+=c8yy[20443];var r6w=M97;r6w+=c8yy[20443];r6w+=b8s;r6w+=C8Z;var h6w=X8s;h6w+=s1Z;var n6w=a88;n6w+=c8yy.L9w;n6w+=R3Z;var T6w=c8yy[74252];T6w+=c8yy[20443];T6w+=c8yy[20443];T6w+=s1Z;var z6w=y0X;z6w+=H8Z;z6w+=w1Z;z6w+=c8yy[20443];conf[z6w]=$(H9X)[T6w]($[X50](H6Z,{id:Editor[n6w](conf[e2Z]),type:S7X},conf[L90]));conf[h6w]=new Editor[r6w](conf[s6w],$[l6w]({format:conf[P6w] || conf[w6w],i18n:this[Y7Z][R6w]},conf[G0Z]));conf[G6w]=function(){var B6w=B5X;c8yy.g15();B6w+=C8Z;conf[V8s][B6w]();};if(conf[Y6w] === g6Z){var X7w=j6Z;X7w+=C8s;X7w+=F10;var b7w=P8Z;b7w+=f8Z;var d6w=y0X;d6w+=H8Z;d6w+=w1Z;d6w+=c8yy[20443];conf[d6w][b7w](X7w,function(e){var V7w=S17;V7w+=J2Z;V7w+=h1Z;V7w+=l90;e[V7w]();});}this[c8yy.n9w](C7w,conf[f8s]);return conf[f7w][R0w];},get:function(conf){var k8s="wireFormat";var I8s="momentLo";var y8s="wireFor";var y7w=I8s;y7w+=P90;y7w+=e10;var I7w=y8s;I7w+=b07;var val=conf[V6X][d0Z]();var inst=conf[V8s][c8yy[653894]];c8yy.S15();return val && conf[I7w] && moment?moment(val,inst[L07],inst[y7w],inst[A8s])[L07](conf[k8s]):val;},set:function(conf,val){var E8s="ormat";var M8s="ker";var u8s="Fo";var g8s="_pick";var t8s="ir";var J8s="rma";var v8s="wire";var c8s="eF";var c7w=c8yy.L9w;c7w+=Q2Z;c8yy.g15();c7w+=b07;var t7w=c8yy.L9w;t7w+=P8Z;t7w+=J8s;t7w+=c8yy[20443];var u7w=v8s;u7w+=u8s;u7w+=s1Z;u7w+=b07;var v7w=m4Z;v7w+=t8s;v7w+=c8s;v7w+=E8s;var J7w=W67;J7w+=b8Z;var k7w=g8s;k7w+=C8Z;k7w+=s1Z;var A7w=I3Z;A7w+=S6Z;A7w+=M8s;var inst=conf[A7w][c8yy[653894]];conf[k7w][J7w](val && conf[v7w] && moment?moment(val,conf[u7w],inst[z97],inst[A8s])[t7w](inst[c7w]):val);_triggerChange(conf[V6X]);},owns:function(conf,node){c8yy.g15();var E7w=V50;E7w+=k00;return conf[V8s][E7w](node);},errorMessage:function(conf,msg){var W8s="_pic";var K8s="sg";var x8s="rM";c8yy.g15();var M7w=C8Z;M7w+=T4Z;M7w+=x8s;M7w+=K8s;var g7w=W8s;g7w+=e98;g7w+=s1Z;conf[g7w][M7w](msg);},destroy:function(conf){var H8s="_pi";var Z8s="cke";var W7w=Y88;W7w+=c8yy[20443];W7w+=s1Z;c8yy.S15();W7w+=d88;var K7w=H8s;K7w+=Z8s;K7w+=s1Z;var x7w=a87;x7w+=P8Z;x7w+=k10;this[F20](E40,conf[f8s]);conf[V6X][F20](x7w);conf[K7w][W7w]();},minDate:function(conf,min){c8yy.g15();conf[V8s][u5X](min);},maxDate:function(conf,max){var Z7w=c8yy[73441];Z7w+=c8yy[74252];Z7w+=a1Z;var H7w=I3Z;H7w+=z9X;conf[H7w][Z7w](max);}});fieldTypes[U7w]=$[S7w](H6Z,{},baseFieldType,{create:function(conf){var editor=this;var container=_commonUpload(editor,conf,function(val){c8yy.g15();var S8s='postUpload';var U8s="ldType";var o7w=v38;o7w+=E38;var m7w=v8Z;m7w+=C8Z;m7w+=c8yy[20443];var j7w=j10;j7w+=C8Z;j7w+=U8s;j7w+=v8Z;Editor[j7w][m28][m7w][J9Z](editor,conf,val[R0w]);editor[o7w](S8s,[conf[J0Z],val[R0w]]);});return container;},get:function(conf){return conf[K7X];},set:function(conf,val){var O8s='noClear';var m8s="rVa";var a8s="pty";var F8s='upload.editor';var e8s='div.rendered';var o8s="lue button";var p8s="</s";var j8s="iv.clea";var Q8s="clearText";var h7w=r4Z;h7w+=d0Z;var n7w=W7Z;n7w+=P47;n7w+=c8yy[20443];var z7w=c8yy[404720];z7w+=j8s;z7w+=m8s;z7w+=o8s;var L7w=c8yy.L9w;L7w+=U4Z;L7w+=f8Z;L7w+=c8yy[404720];var p7w=N9Z;p7w+=G50;p7w+=F4Z;var e7w=r4Z;e7w+=Y9Z;e7w+=w1Z;e7w+=c8yy[20443];conf[K7X]=val;var container=conf[e7w];if(conf[p7w]){var D7w=W7X;D7w+=c8yy[74252];D7w+=b8Z;var rendered=container[n08](e8s);if(conf[D7w]){var a7w=r4Z;a7w+=J2Z;a7w+=c8yy[74252];a7w+=b8Z;var N7w=C6Z;N7w+=c8yy[20443];N7w+=c8yy[73441];N7w+=b8Z;rendered[N7w](conf[v80](conf[a7w]));}else {var i7w=p8s;i7w+=H8Z;i7w+=Z07;var F7w=D8s;F7w+=N8s;var O7w=W07;O7w+=f8Z;O7w+=R6Z;var Q7w=T7Z;Q7w+=c3Z;Q7w+=f8Z;Q7w+=c8yy[404720];var q7w=l67;q7w+=a8s;rendered[q7w]()[Q7w](O7w + (conf[q8s] || F7w) + i7w);}}var button=container[L7w](z7w);if(val && conf[Q8s]){var T7w=C6Z;T7w+=M80;T7w+=b8Z;button[T7w](conf[Q8s]);container[n9Z](O8s);}else {container[K9Z](O8s);}conf[V6X][n08](n7w)[I98](F8s,[conf[h7w]]);},enable:function(conf){var i8s="enabl";var P7w=r4Z;P7w+=i8s;P7w+=F1Z;var l7w=H8Z;l7w+=s1Z;l7w+=P8Z;l7w+=H8Z;var s7w=W7Z;s7w+=F8X;var r7w=c8yy.L9w;r7w+=U4Z;r7w+=f8Z;r7w+=c8yy[404720];conf[V6X][r7w](s7w)[l7w](Y8X,g6Z);conf[P7w]=H6Z;},disable:function(conf){var L8s="_en";var G7w=L8s;G7w+=E2X;var R7w=n4Z;c8yy.S15();R7w+=P8Z;R7w+=H8Z;var w7w=W7Z;w7w+=F8X;conf[V6X][n08](w7w)[R7w](Y8X,H6Z);conf[G7w]=g6Z;},canReturnSubmit:function(conf,node){c8yy.S15();return g6Z;}});fieldTypes[B7w]=$[Y7w](H6Z,{},baseFieldType,{_showHide:function(conf){var h8s="_limitLeft";var T8s="_container";var n8s='div.limitHide';var z8s="limit";var V0w=r4Z;V0w+=J2Z;V0w+=c8yy[74252];V0w+=b8Z;var X0w=p4Z;X0w+=c8yy[73441];X0w+=U4Z;X0w+=c8yy[20443];var b0w=c8yy[653894];b0w+=v8Z;b0w+=v8Z;var d7w=c8yy.L9w;d7w+=U4Z;d7w+=f8Z;c8yy.S15();d7w+=c8yy[404720];if(!conf[z8s]){return;}conf[T8s][d7w](n8s)[b0w](m9Z,conf[K7X][M6Z] >= conf[z8s]?Z10:z80);conf[h8s]=conf[X0w] - conf[V0w][M6Z];},create:function(conf){var s8s="ddClass";var G8s='button.remove';var r8s="_co";var R8s='multi';var K0w=r8s;K0w+=H3Z;K0w+=H88;K0w+=V20;var c0w=P8Z;c0w+=f8Z;var t0w=c8yy[74252];t0w+=s8s;var editor=this;var container=_commonUpload(editor,conf,function(val){var P8s="cat";var l8s="stUpl";var u0w=r4Z;u0w+=W67;u0w+=b8Z;var v0w=f8Z;v0w+=c8yy[74252];v0w+=c8yy[73441];v0w+=C8Z;var J0w=v8X;J0w+=l8s;J0w+=F28;J0w+=c8yy[404720];var k0w=v38;k0w+=J2Z;k0w+=C8Z;k0w+=H3Z;var A0w=W7X;A0w+=c8yy[74252];A0w+=b8Z;var y0w=v8Z;y0w+=C8Z;y0w+=c8yy[20443];var I0w=c8yy[653894];I0w+=P8Z;I0w+=f8Z;I0w+=P8s;var f0w=r4Z;f0w+=J2Z;f0w+=c8yy[74252];f0w+=b8Z;var C0w=W7X;C0w+=c8yy[74252];C0w+=b8Z;c8yy.S15();conf[C0w]=conf[f0w][I0w](val);Editor[f0Z][w8s][y0w][J9Z](editor,conf,conf[A0w]);editor[k0w](J0w,[conf[v0w],conf[u0w]]);},H6Z);container[t0w](R8s)[c0w](s0Z,G8s,function(e){c8yy.S15();var d8s='idx';var Y8s="oadM";var B8s="stopPropagation";e[B8s]();if(conf[Q6X]){var x0w=P90;x0w+=w90;var M0w=v8Z;M0w+=C8Z;M0w+=c8yy[20443];var g0w=h28;g0w+=Y8s;g0w+=V57;var E0w=W7X;E0w+=Y2Z;var idx=$(this)[k0Z](d8s);conf[E0w][b88](idx,G0w);Editor[f0Z][g0w][M0w][x0w](editor,conf,conf[K7X]);}});conf[K0w]=container;return container;},get:function(conf){return conf[K7X];},set:function(conf,val){var X1s="sArra";var M1s="_showHide";var f1s=".re";var b1s="oad.edit";var A1s='<ul></ul>';var y1s="ndTo";var V1s="Upload collections ";var C1s="must have an array as a value";var I1s="ndere";var F0w=r4Z;F0w+=J2Z;F0w+=c8yy[74252];F0w+=b8Z;var O0w=F88;O0w+=b8Z;O0w+=b1s;O0w+=Q2Z;var W0w=U4Z;W0w+=X1s;W0w+=b4Z;if(!val){val=[];}if(!Array[W0w](val)){var H0w=V1s;H0w+=C1s;throw H0w;}conf[K7X]=val;var that=this;var container=conf[V6X];if(conf[v80]){var j0w=t6Z;j0w+=c8yy[20443];j0w+=C6Z;var S0w=l67;S0w+=H8Z;S0w+=q3Z;var U0w=n18;U0w+=f1s;U0w+=I1s;U0w+=c8yy[404720];var Z0w=c8yy.L9w;Z0w+=U4Z;Z0w+=f8Z;Z0w+=c8yy[404720];var rendered=container[Z0w](U0w)[S0w]();if(val[j0w]){var o0w=C8Z;o0w+=c8yy[74252];o0w+=c8yy[653894];o0w+=C6Z;var m0w=n40;m0w+=y1s;var list=$(A1s)[m0w](rendered);$[o0w](val,function(i,file){var E1s=' remove" data-idx="';var t1s=" <b";var k1s="\">&t";var g1s='</li>';var c1s="tton class=";var u1s="ton>";var v1s="</but";var J1s="imes;";var a0w=k1s;a0w+=J1s;a0w+=v1s;a0w+=u1s;var N0w=d3X;N0w+=n10;var D0w=t1s;D0w+=w1Z;D0w+=c1s;D0w+=Y6Z;var p0w=F2Z;p0w+=x40;var e0w=h6Z;e0w+=b8Z;e0w+=U4Z;e0w+=R6Z;list[x80](e0w + conf[p0w](file,i) + D0w + that[N0w][T00][w2Z] + E1s + i + a0w + g1s);});}else {var Q0w=D8s;Q0w+=N8s;Q0w+=v8Z;var q0w=h6Z;q0w+=M40;q0w+=c8yy[74252];q0w+=e4X;rendered[x80](q0w + (conf[q8s] || Q0w) + e0Z);}}Editor[f0Z][w8s][M1s](conf);conf[V6X][n08](T0X)[I98](O0w,[conf[F0w]]);},enable:function(conf){var x1s="isabl";var z0w=v38;z0w+=e27;z0w+=o1X;var L0w=c8yy[404720];L0w+=x1s;L0w+=F1Z;var i0w=c8yy.L9w;i0w+=U4Z;i0w+=f8Z;i0w+=c8yy[404720];conf[V6X][i0w](T0X)[x7X](L0w,g6Z);conf[z0w]=H6Z;},disable:function(conf){var K1s="disab";var h0w=K1s;h0w+=e10;h0w+=c8yy[404720];var n0w=f3Z;n0w+=H8Z;var T0w=U4Z;T0w+=f8Z;T0w+=H8Z;c8yy.g15();T0w+=A1Z;conf[V6X][n08](T0w)[n0w](h0w,H6Z);conf[Q6X]=g6Z;},canReturnSubmit:function(conf,node){c8yy.S15();return g6Z;}});})();if(DataTable[r0w][s0w]){var l0w=A88;l0w+=W1s;$[X50](Editor[f0Z],DataTable[U8Z][l0w]);}DataTable[U8Z][P0w]=Editor[f0Z];Editor[I6Z]={};Editor[t9Z][H1s]=Y5Z;Editor[Z1s]=w0w;return Editor;});

/*! Buttons for DataTables 1.6.5
 * ©2016-2020 SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


// Used for namespacing events added to the document by each instance, so they
// can be removed on destroy
var _instCounter = 0;

// Button namespacing counter for namespacing events on individual buttons
var _buttonCounter = 0;

var _dtButtons = DataTable.ext.buttons;

// Allow for jQuery slim
function _fadeIn(el, duration, fn) {
	if ($.fn.animate) {
		el
			.stop()
			.fadeIn( duration, fn );
	}
	else {
		el.css('display', 'block');

		if (fn) {
			fn.call(el);
		}
	}
}

function _fadeOut(el, duration, fn) {
	if ($.fn.animate) {
		el
			.stop()
			.fadeOut( duration, fn );
	}
	else {
		el.css('display', 'none');
		
		if (fn) {
			fn.call(el);
		}
	}
}

/**
 * [Buttons description]
 * @param {[type]}
 * @param {[type]}
 */
var Buttons = function( dt, config )
{
	// If not created with a `new` keyword then we return a wrapper function that
	// will take the settings object for a DT. This allows easy use of new instances
	// with the `layout` option - e.g. `topLeft: $.fn.dataTable.Buttons( ... )`.
	if ( !(this instanceof Buttons) ) {
		return function (settings) {
			return new Buttons( settings, dt ).container();
		};
	}

	// If there is no config set it to an empty object
	if ( typeof( config ) === 'undefined' ) {
		config = {};	
	}
	
	// Allow a boolean true for defaults
	if ( config === true ) {
		config = {};
	}

	// For easy configuration of buttons an array can be given
	if ( Array.isArray( config ) ) {
		config = { buttons: config };
	}

	this.c = $.extend( true, {}, Buttons.defaults, config );

	// Don't want a deep copy for the buttons
	if ( config.buttons ) {
		this.c.buttons = config.buttons;
	}

	this.s = {
		dt: new DataTable.Api( dt ),
		buttons: [],
		listenKeys: '',
		namespace: 'dtb'+(_instCounter++)
	};

	this.dom = {
		container: $('<'+this.c.dom.container.tag+'/>')
			.addClass( this.c.dom.container.className )
	};

	this._constructor();
};


$.extend( Buttons.prototype, {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Public methods
	 */

	/**
	 * Get the action of a button
	 * @param  {int|string} Button index
	 * @return {function}
	 *//**
	 * Set the action of a button
	 * @param  {node} node Button element
	 * @param  {function} action Function to set
	 * @return {Buttons} Self for chaining
	 */
	action: function ( node, action )
	{
		var button = this._nodeToButton( node );

		if ( action === undefined ) {
			return button.conf.action;
		}

		button.conf.action = action;

		return this;
	},

	/**
	 * Add an active class to the button to make to look active or get current
	 * active state.
	 * @param  {node} node Button element
	 * @param  {boolean} [flag] Enable / disable flag
	 * @return {Buttons} Self for chaining or boolean for getter
	 */
	active: function ( node, flag ) {
		var button = this._nodeToButton( node );
		var klass = this.c.dom.button.active;
		var jqNode = $(button.node);

		if ( flag === undefined ) {
			return jqNode.hasClass( klass );
		}

		jqNode.toggleClass( klass, flag === undefined ? true : flag );

		return this;
	},

	/**
	 * Add a new button
	 * @param {object} config Button configuration object, base string name or function
	 * @param {int|string} [idx] Button index for where to insert the button
	 * @return {Buttons} Self for chaining
	 */
	add: function ( config, idx )
	{
		var buttons = this.s.buttons;

		if ( typeof idx === 'string' ) {
			var split = idx.split('-');
			var base = this.s;

			for ( var i=0, ien=split.length-1 ; i<ien ; i++ ) {
				base = base.buttons[ split[i]*1 ];
			}

			buttons = base.buttons;
			idx = split[ split.length-1 ]*1;
		}

		this._expandButton( buttons, config, base !== undefined, idx );
		this._draw();

		return this;
	},

	/**
	 * Get the container node for the buttons
	 * @return {jQuery} Buttons node
	 */
	container: function ()
	{
		return this.dom.container;
	},

	/**
	 * Disable a button
	 * @param  {node} node Button node
	 * @return {Buttons} Self for chaining
	 */
	disable: function ( node ) {
		var button = this._nodeToButton( node );

		$(button.node)
			.addClass( this.c.dom.button.disabled )
			.attr('disabled', true);

		return this;
	},

	/**
	 * Destroy the instance, cleaning up event handlers and removing DOM
	 * elements
	 * @return {Buttons} Self for chaining
	 */
	destroy: function ()
	{
		// Key event listener
		$('body').off( 'keyup.'+this.s.namespace );

		// Individual button destroy (so they can remove their own events if
		// needed). Take a copy as the array is modified by `remove`
		var buttons = this.s.buttons.slice();
		var i, ien;
		
		for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
			this.remove( buttons[i].node );
		}

		// Container
		this.dom.container.remove();

		// Remove from the settings object collection
		var buttonInsts = this.s.dt.settings()[0];

		for ( i=0, ien=buttonInsts.length ; i<ien ; i++ ) {
			if ( buttonInsts.inst === this ) {
				buttonInsts.splice( i, 1 );
				break;
			}
		}

		return this;
	},

	/**
	 * Enable / disable a button
	 * @param  {node} node Button node
	 * @param  {boolean} [flag=true] Enable / disable flag
	 * @return {Buttons} Self for chaining
	 */
	enable: function ( node, flag )
	{
		if ( flag === false ) {
			return this.disable( node );
		}

		var button = this._nodeToButton( node );
		$(button.node)
			.removeClass( this.c.dom.button.disabled )
			.removeAttr('disabled');

		return this;
	},

	/**
	 * Get the instance name for the button set selector
	 * @return {string} Instance name
	 */
	name: function ()
	{
		return this.c.name;
	},

	/**
	 * Get a button's node of the buttons container if no button is given
	 * @param  {node} [node] Button node
	 * @return {jQuery} Button element, or container
	 */
	node: function ( node )
	{
		if ( ! node ) {
			return this.dom.container;
		}

		var button = this._nodeToButton( node );
		return $(button.node);
	},

	/**
	 * Set / get a processing class on the selected button
	 * @param {element} node Triggering button node
	 * @param  {boolean} flag true to add, false to remove, undefined to get
	 * @return {boolean|Buttons} Getter value or this if a setter.
	 */
	processing: function ( node, flag )
	{
		var dt = this.s.dt;
		var button = this._nodeToButton( node );

		if ( flag === undefined ) {
			return $(button.node).hasClass( 'processing' );
		}

		$(button.node).toggleClass( 'processing', flag );

		$(dt.table().node()).triggerHandler( 'buttons-processing.dt', [
			flag, dt.button( node ), dt, $(node), button.conf
		] );

		return this;
	},

	/**
	 * Remove a button.
	 * @param  {node} node Button node
	 * @return {Buttons} Self for chaining
	 */
	remove: function ( node )
	{
		var button = this._nodeToButton( node );
		var host = this._nodeToHost( node );
		var dt = this.s.dt;

		// Remove any child buttons first
		if ( button.buttons.length ) {
			for ( var i=button.buttons.length-1 ; i>=0 ; i-- ) {
				this.remove( button.buttons[i].node );
			}
		}

		// Allow the button to remove event handlers, etc
		if ( button.conf.destroy ) {
			button.conf.destroy.call( dt.button(node), dt, $(node), button.conf );
		}

		this._removeKey( button.conf );

		$(button.node).remove();

		var idx = $.inArray( button, host );
		host.splice( idx, 1 );

		return this;
	},

	/**
	 * Get the text for a button
	 * @param  {int|string} node Button index
	 * @return {string} Button text
	 *//**
	 * Set the text for a button
	 * @param  {int|string|function} node Button index
	 * @param  {string} label Text
	 * @return {Buttons} Self for chaining
	 */
	text: function ( node, label )
	{
		var button = this._nodeToButton( node );
		var buttonLiner = this.c.dom.collection.buttonLiner;
		var linerTag = button.inCollection && buttonLiner && buttonLiner.tag ?
			buttonLiner.tag :
			this.c.dom.buttonLiner.tag;
		var dt = this.s.dt;
		var jqNode = $(button.node);
		var text = function ( opt ) {
			return typeof opt === 'function' ?
				opt( dt, jqNode, button.conf ) :
				opt;
		};

		if ( label === undefined ) {
			return text( button.conf.text );
		}

		button.conf.text = label;

		if ( linerTag ) {
			jqNode.children( linerTag ).html( text(label) );
		}
		else {
			jqNode.html( text(label) );
		}

		return this;
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Constructor
	 */

	/**
	 * Buttons constructor
	 * @private
	 */
	_constructor: function ()
	{
		var that = this;
		var dt = this.s.dt;
		var dtSettings = dt.settings()[0];
		var buttons =  this.c.buttons;

		if ( ! dtSettings._buttons ) {
			dtSettings._buttons = [];
		}

		dtSettings._buttons.push( {
			inst: this,
			name: this.c.name
		} );

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			this.add( buttons[i] );
		}

		dt.on( 'destroy', function ( e, settings ) {
			if ( settings === dtSettings ) {
				that.destroy();
			}
		} );

		// Global key event binding to listen for button keys
		$('body').on( 'keyup.'+this.s.namespace, function ( e ) {
			if ( ! document.activeElement || document.activeElement === document.body ) {
				// SUse a string of characters for fast lookup of if we need to
				// handle this
				var character = String.fromCharCode(e.keyCode).toLowerCase();

				if ( that.s.listenKeys.toLowerCase().indexOf( character ) !== -1 ) {
					that._keypress( character, e );
				}
			}
		} );
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods
	 */

	/**
	 * Add a new button to the key press listener
	 * @param {object} conf Resolved button configuration object
	 * @private
	 */
	_addKey: function ( conf )
	{
		if ( conf.key ) {
			this.s.listenKeys += $.isPlainObject( conf.key ) ?
				conf.key.key :
				conf.key;
		}
	},

	/**
	 * Insert the buttons into the container. Call without parameters!
	 * @param  {node} [container] Recursive only - Insert point
	 * @param  {array} [buttons] Recursive only - Buttons array
	 * @private
	 */
	_draw: function ( container, buttons )
	{
		if ( ! container ) {
			container = this.dom.container;
			buttons = this.s.buttons;
		}

		container.children().detach();

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			container.append( buttons[i].inserter );
			container.append( ' ' );

			if ( buttons[i].buttons && buttons[i].buttons.length ) {
				this._draw( buttons[i].collection, buttons[i].buttons );
			}
		}
	},

	/**
	 * Create buttons from an array of buttons
	 * @param  {array} attachTo Buttons array to attach to
	 * @param  {object} button Button definition
	 * @param  {boolean} inCollection true if the button is in a collection
	 * @private
	 */
	_expandButton: function ( attachTo, button, inCollection, attachPoint )
	{
		var dt = this.s.dt;
		var buttonCounter = 0;
		var buttons = ! Array.isArray( button ) ?
			[ button ] :
			button;

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			var conf = this._resolveExtends( buttons[i] );

			if ( ! conf ) {
				continue;
			}

			// If the configuration is an array, then expand the buttons at this
			// point
			if ( Array.isArray( conf ) ) {
				this._expandButton( attachTo, conf, inCollection, attachPoint );
				continue;
			}

			var built = this._buildButton( conf, inCollection );
			if ( ! built ) {
				continue;
			}

			if ( attachPoint !== undefined && attachPoint !== null ) {
				attachTo.splice( attachPoint, 0, built );
				attachPoint++;
			}
			else {
				attachTo.push( built );
			}

			if ( built.conf.buttons ) {
				built.collection = $('<'+this.c.dom.collection.tag+'/>');

				built.conf._collection = built.collection;

				this._expandButton( built.buttons, built.conf.buttons, true, attachPoint );
			}

			// init call is made here, rather than buildButton as it needs to
			// be selectable, and for that it needs to be in the buttons array
			if ( conf.init ) {
				conf.init.call( dt.button( built.node ), dt, $(built.node), conf );
			}

			buttonCounter++;
		}
	},

	/**
	 * Create an individual button
	 * @param  {object} config            Resolved button configuration
	 * @param  {boolean} inCollection `true` if a collection button
	 * @return {jQuery} Created button node (jQuery)
	 * @private
	 */
	_buildButton: function ( config, inCollection )
	{
		var buttonDom = this.c.dom.button;
		var linerDom = this.c.dom.buttonLiner;
		var collectionDom = this.c.dom.collection;
		var dt = this.s.dt;
		var text = function ( opt ) {
			return typeof opt === 'function' ?
				opt( dt, button, config ) :
				opt;
		};

		if ( inCollection && collectionDom.button ) {
			buttonDom = collectionDom.button;
		}

		if ( inCollection && collectionDom.buttonLiner ) {
			linerDom = collectionDom.buttonLiner;
		}

		// Make sure that the button is available based on whatever requirements
		// it has. For example, Flash buttons require Flash
		if ( config.available && ! config.available( dt, config ) ) {
			return false;
		}

		var action = function ( e, dt, button, config ) {
			config.action.call( dt.button( button ), e, dt, button, config );

			$(dt.table().node()).triggerHandler( 'buttons-action.dt', [
				dt.button( button ), dt, button, config 
			] );
		};

		var tag = config.tag || buttonDom.tag;
		var clickBlurs = config.clickBlurs === undefined ? true : config.clickBlurs
		var button = $('<'+tag+'/>')
			.addClass( buttonDom.className )
			.attr( 'tabindex', this.s.dt.settings()[0].iTabIndex )
			.attr( 'aria-controls', this.s.dt.table().node().id )
			.on( 'click.dtb', function (e) {
				e.preventDefault();

				if ( ! button.hasClass( buttonDom.disabled ) && config.action ) {
					action( e, dt, button, config );
				}
				if( clickBlurs ) {
					button.trigger('blur');
				}
			} )
			.on( 'keyup.dtb', function (e) {
				if ( e.keyCode === 13 ) {
					if ( ! button.hasClass( buttonDom.disabled ) && config.action ) {
						action( e, dt, button, config );
					}
				}
			} );

		// Make `a` tags act like a link
		if ( tag.toLowerCase() === 'a' ) {
			button.attr( 'href', '#' );
		}

		// Button tags should have `type=button` so they don't have any default behaviour
		if ( tag.toLowerCase() === 'button' ) {
			button.attr( 'type', 'button' );
		}

		if ( linerDom.tag ) {
			var liner = $('<'+linerDom.tag+'/>')
				.html( text( config.text ) )
				.addClass( linerDom.className );

			if ( linerDom.tag.toLowerCase() === 'a' ) {
				liner.attr( 'href', '#' );
			}

			button.append( liner );
		}
		else {
			button.html( text( config.text ) );
		}

		if ( config.enabled === false ) {
			button.addClass( buttonDom.disabled );
		}

		if ( config.className ) {
			button.addClass( config.className );
		}

		if ( config.titleAttr ) {
			button.attr( 'title', text( config.titleAttr ) );
		}

		if ( config.attr ) {
			button.attr( config.attr );
		}

		if ( ! config.namespace ) {
			config.namespace = '.dt-button-'+(_buttonCounter++);
		}

		var buttonContainer = this.c.dom.buttonContainer;
		var inserter;
		if ( buttonContainer && buttonContainer.tag ) {
			inserter = $('<'+buttonContainer.tag+'/>')
				.addClass( buttonContainer.className )
				.append( button );
		}
		else {
			inserter = button;
		}

		this._addKey( config );

		// Style integration callback for DOM manipulation
		// Note that this is _not_ documented. It is currently
		// for style integration only
		if( this.c.buttonCreated ) {
			inserter = this.c.buttonCreated( config, inserter );
		}

		return {
			conf:         config,
			node:         button.get(0),
			inserter:     inserter,
			buttons:      [],
			inCollection: inCollection,
			collection:   null
		};
	},

	/**
	 * Get the button object from a node (recursive)
	 * @param  {node} node Button node
	 * @param  {array} [buttons] Button array, uses base if not defined
	 * @return {object} Button object
	 * @private
	 */
	_nodeToButton: function ( node, buttons )
	{
		if ( ! buttons ) {
			buttons = this.s.buttons;
		}

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			if ( buttons[i].node === node ) {
				return buttons[i];
			}

			if ( buttons[i].buttons.length ) {
				var ret = this._nodeToButton( node, buttons[i].buttons );

				if ( ret ) {
					return ret;
				}
			}
		}
	},

	/**
	 * Get container array for a button from a button node (recursive)
	 * @param  {node} node Button node
	 * @param  {array} [buttons] Button array, uses base if not defined
	 * @return {array} Button's host array
	 * @private
	 */
	_nodeToHost: function ( node, buttons )
	{
		if ( ! buttons ) {
			buttons = this.s.buttons;
		}

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			if ( buttons[i].node === node ) {
				return buttons;
			}

			if ( buttons[i].buttons.length ) {
				var ret = this._nodeToHost( node, buttons[i].buttons );

				if ( ret ) {
					return ret;
				}
			}
		}
	},

	/**
	 * Handle a key press - determine if any button's key configured matches
	 * what was typed and trigger the action if so.
	 * @param  {string} character The character pressed
	 * @param  {object} e Key event that triggered this call
	 * @private
	 */
	_keypress: function ( character, e )
	{
		// Check if this button press already activated on another instance of Buttons
		if ( e._buttonsHandled ) {
			return;
		}

		var run = function ( conf, node ) {
			if ( ! conf.key ) {
				return;
			}

			if ( conf.key === character ) {
				e._buttonsHandled = true;
				$(node).click();
			}
			else if ( $.isPlainObject( conf.key ) ) {
				if ( conf.key.key !== character ) {
					return;
				}

				if ( conf.key.shiftKey && ! e.shiftKey ) {
					return;
				}

				if ( conf.key.altKey && ! e.altKey ) {
					return;
				}

				if ( conf.key.ctrlKey && ! e.ctrlKey ) {
					return;
				}

				if ( conf.key.metaKey && ! e.metaKey ) {
					return;
				}

				// Made it this far - it is good
				e._buttonsHandled = true;
				$(node).click();
			}
		};

		var recurse = function ( a ) {
			for ( var i=0, ien=a.length ; i<ien ; i++ ) {
				run( a[i].conf, a[i].node );

				if ( a[i].buttons.length ) {
					recurse( a[i].buttons );
				}
			}
		};

		recurse( this.s.buttons );
	},

	/**
	 * Remove a key from the key listener for this instance (to be used when a
	 * button is removed)
	 * @param  {object} conf Button configuration
	 * @private
	 */
	_removeKey: function ( conf )
	{
		if ( conf.key ) {
			var character = $.isPlainObject( conf.key ) ?
				conf.key.key :
				conf.key;

			// Remove only one character, as multiple buttons could have the
			// same listening key
			var a = this.s.listenKeys.split('');
			var idx = $.inArray( character, a );
			a.splice( idx, 1 );
			this.s.listenKeys = a.join('');
		}
	},

	/**
	 * Resolve a button configuration
	 * @param  {string|function|object} conf Button config to resolve
	 * @return {object} Button configuration
	 * @private
	 */
	_resolveExtends: function ( conf )
	{
		var dt = this.s.dt;
		var i, ien;
		var toConfObject = function ( base ) {
			var loop = 0;

			// Loop until we have resolved to a button configuration, or an
			// array of button configurations (which will be iterated
			// separately)
			while ( ! $.isPlainObject(base) && ! Array.isArray(base) ) {
				if ( base === undefined ) {
					return;
				}

				if ( typeof base === 'function' ) {
					base = base( dt, conf );

					if ( ! base ) {
						return false;
					}
				}
				else if ( typeof base === 'string' ) {
					if ( ! _dtButtons[ base ] ) {
						throw 'Unknown button type: '+base;
					}

					base = _dtButtons[ base ];
				}

				loop++;
				if ( loop > 30 ) {
					// Protect against misconfiguration killing the browser
					throw 'Buttons: Too many iterations';
				}
			}

			return Array.isArray( base ) ?
				base :
				$.extend( {}, base );
		};

		conf = toConfObject( conf );

		while ( conf && conf.extend ) {
			// Use `toConfObject` in case the button definition being extended
			// is itself a string or a function
			if ( ! _dtButtons[ conf.extend ] ) {
				throw 'Cannot extend unknown button type: '+conf.extend;
			}

			var objArray = toConfObject( _dtButtons[ conf.extend ] );
			if ( Array.isArray( objArray ) ) {
				return objArray;
			}
			else if ( ! objArray ) {
				// This is a little brutal as it might be possible to have a
				// valid button without the extend, but if there is no extend
				// then the host button would be acting in an undefined state
				return false;
			}

			// Stash the current class name
			var originalClassName = objArray.className;

			conf = $.extend( {}, objArray, conf );

			// The extend will have overwritten the original class name if the
			// `conf` object also assigned a class, but we want to concatenate
			// them so they are list that is combined from all extended buttons
			if ( originalClassName && conf.className !== originalClassName ) {
				conf.className = originalClassName+' '+conf.className;
			}

			// Buttons to be added to a collection  -gives the ability to define
			// if buttons should be added to the start or end of a collection
			var postfixButtons = conf.postfixButtons;
			if ( postfixButtons ) {
				if ( ! conf.buttons ) {
					conf.buttons = [];
				}

				for ( i=0, ien=postfixButtons.length ; i<ien ; i++ ) {
					conf.buttons.push( postfixButtons[i] );
				}

				conf.postfixButtons = null;
			}

			var prefixButtons = conf.prefixButtons;
			if ( prefixButtons ) {
				if ( ! conf.buttons ) {
					conf.buttons = [];
				}

				for ( i=0, ien=prefixButtons.length ; i<ien ; i++ ) {
					conf.buttons.splice( i, 0, prefixButtons[i] );
				}

				conf.prefixButtons = null;
			}

			// Although we want the `conf` object to overwrite almost all of
			// the properties of the object being extended, the `extend`
			// property should come from the object being extended
			conf.extend = objArray.extend;
		}

		return conf;
	},

	/**
	 * Display (and replace if there is an existing one) a popover attached to a button
	 * @param {string|node} content Content to show
	 * @param {DataTable.Api} hostButton DT API instance of the button
	 * @param {object} inOpts Options (see object below for all options)
	 */
	_popover: function ( content, hostButton, inOpts ) {
		var dt = hostButton;
		var buttonsSettings = this.c;
		var options = $.extend( {
			align: 'button-left', // button-right, dt-container
			autoClose: false,
			background: true,
			backgroundClassName: 'dt-button-background',
			contentClassName: buttonsSettings.dom.collection.className,
			collectionLayout: '',
			collectionTitle: '',
			dropup: false,
			fade: 400,
			rightAlignClassName: 'dt-button-right',
			tag: buttonsSettings.dom.collection.tag
		}, inOpts );
		var hostNode = hostButton.node();

		var close = function () {
			_fadeOut(
				$('.dt-button-collection'),
				options.fade,
				function () {
					$(this).detach();
				}
			);

			$(dt.buttons( '[aria-haspopup="true"][aria-expanded="true"]' ).nodes())
				.attr('aria-expanded', 'false');

			$('div.dt-button-background').off( 'click.dtb-collection' );
			Buttons.background( false, options.backgroundClassName, options.fade, hostNode );

			$('body').off( '.dtb-collection' );
			dt.off( 'buttons-action.b-internal' );
		};

		if (content === false) {
			close();
		}

		var existingExpanded = $(dt.buttons( '[aria-haspopup="true"][aria-expanded="true"]' ).nodes());
		if ( existingExpanded.length ) {
			hostNode = existingExpanded.eq(0);

			close();
		}

		var display = $('<div/>')
			.addClass('dt-button-collection')
			.addClass(options.collectionLayout)
			.css('display', 'none');

		content = $(content)
			.addClass(options.contentClassName)
			.attr('role', 'menu')
			.appendTo(display);

		hostNode.attr( 'aria-expanded', 'true' );

		if ( hostNode.parents('body')[0] !== document.body ) {
			hostNode = document.body.lastChild;
		}

		if ( options.collectionTitle ) {
			display.prepend('<div class="dt-button-collection-title">'+options.collectionTitle+'</div>');
		}

		_fadeIn( display.insertAfter( hostNode ), options.fade );

		var tableContainer = $( hostButton.table().container() );
		var position = display.css( 'position' );

		if ( options.align === 'dt-container' ) {
			hostNode = hostNode.parent();
			display.css('width', tableContainer.width());
		}

		// Align the popover relative to the DataTables container
		// Useful for wide popovers such as SearchPanes
		if (
			position === 'absolute' &&
			(
				display.hasClass( options.rightAlignClassName ) ||
				display.hasClass( options.leftAlignClassName ) ||
				options.align === 'dt-container'
			)
		) {

			var hostPosition = hostNode.position();

			display.css( {
				top: hostPosition.top + hostNode.outerHeight(),
				left: hostPosition.left
			} );

			// calculate overflow when positioned beneath
			var collectionHeight = display.outerHeight();
			var tableBottom = tableContainer.offset().top + tableContainer.height();
			var listBottom = hostPosition.top + hostNode.outerHeight() + collectionHeight;
			var bottomOverflow = listBottom - tableBottom;

			// calculate overflow when positioned above
			var listTop = hostPosition.top - collectionHeight;
			var tableTop = tableContainer.offset().top;
			var topOverflow = tableTop - listTop;

			// if bottom overflow is larger, move to the top because it fits better, or if dropup is requested
			var moveTop = hostPosition.top - collectionHeight - 5;
			if ( (bottomOverflow > topOverflow || options.dropup) && -moveTop < tableTop ) {
				display.css( 'top', moveTop);
			}

			// Get the size of the container (left and width - and thus also right)
			var tableLeft = tableContainer.offset().left;
			var tableWidth = tableContainer.width();
			var tableRight = tableLeft + tableWidth;

			// Get the size of the popover (left and width - and ...)
			var popoverLeft = display.offset().left;
			var popoverWidth = display.width();
			var popoverRight = popoverLeft + popoverWidth;

			// Get the size of the host buttons (left and width - and ...)
			var buttonsLeft = hostNode.offset().left;
			var buttonsWidth = hostNode.outerWidth()
			var buttonsRight = buttonsLeft + buttonsWidth;
			
			// You've then got all the numbers you need to do some calculations and if statements,
			//  so we can do some quick JS maths and apply it only once
			// If it has the right align class OR the buttons are right aligned OR the button container is floated right,
			//  then calculate left position for the popover to align the popover to the right hand
			//  side of the button - check to see if the left of the popover is inside the table container.
			// If not, move the popover so it is, but not more than it means that the popover is to the right of the table container
			var popoverShuffle = 0;
			if ( display.hasClass( options.rightAlignClassName )) {
				popoverShuffle = buttonsRight - popoverRight;
				if(tableLeft > (popoverLeft + popoverShuffle)){
					var leftGap = tableLeft - (popoverLeft + popoverShuffle);
					var rightGap = tableRight - (popoverRight + popoverShuffle);
	
					if(leftGap > rightGap){
						popoverShuffle += rightGap; 
					}
					else {
						popoverShuffle += leftGap;
					}
				}
			}
			// else attempt to left align the popover to the button. Similar to above, if the popover's right goes past the table container's right,
			//  then move it back, but not so much that it goes past the left of the table container
			else {
				popoverShuffle = tableLeft - popoverLeft;

				if(tableRight < (popoverRight + popoverShuffle)){
					var leftGap = tableLeft - (popoverLeft + popoverShuffle);
					var rightGap = tableRight - (popoverRight + popoverShuffle);

					if(leftGap > rightGap ){
						popoverShuffle += rightGap;
					}
					else {
						popoverShuffle += leftGap;
					}

				}
			}

			display.css('left', display.position().left + popoverShuffle);
			
		}
		else if (position === 'absolute') {
			// Align relative to the host button
			var hostPosition = hostNode.position();

			display.css( {
				top: hostPosition.top + hostNode.outerHeight(),
				left: hostPosition.left
			} );

			// calculate overflow when positioned beneath
			var collectionHeight = display.outerHeight();
			var top = hostNode.offset().top
			var popoverShuffle = 0;

			// Get the size of the host buttons (left and width - and ...)
			var buttonsLeft = hostNode.offset().left;
			var buttonsWidth = hostNode.outerWidth()
			var buttonsRight = buttonsLeft + buttonsWidth;

			// Get the size of the popover (left and width - and ...)
			var popoverLeft = display.offset().left;
			var popoverWidth = content.width();
			var popoverRight = popoverLeft + popoverWidth;

			var moveTop = hostPosition.top - collectionHeight - 5;
			var tableBottom = tableContainer.offset().top + tableContainer.height();
			var listBottom = hostPosition.top + hostNode.outerHeight() + collectionHeight;
			var bottomOverflow = listBottom - tableBottom;

			// calculate overflow when positioned above
			var listTop = hostPosition.top - collectionHeight;
			var tableTop = tableContainer.offset().top;
			var topOverflow = tableTop - listTop;

			if ( (bottomOverflow > topOverflow || options.dropup) && -moveTop < tableTop ) {
				display.css( 'top', moveTop);
			}

			popoverShuffle = options.align === 'button-right'
				? buttonsRight - popoverRight
				: buttonsLeft - popoverLeft;

			display.css('left', display.position().left + popoverShuffle);
		}
		else {
			// Fix position - centre on screen
			var top = display.height() / 2;
			if ( top > $(window).height() / 2 ) {
				top = $(window).height() / 2;
			}

			display.css( 'marginTop', top*-1 );
		}

		if ( options.background ) {
			Buttons.background( true, options.backgroundClassName, options.fade, hostNode );
		}

		// This is bonkers, but if we don't have a click listener on the
		// background element, iOS Safari will ignore the body click
		// listener below. An empty function here is all that is
		// required to make it work...
		$('div.dt-button-background').on( 'click.dtb-collection', function () {} );

		$('body')
			.on( 'click.dtb-collection', function (e) {
				// andSelf is deprecated in jQ1.8, but we want 1.7 compat
				var back = $.fn.addBack ? 'addBack' : 'andSelf';
				var parent = $(e.target).parent()[0];

				if (( ! $(e.target).parents()[back]().filter( content ).length  && !$(parent).hasClass('dt-buttons')) || $(e.target).hasClass('dt-button-background')) {
					close();
				}
			} )
			.on( 'keyup.dtb-collection', function (e) {
				if ( e.keyCode === 27 ) {
					close();
				}
			} );

		if ( options.autoClose ) {
			setTimeout( function () {
				dt.on( 'buttons-action.b-internal', function (e, btn, dt, node) {
					if ( node[0] === hostNode[0] ) {
						return;
					}
					close();
				} );
			}, 0);
		}

		$(display).trigger('buttons-popover.dt');
	}
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Statics
 */

/**
 * Show / hide a background layer behind a collection
 * @param  {boolean} Flag to indicate if the background should be shown or
 *   hidden 
 * @param  {string} Class to assign to the background
 * @static
 */
Buttons.background = function ( show, className, fade, insertPoint ) {
	if ( fade === undefined ) {
		fade = 400;
	}
	if ( ! insertPoint ) {
		insertPoint = document.body;
	}

	if ( show ) {
		_fadeIn(
			$('<div/>')
				.addClass( className )
				.css( 'display', 'none' )
				.insertAfter( insertPoint ),
			fade
		);
	}
	else {
		_fadeOut(
			$('div.'+className),
			fade,
			function () {
				$(this)
					.removeClass( className )
					.remove();
			}
		);
	}
};

/**
 * Instance selector - select Buttons instances based on an instance selector
 * value from the buttons assigned to a DataTable. This is only useful if
 * multiple instances are attached to a DataTable.
 * @param  {string|int|array} Instance selector - see `instance-selector`
 *   documentation on the DataTables site
 * @param  {array} Button instance array that was attached to the DataTables
 *   settings object
 * @return {array} Buttons instances
 * @static
 */
Buttons.instanceSelector = function ( group, buttons )
{
	if ( group === undefined || group === null ) {
		return $.map( buttons, function ( v ) {
			return v.inst;
		} );
	}

	var ret = [];
	var names = $.map( buttons, function ( v ) {
		return v.name;
	} );

	// Flatten the group selector into an array of single options
	var process = function ( input ) {
		if ( Array.isArray( input ) ) {
			for ( var i=0, ien=input.length ; i<ien ; i++ ) {
				process( input[i] );
			}
			return;
		}

		if ( typeof input === 'string' ) {
			if ( input.indexOf( ',' ) !== -1 ) {
				// String selector, list of names
				process( input.split(',') );
			}
			else {
				// String selector individual name
				var idx = $.inArray( input.trim(), names );

				if ( idx !== -1 ) {
					ret.push( buttons[ idx ].inst );
				}
			}
		}
		else if ( typeof input === 'number' ) {
			// Index selector
			ret.push( buttons[ input ].inst );
		}
	};
	
	process( group );

	return ret;
};

/**
 * Button selector - select one or more buttons from a selector input so some
 * operation can be performed on them.
 * @param  {array} Button instances array that the selector should operate on
 * @param  {string|int|node|jQuery|array} Button selector - see
 *   `button-selector` documentation on the DataTables site
 * @return {array} Array of objects containing `inst` and `idx` properties of
 *   the selected buttons so you know which instance each button belongs to.
 * @static
 */
Buttons.buttonSelector = function ( insts, selector )
{
	var ret = [];
	var nodeBuilder = function ( a, buttons, baseIdx ) {
		var button;
		var idx;

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			button = buttons[i];

			if ( button ) {
				idx = baseIdx !== undefined ?
					baseIdx+i :
					i+'';

				a.push( {
					node: button.node,
					name: button.conf.name,
					idx:  idx
				} );

				if ( button.buttons ) {
					nodeBuilder( a, button.buttons, idx+'-' );
				}
			}
		}
	};

	var run = function ( selector, inst ) {
		var i, ien;
		var buttons = [];
		nodeBuilder( buttons, inst.s.buttons );

		var nodes = $.map( buttons, function (v) {
			return v.node;
		} );

		if ( Array.isArray( selector ) || selector instanceof $ ) {
			for ( i=0, ien=selector.length ; i<ien ; i++ ) {
				run( selector[i], inst );
			}
			return;
		}

		if ( selector === null || selector === undefined || selector === '*' ) {
			// Select all
			for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
				ret.push( {
					inst: inst,
					node: buttons[i].node
				} );
			}
		}
		else if ( typeof selector === 'number' ) {
			// Main button index selector
			ret.push( {
				inst: inst,
				node: inst.s.buttons[ selector ].node
			} );
		}
		else if ( typeof selector === 'string' ) {
			if ( selector.indexOf( ',' ) !== -1 ) {
				// Split
				var a = selector.split(',');

				for ( i=0, ien=a.length ; i<ien ; i++ ) {
					run( a[i].trim(), inst );
				}
			}
			else if ( selector.match( /^\d+(\-\d+)*$/ ) ) {
				// Sub-button index selector
				var indexes = $.map( buttons, function (v) {
					return v.idx;
				} );

				ret.push( {
					inst: inst,
					node: buttons[ $.inArray( selector, indexes ) ].node
				} );
			}
			else if ( selector.indexOf( ':name' ) !== -1 ) {
				// Button name selector
				var name = selector.replace( ':name', '' );

				for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
					if ( buttons[i].name === name ) {
						ret.push( {
							inst: inst,
							node: buttons[i].node
						} );
					}
				}
			}
			else {
				// jQuery selector on the nodes
				$( nodes ).filter( selector ).each( function () {
					ret.push( {
						inst: inst,
						node: this
					} );
				} );
			}
		}
		else if ( typeof selector === 'object' && selector.nodeName ) {
			// Node selector
			var idx = $.inArray( selector, nodes );

			if ( idx !== -1 ) {
				ret.push( {
					inst: inst,
					node: nodes[ idx ]
				} );
			}
		}
	};


	for ( var i=0, ien=insts.length ; i<ien ; i++ ) {
		var inst = insts[i];

		run( selector, inst );
	}

	return ret;
};


/**
 * Buttons defaults. For full documentation, please refer to the docs/option
 * directory or the DataTables site.
 * @type {Object}
 * @static
 */
Buttons.defaults = {
	buttons: [ 'copy', 'excel', 'csv', 'pdf', 'print' ],
	name: 'main',
	tabIndex: 0,
	dom: {
		container: {
			tag: 'div',
			className: 'dt-buttons'
		},
		collection: {
			tag: 'div',
			className: ''
		},
		button: {
			// Flash buttons will not work with `<button>` in IE - it has to be `<a>`
			tag: 'ActiveXObject' in window ?
				'a' :
				'button',
			className: 'dt-button',
			active: 'active',
			disabled: 'disabled'
		},
		buttonLiner: {
			tag: 'span',
			className: ''
		}
	}
};

/**
 * Version information
 * @type {string}
 * @static
 */
Buttons.version = '1.6.5';


$.extend( _dtButtons, {
	collection: {
		text: function ( dt ) {
			return dt.i18n( 'buttons.collection', 'Collection' );
		},
		className: 'buttons-collection',
		init: function ( dt, button, config ) {
			button.attr( 'aria-expanded', false );
		},
		action: function ( e, dt, button, config ) {
			e.stopPropagation();

			if ( config._collection.parents('body').length ) {
				this.popover(false, config);
			}
			else {
				this.popover(config._collection, config);
			}
		},
		attr: {
			'aria-haspopup': true
		}
		// Also the popover options, defined in Buttons.popover
	},
	copy: function ( dt, conf ) {
		if ( _dtButtons.copyHtml5 ) {
			return 'copyHtml5';
		}
		if ( _dtButtons.copyFlash && _dtButtons.copyFlash.available( dt, conf ) ) {
			return 'copyFlash';
		}
	},
	csv: function ( dt, conf ) {
		// Common option that will use the HTML5 or Flash export buttons
		if ( _dtButtons.csvHtml5 && _dtButtons.csvHtml5.available( dt, conf ) ) {
			return 'csvHtml5';
		}
		if ( _dtButtons.csvFlash && _dtButtons.csvFlash.available( dt, conf ) ) {
			return 'csvFlash';
		}
	},
	excel: function ( dt, conf ) {
		// Common option that will use the HTML5 or Flash export buttons
		if ( _dtButtons.excelHtml5 && _dtButtons.excelHtml5.available( dt, conf ) ) {
			return 'excelHtml5';
		}
		if ( _dtButtons.excelFlash && _dtButtons.excelFlash.available( dt, conf ) ) {
			return 'excelFlash';
		}
	},
	pdf: function ( dt, conf ) {
		// Common option that will use the HTML5 or Flash export buttons
		if ( _dtButtons.pdfHtml5 && _dtButtons.pdfHtml5.available( dt, conf ) ) {
			return 'pdfHtml5';
		}
		if ( _dtButtons.pdfFlash && _dtButtons.pdfFlash.available( dt, conf ) ) {
			return 'pdfFlash';
		}
	},
	pageLength: function ( dt ) {
		var lengthMenu = dt.settings()[0].aLengthMenu;
		var vals = Array.isArray( lengthMenu[0] ) ? lengthMenu[0] : lengthMenu;
		var lang = Array.isArray( lengthMenu[0] ) ? lengthMenu[1] : lengthMenu;
		var text = function ( dt ) {
			return dt.i18n( 'buttons.pageLength', {
				"-1": 'Show all rows',
				_:    'Show %d rows'
			}, dt.page.len() );
		};

		return {
			extend: 'collection',
			text: text,
			className: 'buttons-page-length',
			autoClose: true,
			buttons: $.map( vals, function ( val, i ) {
				return {
					text: lang[i],
					className: 'button-page-length',
					action: function ( e, dt ) {
						dt.page.len( val ).draw();
					},
					init: function ( dt, node, conf ) {
						var that = this;
						var fn = function () {
							that.active( dt.page.len() === val );
						};

						dt.on( 'length.dt'+conf.namespace, fn );
						fn();
					},
					destroy: function ( dt, node, conf ) {
						dt.off( 'length.dt'+conf.namespace );
					}
				};
			} ),
			init: function ( dt, node, conf ) {
				var that = this;
				dt.on( 'length.dt'+conf.namespace, function () {
					that.text( conf.text );
				} );
			},
			destroy: function ( dt, node, conf ) {
				dt.off( 'length.dt'+conf.namespace );
			}
		};
	}
} );


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables API
 *
 * For complete documentation, please refer to the docs/api directory or the
 * DataTables site
 */

// Buttons group and individual button selector
DataTable.Api.register( 'buttons()', function ( group, selector ) {
	// Argument shifting
	if ( selector === undefined ) {
		selector = group;
		group = undefined;
	}

	this.selector.buttonGroup = group;

	var res = this.iterator( true, 'table', function ( ctx ) {
		if ( ctx._buttons ) {
			return Buttons.buttonSelector(
				Buttons.instanceSelector( group, ctx._buttons ),
				selector
			);
		}
	}, true );

	res._groupSelector = group;
	return res;
} );

// Individual button selector
DataTable.Api.register( 'button()', function ( group, selector ) {
	// just run buttons() and truncate
	var buttons = this.buttons( group, selector );

	if ( buttons.length > 1 ) {
		buttons.splice( 1, buttons.length );
	}

	return buttons;
} );

// Active buttons
DataTable.Api.registerPlural( 'buttons().active()', 'button().active()', function ( flag ) {
	if ( flag === undefined ) {
		return this.map( function ( set ) {
			return set.inst.active( set.node );
		} );
	}

	return this.each( function ( set ) {
		set.inst.active( set.node, flag );
	} );
} );

// Get / set button action
DataTable.Api.registerPlural( 'buttons().action()', 'button().action()', function ( action ) {
	if ( action === undefined ) {
		return this.map( function ( set ) {
			return set.inst.action( set.node );
		} );
	}

	return this.each( function ( set ) {
		set.inst.action( set.node, action );
	} );
} );

// Enable / disable buttons
DataTable.Api.register( ['buttons().enable()', 'button().enable()'], function ( flag ) {
	return this.each( function ( set ) {
		set.inst.enable( set.node, flag );
	} );
} );

// Disable buttons
DataTable.Api.register( ['buttons().disable()', 'button().disable()'], function () {
	return this.each( function ( set ) {
		set.inst.disable( set.node );
	} );
} );

// Get button nodes
DataTable.Api.registerPlural( 'buttons().nodes()', 'button().node()', function () {
	var jq = $();

	// jQuery will automatically reduce duplicates to a single entry
	$( this.each( function ( set ) {
		jq = jq.add( set.inst.node( set.node ) );
	} ) );

	return jq;
} );

// Get / set button processing state
DataTable.Api.registerPlural( 'buttons().processing()', 'button().processing()', function ( flag ) {
	if ( flag === undefined ) {
		return this.map( function ( set ) {
			return set.inst.processing( set.node );
		} );
	}

	return this.each( function ( set ) {
		set.inst.processing( set.node, flag );
	} );
} );

// Get / set button text (i.e. the button labels)
DataTable.Api.registerPlural( 'buttons().text()', 'button().text()', function ( label ) {
	if ( label === undefined ) {
		return this.map( function ( set ) {
			return set.inst.text( set.node );
		} );
	}

	return this.each( function ( set ) {
		set.inst.text( set.node, label );
	} );
} );

// Trigger a button's action
DataTable.Api.registerPlural( 'buttons().trigger()', 'button().trigger()', function () {
	return this.each( function ( set ) {
		set.inst.node( set.node ).trigger( 'click' );
	} );
} );

// Button resolver to the popover
DataTable.Api.register( 'button().popover()', function (content, options) {
	return this.map( function ( set ) {
		return set.inst._popover( content, this.button(this[0].node), options );
	} );
} );

// Get the container elements
DataTable.Api.register( 'buttons().containers()', function () {
	var jq = $();
	var groupSelector = this._groupSelector;

	// We need to use the group selector directly, since if there are no buttons
	// the result set will be empty
	this.iterator( true, 'table', function ( ctx ) {
		if ( ctx._buttons ) {
			var insts = Buttons.instanceSelector( groupSelector, ctx._buttons );

			for ( var i=0, ien=insts.length ; i<ien ; i++ ) {
				jq = jq.add( insts[i].container() );
			}
		}
	} );

	return jq;
} );

DataTable.Api.register( 'buttons().container()', function () {
	// API level of nesting is `buttons()` so we can zip into the containers method
	return this.containers().eq(0);
} );

// Add a new button
DataTable.Api.register( 'button().add()', function ( idx, conf ) {
	var ctx = this.context;

	// Don't use `this` as it could be empty - select the instances directly
	if ( ctx.length ) {
		var inst = Buttons.instanceSelector( this._groupSelector, ctx[0]._buttons );

		if ( inst.length ) {
			inst[0].add( conf, idx );
		}
	}

	return this.button( this._groupSelector, idx );
} );

// Destroy the button sets selected
DataTable.Api.register( 'buttons().destroy()', function () {
	this.pluck( 'inst' ).unique().each( function ( inst ) {
		inst.destroy();
	} );

	return this;
} );

// Remove a button
DataTable.Api.registerPlural( 'buttons().remove()', 'buttons().remove()', function () {
	this.each( function ( set ) {
		set.inst.remove( set.node );
	} );

	return this;
} );

// Information box that can be used by buttons
var _infoTimer;
DataTable.Api.register( 'buttons.info()', function ( title, message, time ) {
	var that = this;

	if ( title === false ) {
		this.off('destroy.btn-info');
		_fadeOut(
			$('#datatables_buttons_info'),
			400,
			function () {
				$(this).remove();
			}
		);
		clearTimeout( _infoTimer );
		_infoTimer = null;

		return this;
	}

	if ( _infoTimer ) {
		clearTimeout( _infoTimer );
	}

	if ( $('#datatables_buttons_info').length ) {
		$('#datatables_buttons_info').remove();
	}

	title = title ? '<h2>'+title+'</h2>' : '';

	_fadeIn(
		$('<div id="datatables_buttons_info" class="dt-button-info"/>')
			.html( title )
			.append( $('<div/>')[ typeof message === 'string' ? 'html' : 'append' ]( message ) )
			.css( 'display', 'none' )
			.appendTo( 'body' )
	);

	if ( time !== undefined && time !== 0 ) {
		_infoTimer = setTimeout( function () {
			that.buttons.info( false );
		}, time );
	}

	this.on('destroy.btn-info', function () {
		that.buttons.info(false);
	});

	return this;
} );

// Get data from the table for export - this is common to a number of plug-in
// buttons so it is included in the Buttons core library
DataTable.Api.register( 'buttons.exportData()', function ( options ) {
	if ( this.context.length ) {
		return _exportData( new DataTable.Api( this.context[0] ), options );
	}
} );

// Get information about the export that is common to many of the export data
// types (DRY)
DataTable.Api.register( 'buttons.exportInfo()', function ( conf ) {
	if ( ! conf ) {
		conf = {};
	}

	return {
		filename: _filename( conf ),
		title: _title( conf ),
		messageTop: _message(this, conf.message || conf.messageTop, 'top'),
		messageBottom: _message(this, conf.messageBottom, 'bottom')
	};
} );



/**
 * Get the file name for an exported file.
 *
 * @param {object}	config Button configuration
 * @param {boolean} incExtension Include the file name extension
 */
var _filename = function ( config )
{
	// Backwards compatibility
	var filename = config.filename === '*' && config.title !== '*' && config.title !== undefined && config.title !== null && config.title !== '' ?
		config.title :
		config.filename;

	if ( typeof filename === 'function' ) {
		filename = filename();
	}

	if ( filename === undefined || filename === null ) {
		return null;
	}

	if ( filename.indexOf( '*' ) !== -1 ) {
		filename = filename.replace( '*', $('head > title').text() ).trim();
	}

	// Strip characters which the OS will object to
	filename = filename.replace(/[^a-zA-Z0-9_\u00A1-\uFFFF\.,\-_ !\(\)]/g, "");

	var extension = _stringOrFunction( config.extension );
	if ( ! extension ) {
		extension = '';
	}

	return filename + extension;
};

/**
 * Simply utility method to allow parameters to be given as a function
 *
 * @param {undefined|string|function} option Option
 * @return {null|string} Resolved value
 */
var _stringOrFunction = function ( option )
{
	if ( option === null || option === undefined ) {
		return null;
	}
	else if ( typeof option === 'function' ) {
		return option();
	}
	return option;
};

/**
 * Get the title for an exported file.
 *
 * @param {object} config	Button configuration
 */
var _title = function ( config )
{
	var title = _stringOrFunction( config.title );

	return title === null ?
		null : title.indexOf( '*' ) !== -1 ?
			title.replace( '*', $('head > title').text() || 'Exported data' ) :
			title;
};

var _message = function ( dt, option, position )
{
	var message = _stringOrFunction( option );
	if ( message === null ) {
		return null;
	}

	var caption = $('caption', dt.table().container()).eq(0);
	if ( message === '*' ) {
		var side = caption.css( 'caption-side' );
		if ( side !== position ) {
			return null;
		}

		return caption.length ?
			caption.text() :
			'';
	}

	return message;
};







var _exportTextarea = $('<textarea/>')[0];
var _exportData = function ( dt, inOpts )
{
	var config = $.extend( true, {}, {
		rows:           null,
		columns:        '',
		modifier:       {
			search: 'applied',
			order:  'applied'
		},
		orthogonal:     'display',
		stripHtml:      true,
		stripNewlines:  true,
		decodeEntities: true,
		trim:           true,
		format:         {
			header: function ( d ) {
				return strip( d );
			},
			footer: function ( d ) {
				return strip( d );
			},
			body: function ( d ) {
				return strip( d );
			}
		},
		customizeData: null
	}, inOpts );

	var strip = function ( str ) {
		if ( typeof str !== 'string' ) {
			return str;
		}

		// Always remove script tags
		str = str.replace( /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '' );

		// Always remove comments
		str = str.replace( /<!\-\-.*?\-\->/g, '' );

		if ( config.stripHtml ) {
			str = str.replace( /<([^>'"]*('[^']*'|"[^"]*")?)*>/g, '' );
		}

		if ( config.trim ) {
			str = str.replace( /^\s+|\s+$/g, '' );
		}

		if ( config.stripNewlines ) {
			str = str.replace( /\n/g, ' ' );
		}

		if ( config.decodeEntities ) {
			_exportTextarea.innerHTML = str;
			str = _exportTextarea.value;
		}

		return str;
	};


	var header = dt.columns( config.columns ).indexes().map( function (idx) {
		var el = dt.column( idx ).header();
		return config.format.header( el.innerHTML, idx, el );
	} ).toArray();

	var footer = dt.table().footer() ?
		dt.columns( config.columns ).indexes().map( function (idx) {
			var el = dt.column( idx ).footer();
			return config.format.footer( el ? el.innerHTML : '', idx, el );
		} ).toArray() :
		null;
	
	// If Select is available on this table, and any rows are selected, limit the export
	// to the selected rows. If no rows are selected, all rows will be exported. Specify
	// a `selected` modifier to control directly.
	var modifier = $.extend( {}, config.modifier );
	if ( dt.select && typeof dt.select.info === 'function' && modifier.selected === undefined ) {
		if ( dt.rows( config.rows, $.extend( { selected: true }, modifier ) ).any() ) {
			$.extend( modifier, { selected: true } )
		}
	}

	var rowIndexes = dt.rows( config.rows, modifier ).indexes().toArray();
	var selectedCells = dt.cells( rowIndexes, config.columns );
	var cells = selectedCells
		.render( config.orthogonal )
		.toArray();
	var cellNodes = selectedCells
		.nodes()
		.toArray();

	var columns = header.length;
	var rows = columns > 0 ? cells.length / columns : 0;
	var body = [];
	var cellCounter = 0;

	for ( var i=0, ien=rows ; i<ien ; i++ ) {
		var row = [ columns ];

		for ( var j=0 ; j<columns ; j++ ) {
			row[j] = config.format.body( cells[ cellCounter ], i, j, cellNodes[ cellCounter ] );
			cellCounter++;
		}

		body[i] = row;
	}

	var data = {
		header: header,
		footer: footer,
		body:   body
	};

	if ( config.customizeData ) {
		config.customizeData( data );
	}

	return data;
};


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables interface
 */

// Attach to DataTables objects for global access
$.fn.dataTable.Buttons = Buttons;
$.fn.DataTable.Buttons = Buttons;



// DataTables creation - check if the buttons have been defined for this table,
// they will have been if the `B` option was used in `dom`, otherwise we should
// create the buttons instance here so they can be inserted into the document
// using the API. Listen for `init` for compatibility with pre 1.10.10, but to
// be removed in future.
$(document).on( 'init.dt plugin-init.dt', function (e, settings) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	var opts = settings.oInit.buttons || DataTable.defaults.buttons;

	if ( opts && ! settings._buttons ) {
		new Buttons( settings, opts ).container();
	}
} );

function _init ( settings, options ) {
	var api = new DataTable.Api( settings );
	var opts = options
		? options
		: api.init().buttons || DataTable.defaults.buttons;

	return new Buttons( api, opts ).container();
}

// DataTables `dom` feature option
DataTable.ext.feature.push( {
	fnInit: _init,
	cFeature: "B"
} );

// DataTables 2 layout feature
if ( DataTable.ext.features ) {
	DataTable.ext.features.register( 'buttons', _init );
}


return Buttons;
}));


/*! Select for DataTables 1.3.1
 * 2015-2019 SpryMedia Ltd - datatables.net/license/mit
 */

/**
 * @summary     Select for DataTables
 * @description A collection of API methods, events and buttons for DataTables
 *   that provides selection options of the items in a DataTable
 * @version     1.3.1
 * @file        dataTables.select.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     datatables.net/forums
 * @copyright   Copyright 2015-2019 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net/extensions/select
 */
(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


// Version information for debugger
DataTable.select = {};

DataTable.select.version = '1.3.1';

DataTable.select.init = function ( dt ) {
	var ctx = dt.settings()[0];
	var init = ctx.oInit.select;
	var defaults = DataTable.defaults.select;
	var opts = init === undefined ?
		defaults :
		init;

	// Set defaults
	var items = 'row';
	var style = 'api';
	var blurable = false;
	var toggleable = true;
	var info = true;
	var selector = 'td, th';
	var className = 'selected';
	var setStyle = false;

	ctx._select = {};

	// Initialisation customisations
	if ( opts === true ) {
		style = 'os';
		setStyle = true;
	}
	else if ( typeof opts === 'string' ) {
		style = opts;
		setStyle = true;
	}
	else if ( $.isPlainObject( opts ) ) {
		if ( opts.blurable !== undefined ) {
			blurable = opts.blurable;
		}
		
		if ( opts.toggleable !== undefined ) {
			toggleable = opts.toggleable;
		}

		if ( opts.info !== undefined ) {
			info = opts.info;
		}

		if ( opts.items !== undefined ) {
			items = opts.items;
		}

		if ( opts.style !== undefined ) {
			style = opts.style;
			setStyle = true;
		}
		else {
			style = 'os';
			setStyle = true;
		}

		if ( opts.selector !== undefined ) {
			selector = opts.selector;
		}

		if ( opts.className !== undefined ) {
			className = opts.className;
		}
	}

	dt.select.selector( selector );
	dt.select.items( items );
	dt.select.style( style );
	dt.select.blurable( blurable );
	dt.select.toggleable( toggleable );
	dt.select.info( info );
	ctx._select.className = className;


	// Sort table based on selected rows. Requires Select Datatables extension
	$.fn.dataTable.ext.order['select-checkbox'] = function ( settings, col ) {
		return this.api().column( col, {order: 'index'} ).nodes().map( function ( td ) {
			if ( settings._select.items === 'row' ) {
				return $( td ).parent().hasClass( settings._select.className );
			} else if ( settings._select.items === 'cell' ) {
				return $( td ).hasClass( settings._select.className );
			}
			return false;
		});
	};

	// If the init options haven't enabled select, but there is a selectable
	// class name, then enable
	if ( ! setStyle && $( dt.table().node() ).hasClass( 'selectable' ) ) {
		dt.select.style( 'os' );
	}
};

/*

Select is a collection of API methods, event handlers, event emitters and
buttons (for the `Buttons` extension) for DataTables. It provides the following
features, with an overview of how they are implemented:

## Selection of rows, columns and cells. Whether an item is selected or not is
   stored in:

* rows: a `_select_selected` property which contains a boolean value of the
  DataTables' `aoData` object for each row
* columns: a `_select_selected` property which contains a boolean value of the
  DataTables' `aoColumns` object for each column
* cells: a `_selected_cells` property which contains an array of boolean values
  of the `aoData` object for each row. The array is the same length as the
  columns array, with each element of it representing a cell.

This method of using boolean flags allows Select to operate when nodes have not
been created for rows / cells (DataTables' defer rendering feature).

## API methods

A range of API methods are available for triggering selection and de-selection
of rows. Methods are also available to configure the selection events that can
be triggered by an end user (such as which items are to be selected). To a large
extent, these of API methods *is* Select. It is basically a collection of helper
functions that can be used to select items in a DataTable.

Configuration of select is held in the object `_select` which is attached to the
DataTables settings object on initialisation. Select being available on a table
is not optional when Select is loaded, but its default is for selection only to
be available via the API - so the end user wouldn't be able to select rows
without additional configuration.

The `_select` object contains the following properties:

```
{
	items:string       - Can be `rows`, `columns` or `cells`. Defines what item 
	                     will be selected if the user is allowed to activate row
	                     selection using the mouse.
	style:string       - Can be `none`, `single`, `multi` or `os`. Defines the
	                     interaction style when selecting items
	blurable:boolean   - If row selection can be cleared by clicking outside of
	                     the table
	toggleable:boolean - If row selection can be cancelled by repeated clicking
	                     on the row
	info:boolean       - If the selection summary should be shown in the table
	                     information elements
}
```

In addition to the API methods, Select also extends the DataTables selector
options for rows, columns and cells adding a `selected` option to the selector
options object, allowing the developer to select only selected items or
unselected items.

## Mouse selection of items

Clicking on items can be used to select items. This is done by a simple event
handler that will select the items using the API methods.

 */


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Local functions
 */

/**
 * Add one or more cells to the selection when shift clicking in OS selection
 * style cell selection.
 *
 * Cell range is more complicated than row and column as we want to select
 * in the visible grid rather than by index in sequence. For example, if you
 * click first in cell 1-1 and then shift click in 2-2 - cells 1-2 and 2-1
 * should also be selected (and not 1-3, 1-4. etc)
 * 
 * @param  {DataTable.Api} dt   DataTable
 * @param  {object}        idx  Cell index to select to
 * @param  {object}        last Cell index to select from
 * @private
 */
function cellRange( dt, idx, last )
{
	var indexes;
	var columnIndexes;
	var rowIndexes;
	var selectColumns = function ( start, end ) {
		if ( start > end ) {
			var tmp = end;
			end = start;
			start = tmp;
		}
		
		var record = false;
		return dt.columns( ':visible' ).indexes().filter( function (i) {
			if ( i === start ) {
				record = true;
			}
			
			if ( i === end ) { // not else if, as start might === end
				record = false;
				return true;
			}

			return record;
		} );
	};

	var selectRows = function ( start, end ) {
		var indexes = dt.rows( { search: 'applied' } ).indexes();

		// Which comes first - might need to swap
		if ( indexes.indexOf( start ) > indexes.indexOf( end ) ) {
			var tmp = end;
			end = start;
			start = tmp;
		}

		var record = false;
		return indexes.filter( function (i) {
			if ( i === start ) {
				record = true;
			}
			
			if ( i === end ) {
				record = false;
				return true;
			}

			return record;
		} );
	};

	if ( ! dt.cells( { selected: true } ).any() && ! last ) {
		// select from the top left cell to this one
		columnIndexes = selectColumns( 0, idx.column );
		rowIndexes = selectRows( 0 , idx.row );
	}
	else {
		// Get column indexes between old and new
		columnIndexes = selectColumns( last.column, idx.column );
		rowIndexes = selectRows( last.row , idx.row );
	}

	indexes = dt.cells( rowIndexes, columnIndexes ).flatten();

	if ( ! dt.cells( idx, { selected: true } ).any() ) {
		// Select range
		dt.cells( indexes ).select();
	}
	else {
		// Deselect range
		dt.cells( indexes ).deselect();
	}
}

/**
 * Disable mouse selection by removing the selectors
 *
 * @param {DataTable.Api} dt DataTable to remove events from
 * @private
 */
function disableMouseSelection( dt )
{
	var ctx = dt.settings()[0];
	var selector = ctx._select.selector;

	$( dt.table().container() )
		.off( 'mousedown.dtSelect', selector )
		.off( 'mouseup.dtSelect', selector )
		.off( 'click.dtSelect', selector );

	$('body').off( 'click.dtSelect' + _safeId(dt.table().node()) );
}

/**
 * Attach mouse listeners to the table to allow mouse selection of items
 *
 * @param {DataTable.Api} dt DataTable to remove events from
 * @private
 */
function enableMouseSelection ( dt )
{
	var container = $( dt.table().container() );
	var ctx = dt.settings()[0];
	var selector = ctx._select.selector;
	var matchSelection;

	container
		.on( 'mousedown.dtSelect', selector, function(e) {
			// Disallow text selection for shift clicking on the table so multi
			// element selection doesn't look terrible!
			if ( e.shiftKey || e.metaKey || e.ctrlKey ) {
				container
					.css( '-moz-user-select', 'none' )
					.one('selectstart.dtSelect', selector, function () {
						return false;
					} );
			}

			if ( window.getSelection ) {
				matchSelection = window.getSelection();
			}
		} )
		.on( 'mouseup.dtSelect', selector, function() {
			// Allow text selection to occur again, Mozilla style (tested in FF
			// 35.0.1 - still required)
			container.css( '-moz-user-select', '' );
		} )
		.on( 'click.dtSelect', selector, function ( e ) {
			var items = dt.select.items();
			var idx;

			// If text was selected (click and drag), then we shouldn't change
			// the row's selected state
			if ( matchSelection ) {
				var selection = window.getSelection();

				// If the element that contains the selection is not in the table, we can ignore it
				// This can happen if the developer selects text from the click event
				if ( ! selection.anchorNode || $(selection.anchorNode).closest('table')[0] === dt.table().node() ) {
					if ( selection !== matchSelection ) {
						return;
					}
				}
			}

			var ctx = dt.settings()[0];
			var wrapperClass = $.trim(dt.settings()[0].oClasses.sWrapper).replace(/ +/g, '.');

			// Ignore clicks inside a sub-table
			if ( $(e.target).closest('div.'+wrapperClass)[0] != dt.table().container() ) {
				return;
			}

			var cell = dt.cell( $(e.target).closest('td, th') );

			// Check the cell actually belongs to the host DataTable (so child
			// rows, etc, are ignored)
			if ( ! cell.any() ) {
				return;
			}

			var event = $.Event('user-select.dt');
			eventTrigger( dt, event, [ items, cell, e ] );

			if ( event.isDefaultPrevented() ) {
				return;
			}

			var cellIndex = cell.index();
			if ( items === 'row' ) {
				idx = cellIndex.row;
				typeSelect( e, dt, ctx, 'row', idx );
			}
			else if ( items === 'column' ) {
				idx = cell.index().column;
				typeSelect( e, dt, ctx, 'column', idx );
			}
			else if ( items === 'cell' ) {
				idx = cell.index();
				typeSelect( e, dt, ctx, 'cell', idx );
			}

			ctx._select_lastCell = cellIndex;
		} );

	// Blurable
	$('body').on( 'click.dtSelect' + _safeId(dt.table().node()), function ( e ) {
		if ( ctx._select.blurable ) {
			// If the click was inside the DataTables container, don't blur
			if ( $(e.target).parents().filter( dt.table().container() ).length ) {
				return;
			}

			// Ignore elements which have been removed from the DOM (i.e. paging
			// buttons)
			if ( $(e.target).parents('html').length === 0 ) {
			 	return;
			}

			// Don't blur in Editor form
			if ( $(e.target).parents('div.DTE').length ) {
				return;
			}

			clear( ctx, true );
		}
	} );
}

/**
 * Trigger an event on a DataTable
 *
 * @param {DataTable.Api} api      DataTable to trigger events on
 * @param  {boolean}      selected true if selected, false if deselected
 * @param  {string}       type     Item type acting on
 * @param  {boolean}      any      Require that there are values before
 *     triggering
 * @private
 */
function eventTrigger ( api, type, args, any )
{
	if ( any && ! api.flatten().length ) {
		return;
	}

	if ( typeof type === 'string' ) {
		type = type +'.dt';
	}

	args.unshift( api );

	$(api.table().node()).trigger( type, args );
}

/**
 * Update the information element of the DataTable showing information about the
 * items selected. This is done by adding tags to the existing text
 * 
 * @param {DataTable.Api} api DataTable to update
 * @private
 */
function info ( api )
{
	var ctx = api.settings()[0];

	if ( ! ctx._select.info || ! ctx.aanFeatures.i ) {
		return;
	}

	if ( api.select.style() === 'api' ) {
		return;
	}

	var rows    = api.rows( { selected: true } ).flatten().length;
	var columns = api.columns( { selected: true } ).flatten().length;
	var cells   = api.cells( { selected: true } ).flatten().length;

	var add = function ( el, name, num ) {
		el.append( $('<span class="select-item"/>').append( api.i18n(
			'select.'+name+'s',
			{ _: '%d '+name+'s selected', 0: '', 1: '1 '+name+' selected' },
			num
		) ) );
	};

	// Internal knowledge of DataTables to loop over all information elements
	$.each( ctx.aanFeatures.i, function ( i, el ) {
		el = $(el);

		var output  = $('<span class="select-info"/>');
		add( output, 'row', rows );
		add( output, 'column', columns );
		add( output, 'cell', cells  );

		var exisiting = el.children('span.select-info');
		if ( exisiting.length ) {
			exisiting.remove();
		}

		if ( output.text() !== '' ) {
			el.append( output );
		}
	} );
}

/**
 * Initialisation of a new table. Attach event handlers and callbacks to allow
 * Select to operate correctly.
 *
 * This will occur _after_ the initial DataTables initialisation, although
 * before Ajax data is rendered, if there is ajax data
 *
 * @param  {DataTable.settings} ctx Settings object to operate on
 * @private
 */
function init ( ctx ) {
	var api = new DataTable.Api( ctx );

	// Row callback so that classes can be added to rows and cells if the item
	// was selected before the element was created. This will happen with the
	// `deferRender` option enabled.
	// 
	// This method of attaching to `aoRowCreatedCallback` is a hack until
	// DataTables has proper events for row manipulation If you are reviewing
	// this code to create your own plug-ins, please do not do this!
	ctx.aoRowCreatedCallback.push( {
		fn: function ( row, data, index ) {
			var i, ien;
			var d = ctx.aoData[ index ];

			// Row
			if ( d._select_selected ) {
				$( row ).addClass( ctx._select.className );
			}

			// Cells and columns - if separated out, we would need to do two
			// loops, so it makes sense to combine them into a single one
			for ( i=0, ien=ctx.aoColumns.length ; i<ien ; i++ ) {
				if ( ctx.aoColumns[i]._select_selected || (d._selected_cells && d._selected_cells[i]) ) {
					$(d.anCells[i]).addClass( ctx._select.className );
				}
			}
		},
		sName: 'select-deferRender'
	} );

	// On Ajax reload we want to reselect all rows which are currently selected,
	// if there is an rowId (i.e. a unique value to identify each row with)
	api.on( 'preXhr.dt.dtSelect', function () {
		// note that column selection doesn't need to be cached and then
		// reselected, as they are already selected
		var rows = api.rows( { selected: true } ).ids( true ).filter( function ( d ) {
			return d !== undefined;
		} );

		var cells = api.cells( { selected: true } ).eq(0).map( function ( cellIdx ) {
			var id = api.row( cellIdx.row ).id( true );
			return id ?
				{ row: id, column: cellIdx.column } :
				undefined;
		} ).filter( function ( d ) {
			return d !== undefined;
		} );

		// On the next draw, reselect the currently selected items
		api.one( 'draw.dt.dtSelect', function () {
			api.rows( rows ).select();

			// `cells` is not a cell index selector, so it needs a loop
			if ( cells.any() ) {
				cells.each( function ( id ) {
					api.cells( id.row, id.column ).select();
				} );
			}
		} );
	} );

	// Update the table information element with selected item summary
	api.on( 'draw.dtSelect.dt select.dtSelect.dt deselect.dtSelect.dt info.dt', function () {
		info( api );
	} );

	// Clean up and release
	api.on( 'destroy.dtSelect', function () {
		disableMouseSelection( api );
		api.off( '.dtSelect' );
	} );
}

/**
 * Add one or more items (rows or columns) to the selection when shift clicking
 * in OS selection style
 *
 * @param  {DataTable.Api} dt   DataTable
 * @param  {string}        type Row or column range selector
 * @param  {object}        idx  Item index to select to
 * @param  {object}        last Item index to select from
 * @private
 */
function rowColumnRange( dt, type, idx, last )
{
	// Add a range of rows from the last selected row to this one
	var indexes = dt[type+'s']( { search: 'applied' } ).indexes();
	var idx1 = $.inArray( last, indexes );
	var idx2 = $.inArray( idx, indexes );

	if ( ! dt[type+'s']( { selected: true } ).any() && idx1 === -1 ) {
		// select from top to here - slightly odd, but both Windows and Mac OS
		// do this
		indexes.splice( $.inArray( idx, indexes )+1, indexes.length );
	}
	else {
		// reverse so we can shift click 'up' as well as down
		if ( idx1 > idx2 ) {
			var tmp = idx2;
			idx2 = idx1;
			idx1 = tmp;
		}

		indexes.splice( idx2+1, indexes.length );
		indexes.splice( 0, idx1 );
	}

	if ( ! dt[type]( idx, { selected: true } ).any() ) {
		// Select range
		dt[type+'s']( indexes ).select();
	}
	else {
		// Deselect range - need to keep the clicked on row selected
		indexes.splice( $.inArray( idx, indexes ), 1 );
		dt[type+'s']( indexes ).deselect();
	}
}

/**
 * Clear all selected items
 *
 * @param  {DataTable.settings} ctx Settings object of the host DataTable
 * @param  {boolean} [force=false] Force the de-selection to happen, regardless
 *     of selection style
 * @private
 */
function clear( ctx, force )
{
	if ( force || ctx._select.style === 'single' ) {
		var api = new DataTable.Api( ctx );
		
		api.rows( { selected: true } ).deselect();
		api.columns( { selected: true } ).deselect();
		api.cells( { selected: true } ).deselect();
	}
}

/**
 * Select items based on the current configuration for style and items.
 *
 * @param  {object}             e    Mouse event object
 * @param  {DataTables.Api}     dt   DataTable
 * @param  {DataTable.settings} ctx  Settings object of the host DataTable
 * @param  {string}             type Items to select
 * @param  {int|object}         idx  Index of the item to select
 * @private
 */
function typeSelect ( e, dt, ctx, type, idx )
{
	var style = dt.select.style();
	var toggleable = dt.select.toggleable();
	var isSelected = dt[type]( idx, { selected: true } ).any();
	
	if ( isSelected && ! toggleable ) {
		return;
	}

	if ( style === 'os' ) {
		if ( e.ctrlKey || e.metaKey ) {
			// Add or remove from the selection
			dt[type]( idx ).select( ! isSelected );
		}
		else if ( e.shiftKey ) {
			if ( type === 'cell' ) {
				cellRange( dt, idx, ctx._select_lastCell || null );
			}
			else {
				rowColumnRange( dt, type, idx, ctx._select_lastCell ?
					ctx._select_lastCell[type] :
					null
				);
			}
		}
		else {
			// No cmd or shift click - deselect if selected, or select
			// this row only
			var selected = dt[type+'s']( { selected: true } );

			if ( isSelected && selected.flatten().length === 1 ) {
				dt[type]( idx ).deselect();
			}
			else {
				selected.deselect();
				dt[type]( idx ).select();
			}
		}
	} else if ( style == 'multi+shift' ) {
		if ( e.shiftKey ) {
			if ( type === 'cell' ) {
				cellRange( dt, idx, ctx._select_lastCell || null );
			}
			else {
				rowColumnRange( dt, type, idx, ctx._select_lastCell ?
					ctx._select_lastCell[type] :
					null
				);
			}
		}
		else {
			dt[ type ]( idx ).select( ! isSelected );
		}
	}
	else {
		dt[ type ]( idx ).select( ! isSelected );
	}
}

function _safeId( node ) {
	return node.id.replace(/[^a-zA-Z0-9\-\_]/g, '-');
}



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables selectors
 */

// row and column are basically identical just assigned to different properties
// and checking a different array, so we can dynamically create the functions to
// reduce the code size
$.each( [
	{ type: 'row', prop: 'aoData' },
	{ type: 'column', prop: 'aoColumns' }
], function ( i, o ) {
	DataTable.ext.selector[ o.type ].push( function ( settings, opts, indexes ) {
		var selected = opts.selected;
		var data;
		var out = [];

		if ( selected !== true && selected !== false ) {
			return indexes;
		}

		for ( var i=0, ien=indexes.length ; i<ien ; i++ ) {
			data = settings[ o.prop ][ indexes[i] ];

			if ( (selected === true && data._select_selected === true) ||
			     (selected === false && ! data._select_selected )
			) {
				out.push( indexes[i] );
			}
		}

		return out;
	} );
} );

DataTable.ext.selector.cell.push( function ( settings, opts, cells ) {
	var selected = opts.selected;
	var rowData;
	var out = [];

	if ( selected === undefined ) {
		return cells;
	}

	for ( var i=0, ien=cells.length ; i<ien ; i++ ) {
		rowData = settings.aoData[ cells[i].row ];

		if ( (selected === true && rowData._selected_cells && rowData._selected_cells[ cells[i].column ] === true) ||
		     (selected === false && ( ! rowData._selected_cells || ! rowData._selected_cells[ cells[i].column ] ) )
		) {
			out.push( cells[i] );
		}
	}

	return out;
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables API
 *
 * For complete documentation, please refer to the docs/api directory or the
 * DataTables site
 */

// Local variables to improve compression
var apiRegister = DataTable.Api.register;
var apiRegisterPlural = DataTable.Api.registerPlural;

apiRegister( 'select()', function () {
	return this.iterator( 'table', function ( ctx ) {
		DataTable.select.init( new DataTable.Api( ctx ) );
	} );
} );

apiRegister( 'select.blurable()', function ( flag ) {
	if ( flag === undefined ) {
		return this.context[0]._select.blurable;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._select.blurable = flag;
	} );
} );

apiRegister( 'select.toggleable()', function ( flag ) {
	if ( flag === undefined ) {
		return this.context[0]._select.toggleable;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._select.toggleable = flag;
	} );
} );

apiRegister( 'select.info()', function ( flag ) {
	if ( info === undefined ) {
		return this.context[0]._select.info;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._select.info = flag;
	} );
} );

apiRegister( 'select.items()', function ( items ) {
	if ( items === undefined ) {
		return this.context[0]._select.items;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._select.items = items;

		eventTrigger( new DataTable.Api( ctx ), 'selectItems', [ items ] );
	} );
} );

// Takes effect from the _next_ selection. None disables future selection, but
// does not clear the current selection. Use the `deselect` methods for that
apiRegister( 'select.style()', function ( style ) {
	if ( style === undefined ) {
		return this.context[0]._select.style;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._select.style = style;

		if ( ! ctx._select_init ) {
			init( ctx );
		}

		// Add / remove mouse event handlers. They aren't required when only
		// API selection is available
		var dt = new DataTable.Api( ctx );
		disableMouseSelection( dt );
		
		if ( style !== 'api' ) {
			enableMouseSelection( dt );
		}

		eventTrigger( new DataTable.Api( ctx ), 'selectStyle', [ style ] );
	} );
} );

apiRegister( 'select.selector()', function ( selector ) {
	if ( selector === undefined ) {
		return this.context[0]._select.selector;
	}

	return this.iterator( 'table', function ( ctx ) {
		disableMouseSelection( new DataTable.Api( ctx ) );

		ctx._select.selector = selector;

		if ( ctx._select.style !== 'api' ) {
			enableMouseSelection( new DataTable.Api( ctx ) );
		}
	} );
} );



apiRegisterPlural( 'rows().select()', 'row().select()', function ( select ) {
	var api = this;

	if ( select === false ) {
		return this.deselect();
	}

	this.iterator( 'row', function ( ctx, idx ) {
		clear( ctx );

		ctx.aoData[ idx ]._select_selected = true;
		$( ctx.aoData[ idx ].nTr ).addClass( ctx._select.className );
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'select', [ 'row', api[i] ], true );
	} );

	return this;
} );

apiRegisterPlural( 'columns().select()', 'column().select()', function ( select ) {
	var api = this;

	if ( select === false ) {
		return this.deselect();
	}

	this.iterator( 'column', function ( ctx, idx ) {
		clear( ctx );

		ctx.aoColumns[ idx ]._select_selected = true;

		var column = new DataTable.Api( ctx ).column( idx );

		$( column.header() ).addClass( ctx._select.className );
		$( column.footer() ).addClass( ctx._select.className );

		column.nodes().to$().addClass( ctx._select.className );
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'select', [ 'column', api[i] ], true );
	} );

	return this;
} );

apiRegisterPlural( 'cells().select()', 'cell().select()', function ( select ) {
	var api = this;

	if ( select === false ) {
		return this.deselect();
	}

	this.iterator( 'cell', function ( ctx, rowIdx, colIdx ) {
		clear( ctx );

		var data = ctx.aoData[ rowIdx ];

		if ( data._selected_cells === undefined ) {
			data._selected_cells = [];
		}

		data._selected_cells[ colIdx ] = true;

		if ( data.anCells ) {
			$( data.anCells[ colIdx ] ).addClass( ctx._select.className );
		}
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'select', [ 'cell', api[i] ], true );
	} );

	return this;
} );


apiRegisterPlural( 'rows().deselect()', 'row().deselect()', function () {
	var api = this;

	this.iterator( 'row', function ( ctx, idx ) {
		ctx.aoData[ idx ]._select_selected = false;
		$( ctx.aoData[ idx ].nTr ).removeClass( ctx._select.className );
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'deselect', [ 'row', api[i] ], true );
	} );

	return this;
} );

apiRegisterPlural( 'columns().deselect()', 'column().deselect()', function () {
	var api = this;

	this.iterator( 'column', function ( ctx, idx ) {
		ctx.aoColumns[ idx ]._select_selected = false;

		var api = new DataTable.Api( ctx );
		var column = api.column( idx );

		$( column.header() ).removeClass( ctx._select.className );
		$( column.footer() ).removeClass( ctx._select.className );

		// Need to loop over each cell, rather than just using
		// `column().nodes()` as cells which are individually selected should
		// not have the `selected` class removed from them
		api.cells( null, idx ).indexes().each( function (cellIdx) {
			var data = ctx.aoData[ cellIdx.row ];
			var cellSelected = data._selected_cells;

			if ( data.anCells && (! cellSelected || ! cellSelected[ cellIdx.column ]) ) {
				$( data.anCells[ cellIdx.column  ] ).removeClass( ctx._select.className );
			}
		} );
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'deselect', [ 'column', api[i] ], true );
	} );

	return this;
} );

apiRegisterPlural( 'cells().deselect()', 'cell().deselect()', function () {
	var api = this;

	this.iterator( 'cell', function ( ctx, rowIdx, colIdx ) {
		var data = ctx.aoData[ rowIdx ];

		data._selected_cells[ colIdx ] = false;

		// Remove class only if the cells exist, and the cell is not column
		// selected, in which case the class should remain (since it is selected
		// in the column)
		if ( data.anCells && ! ctx.aoColumns[ colIdx ]._select_selected ) {
			$( data.anCells[ colIdx ] ).removeClass( ctx._select.className );
		}
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'deselect', [ 'cell', api[i] ], true );
	} );

	return this;
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Buttons
 */
function i18n( label, def ) {
	return function (dt) {
		return dt.i18n( 'buttons.'+label, def );
	};
}

// Common events with suitable namespaces
function namespacedEvents ( config ) {
	var unique = config._eventNamespace;

	return 'draw.dt.DT'+unique+' select.dt.DT'+unique+' deselect.dt.DT'+unique;
}

function enabled ( dt, config ) {
	if ( $.inArray( 'rows', config.limitTo ) !== -1 && dt.rows( { selected: true } ).any() ) {
		return true;
	}

	if ( $.inArray( 'columns', config.limitTo ) !== -1 && dt.columns( { selected: true } ).any() ) {
		return true;
	}

	if ( $.inArray( 'cells', config.limitTo ) !== -1 && dt.cells( { selected: true } ).any() ) {
		return true;
	}

	return false;
}

var _buttonNamespace = 0;

$.extend( DataTable.ext.buttons, {
	selected: {
		text: i18n( 'selected', 'Selected' ),
		className: 'buttons-selected',
		limitTo: [ 'rows', 'columns', 'cells' ],
		init: function ( dt, node, config ) {
			var that = this;
			config._eventNamespace = '.select'+(_buttonNamespace++);

			// .DT namespace listeners are removed by DataTables automatically
			// on table destroy
			dt.on( namespacedEvents(config), function () {
				that.enable( enabled(dt, config) );
			} );

			this.disable();
		},
		destroy: function ( dt, node, config ) {
			dt.off( config._eventNamespace );
		}
	},
	selectedSingle: {
		text: i18n( 'selectedSingle', 'Selected single' ),
		className: 'buttons-selected-single',
		init: function ( dt, node, config ) {
			var that = this;
			config._eventNamespace = '.select'+(_buttonNamespace++);

			dt.on( namespacedEvents(config), function () {
				var count = dt.rows( { selected: true } ).flatten().length +
				            dt.columns( { selected: true } ).flatten().length +
				            dt.cells( { selected: true } ).flatten().length;

				that.enable( count === 1 );
			} );

			this.disable();
		},
		destroy: function ( dt, node, config ) {
			dt.off( config._eventNamespace );
		}
	},
	selectAll: {
		text: i18n( 'selectAll', 'Select all' ),
		className: 'buttons-select-all',
		action: function () {
			var items = this.select.items();
			this[ items+'s' ]().select();
		}
	},
	selectNone: {
		text: i18n( 'selectNone', 'Deselect all' ),
		className: 'buttons-select-none',
		action: function () {
			clear( this.settings()[0], true );
		},
		init: function ( dt, node, config ) {
			var that = this;
			config._eventNamespace = '.select'+(_buttonNamespace++);

			dt.on( namespacedEvents(config), function () {
				var count = dt.rows( { selected: true } ).flatten().length +
				            dt.columns( { selected: true } ).flatten().length +
				            dt.cells( { selected: true } ).flatten().length;

				that.enable( count > 0 );
			} );

			this.disable();
		},
		destroy: function ( dt, node, config ) {
			dt.off( config._eventNamespace );
		}
	}
} );

$.each( [ 'Row', 'Column', 'Cell' ], function ( i, item ) {
	var lc = item.toLowerCase();

	DataTable.ext.buttons[ 'select'+item+'s' ] = {
		text: i18n( 'select'+item+'s', 'Select '+lc+'s' ),
		className: 'buttons-select-'+lc+'s',
		action: function () {
			this.select.items( lc );
		},
		init: function ( dt ) {
			var that = this;

			dt.on( 'selectItems.dt.DT', function ( e, ctx, items ) {
				that.active( items === lc );
			} );
		}
	};
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Initialisation
 */

// DataTables creation - check if select has been defined in the options. Note
// this required that the table be in the document! If it isn't then something
// needs to trigger this method unfortunately. The next major release of
// DataTables will rework the events and address this.
$(document).on( 'preInit.dt.dtSelect', function (e, ctx) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	DataTable.select.init( new DataTable.Api( ctx ) );
} );


return DataTable.select;
}));


