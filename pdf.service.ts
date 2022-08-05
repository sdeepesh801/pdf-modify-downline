import { Injectable } from '@angular/core';
declare const require: any;
const jsPDF = require('jspdf');
require('jspdf-autotable');

/**
 * Description:Class configure JSON to pdf file
 */
@Injectable({
    providedIn: 'root'
})

export class PDFService {

    /**
     * Description:Pdf file JSON array
     */
    static __pdf_json = [];

    /**
     * Description:Append string to diffrenciate pdf file
     */
    static __appendedString = '';

    /**
     * Description:report name 
     */
    static reportName:any;

    /**
     * Description:PDF file name which shows on pdf header
     */
    static pdfHeadline:any;

    /**
     * Description:Used as game type i.e SPORT,CASINO
     */
    static betlistType:any;

    /**
     * Description:defined when owner level is login
     */
    static ownertrtrmRole: any;

    /**
     * 
     * @param pdfFileName 
     * @returns downloaded filename
     */
    static toExportFileName(pdfFileName: string): string {
        return `${pdfFileName}_export_${new Date().getTime()}.pdf`;
    }


    /**
     * This funtion used to pdf file naming and page style
     * @param excelFileName 
     */
    static export(excelFileName: string = ""): void {

        console.log(excelFileName);

        if(this.betlistType=='VIRTUAL_SPORTS'){
            this.betlistType='INTERNATIONAL_CASINO'
        }
        if (!excelFileName) { excelFileName = PDFService.toExportFileName("__IceExchange_"); }

        var doc = new jsPDF({
            orientation: 'landscape',
        });
        var col = [];
        var rows = [];
        doc.page=1;  //initial page number


        /**
         * Function for add page no. in footer
         * 
         */
        function footer(){ 
            doc.text('page ' + doc.page,149,200,'center');
            doc.page ++;
        };

        /** 
         *  @description pdf allignment for report by player
         * 
         **/
        console.log(this.__appendedString);

        if(this.pdfHeadline=='user-report'){     
            if(PDFService.__pdf_json != null || PDFService.__pdf_json != undefined){
                if (PDFService.__pdf_json.length > 0) {

                    if(PDFService.__pdf_json[0].children.length > 0){     //this condtion for to get column data from array
                        for (var k in PDFService.__pdf_json[0].children[0]) {col.push(k);}
                    }
                    else if(PDFService.__pdf_json[1].children.length > 0){
                        for (var k in PDFService.__pdf_json[1].children[0]) {col.push(k);}
                    }
                    else{
                        for (var k in PDFService.__pdf_json[2].children[0]) {col.push(k);}
                    }
                    PDFService.__pdf_json.forEach((json) => {
                        
                        if (json.children.length > 0) {
                        let keyhead=[]
                        keyhead[2]=json.gametype
                        rows.push(keyhead);
                        }
                        json.children.forEach((json)=>{
                            let keyJ = [];
                            for (var k in json) {
                                if(json[k]=='' && json[k]!='0'){
                                    json[k]='-'
                                }
                                keyJ.push(json[k]);
                            }
                            rows.push(keyJ);
                        })
                    })
                }
            }
        } 
        
        /**  
         * @description pdf allignment for report by market/downline children table 
         * 
         */
        else if(this.__appendedString ? ((this.__appendedString.split('_')[0])=='marketReport' || (this.__appendedString.split('_')[0])=='UserReport'):false)
        {
        if(PDFService.__pdf_json != null || PDFService.__pdf_json != undefined){
            if (PDFService.__pdf_json.length > 0) {
                for (var k in PDFService.__pdf_json[0]) {
                    col.push(k);
                }
                PDFService.__pdf_json.forEach((json) => {
                    let parent=[]

                    delete json.routeurl
                    for (var k in json) {           //parent data print
                        if(k!='Children'){
                            parent.push(json[k]);
                        }
                    }
                    rows.push(parent);
                    if(json.Children.length){       //chindren header for report by downline
                        let childhead=[]      
                        childhead[2]=json.UID ? json.UID : json.Games ? json.Games :json.Matches       //parant name which table is expand
                        rows.push(childhead);
                        if(this.__appendedString ? (this.__appendedString.split('_')[0])=='UserReport':false){
                            rows.push(['Event Name','Stake','PlayerPl','UplinePl']);  //chindren header for report by downline
                        }
                    }
                     if(this.__appendedString ? (this.__appendedString.split('_')[0])!='UserReport':false){
                        if(json.Children.length){       //chindren header for report my market
                            let childhead=[]      
                            childhead[0]='Markets'
                            childhead[1]='Stake'
                            childhead[2]='PlayerPl'
                            childhead[3]='UplinePl'
                            childhead[4]= this.betlistType=='SPECIAL_MARKET' || this.betlistType=='SPORTS'  ? 'Result' : '';
                            childhead[5]=this.betlistType=='SPORTS' ? 'Commission':'';
                            childhead[6]=''
                            childhead[7]=''
                            childhead[8]=''                 // added extra length to color row with length check
                            rows.push(childhead);
                        }
                     }
                    
                    
                    if(json.Children.length>0){      //children data print
                    json.Children.forEach((json)=>{
                        let keyJ = [];
                        if(this.__appendedString ? (this.__appendedString.split('_')[0])=='UserReport':false){ // for dowline
                          if(this.betlistType!='SPORTS'){     //add eventname after '>' in slot games 
                                 keyJ.push(json.eventTypeName+'>'+json.eventName);
                          }
                          else{
                              keyJ.push(json.eventTypeName);
                          }
                           
                        }

                        else{  // report by market children data
                            if(this.betlistType=='INDIAN_CASINO'){
                                keyJ.push(json.marketType);
                            } 
                            else{
                                keyJ.push(json.eventTypeName+'>'+json.marketType);
                            }
                            //keyJ.push(json.result ? json.result:'-');           //chidren data for report by market
                        }
                        
                        // for (var k in json) {
                        //     keyJ.push(json[k]);
                        // }
                        keyJ.push(json.stake);
                        keyJ.push(json.playerPl);
                        keyJ.push(json.uplinePl);
                        if(this.__appendedString ? (this.__appendedString.split('_')[0])!='UserReport':false){
                            keyJ.push(json.result ? json.result:'-');           //chidren data for report by market
                            keyJ.push(json.commission ? json.commission : '-'); 
                        }

                        keyJ.push('');
                        keyJ.push('');
                        keyJ.push('');
                        keyJ.push('');                     //add blank data for to diffrenciate expend row
                        rows.push(keyJ);
                    })
                    rows.push(['','','',''])                // for add a blank row 
                    // console.log(rows) //check row length and apply css
                }
                    

                })
            }
        }
        }
        /**
         * @description pdf allignment for pnl expand table
         */
        else if(excelFileName.split('_')[0]=='profit-loss' && this.__appendedString=='expendtable'){
            if(PDFService.__pdf_json != null || PDFService.__pdf_json != undefined){
                if (PDFService.__pdf_json.length > 0) {
                    for (var k in PDFService.__pdf_json[0]) {
                        if(k=='Children'){
                            col.push('');
                        }
                        else{
                            col.push(k);
                        }
                    }
                    col.push(" ");
                    PDFService.__pdf_json.forEach((json) => {
                        let parent=[]
    
                        for (var k in json) {           //parent data print
                            if(k!='Children'){
                                parent.push(json[k]);
                            }
                        }

                        rows.push(parent);
                        if(json.Children.length){       //chindren header for report by downline
                            let childhead=[]      
                            childhead[2]=json.Market
                            rows.push(childhead);
                        }
                            if(json.Children.length){       //chindren header for report my market
                                let childhead=[]      
                                childhead[0]='Bet ID'
                                childhead[1]='Selection'
                                childhead[2]='Odds'
                                childhead[3]='Stake'
                                childhead[4]='Type'
                                childhead[5]='Placed'
                                childhead[6]='Profit/Loss'
                                childhead[7]=''
                                childhead[8]=''                 // added extra length to color row with length check
                                rows.push(childhead);
                            }
                        //  }
                        if(json.Children.length>0){      //children data print
                        json.Children.forEach((json)=>{
                            let keyJ = [];
                            keyJ.push(json.id);
                            keyJ.push(json.selectionName);
                            keyJ.push(json.oddReq);
                            keyJ.push(json.exchangeStake);
                            keyJ.push(json.sideTypeName);           //chidren data for report by market
                            keyJ.push(json.placeDate); 
                            keyJ.push(json.profitNLoss);
                            keyJ.push('');                    //add blank data for to diffrenciate expend row
                            rows.push(keyJ);
                        })
                        rows.push(['','','',''])                // for add a blank row 
                    }
                        
    
                    })
                }
            }
        }

        /**
         * @description pdf allignmrnt for group by user expand table
         */
        else if(excelFileName.split('_')[0]=='groupbyuser-report' && this.__appendedString=='expendtable'){
            if(PDFService.__pdf_json != null || PDFService.__pdf_json != undefined){
                if (PDFService.__pdf_json.length > 0) {
                    for (var k in PDFService.__pdf_json[0]) {
                        if(k=='Children'){
                            col.push('');
                            col.push('');
                            col.push('');
                            col.push('');
                            col.push(''); //extra length to align row 

                        }
                        else{
                            col.push(k);
                        }
                    }
                    col.push(" ");
                    PDFService.__pdf_json.forEach((json) => {
                        let parent=[]
    
                        for (var k in json) {           //parent data print
                            if(k!='Children'){
                                parent.push(json[k]);
                            }
                        }

                        rows.push(parent);
                        if(json.Children.length){       //chindren header for report by market group by user
                            let childhead=[]      
                            childhead[2]=json.playerName
                            // childhead[4]=''
                            rows.push(childhead);
                        }
                            if(json.Children.length){       //chindren header for report my market group by user
                                let childhead=[]      
                                childhead[0]='Bet ID'
                                childhead[1]='Ip Address'
                                childhead[2]='Market'
                                childhead[3]='Selection'
                                childhead[4]='Odds'
                                childhead[5]='Stake'
                                childhead[6]='Type'
                                childhead[7]='Exposer'
                                childhead[8]='Placed'
                                childhead[9]='Profit/Loss'
                                childhead[10]=''
                                childhead[11]=''
                                childhead[12]=''
                                rows.push(childhead);
                            }
                        //  }
                        if(json.Children.length>0){      //children data print
                        json.Children.forEach((json)=>{
                            let keyJ = [];
                            keyJ.push(json.BetId);
                            keyJ.push(json.ipAddress);
                            keyJ.push(json.marketName);
                            keyJ.push(json.selectionName);
                            keyJ.push(json.odds);
                            keyJ.push(json.exchangeStakes);
                            keyJ.push(json.Type);           //chidren data for report by market group by user
                            keyJ.push(json.Exposure);           //chidren data for report by market group by user
                            keyJ.push(json.placeDate); 
                            keyJ.push(json.profitNLoss);
                            // keyJ.push('');

                            rows.push(keyJ);
                        })
                        rows.push(['','','',''])                // for add a blank row 
                    }
                        
    
                    })
                }
            }
        }
        else if(excelFileName.split('_')[0]=='down-line-list'){
            
            console.log(PDFService.__pdf_json);
            
            
            if (PDFService.__pdf_json.length > 0) {

                for(var k in PDFService.__pdf_json[0]){
                    if(k=="Username"||k=="Status")
                    col.push(k);
                }

            //    for (var k in PDFService.__pdf_json[0]) {
            //        col.push(k);
            //    }
            //    col.push('NetPnl');
               PDFService.__pdf_json.forEach(json=>{
                let keyJ=[];
                for(var k in json){
                    if(k=="Username"||k=="Status"){
                        keyJ.push(json[k]);
                        
                    }

                }
                console.log(keyJ);
                rows.push(keyJ);
               })

            //    PDFService.__pdf_json.forEach((json) => {
            //        let keyJ = [];
            //        for (var k in json) {
            //            keyJ.push(json[k]);
            //        }
            //        keyJ.push(json.Rate*json.RefPnL);
            //        rows.push(keyJ);
            //    })
           }
           console.log(rows)
           console.log(col)
        }
        else{
        if(PDFService.__pdf_json != null || PDFService.__pdf_json != undefined){
            if (PDFService.__pdf_json.length > 0) {
                 if(this.pdfHeadline=='downline-report' || this.pdfHeadline=='market-report' || this.pdfHeadline=='associate-report-market'){
                        delete PDFService.__pdf_json[0].Children
                        delete PDFService.__pdf_json[0].routeurl
                    }
                for (var k in PDFService.__pdf_json[0]) {
                    col.push(k);
                    //rows.push(PDFService.__pdf_json.length[k]);
                }
    
                PDFService.__pdf_json.forEach((json) => {
                    let keyJ = [];
                    for (var k in json) {
                        keyJ.push(json[k]);
                    }
                    rows.push(keyJ);
                })
            }
        }}
       

        /* The following array of object as response from the API req  */
        //return;
    doc.setProperties({
	    title: 'IceExchange',
	   
    });

    /*
    *   @description head line in pdf
    */
    if(excelFileName.split('_')[0]){
        this.reportName = excelFileName.split('_')[0]
        if(this.reportName=='down-line-list'){ this.reportName = 'Downline List Report'}
        else if(this.reportName=='bet-history'){ this.reportName = 'Bet History Report'}
        else if(this.reportName=='profit-loss'){ this.reportName = 'Profit And Loss Report'}
        else if(this.reportName=='betlive-list'){this.reportName='BetList Live Report'}
        else if(this.reportName=='bet-list'){this.reportName='BetList Report'}
        else if(this.reportName=='banking'){this.reportName='Banking Report'}
        else if(this.reportName=='account-statement'){this.reportName='Account Statement'}
        else if(this.pdfHeadline=='downline-report' && this.reportName=='my-report' ){this.reportName='Report By Downline'}
        else if(this.pdfHeadline=='market-report' && this.reportName=='my-report'){this.reportName='Report By Market'}
        else if(this.pdfHeadline=='associate-report-market' && this.reportName=='my-report'){this.reportName='Associate Report By Market'}
        else if(this.pdfHeadline=='downline-report' && this.reportName=='report'){this.reportName='Downline Betlist'}
        else if(this.pdfHeadline=='market-report'  && this.reportName=='report'){this.reportName='Market Betlist'}
        else if(this.pdfHeadline=='user-report' ){this.reportName='Report By Player'}
        else if(this.pdfHeadline=='ip-report' ){this.reportName='Report By IP Address'}
        else if(this.reportName=='notification' ){this.reportName='Notification History'}
        else if(this.reportName=='activity-log' ){this.reportName='Activity log'}
        else if(this.reportName=='groupbyuser-report' ){this.reportName='Report by market User Bets'}
        else if(this.__appendedString){this.__appendedString.split('_')[0]=='UserReport' ? this.reportName='Report By Downline(2)' : this.reportName='Report By Market(2)'}
        else{
            this.reportName='IceExchange Report'
        }
        // console.log(this.reportName)
        }


        /**
         * pdf page style or colmn width generate from here
         */
        PDFService.autoTableConfigForBetList(col,rows,doc,this.reportName);
    
        let projectarray;
        let projectName;
        projectarray = excelFileName.split('_')
        projectName=projectarray.splice(projectarray.indexOf('IceExchange'),1)
        var date = new Date().toISOString().slice(0, 10);

        if(this.__appendedString== null|| this.__appendedString==undefined || this.__appendedString == ''){            
            
            doc.save(projectName+'_'+projectarray.join('_')+'_'+date);
            // doc.save(excelFileName);
        }else{
            doc.save(projectName+'_'+projectarray.join('_')+'_'+date);
            // doc.save(excelFileName+'_'+PDFService.__appendedString);
        }
        
    }

