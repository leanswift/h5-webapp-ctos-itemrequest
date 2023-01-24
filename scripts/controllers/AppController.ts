/**
 * Application controller which will have the global scope functions and models and can be accessed through out the application. 
 * Functions and models shared across one or more modules should be implemented here. 
 * For independent modules create module specific controllers and declare it as a nested controller, i.e under the module specific page.
 */
module h5.application {

     export enum MessageType {
        Information = 0,
        Warning = 1,
        Error = 2,
    }
    export class AppController {
       
        //Array of strings in this property represent names of services to be injected into this controller. Note: The services are declared in app.ts
        static $inject = ["$scope", "configService", "AppService", "RestService", "StorageService", "GridService", "m3UserService", "languageService", "$uibModal", "$interval", "$timeout", "$filter", "$q", "$window", "m3FormService", "$location"];

        constructor(private scope: IAppScope, private configService: h5.application.ConfigService, private appService: h5.application.IAppService, private restService: h5.application.RestService, private storageService: h5.application.StorageService, private gridService: h5.application.GridService, private userService: M3.IUserService, private languageService: h5.application.LanguageService, private $uibModal: ng.ui.bootstrap.IModalService, private $interval: ng.IIntervalService, private $timeout: ng.ITimeoutService, private $filter: h5.application.AppFilter, private $q: ng.IQService, private $window: ng.IWindowService, private formService: M3.FormService, private $location: ng.ILocationService) {
            this.init();
        }

