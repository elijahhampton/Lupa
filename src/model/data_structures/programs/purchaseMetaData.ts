import { PurchaseMetaData, ProgramMetaData } from "./common/types"
var lupa_purchase_metadata_structure : PurchaseMetaData = {
    num_purchases: 0,
    purchase_list: [],
    gross_pay: 0,
    net_pay: 0,
    date_purchased: new Date()
}

export const getPurchaseMetaDataStructure = (
    numPurchases=0,
    purchaseList=[],
    ) => {
lupa_purchase_metadata_structure.num_purchases = 0;
lupa_purchase_metadata_structure.purchase_list = []
lupa_purchase_metadata_structure.gross_pay = 0;
lupa_purchase_metadata_structure.net_pay = 0;
lupa_purchase_metadata_structure.date_purchased = new Date();
    return lupa_purchase_metadata_structure;
}

var lupa_program_metadata : ProgramMetaData = {
    num_interactions: 0,
    views: 0,
    shares: 0,
}

export const getProgramMetata = (numInteractions = 0, views = 0, shares = 0) => {
    lupa_program_metadata.num_interactions = numInteractions;
    lupa_program_metadata.views = views;
    lupa_program_metadata.shares = shares;
}