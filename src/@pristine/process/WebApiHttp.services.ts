import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpRequest} from '@angular/common/http';
// @ts-ignore
import * as data from '../../assets/static.json';

@Injectable({
    providedIn: 'root'
})

export class WebApiHttp {

    public globalurl: string = data.url;

    public ApiURLArray: any = {

        //todo User URL Start

        login: '/api/User/Login',
        Logout: '/api/User/Logout',
        createUser: '/api/User/CreateUser',
        roleProcess: '/api/Role/RoleProcess',
        signalRNotification: '/Notification',
        locationlist: '/api/User/LocationList',
        //todo User URL End

        //todo GateEntry URL Start

        AllGateEntryList: '/api/GateEntry/AllGateEntryList?location=',
        GateEntryInfoByid: '/api/GateEntry/GateEntryInfoByid?gateentry_no=',
        GateEntryInfoByidStatusCreated: '/api/GateEntry/GateEntryInfoByidStatusCreated?gateentry_no=',
        CreateGateEntry: '/api/GateEntry/CreateGateEntry',

        //todo GateEntry URL End

        //todo GRN URL Stat

        GRNactivedocumentno: '/api/GRN/GrnActiveDocumentNo',
        DocumentInfoForGRN: '/api/GRN/DocumentInfoForGRN',
        CreateGRNHeader: '/api/GRN/CreateGRNHeader',
        GRNQuantityInWithoutScan: '/api/GRN/GRNQuantityInWithoutScan',
        GRNQuantityInWithScan: '/api/GRN/GRNQuantityInWithScan',
        GateEntryInfoByDocumentNo: '/api/GRN/GateEntryByDocumentNo',
        GRNInfo: '/api/GRN/GRNInfo',
        BarcodeInByPOLineInfo: '/api/GRN/BarcodeInByPOLineInfo',
        DeleteBarcode: '/api/GRN/DeleteScannedBarcode',
        CompleteGRN: '/api/GRN/CompleteGRN',

        //todo GRN URL end


        //todo Vendor URL start

        GetVendorDetail: '/api/Vendor/GetVendorDetail?no_or_name=',
        GetVendorDetailByClassification: '/api/Vendor/GetVendorDetailByClassification?classification=',
        GetAllVendorList: '/api/Vendor/AllVendorList',
        CreateVendor: '/api/Vendor/CreateVendor',
        VendorCatalogueList: '/api/Vendor/VendorCatalogueList',
        VendorCatalogueCreateUpdate: '/api/Vendor/CreateUpdateVendorCatalogue',
        VendorCatalogueDelete: '/api/Vendor/DeleteVendorCatalogue',


        //todo Vendor URL end

        //todo Purchase URL start

        ActivePurchaseOrderByVendor: '/api/Purchase/ActivePurchaseOrderByVendor?vendor_no=',
        PurchaseOrderlist: '/api/Purchase/PurchaseOrderlist?location_id=',
        GetVendorCompleteDetailWithPoNo: '/api/Purchase/GetVendorCompleteDetailWithPoNo?vendor_no=',
        GetVendorItem: '/api/Purchase/GetVendorItem',
        PurchaseOrderCreation: '/api/Purchase/PurchaseOrderCreation',
        POForApporoval: '/api/Purchase/POForApporoval?locationid=',
        POApporoved: '/api/Purchase/POApporoved',
        POInfo: '/api/Purchase/POInfo',
        POGRNInfo: '/api/Purchase/POGRNInfo',
        grn_putaway_auto_create: '/api/Purchase/grn_putaway_auto_create',
        sample_code_uploader: '/api/Purchase/sample_code_uploader',
        get_sample_code_master: '/api/Purchase/get_sample_code_master',

        //todo Purchase URL end

        //todo TL Seed Arrival start

        TLSeedArrivallist: '/api/TLSeedArrival/TLSeedArrivallist?location_id=',
        GetVendorCompleteDetailWithTLSeedArrival: '/api/TLSeedArrival/GetVendorCompleteDetailWithTLSeedArrival?vendor_no=',
        tl_seed_arrival_scan_production_lot_no: '/api/TLSeedArrival/tl_seed_arrival_scan_production_lot_no',
        GetVendorItemArrival: '/api/TLSeedArrival/GetVendorItem',
        TLSeedArrivalCreation: '/api/TLSeedArrival/TLSeedArrivalCreation',
        TLSeedArrivalForApporoval: '/api/TLSeedArrival/TLSeedArrivalForApporoval?locationid=',
        TLSeedArrivalApporoved: '/api/TLSeedArrival/TLSeedArrivalApporoved',
        TLInfo: '/api/TLSeedArrival/TLInfo',
        TLGRNInfo: '/api/TLSeedArrival/TLGRNInfo',
        TL_grn_putaway_auto_create: '/api/TLSeedArrival/TL_grn_putaway_auto_create',

        //todo TL Seed Arrival end

        //todo Item URL start

        FindItem: '/api/Item/FindItem?name_or_no=',
        ItemList: '/api/Item/ItemList?location_id=',
        ItemCategoryList: '/api/Item/ItemCategoryList',
        ItemCategoryListWithSeedType: '/api/Item/ItemCategoryListWithSeedType/',
        ItemCategoryCreate: '/api/Item/ItemCategoryCreate',
        CropStageMasterWithCategory: '/api/Item/CropStageMasterWithCategory/',
        ItemSubCategoryList: '/api/Item/ItemSubCategoryList?id=',
        ItemCategoryDelete: '/api/Item/ItemCategoryDelete',
        ItemAttributeTypelIst: '/api/Item/ItemAttributeTypeList',
        ItemAttributeTypeCreate: '/api/Item/ItemAttributeTypeCreate',
        ItemAttributeValueList: '/api/Item/ItemAttributeValueList?attribute_type_no=',
        ItemAttributeValueCreate: '/api/Item/ItemAttributeValueCreate',
        ItemAttributeDelete: '/api/Item/ItemAttributeDelete',
        GetGstGroupId: '/api/Item/GstGroupIdValue',
        GetGstHsnCode: '/api/Item/GstHsnCode?GstGroupId=',
        GetBaseUomValue: '/api/Item/BaseUomValue',
        ItemCreate: '/api/Item/ItemCreate',
        ItemFullInfo: '/api/Item/ItemFullInfo',
        FindItem_Cat_SubCat: '/api/Item/FindItem_Cat_SubCat?cat=',
        FindItem_Cat: '/api/Item/FindItem_Cat?cat=',
        ItemGroupList:'/api/Item/ItemGroupList',
        ItemGroupCreation:'/api/Item/ItemGroupCreate',
        FindOnlyItem: '/api/Item/FindOnlyItem?name_or_no=',
        FindItemClassSeed: '/api/Item/FindItemClassSeed?class_of_seed=',
        FindItemClassSeedFG: '/api/Item/FindItemClassSeedFG?class_of_seed=',

        GetCropStageMaster:'/api/Item/GetCropStageMaster',
        crop_stage_master_create:'/api/Item/crop_stage_master_create',
        get_variety_wise_quality_parameter:'/api/Item/get_variety_wise_quality_parameter',
        variety_wise_quality_parameter_create:'/api/Item/variety_wise_quality_parameter_create',
        get_parent_seed_master:'/api/Item/get_parent_seed_master',
        parent_seed_master_create:'/api/Item/parent_seed_master_create',

        //todo inventory
        item_barcode_bin_info:'/api/Item/item_barcode_bin_info',
        item_bin_inventory:'/api/Item/item_bin_inventory',
        item_inventory_by_location:'/api/Item/item_inventory_by_location',
        item_ledger_entry:'/api/Item/item_ledger_entry',


        //todo Item URL end


        //todo Bin URL start

        BinList: '/api/Bins/BinList?locationid=',
        BinInfo: '/api/Bins/BinInfo',
        AddBin: '/api/Bins/AddBin',
        DeleteBin: '/api/Bins/DeleteBin',
        BarcodeInBin: '/api/Bins/BarcodeInBin',

        //todo Bin URL end


        //todo IQC URL start

        GRNListForIQC: '/api/IQC/GRNListForIQC?locationid=',
        IQCData: '/api/IQC/IQCData',
        GRNScannedBarcodeInfo: '/api/IQC/GRNScannedBarcodeInfo',
        IQCScanBincode: '/api/IQC/IQCBinScan',
        IQCScanBarcode: '/api/IQC/IQCScanBarcode',
        IQCDeleteLine: '/api/IQC/IQCDeleteLine',
        IQCComplete: '/api/IQC/IQCComplete',


        //todo IQC URL end


        //todo Putway URL start

        PutwayList: '/api/Putway/PutwayList?locationid=',
        PutwayGRNList: '/api/Putway/PutwayGRNList',
        PutwayHeaderCreate: '/api/Putway/PutwayHeaderCreate',
        PutwayData: '/api/Putway/PutwayData',
        PutwayLineinfo: '/api/Putway/PutwayLineinfo',
        PutwayBarcodeinfo: '/api/Putway/PutwayBarcodeinfo',
        PutwayScanBarcode: '/api/Putway/PutwayScanBarcode',
        PutwayWithoutScanBarcode: '/api/Putway/PutwayWithoutScanBarcode',
        PutwayDeleteLine: "/api/Putway/PutwayDeleteLine",
        PutwayComplete: "/api/Putway/PutwayComplete",

        //todo Putway URL end

        //todo Rejection URL start

        RejectionWork: '/api/Rejection/RejectionWork',

        //todo Rejection URL end

        //todo Sale Order URL start

        SaleOrderlist: '/api/Sale/SaleOrderlist',
        GetSaleNo: '/api/Sale/GetSaleNo',
        AddItem: '/api/Sale/AddItem',
        SaleOrderCreation: '/api/Sale/SaleOrderCreation',
        SOForApporoval: '/api/Sale/SOForApporoval?locationid=',
        SOApporoved: '/api/Sale/SOApporoved',
        SaleInfo: '/api/Sale/SaleInfo',
        SaleInvoiceList: '/api/Sale/SaleInvoiceList',
        SaleInvoiceInfo: '/api/Sale/SaleInvoiceInfo',

        //todo Sale Order URL end

        //todo Pick Creation URL start

        FindOrder: '/api/PickCreate/FindOrder',
        PickCreation: '/api/PickCreate/PickCreation',

        //todo Pick Creation URL end


        //todo dashboard
        DashboardData: '/api/OutBoundDashboard/dashboard_Data?order_type=',
        WaveWiseZoneActivity: '/api/OutBoundDashboard/WaveWiseZoneActivity?emailid=',

        //todo shift Api
        allShift: '/api/Shift/AllShift?location_id=',
        allUser: '/api/User/AllUser?name=',
        createShift: '/api/Shift/CreateShift',
        deleteShift: '/api/Shift/DeleteShift',
        updateShift: '/api/Shift/UpdateShift',
        current_shift: '/api/Shift/CurrentShift',
        ManagerDataRoster: '/api/Roster/ManagerData?location_id=',
        //todo end

        //todo roaster Api
        createRoster: '/api/Roster/CreateRoster',
        allRoster: '/api/Roster/AllRoster?Email=',
        //todo end roaster

        //todo pick admin
        pickZone: '/api/Pick/PickZone',
        PickPriority: '/api/Pick/PickPriority?worktype=',
        PriorityListMaster: '/api/Pick/PriorityList',
        ChangePickPriority: '/api/Pick/ChangePickPriority',
        //

        // todo outbound pick

        pickinfo: '/api/Pick/PickerInfo?email=',
        picktrayscan: "/api/Pick/PickStart",
        pickbinbarcodescan: "/api/Pick/ScanBinBarcode",
        picknotfound: "/api/Pick/ProductNotFound",
        pickclosetray: "/api/Pick/CloseTray",
        PickerList: "/api/PickManual/PickerListByPick",
        PickListManual: '/api/PickManual/PickList',
        PickManualInfo: '/api/PickManual/PickManualInfo',
        PickStartManual: '/api/PickManual/PickStart',
        PickScanManual: '/api/PickManual/Scanning',
        PickNFManual: '/api/PickManual/NotFound',
        PickHold: '/api/PickManual/Hold',
        PickComplete: '/api/PickManual/Complete',

        //

        //todo Report Section

        PickInfoReport: '/api/Report/PickInfo?pickno=',
        BinZoneSearchReport: '/api/Report/BinZoneSearch?filter=',
        PickDistribution: '/api/Report/PickDistribution',
        OutboundQualityCheck_reprintReport: '/api/OutboundQualityCheck/Report?order_no=',
        slot_Report: '/api/Report/SlotInfo',
        Slotinfo_report: '/api/Report/SlotSingleReport',
        OqcRangeDetail: '/api/Report/OQCRangeReport',
        ConsolidationRangeDetail: '/api/Report/ConsolidationRangeReport',
        MarketPlace_invoice: '/api/MarketPlace/MarketPlace_invoice?order_no=',
        MarketPlace_invoice_sync: '/api/MarketPlace/MarketPlace_invoice_sync?order_no=',

        //todo tray master

        AllTray: '/api/Tray/AllTray?location_id=',
        DeleteTray: '/api/Tray/DeleteTray',
        NewTray: '/api/Tray/NewTray',

        //todo force assignment

        PickInfoForForceAssigment: '/api/Pick/PickInfoForForceAssigment',
        ForceAssigment_submit: '/api/Pick/ForceAssigment',

        //todo Manifest posting

        SelectShippingOrder: '/api/ManifestPost/shipment_partner',
        CreateManifest: '/api/ManifestPost/manifest_create',
        excel_ReportManifestPost: '/api/ManifestPost/excel_ReportManifestPost?location_id=',
        MarkedCreated: '/api/ManifestPost/manifest_mark_Created',
        MarkedRelease: '/api/ManifestPost/manifest_mark_release',

        //todo Manifest Handover

        GetPendingShippingManifestNo: '/api/ManifestHandover/get_handover_ship_agent_code?ship_agent_code=',
        getManifestHandoverLine: '/api/ManifestHandover/get_lines_with_ship_agent_code',
        CreateManifestHandover: '/api/ManifestHandover/handover_create',
        Handover_reprint: '/api/ManifestHandover/reprint_handover?handoverno=',

        //todo Setup

        RoleMasterProcess: '/api/Role/RoleProcess',
        SaleInfoReport: '/api/Report/SaleOrder?source_no=',
        PickSetupAll: '/api/Pick/PickSetupAll',
        RolePermissionDetail: '/api/Role/RolePermissionDetail/',
        RolePermissionUpdate: '/api/Role/RolePermissionUpdate',

        //todo UserSetup

        GetAllUser: '/api/User/allUser',
        CreateUser: '/api/User/createUser',
        GetAllWorktype: '/api/User/Worktype',
        UpdateUserPassword: '/api/User/UpdatePassword',
        AddPrinterIPaddress: '/api/User/AddIPandPort',

        //todo cage master

        CageList: '/api/Cage/CageList?location_id=',
        cage_ZoneList: '/api/Consolidation/ZoneList?location_id=',
        AddCage: '/api/Cage/AddCage',
        getConfigStyleImages: "/api/BarcodeGenrate/SeachByStyle?stylecode=",
        SeachByStyleAndColor: "/api/BarcodeGenrate/SeachByStyleAndColor?stylecode=",
        PrintBarcodeReport: "/api/BarcodeGenrate/PrintBarcodeReport",


        //todo tray sorting

        ScanTray: '/api/Sorting/ScanTray',
        ScanCage: '/api/Sorting/ScanCage',

        //todo DSP

        DSPPartnerList: '/api/DSP/DSPPartnerList?location=',
        CreateUpdateDSP: '/api/DSP/CreateUpdateDSP',
        DSPServiceList: '/api/DSP/DSPServiceList?location=',
        CreateUpdateDSPService: '/api/DSP/CreateUpdateDSPService',
        DspAwb: '/api/DSP/DspAwb',
        UploadAWB: '/api/DSP/UploadAWB',

        //todo manifest sorting

        ScanAwbNoManifestCreate: '/api/ManifestSorting/ScanAwbNoManifestCreate',

        //todo reshipment
        AwbList: '/api/Reshipment/AwbList?location=',
        NewDspandAwb: '/api/Reshipment/NewDspandAwb',

        //todo return manifest
        ReturnManifestList: '/api/ReturnManifest/ReturnManifestList?locationid=',
        CreateReturn: '/api/ReturnManifest/CreateReturn',
        ReturnManifestInfo: '/api/ReturnManifest/ReturnManifestInfo?return_manifest_no=',
        AWBScan: '/api/ReturnManifest/AWBScan',
        Complete: '/api/ReturnManifest/Complete',

        //todo customer return
        CRList: '/api/CustomerReturn/CRList?location_id=',
        CreateCR: '/api/CustomerReturn/CreateCR',

      //todo transfer order
      InboundList: '/api/TransferOrder/InboundList',
      AddNewItem: '/api/TransferOrder/AddItem',
      NewTransferNo: '/api/TransferOrder/NewTransferNo',
      CompleteTransfer: '/api/TransferOrder/Complete',
      getItemForTransferOrder:'/api/TransferOrder/tranfer_order_item_no?crop_code=',
      transfer_order_add_item:'/api/TransferOrder/AddItem?lot_no=',
      GetTransferOrderList:'/api/TransferOrder/TransferOrderList?location_id=',
      GetTransferOrderInfo:'/api/TransferOrder/TransferOrderInfo',
      GetLotNo:'/api/TransferOrder/GetItemLotNo?item_no=',


        //todo Return GatePass
        RGPList: '/api/ReturnGatePass/RGPList',
        PartyList: '/api/ReturnGatePass/PartyList',
        NewRGPNo: '/api/ReturnGatePass/NewRGPNo',
        AddItemRGP: '/api/ReturnGatePass/AddItem',
        CompleteRGP: '/api/ReturnGatePass/Complete',

        //todo purchasr return order
        PROList: '/api/PurchaseReturnOrder/PROList',
        AddNewPROItem: '/api/PurchaseReturnOrder/AddItem',
        NewPRONo: '/api/PurchaseReturnOrder/NewPRONo',
        CompletePRO: '/api/PurchaseReturnOrder/Complete',

        //todo return BSIO
        get_return_bsio_list: '/api/SalesReturnOrder/get_return_bsio_list?location_id=',
        return_bsio_details: '/api/SalesReturnOrder/return_bsio_details?document_no=',
        get_bsio_no_from_ile: '/api/SalesReturnOrder/get_bsio_no_from_ile?location=',
        get_bsio_details_from_ile: '/api/SalesReturnOrder/get_bsio_details_from_ile?bsio_no=',
        create_bsio_return: '/api/SalesReturnOrder/create_bsio_return',

        get_return_fsio_list: '/api/SalesReturnOrder/get_return_fsio_list?location_id=',
        return_fsio_details: '/api/SalesReturnOrder/return_fsio_details?document_no=',
        get_fsio_no_from_ile: '/api/SalesReturnOrder/get_fsio_no_from_ile?location=',
        get_fsio_details_from_ile: '/api/SalesReturnOrder/get_fsio_details_from_ile?fsio_no=',
        create_fsio_return: '/api/SalesReturnOrder/create_fsio_return',

        get_return_hsio_list: '/api/SalesReturnOrder/get_return_hsio_list?location_id=',
        return_hsio_details: '/api/SalesReturnOrder/return_hsio_details?document_no=',
        get_hsio_no_from_ile: '/api/SalesReturnOrder/get_hsio_no_from_ile?location=',
        get_hsio_details_from_ile: '/api/SalesReturnOrder/get_hsio_details_from_ile?hsio_no=',
        create_hsio_return: '/api/SalesReturnOrder/create_hsio_return',

        //todo party master
        find_postcode: '/api/PartyMaster/find_postcode?code_or_city=',
        getgeographicalzone: '/api/PartyMaster/getgeographicalzone',
        get_geographicalstatecode: '/api/PartyMaster/get_geographicalstatecode?zone=',
        get_geographicalregion: '/api/PartyMaster/get_geographicalregion?zone=',
        get_geographicaldistrict: '/api/PartyMaster/get_geographicaldistrict?zone=',
        get_geographicaltaluka: '/api/PartyMaster/get_geographicaltaluka?zone=',
        getcustomerpostinggroup: '/api/PartyMaster/getcustomerpostinggroup',
        getvendorpostinggroup: '/api/PartyMaster/getvendorpostinggroup',
        getcustomertypemaster: '/api/PartyMaster/getcustomertypemaster',
        getvendorclassificationmaster: '/api/PartyMaster/getvendorclassificationmaster',
        getcustomerbusinesstype: '/api/PartyMaster/getcustomerbusinesstype',

        getpartymaster: '/api/PartyMaster/getpartymaster',
        PartyCreate: '/api/PartyMaster/PartyCreate',

        //todo Grower Master
        getgrowermaster: '/api/GrowerMaster/getgrowermaster',
        GrowerCreate: '/api/GrowerMaster/GrowerCreate',
        find_grower: '/api/GrowerMaster/find_grower?name_or_no=',

        //todo planting
        PlantingCreate: '/api/Planting/PlantingCreate',
        get_planting_list: '/api/Planting/get_planting_list',
        get_planting_info: '/api/Planting/get_planting_info?planting_no=',
        get_fsio_no_with_organiser_code: '/api/Planting/get_fsio_no_with_organiser_code?organiser_code=',
        PlantingFSIOCreate: '/api/Planting/PlantingFSIOCreate',
        PlantingFSIODelete: '/api/Planting/PlantingFSIODelete',
        find_fsio_no_with_planting_no: '/api/Planting/find_fsio_no_with_planting_no?planting_no=',
        find_item_no_with_fsio_no: '/api/Planting/find_item_no_with_fsio_no?fsio_no=',
        find_item_no_with_cat_cos_tl: '/api/Planting/find_item_no_with_cat_cos_tl?cat=',
        PlantingFSIOGrower: '/api/Planting/PlantingFSIOGrower',
        get_fsio_grower_with_planting_no: '/api/Planting/get_fsio_grower_with_planting_no?planting_no=',
        planting_fsio_grower_production_generate: '/api/Planting/planting_fsio_grower_production_generate',
        PlantingFSIOGrowerDelete: '/api/Planting/PlantingFSIOGrowerDelete',
        PlantingCompleted: '/api/Planting/PlantingCompleted',

        //todo Inspection
        scanProductionLotNo: '/api/Inspection/scanProductionLotNo',
        get_inspection_one_list: '/api/Inspection/get_inspection_one_list',
        get_inspection_one_info: '/api/Inspection/get_inspection_one_info?insp_no=',
        delete_inspection_one: '/api/Inspection/delete_inspection_one?line_no=',
        delete_inspection_one_header: '/api/Inspection/delete_inspection_one_header?inspection_no=',
        update_inspection_one_line: '/api/Inspection/update_inspection_one_line',

        get_inspection_two_list: '/api/Inspection/get_inspection_two_list',
        get_inspection_two_info: '/api/Inspection/get_inspection_two_info?insp_no=',
        delete_inspection_two: '/api/Inspection/delete_inspection_two?line_no=',
        delete_inspection_two_header: '/api/Inspection/delete_inspection_two_header?inspection_no=',
        update_inspection_two_line: '/api/Inspection/update_inspection_two_line',

        get_inspection_three_list: '/api/Inspection/get_inspection_three_list',
        get_inspection_three_info: '/api/Inspection/get_inspection_three_info?insp_no=',
        delete_inspection_three: '/api/Inspection/delete_inspection_three?line_no=',
        delete_inspection_three_header: '/api/Inspection/delete_inspection_three_header?inspection_no=',
        update_inspection_three_line: '/api/Inspection/update_inspection_three_line',

        get_inspection_four_list: '/api/Inspection/get_inspection_four_list',
        get_inspection_four_info: '/api/Inspection/get_inspection_four_info?insp_no=',
        delete_inspection_four: '/api/Inspection/delete_inspection_four?line_no=',
        delete_inspection_four_header: '/api/Inspection/delete_inspection_four_header?inspection_no=',
        update_inspection_four_line: '/api/Inspection/update_inspection_four_line',

        get_inspection_qc_list: '/api/Inspection/get_inspection_qc_list',
        get_inspection_qc_info: '/api/Inspection/get_inspection_qc_info?insp_no=',
        delete_inspection_qc: '/api/Inspection/delete_inspection_qc?line_no=',
        delete_inspection_qc_header: '/api/Inspection/delete_inspection_qc_header?inspection_no=',
        update_inspection_qc_line: '/api/Inspection/update_inspection_qc_line',

        //todo process Transfer
        GetSeasonMaster: '/api/ProcessTransfer/GetSeasonMaster',
        GetLotNoWithItemNoFromILE: '/api/ProcessTransfer/GetLotNoWithItemNoFromILE',
        GetSingleBincodeWithLocation: '/api/ProcessTransfer/GetSingleBincodeWithLocation/',
        ProcessTransferList: '/api/ProcessTransfer/ProcessTransferList?location_id=',
        ProcessTransferInfo: '/api/ProcessTransfer/ProcessTransferInfo?process_transfer_no=',
        CheckQcFinalResultDeclared: '/api/ProcessTransfer/CheckQcFinalResultDeclared',
        CreateProcessTransfer: '/api/ProcessTransfer/CreateProcessTransfer',
        get_got_test_assignment: '/api/ProcessTransfer/get_got_test_assignment',
        update_got_assignment: '/api/ProcessTransfer/update_got_assignment',
        get_got_field_test: '/api/ProcessTransfer/get_got_field_test',
        get_got_off_type_plants: '/api/ProcessTransfer/get_got_off_type_plants',
        get_got_variety_wise_quality_parameter: '/api/ProcessTransfer/get_got_variety_wise_quality_parameter?item_no=',
        update_got_field_test: '/api/ProcessTransfer/update_got_field_test',
        completed_got_field_test: '/api/ProcessTransfer/completed_got_field_test',
        get_bt_elisa_test: '/api/ProcessTransfer/get_bt_elisa_test',
        get_bt_elisa_variety_wise_quality_parameter: '/api/ProcessTransfer/get_bt_elisa_variety_wise_quality_parameter?item_no=',
        update_bt_elisa_test: '/api/ProcessTransfer/update_bt_elisa_test',
        completed_bt_elisa_test: '/api/ProcessTransfer/completed_bt_elisa_test',
        get_stl_germination_test: '/api/ProcessTransfer/get_stl_germination_test',
        get_stl_germination_test_no: '/api/ProcessTransfer/get_stl_germination_test_no?germination_test_no=',
        get_stl_germination_variety_wise_quality_parameter: '/api/ProcessTransfer/get_stl_germination_variety_wise_quality_parameter?item_no=',
        update_stl_germination_count1_test: '/api/ProcessTransfer/update_stl_germination_count1_test',
        update_stl_germination_count2_test: '/api/ProcessTransfer/update_stl_germination_count2_test',
        get_stl_physical_purity_test: '/api/ProcessTransfer/get_stl_physical_purity_test',
        get_stl_physical_purity_test_no: '/api/ProcessTransfer/get_stl_physical_purity_test_no?physical_purity_test_no=',
        get_stl_physical_purity_variety_wise_quality_parameter: '/api/ProcessTransfer/get_stl_physical_purity_variety_wise_quality_parameter?item_no=',
        update_stl_physical_purity_test: '/api/ProcessTransfer/update_stl_physical_purity_test',
        get_stl_moisture_test: '/api/ProcessTransfer/get_stl_moisture_test',
        get_stl_moisture_test_no: '/api/ProcessTransfer/get_stl_moisture_test_no?moisture_test_no=',
        get_variety_wise_quality_parameter_with_type: '/api/ProcessTransfer/get_variety_wise_quality_parameter_with_type?item_no=',
        update_stl_moisture_test: '/api/ProcessTransfer/update_stl_moisture_test',
        get_stl_vigour_test: '/api/ProcessTransfer/get_stl_vigour_test',
        get_stl_vigour_test_no: '/api/ProcessTransfer/get_stl_vigour_test_no?vigour_test_no=',
        update_stl_vigour_test: '/api/ProcessTransfer/update_stl_vigour_test',
        get_qc_final_test: '/api/ProcessTransfer/get_qc_final_test',
        update_qc_final_test: '/api/ProcessTransfer/update_qc_final_test',
        get_qc_final_test_completed: '/api/ProcessTransfer/get_qc_final_test_completed',

      //Todo Blending
      BlendingList: '/api/Blending/BlendingList?location_id=',
      BlendingInfo: '/api/Blending/BlendingInfo?blending_no=',
      CreateBlending: '/api/Blending/CreateBlending',

      //Todo Bulking
      BulkingList: '/api/Bulking/BulkingList?location_id=',
      BulkingInfo: '/api/Bulking/BulkingInfo?bulking_no=',
      get_expiry_date_from_ile: '/api/Bulking/get_expiry_date_from_ile?lot_no=',
      check_lot_no_exists: '/api/Bulking/check_lot_no_exists?lot_no=',
      CreateBulking: '/api/Bulking/CreateBulking',

      //Todo Mraketing Indent
      CreateMarketingIndent:'/api/MarketingIndent/MarkrtingIndentCreate',
      MarketingIndentList:'/api/MarketingIndent/MarketingIndentList?location_id=',
      CropCodeList:'/api/MarketingIndent/CropCodeList',
      GetitemGroup:'/api/MarketingIndent/ItemGroupList?crop_code=',
      GetMarketingIndentNo:'/api/MarketingIndent/MarketingIndentNo?customer_no=',

      //Todo delivery order
      ItemDetailList:'/api/DeliveryOrder/ItemDetailList?item_no=',
      CreateDeliveryOrder:'/api/DeliveryOrder/DeliveryOrderCreate',
      DeliveryOrderList:'/api/DeliveryOrder/DeliveryOrderList?location_id=',
      DeliveryOrderForApprovalList:'/api/DeliveryOrder/DeliveryOrderForApprovalList?location_id=',
      DeliveryOrderApprovalCnfrm:'/api/DeliveryOrder/DeliveryOrderForApprovalCnfrm',
      DeliveryOrderCheckInventory:'/api/DeliveryOrder/DeliveryOrderCheckInventory',
      DeliveryOrderInfo:'/api/DeliveryOrder/DeliveryOrderInfo',
      GetItemLotNo:'/api/DeliveryOrder/ItemLotNo?item_no=',
      GetItem:'/api/DeliveryOrder/DeliveryOrderAddItem?cat_code=',




      //Todo Customer
      CreateCustomer: '/api/Customer/CreateCustomer',
      FindCustomer: '/api/Customer/FindCustomer?name=',
      CustomerInfo: '/api/Customer/CustomerInfo?customerid=',
      CustomerList:'/api/Customer/CustomerList',
      SalePriceCreate:'/api/Customer/CreateSalePrice',

      //Todo HybridSale
      GetDeliveryOrderNo:'/api/HybridSaleOrder/DeliveryOrderNo?location_id=',
      HybridSaleOrdercreation:'/api/HybridSaleOrder/HybridsaleOrderCreate',
      HybridSaleOrderList:'/api/HybridSaleOrder/HybridSaleOrderList?location_id=',
      HybridSaleOrderInfo:'/api/HybridSaleOrder/HybridSaleInfo',

      //Todo BreederSeedIssueOrder
      GetBreederTypeCropCode:'/api/BreederSeedIssueOrder/BreederTypeCropCodeList',
      BreederSeedOrderCreation:'/api/BreederSeedIssueOrder/BreederSeedIssueOrderCreate',
      GetChilDSeedType:'/api/BreederSeedIssueOrder/GetChildSeedType?crop_code=',
      GetBSIOLine:'/api/BreederSeedIssueOrder/BreederSeedIssueOrderLine?item_no=',
      GetBSIOList:'/api/BreederSeedIssueOrder/BreederSeedIssueOrderList?location_id=',
      GetBSIOItem:'/api/BreederSeedIssueOrder/BreederSeedIssueOrderItemNo?item_no=',
      get_item_no_with_class_of_seed:'/api/BreederSeedIssueOrder/get_item_no_with_class_of_seed?class_of_seed=',

      //Todo FoundationSeedIssueOrder
      GetFoundationTypeCropCode:'/api/FoundationSeedIssueOrder/FoundationTypeCropCodeList',
      FoundationSeedCreation:'/api/FoundationSeedIssueOrder/FoundationSeedIssueOrderCreate',
      GetFoundationChildSeedType:'/api/FoundationSeedIssueOrder/GetfoundationChildSeedType?crop_code=',
      GetFSIOLine:'/api/FoundationSeedIssueOrder/FoundationSeedIssueOrderLine?item_no=',
      GetFSIOLIst:'/api/FoundationSeedIssueOrder/FoundationSeedIssueOrderList?location_id=',

      //adjustment

      DocumentList: '/api/ItemAdjustment/DocumentList',
      DocumentCreate: '/api/ItemAdjustment/DocumentCreate',
      DocumentView: '/api/ItemAdjustment/DocumentView',
      NewLotNo: '/api/ItemAdjustment/NewLotNo',
      AdjustmentWithoutScan:'/api/ItemAdjustment/AdjustmentWithoutScan',
      ItemAdjustmentDeleteBarcode:'/api/ItemAdjustment/ItemAdjustmentDeleteBarcode',
      ItemAdjustmentComplete:'/api/ItemAdjustment/ItemAdjustmentComplete',


    };

