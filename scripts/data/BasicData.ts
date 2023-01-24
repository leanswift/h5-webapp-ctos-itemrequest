module h5.application {
    export interface IBasicData { 
        reload: boolean;
        transactionStatus: {
            customerBasicData?: boolean;
            customerBasicDataUpdate?: boolean;
            paymentTerms?: boolean;
            discTerms?: boolean;
            currencies?: boolean;
            orderTypes?: boolean;
            warehouses?: boolean;
            facilities?: boolean;
            salesPersons?: boolean;
            deliveryTerms?: boolean;
            deliveryMethods?: boolean;
            interestRules?: boolean;
            statementRules?: boolean;
            creditReferences?: boolean;
            priceLists?: boolean;
            discountModels?: boolean;
            discountGroups?: boolean;
            daysPastDue?: boolean;
        };
        globalData: any;
        daysPastDue: string;
        localData: {
            paymentTerms: any;
            discTerms: any;
            currencies: any;
            orderTypes: any;
            warehouses: any;
            facilities: any;
            salesPersons: any;
            deliveryTerms: any;
            deliveryMethods: any;
            interests: any;
            interestRules: any;
            statements: any;
            statementRules: any;
            creditReferences: any
        };
        userDefined: {
            field5Options?: any;
        }
        pricing: {
            priceLists: any;
            discountModels: any;
            discountGroups: any;
        };
        credit: {
            stops: any;
        };
        userSelection: {
            paymentTerm?: any;
            discTerm?: any;
            currency?: any;
            orderType?: any;
            warehouse?: any;
            facility?: any;
            salesPerson?: any;
            deliveryTerm?: any;
            deliveryMethod?: any;
            interest?: any;
            interestRule?: any;
            statement?: any;
            statementRule?: any;
            creditReference?: any;
            userDefinedCustomField5?: any;
            priceList?: any;
            discountModel?: any;
            discountGroup?: any;
            stop?: any;
        };
        userInput: {
            changedCreditLimit1?: string;
            changedCreditLimit2?: string;
            changedCreditLimit3?: string;
            changedCreditLimit4?: string;
            annualReviewDate?: string;
        }
    }
}