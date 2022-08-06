const router = __REQ_express.Router();

const listFunctionFavorite = function (req, res) {
  __BRTC_DAO.function.favorite.select({}, function (err) {
    __BRTC_ERROR_HANDLER.sendServerError(res, err);
  }, function (result) {
    res.json(result);
  });
};

const createFunctionFavrite = function (req, res) {
  __BRTC_DAO.function.favorite.has(req.params, function (err) {
    __BRTC_ERROR_HANDLER.sendServerError(res, err);
  }, function (result) {
    if(result[0]['COUNT(*)'] === 0) {
      __BRTC_DAO.function.favorite.create(req.params, function (err) {
        __BRTC_ERROR_HANDLER.sendServerError(res, err);
      }, function (result) {
        res.json(result);
      });
    }
    else {
      res.status(200).send();
    }
  });
};

const deleteFunctionFavrite = function (req, res) {
  __BRTC_DAO.function.favorite.delete(req.params, function (err) {
    __BRTC_ERROR_HANDLER.sendServerError(res, err);
  }, function (result) {
    res.json(result);
  });
};


router.get('/functions/favorite', listFunctionFavorite);
router.get('/functions/favorite/:id/create', createFunctionFavrite);
router.get('/functions/favorite/:id/delete', deleteFunctionFavrite);

module.exports = router;