    constructor(private httpClient: HttpClient
    ) {

    }

    get getHTTPHeader(): any {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
    }

    getHTTPHeaderAuth(token: string): any {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            })
        };
    }

    // post data to server
    async Post(path: string, jsondata: any): Promise<any> {
        try {
            path = this.globalurl + path;
            var headers = this.getHTTPHeader;
            return await new Promise<any>((resolve, reject) => {
                this.httpClient.post<any>(path, JSON.stringify(jsondata), headers).toPromise()
                    .then(result => resolve(result), error => reject({
                        condition: 'False',
                        message: error.message
                    })).catch(err => reject({condition: 'False', message: err.message}));
            });

        } catch (e) {
            return new Promise<any>((resolve) => {
                resolve({condition: 'False', message: e.message})
            });
        }
    }

    // get data to the server
    async Get(path: string): Promise<any> {
        try {
            path = this.globalurl + path;
            var headers = this.getHTTPHeader;
            return await new Promise<any>((resolve, reject) => {
                this.httpClient.get<any>(path, headers).toPromise()
                    .then(result => resolve(result), error => reject({
                        condition: 'False',
                        message: error.message
                    })).catch(err => reject({condition: 'False', message: err.message}));
            });
        } catch (e) {
            return new Promise<any>((resolve) => {
                resolve({condition: 'False', message: e.message})
            });
        }
    }

    //todo For formdata
    async PostFormData(path: string, formdata: any): Promise<any> {
        try {
            path = this.globalurl + path;
            var header = this.getHTTPHeader;
            return await new Promise<any>((resolve, reject) => {
                this.httpClient.post<any>(path, formdata).toPromise()
                    .then(result => resolve(result), error => reject({
                        condition: 'false',
                        message: error.message
                    })).catch(error => reject({
                    condition: 'false',
                    message: error.message
                }))
            })

        } catch (e) {
            return new Promise<any>((resolve) => {
                resolve({condition: 'false', message: e.message})
            })
        }
    }

    // post data to server and get two type of response
    Post_Data_GetFile(path: string, jsondata: any) {
        path = this.globalurl + path;
        const request = new HttpRequest('POST', path, jsondata, {
            responseType: 'blob',
            reportProgress: true,
            headers: new HttpHeaders().append('Content-Type', 'application/json')
        });
        return this.httpClient.request(request);
    }

    Get_Data_With_DownloadStatus_GetFile(path: string) {
        path = this.globalurl + path;
        const request = new HttpRequest('GET', path, {
            responseType: 'blob',
            reportProgress: true,
            headers: new HttpHeaders().append('Content-Type', 'application/json')
        });
        return this.httpClient.request(request);
    }

    blobToString(b) {
        var urldata, x;
        urldata = URL.createObjectURL(b);
        x = new XMLHttpRequest();
        x.open('GET', urldata, false); // although sync, you're not fetching over internet
        x.send();
        URL.revokeObjectURL(urldata);
        return x.responseText;
    }
}

