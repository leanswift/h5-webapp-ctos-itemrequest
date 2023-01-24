/**
 * Service class to implement functions to retrieve, push data via Rest API with generic business logics if required. Will be used by the controller.
 */
module h5.application {

    export interface IAppService {
        getAuthority(company: string, division: string, m3User: string, programName: string, charAt: number): ng.IPromise<boolean>;
        getDivisionList(company: string, division: string): ng.IPromise<M3.IMIResponse>;
        getUOMList(DIVI: string, STCO: string): ng.IPromise<M3.IMIResponse>;
        getUser(searchBuyer: string): ng.IPromise<M3.IMIResponse>;
        getResponsible(searchRESP: string): ng.IPromise<M3.IMIResponse>;
        getDefaultResponsible(USID: string): ng.IPromise<M3.IMIResponse>;
        getItemType(division: string): ng.IPromise<M3.IMIResponse>;
        getSupplierList(company: string): ng.IPromise<M3.IMIResponse>;
        searchSupplier(searchInput: string): ng.IPromise<M3.IMIResponse>;
        LstAgrHeadBySup(SUNO: string): ng.IPromise<M3.IMIResponse>;
        processM3Item(FILE: string,STAT: string,ITNO: string, ITDS: string,FUDS: string,ITTY: string,UNMS: string,SUNO: string, SITE: string,PUPR: string,OVH1: string,OVH2: string, RESP: string,WHLO1: string,requestTime: string): ng.IPromise<M3.IMIResponse>;
        processM3ItemDates(FILE: string,ITNO: string,requestDate: string,requestTime: string,EMAIL: string,statusType: string): ng.IPromise<M3.IMIResponse>;
        checkM3Item(FILE: string,ITNO: string): ng.IPromise<M3.IMIResponse>;
        getWarehouses(company: string): ng.IPromise<M3.IMIResponse>;
        deleteM3Item(FILE: string,ITNO: string): ng.IPromise<M3.IMIResponse>;
        getUserdetails(USID: string): ng.IPromise<M3.IMIResponse>;
        
    }

    export class AppService implements IAppService {

        static $inject = ["RestService", "$filter", "$q"];

        constructor(private restService: h5.application.IRestService, private $filter: h5.application.AppFilter, private $q: ng.IQService) {
        }

        public getAuthority(company: string, division: string, m3User: string, programName: string, charAt: number): ng.IPromise<boolean> {
            let request = {
                DIVI: division,
                USID: m3User,
                PGNM: programName
            };
            return this.restService.executeM3MIRestService("MDBREADMI", "SelCMNPUS30_arl", request).then((val: M3.IMIResponse) => {
                if (angular.equals([], val.items)) {
                    request.DIVI = "";
                    return this.restService.executeM3MIRestService("MDBREADMI", "SelCMNPUS30_arl", request).then((val: M3.IMIResponse) => {
                        if (angular.equals([], val.items)) {
                            return false;
                        } else {
                            let test = val.item.ALO;
                            if (charAt < test.length() && '1' == test.charAt(charAt)) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    });
                } else {
                    let test = val.item.ALO;
                    if (charAt < test.length() && '1' == test.charAt(charAt)) {
                        return true;
                    } else {
                        return false;
                    }
                }
            });
        }

        public getDivisionList(company: string, division: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                CONO: company,
                DIVI: division
            };
            return this.restService.executeM3MIRestService("MNS100MI", "LstDivisions", requestData).then((val: M3.IMIResponse) => { return val; });
        }
         public getUOMList(DIVI: string, STCO: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                DIVI: "",
                STCO: "UNIT"
            };
            return this.restService.executeM3MIRestService("MDBREADMI", "SelCSYTAB00", requestData,10000).then((val: M3.IMIResponse) => { return val; });
        }
        
