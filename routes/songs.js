const express = require('express')
const router = express.Router()

const { getAllSongs,
    getSong,
    createSong,
    updateSong,
    deleteSong } = require('../controllers/songs')

router.route('/song').post(createSong).get(getAllSongs)
router.route('/song/:id').get(getSong).delete(deleteSong).patch(updateSong)

module.exports = router

