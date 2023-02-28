const express = require('express')
const router = express.Router()

const { getAllGigs,
    getGig,
    createGig,
    updateGig,
    deleteGig } = require('../controllers/gigs')

    router.route('/gig').post(createGig).get(getAllGigs)
    router.route('/gig/:id').get(getGig).delete(deleteGig).patch(updateGig)

    module.exports = router