    /**
     * This funtion used for colomn width page style according to report name
     * 
     * @param {any} col :
     * @param {any} rows 
     * @param {any} doc 
     * @param {string} reportName The name shows in page header
     */
   static autoTableConfigForBetList(col:any,rows:any,doc:any,reportName:string){

    console.log(this.__pdf_json.length)
    console.log(reportName);
    console.log(this.pdfHeadline);
    
    if(this.__pdf_json.length){
        let cellWidth
        let fontsz=8
        let fontstyl='normal'
        let haligntext='left'
        let header
        
        /**
         * @description //assign colmn width to fit page
         */
        

        //account statment
        if(reportName=='Account Statement'){}
        //bethistory when owner open player profile
        else if(reportName=='Bet History Report' && this.betlistType=='SPORTS' && this.ownertrtrmRole || reportName=='Bet History Report' && this.betlistType=='INDIAN_CASINO' && this.ownertrtrmRole ){fontsz=6}
        //profit and loss sport and specila market colmns  
        else if(reportName=='Profit And Loss Report' && this.betlistType=='SPORTS' && this.__appendedString!='expendtable' || reportName=='Profit And Loss Report' && this.betlistType=='SPECIAL_MARKET'  && this.__appendedString!='expendtable'){cellWidth =this.pnl_Sports}
         //profit and loss indian casino colmns
        else if(reportName=='Profit And Loss Report' && this.betlistType=='INDIAN_CASINO'){cellWidth =this.pnl_INDIAN_CASINO}
        //betlist/betlsitlive/reportBydownline/reportBymarket betlsit sport for owner
        else if(reportName=='BetList Report' && this.betlistType=='SPORTS' && this.ownertrtrmRole || reportName=='BetList Live Report' && this.betlistType=='SPORTS' && this.ownertrtrmRole || reportName=='Market Betlist' && this.betlistType=='SPORTS' && this.ownertrtrmRole || reportName=='Downline Betlist' && this.betlistType=='SPORTS' && this.ownertrtrmRole ){fontsz=6;cellWidth =this.betList_Sports}
        //betlist/reportBydownline/reportBymarket betlslist indian casino for owner
        else if(reportName=='BetList Report' && this.betlistType=='INDIAN_CASINO' && this.ownertrtrmRole || reportName=='Downline Betlist' && this.betlistType=='INDIAN_CASINO' && this.ownertrtrmRole || reportName=='Market Betlist' && this.betlistType=='INDIAN_CASINO' && this.ownertrtrmRole){fontsz=6;cellWidth =this.betList_INDIAN_CASINO}
        //betlist/reportBydownline/reportBymarket betlslist international casino for owner
        else if(reportName=='BetList Report' && this.betlistType=='INTERNATIONAL_CASINO' && this.ownertrtrmRole || reportName=='Downline Betlist' && this.betlistType=='INTERNATIONAL_CASINO' && this.ownertrtrmRole || reportName=='Market Betlist' && this.betlistType=='INTERNATIONAL_CASINO' && this.ownertrtrmRole){fontsz=7}
        //betlistLive casino colmns for owner
        else if(reportName=='BetList Live Report' && this.betlistType=='INDIAN_CASINO' && this.ownertrtrmRole ){fontsz=6;cellWidth =this.betListlive_INDIAN_CASINO}
        //betlistLive casino colmns for owner
        else if(reportName=='BetList Live Report' && this.betlistType=='INTERNATIONAL_CASINO' && this.ownertrtrmRole ){fontsz=7}
        //betlist or betlsitLive table for withour owner like master admin
        else if(reportName=='BetList Report' && this.betlistType=='SPORTS' || reportName=='BetList Report' && this.betlistType=='INDIAN_CASINO' || reportName=='BetList Report' && this.betlistType=='SPECIAL_MARKET' || 
                reportName=='BetList Live Report' && this.betlistType=='SPORTS' || reportName=='BetList Live Report' && this.betlistType=='INDIAN_CASINO' || reportName=='BetList Live Report' && this.betlistType=='SPECIAL_MARKET'){fontsz=5.5}
        //report by ipaddress
        else if(reportName=='Report By IP Address'){haligntext='left';cellWidth =this.reportbyIP;fontstyl='bold'}
        //expand table for profit loss
        else if(reportName=='Profit And Loss Report' && this.__appendedString=='expendtable'){cellWidth =this.pnlexpand;;fontstyl='bold'}
        //expand table for Report by market User Bets
        else if(reportName=='Report by market User Bets' && this.__appendedString=='expendtable'){cellWidth =this.reportbymarketUserBet;fontstyl='bold'}
        //report by downline betlist 
        else if(reportName=='Downline Betlist'){fontsz=6}


        /**
         * @description assign table static header
         */
        //report by player win % report
        else if(this.pdfHeadline=='user-report' && this.betlistType=='WINREPORT'){header = this.winheader}
        //report by player VOLUMEREPORT
        else if(this.pdfHeadline=='user-report' && this.betlistType=='VOLUMEREPORT'){header = this.volumeheader}
        //static report by Downline expand table without sport
        else if(reportName=='Report By Downline(2)' && this.betlistType!='SPORTS'){fontstyl='bold';header = this.ReportByDLExpandheaderWithoutSport}
        //static report by Downline expand table for sport
        else if(reportName=='Report By Downline(2)' && this.betlistType=='SPORTS'){fontstyl='bold';header = this.ReportByDLSport}
        //static report by Market expand table for sport
        else if(reportName=='Report By Market' && this.betlistType=='SPORTS'){fontstyl='bold';header = this.ReportByMarktSport}
        //static report by Market expand table for SPECIAL_MARKET
        else if(reportName=='Report By Market' && this.betlistType=='SPECIAL_MARKET'){fontstyl='bold';header = this.ReportByMarktSpecialMarket}
        //static report by Market expand table for INDIAN_CASINO or INTERNATIONAL_CASINO
        else if(reportName=='Report By Market' && (this.betlistType=='INDIAN_CASINO' || this.betlistType=='INTERNATIONAL_CASINO')){fontstyl='bold';header = this.ReportByMarktCasinoOrINTCasino}
        //static Assocaite report by Market expand table for sport
        else if(reportName=='Associate Report By Market' && this.betlistType=='SPORTS'){fontstyl='bold';header = this.ReportByMarktSport}
        //static report by Market expand table for SPECIAL_MARKET
        else if(reportName=='Associate Report By Market' && this.betlistType=='SPECIAL_MARKET'){fontstyl='bold';header = this.ReportByMarktSpecialMarket}
        //static report by Market expand table for INDIAN_CASINO or INTERNATIONAL_CASINO
        else if(reportName=='Associate Report By Market' && (this.betlistType=='INDIAN_CASINO' || this.betlistType=='INTERNATIONAL_CASINO')){fontstyl='bold';header = this.ReportByMarktCasinoOrINTCasino}


        else{fontsz=8;fontstyl='normal';haligntext='center'}
       
            doc.autoTable(col, rows, {
                head:header,
                styles : {
                fontSize : fontsz,
                showFoot: 'everyPage',
                //cellPadding : 1,
                overflow : 'linebreak',
                //lineWidth : .3,
                fontStyle:fontstyl,
                valign: 'middle', 
                halign: haligntext
                },columnStyles: cellWidth,
                margin : {
                    top : 30,
                    left: 5,
                    right: 5
                },
                didParseCell: (cell) => {this.rowStyle(cell,rows,reportName)},
                didDrawPage : (data) =>{
                doc.setFontSize(15);
                doc.text(reportName,147,20,'center');
                this.footer(doc)
                }
                });
    }
        
    }


