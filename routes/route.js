const express = require('express');
const multer = require('multer');
const mssql = require('mssql');
// const bodyParser = require('body-parser');
const conf = require('../dbconfig.json');
// var parser = bodyParser.urlencoded({extended:false});
const controller = require('../controller/controller');
const signUpController = require('../controller/signUpController');
const path = require('path');
const pullController = require('../controller/pullController');
const pushController = require('../controller/pushController');
const reviewController = require('../controller/reviewController');
const ribbonController = require('../controller/ribbonController');
const cscenterController = require('../controller/cscenterController');
const payController = require('../controller/payController');
const cashController = require('../controller/cashController');
const mailController = require('../controller/mailController');


const testExport = require('../testExport');

const router = express.Router();

// 파일 업로드용 multer 설정
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb){
            cb(null, 'img/');
        },
        filename(req, file, db){
            const ext = path.extname(file.originalname);
            db(null, path.basename(file.originalname, ext) + Date.now() + ext);
        }
    }),
    limits:{
        fileSize : 5*1024*1024
    }
})

router.post('/sun/sun/testsignup', upload.array('file'), signUpController.signUp);
// 테스트
router.get(`/sun/sun/test`, controller.test2);
router.get('/sun/sun/read', controller.Read);
router.post('/sun/sun/create', controller.Create);

// 수주관리
router.get('/sun/sun/pull/count', pullController.pullCount);
router.get('/sun/sun/pull/:mode', pullController.pull);
router.get('/sun/sun/push/detail/:uid', pullController.pullDetail);

// 발주관리
router.get('/sun/sun/push/count', pushController.pushCount);
router.get('/sun/sun/push/:mode', pushController.push);
router.get('/sun/sun/push/img/:uid/:dealer', pushController.imgPath);

// 리뷰 관련
router.get('/sun/sun/order/review/:infouid', reviewController.reviewload);
router.post('/sun/sun/order/review/insert', reviewController.reviewInsert);
router.get('/sun/sun/myreview', reviewController.myReview);
router.get('/sun/sun/csreview', reviewController.csReview);
router.get('/sun/sun/del/review/:uid', reviewController.delReview);

// 리본문구 관련
router.get('/sun/sun/ribbon/:userid/:type', ribbonController.ribbonList);
router.get('/sun/sun/ribbontest/:uid/:type/:text', ribbonController.ribbonAdd);
router.post('/sun/sun/ribbontestdel', ribbonController.delribbon);

// 고객센터 관련
router.get('/sun/sun/cscenter/list/:siteid/:userid', cscenterController.csList);
router.get('/sun/sun/consultCode', cscenterController.consultCode);
router.post('/sun/sun/csmodify/:uid', cscenterController.csmodify);
router.get('/sun/sun/delCS/:uid', cscenterController.csdel);
// expo 환경에선 파일 업로드 기능 미사용으로 none() 사용 
// cli 환경으로 전환시 변경 필요
router.post('/sun/sun/csinsert',upload.none() , cscenterController.csinsert);
router.post('/sun/sun/cscenter/member', cscenterController.member);
router.post('/sun/sun/cscenter/member/modify', upload.none(), cscenterController.memberModify);
router.post('/sun/sun/cscenter/map', cscenterController.memberMap);

//  결제 관련 (아임포트)
router.post('/sun/sun/cscenter/map', payController.payCancel);
//test
// router.post('/sun/sun/cscenter/map/getTest',upload.none(), cscenterController.addrTest);

// 충전금 관련
router.post('/sun/sun/cashTry', cashController.cashTry);

// 메일 관련
router.post('/sun/sun/mailSendTest', mailController.sendMail);
router.post('/sun/sun/mailAuthSendTest', mailController.sendMailAuth);


router.get('/sun/sun/delete/:delid', async (req, res) => {
    const delid = req.params.delid;
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
        await mssql.query(`delete from testTable where id = ${delid}`)
        res.send({ result: "Success!" });
    } catch (err) {
        console.log(err);
    }
})

