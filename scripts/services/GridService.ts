/**
 * Utility service to design and control UI Grids used in the application
 */
module h5.application {

    export class GridService {

        static $inject = ["$filter", "$timeout", "StorageService", "languageService"];
        private baseGrid: IUIGrid;

        constructor(private $filter: h5.application.AppFilter, private $timeout: ng.ITimeoutService, private storageService: h5.application.StorageService, private languageService: h5.application.LanguageService) {
            this.init();
        }

        /**
        * Initialize a Grid object with default configurations to enable/disable features
        */
        private init() {
            this.baseGrid = {
                enableGridMenu: true,
                enableRowSelection: true,
                enableFullRowSelection: false,
                modifierKeysToMultiSelect: true,
                modifierKeysToMultiSelectCells: true,
                enableRowHeaderSelection: true,
                enableSelectAll: true,
                showGridFooter: true,
                showColumnFooter: true,
                enableColumnMenus: true,
                enableSorting: true,
                enableFiltering: true,
                flatEntityAccess: true,
                fastWatch: true,
                scrollDebounce: 500,
                wheelScrollThrottle: 500,
                virtualizationThreshold: 10,
                exporterCsvFilename: "grid_data.csv",
                exporterPdfFilename: "grid_data.pdf",
                exporterFieldCallback: (grid: any, row: any, col: any, value: any) => {
                    if (col.name.indexOf('Date') > 0) {
                        value = this.$filter('m3Date')(value, grid.appScope.appConfig.globalDateFormat);
                    }
                    return value;
                },
                exporterPdfCustomFormatter: (docDefinition: any) => {
                    docDefinition.styles.pageHeader = { fontSize: 10, italics: true, alignment: 'left', margin: 10 };
                    docDefinition.styles.pageFooter = { fontSize: 10, italics: true, alignment: 'right', margin: 10 };
                    return docDefinition;
                },
                exporterPdfDefaultStyle: { fontSize: 9 },
                exporterPdfHeader: {
                    columns: [
                        { text: 'H5 Application', style: 'pageHeader' }
                    ]
                },
                exporterPdfFooter: (currentPage: number, pageCount: number) => { return { text: 'Page ' + currentPage + ' of ' + pageCount, style: 'pageFooter' }; },
                exporterPdfTableStyle: { margin: [20, 30, 20, 30] },
                exporterPdfMaxGridWidth: 700,
                columnDefs: [{}],
                data: []
            };
        }

        /**
        * Get a copy of the base grid with default attributes
        */
        public getBaseGrid(): IUIGrid {
            return angular.copy(this.baseGrid);
        }

        /**
        * When called this function will adjust the UI Grid height based on the number of rows loaded
        * @param gridId the grid Id
        * @param noOfRows the number of rows in the grid
        * @param timeDelay the time delay to initiate resizing the grid
        * @param initialHeight the initial height to calculate the grid row(s) height, default is 150 px
        */
        public adjustGridHeight(gridId: string, noOfRows: number, timeDelay: number, initialHeight = 150) {
            noOfRows = (noOfRows < 1 ? 1 : noOfRows);
            this.$timeout(() => {
                let newHeight = noOfRows > 15 ? 600 : (initialHeight + noOfRows * 30);
                angular.element(document.getElementById(gridId)).css('height', newHeight + 'px');
            }, timeDelay);
        }

        /**
        * Save the current state of the UI Grid in the browser memory
        * @param gridId the grid Id
        */
        public saveGridState(gridId: string, gridApi: any) {
            let gridState = gridApi.saveState.save();
            this.storageService.setLocalData('h5.app.appName.gridState.' + gridId, gridState);
        }

        /**
        * Restore the last saved state of the UI Grid
        * @param gridId the grid Id
        */
        public restoreGridState(gridId: string, gridApi: any) {
            let gridState = this.storageService.getLocalData('h5.app.appName.gridState.' + gridId);
            if (gridState) {
                this.$timeout(() => {
                    gridApi.saveState.restore(undefined, gridState);
                }, 100);
            }
        }