    /**
     * This Funtion Style or align expand row like pnl table, report by downline,report by market
     * @param {any} cell 
     * @param {any} rows 
     * @param {string} reportName : this is file report name 
     * 
     */
    static rowStyle(cell:any,rows:any,reportName:string){
            
            if(reportName=='Report By Player'){
                rows.forEach((el,i)=>{
                    if (cell.row.section != 'head') {
                    if(el[2]=='ACE CASINO' || el[2]=='INTERNATIONAL CASINO' || el[2]=='SPORTS' || el[2]=='SLOTS AND BINGO' || el[2]=='SPECIAL MARKET' || el[2]=='VIRTUAL SPORTS'){
                        if(cell.row.index==i){
                            for ( var index of Object.keys( cell.row.cells ) ) {
                            cell.row.cells[ index ].styles.fontSize = 8;
                            cell.row.cells[ index ].styles.fontStyle = 'bold';
                            cell.row.cells[ index ].styles.fillColor = [22, 160, 133];
                            cell.row.cells[ index ].styles.valign = 'middle';
                            cell.row.cells[ index ].styles.halign='right'
                            cell.row.cells[ index ].styles.textColor = 255
                            }
                        }
                    }
                }})
            }
            else if(reportName=='Profit And Loss Report' && this.__appendedString=='expendtable' || reportName=='Report by market User Bets' && this.__appendedString=='expendtable' || reportName=='Report By Downline(2)' || reportName=='Report By Market' || reportName=='Associate Report By Market'){
                rows.forEach((el,i)=>{
                    if (cell.row.section != 'head') {
                        if(el.length==3){   //expend row header parant name or market name
                            if(cell.row.index==i ){
                                for ( var index of Object.keys( cell.row.cells ) ) {
                                cell.row.cells[ index ].styles.fontSize = 8;
                                cell.row.cells[ index ].styles.fontStyle = 'bold';
                                cell.row.cells[ index ].styles.fillColor = [22, 160, 133];
                                cell.row.cells[ index ].styles.valign = 'middle';
                                cell.row.cells[ index ].styles.halign= 'center'
                                cell.row.cells[ index ].styles.textColor = 255
                                }
                            }
                        }
                    if(el.length==9 || el.length==13){   //expend row header style with length of row
                        if(cell.row.index==i ){
                            for ( var index of Object.keys( cell.row.cells ) ) {
                            cell.row.cells[ index ].styles.fontSize = 8;
                            cell.row.cells[ index ].styles.fontStyle = 'bold';
                            cell.row.cells[ index ].styles.fillColor = [22, 160, 133];
                            cell.row.cells[ index ].styles.valign = 'middle';
                            cell.row.cells[ index ].styles.halign= 'left'
                            cell.row.cells[ index ].styles.textColor = 255
                            }
                        }
                    }
                    if(el.length==7 || el.length==8|| el.length==10){   //expend row style with length of row
                        if(cell.row.index==i ){
                            for ( var index of Object.keys( cell.row.cells ) ) {
                            cell.row.cells[ index ].styles.fontSize = 8;
                            cell.row.cells[ index ].styles.fontStyle = 'normal';
                            cell.row.cells[ index ].styles.valign = 'middle';
                            }
                        }
                    }
                }})
            }
            else if(reportName=='Account Statement'){
                rows.forEach((el,i)=>{
                    if (cell.row.section != 'head') {
                            for ( var index of Object.keys( cell.row.cells ) ) {
                            cell.row.cells[ 2 ].styles.valign = 'middle';
                            if(cell.row.cells[2].text[0]!='0'){
                                cell.row.cells[ 2 ].styles.textColor = [255,0,0]
                            }
                            if(cell.row.cells[1].text[0]!=0){
                                cell.row.cells[ 1 ].styles.textColor = [0,128,0]
                            }
                            }
                }})
            }
            else if(this.reportName == 'Downline List Report'){
                rows.forEach((el,i)=>{

                    console.log(Object.keys( cell.row.cells ))

                    if (cell.row.section != 'head') {
                                    for ( var index of Object.keys( cell.row.cells ) ) {
                                    cell.row.cells[ 1 ].styles.valign = 'middle';
                                        if(cell.row.cells[1].text[0]>0){
                                            cell.row.cells[ 1 ].styles.textColor = [0,128,0]
                                        }
                                        else if(cell.row.cells[1].text[0]<0){
                                            cell.row.cells[1].styles.textColor = [255,0,0]
                                        }
                                    }
                        }
                    
                //     if (cell.row.section != 'head') {
                //             for ( var index of Object.keys( cell.row.cells ) ) {
                //             cell.row.cells[ 10 ].styles.valign = 'middle';
                //                 if(cell.row.cells[10].text[0]>0){
                //                     cell.row.cells[ 10 ].styles.textColor = [0,128,0]
                //                 }
                //                 else if(cell.row.cells[10].text[0]<0){
                //                     cell.row.cells[10].styles.textColor = [255,0,0]
                //                 }
                //             }
                // }
            })
            }
    }
    