        /**
        * The initialize function which will be called when the controller is created
        */
        private init() {
            this.scope.appReady = false;
            this.scope.loadingData = false;
            this.scope.statusBar = [];
            this.scope.statusBarIsCollapsed = true;
            this.scope.statusBarVisible = true;

            this.languageService.getAppLanguage().then((val: Odin.ILanguage) => {
                this.scope.languageConstants = this.languageService.languageConstants;
                this.initApplication();
            }, (errorResponse: any) => {
                Odin.Log.error("Error getting language constants " + errorResponse);
                this.scope.statusBar.push({ message: "Error getting language constants" + errorResponse, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            });
            if (this.$window.innerWidth <= 768) {
                this.scope.showSideNavLabel = false;
            } else {
                this.scope.showSideNavLabel = false;
            }
        }

        /**
        * This function will have any application specific initialization functions
        */
        private initApplication() {
            this.initGlobalConfig();
            this.initAppScope();
            this.initUIGrids();
            this.initScopeFunctions();
            this.$timeout(() => { this.scope.appReady = true; }, 5000);
            this.initApplicationConstants();
        }

        /**
        * This function will call the config service and set the global configuration model object with the configured settings 
        */
        private initGlobalConfig() {
            this.configService.getGlobalConfig().then((configData: any) => {
                this.scope.globalConfig = configData;
                this.initLanguage();
                this.initTheme();
                this.getUserContext();
                this.initModule();
            }, (errorResponse: any) => {
                Odin.Log.error("Error while getting global configuration " + errorResponse);
                this.scope.statusBar.push({ message: "Error while getting global configuration " + errorResponse, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            });
        }

        /**
        * Codes and function calls to initialize Application Scope model
        */
        private initAppScope() {
            //Initialize data objects
            this.scope.transactionStatus = {
                appConfig: false
            };
            this.scope["errorMessages"] = [];
            this.scope.infiniteScroll = {
                numToAdd: 20,
                currentItems: 20
            };
            this.scope.themes = [
                { themeId: 1, themeIcon: 'leanswiftchartreuse.png', themeName: "Theme1Name", panel: "panel-h5-theme-LC", navBar: "navbar-h5-theme-LC", sideNav: "sideNav-h5-theme-LC", button: "h5Button-h5-theme-LC", h5Grid: "h5Grid-h5-theme-LC", h5Dropdown: "h5Dropdown-h5-theme-LC", navTabs: "navtabs-h5-theme-LC", active: false, available: true },
                { themeId: 2, themeIcon: 'royalinfor.png', themeName: "Theme2Name", panel: "panel-h5-theme-RI", navBar: "navbar-h5-theme-RI", sideNav: "sideNav-h5-theme-RI", button: "h5Button-h5-theme-RI", h5Grid: "h5Grid-h5-theme-RI", h5Dropdown: "h5Dropdown-h5-theme-RI", navTabs: "navtabs-h5-theme-RI", active: false, available: true },
                { themeId: 3, themeIcon: 'summersmoothe.png', themeName: "Theme3Name", panel: "panel-h5-theme-SS", navBar: "navbar-h5-theme-SS", sideNav: "sideNav-h5-theme-SS", button: "h5Button-h5-theme-SS", h5Grid: "h5Grid-h5-theme-SS", h5Dropdown: "h5Dropdown-h5-theme-SS", navTabs: "navtabs-h5-theme-SS", active: false, available: true },
                { themeId: 4, themeIcon: 'pumkinspice.png', themeName: "Theme4Name", panel: "panel-h5-theme-PS", navBar: "navbar-h5-theme-PS", sideNav: "sideNav-h5-theme-PS", button: "h5Button-h5-theme-PS", h5Grid: "h5Grid-h5-theme-PS", h5Dropdown: "h5Dropdown-h5-theme-PS", navTabs: "navtabs-h5-theme-PS", active: false, available: true },
                { themeId: 5, themeIcon: 'visionimpared.png', themeName: "Theme5Name", panel: "panel-h5-theme-VI", navBar: "navbar-h5-theme-VI", sideNav: "sideNav-h5-theme-VI", button: "h5Button-h5-theme-VI", h5Grid: "h5Grid-h5-theme-VI", h5Dropdown: "h5Dropdown-h5-theme-VI", navTabs: "navtabs-h5-theme-VI", active: false, available: true },
                { themeId: 6, themeIcon: 'lipstickjungle.png', themeName: "Theme6Name", panel: "panel-h5-theme-LJ", navBar: "navbar-h5-theme-LJ", sideNav: "sideNav-h5-theme-LJ", button: "h5Button-h5-theme-LJ", h5Grid: "h5Grid-h5-theme-LJ", h5Dropdown: "h5Dropdown-h5-theme-LJ", navTabs: "navtabs-h5-theme-LJ", active: false, available: true },
                { themeId: 7, themeIcon: 'silverlining.png', themeName: "Theme7Name", panel: "panel-h5-theme-SL", navBar: "navbar-h5-theme-SL", sideNav: "sideNav-h5-theme-SL", button: "h5Button-h5-theme-SL", h5Grid: "h5Grid-h5-theme-SL", h5Dropdown: "h5Dropdown-h5-theme-SL", navTabs: "navtabs-h5-theme-SL", active: false, available: true },
                { themeId: 8, themeIcon: 'steelclouds.png', themeName: "Theme8Name", panel: "panel-h5-theme-SC", navBar: "navbar-h5-theme-SC", sideNav: "sideNav-h5-theme-SC", button: "h5Button-h5-theme-SC", h5Grid: "h5Grid-h5-theme-SC", h5Dropdown: "h5Dropdown-h5-theme-SC", navTabs: "navtabs-h5-theme-SC", active: false, available: true }
            ];
            this.scope.textures = [
                { textureId: 1, textureIcon: 'diamond.png', textureName: "Wallpaper1Name", appBG: "h5-texture-one", active: false, available: true },
                { textureId: 2, textureIcon: 'grid.png', textureName: "Wallpaper2Name", appBG: "h5-texture-two", active: false, available: true },
                { textureId: 3, textureIcon: 'linen.png', textureName: "Wallpaper3Name", appBG: "h5-texture-three", active: false, available: true },
                { textureId: 4, textureIcon: 'tiles.png', textureName: "Wallpaper4Name", appBG: "h5-texture-four", active: false, available: true },
                { textureId: 5, textureIcon: 'wood.png', textureName: "Wallpaper5Name", appBG: "h5-texture-five", active: false, available: true }
            ];
            this.scope.supportedLanguages = [{ officialTranslations: false, languageCode: "ar-AR", active: false, available: true }, { officialTranslations: false, languageCode: "cs-CZ", active: false, available: true },
                { officialTranslations: false, languageCode: "da-DK", active: false, available: true }, { officialTranslations: false, languageCode: "de-DE", active: false, available: true },
                { officialTranslations: false, languageCode: "el-GR", active: false, available: true }, { officialTranslations: true, languageCode: "en-US", active: true, available: true },
                { officialTranslations: false, languageCode: "es-ES", active: false, available: true }, { officialTranslations: false, languageCode: "fi-FI", active: false, available: true },
                { officialTranslations: true, languageCode: "fr-FR", active: false, available: true }, { officialTranslations: false, languageCode: "he-IL", active: false, available: true },
                { officialTranslations: false, languageCode: "hu-HU", active: false, available: true }, { officialTranslations: false, languageCode: "it-IT", active: false, available: true },
                { officialTranslations: false, languageCode: "ja-JP", active: false, available: true }, { officialTranslations: false, languageCode: "nb-NO", active: false, available: true },
                { officialTranslations: false, languageCode: "nl-NL", active: false, available: true }, { officialTranslations: false, languageCode: "pl-PL", active: false, available: true },
                { officialTranslations: false, languageCode: "pt-PT", active: false, available: true }, { officialTranslations: false, languageCode: "ru-RU", active: false, available: true },
                { officialTranslations: true, languageCode: "sv-SE", active: false, available: true }, { officialTranslations: false, languageCode: "tr-TR", active: false, available: true },
                { officialTranslations: false, languageCode: "zh-CN", active: false, available: true }, { officialTranslations: false, languageCode: "ta-IN", active: false, available: true }
            ];

            this.scope.views = { 
                h5Application: { url: "views/Application.html" },
                interfaceItem: { url: "views/InterfaceItem.html" },
                //warehouseBasic: { url: "views/WarehouseBasic.html" },
                //selection: { url: "views/Selection.html" },
                 //basicData: { url: "views/BasicData.html" }
                //sampleModule1: { url: "views/SampleModule1.html" }
            };
            this.scope.modules = [
                { moduleId: 1,activeIcon: 'item-request.png', inactiveIcon: 'item-request.png', heading: 'Item Request', content: this.scope.views.interfaceItem.url, active: true, available: true },
                //{ moduleId: 2,activeIcon: 'wh-basic.png', inactiveIcon: 'wh-basic-na.png', heading: 'WH Basic', content: this.scope.views.warehouseBasic.url, active: true, available: true },
            ];
            this.scope.appConfig = {};
            this.scope.userContext = new M3.UserContext();
            this.scope["dateRef"] = new Date();

            //Function calls which initialize module specific data objects
            this.initGlobalSelection();
            this.initInterfaceItem();
            //this.initWarehouseBasic();
        }

        /**
        * Initialize Global Selection model
        */
        private initGlobalSelection() {
            this.scope.globalSelection = {
                reload: true,
                transactionStatus: {
                    sampleDataList1: false,
                    sampleDataList2: false,
                    wareDataList: false,
                    uomDataList: false,
                    attributeDataList: false,
                    prdgrpDataList: false,
                    businessareaDataList: false,
                    itemgroupDataList: false,
                    warehouses: false
                },
                 warehouseList: [],
                 warehouse1: {},
                statusRange: {},
                 statusRangeWH: {},
                AcqCode:{},
                status: { selected: "20" },
                statusWH: { selected: "20" },
                AcqCodeWH: { selected: "2" },
                sampleDataList1: [],
                sampleData1: undefined,
                itemGroupList: [],
                itemGroupData: undefined,
                facilityDataList: [],
                facilityData: undefined,
                uomList: [],
                uomData: undefined,
                attributeList: [],
                attributeData: undefined,
                 prdgrpList: [],
                prdgrpData: undefined,
                 businessareaList: [],
                businessareaData: undefined,
                warehouse: {
                list: [],
                },
                warehouseDataList: [],
                warehouseData: undefined
            };
        }

        /**
        * Initialize the interfaceItem model
        */
        private initInterfaceItem() {
             this.scope.userContext = new M3.UserContext();
            let userContext = this.scope.userContext;
            console.log("G INSIDE"+ userContext.USID);
            this.scope.interfaceItem = {
                reload: true,
                transactionStatus: {
                    sampleData1: false,
                    sampleList1: false,
                    createItems:false,
                    ItemsList: false,
                    supplierList: false, 
                    itemsupplier: false,
                    attributes: false,
                    buyerIList: false,
                    responsibleIList: false,
                    defaultresponsibleIList: false,
                },
                enablebutton:true,
                 enableFields:true,
                enableUpdate:false,
                enableCreate:true,
                sampleData1: {},
                sampleList1: [],
                sampleGrid1: {},
                itemlinesGrid: {},
                selectedSampleDataGridRow: {},
                collapseSection1: false,
                userSelection: {},
                itemTypeList: [],
                priceList:[],
                supplierList:[],
                responsibleList:[],
                agreementList:[],
                itmType: "",
                label:"pcost",
                chkItemType:"",
                chkAquCode:"",
                attrType:"",
                buyerList:[],
                finalITNO : "",
                userInput: {
                  ITNO : ""
                },
                userInput1: {}
                
            };
        }
        
        /**
        * Initialize the initWarehouseBasic model
        */
        private initWarehouseBasic() {
            this.scope.warehouseBasic = {
                reload: true,
                transactionStatus: {
                   itemnumberIList:false,
                    updateItems:false,
                    orderTypesList:false,
                },
                warehouseDataList: [],
                orderTypesList: [],
                orderTypesData: undefined,
                SUWHList: [],
                SUWHdata: undefined,
                itemnumberDataList: [],
                
            };
        }

        /**
        * Initialize the application constants/labels
        */
        private initApplicationConstants() {
            //Add the Constants, Labels, Options which are not need to be hard-coded and used in the application
            //this.scope.sampleModule1.sampleM3Options = [{ id: "1", name: "1-Truck Load" }, { id: "2", name: "2-Train" }, { id: "3", name: "3-Air Charter" }];
        this.scope.globalSelection.statusRange = {
                options: [
                    { id: "10", name: "10-Prel. Item"},
                    { id: "20", name: "20-Released "} 
                   ]
            };
            
            this.scope.globalSelection.itemType = {
                options: [
                    { ITTY: "301", TX40: "USD PARTS"},
                    { ITTY: "302", TX40: "PARTS OEM"},
                    { ITTY: "303", TX40: "CUSTOMER OWNED PARTS"},
                    //{ ITTY: "310", TX40: "VMI PARTS"}, 
                    { ITTY: "401", TX40: "USED EXCHANGE"}, 
                    { ITTY: "402", TX40: "EXCHANGE"} 
                   ]
            };
            
            this.scope.globalSelection.statusType = {
                options: [
                    { STAT: "Sale"},
                    { STAT: "Quote"},
                    { STAT: "Stock"} 
                   ]
            };
            
            this.scope.globalSelection.statusRangeWH = {
                options: [
                    { id: "20", name: "20-Released "} 
                   ]
            };
            
            this.scope.globalSelection.AcqCode = {
                options: [
                    { id: "1", name: "1-Manufactured"},
                    { id: "2", name: "2-Purchased"} ,
                    { id: "3", name: "3-Distributed"} ,
                    { id: "6", name: "6-Maintenance"}
                   ]
            };
            //this.loaditemType();
            //this.loadpriceList();
        }

        /**
        * Initialize the binding of controller function mapping with the module scope
        */
        private initScopeFunctions() {
            //Add function binding to the scope models which are required to access from grid scope
            //this.scope.sampleModule1.computeFunction1 = (param1, param2) => { this.computeFunction1(param1, param2); }
          this.scope.interfaceItem.processItems = () => { this.processItem(); }
             this.scope.interfaceItem.validateItem = () => { this.validateItem(); }
             
        }

        /**
        * Initialize UI grids objects defined in all modules
        */
        private initUIGrids() {
            //Initialize the grid objects via gridService
            //this.scope.sampleModule1.sampleGrid1 = this.gridService.getSampleGrid1();
            this.scope.interfaceItem.itemlinesGrid =  this.gridService.getitemLines();
            this.initUIGridsOnRegisterApi();
        }

        /**
        * Initialize UI Grid On Register API if required
        */
        private initUIGridsOnRegisterApi() {
            //Initialize the onRegisterApi with the callback functions associated with grid events
//            this.scope.sampleModule1.sampleGrid1.onRegisterApi = (gridApi) => {
//                this.scope.sampleModule1.sampleGrid1.gridApi = gridApi;
//                this.gridService.adjustGridHeight("sampleGrid1", this.scope.sampleModule1.sampleGrid1.data.length, 500);
//
//                gridApi.cellNav.on.viewPortKeyDown(this.scope, (event: any) => {
//                    if ((event.keyCode === 67) && (event.ctrlKey || event.metaKey)) {
//                        let cells = gridApi.cellNav.getCurrentSelection();
//                        this.copyCellContentToClipBoard(cells);
//                    }
//                });
//                gridApi.selection.on.rowSelectionChanged(this.scope, (row: any) => {
//                    //called whenever the user select a row
//                    this.sampleDataListGridRowSelected(row);
//                });
//
//                //restore the saved state of the grid which we saved before after the grid rendered successfully
//                gridApi.core.on.renderingComplete(this.scope, (handler: any) => { this.gridService.restoreGridState("sampleGrid1", gridApi); });
//                //save the state of the grid to the browser memory whenever the below events occurs
//                gridApi.core.on.columnVisibilityChanged(this.scope, (handler: any) => { this.gridService.saveGridState("sampleGrid1", gridApi); });
//                gridApi.colMovable.on.columnPositionChanged(this.scope, (handler: any) => { this.gridService.saveGridState("sampleGrid1", gridApi); });
//            };
            
                this.scope.interfaceItem.itemlinesGrid.onRegisterApi = (gridApi) => {
                this.scope.interfaceItem.itemlinesGrid.gridApi = gridApi;
                this.gridService.adjustGridHeight("itemlinesGrid", this.scope.interfaceItem.itemlinesGrid.data.length, 500);

                gridApi.cellNav.on.viewPortKeyDown(this.scope, (event: any) => {
                    if ((event.keyCode === 67) && (event.ctrlKey || event.metaKey)) {
                        let cells = gridApi.cellNav.getCurrentSelection();
                        this.copyCellContentToClipBoard(cells);
                    }
                });
//                gridApi.selection.on.rowSelectionChanged(this.scope, (row: any) => {
//                    //called whenever the user select a row
//                    console.log("inside row selected change selected");
//                    this.RowSelected(row);
//                });

                //restore the saved state of the grid which we saved before after the grid rendered successfully
                gridApi.core.on.renderingComplete(this.scope, (handler: any) => { this.gridService.restoreGridState("itemlinesGrid", gridApi); });
                //save the state of the grid to the browser memory whenever the below events occurs
                gridApi.core.on.columnVisibilityChanged(this.scope, (handler: any) => { this.gridService.saveGridState("itemlinesGrid", gridApi); });
                gridApi.colMovable.on.columnPositionChanged(this.scope, (handler: any) => { this.gridService.saveGridState("itemlinesGrid", gridApi); });
            };
        }

        /**
        * Reset UI Grid Column Definitions (Required to reflect if the user changed the application language)
        */
        private resetUIGridsColumnDefs() {
            //Reset UI grids columnDefs
           // this.scope.sampleModule1.sampleGrid1.columnDefs = this.gridService.getSampleGrid1().columnDefs;
        }

        /**
        * Initialize theme on application start
        */
        private initTheme() {
            let themeId = this.storageService.getLocalData('h5.app.appName.theme.selected');
            let textureId = this.storageService.getLocalData('h5.app.appName.texture.selected');
            themeId = angular.isNumber(themeId) ? themeId : angular.isNumber(this.scope.globalConfig.defaultThemeId) ? this.scope.globalConfig.defaultThemeId : 1;
            textureId = angular.isNumber(textureId) ? textureId : angular.isNumber(this.scope.globalConfig.defaultTextureId) ? this.scope.globalConfig.defaultTextureId : 1;
            this.themeSelected(themeId);
            this.textureSelected(textureId);

            this.scope.themes.forEach((theme) => {
                if (this.scope.globalConfig.excludeThemes.indexOf(theme.themeId) > -1) {
                    theme.available = false;
                } else {
                    theme.available = true;
                }
            });
            this.scope.textures.forEach((texture) => {
                if (this.scope.globalConfig.excludeWallpapers.indexOf(texture.textureId) > -1) {
                    texture.available = false;
                } else {
                    texture.available = true;
                }
            });
        }

        /**
        * Initialize module on application start
        */
        private initModule() {
            let moduleId = this.storageService.getLocalData('h5.app.appName.module.selected');
            moduleId = angular.isNumber(moduleId) ? moduleId : 1;
            this.scope.activeModule = moduleId;
            this.scope.modules.forEach((appmodule) => {
                if (angular.equals(moduleId, appmodule.moduleId)) {
                    appmodule.active = true;
                } else {
                    appmodule.active = false;
                }
                if (this.scope.globalConfig.excludeModules.indexOf(appmodule.moduleId) > -1) {
                    appmodule.available = false;
                } else {
                    appmodule.available = true;
                }
            });
        }

        /**
        *  Initialize language on application start
        */
        private initLanguage() {
            let languageCode = this.storageService.getLocalData('h5.app.appName.language.selected');
            languageCode = angular.isString(languageCode) ? languageCode : angular.isString(this.scope.globalConfig.defaultLanguage) ? this.scope.globalConfig.defaultLanguage : "en-US";
            this.scope.currentLanguage = languageCode;
            if (!angular.equals(this.scope.currentLanguage, "en-US")) {
                this.languageService.changeAppLanguage(languageCode).then((val: Odin.ILanguage) => {
                    this.resetUIGridsColumnDefs();
                }, (errorResponse: any) => {
                    Odin.Log.error("Error getting language " + errorResponse);
                    this.scope.statusBar.push({ message: "Error getting language " + errorResponse, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });

                });
            }
            this.scope.supportedLanguages.forEach((language) => {
                if (angular.equals(language.languageCode, languageCode)) {
                    language.active = true;
                } else {
                    language.active = false;
                }
                if (this.scope.globalConfig.excludeLanguages.indexOf(language.languageCode) > -1) {
                    language.available = false;
                } else {
                    language.available = true;
                }
            });
        }

        /**
        * Set the application theme
        * @param themeId the theme id
        */
        private themeSelected(themeId: number) {
            this.scope.themes.forEach((theme) => {
                if (angular.equals(theme.themeId, themeId)) {
                    theme.active = true;
                    this.scope.theme = theme;
                } else {
                    theme.active = false;
                }
            });
            this.storageService.setLocalData('h5.app.appName.theme.selected', themeId);
        }

        /**
        * Set the application background
        * @param textureId the texture id
        */
        private textureSelected(textureId: number) {
            this.scope.textures.forEach((texture) => {
                if (angular.equals(texture.textureId, textureId)) {
                    texture.active = true;
                    this.scope.texture = texture;
                } else {
                    texture.active = false;
                }
            });
            this.storageService.setLocalData('h5.app.appName.texture.selected', textureId);
        }

        /**
        * Get User Context for the logged in H5 user
        */
        private getUserContext() {
            Odin.Log.debug("is H5 " + this.userService.isH5() + " is Iframe " + Odin.Util.isIframe());
            this.scope.loadingData = true;
            this.userService.getUserContext().then((val: M3.IUserContext) => {
                this.scope.userContext = val;
                this.loadGlobalData();
            }, (reason: any) => {
                Odin.Log.error("Can't get user context from h5 due to " + reason.errorMessage);
                this.scope.statusBar.push({ message: "Can't get user context from h5 " + [reason.errorMessage], statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });

                this.showError("Can't get user context from h5 ", [reason.errorMessage]);
                this.loadGlobalData();
            });
        }

        /**
        * Launch the H5 program or H5 link when the app runs inside the H5 client
        */
        private launchM3Program(link: string): void {
            Odin.Log.debug("H5 link to launch -->" + link);
            this.formService.launch(link);
        }

        /**
        * Trigger load application data when the user hit a specific key
        */
        private mapKeyUp(event: any) {
            //F4 : 115, ENTER : 13
            if (event.keyCode === 115) {
                console.log("G CLICKED");
                this.loadApplicationData();
            }
        }

        /**
        * Used by infinite scroll functionality in the ui-select dropdown with large number of records
        */
        private addMoreItemsToScroll() {
            this.scope.infiniteScroll.currentItems += this.scope.infiniteScroll.numToAdd;
        };

        /**
        * Hack function to facilitate copy paste shortcut in ui grid cells
        */
        private copyCellContentToClipBoard(cells: any) {
            let hiddenTextArea = angular.element(document.getElementById("gridClipboard"));
            hiddenTextArea.val("");
            let textToCopy = '', rowId = cells[0].row.uid;
            cells.forEach((cell: any) => {
                textToCopy = textToCopy == '' ? textToCopy : textToCopy + ",";
                let cellValue = cell.row.entity[cell.col.name];
                if (angular.isDefined(cellValue)) {
                    if (cell.row.uid !== rowId) {
                        textToCopy += '\n';
                        rowId = cell.row.uid;
                    }
                    textToCopy += cellValue;
                }

            });
            hiddenTextArea.val(textToCopy);
            hiddenTextArea.select();
        }
        
        /**
        * Load the warehouses
        * @param company the company
        */
        private loadWarehouses(company: string): void {
            this.scope.loadingData = true;
            this.scope.globalSelection.transactionStatus.warehouses = true;
            this.appService.getWarehouses(company).then((val: M3.IMIResponse) => {
                let warehouseDescriptions = {};
                val.items.forEach((item) => {
                    warehouseDescriptions[item.WHLO] = item.WHNM;
                });
                this.scope.globalSelection.warehouseList = val.items;
                this.scope.globalSelection.transactionStatus.warehouses = false;
                this.refreshTransactionStatus();
            }, (val: M3.IMIResponse) => {
                this.scope.globalSelection.transactionStatus.warehouses = false;
                let error = "API: " + val.program + "." + val.transaction + ", Input: "+JSON.stringify(val.requestData)+", Error Code: " + val.errorCode;
                this.showError(error, [val.errorMessage]);
                this.scope.statusBar.push({message:error+" "+val.errorMessage,statusBarMessageType:h5.application.MessageType.Error,timestamp:new Date()});
                this.refreshTransactionStatus();
            });
        }

        /**
        * Opens About Page in a modal window
        */
        private openAboutPage() {
            let options: any = {
                animation: true,
                templateUrl: "views/About.html",
                size: "md",
                scope: this.scope
            }
            this.scope.modalWindow = this.$uibModal.open(options);
        }

        /**
        * Opens the modal window where user can change the application theme
        */
        private openChangeThemePage() {
            let options: any = {
                animation: true,
                templateUrl: "views/ChangeThemeModal.html",
                size: "md",
                scope: this.scope
            }
            this.scope.modalWindow = this.$uibModal.open(options);
        }

        /**
        * Opens the modal window where user can change the application wallpaper
        */
        private openChangeWallpaperPage() {
            let options: any = {
                animation: true,
                templateUrl: "views/ChangeWallpaperModal.html",
                size: "md",
                scope: this.scope
            }
            this.scope.modalWindow = this.$uibModal.open(options);
        }

        /**
        * Opens the modal window where user can change the application language
        */
        private openChangeAppLanguagePage() {
            let options: any = {
                animation: true,
                templateUrl: "views/ChangeLanguageModal.html",
                size: "md",
                scope: this.scope
            }
            this.scope.modalWindow = this.$uibModal.open(options);
        }

        /**
        * Change the application language
        * @param languageCode the language code to change
        */
        private changeAppLanguage(languageCode: string) {
            this.scope.supportedLanguages.forEach((language) => {
                if (angular.equals(language.languageCode, languageCode)) {
                    language.active = true;
                    this.scope.currentLanguage = languageCode;
                } else {
                    language.active = false;
                }
            });
            this.languageService.changeAppLanguage(languageCode).then((val: Odin.ILanguage) => {
                this.scope.appReady = false;
                this.closeModalWindow();
                this.resetUIGridsColumnDefs();
                this.$timeout(() => { this.scope.appReady = true; }, 1000);
            }, (errorResponse: any) => {
                Odin.Log.error("Error getting language " + errorResponse);
                this.scope.statusBar.push({ message: "Error getting language " + errorResponse, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            });
            this.storageService.setLocalData('h5.app.appName.language.selected', languageCode);
        }

        /**
        * Close the modal window if any opened
        */
        private closeModalWindow() {
            this.scope.modalWindow.close("close");
        }

        /**
        * Close the status bar panel in the footer
        */
        private closeStatusBar() {
            this.scope.statusBarIsCollapsed = true;
            this.scope.statusBar = [];
        }

        /**
        * Remove the row item at the status bar
        */
        private removeStatusBarItemAt(index: number): void {
            if (index || index == 0) {
                this.scope.statusBar.splice(this.scope.statusBar.length - 1 - index, 1);
            }
            this.scope.statusBarIsCollapsed = this.scope.statusBar.length == 0;
        };

        /**
        * Show the error message in application error panel
        * @param error the error prefix/description to show
        * @param errorMessages array of error messages to display
        */
        private showError(error: string, errorMessages: string[]) {
            this.scope["hasError"] = true;
            this.scope["error"] = error;
            this.scope["errorMessages"] = errorMessages;
            if (angular.isObject(this.scope["destroyErrMsgTimer"])) {
                this.$timeout.cancel(this.scope["destroyErrMsgTimer"]);
            }
            this.scope["destroyErrMsgTimer"] = this.$timeout(() => { this.hideError(); }, 10000);
        }

        /**
        * Function to hide/clear the error messages
        */
        private hideError() {
            this.scope["hasError"] = false;
            this.scope["error"] = null;
            this.scope["errorMessages"] = [];
            if (angular.isObject(this.scope["destroyErrMsgTimer"])) {
                this.$timeout.cancel(this.scope["destroyErrMsgTimer"]);
            }
            this.scope["destroyErrMsgTimer"] = undefined;
        }

        /**
         * Show the warning message in application error panel
         * @param warning the warning prefix/description to show
         * @param warningMessages array of warning messages to display
         */
        private showWarning(warning: string, warningMessages: string[]) {
            this.scope["hasWarning"] = true;
            this.scope["warning"] = warning;
            this.scope["warningMessages"] = warningMessages;
            if (angular.isObject(this.scope["destroyWarnMsgTimer"])) {
                this.$timeout.cancel(this.scope["destroyWarnMsgTimer"]);
            }
            this.scope["destroyWarnMsgTimer"] = this.$timeout(() => { this.hideWarning(); }, 10000);
        }

        /**
        * Function to hide/clear the warning messages
        */
        private hideWarning() {
            this.scope["hasWarning"] = false;
            this.scope["warning"] = null;
            this.scope["warningMessages"] = null;
            if (angular.isObject(this.scope["destroyWarnMsgTimer"])) {
                this.$timeout.cancel(this.scope["destroyWarnMsgTimer"]);
            }
            this.scope["destroyWarnMsgTimer"] = undefined;
        }

        /**
        * Show the info message in application error panel
        * @param info the warning prefix/description to show
        * @param infoMessages array of info messages to display
        */
        private showInfo(info: string, infoMessages: string[]) {
            this.scope["hasInfo"] = true;
            this.scope["info"] = info;
            this.scope["infoMessages"] = infoMessages;
            if (angular.isObject(this.scope["destroyInfoMsgTimer"])) {
                this.$timeout.cancel(this.scope["destroyInfoMsgTimer"]);
            }
            this.scope["destroyInfoMsgTimer"] = this.$timeout(() => { this.hideInfo(); }, 10000);
        }

        /**
        * Function to hide/clear the info messages
        */
        private hideInfo() {
            this.scope["hasInfo"] = false;
            this.scope["info"] = null;
            this.scope["infoMessages"] = null;
            if (angular.isObject(this.scope["destroyInfoMsgTimer"])) {
                this.$timeout.cancel(this.scope["destroyInfoMsgTimer"]);
            }
            this.scope["destroyInfoMsgTimer"] = undefined;
        }

        /**
        * Add function calls which are required to be called during application load data for the first time 
        */
        private loadGlobalData() {
            let userContext = this.scope.userContext;
            let globalConfig = this.scope.globalConfig;

            this.loadAppConfig(userContext.company, userContext.division, userContext.m3User, globalConfig.environment).then((val: any) => {
                //this.loadSampleDataList1(userContext.company, userContext.m3User);
                //this.loaditemGroupList(userContext.company);
               // this.listWarehouse();
                this.loadUOMList();
                this.loaditemType();
                //this.loadpriceList();
                //this.loadDefaultpriceList();
                //this.loadAttributesList();
                //this.loadProductGroup(userContext.company);
                //this.loadBusinessArea(userContext.company);
                console.log(userContext.USID);
                //let GEnv:string = "QA - 100-CTOS".substring(0,"QA - 100-CTOS".indexOf("-")).trim();
                //console.log("G Get env"+ GEnv);
                
                this.scope.interfaceItem.userInput1.USIDD =  { USID: userContext.USID };
                console.log(this.scope.interfaceItem.userInput1.USIDD);
                //this.listFacility(userContext.company, "");
                this.scope.interfaceItem.warningPrice = true;
                this.loadWarehouses(userContext.company);
                this.loadUserDetails(userContext.USID);
                this.loadApplicationData()
                this.loadDefaultFields();
                this.hideWarning();
            });
        }

        /**
        * Auto selecting an option based on the query parameters or logged in user's details
        */
        private loadDefaultFields() {
            let userContext = this.scope.userContext;
            let appConfig = this.scope.appConfig;
            let division = angular.isString(appConfig.searchQuery.divi) ? appConfig.searchQuery.divi : userContext.division;
            let warehouse;
            if (angular.isDefined(appConfig.searchQuery)) {
            warehouse = angular.isString(appConfig.searchQuery.whlo) ? appConfig.searchQuery.whlo : userContext.WHLO;
            }
            this.scope.globalSelection.sampleData1 = division;
            this.scope.globalSelection.warehouseData = warehouse;
            console.log("G appConfig.searchQuery.whlo--"+appConfig.searchQuery.whlo);
             console.log("G userContext.WHLO--"+userContext.WHLO);
            console.log("G warehouse--"+warehouse);
            this.scope.globalSelection.warehouse1 = { WHLO: warehouse };
            console.log(this.scope.globalSelection.warehouse1);
        }

        /**
        * Upon calling this function will reset the application data for all modules/tabs and load the application data for the active module/tab
        */
        private loadApplicationData() {
            // console.log("G loadApplicationData");
            let categories = ['globalSelection', 'interfaceItem','warehouseBasic'];
            this.clearData(categories);
            this.resetReloadStatus();
            this.loadData(this.scope.activeModule);
        }

        /**
        * Re-initializing or clearing the data based on modules or categories/business logic should be implemented here
        * @param categories the categories to clear data
        */
        private clearData(categories: string[]) {
            categories.forEach((category) => {
                if (category == "globalSelection") {
                    //Reset data from the global selection object
                }
                if (category == "interfaceItem") {
                    //Reset data from the specific module or category
                    console.log("G interfaceItem");
                    this.scope.globalSelection.uomList = [];
                    this.scope.interfaceItem.itemTypeList = [];
                    this.scope.interfaceItem.priceList = [];
                    
                }
                if (category == "warehouseBasic") {
                    //Reset data from the specific module or category
                   
                    
                }
            });
        }

        /**
        * Code for resetting reload status of all module's to stop showing loading indicator should be implemented here
        */
        private resetReloadStatus() {
            console.log("G resetReloadStatus");
            this.scope.interfaceItem.reload = true;
           
        }

        /**
        * Call this function from the view when a tab/module is selected to load
        * @param moduleId the selected module id
        */
        private moduleSelected(moduleId: number) {
            console.log("G moduleSelected");
            this.scope.activeModule = moduleId;
            this.scope.modules.forEach((appmodule) => {
                if (angular.equals(moduleId, appmodule.moduleId)) {
                    appmodule.active = true;
                } else {
                    appmodule.active = false;
                }
            });
            
            switch (this.scope.activeModule) {
                case 1:
                   this.scope.interfaceItem.reload = true; 
                    this.scope.interfaceItem.warningPrice = true;
                    break; 
                case 2:
                    this.scope.warehouseBasic.reload = true; 
                    break;  
            }
//                if(this.scope.activeModule == 1 ){
//                  
//                }
//            if(this.scope.activeModule == 2 ){
//                 
//                }
            this.storageService.setLocalData('h5.app.appName.module.selected', moduleId);
            this.loadData(this.scope.activeModule);
        }

        /**
        * This function will be called whenever the tab is selected, so add the functions calls with respect to the tab id
        * @param activeModule the module to activate/load
        */
        private loadData(activeModule: number) {
            console.log("G loadData");
            this.refreshTransactionStatus();
            switch (activeModule) {
                case 1:
                    //Call the primary function which is the entry function for the module
                    this.interfaceItem(this.scope.interfaceItem.reload);
                    break;
                case 2:
                    break;
                case 3:
                    break;
                case 4:
                    break;
            }
        }

        /**
        * This function will be called to iterate over the transactions states of a tab and set the loading indicator to true if there any running transactions
        */
        private refreshTransactionStatus() {
            //Global Status
            let isLoading = false;
            for (let transaction in this.scope.transactionStatus) {
                let value = this.scope.transactionStatus[transaction];
                if (value == true) {
                    isLoading = true;
                    break;
                }
            }

            for (let transaction in this.scope.globalSelection.transactionStatus) {
                let value = this.scope.globalSelection.transactionStatus[transaction];
                if (value == true) {
                    isLoading = true;
                    break;
                }
            }
            this.scope.loadingData = isLoading;
            if (isLoading) { return; }

            switch (this.scope.activeModule) {
                case 1:
                    for (let transaction in this.scope.interfaceItem.transactionStatus) {
                        let value = this.scope.interfaceItem.transactionStatus[transaction];
                        if (value == true) {
                            isLoading = true;
                            break;
                        }
                    }
                    this.scope.loadingData = isLoading;
                    break;
                case 2:
                    break;
                case 3:
                    break;
                case 4:
                    break;
            }
        }

        //************************************************Application specific functions starts************************************************

        /**
        * Load Application Configurations
        */
        private loadAppConfig(company: string, division: string, user: string, environment: string): ng.IPromise<any> {
            let deferred = this.$q.defer();
            this.scope.appConfig = this.scope.globalConfig.appConfig;
            this.scope.appConfig.searchQuery = this.$location.search();
            if (this.scope.appConfig.enableM3Authority) {
                this.scope.loadingData = true;
                this.scope.transactionStatus.appConfig = true;
                //To restrict functionalities based on logged in user's authority for a M3 Program, use the below service to set and use an authority flag
                let promise1 = this.appService.getAuthority(company, division, user, "CRS610", 1).then((result: boolean) => {
                    //this.scope.appConfig.allowSaveData = result;
                });
                let promises = [promise1];
                this.$q.all(promises).finally(() => {
                    deferred.resolve(this.scope.appConfig);
                    this.scope.transactionStatus.appConfig = false;
                    this.refreshTransactionStatus();
                    Odin.Log.debug("Application configurations"+JSON.stringify(this.scope.appConfig));
                });
            } else {
                deferred.resolve(this.scope.appConfig);
            }
            return deferred.promise;
        }
        
        /**
        * validateItem
        * @param user the company
        * @param user the m3 user
        */
        private validateItem() {
            
            let ITNO: any;
            let ITNE: any;
            let ITDS: any;
            let ITTY: any;
            let PRRF: any;
            let SUNO: any;
            let AGNB: any;
            let SAPR: any;
            let PUPR: any;
            
            let BUYE: any;
            let RESP: any;
            let ATMO: any;
            let UNMS: any;
            let ITGR: any;
            let BUAR: any;
            let ITCL: any;
            let OVH1: any;
            let OVH2: any;
            
            let statusType: any;
            //this.loadnewItemNumberWH("0-1210-33629");
            ITNO = this.scope.interfaceItem.userInput.IFIN;
            ITDS = this.scope.interfaceItem.userInput.ITDS;
            ITTY = this.scope.interfaceItem.userSelection.itemType;
            statusType = this.scope.interfaceItem.userSelection.statusType;
            console.log("G statusType----"+statusType);
            SUNO = this.scope.interfaceItem.userInput.SUNO;
            PUPR = this.scope.interfaceItem.userInput.PUPR;
            if (!angular.isUndefined(this.scope.interfaceItem.userInput1.USIDD.USID) ) {
            if (JSON.stringify(this.scope.interfaceItem.userInput1.USIDD.USID) != undefined) {
                RESP = this.scope.interfaceItem.userInput1.USIDD.USID.replace("\"","");
                console.log("G RESP----"+RESP);
                }
                }else{
                RESP = this.scope.interfaceItem.userInput1.USIDD;
                console.log("G replace----"+RESP);
            }
            if (ITNO != undefined) {
            if(angular.equals(this.scope.interfaceItem.checkITNO, ITNO)){
                
            }else{
             this.scope.interfaceItem.warningPrice = true;
             this.scope.interfaceItem.checkITNO = ITNO;   
            }
            }
            UNMS = this.scope.globalSelection.uomData;
            OVH1 = this.scope.interfaceItem.userInput.OVH1;
            OVH2 = this.scope.interfaceItem.userInput.OVH2;
            this.scope.interfaceItem.enablebutton = false;
            let checkRecord;
            checkRecord = true;
            if (ITNO != undefined && !angular.equals("", ITNO)) {
            if (/[~`!#$%\^&*+=@\_\[\]\\';,/{}()|\\":<>\?]/g.test(ITNO))   
             {
                     checkRecord = false;
                //show warning message
                let warningMessage = "Please Enter valid Item Number, only Allowed special characters are  ' - ' and  ' . '";
                this.showWarning(warningMessage, null);
                this.scope.interfaceItem.enablebutton = true;
                 return;
                }
                }
            
//            if (ITNO == undefined || angular.equals("", ITNO) && angular.equals("", ITDS)) {
//                     checkRecord = false;
//                //show warning message
//                let warningMessage = "Please Enter The Item Name";
//                this.showWarning(warningMessage, null);
//                return;
//                }
            
             let WHLO1 = "";
            if (!angular.isUndefined(this.scope.globalSelection.warehouse1.WHLO) ) {
            if (JSON.stringify(this.scope.globalSelection.warehouse1.WHLO) != undefined) {
                WHLO1 = this.scope.globalSelection.warehouse1.WHLO.replace("\"","");
                //this.scope.interfaceItem.userInput1.USIDD =  { USID: RESP };
                //this.scope.interfaceItem.userInput1.USIDD = RESP;
                //console.log("G REPLACE----");
                console.log("G WHLO1----"+WHLO1);
                }
                }else{
                WHLO1 = this.scope.globalSelection.warehouse1;
                console.log("G NO REPLACE----"+WHLO1);
            }
            
            
            
             if (ITTY == undefined || angular.equals("", ITTY)) {
                     checkRecord = false;
                //show warning message
                let warningMessage = "Please Select Item Type";
                this.showWarning(warningMessage, null);
                 this.scope.interfaceItem.enablebutton = true;
                return;
                }
           
            if (angular.equals("301", ITTY)) {
            
            if (ITNO == undefined || angular.equals("", ITNO)) {
                checkRecord = false;
                //show warning message
                let warningMessage = "Please Enter valid Item Number";
                this.showWarning(warningMessage, null);
                this.scope.interfaceItem.enablebutton = true;
                 return;
            
           }
                
                if (ITNO.slice(-2).toLowerCase().indexOf("to") == -1 && ITNO.toLowerCase().slice(-3).indexOf("usd") == -1) {
                checkRecord = false;
                //show warning message
                let warningMessage = "Suffix TO or USD has to be added for this item type";
                this.showWarning(warningMessage, null);
                 this.scope.interfaceItem.enablebutton = true;
                return;
                     }
                
//                if (ITNE == undefined || angular.equals("", ITNE)) {
//                checkRecord = false;
//                //show warning message
//                let warningMessage = "Please Enter valid Ext Item Number";
//                this.showWarning(warningMessage, null);
//                this.scope.interfaceItem.enablebutton = true;
//                 return;
//            
//           }
                
            
                
             }
            
            if (angular.equals("302", ITTY)) {
            
            if (ITNO == undefined || angular.equals("", ITNO)) {
                checkRecord = false;
                //show warning message
                let warningMessage = "Please Enter valid Item Number";
                this.showWarning(warningMessage, null);
                this.scope.interfaceItem.enablebutton = true;
                 return;
            
           }

//                if (ITNE == undefined || angular.equals("", ITNE)) {
//                checkRecord = false;
//                //show warning message
//                let warningMessage = "Please Enter valid Ext Item Number";
//                this.showWarning(warningMessage, null);
//                this.scope.interfaceItem.enablebutton = true;
//                 return;
//            
//           }
                
            
                
             }
            
            
            
            if (angular.equals("303", ITTY)) {
            
            if (ITNO == undefined || angular.equals("", ITNO)) {
                checkRecord = false;
                //show warning message
                let warningMessage = "Please Enter valid Item Number";
                this.showWarning(warningMessage, null);
                this.scope.interfaceItem.enablebutton = true;
                 return;
            
           }
                if (ITNO.slice(-2).toLowerCase().indexOf("co") == -1) {
                checkRecord = false;
                //show warning message
                let warningMessage = "Suffix CO has to be added for Cust. Owned Parts";
                this.showWarning(warningMessage, null);
                 this.scope.interfaceItem.enablebutton = true;
                return;
                     }
                
//                if (ITNE == undefined || angular.equals("", ITNE)) {
//                checkRecord = false;
//                //show warning message
//                let warningMessage = "Please Enter valid Ext Item Number";
//                this.showWarning(warningMessage, null);
//                this.scope.interfaceItem.enablebutton = true;
//                 return;
//            
//           }
           }
            
            
            if (angular.equals("401", ITTY)) {
            
            if (ITNO == undefined || angular.equals("", ITNO)) {
                checkRecord = false;
                //show warning message
                let warningMessage = "Please Enter valid Item Number";
                this.showWarning(warningMessage, null);
                this.scope.interfaceItem.enablebutton = true;
                 return;
            
           }
                
                if (ITNO.slice(-2).toLowerCase().indexOf("to") == -1 && ITNO.toLowerCase().slice(-3).indexOf("usd") == -1) {
                checkRecord = false;
                //show warning message
                let warningMessage = "Suffix TO or USD has to be added for this item type";
                this.showWarning(warningMessage, null);
                 this.scope.interfaceItem.enablebutton = true;
                return;
                     }
                
           }
            
         
             if (ITDS == undefined || angular.equals("", ITDS)) {
                  checkRecord = false;
                //show warning message
                let warningMessage = "Please Enter Item Name";
                this.showWarning(warningMessage, null);
                 this.scope.interfaceItem.enablebutton = true;
                return;
                }
            
//             if (ITGR == undefined || angular.equals("", ITGR)) {
//                  checkRecord = false;
//                //show warning message
//                let warningMessage = "Please Enter Item Group";
//                this.showWarning(warningMessage, null);
//                 this.scope.interfaceItem.enablebutton = true;
//                return;
//                }
//             if (ITCL == undefined || angular.equals("", ITCL)) {
//                  checkRecord = false;
//                //show warning message
//                let warningMessage = "Please Enter Product Group";
//                this.showWarning(warningMessage, null);
//                 this.scope.interfaceItem.enablebutton = true;
//                return;
//                }
//             if (BUAR == undefined || angular.equals("", BUAR)) {
//                  checkRecord = false;
//                //show warning message
//                let warningMessage = "Please Enter Business Area";
//                this.showWarning(warningMessage, null);
//                 this.scope.interfaceItem.enablebutton = true;
//                return;
//                }
             if (statusType == undefined || angular.equals("", statusType)) {
                     checkRecord = false;
                //show warning message
                let warningMessage = "Please Select a Status";
                this.showWarning(warningMessage, null);
                 this.scope.interfaceItem.enablebutton = true;
                return;
                }
            if (UNMS == undefined || angular.equals("", UNMS)) {
                  checkRecord = false;
                //show warning message
                let warningMessage = "Please Enter Basic U/M";
                this.showWarning(warningMessage, null);
                 this.scope.interfaceItem.enablebutton = true;
                return;
                }
            if (RESP == undefined || angular.equals("", RESP)) {
                  checkRecord = false;
                //show warning message
                let warningMessage = "Please Enter Item Responsible";
                this.showWarning(warningMessage, null);
                 this.scope.interfaceItem.enablebutton = true;
                return;
                }
//            if (SUNO == undefined || angular.equals("", SUNO)) {
//               checkRecord = false;
//                //show warning message
//                let warningMessage = "Please Enter Supplier Number";
//                this.showWarning(warningMessage, null);
//                this.scope.interfaceItem.enablebutton = true;
//                return;
//                }
//             if (PRRF == undefined || angular.equals("", PRRF)) {
//                     checkRecord = false;
//                //show warning message
//                let warningMessage = "Please Select Price List";
//                this.showWarning(warningMessage, null);
//                return;
//                }
           
//           if (SUNO != undefined && !angular.equals("", SUNO)) {
//                 if(angular.equals("", AGNB) || AGNB == undefined){
//                     checkRecord = false;
//                //show warning message
//                let warningMessage = "Please Enter Agreement Number";
//                this.showWarning(warningMessage, null);
//                return;
//                }
//                }
             if (angular.equals("302", ITTY) ||angular.equals("301", ITTY) || angular.equals("401", ITTY) || angular.equals("402", ITTY)) {
                if (PUPR == undefined || angular.equals("", PUPR)  || isNaN(PUPR)) {
                     checkRecord = false;
                //show warning message
                let warningMessage = "Please Enter Valid Purchase Price";
                this.showWarning(warningMessage, null);
                 this.scope.interfaceItem.enablebutton = true;
                return;
                }
             }
            if (angular.equals("302", ITTY)) {
//             if (PUPR != undefined && !angular.equals("", PUPR)) {
//                 if (AGNB == undefined || angular.equals("", AGNB)) {
//                 checkRecord = false;
//                //show warning message
//                let warningMessage = "Please Select Valid Purchase Agreement";
//                this.showWarning(warningMessage, null);
//                 this.scope.interfaceItem.enablebutton = true;
//                return;
//                     }
//                }
             }
            
          if (angular.equals("401", ITTY) || angular.equals("402", ITTY)) {
            
           if (OVH1 == undefined || angular.equals("", OVH1) || OVH1 == null   || isNaN(OVH1)) {
                checkRecord = false;
                //show warning message
                let warningMessage = "Please Enter valid Core Purchase Cost";
                this.showWarning(warningMessage, null);
                this.scope.interfaceItem.enablebutton = true;
                 return;
            
           }
                
           if (OVH2 == undefined || angular.equals("", OVH2)  || OVH2 == null   || isNaN(OVH2)) {
                checkRecord = false;
                //show warning message
                let warningMessage = "Please Enter valid Core Sales Charge";
                this.showWarning(warningMessage, null);
                this.scope.interfaceItem.enablebutton = true;
                 return;
            
           }
           }
            
            if (WHLO1 == undefined || angular.equals("", WHLO1)) {
                     checkRecord = false;
                //show warning message
                let warningMessage = "Please Select Warehouse";
                this.showWarning(warningMessage, null);
                 this.scope.interfaceItem.enablebutton = true;
                return;
                }
            
               let userContext = this.scope.userContext;
               if(angular.equals(this.scope.interfaceItem.userEmail,"") && this.scope.interfaceItem.warningEmail){
                   checkRecord = false;
                   this.scope.interfaceItem.warningEmail  = false;
                   this.showWarning("Requestor " + RESP + " EMAIL is not set up to receive e-mails, Please check MNS150/CRS111", null); 
                   this.scope.interfaceItem.enablebutton = true;
                   return;
                }
            
               if(checkRecord){
            this.scope.interfaceItem.warningEmail  = true;
                   if(!angular.equals(this.scope.interfaceItem.userEmail,"")){
                      this.processItem(); 
                   }else{
                      this.getUserDetails(RESP) 
                   }
            
               }else{
                console.log("G Else");
            this.scope.interfaceItem.enablebutton = true;    
            }
            
            }
        
        
        
        
         /**
        * processItems
        * @param user the company
        * @param user the m3 user
        */
        private processItem() {
            let promises = [];
            let ITNO: any;
            let ITDS: any;
            let FUDS: any;
            let ITTY: any;
            let STAT: any;
            let SAPR: any;
            let SUNO: any;
            let UNMS: any;
            let PUPR: any;
            let SITE: any;
            let FILE: any;
           let OVH1: any;
           let OVH2: any;  
            let statusType: any;
            this.scope.interfaceItem.enablebutton = false;
            let itemExists: boolean;
            let userContext = this.scope.userContext;
            let RESP = userContext.USID;
            ITNO =  this.scope.interfaceItem.userInput.IFIN;
            //console.log("G ITNO"+ITNO);
            if (ITNO != undefined && !angular.equals("", ITNO)) {
                ITNO =  ITNO.toUpperCase();
                 //ITNO =  ITNO.replace(/(?!\w|\s)./g, '').replace(/\s+/g, ' ').replace(/_/g, "").replace(/^(\s*)([\W\w]*)(\b\s*$)/g, '$2');
                }
            ITDS = this.scope.interfaceItem.userInput.ITDS;
            FUDS = this.scope.interfaceItem.userInput.FUDS;
            ITTY = this.scope.interfaceItem.userSelection.itemType;
            statusType = this.scope.interfaceItem.userSelection.statusType;
            STAT = this.scope.globalSelection.status.selected;
             SUNO = this.scope.interfaceItem.userInput.SUNO;
            let WHLO1 = "";
            if (!angular.isUndefined(this.scope.globalSelection.warehouse1.WHLO) ) {
            if (JSON.stringify(this.scope.globalSelection.warehouse1.WHLO) != undefined) {
                WHLO1 = this.scope.globalSelection.warehouse1.WHLO.replace("\"","");
                //this.scope.interfaceItem.userInput1.USIDD =  { USID: RESP };
                //this.scope.interfaceItem.userInput1.USIDD = RESP;
                //console.log("G REPLACE----");
                }
                }else{
                WHLO1 = this.scope.globalSelection.warehouse1;
                //console.log("G NO REPLACE----");
            }
            if (!angular.isUndefined(this.scope.interfaceItem.userInput1.USIDD.USID) ) {
            if (JSON.stringify(this.scope.interfaceItem.userInput1.USIDD.USID) != undefined) {
                RESP = this.scope.interfaceItem.userInput1.USIDD.USID.replace("\"","");
                //this.scope.interfaceItem.userInput1.USIDD =  { USID: RESP };
                //this.scope.interfaceItem.userInput1.USIDD = RESP;
                //console.log("G REPLACE----");
                }
                }else{
                RESP = this.scope.interfaceItem.userInput1.USIDD;
                //console.log("G NO REPLACE----");
            }
            //console.log("G RESP----"+RESP);
            //ATMO = this.scope.globalSelection.attributeData;
            UNMS = this.scope.globalSelection.uomData;
             PUPR = this.scope.interfaceItem.userInput.PUPR;
            SITE = this.scope.interfaceItem.userInput.SITE;
            if (angular.equals("401", ITTY) || angular.equals("402", ITTY)) {
            OVH1 = this.scope.interfaceItem.userInput.OVH1;
            OVH2 = this.scope.interfaceItem.userInput.OVH2;
            }
            let date = new Date();
            date.setMonth(date.getMonth());
            let fromDate = this.$filter('date')(date, "yyyyMMdd");
            //console.log("G ITGR" +ITGR);
            //console.log("G RESP" +RESP);
            itemExists = false;
             if(ITNO == undefined){
                 //console.log("G Inside");
                 ITNO = "";
             }
            
            if(RESP == undefined){
                 RESP = "";
             }
            if(UNMS == undefined){
                 UNMS = "";
             }
            
            if(SUNO == undefined){
                 SUNO = "";
             }
             if(WHLO1 == undefined){
                 WHLO1 = "";
             }
             if (SITE != undefined && !angular.equals("", SITE)) {
                SITE =  SITE.toUpperCase();
                }
            
                FILE = "ITMAPP";
                STAT = "10";
                let currentDate: any = new Date(); 
                currentDate.setDate(currentDate.getDate()); 
                let curmonth = "0"+(currentDate.getMonth()+1);
                let curdate = "0"+currentDate.getDate();
                curmonth = curmonth.slice(-2);
                curdate = curdate.slice(-2);
                let hours:any = currentDate.getHours();
                let minutes:any = currentDate.getMinutes();
                let seconds:any = currentDate.getSeconds();
                if (hours < 10) { 
                        hours = '0' + hours; 
                    }
               if (minutes < 10) { 
                        minutes = '0' + minutes; 
                    } 
                    if (seconds < 10) { 
                        seconds = '0' + seconds; 
                    } 
          
                let requestDate =  currentDate.getFullYear()+"" + curmonth +""  + curdate;
                let requestTime = hours+""+minutes+""+seconds;
                this.scope.loadingData = true;
                this.scope.interfaceItem.transactionStatus.createItems = true;
                this.scope.interfaceItem.finalITNO = "";
                let promise1 = this.appService.checkM3Item("ITMAPP",ITNO).then((valM3GetItem: M3.IMIResponse)=>{
                    itemExists = true;
                   this.showWarning("Item number " + valM3GetItem.item.PK01 + " already exists.", null); 
                    console.log("G RECORD EXISTS"+ ITNO);
               }, (err: M3.IMIResponse)=> {
                itemExists = false;
               });
            promises.push(promise1);
            
            this.$q.all(promises).then((results: [M3.IMIResponse]) => {
               if(!itemExists){
                    console.log("G PROMISE OUT EXISTS"+ ITNO);
                this.appService.processM3Item("ITMAPP",STAT,ITNO, ITDS,FUDS,ITTY,UNMS,SUNO, SITE,PUPR,OVH1,OVH2,RESP,WHLO1,requestTime).then((valM3AddItem: M3.IMIResponse)=>{
                console.log("G PROMISE APP IN ITEM CREATED "+ ITNO + "----"+ this.scope.interfaceItem.userEmail);
                this.appService.processM3ItemDates("ITMAPP",ITNO,requestDate,requestTime,this.scope.interfaceItem.userEmail,statusType).then((valM3AddItem: M3.IMIResponse)=>{
                this.$timeout(() => {
                    this.showInfo("Item Request for " + ITNO + " is processed successfully.", null); 
                    this.scope.interfaceItem.transactionStatus.createItems = false;
                    this.refreshTransactionStatus();
                    this.scope.interfaceItem.enablebutton = true;
                    } , 3000);
               }, (err: M3.IMIResponse)=> {
                    this.scope.interfaceItem.transactionStatus.createItems = false;
                    this.refreshTransactionStatus();
                    this.scope.interfaceItem.enablebutton = true;
                   this.showError("Error while updating request date detail ", [err.errorMessage]);
                   this.appService.deleteM3Item("ITMAPP",ITNO).then((valM3AddItem: M3.IMIResponse)=>{
                 }, (err: M3.IMIResponse)=> {
                   //this.showError("Error while updating request date detail ", [err.errorMessage]);
                  });
                  });
                 }, (err: M3.IMIResponse)=> {
                    this.showError("Item Request is unsuccessful", [err.errorMessage]);
                    this.scope.interfaceItem.transactionStatus.createItems = false;
                    this.refreshTransactionStatus();
                    this.scope.interfaceItem.enablebutton = true;
                   console.log("G PROMISE ERROR IN ITEM CREATED "+ ITNO);
                   }).finally(() => {
                    console.log("G PROMISE FINALLY ITEM CREATED "+ ITNO);
                    itemExists = false;
                });
                }else{
                itemExists = false;
                this.scope.interfaceItem.enablebutton = true;
                this.scope.interfaceItem.transactionStatus.createItems = false;
                this.refreshTransactionStatus();
                       console.log("G PROMISE EXISTS"+ ITNO);
                }
                });
            
            
        }
        
        private loadUserDetails(USID: string): void{
            this.scope.interfaceItem.userEmail = "";
            this.scope.interfaceItem.warningEmail  = true;
              this.appService.getUserdetails(USID).then((valUserDetails: M3.IMIResponse)=>{
                  this.scope.interfaceItem.userEmail = valUserDetails.item.EMAL;
                  if(angular.equals(this.scope.interfaceItem.userEmail,"")){
                   this.showWarning("Requestor " + valUserDetails.item.USID + " EMAIL is not set up to receive e-mails, Please check MNS150/CRS111", null); 
                      }
                 }, (err: M3.IMIResponse)=> {
                   //this.showError("Error while updating request date detail ", [err.errorMessage]);
                     this.scope.interfaceItem.userEmail =  "";
                     this.showError("Error while Processing MNS150 user details", [err.errorMessage]);
                  });
        }
        
        private getUserDetails(USID: string): void{
            this.scope.interfaceItem.userEmail = "";
            this.appService.getUserdetails(USID).then((valUserDetails: M3.IMIResponse)=>{
                  this.scope.interfaceItem.userEmail = valUserDetails.item.EMAL;
                   this.processItem();
                 }, (err: M3.IMIResponse)=> {
                   //this.showError("Error while updating request date detail ", [err.errorMessage]);
                     this.scope.interfaceItem.userEmail =  "";
                     this.showError("Error while Processing MNS150 user details", [err.errorMessage]);
                  });
        }

        
        private clearFields(): void{
            this.scope.interfaceItem.userInput.IFIN = "";
            this.scope.interfaceItem.userInput.ITDS = "";
            this.scope.interfaceItem.userInput.FUDS = "";
            
            this.scope.interfaceItem.userInput.SITE = "";
            this.scope.interfaceItem.userInput.SUNO = "";
            this.scope.interfaceItem.userInput.AGNB = "";
            this.scope.interfaceItem.userInput.AGDT = "";
            this.scope.interfaceItem.userInput.PUPR = "";
            this.scope.globalSelection.uomData = "";
            this.scope.interfaceItem.userSelection.itemType = "";
            this.scope.interfaceItem.userSelection.statusType = "";
            this.scope.interfaceItem.userInput.ITNE = "";
            this.scope.interfaceItem.userInput.OVH1 = "";
            this.scope.interfaceItem.userInput.OVH2 = "";
            this.scope.globalSelection.warehouse1 = { selected: ""};
            }
        

        
        private clearWH(): void {
            this.scope.warehouseBasic.warehouseDataList1 = [];
        }
        
       
        
        /**
        * Load the Item Type
        * @param user the company
        * @param user the m3 user
        */
        private loaditemType() {
            this.scope.loadingData = true;
            this.scope.globalSelection.transactionStatus.sampleDataList1 = true;
            this.appService.getItemType("").then((val: M3.IMIResponse) => {
                //console.log(val.items);
                this.scope.interfaceItem.itemTypeList = val.items;
            }, (err: M3.IMIResponse) => {
                //let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError("Error Loading Item Type", [err.errorMessage]);
            // this.scope.statusBar.push({message:error+" "+err.errorMessage,statusBarMessageType:h5.application.MessageType.Error,timestamp:new Date()});
               }).finally(() => {
                this.scope.globalSelection.transactionStatus.sampleDataList1 = false;
                this.refreshTransactionStatus();
            });
        }
        
         /**
        * Load the Item Type
        * @param user the company
        * @param user the m3 user
        */
        private checkitemType(checkitemType: any) {
             if (angular.isUndefined(checkitemType) ) {
               this.scope.interfaceItem.enableFields = true;
                 this.scope.interfaceItem.userInput.CUCD = "";
                this.scope.interfaceItem.userInput.SAPR = "";
                this.scope.interfaceItem.userInput.FVDT = "";
                this.scope.interfaceItem.userInput.PRRF = "";
                return;
            }
            this.scope.interfaceItem.warningEmail  = true;
            if(angular.equals("310", checkitemType.ITTY) || angular.equals("303", checkitemType.ITTY)){
                this.scope.interfaceItem.userInput.AGNB = "";
                this.scope.interfaceItem.userInput.PUPR = "";
                this.scope.interfaceItem.userInput.CUCD = "";
                this.scope.interfaceItem.userInput.SAPR = "";
                this.scope.interfaceItem.userInput.FVDT = "";
                this.scope.interfaceItem.userInput.PRRF = "";
            this.scope.interfaceItem.enableFields = false;
            }else{
            this.scope.interfaceItem.enableFields = true;
                
           }
            if(angular.equals("301", checkitemType.ITTY) || angular.equals("303", checkitemType.ITTY)){
                this.scope.interfaceItem.itmType = "show";
            }else{
                this.scope.interfaceItem.itmType = "hide";
                this.scope.interfaceItem.userInput.ITNE = "";
            }
            if(angular.equals("401", checkitemType.ITTY) || angular.equals("402", checkitemType.ITTY)){
                this.scope.interfaceItem.attrType = "show";
                this.scope.interfaceItem.userInput.ATMO = "CORE";
               }else{
                this.scope.interfaceItem.userInput.ATMO = "";
                this.scope.interfaceItem.attrType = "hide";
                this.scope.interfaceItem.userInput.OVH1 = "";
                this.scope.interfaceItem.userInput.OVH2 = "";
                }
            
             //if(angular.equals("301", checkitemType.ITTY) || angular.equals("302", checkitemType.ITTY)|| angular.equals("401", checkitemType.ITTY) || angular.equals("402", checkitemType.ITTY)){
             if(angular.equals("302", checkitemType.ITTY)|| angular.equals("401", checkitemType.ITTY) || angular.equals("402", checkitemType.ITTY)){
                this.scope.interfaceItem.userInput.PRRF = { selected: "LIST PRICE"};
                this.scope.interfaceItem.userInput.CUCD = this.scope.interfaceItem.defaultCUCD;
                this.scope.interfaceItem.userInput.FVDT = this.scope.interfaceItem.defaultFromDate;
                //console.log("G PRICE LIST SELECTED"+this.scope.interfaceItem.userInput.PRRF.selected);
            }else{
                this.scope.interfaceItem.userInput.PRRF = { selected: ""};
                this.scope.interfaceItem.userInput.CUCD = "";
                this.scope.interfaceItem.userInput.FVDT = "";
            
            }
            
            if(angular.equals("401", checkitemType.ITTY)){
                this.scope.interfaceItem.label = "cost";
            }else if(angular.equals("402", checkitemType.ITTY)){
                this.scope.interfaceItem.label = "pprice";
            }else{
                 this.scope.interfaceItem.label = "pcost";
                }
            
//            if(angular.equals("302", checkitemType.ITTY)){
//                 this.scope.interfaceItem.chkItemType = "302"; 
//            }else{
//                 this.scope.interfaceItem.chkItemType = ""; 
//                }
            
        }
        
        private checkresp(checkresp: any) {
            console.log("G checkresp"+checkresp);
             if (angular.isUndefined(checkresp) ) {
               this.scope.interfaceItem.userEmail = "";
                 this.scope.interfaceItem.userInput1.USIDD = {USID: undefined};
                 this.scope.interfaceItem.userInput1.USIDD = "";
               //this.scope.interfaceItem.userInput1.USIDD =  { USID: "" };
                return;
            }
               this.loadUserDetails(checkresp.USID);
           }
        
        private checkwhlo(checkwhlo: any) {
            console.log("G checkwhlo"+checkwhlo);
             if (angular.isUndefined(checkwhlo) ) {
                 this.scope.globalSelection.warehouse1 = { WHLO: undefined };
                 this.scope.globalSelection.warehouse1 = "";
               //this.scope.interfaceItem.userInput1.USIDD =  { USID: "" };
                return;
            }
             
           }
        
        
        
          /**
        * Load the supplier list with details
        * @param company the company
        */
        private loadSupp(): void {
            if (this.scope.interfaceItem.userInput.SUN1.length < 6) {
                return;
            }
            this.supplierSelectedTXT(this.scope.interfaceItem.userInput.SUN1)
            //console.log(this.scope.interfaceItem.userInput.SUN1);
        }
        
        
        
         /**
        * Load the supplier list with details
        * @param company the company
        */
        private loadSupplierList(searchInput: string): void {
            if (angular.isUndefined(searchInput) || searchInput.length < 2) {
                return;
            }
             let newSearchQuery = "SearchFields:SUNO;SUNM " + searchInput + "*";
            //console.log("G SUPP searchInput"+newSearchQuery);
            this.scope.interfaceItem.transactionStatus.supplierList = true;
            this.appService.searchSupplier(newSearchQuery).then((val: M3.IMIResponse) => {
                this.scope.interfaceItem.supplierList = val.items;
                this.scope.interfaceItem.transactionStatus.supplierList = false;
                this.refreshTransactionStatus();
            }, (err: M3.IMIResponse) => {
                this.scope.interfaceItem.transactionStatus.supplierList = false;
                let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
                this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            
                this.refreshTransactionStatus();
            });
        }
        
         /**
        * Load the Buyer
        * @param user the company
        * @param user the m3 user
        */
        private loadBuyer(searchInput: string) {
            
             if (angular.isUndefined(searchInput) || searchInput.length < 2) {
                return;
            }
             let newSearchQuery = "SearchFields:USID;TX40 " + searchInput + "*";
            this.scope.loadingData = true;
            this.scope.interfaceItem.transactionStatus.buyerIList = true;
            this.appService.getUser(newSearchQuery).then((val: M3.IMIResponse) => {
                //console.log(val.items);
                this.scope.interfaceItem.buyerList = val.items;
                this.scope.interfaceItem.transactionStatus.buyerIList = false;
                this.refreshTransactionStatus();
            }, (err: M3.IMIResponse) => {
                //let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError("Error Loading Buyer", [err.errorMessage]);
                //this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            }).finally(() => {
                this.scope.interfaceItem.transactionStatus.buyerIList = false;
                this.refreshTransactionStatus();
            });
        }
    
      /**
        * Load the loadResponsible
        * @param user the company
        * @param user the m3 user
        */
        private loadResponsible(searchInput: string) {
            
             if (angular.isUndefined(searchInput) || searchInput.length < 2) {
                return;
            }
            //console.log("G searchInput"+searchInput);
             let newSearchQuery = "SearchFields:USID;TX40 " + searchInput + "*";
            //console.log("G newSearchQuery"+newSearchQuery);
            this.scope.loadingData = true;
            this.scope.interfaceItem.transactionStatus.responsibleIList = true;
            this.appService.getResponsible(newSearchQuery).then((val: M3.IMIResponse) => {
                //console.log(val.items);
                this.scope.interfaceItem.responsibleList = val.items;
                this.scope.interfaceItem.transactionStatus.responsibleIList = false;
                this.refreshTransactionStatus();
            }, (err: M3.IMIResponse) => {
                //let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError("Error Loading Responsible", [err.errorMessage]);
                //this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            }).finally(() => {
                this.scope.interfaceItem.transactionStatus.responsibleIList = false;
                this.refreshTransactionStatus();
            });
        }
        
        /**
        * Load the loadResponsible
        * @param user the company
        * @param user the m3 user
        */
        private loadDefaultResponsible(USID: any) {
            this.scope.loadingData = true;
            this.scope.interfaceItem.transactionStatus.defaultresponsibleIList = true;
            this.appService.getDefaultResponsible(USID).then((val: M3.IMIResponse) => {
                console.log("G DEFAULT" + val.item.USID);
                this.scope.interfaceItem.userInput1.USIDD =  { USID: val.item.USID };
                this.scope.interfaceItem.transactionStatus.defaultresponsibleIList = false;
                this.refreshTransactionStatus();
            }, (err: M3.IMIResponse) => {
                //let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError("Error Loading Responsible", [err.errorMessage]);
                //this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            }).finally(() => {
                this.scope.interfaceItem.transactionStatus.defaultresponsibleIList = false;
                this.refreshTransactionStatus();
            });
        }
        
        /**
        * Load the supplier list with details
        * @param company the company
        */
        private supplierSelectedTXT(selectedSUNO: any): void {
            
            this.scope.interfaceItem.userInput.AGNB = "";
            this.scope.interfaceItem.transactionStatus.supplierList = true;
            this.appService.LstAgrHeadBySup(selectedSUNO).then((val: M3.IMIResponse) => {
                this.scope.interfaceItem.agreementList = val.items;
                this.scope.interfaceItem.transactionStatus.supplierList = false;
                this.refreshTransactionStatus();
            }, (err: M3.IMIResponse) => {
                this.scope.interfaceItem.transactionStatus.supplierList = false;
                let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
                this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            
                this.refreshTransactionStatus();
            });
        }
        
        
        private calculateQty(): void{
            //console.log("G Click NEW");
             let ITTY: any;
            let newSAPR: any;
             ITTY = this.scope.interfaceItem.userSelection.itemType;
            //console.log("G Click 1---"+this.scope.interfaceItem.userInput.MULT);
            // console.log("G this.scope.interfaceItem.userInput.PUPR---"+this.scope.interfaceItem.userInput.PUPR);
            if (angular.equals("", ITTY) && ITTY == undefined) {
                this.scope.interfaceItem.userInput.MULT="";
                this.scope.interfaceItem.userInput.SAPR="";
                return;
            }
            
            if (angular.equals("", this.scope.interfaceItem.userInput.PUPR) || this.scope.interfaceItem.userInput.PUPR==null) {
                this.scope.interfaceItem.userInput.SAPR = "";
                return;
            }
             if (!angular.equals("303", ITTY) && !angular.equals("", ITTY) && ITTY != undefined) {
                  if(this.scope.interfaceItem.userInput.PUPR != undefined && !angular.equals("", this.scope.interfaceItem.userInput.PUPR)){
                    // console.log("G IN 2---"+this.scope.interfaceItem.userInput.PUPR); 
                    if(!angular.equals("", this.scope.interfaceItem.userInput.MULT)  && 
                         this.scope.interfaceItem.userInput.MULT != 0.00 && 
                         this.scope.interfaceItem.userInput.MULT !=0.0){
                    //console.log("G IN 3---"+this.scope.interfaceItem.userInput.PUPR);
                        newSAPR = (this.scope.interfaceItem.userInput.PUPR * this.scope.interfaceItem.userInput.MULT);
                   this.scope.interfaceItem.userInput.SAPR = parseFloat(newSAPR.toFixed(3));
                       // console.log("G IN 4---"+(this.scope.interfaceItem.userInput.PUPR * this.scope.interfaceItem.userInput.MULT).toFixed(3));
                    }
                      } 
                 }    
        }
        
        
        
        
        
       

        /**
        * Load the sample data list 1 (divisions)
        * @param user the company
        * @param user the m3 user
        */
        private loadSampleDataList1(company: string, user: string) {
            this.scope.loadingData = true;
            this.scope.globalSelection.transactionStatus.sampleDataList1 = true;
            this.appService.getDivisionList(company, null).then((val: M3.IMIResponse) => {
                this.scope.globalSelection.sampleDataList1 = val.items;
            }, (err: M3.IMIResponse) => {
                let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
                this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            }).finally(() => {
                this.scope.globalSelection.transactionStatus.sampleDataList1 = false;
                this.refreshTransactionStatus();
            });
        }

       
        
         /**
        * Load the sample data list 2 (UOM)
        * @param company the company
        */
        private loadUOMList(): void {
            this.scope.loadingData = true;
            this.scope.globalSelection.transactionStatus.uomDataList = true;
            this.appService.getUOMList("","UNIT").then((val: M3.IMIResponse) => {
                this.scope.globalSelection.uomList = val.items;
            }, (err: M3.IMIResponse) => {
                //let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError("Error Loading Basic U/M", [err.errorMessage]);
                //this.scope.statusBar.push({message:error+" "+err.errorMessage,statusBarMessageType:h5.application.MessageType.Error,timestamp:new Date()});
               }).finally(() => {
                this.scope.globalSelection.transactionStatus.uomDataList = false;
                this.refreshTransactionStatus();
            });
        }
        
        

        /**
        * Load the interfaceItem
        * @param reLoad the reLoad flag reference
        */
        private interfaceItem(reLoad: boolean): void {
            let userContext = this.scope.userContext;
            let selectedSampleData1 = this.scope.globalSelection.sampleData1;

            if (reLoad) {
                this.clearData(["interfaceItem"]);
            }
//            if (angular.isUndefined(selectedSampleData1) ||  selectedSampleData1 == "") {
//                //show warning message
//                let warningMessage = "Please select a division";
//                this.showWarning(warningMessage, null);
//                return;
//            }

            //Add functions calls / business logics below which are required when this module is requested to load by an user
            if (reLoad) {
                this.loaditemType();
                this.loadUOMList();
                //this.loadAttributesList();
                //this.loadProductGroup(userContext.company);
               // this.loadBusinessArea(userContext.company);
            }
            this.scope.interfaceItem.reload = false;
        }
        

        
         

        //*************************************************Application specific functions ends*************************************************/

    }
}