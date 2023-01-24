module h5.application {
    export interface IInterfaceItem {
        
        reload: boolean;
        transactionStatus: { 
            createItems: boolean;
            ItemsList: boolean;
            sampleData1: boolean;
            sampleList1: boolean;
            supplierList:boolean;
            itemsupplier:boolean;
            attributes:boolean;
            buyerIList: boolean;
             responsibleIList: boolean;
             defaultresponsibleIList: boolean;
        };
        sampleData1: any;
        sampleList1: any[];
        sampleGrid1: IUIGrid;
        selectedSampleDataGridRow: any;
        collapseSection1: boolean;
        enableUpdate: boolean;
        enableCreate: boolean;
        userSelection: {
            itemType?: any;
            statusType?: any;
        };
        userInput: {
            ITNO?: string;
            IFIN?: string;
            ITNE?: string;
            ITDS?: string;
            FUDS?: string;
            E0PA?: string;
            E065?: string;
            PRRF?: any;
            CUCD?: string;
            FVDT?: string;
            SAPR?: any;
            AGNB?: string;
            AGDT?: string;
            SUNO?: string;
            PUPR?: any;
            SUN1?: string;
            ATMO?: string;
            //USID?: any;
            MULT?: any;
            SITE?: string;
            SITD?: string;
            SITT?: string;
            OVH1?: any;
            OVH2?: any;
            BUYE?: string;
            
        };
        userInput1: {
        USIDD?: any;
            };
        enablebutton:boolean;
        warningPrice?:boolean;
        enableFields?:boolean;
        finalITNO: string;
        checkITNO?: string;
        userEmail?: string;
        warningEmail?:boolean;
        processItems?(): void;
        validateItem?(): void;
        LinesLists?(): void;
        itemlinesGrid: IUIGrid;
        collapseItems?: boolean;
        errorDisplay?: boolean;
        itemTypeList: any;
        priceList: any;
        supplierList: any;
        buyerList: any;
        responsibleList: any;
        agreementList: any;
        errormessagecheck?: string;
        itmType: string;
        attrType: string;
        defaultCUCD?: string;
        label: string;
        chkItemType: string;
        chkAquCode: string;
        defaultFromDate?: string;
        filteredErrors?:any[] ;
        counterErrors?: any;
        facilityCount?: any;
    }
}