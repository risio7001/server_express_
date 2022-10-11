// const { ConnectionPool } = require("mssql");
const mssql = require('mssql');
const conf = require('../dbconfig.json');
const sha512 = require('js-sha512')
const nodemailer = require('nodemailer');
const emailSend = require('../controller/mailController');

class SignUpController {
    async signUp(req, res) {
        const siteID = 'flda'

        const dealerType = 'BIZ'

        const dealerName = req.body.dealerName//	' 상호명
        const chName = req.body.chName	//	' 대표자명
        const id = req.body.id
        const pass = req.body.pass
        const rePass = req.body.rePass
        const pwd = sha512(req.body.pwd);
        const mobile = req.body.mobile
        // mobile =req.body.mobile,"^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?([0-9]{3,4})-?([0-9]{4})$","$1-$2-$3"
        const emailId = req.body.email
        const tel = req.body.tel
        // tel = eRegiReplace(tel,"^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?([0-9]{3,4})-?([0-9]{4})$","$1-$2-$3")
        const bizNo = req.body.bizNo				//	' 사업자번호
        const fax = req.body.fax
        // fax = eRegiReplace(fax,"^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?([0-9]{3,4})-?([0-9]{4})$","$1-$2-$3")
        const dealerEtc1 = req.body.dealerEtc1	//	' 통신판매번호
        const post = req.body.post
        const addr = req.body.addr
        const addrDetail = req.body.addrDetail
        const addrLat = req.body.addrLat // ' 2019-06-28 오후 6:28:14
        const addrLng = req.body.addrLng // ' 2019-06-28 오후 6:28:14
        const dealerEtc2 = req.body.dealerEtc2	//	' 전문분야선택
        // const dealerEtc3 = req.body.dealerEtc3	//	' 발주만, 수주만, 수발주 모두??
        const bank = req.body.bank				//	' 은행
        const account = req.body.account			//' 계좌
        const depositor = req.body.depositor	//	' 계좌명
        const rec_member = req.body.recMember	//' 유치가맹점아이디
        const deliveryCode = req.body.deliveryCode//	' 배송가능지역 코드
        const deliveryAddrName = req.body.deliveryAddrName	//' 배송가능지역 명
        const dealerEtc5 = req.body.dealerEtc5	//	' 판매자 매장 설명
        const channel = req.body.channel			//		' 가입경로
        const raddr = req.body.raddr;           // 배송지
        console.log(raddr);
        let dd = null;
        if(raddr === null){
            dd = null;
        }else{
            dd = JSON.parse(raddr);
        }
        // const dd = JSON.parse(raddr);
        
        let bizFile=null;
        let shopFile=null;

        // console.log(req.files);

        if(!req.files){
            res.send('업로드된 파일이 없습니다.');
        }
        else {
            // console.log(req.file);
            // bizFile = req.files[0].filename;
            // shopFile = req.files[1].filename;
        }
        const cmstype = 'MIM'
        const state = 200;
 //200 등록요청 상태 
 //300 승인 거절 상태
 //100 승인 완료 상태
        

        try {
            await mssql.connect({
                database: conf.database,
                server: conf.server,
                user: conf.user,
                password: conf.password,
                options: {
                    encrypt: false
                }
            })
            // 환경설정
            const result = await mssql.query`SELECT ComTel, MDName, MDEmail, IsAdmRegPsn, 
            IsAdmRegBiz, AccountCycle, DeliveryMethod, DeliveryFee, DeliveryLimit, 
            RecMemberAccountPercent,B.cmsRate FROM T_CONFIG_COMPANY AS A JOIN T_CONFIG_MIM 
            AS B ON A.SiteID=B.SiteID JOIN T_CONFIG_MANAGE AS C ON A.SiteID=C.SiteID 
            WHERE A.SiteID=${siteID}`

            if (result) {
                const cfgComTel = result.recordset[0].ComTel;
                const cfgMdName = result.recordset[0].MDName;
                const cfgMdEmail = result.recordset[0].MDEmail;
                const cfgIsAdmRegPsn = result.recordset[0].IsAdmRegPsn;
                const cfgIsAdmRegBiz = result.recordset[0].IsAdmegBiz;
                const cfgAccountCycle = result.recordset[0].AccountCycle;
                const cfgDeliveryMethod = result.recordset[0].DeliveryMethod;
                const cfgDeliveryFee = result.recordset[0].DeliveryFee;
                const cfgDeliveryLimit = result.recordset[0].DeliveryLimit;
                const cfgRecMemberAccountPercent = result.recordset[0].RecMemberAccountPercent;
                const cmsRate= result.recordset[0].cmsRate;
                
                // 고객 정보 등록
                const result1 = await mssql.query`INSERT INTO MEMBER_TEST (SiteID, DealerID, Pass, DealerType, DealerName, AccountCycle, CmsType, DeliveryMethod, DeliveryFee, DeliveryLimit, State,cmsRate) 
                VALUES (${siteID}, ${id}, ${pwd}, ${dealerType}, ${dealerName}, 
                    ${cfgAccountCycle}, ${cmstype}, ${cfgDeliveryMethod}, ${cfgDeliveryFee}, 
                    ${cfgDeliveryLimit}, ${state}, ${cmsRate});
                SELECT @@IDENTITY AS length;`
                
                const uid = result1.recordset[0].length; // IDENTITY 
                
                // await mssql.query`INSERT INTO MEMBER_TEST_INFO (Uid) VALUES (${uid})`
                // console.log(result2);

                // 고객 상세정보 등록
                await mssql.query`INSERT INTO MEMBER_TEST_INFO
                ( Uid, BizNo, Bank, Account, Depositor, ChName, 
                 Tel, Mobile, Fax, Email, Post, Addr, AddrDetail, AddrLat, AddrLng, 
                 BizFile, dealer_etcAdd2, 
                 dealer_etcAdd4, dealer_etcAdd5 )
                 VALUES ( ${uid}, ${bizNo}, ${bank}, ${account}, ${depositor},
                     ${chName}, ${tel}, ${mobile}, ${fax}, ${emailId}, ${post}, ${addr}, ${addrDetail},
                     ${addrLat}, ${addrLng}, ${bizFile}, ${dealerEtc2}, ${shopFile}, ${dealerEtc5});`

                // 배송지 주소 등록
                let addr_code;
                let addr_name;

                for (var i in dd) {
                    for (var j in dd[i].dong) {
                        addr_code=(dd[i].dong[j].code);
                        addr_name=(dd[i].sido + " " + dd[i].dong[j].name);
                        await mssql.query`INSERT INTO MEMBER_TEST_DELIVERY_ADDR ( siteID, dealerID, addr_code, addr_name ) 
                            VALUES (${siteID}, ${id}, ${addr_code}, ${addr_name})`
                    }
                }
                // 미니샵 등록
                await mssql.query`INSERT INTO MEMBER_TEST_MSHOP ( Uid, ShopName ) 
                VALUES ( ${uid}, ${dealerName} )`

                const levelUid = 1738
                const isSolar = 'F'
                //회원정보 등록
                await mssql.query`SET NOCOUNT ON;
                INSERT INTO MEMBER_TEST_MEMBER ( SiteID, PartnerID, UserID, Pwd, Name, BizNo, Tel, Mobile,
                Email, Post, Addr, AddrDetail, AddrLat, AddrLng,
                LevelUid, State, rec_member, rec_cms, channel, IsSolar)
                VALUES (${siteID}, ${siteID}, ${id}, ${pwd}, ${dealerName}, ${bizNo}, ${tel}, ${mobile}, ${emailId}, 
                    ${post}, ${addr}, ${addrDetail}, ${addrLat}, ${addrLng}, ${levelUid}, ${state}, ${rec_member}, ${cfgRecMemberAccountPercent}, 
                    ${channel}, ${isSolar});
                SELECT @@IDENTITY AS length2;`

                // mail(emailId, dealerName); // 이메일 발송

                res.send("getEnvTest");
            }
        }
        catch (err) {
            console.log(err)
        }

    }
}

const controller = new SignUpController();
module.exports = controller;