    //column width acc to page
    static accountstatementcolumn={0: {cellWidth: 35},1: {cellWidth: 55},2: {cellWidth: 20},3: {cellWidth: 30},4: {cellWidth: 25},5: {cellWidth: 34},6: {cellWidth: 25},7: {cellWidth: 35},8: {cellWidth: 20},9: {cellWidth: 35},}
    static pnl_Sports={0: {cellWidth: 100},1: {cellWidth: 55},2: {cellWidth: 55},3: {cellWidth: 30},4: {cellWidth: 45}}
    static pnl_INDIAN_CASINO={0: {cellWidth: 15},1: {cellWidth: 25},2: {cellWidth: 40},3: {cellWidth: 30},4: {cellWidth: 25},5: {cellWidth: 50},6: {cellWidth: 45},7: {cellWidth: 35},8: {cellWidth: 20},9: {cellWidth: 35}}
    static reportbyIP={0: {cellWidth: 30},1: {cellWidth: 20}}
    static betList_Sports={0: {cellWidth: 15},1: {cellWidth: 25},2: {cellWidth: 15},3: {cellWidth: 20},4: {cellWidth: 30},5: {cellWidth: 12},6: {cellWidth: 10},7: {cellWidth: 15},8: {cellWidth: 12},9: {cellWidth: 12},10: {cellWidth: 15},11: {cellWidth: 32},12: {cellWidth: 15},13: {cellWidth: 15},14: {cellWidth: 14},15: {cellWidth: 14},16: {cellWidth: 10}}
    static betList_INDIAN_CASINO={0: {cellWidth: 15},1: {cellWidth: 25},2: {cellWidth: 15},3: {cellWidth: 20},4: {cellWidth: 15},5: {cellWidth: 20},6: {cellWidth: 12},7: {cellWidth: 15},8: {cellWidth: 12},9: {cellWidth: 12},10: {cellWidth: 16},11: {cellWidth: 15},12: {cellWidth: 15},13: {cellWidth: 14},14: {cellWidth: 14},15: {cellWidth: 17},16: {cellWidth: 14},17: {cellWidth: 10}}
    static betListlive_INDIAN_CASINO={0: {cellWidth: 15},1: {cellWidth: 45},2: {cellWidth: 15},3: {cellWidth: 20},4: {cellWidth: 15},5: {cellWidth: 40},6: {cellWidth: 12},7: {cellWidth: 15},8: {cellWidth: 12},9: {cellWidth: 25},10: {cellWidth: 15},11: {cellWidth: 15},12: {cellWidth: 19},13: {cellWidth: 19}}
    static pnlexpand={0: {cellWidth: 75},1: {cellWidth: 45},2: {cellWidth: 55},3: {cellWidth: 25}}
    static reportbymarketUserBet={0: {cellWidth: 35},1: {cellWidth: 75},2: {cellWidth: 55}}

    //static header
    static winheader = [['UID', 'Currency','Win %', 'UID', 'Currency','Loss %']];
    static volumeheader = [['UID', 'Currency','Win Player Pl', 'UID', 'Currency','Loss Player Pl']];
    static ReportByDLSport= [['UID', 'Stake', 'PlayerPL', 'UplinePL','MO Comm','BM Comm']];
    static ReportByDLExpandheaderWithoutSport= [['UID', 'Stake', 'PlayerPL', 'UplinePL']];
    static ReportByMarktSport= [['Matches', 'Stake', 'PlayerPL', 'UplinePL','MO Comm','BM Comm']];
    static ReportByMarktCasinoOrINTCasino= [['Games', 'Stake', 'PlayerPL', 'UplinePL']];
    static ReportByMarktSpecialMarket= [['Matches', 'Stake', 'PlayerPL', 'UplinePL']];

    /**
     * this funtion for add page number in pdf footer
     * @param {any} doc 
     */
    static footer(doc:any){
            doc.text('page ' + doc.page,149,200,'center');
            doc.page ++;
        };
}
