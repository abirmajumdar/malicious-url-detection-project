const express = require('express')
const {showUrlSearch,showAllUrlSearches} = require('../controllers/showUrlSearch')
const deleteUrlSearch = require('../controllers/deleteUrlSearch')
const router = express.Router()

router.post('/showurl',showUrlSearch)
router.get('/getallurlresult',showAllUrlSearches)
router.delete('/delete',deleteUrlSearch)

module.exports = router