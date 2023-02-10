const Song = require('../models/Song')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError,NotFoundError} = require('../errors')

const getAllSongs = async (req,res) =>{
    const songs = await Song.find({createdBy:req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({songs, count:songs.length})
}

const getSong = async (req,res) =>{
    const {user:{userId}, params:{id:songId}} = req
    const song = await Song.findOne({_id:songId, createdBy:userId})
    if(!song) throw new NotFoundError(`No song with id ${songId}`)
    res.status(StatusCodes.OK).json({song}) 
}

const createSong = async (req,res) =>{
    req.body.createdBy = req.user.userId
    const song = await Song.create(req.body)
    res.status(StatusCodes.CREATED).json({song})
}

const updateSong = async (req,res) =>{
    const {body:{songName, key},user:{userId}, params:{id:songId}} = req
    if(!songName || !key) throw new BadRequestError ('Name and key fields cannot be empty')
    const song = await Song.findOneAndUpdate({_id:songId, createdBy:userId}, req.body,{new:true,runValidators:true})
    if(!song) throw new NotFoundError(`No song with id ${songId}`)
    res.status(StatusCodes.OK).json({song}) 
}

const deleteSong = async (req,res) =>{
    const {user:{userId}, params:{id:songId}} = req
    const song = await Song.findOneAndRemove({_id:songId, createdBy:userId})
    if(!song) throw new NotFoundError(`No song with id ${songId}`)
    res.status(StatusCodes.OK).json({msg:`${song.songName} song with id ${songId} deleted`}) 
}

module.exports = {
    getAllSongs,
    getSong,
    createSong,
    updateSong,
    deleteSong
}