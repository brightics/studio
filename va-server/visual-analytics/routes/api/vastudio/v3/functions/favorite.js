const router = __REQ_express.Router();

const listFunctionFavorite = async function (req, res) {
  __BRTC_DAO.function.favorite.select({}, function (err) {
    __BRTC_ERROR_HANDLER.sendServerError(res, err);
  }, function (result) {
    res.json(result);
  });
};


const updateFunctionFavorite = async function (req, res) {
  const {functions} = req.body
  try {
    await __BRTC_DAO.function.favorite.deleteAll();
    if(Array.isArray(functions) && functions.length > 0) {
      await __BRTC_DAO.function.favorite.create({ids: functions});
    }
    res.status(200).send();
  }catch (err){
    __BRTC_ERROR_HANDLER.sendServerError(res, err);
  }
};


router.get('/functions/favorite', listFunctionFavorite);
router.put('/functions/favorite', updateFunctionFavorite);

module.exports = router;