module h5.application {
    export interface ISampleModule1 {
        
        reload: boolean;
        transactionStatus: {
            sampleData1: boolean;
            sampleList1: boolean;
        };
        sampleData1: any;
        sampleList1: any[];
        sampleGrid1: IUIGrid;
        selectedSampleDataGridRow: any;
        collapseSection1: boolean;
    }
}