        /**
        * Clear all the saved states of the UI Grids in the browser's storage
        */
        public clearGridStates() {
            let gridIds = ["sampleGrid1"];
            gridIds.forEach((gridId: string) => {
                this.storageService.removeLocalData('h5.app.appName.gridState.' + gridId);
            });

        }

        /**
        * Initialize and construct the Sample UI Grid object which defines grid's look and features
        */
        public getSampleGrid1(): IUIGrid {
            let sampleGrid1: IUIGrid = angular.copy(this.baseGrid);
            let footerCellTemplateNumString = "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\">{{ ( col.getAggregationValue() CUSTOM_FILTERS ) | number:2 }}</div>";
            sampleGrid1.columnDefs = [
                { name: "DIVI", displayName: this.languageService.languageConstants.get('Division') },
                { name: "FACI", displayName: this.languageService.languageConstants.get('Facility') },
                { name: "FACN", displayName: this.languageService.languageConstants.get('Name') },
                {
                    name: "RGDT", displayName: this.languageService.languageConstants.get('Entry Date'), cellFilter: "m3Date:grid.appScope.appConfig.globalDateFormat",
                    filters: [{ condition: (searchTerm, cellValue) => { return this.$filter('m3DateFilter')(64, searchTerm, cellValue) }, placeholder: '> =' },
                        { condition: (searchTerm, cellValue) => { return this.$filter('m3DateFilter')(256, searchTerm, cellValue) }, placeholder: '< =' }]
                },
                {
                    name: "TSTE", displayName: this.languageService.languageConstants.get('App Timestamp'), headerCellClass: "text-right", cellClass: "text-right",
                    filters: [{ condition: 64, placeholder: '> =' }, { condition: 256, placeholder: '< =' }]
                },
                { name: "LOCD", displayName: this.languageService.languageConstants.get('Local Currency') }
                ];
            sampleGrid1.exporterCsvFilename = "sample_list.csv";
            sampleGrid1.exporterPdfFilename = "sample_list.pdf";
            sampleGrid1.saveSelection = false;
            return sampleGrid1;
        }
        
        /**
        * Initialize and construct the Sample UI Grid object which defines grid's look and features
        */
        public getitemLines(): IUIGrid {  
            let ItemLines: IUIGrid = angular.copy(this.baseGrid);
            ItemLines.columnDefs = [
                { name: "ITNO", displayName: this.languageService.languageConstants.get('Item Number'),enableCellEdit: false , cellClass: "text-right"},
                { name: "ITDS", displayName: this.languageService.languageConstants.get('Name'), headerCellClass: "text-right",enableCellEdit: false, cellClass: "text-right" },
                { name: "FUDS", displayName: this.languageService.languageConstants.get('Description'), headerCellClass: "text-right",enableCellEdit: false, cellClass: "text-right" },
                { name: "STAT", displayName: this.languageService.languageConstants.get('Status'), headerCellClass: "text-right",enableCellEdit: false, cellClass: "text-right" },
                { name: "ITTY", displayName: this.languageService.languageConstants.get('Item Type'), headerCellClass: "text-right",enableCellEdit: false, cellClass: "text-right", visible: true },
                { name: "PRRF", displayName: this.languageService.languageConstants.get('Item Type'), headerCellClass: "text-right",enableCellEdit: false, cellClass: "text-right", visible: false },
                { name: "CUCD", displayName: this.languageService.languageConstants.get('Item Type'), headerCellClass: "text-right",enableCellEdit: false, cellClass: "text-right", visible: false },
                { name: "FVDT", displayName: this.languageService.languageConstants.get('Item Type'), headerCellClass: "text-right",enableCellEdit: false, cellClass: "text-right", visible: false },
                ];
            //return-lines-grid-footer.html
            //ReturnLines.gridFooterTemplate = "views/return-lines-grid-footer.html";
            ItemLines.exporterCsvFilename = "sample_list.csv";
            ItemLines.exporterPdfFilename = "sample_list.pdf";
            ItemLines.saveSelection = false;
            return ItemLines;
        }
        

    }

}