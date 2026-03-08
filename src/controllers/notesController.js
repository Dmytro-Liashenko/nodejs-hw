import createHttpError from "http-errors";
import { Note } from "../models/note.js";


export const getAllNotes = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, tag, search } = req.query;

    const skip = (Number(page) - 1) * Number(perPage);

    const query = Note.find();

    if (tag) query.where("tag").equals(tag);
    if (search) query.where({ $text: { $search: search } });

    const totalNotes = await Note.countDocuments(query.getFilter());
    const notes = await query.skip(skip).limit(Number(perPage));

    res.status(200).json({
      page: Number(page),
      perPage: Number(perPage),
      totalNotes,
      totalPages: Math.ceil(totalNotes / Number(perPage)),
      notes,
    });
  } catch (error) {
    next(error);
  }
};

export const getNoteById  = async (req, res, next) => {
  try{

    const {noteId} = req.params;
    const note = await Note.findById(noteId);

    if(!note){
      throw createHttpError(404, 'Note not found');

    }

    res.status(200).json((note));
  } catch (error) {
    next(error);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const note = await Note.create(req.body);
    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try{
    const {noteId} = req.params;
    const note = await Note.findOneAndDelete({_id: noteId});
    if(!note){
      throw createHttpError(404, "Note not found");

    }

    res.status(200).json(note);

  } catch (error){
    next(error);
  }

};

export const updateNote = async (req, res, next) => {
    try{
    const {noteId} = req.params;
    const note = await Note.findOneAndUpdate(
    {_id: noteId},
    req.body,
    { new: true },
    );

    if(!note){
      throw createHttpError(404, "Note not found");

    }
    res.status(200).json(note);
  } catch (error){
      next(error);
    }
};