router.get('/sun/sun/test2/:selid', async (req, res) => {
    const selid = req.params.selid;
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
        const result = await mssql.query`select * from testTable where id = ${selid}`
        res.send(result);
        console.log("success : " + result);
    } catch (err) {
        console.log("err : " + err)
    }
});

router.post('/sun/sun/update/:upid', async (req, res) => {
    const upid = req.params.upid;
    const ppp = req.body.ppp;
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
        const result = await mssql.query(`UPDATE testTable SET name = '${ppp}' WHERE id = ${upid}`)
        res.send(name);
        console.log("success : " + result);
    } catch (err) {
        console.log("err : " + err)
    }
});

router.get('/sun/sun/test22/:cate/:adcode/:listsort', async (req, res) => {
    let cate = req.params.cate;
    let listsort = req.params.listsort
        ? req.params.listsort
        : 'ASC';
    let adcode = req.params.adcode;
    let page = req.query.page;
    let userid = req.query.userid;

    if (page === undefined)
        page = 1;
    if (listsort === undefined)
        listsort = 'ASC';

    if (cate == undefined) {
        res.send({ result: false, message: 'ī�װ����� �����ϴ�.' });
        res.end();
    }

    if (adcode == undefined) {
        res.send({ result: false, message: '�ּ��ڵ尡 �����ϴ�' });
        res.end();
    }

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
        const result = await mssql.query`SELECT COUNT(*) AS TotalCnt FROM V_GOODS AS G LEFT JOIN T_DELIVERY_ADDR AS DA ON G.DealerID = DA.dealerID LEFT OUTER JOIN (select uid,name as brandName,name_en as brandname_en from t_brand(NOLOCK) 
    where isHidden='F') TB ON TB.uid=G.brandUid WHERE G.SiteID='flda' AND G.GoodsType in('N') AND G.State='100' AND G.IsDisplay='T' AND G.uid in(select goodsUid from T_goods_category where cateCode 
    in(select cateCode from Fngetcatechild('flda', ${cate} , 0) )) AND DA.addr_code = ${adcode}`

        if (result.recordset) {

            let cut = 10;
            let total = parseInt(result.recordset[0]['TotalCnt']);
            let total_page = parseInt(total / cut);
            let listSize;

            if (page < total_page) {
                listSize = cut;
            } else {
                listSize = parseInt(total - (parseInt(page - 1) * cut))
                if (listSize < 0)
                    listSize = 0;
            }

            let start = parseInt(page * cut);

            switch (listsort) {
                case "high":
                    var result1 = await mssql.query`SELECT * FROM (SELECT TOP (${total}) * FROM (SELECT TOP (${total}) G.Uid, (${cate}) as CateCode  , (SELECT COUNT(uid) AS userCnt FROM T_GOODS_OPINION(NOLOCK) 
                WHERE SiteID = 'flda' AND GoodsUid = G.Uid) AS userCnt ,    (SELECT sum(ParPoint)/COUNT(Uid) as avgPoint FROM T_GOODS_OPINION(NOLOCK) 
                where SiteID = 'flda' and GoodsUid = G.Uid) AS avgPoint, ( SELECT COUNT(*) FROM T_ORDER_PHOTO WHERE goodsuid=G.uid) AS photoCnt, (SELECT count(uid) AS dealer_flag FROM T_DEALER_LIKE_LIST(nolock) 
                WHERE dealerID = G.dealerID and userID = ${userid}   and siteID = 'flda') AS like_check,  G.DealerID, G.Title, G.ImgS, G.Price, G.Cmoney, G.OptionKind, G.Stock, G.ReadCnt, G.OpinionRate, G.IsSoldOut, 0 
                AS ChkCoupon, G.DeliveryPolicy, G.DeliveryMethod, G.DeliveryFee, G.DeliveryLimit, G.mIsIconA, G.mIsIconB, G.mIsIconC, G.mIsIconD, G.mIsIconE, G.mIsIconF, 0 AS EventDiscountPrice, G.Sort
                , G.subtitle,G.staffprice,G.marketprice, '' as player, G.branduid, 0 as P_IDX, G.GoodsCode,brandName,brandname_en,IsUnit,Model_Name,imgMainMobile, G.StockImminent, OrderCnt_Admin , G.Md_score
                , G.IsBenifit, G.Reward ,G.IsClosing ,G.IsMaxBuy,G.SaleCnt, 9999999 AS Distance FROM V_GOODS AS G LEFT JOIN T_DELIVERY_ADDR AS DA ON G.DealerID = DA.dealerID 
                LEFT OUTER JOIN (select uid,name as brandName,name_en as brandname_en from t_brand(NOLOCK) where isHidden='F') TB ON TB.uid=G.brandUid WHERE G.SiteID='flda' AND G.GoodsType in('N') 
                AND G.State='100' AND G.IsDisplay='T' AND G.uid in(select goodsUid from T_goods_category where cateCode in(select cateCode from Fngetcatechild('flda',  (${cate}), 0) )) 
                AND DA.addr_code =  ${adcode}  ORDER BY   price asc  , G.Sort DESC) AS T1 ORDER BY   price desc   , Sort ASC) AS T2 ORDER BY  price desc`;
                return res.send(result1);

                case "ASC":
                    var result1 = await mssql.query`SELECT * FROM (SELECT TOP (${total}) * FROM (SELECT TOP (${total}) G.Uid, (${cate}) as CateCode  , (SELECT COUNT(uid) AS userCnt FROM T_GOODS_OPINION(NOLOCK) 
                WHERE SiteID = 'flda' AND GoodsUid = G.Uid) AS userCnt ,    (SELECT sum(ParPoint)/COUNT(Uid) as avgPoint FROM T_GOODS_OPINION(NOLOCK) where SiteID = 'flda' and GoodsUid = G.Uid) 
                AS avgPoint, ( SELECT COUNT(*) FROM T_ORDER_PHOTO WHERE goodsuid=G.uid) AS photoCnt, (SELECT count(uid) AS dealer_flag FROM T_DEALER_LIKE_LIST(nolock) 
                WHERE dealerID = G.dealerID and userID = ${userid}   and siteID = 'flda') AS like_check,  G.DealerID, G.Title, G.ImgS, G.Price, G.Cmoney, G.OptionKind, G.Stock, G.ReadCnt, G.OpinionRate,
                 G.IsSoldOut, 0 AS ChkCoupon, G.DeliveryPolicy, G.DeliveryMethod, G.DeliveryFee, G.DeliveryLimit, G.mIsIconA, G.mIsIconB, G.mIsIconC, G.mIsIconD, G.mIsIconE, G.mIsIconF, 0 
                 AS EventDiscountPrice, G.Sort, G.subtitle,G.staffprice,G.marketprice, '' as player, G.branduid, 0 as P_IDX, G.GoodsCode,brandName,brandname_en,IsUnit,Model_Name,imgMainMobile, G.StockImminent,
                  OrderCnt_Admin , G.Md_score, G.IsBenifit, G.Reward ,G.IsClosing ,G.IsMaxBuy,G.SaleCnt, 9999999 AS Distance FROM V_GOODS AS G LEFT JOIN T_DELIVERY_ADDR AS DA ON G.DealerID = DA.dealerID 
                  LEFT OUTER JOIN (select uid,name as brandName,name_en as brandname_en from t_brand(NOLOCK) where isHidden='F') TB ON TB.uid=G.brandUid WHERE G.SiteID='flda' AND G.GoodsType in('N') AND G.State='100' 
                  AND G.IsDisplay='T' AND G.uid in(select goodsUid from T_goods_category where cateCode in(select cateCode from Fngetcatechild('flda',  (${cate}), 0) )) AND DA.addr_code =  ${adcode}  
                  ORDER BY   G.Price ASC, G.Sort DESC ) AS T1 ORDER BY Price DESC, Sort ASC ) AS T2 ORDER BY  price ASC , Sort DESC`;

                return res.send(result1);

                case "fav":
                    var result1 = await mssql.query`SELECT * FROM (SELECT TOP (${total}) * FROM (SELECT TOP (${total}) G.Uid, (${cate}) as CateCode  , (SELECT COUNT(uid) AS userCnt FROM T_GOODS_OPINION(NOLOCK) 
                WHERE SiteID = 'flda' AND GoodsUid = G.Uid) AS userCnt ,    (SELECT sum(ParPoint)/COUNT(Uid) as avgPoint FROM T_GOODS_OPINION(NOLOCK) where SiteID = 'flda' and GoodsUid = G.Uid) 
                AS avgPoint, ( SELECT COUNT(*) FROM T_ORDER_PHOTO WHERE goodsuid=G.uid) AS photoCnt, (SELECT count(uid) AS dealer_flag FROM T_DEALER_LIKE_LIST(nolock) 
                WHERE dealerID = G.dealerID and userID = ${userid}   and siteID = 'flda') AS like_check,  G.DealerID, G.Title, G.ImgS, G.Price, G.Cmoney, G.OptionKind, G.Stock, G.ReadCnt, G.OpinionRate,
                 G.IsSoldOut, 0 AS ChkCoupon, G.DeliveryPolicy, G.DeliveryMethod, G.DeliveryFee, G.DeliveryLimit, G.mIsIconA, G.mIsIconB, G.mIsIconC, G.mIsIconD, G.mIsIconE, G.mIsIconF, 0 
                 AS EventDiscountPrice, G.Sort, G.subtitle,G.staffprice,G.marketprice, '' as player, G.branduid, 0 as P_IDX, G.GoodsCode,brandName,brandname_en,IsUnit,Model_Name,imgMainMobile, G.StockImminent,
                  OrderCnt_Admin , G.Md_score, G.IsBenifit, G.Reward ,G.IsClosing ,G.IsMaxBuy,G.SaleCnt, 9999999 AS Distance FROM V_GOODS AS G LEFT JOIN T_DELIVERY_ADDR AS DA ON G.DealerID = DA.dealerID 
                  LEFT OUTER JOIN (select uid,name as brandName,name_en as brandname_en from t_brand(NOLOCK) where isHidden='F') TB ON TB.uid=G.brandUid WHERE G.SiteID='flda' AND G.GoodsType in('N') AND G.State='100' 
                  AND G.IsDisplay='T' AND G.uid in(select goodsUid from T_goods_category where cateCode in(select cateCode from Fngetcatechild('flda',  (${cate}), 0) )) AND DA.addr_code =  ${adcode}  
                  ORDER BY  ReadCnt DESC  , G.Sort DESC) AS T1 ORDER BY   ReadCnt DESC  , Sort ASC) AS T2 ORDER BY ReadCnt DESC`;
                return res.send(result1);

                case "like":
                    var result1 = await mssql.query`SELECT * FROM (SELECT TOP (${total}) * FROM (SELECT TOP (${total}) G.Uid, (${cate}) as CateCode  , (SELECT COUNT(uid) AS userCnt FROM T_GOODS_OPINION(NOLOCK) 
                WHERE SiteID = 'flda' AND GoodsUid = G.Uid) AS userCnt ,    (SELECT sum(ParPoint)/COUNT(Uid) as avgPoint FROM T_GOODS_OPINION(NOLOCK) where SiteID = 'flda' and GoodsUid = G.Uid) 
                AS avgPoint, ( SELECT COUNT(*) FROM T_ORDER_PHOTO WHERE goodsuid=G.uid) AS photoCnt, (SELECT count(uid) AS dealer_flag FROM T_DEALER_LIKE_LIST(nolock) 
                WHERE dealerID = G.dealerID and userID = ${userid}   and siteID = 'flda') AS like_check,  G.DealerID, G.Title, G.ImgS, G.Price, G.Cmoney, G.OptionKind, G.Stock, G.ReadCnt, G.OpinionRate,
                 G.IsSoldOut, 0 AS ChkCoupon, G.DeliveryPolicy, G.DeliveryMethod, G.DeliveryFee, G.DeliveryLimit, G.mIsIconA, G.mIsIconB, G.mIsIconC, G.mIsIconD, G.mIsIconE, G.mIsIconF, 0 
                 AS EventDiscountPrice, G.Sort, G.subtitle,G.staffprice,G.marketprice, '' as player, G.branduid, 0 as P_IDX, G.GoodsCode,brandName,brandname_en,IsUnit,Model_Name,imgMainMobile, G.StockImminent,
                  OrderCnt_Admin , G.Md_score, G.IsBenifit, G.Reward ,G.IsClosing ,G.IsMaxBuy,G.SaleCnt, 9999999 AS Distance FROM V_GOODS AS G LEFT JOIN T_DELIVERY_ADDR AS DA ON G.DealerID = DA.dealerID 
                  LEFT OUTER JOIN (select uid,name as brandName,name_en as brandname_en from t_brand(NOLOCK) where isHidden='F') TB ON TB.uid=G.brandUid WHERE G.SiteID='flda' AND G.GoodsType in('N') AND G.State='100' 
                  AND G.IsDisplay='T' AND G.uid in(select goodsUid from T_goods_category where cateCode in(select cateCode from Fngetcatechild('flda',  (${cate}), 0) )) AND DA.addr_code =  ${adcode}  
                  AND G.DealerID IN (SELECT dealerID FROM T_DEALER_LIKE_LIST where userid=${userid})  ORDER BY G.ReadCnt DESC, G.Sort DESC ) AS T1 ORDER BY ReadCnt ASC, Sort ASC) AS T2 ORDER BY ReadCnt DESC, Sort DESC`;
                return res.send(result1);
            }
        }
    }
    catch (err) {
        console.log(err);
    }
})
router.get('/sun/sun/goods/detail/:guid', async (req, res) => {
	const userid = req.query.userid;
	const guid = req.params.guid;
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
        const result = await mssql.query`SELECT GoodsType, (select uid from t_mim_member where dealerid=G.DealerID) 
        AS uid , (SELECT CateCode     FROM T_GOODS_CATEGORY WHERE GoodsUid=${guid})  
        AS cate,  (select COUNT(*) from T_ORDER_PHOTO where goodsuid=G.Uid) AS photoCnt ,
        (select count(*) from T_GOODS_OPINION where goodsuid= G.Uid) AS reviewCnt, (SELECT count(*) 
        FROM T_ORDER_INFO WHERE goodsuid=G.uid AND state_OI in ('100','200','301','302')) AS orderCnt  ,
        (SELECT  sum(ParPoint)/COUNT(Uid) as avgPoint FROM T_GOODS_OPINION where GoodsUid = G.Uid )
        AS avgPoint ,  (SELECT count(uid) FROM T_DEALER_LIKE_LIST(nolock) 
        WHERE dealerID = G.DealerID and userID =  ${userid}  and siteID = 'flda') AS islike , 
        DealerID, GoodsCode, Title, SubTitle, ImgB, ImgM, ImgS, Price, OriginalPrice, MarketPrice,
        PriceSplit, CmsType, Margin, Cmoney, Stock, Product, PlaceOfOrigin, ContentFile,
        IsDelContentFile, DeliveryPolicy, DeliveryMethod, DeliveryFee, DeliveryLimit, OptionKind,
        OptionTxt, mIsIconA, mIsIconB, mIsIconC, mIsIconD, mIsIconE, mIsIconF, IsDisplay,
        IsSoldOut, State, OrgUid, Content, DeliveryContent,
        dbo.fnCheckEventDiscount(G.SiteID, G.Uid, GETDATE()) AS EventDiscountPrice, BrandUid,
        (SELECT Name FROM T_BRAND WHERE SiteID=G.SiteID AND Uid=G.BrandUid) AS Brand,
        (SELECT Name_EN FROM T_BRAND WHERE SiteID=G.SiteID AND Uid=G.BrandUid) AS Brand_EN,
        goodsInfoNotiContent,staffprice,PackType,PackEa ,nChkOpt_useFlag, nChkOpt_type,
        nChkOPt_count, nChkStock_type, nChkMultiOpt_useFlag, nChkMultiOpt_EA, nChkMultiOpt_Price,
        nChkTextOpt_useFlag, nChkAddGoods_useFlag ,spec, volume, volumeUnit, player, P_IDX ,
        isMemLevelPrice,IsUnit,minEa,buyUnit,EaType,Cat_id,Nv_mid,Model_Name,Tax_type,IsNotify,
        IsPlusOne,IsBenifit,Reward,OrderCnt_Admin,IsMaxBuy,MaxEa, officerPrice, foreign_goods, 
        goods_state, appDiscountPrice FROM V_GOODS AS G JOIN T_GOODS_CONTENT AS GC ON G.Uid=GC.Uid 
        LEFT OUTER JOIN ( SELECT goodsUid as WEGGoodsUid, siteID as WEGsiteID, P_IDX, eg_idx 
        FROM T_webpromotion_event_goods(nolock) ) as WEG ON WEGGoodsUid = G.Uid 
        AND WEG.P_IDX = ( SELECT top 1 p_IDX FROM T_webpromotion_event 
        WHERE SITEid = 'flda' AND convert(varchar(10), getdate(), 121) >= convert(varchar(10), 
        p_sdate, 121) and convert(varchar(10), getdate(), 121) <= convert(varchar(10), p_edate, 121) 
        AND isUse = 'T' ORDER BY p_regdate DESC ) WHERE G.SiteID='flda' AND G.Uid=${guid} 
        SELECT GoodsType, (select uid from t_mim_member where dealerid=G.DealerID) AS uid , 
        (select COUNT(*) from T_ORDER_PHOTO where goodsuid=G.Uid) AS photoCnt , (select count(*) 
        from T_GOODS_OPINION where goodsuid= G.Uid) AS reviewCnt, (SELECT count(*) FROM T_ORDER_INFO 
        WHERE goodsuid=G.uid AND state_OI in ('100','200','301','302')) AS orderCnt  , 
        (SELECT  sum(ParPoint)/COUNT(Uid) as avgPoint FROM T_GOODS_OPINION where GoodsUid = G.Uid ) 
        AS avgPoint ,  (SELECT count(uid) FROM T_DEALER_LIKE_LIST(nolock) WHERE dealerID = G.DealerID 
        and userID =  ${userid}  and siteID = 'flda') AS islike ,  DealerID, GoodsCode, Title, SubTitle, 
        ImgB, ImgM, ImgS, Price, OriginalPrice, MarketPrice, PriceSplit, CmsType, Margin, Cmoney, Stock, 
        Product, PlaceOfOrigin, ContentFile, IsDelContentFile, DeliveryPolicy, DeliveryMethod, 
        DeliveryFee, DeliveryLimit, OptionKind, OptionTxt, mIsIconA, mIsIconB, mIsIconC, mIsIconD, 
        mIsIconE, mIsIconF, IsDisplay, IsSoldOut, State, OrgUid, Content, DeliveryContent, 
        dbo.fnCheckEventDiscount(G.SiteID, G.Uid, GETDATE()) AS EventDiscountPrice, BrandUid, 
        (SELECT Name FROM T_BRAND WHERE SiteID=G.SiteID AND Uid=G.BrandUid) AS Brand,
        (SELECT Name_EN FROM T_BRAND WHERE SiteID=G.SiteID AND Uid=G.BrandUid) AS Brand_EN, 
        goodsInfoNotiContent,staffprice,PackType,PackEa ,nChkOpt_useFlag, nChkOpt_type, nChkOPt_count, 
        nChkStock_type, nChkMultiOpt_useFlag, nChkMultiOpt_EA, nChkMultiOpt_Price, nChkTextOpt_useFlag, 
        nChkAddGoods_useFlag ,spec, volume, volumeUnit, player, P_IDX ,isMemLevelPrice,IsUnit,minEa,
        buyUnit,EaType,Cat_id,Nv_mid,Model_Name,Tax_type,IsNotify,IsPlusOne,IsBenifit,Reward,
        OrderCnt_Admin,IsMaxBuy,MaxEa, officerPrice, foreign_goods, goods_state, appDiscountPrice 
        FROM V_GOODS AS G JOIN T_GOODS_CONTENT AS GC ON G.Uid=GC.Uid LEFT OUTER JOIN 
        ( SELECT goodsUid as WEGGoodsUid, siteID as WEGsiteID, P_IDX, eg_idx 
        FROM T_webpromotion_event_goods(nolock) ) as WEG ON WEGGoodsUid = G.Uid 
        AND WEG.P_IDX = ( SELECT top 1 p_IDX FROM T_webpromotion_event WHERE SITEid = 'flda' 
        AND convert(varchar(10), getdate(), 121) >= convert(varchar(10), p_sdate, 121) 
        and convert(varchar(10), getdate(), 121) <= convert(varchar(10), p_edate, 121) 
        AND isUse = 'T' ORDER BY p_regdate DESC ) WHERE G.SiteID='flda' AND G.Uid= ${guid}`
        res.send(result);
    } catch (err) {
        console.log("err : " + err)
    }
});


