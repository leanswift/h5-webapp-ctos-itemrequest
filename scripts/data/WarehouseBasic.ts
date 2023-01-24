module h5.application {
    export interface IWarehouseBasic {
        
        reload: boolean;
        transactionStatus: { 
        updateItems: boolean;
         itemnumberIList: boolean;
         orderTypesList: boolean;
        };
        warehouseDataList: any;
        warehouseDataList1?: any;
        itemnumberDataList: any;
        orderTypesList: any;
        orderTypesData: any;
        SUWHList: any;
        SUWHdata: any;
        ITNOW?: any;
    }
}