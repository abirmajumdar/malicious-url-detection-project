const express = require('express')
const router = express.Router()

const deleteUrlSearch = require('../controllers/deleteUrlSearch')

router.delete('/delete',deleteUrlSearch)

module.exports = router