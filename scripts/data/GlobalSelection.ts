module h5.application {

    export interface IGlobalSelection {

        reload: boolean;
        transactionStatus: {
            sampleDataList1: boolean;
            sampleDataList2: boolean;
            wareDataList: boolean;
            itemgroupDataList: boolean;
             uomDataList: boolean;
            attributeDataList: boolean;
            prdgrpDataList: boolean;
             businessareaDataList: boolean;
            warehouses: boolean;
        };
        warehouseList: any;
        warehouse1: any;
        sampleDataList1: any;
        sampleData1: any;
        warehouseDataList: any;
        warehouseDataList1?: any;
        warehouseData: any;
        itemGroupList: any;
        itemGroupData: any;
        uomList: any;
        uomData: any;
        attributeList: any;
        attributeData: any;
        prdgrpList: any;
        prdgrpData: any;
        businessareaList: any;
        businessareaData: any;
        facilityDataList: any;
        facilityData: any;
        statusRange: any;
        itemType?: any;
        statusType?: any;
        statusRangeWH: any;
        AcqCode: any;
        status: any;
        statusWH: any;
        AcqCodeWH: any;
        warehouse: {
        list: any;
            };
    }
}