router.get('/sun/sun/goods/trans_pic/:guid', async (req, res) => {
    const guid = req.params.guid;
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
	const result = await mssql.query`select O.ordName,TP.regdate,TP.Uid,TP.img,TP.OrderUid  FROM T_ORDER_INFO AS TI(nolock) inner join T_ORDER_PHOTO AS TP(nolock) ON TI.OrderUid=TP.OrderUid inner join T_ORDER AS O(nolock) ON O.Uid=TI.OrderUid WHERE TP.Uid in (select max(uid) From T_ORDER_PHOTO where GoodsUid=${guid} and OrderUid=ti.OrderUid)`
        res.send(result);
    } catch (err) {
        console.log("err : " + err)
    }
});

router.get('/sun/sun/goods/review/:guid', async (req, res) => {
    const guid = req.params.guid;
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
	const result = await mssql.query`SELECT Uid,UserID,Content,ParPoint, convert(varchar(10), RegDate , 121) AS RegDate from T_GOODS_OPINION(nolock) WHERE GoodsUid=${guid}`
        res.send(result);
    } catch (err) {
        console.log("err : " + err)
    }
});

router.post('/sun/sun/idCheck', controller.CheckId);

// router.post('/sun/sun/tt', upload.single('file'), controller.TestFormData);

// router.post('/sun/sun/upload', upload.array('file'),async (req,res)=>{
//     // const userid = req.body.userid; 
//     if(!req.files){
//         res.send('업로드된 파일이 없습니다.');
//     }
//     else {
//         const files = req.files[0];
//         const files2 = req.files[1];
//         console.log(files);
//         console.log(files2);
//         res.send({"filename":files.filename});
//     }
// })



router.post('/sun/sun/bizCheck',controller.CheckBizNo)
router.post('/sun/sun/emailCheck',controller.CheckEmail);

module.exports = router;