        public getUser(searchQuery: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                SQRY: searchQuery,
            };
            return this.restService.executeM3MIRestService("MDBREADMI", "LstCMNUSR00", requestData,10000).then((val: M3.IMIResponse) => { return val; });
        }
        
         public getResponsible(searchRESP: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                SQRY: searchRESP,
            };
            return this.restService.executeM3MIRestService("MDBREADMI", "LstCMNUSR00", requestData,10000).then((val: M3.IMIResponse) => { return val; });
        }
        public getDefaultResponsible(USID: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                USID: USID,
            };
            return this.restService.executeM3MIRestService("MNS150MI", "GetUserData", requestData,10000).then((val: M3.IMIResponse) => { return val; });
        }
        
        
       
        public getItemTypeWarehouse(ITTY: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                ITTY: ITTY,
            };
            return this.restService.executeM3MIRestService("MDBREADMI", "SelMITYWC00", requestData,10000).then((val: M3.IMIResponse) => { return val; });
        }
        //G 
        //FILE: FILE,
           //     PK01: ITNO,
           //     A030: STAT,
             //   A130: ITDS,
             //   A230: ITTY,
               // A330: UNMS,
               // A430: SUNO,
               // A530: SITE,
               // A630: WHLO,
               // A730: AssignTime,
               // A830: assignstatus,
                
               // N096: PUPR,
               // N196: OVH1,
               // N296: OVH2,
                
               // A930: RESP,
               // A121: FUDS,
              // DAT1: requestDate,
             //DAT2: assignDate,
       
       
        
         public processM3Item(FILE: string,STAT: string,ITNO: string, ITDS: string,FUDS: string,ITTY: string,UNMS: string,SUNO: string, SITE: string,PUPR: string,OVH1: string,OVH2: string, RESP: string,WHLO1: string,requestTime: string): ng.IPromise<M3.IMIResponse>{
            let returnTypeFinal = "";
            let requestData = {
                FILE: FILE,
                PK01: ITNO,
                A030: STAT,
                A130: ITDS,
                A230: ITTY,
                A330: UNMS,
                A430: SUNO,
                A530: SITE,
                A630: WHLO1,
                N096: PUPR,
                N196: OVH1,
                N296: OVH2,
                N396: requestTime,
                A930: RESP,
                A121: FUDS,
            };
            return this.restService.executeM3MIRestService("CUSEXTMI", "AddFieldValue", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
        public processM3ItemDates(FILE: string,ITNO: string,requestDate: string,requestTime: string,EMAIL: string,statusType: string): ng.IPromise<M3.IMIResponse>{
            let returnTypeFinal = "";
            let requestData = {
                FILE: FILE,
                PK01: ITNO,
                DAT1: requestDate,
                A122: statusType,
                A256: EMAIL,
            };
            return this.restService.executeM3MIRestService("CUSEXTMI", "ChgFieldValueEx", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
        public checkM3Item(FILE: string,ITNO: string): ng.IPromise<M3.IMIResponse>{
            let returnTypeFinal = "";
            let requestData = {
                FILE: FILE,
                PK01: ITNO,
               
                
            };
            return this.restService.executeM3MIRestService("CUSEXTMI", "GetFieldValue", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
        public deleteM3Item(FILE: string,ITNO: string): ng.IPromise<M3.IMIResponse>{
            let returnTypeFinal = "";
            let requestData = {
                FILE: FILE,
                PK01: ITNO,
               
                
            };
            return this.restService.executeM3MIRestService("CUSEXTMI", "DelFieldValue", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        public getUserdetails(USID: string): ng.IPromise<M3.IMIResponse>{
            let returnTypeFinal = "";
            let requestData = {
                USID: USID,
            };
            return this.restService.executeM3MIRestService("MNS150MI", "GetUserData", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
        public getItemType(division: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                DIVI: ""
            };
            //return this.restService.executeM3MIRestService("CMS100MI", "Lst_ItemType", requestData,0).then((val: M3.IMIResponse) => { return val; });
       return this.restService.executeM3MIRestService("MDBREADMI", "SelMITTTY00", requestData,10000).then((val: M3.IMIResponse) => { return val; });
        }
        
        
        public getSupplierList(company: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                CONO: company
                
            };
            return this.restService.executeM3MIRestService("CRS620MI", "LstSuppliers", requestData, 10000).then((val: M3.IMIResponse) => { return val; });
        }
        public searchSupplier(searchInput: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                SQRY: searchInput
            };
            return this.restService.executeM3MIRestService("CRS620MI", "SearchSupplier", requestData).then((val: M3.IMIResponse) => { return val; })
        }
        public LstAgrHeadBySup(SUNO: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                SUNO: SUNO
            };
            return this.restService.executeM3MIRestService("PPS100MI", "LstAgrHeadBySup", requestData).then((val: M3.IMIResponse) => { return val; })
        }
        
       
        
         public getMITMASData(queryStatement: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                SEPC: "#",
                HDRS: "1",
                QERY: queryStatement
            };
            return this.restService.executeM3MIRestService("EXPORTMI", "SelectPad", requestData).then((val: M3.IMIResponse) => {
                let responses = [];
                val.items.forEach((item, index) => {
                    if (index > 0) {
                        let response = {};
                        let replyField: string = item.REPL;
                        let fields = replyField.split("#");
                        fields.forEach((field) => {
                            let keyValue = field.split(" ");
                            response[keyValue[0]] = keyValue[1];
                        });
                        responses.push(response);
                    }
                });
                val.items = responses;
                val.item = responses[0];
                
                return val;
            });
        }
        
        public getorderTypeList(ORTY: string,MINAME: string,TRANSACTION: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                ORTY: "",
            };
            return this.restService.executeM3MIRestService(MINAME, TRANSACTION, requestData,10000).then((val: M3.IMIResponse) => { return val; });
        }
        
        public getWarehouses(company: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                CONO: company
            };
            return this.restService.executeM3MIRestService("MMS005MI", "LstWarehouses", requestData, 0).then((val: M3.IMIResponse) => { return val; });
        }
        
        
        
    }
}